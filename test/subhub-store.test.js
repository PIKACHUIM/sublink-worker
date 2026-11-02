import { describe, expect, it } from 'vitest';
import { MemoryKVAdapter } from '../src/adapters/kv/memoryKv.js';
import {
    SubhubStore,
    hashUsername,
    sessionKey,
    sessionUserIndexKey,
    sortSubscriptions,
    subscriptionKey
} from '../src/adapters/kv/subhubStore.js';

async function seedStore() {
    const kv = new MemoryKVAdapter();
    await kv.put(subscriptionKey('alpha'), JSON.stringify({
        subscription: { id: 2, name: 'Alpha', path: 'alpha', sub_order: 1, updated_at: 100, converter_backend: 'sub.xeton.dev' },
        nodes: [
            { id: 5, subscription_id: 2, name: 'B', original_link: 'vmess://b', node_order: 20, enabled: 1 },
            { id: 4, subscription_id: 2, name: 'A', original_link: 'ss://a', node_order: 10, enabled: null },
            { id: 6, subscription_id: 2, name: 'C', original_link: 'trojan://c', node_order: 30, enabled: 0 }
        ]
    }));
    await kv.put(subscriptionKey('beta'), JSON.stringify({
        subscription: { id: 1, name: 'Beta', path: 'beta', sub_order: 0, updated_at: null, converter_backend: 'sub.xeton.dev' },
        nodes: []
    }));
    await kv.put('subhub:v1:index:subscriptions', JSON.stringify(['alpha', 'beta']));

    const usernameHash = await hashUsername('admin');
    await kv.put(sessionKey('s-valid'), JSON.stringify({ session_id: 's-valid', username: 'admin', expires_at: Date.now() + 60_000 }));
    await kv.put(sessionKey('s-expired'), JSON.stringify({ session_id: 's-expired', username: 'admin', expires_at: Date.now() - 1 }));
    await kv.put(sessionUserIndexKey(usernameHash), JSON.stringify(['s-valid', 's-expired']));

    return { kv, store: new SubhubStore(kv) };
}

describe('SubhubStore', () => {
    it('reads the published snapshot metadata', async () => {
        const { kv, store } = await seedStore();
        await kv.put('subhub:v1:meta', JSON.stringify({ version: 1, counts: { subscriptions: 2, nodes: 3, sessions: 2 } }));

        expect((await store.getMeta()).counts).toEqual({ subscriptions: 2, nodes: 3, sessions: 2 });
    });

    it('lists subscriptions in COALESCE(sub_order, id) order with node counts', async () => {
        const { store } = await seedStore();

        expect(await store.listSubscriptions()).toEqual([
            { id: 1, name: 'Beta', path: 'beta', sub_order: 0, updated_at: null, converter_backend: 'sub.xeton.dev', nodeCount: 0 },
            { id: 2, name: 'Alpha', path: 'alpha', sub_order: 1, updated_at: 100, converter_backend: 'sub.xeton.dev', nodeCount: 3 }
        ]);
    });

    it('returns nodes sorted by node_order with enabled defaulting to 1', async () => {
        const { store } = await seedStore();
        const nodes = await store.listNodes('alpha');

        expect(nodes.map((node) => node.id)).toEqual([4, 5, 6]);
        expect(nodes[0].enabled).toBe(1);
        expect(nodes[2].enabled).toBe(0);
    });

    it('builds subscription content from enabled nodes only', async () => {
        const { store } = await seedStore();

        expect(await store.getSubscriptionContent('alpha')).toBe('ss://a\nvmess://b');
        expect(await store.getSubscriptionContent('missing')).toBe('');
    });

    it('rejects expired sessions and exposes the user session index', async () => {
        const { store } = await seedStore();

        expect(await store.getSession('s-valid')).toMatchObject({ session_id: 's-valid' });
        expect(await store.getSession('s-expired')).toBeNull();
        expect(await store.getSession('missing')).toBeNull();
        expect(await store.listSessionIdsForUser('admin')).toEqual(['s-valid', 's-expired']);
    });

    it('returns null for a missing subscription and throws on corrupt JSON', async () => {
        const kv = new MemoryKVAdapter();
        await kv.put(subscriptionKey('broken'), 'not-json');
        const store = new SubhubStore(kv);

        expect(await store.getSubscription('absent')).toBeNull();
        expect(await store.listNodes('absent')).toBeNull();
        await expect(store.getSubscription('broken')).rejects.toThrow(/not valid JSON/);
    });
});

describe('Subhub sorting helpers', () => {
    it('keeps stable ordering for duplicate sort values', () => {
        const subscriptions = sortSubscriptions([{ id: 3, sub_order: 0 }, { id: 1, sub_order: 0 }]);
        expect(subscriptions.map((item) => item.id)).toEqual([3, 1]);
    });
});
