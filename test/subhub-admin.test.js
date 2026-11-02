import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app/createApp.jsx';
import { MemoryKVAdapter } from '../src/adapters/kv/memoryKv.js';
import { ADMIN_STATE_KEY, validateSubscriptionPath } from '../src/admin/subhubStore.js';

const ADMIN = { ADMIN_USERNAME: 'pika', ADMIN_PASSWORD: 'secret', ADMIN_PATH: 'admin' };

function createTestApp(overrides = {}) {
    return createApp({
        kv: overrides.kv ?? new MemoryKVAdapter(),
        assetFetcher: null,
        logger: { log() {}, warn() {}, error() {} },
        config: { configTtlSeconds: 0, shortLinkTtlSeconds: null, ...(overrides.config || {}) },
        ...(overrides.bindings || {})
    });
}

const env = () => ({ ...ADMIN });

async function login(app) {
    const res = await app.request('http://localhost/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pika', password: 'secret' })
    }, env());
    const cookie = (res.headers.get('set-cookie') || '').split(';')[0];
    return { res, cookie };
}

describe('subhub admin routes', () => {
    it('blocks reserved subscription paths', () => {
        expect(validateSubscriptionPath('clash')).toBe(false);
        expect(validateSubscriptionPath('admin')).toBe(false);
        expect(validateSubscriptionPath('global')).toBe(true);
        expect(validateSubscriptionPath('ab')).toBe(false);
    });

    it('rejects login with wrong credentials', async () => {
        const app = createTestApp();
        const res = await app.request('http://localhost/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'pika', password: 'nope' })
        }, env());

        expect(res.status).toBe(401);
        expect(await res.json()).toMatchObject({ success: false });
    });

    it('creates a session and serves the admin panel', async () => {
        const app = createTestApp();
        const { res, cookie } = await login(app);

        expect(res.status).toBe(200);
        expect(cookie).toContain('session=');

        const panel = await app.request('http://localhost/admin', { headers: { Cookie: cookie } }, env());
        expect(panel.status).toBe(200);
        expect(await panel.text()).toContain('Sub-Hub');
    });

    it('protects the api without a session', async () => {
        const app = createTestApp();
        const res = await app.request('http://localhost/admin/api/subscriptions', {}, env());

        expect(res.status).toBe(401);
    });

    it('creates a subscription, adds nodes and serves them as subscription content', async () => {
        const app = createTestApp();
        const { cookie } = await login(app);

        const created = await app.request('http://localhost/admin/api/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            body: JSON.stringify({ name: '测试订阅', path: 'mysub' })
        }, env());
        expect(created.status).toBe(200);

        const added = await app.request('http://localhost/admin/api/subscriptions/mysub/nodes/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            body: JSON.stringify({
                nodes: [
                    { content: 'ss://YWVzLTEyOC1nY206cGFzcw@example.com:8388#节点A' },
                    { content: 'not-a-node' }
                ]
            })
        }, env());
        expect(added.status).toBe(200);
        expect(await added.json()).toMatchObject({ success: true, data: { count: 1 } });

        const list = await app.request('http://localhost/admin/api/subscriptions', { headers: { Cookie: cookie } }, env());
        expect(await list.json()).toMatchObject({
            data: [{ path: 'mysub', nodeCount: 1 }]
        });

        const content = await app.request('http://localhost/mysub', {}, env());
        expect(content.status).toBe(200);
        expect(await content.text()).toContain('ss://');
    });

    it('serves clash and base64 variants from stored nodes', async () => {
        const app = createTestApp();
        const { cookie } = await login(app);

        await app.request('http://localhost/admin/api/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            body: JSON.stringify({ name: '订阅', path: 'clashsub' })
        }, env());
        await app.request('http://localhost/admin/api/subscriptions/clashsub/nodes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Cookie: cookie },
            body: JSON.stringify({ content: 'ss://YWVzLTEyOC1nY206cGFzcw@example.com:8388#节点A' })
        }, env());

        const v2ray = await app.request('http://localhost/clashsub/v2ray', {}, env());
        expect(v2ray.status).toBe(200);
        expect((await v2ray.text()).length).toBeGreaterThan(0);

        const clash = await app.request('http://localhost/clashsub/clash', {}, env());
        expect(clash.status).toBe(200);
        expect(await clash.text()).toContain('proxies:');
    });

    it('keeps the converter routes working for the reserved names', async () => {
        const app = createTestApp();
        const res = await app.request('http://localhost/clash', {}, env());

        expect(res.status).toBe(400);
        expect(await res.text()).toContain('Missing config parameter');
    });

    it('links to the admin panel from the landing navbar', async () => {
        const app = createTestApp();
        const res = await app.request('http://localhost/', {}, env());
        const html = await res.text();

        expect(res.status).toBe(200);
        expect(html).toContain('href="/admin"');
    });

    it('reads data written by the D1 migration snapshot', async () => {
        const kv = new MemoryKVAdapter();
        await kv.put(ADMIN_STATE_KEY, JSON.stringify({
            schemaVersion: 1,
            seq: { subscriptions: 2, nodes: 9 },
            subscriptions: [{ id: 1, name: '科学上网', path: 'global', sub_order: 1, updated_at: 1, converter_backend: 'sub.xeton.dev' }],
            nodes: [{ id: 9, subscription_id: 1, name: 'A', original_link: 'ss://a', node_order: 1, enabled: 1 }],
            sessions: []
        }));
        const app = createTestApp({ kv });

        const content = await app.request('http://localhost/global', {}, env());
        expect(content.status).toBe(200);
        expect(await content.text()).toBe('ss://a');
    });
});
