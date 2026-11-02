const MAX_EDGE_KV_KEY_BYTES = 512;

export function encodeEdgeKVKey(key) {
    const bytes = new TextEncoder().encode(key);
    let encoded = 's_';

    for (const byte of bytes) {
        const char = String.fromCharCode(byte);
        if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || (char >= '0' && char <= '9')) {
            encoded += char;
        } else {
            encoded += `_${byte.toString(16).padStart(2, '0')}`;
        }
    }

    if (encoded.length > MAX_EDGE_KV_KEY_BYTES) {
        throw new RangeError(`Encoded Edge KV key exceeds ${MAX_EDGE_KV_KEY_BYTES} bytes`);
    }
    return encoded;
}
