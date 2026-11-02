const SUPPORTED_STORAGE_BACKENDS = new Set(['kv', 'edgeone-blob']);

export function resolveStorageBackend(env = {}) {
    const configured = typeof env.STORAGE_BACKEND === 'string' ? env.STORAGE_BACKEND.trim().toLowerCase() : '';
    const backend = configured || 'kv';
    if (!SUPPORTED_STORAGE_BACKENDS.has(backend)) {
        throw new Error(`Unsupported STORAGE_BACKEND "${backend}". Use "kv" or "edgeone-blob".`);
    }
    return backend;
}
