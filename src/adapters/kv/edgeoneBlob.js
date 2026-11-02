export class EdgeOneBlobAdapter {
    constructor(store) {
        if (!store || typeof store.get !== 'function' || typeof store.set !== 'function' || typeof store.delete !== 'function') {
            throw new Error('EdgeOne Blob adapter requires a Blob store');
        }
        this.store = store;
    }

    async get(key) {
        const value = await this.store.get(key, { type: 'text', consistency: 'strong' });
        return value ?? null;
    }

    async put(key, value) {
        await this.store.set(key, value);
    }

    async delete(key) {
        await this.store.delete(key);
    }
}
