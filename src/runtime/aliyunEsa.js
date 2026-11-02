import { AliyunEsaKVAdapter } from '../adapters/kv/aliyunEsaKv.js';
import { ExpiringKVAdapter } from '../adapters/kv/expiringKv.js';
import { resolveStorageBackend } from './storageBackend.js';

export function createAliyunEsaRuntime(env = {}, options = {}) {
    const storageBackend = resolveStorageBackend(env);
    if (storageBackend !== 'kv') {
        throw new Error('Aliyun ESA supports STORAGE_BACKEND="kv" only');
    }

    const namespace = env.SUBLINK_KV_NAMESPACE;
    if (!namespace) {
        throw new Error('Aliyun ESA KV storage requires SUBLINK_KV_NAMESPACE');
    }

    const EdgeKV = options.EdgeKV || globalThis.EdgeKV;
    const edgeKV = options.edgeKV || createEdgeKV(EdgeKV, namespace);

    return {
        kv: new ExpiringKVAdapter(new AliyunEsaKVAdapter(edgeKV)),
        assetFetcher: null,
        logger: console,
        config: {
            configTtlSeconds: parseNumber(env.CONFIG_TTL_SECONDS),
            shortLinkTtlSeconds: parseNumber(env.SHORT_LINK_TTL_SECONDS) || null
        }
    };
}

function createEdgeKV(EdgeKV, namespace) {
    if (typeof EdgeKV !== 'function') {
        throw new Error('Aliyun ESA EdgeKV runtime API is unavailable');
    }
    return new EdgeKV({ namespace });
}

function parseNumber(value) {
    if (value === undefined || value === null || value === '') return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}
