import { encodeEdgeKVKey } from './edgeKvKey.js';

export class EdgeOneKVAdapter {
    constructor(binding) {
        if (!binding || typeof binding.get !== 'function' || typeof binding.put !== 'function' || typeof binding.delete !== 'function') {
            throw new Error('EdgeOne KV adapter requires a bound KV namespace');
        }
        this.binding = binding;
    }

    async get(key) {
        const value = await this.binding.get(encodeEdgeKVKey(key), { type: 'text' });
        return value ?? null;
    }

    async put(key, value) {
        await this.binding.put(encodeEdgeKVKey(key), value);
    }

    async delete(key) {
        await this.binding.delete(encodeEdgeKVKey(key));
    }
}
