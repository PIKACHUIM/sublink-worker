const EXPIRATION_PREFIX = 'sublink-expiring-kv-v1:';

export class ExpiringKVAdapter {
    constructor(store) {
        if (!store || typeof store.get !== 'function' || typeof store.put !== 'function' || typeof store.delete !== 'function') {
            throw new Error('Expiring KV adapter requires a get/put/delete store');
        }
        this.store = store;
    }

    async get(key) {
        const stored = await this.store.get(key);
        if (stored === null || stored === undefined) return null;

        if (typeof stored !== 'string' || !stored.startsWith(EXPIRATION_PREFIX)) {
            return stored;
        }

        let entry;
        try {
            entry = JSON.parse(stored.slice(EXPIRATION_PREFIX.length));
        } catch {
            return stored;
        }

        if (!entry || typeof entry.value !== 'string') {
            return stored;
        }
        if (Number.isFinite(entry.expiresAt) && Date.now() >= entry.expiresAt) {
            return null;
        }
        return entry.value;
    }

    async put(key, value, options = {}) {
        const ttlSeconds = Number(options.expirationTtl);
        if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
            return this.store.put(key, value);
        }

        const stored = `${EXPIRATION_PREFIX}${JSON.stringify({
            expiresAt: Date.now() + ttlSeconds * 1000,
            value
        })}`;
        return this.store.put(key, stored);
    }

    async delete(key) {
        return this.store.delete(key);
    }
}
