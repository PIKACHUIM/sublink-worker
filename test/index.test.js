import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app/createApp.jsx';
import { MemoryKVAdapter } from '../src/adapters/kv/memoryKv.js';

const runtime = {
    kv: new MemoryKVAdapter(),
    assetFetcher: null,
    logger: console,
    config: {
        configTtlSeconds: 60,
        shortLinkTtlSeconds: null
    }
};

const app = createApp(runtime);

describe('Worker', () => {
    it('responds with HTML on root path', async () => {
        const res = await app.request('http://example.com/');
        expect(res.status).toBe(200);
        expect(res.headers.get('content-type')).toContain('text/html');
        const text = await res.text();
        expect(text).toContain('<!DOCTYPE html>');
    });

    it('renders the landing page on root path instead of the converter form', async () => {
        const res = await app.request('http://example.com/');
        const text = await res.text();
        expect(text).toContain('01 / PIPELINE');
        expect(text).toContain('href="/app"');
        expect(text).not.toContain('x-data="formData()"');
    });

    it('serves the converter at /app', async () => {
        const res = await app.request('http://example.com/app');
        expect(res.status).toBe(200);
        expect(res.headers.get('content-type')).toContain('text/html');
        const text = await res.text();
        expect(text).toContain('x-data="formData()"');
    });

    it('renders a branded 404 page for unknown paths', async () => {
        const res = await app.request('http://example.com/unknown-path');
        expect(res.status).toBe(404);
        expect(res.headers.get('content-type')).toContain('text/html');
        const text = await res.text();
        expect(text).toContain('/unknown-path');
        expect(text).toContain('404');
    });

    it('keeps favicon requests out of the HTML 404 page', async () => {
        const res = await app.request('http://example.com/favicon.ico');
        expect(res.status).toBe(404);
        expect(await res.text()).toBe('');
    });
});
