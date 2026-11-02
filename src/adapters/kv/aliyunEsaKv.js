import { encodeEdgeKVKey } from './edgeKvKey.js';

const MAX_VALUE_BYTES = 1_800_000;

export class AliyunEsaKVAdapter {
    constructor(edgeKV) {
        if (!edgeKV || typeof edgeKV.get !== 'function' || typeof edgeKV.put !== 'function' || typeof edgeKV.delete !== 'function') {
            throw new Error('Aliyun ESA KV adapter requires an EdgeKV instance');
        }
        this.edgeKV = edgeKV;
    }

    async get(key) {
        const value = await this.edgeKV.get(encodeEdgeKVKey(key), { type: 'text' });
        return value ?? null;
    }

    async put(key, value) {
        const encodedKey = encodeEdgeKVKey(key);
        const encodedValue = new TextEncoder().encode(value);
        if (encodedValue.byteLength > MAX_VALUE_BYTES) {
            throw new RangeError(`Encoded ESA EdgeKV value exceeds ${MAX_VALUE_BYTES} bytes`);
        }
        await this.edgeKV.put(encodedKey, value);
    }

    async delete(key) {
        await this.edgeKV.delete(encodeEdgeKVKey(key));
    }
}
