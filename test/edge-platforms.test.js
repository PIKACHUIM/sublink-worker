import { describe, expect, it, vi } from 'vitest';
import { MemoryKVAdapter } from '../src/adapters/kv/memoryKv.js';
import { AliyunEsaKVAdapter } from '../src/adapters/kv/aliyunEsaKv.js';
import { EdgeOneBlobAdapter } from '../src/adapters/kv/edgeoneBlob.js';
import { EdgeOneKVAdapter } from '../src/adapters/kv/edgeoneKv.js';
import { ExpiringKVAdapter } from '../src/adapters/kv/expiringKv.js';
import { encodeEdgeKVKey } from '../src/adapters/kv/edgeKvKey.js';
import { createAliyunEsaRuntime } from '../src/runtime/aliyunEsa.js';
import { createCloudflareRuntime } from '../src/runtime/cloudflare.js';
import { createEdgeOneRuntime } from '../src/runtime/edgeone.js';
import { resolveStorageBackend } from '../src/runtime/storageBackend.js';
import { ConfigStorageService } from '../src/services/configStorageService.js';
import { ShortLinkService } from '../src/services/shortLinkService.js';
import { handleEdgeOneRequest } from '../src/platforms/edgeone.js';

function createKVBinding() {
    return {
        get: vi.fn(async () => null),
        put: vi.fn(async () => {}),
        delete: vi.fn(async () => {})
    };
}

describe('edge KV adapters', () => {
    it('encodes keys into the providers’ supported alphabet', () => {
        expect(encodeEdgeKVKey('short-code_1')).toBe('s_short_2dcode_5f1');
    });

    it('rejects encoded keys exceeding the provider limit', () => {
        expect(() => encodeEdgeKVKey('!'.repeat(171))).toThrow(/512 bytes/);
    });

    it('maps EdgeOne bindings to the shared KV contract', async () => {
        const binding = createKVBinding();
        binding.get.mockResolvedValue('value');
        const adapter = new EdgeOneKVAdapter(binding);

        expect(await adapter.get('a-b')).toBe('value');
        await adapter.put('a-b', 'value');
        await adapter.delete('a-b');
        expect(binding.get).toHaveBeenCalledWith('s_a_2db', { type: 'text' });
        expect(binding.put).toHaveBeenCalledWith('s_a_2db', 'value');
        expect(binding.delete).toHaveBeenCalledWith('s_a_2db');
    });

    it('rejects ESA EdgeKV values above the provider limit', async () => {
        const edgeKV = {
            get: vi.fn(async () => undefined),
            put: vi.fn(async () => {}),
            delete: vi.fn(async () => true)
        };
        const adapter = new AliyunEsaKVAdapter(edgeKV);

        await expect(adapter.put('key', 'a'.repeat(1_800_001))).rejects.toThrow(/1800000 bytes/);
        expect(edgeKV.put).not.toHaveBeenCalled();
    });

    it('maps ESA EdgeKV missing values to null', async () => {
        const edgeKV = {
            get: vi.fn(async () => undefined),
            put: vi.fn(async () => {}),
            delete: vi.fn(async () => true)
        };
        const adapter = new AliyunEsaKVAdapter(edgeKV);

        expect(await adapter.get('missing')).toBeNull();
        await adapter.put('key', 'value');
        await adapter.delete('key');
        expect(edgeKV.get).toHaveBeenCalledWith('s_missing', { type: 'text' });
        expect(edgeKV.put).toHaveBeenCalledWith('s_key', 'value');
        expect(edgeKV.delete).toHaveBeenCalledWith('s_key');
    });

    it('uses strongly consistent text reads for EdgeOne Blob', async () => {
        const store = {
            get: vi.fn(async () => 'value'),
            set: vi.fn(async () => {}),
            delete: vi.fn(async () => {})
        };
        const adapter = new EdgeOneBlobAdapter(store);

        expect(await adapter.get('key')).toBe('value');
        await adapter.put('key', 'value');
        await adapter.delete('key');
        expect(store.get).toHaveBeenCalledWith('key', { type: 'text', consistency: 'strong' });
        expect(store.set).toHaveBeenCalledWith('key', 'value');
        expect(store.delete).toHaveBeenCalledWith('key');
    });
});

describe('edge KV expiration wrapper', () => {
    it('preserves values, logically expires TTL data and does not delete stale reads', async () => {
        const data = new Map();
        const store = {
            get: vi.fn(async (key) => data.get(key) ?? null),
            put: vi.fn(async (key, value) => data.set(key, value)),
            delete: vi.fn(async (key) => data.delete(key))
        };
        const adapter = new ExpiringKVAdapter(store);
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));

        try {
            await adapter.put('config', '{"ok":true}', { expirationTtl: 2 });
            expect(await adapter.get('config')).toBe('{"ok":true}');
            vi.advanceTimersByTime(2000);
            expect(await adapter.get('config')).toBeNull();
            expect(store.delete).not.toHaveBeenCalled();
            expect(data.has('config')).toBe(true);
        } finally {
            vi.useRealTimers();
        }
    });

    it('preserves existing JSON objects that resemble the former marker', async () => {
        const value = '{"__sublink_expiring_kv_v1":true,"expiresAt":1,"value":"payload"}';
        const adapter = new ExpiringKVAdapter({
            get: vi.fn(async () => value),
            put: vi.fn(async () => {}),
            delete: vi.fn(async () => {})
        });

        expect(await adapter.get('key')).toBe(value);
    });

    it('leaves non-expiring values unchanged', async () => {
        const store = {
            get: vi.fn(async () => 'plain value'),
            put: vi.fn(async () => {}),
            delete: vi.fn(async () => {})
        };
        const adapter = new ExpiringKVAdapter(store);

        expect(await adapter.get('key')).toBe('plain value');
        await adapter.put('key', 'plain value');
        expect(store.put).toHaveBeenCalledWith('key', 'plain value');
    });
});

describe('EdgeOne route handler', () => {
    it('serves the application at the root route', async () => {
        const response = await handleEdgeOneRequest({
            request: new Request('https://edgeone.example/'),
            env: { SUBLINK_KV: createKVBinding() }
        });

        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('text/html');
        expect(await response.text()).toContain('Sublink Worker');
    });
});

describe('edge storage service integration', () => {
    it('roundtrips saved configs and short links through the expiration wrapper', async () => {
        const kv = new ExpiringKVAdapter(new MemoryKVAdapter());
        const configs = new ConfigStorageService(kv, { configTtlSeconds: 60 });
        const shortLinks = new ShortLinkService(kv);
        const config = { outbounds: [{ type: 'direct', tag: 'direct' }] };

        const configId = await configs.saveConfig('singbox', config);
        const shortCode = await shortLinks.createShortLink('?config=example', 'fixed-code');

        expect(await configs.getConfigById(configId)).toEqual(config);
        expect(await shortLinks.resolveShortCode(shortCode)).toBe('?config=example');
    });
});

describe('edge runtime storage selection', () => {
    it('defaults to KV and rejects unknown storage backends', () => {
        expect(resolveStorageBackend({})).toBe('kv');
        expect(resolveStorageBackend({ STORAGE_BACKEND: ' EDGEONE-BLOB ' })).toBe('edgeone-blob');
        expect(() => resolveStorageBackend({ STORAGE_BACKEND: 'unknown' })).toThrow(/Unsupported STORAGE_BACKEND/);
    });

    it('selects EdgeOne KV or Blob from environment configuration', async () => {
        const binding = createKVBinding();
        const kvRuntime = await createEdgeOneRuntime({ SUBLINK_KV: binding });
        expect(kvRuntime.kv).toBeInstanceOf(ExpiringKVAdapter);

        const store = {
            get: vi.fn(async () => null),
            set: vi.fn(async () => {}),
            delete: vi.fn(async () => {})
        };
        const getStore = vi.fn(() => store);
        const blobRuntime = await createEdgeOneRuntime({
            STORAGE_BACKEND: 'edgeone-blob',
            EDGEONE_BLOB_STORE: 'custom-store'
        }, { getStore });
        expect(blobRuntime.kv).toBeInstanceOf(ExpiringKVAdapter);
        expect(getStore).toHaveBeenCalledWith({ name: 'custom-store', consistency: 'strong' });
    });

    it('selects Aliyun EdgeKV and rejects EdgeOne Blob on unsupported platforms', () => {
        const edgeKV = {
            get: vi.fn(async () => null),
            put: vi.fn(async () => {}),
            delete: vi.fn(async () => true)
        };
        const runtime = createAliyunEsaRuntime({ SUBLINK_KV_NAMESPACE: 'sublink' }, { edgeKV });
        expect(runtime.kv).toBeInstanceOf(ExpiringKVAdapter);
        expect(() => createAliyunEsaRuntime({
            STORAGE_BACKEND: 'edgeone-blob',
            SUBLINK_KV_NAMESPACE: 'sublink'
        }, { edgeKV })).toThrow(/supports STORAGE_BACKEND="kv" only/);
        expect(() => createAliyunEsaRuntime({}, { edgeKV })).toThrow(/SUBLINK_KV_NAMESPACE/);
    });

    it('keeps Cloudflare KV as the only supported Cloudflare backend', () => {
        expect(() => createCloudflareRuntime({ STORAGE_BACKEND: 'edgeone-blob' })).toThrow(/supports STORAGE_BACKEND="kv" only/);
        expect(createCloudflareRuntime({}).kv).toBeNull();
    });
});
