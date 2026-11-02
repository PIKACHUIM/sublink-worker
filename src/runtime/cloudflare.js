import { CloudflareKVAdapter } from '../adapters/kv/cloudflareKv.js';
import { resolveStorageBackend } from './storageBackend.js';

export function createCloudflareRuntime(env = {}) {
    const storageBackend = resolveStorageBackend(env);
    if (storageBackend !== 'kv') {
        throw new Error('Cloudflare Workers supports STORAGE_BACKEND="kv" only');
    }

    return {
        kv: env.SUBLINK_KV ? new CloudflareKVAdapter(env.SUBLINK_KV) : null,
        assetFetcher: env.ASSETS ? (request) => env.ASSETS.fetch(request) : null,
        logger: console,
        config: {}
    };
}
