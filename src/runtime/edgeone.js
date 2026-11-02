import { EdgeOneBlobAdapter } from '../adapters/kv/edgeoneBlob.js';
import { EdgeOneKVAdapter } from '../adapters/kv/edgeoneKv.js';
import { ExpiringKVAdapter } from '../adapters/kv/expiringKv.js';
import { resolveStorageBackend } from './storageBackend.js';

export async function createEdgeOneRuntime(env = {}, options = {}) {
    const storageBackend = resolveStorageBackend(env);
    let kv;

    if (storageBackend === 'kv') {
        if (!env.SUBLINK_KV) {
            throw new Error('EdgeOne KV storage requires a bound SUBLINK_KV namespace');
        }
        kv = new ExpiringKVAdapter(new EdgeOneKVAdapter(env.SUBLINK_KV));
    } else {
        const storeName = env.EDGEONE_BLOB_STORE || 'sublink-worker';
        let store = options.blobStore;
        if (!store) {
            let getStore = options.getStore;
            if (!getStore) {
                ({ getStore } = await import('@edgeone/pages-blob'));
            }
            store = getStore({ name: storeName, consistency: 'strong' });
        }
        kv = new ExpiringKVAdapter(new EdgeOneBlobAdapter(store));
    }

    return {
        kv,
        assetFetcher: env.ASSETS ? (request) => env.ASSETS.fetch(request) : null,
        logger: console,
        config: {
            configTtlSeconds: parseNumber(env.CONFIG_TTL_SECONDS),
            shortLinkTtlSeconds: parseNumber(env.SHORT_LINK_TTL_SECONDS) || null
        }
    };
}

function parseNumber(value) {
    if (value === undefined || value === null || value === '') return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}
