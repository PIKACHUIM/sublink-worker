import { ClashConfigBuilder } from '../builders/ClashConfigBuilder.js';
import { SingboxConfigBuilder } from '../builders/SingboxConfigBuilder.js';
import { SurgeConfigBuilder } from '../builders/SurgeConfigBuilder.js';
import { decodeBase64, encodeBase64 } from '../utils.js';
import { renderLoginPage } from './loginTemplate.js';
import { renderAdminPanel } from './panelTemplate.js';
import {
    SubhubAdminStore,
    normalizeNodeInput,
    validateSubscriptionPath
} from './subhubStore.js';

const DEFAULT_USER_AGENT = 'curl/7.74.0';
const SUBSCRIPTION_FORMATS = new Set(['surge', 'v2ray', 'clash', 'singbox', 'xray']);

const CONVERTER_BACKENDS = [
    { id: 'sub.xeton.dev', name: 'sub.xeton.dev', label: 'subconverter作者提供-稳定' },
    { id: 'api.wcc.best', name: 'api.wcc.best', label: 'sub-web作者提供-稳定' },
    { id: 'sub.id9.cc', name: 'sub.id9.cc', label: '品云提供' },
    { id: 'api.v1.mk', name: 'api.v1.mk', label: '肥羊提供' },
    { id: 'api.nexconvert.com', name: 'api.nexconvert.com', label: '奶昔提供' },
    { id: 'api.dler.io', name: 'api.dler.io', label: 'lhie1提供' },
    { id: 'sub.maoxiongnet.com', name: 'sub.maoxiongnet.com', label: '猫熊提供' },
    { id: 'api.sublink.dev', name: 'api.sublink.dev', label: '歪兔提供' },
    { id: 'sub.xjz.im', name: 'sub.xjz.im', label: '920.im提供' }
];

function json(data, message = '操作成功', status = 200) {
    return new Response(JSON.stringify({ success: true, message, data }), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
}

function fail(message, status = 500) {
    return new Response(JSON.stringify({ success: false, message }), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
}

function readCookie(request, name) {
    const header = request.headers.get('Cookie') || '';
    const match = header.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
    return match ? match.slice(name.length + 1) : null;
}

function panelHeaders(extra = {}) {
    return { 'Content-Type': 'text/html; charset=utf-8', ...extra };
}

function normalizeNodes(rawNodes, now) {
    if (!Array.isArray(rawNodes)) return [];
    const normalized = [];
    for (let index = 0; index < rawNodes.length; index += 1) {
        const node = normalizeNodeInput(rawNodes[index], now + index);
        if (node) normalized.push(node);
    }
    return normalized;
}

async function readJson(request) {
    try {
        return await request.json();
    } catch {
        return {};
    }
}

async function buildConfigForFormat(links, format, request, runtime, lang) {
    const content = links.join('\n');
    if (!content) {
        return new Response('Not Found', { status: 404 });
    }

    const ua = request.headers.get('User-Agent') || DEFAULT_USER_AGENT;

    if (format === 'v2ray') {
        return new Response(encodeBase64(content), {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }

    try {
        if (format === 'clash') {
            const builder = new ClashConfigBuilder(content, undefined, undefined, undefined, lang, ua, false, false, undefined, undefined, true);
            await builder.build();
            return new Response(builder.formatConfig(), {
                status: 200,
                headers: { 'Content-Type': 'text/yaml; charset=utf-8' }
            });
        }
        if (format === 'surge') {
            const builder = new SurgeConfigBuilder(content, undefined, undefined, undefined, lang, ua, false, true);
            builder.setSubscriptionUrl(request.url);
            await builder.build();
            return new Response(builder.formatConfig(), {
                status: 200,
                headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
        }
        if (format === 'singbox') {
            const builder = new SingboxConfigBuilder(content, undefined, undefined, undefined, lang, ua, false, false, undefined, undefined, '1.12', true);
            await builder.build();
            return new Response(JSON.stringify(builder.config), {
                status: 200,
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            });
        }
    } catch (error) {
        runtime.logger.error('Subscription conversion failed', error);
        return new Response(`Conversion failed: ${error.message}`, { status: 400 });
    }

    // xray keeps the raw links, matching the standalone /xray endpoint.
    if (format === 'xray') {
        return new Response(decodeBase64(encodeBase64(content)), {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }

    return new Response('Not Found', { status: 404 });
}

export function createSubhubHandler(runtime) {
    return async function handleSubhubRequest(c) {
        const request = c.req.raw;
        const pathname = new URL(request.url).pathname;
        const method = request.method;
        const env = c.env || {};
        const adminPath = env.ADMIN_PATH || 'admin';
        const adminBase = `/${adminPath}`;
        const lang = c.get('lang') || 'zh-CN';

        const isAdminArea = pathname === adminBase || pathname.startsWith(`${adminBase}/`);
        const isSubscriptionArea = /^\/[a-z0-9-]{5,50}(\/(surge|v2ray|clash|singbox|xray))?$/.test(pathname);

        if (!isAdminArea && !isSubscriptionArea) return null;
        if (!runtime.kv) {
            return isAdminArea ? fail('存储未配置：未绑定 KV', 503) : null;
        }

        const store = new SubhubAdminStore(runtime.kv);

        // /admin itself matches the subscription path shape, so admin wins.
        if (!isAdminArea && isSubscriptionArea) {
            const [, path, format] = pathname.split('/');
            if (!validateSubscriptionPath(path)) return null;
            if (format && !SUBSCRIPTION_FORMATS.has(format)) return null;

            const links = await store.getEnabledLinks(path);
            // Unknown subscription: fall through so the site's HTML 404 page renders.
            if (!links) return null;
            if (!format) {
                return new Response(links.join('\n'), {
                    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                });
            }
            return buildConfigForFormat(links, format, request, runtime, lang);
        }

        const adminUsername = env.ADMIN_USERNAME;
        const adminPassword = env.ADMIN_PASSWORD;

        if (pathname === `${adminBase}/login`) {
            if (method === 'GET') {
                return new Response(renderLoginPage({ adminPath }), { headers: panelHeaders() });
            }
            if (method === 'POST') {
                const { username, password } = await readJson(request);
                if (!adminUsername || !adminPassword) {
                    return fail('未配置管理员账号，请设置 ADMIN_USERNAME 与 ADMIN_PASSWORD', 503);
                }
                if (!username || !password || username !== adminUsername || password !== adminPassword) {
                    return fail('用户名或密码错误', 401);
                }
                const sessionId = await store.createSession(username);
                return new Response(
                    JSON.stringify({ success: true, message: '登录成功', redirect: adminBase }),
                    {
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Set-Cookie': `session=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400; Secure`
                        }
                    }
                );
            }
        }

        if (pathname === `${adminBase}/logout`) {
            const sessionId = readCookie(request, 'session');
            if (sessionId) await store.destroySession(sessionId);
            return new Response(null, {
                status: 302,
                headers: {
                    Location: `${adminBase}/login`,
                    'Set-Cookie': 'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Secure'
                }
            });
        }

        const authorized = await store.verifySession(readCookie(request, 'session'));
        if (!authorized) {
            if (pathname === adminBase) {
                return new Response(null, { status: 302, headers: { Location: `${adminBase}/login` } });
            }
            return fail('未授权访问', 401);
        }

        if (pathname === adminBase) {
            return new Response(
                renderAdminPanel({
                    adminPath,
                    converterBackendsJson: JSON.stringify(CONVERTER_BACKENDS)
                }),
                { headers: panelHeaders() }
            );
        }

        const apiPrefix = `${adminBase}/api/`;
        if (!pathname.startsWith(apiPrefix)) {
            return new Response('Not Found', { status: 404 });
        }

        const segments = pathname.slice(apiPrefix.length).split('/').filter(Boolean);
        try {
            return await handleAdminApi({ store, segments, method, request });
        } catch (error) {
            runtime.logger.error('Admin API failed', error);
            return fail(error.message || '服务器内部错误');
        }
    };
}

async function handleAdminApi({ store, segments, method, request }) {
    if (segments[0] !== 'subscriptions') return fail('Not Found', 404);

    // /api/subscriptions
    if (segments.length === 1) {
        if (method === 'GET') {
            const state = await store.read();
            return json(store.listSubscriptions(state));
        }
        if (method === 'POST') {
            const { name, path } = await readJson(request);
            if (!name || !validateSubscriptionPath(path)) {
                return fail('无效的参数，或路径为保留字（clash/surge/singbox/xray/admin 等）', 400);
            }
            const created = await store.createSubscription(String(name), path);
            if (!created.ok) return fail('该路径已被使用', 400);
            return json(null, '订阅创建成功');
        }
        return fail('Method Not Allowed', 405);
    }

    // /api/subscriptions/reorder
    if (segments.length === 2 && segments[1] === 'reorder') {
        if (method !== 'POST') return fail('Method Not Allowed', 405);
        const { orders } = await readJson(request);
        if (!Array.isArray(orders) || orders.length === 0) return fail('无效的排序数据', 400);
        await store.reorderSubscriptions(orders);
        return json(null, '订阅顺序已更新');
    }

    const path = segments[1];

    if (segments.length === 2) {
        if (method === 'GET') {
            const subscription = await store.getSubscription(path);
            if (!subscription) return fail('订阅不存在', 404);
            return json(subscription);
        }
        if (method === 'PUT') {
            const data = await readJson(request);
            const name = String(data.name ?? '').trim();
            const newPath = String(data.path ?? '').trim();
            if (!name) return fail('订阅名称不能为空', 400);
            if (!validateSubscriptionPath(newPath)) {
                return fail('无效的订阅路径格式，或路径为保留字', 400);
            }
            const updated = await store.updateSubscriptionInfo(path, {
                name,
                path: newPath,
                converter_backend: data.converter_backend || 'sub.xeton.dev'
            });
            if (!updated.ok) {
                return updated.reason === 'duplicate' ? fail('该路径已被使用', 400) : fail('更新失败：找不到订阅', 404);
            }
            return json({
                id: updated.subscription.id,
                name: updated.subscription.name,
                path: updated.subscription.path,
                converter_backend: updated.subscription.converter_backend
            }, '订阅信息已更新');
        }
        if (method === 'DELETE') {
            await store.deleteSubscription(path);
            return json(null, '订阅已删除');
        }
        return fail('Method Not Allowed', 405);
    }

    // /api/subscriptions/:path/nodes...
    if (segments[2] !== 'nodes') return fail('Not Found', 404);
    const action = segments[3];

    if (!action) {
        if (method === 'GET') {
            const nodes = await store.listNodes(path);
            if (nodes === null) return fail('订阅不存在', 404);
            return json(nodes);
        }
        if (method === 'POST') {
            const data = await readJson(request);
            if (!data.content) return fail('缺少节点内容', 400);
            const normalized = normalizeNodeInput(data, Date.now());
            if (!normalized) return fail('不支持的节点格式', 400);
            const result = await store.appendNodes(path, [normalized]);
            if (!result.ok) return fail('订阅不存在', 404);
            return json(null, '节点创建成功');
        }
        return fail('Method Not Allowed', 405);
    }

    const now = Date.now();

    if (action === 'batch' && method === 'POST') {
        const { nodes } = await readJson(request);
        if (!Array.isArray(nodes) || nodes.length === 0) return fail('无效的节点数据', 400);
        const normalized = normalizeNodes(nodes, now);
        if (normalized.length === 0) return fail('没有有效的节点可以添加', 400);
        const result = await store.appendNodes(path, normalized);
        if (!result.ok) return fail('订阅不存在', 404);
        return json({ count: normalized.length }, `成功添加 ${normalized.length} 个节点`);
    }

    if (action === 'replace' && method === 'POST') {
        const { nodes } = await readJson(request);
        if (!Array.isArray(nodes) || nodes.length === 0) return fail('无效的节点数据', 400);
        const normalized = normalizeNodes(nodes, now);
        if (normalized.length === 0) return fail('没有有效的节点可以添加', 400);
        const result = await store.replaceNodes(path, normalized);
        if (!result.ok) return fail('订阅不存在', 404);
        return json({ count: normalized.length }, `成功替换为 ${normalized.length} 个节点`);
    }

    if (action === 'batch-delete' && method === 'POST') {
        const { nodeIds } = await readJson(request);
        if (!Array.isArray(nodeIds) || nodeIds.length === 0) return fail('无效的节点ID列表', 400);
        const result = await store.deleteNodes(path, nodeIds);
        if (!result.ok) return fail('订阅不存在', 404);
        return json({ count: result.removed }, '成功删除节点');
    }

    if (action === 'reorder' && method === 'POST') {
        const { orders } = await readJson(request);
        if (!Array.isArray(orders) || orders.length === 0) return fail('无效的排序数据', 400);
        const result = await store.reorderNodes(path, orders);
        if (!result.ok) return fail('订阅不存在', 404);
        return json(null, '节点顺序已更新');
    }

    const nodeId = action;
    if (method === 'PUT') {
        const data = await readJson(request);
        if (!data.content) return fail('缺少节点内容', 400);
        const result = await store.updateNode(path, nodeId, data.content);
        if (!result.ok) return fail(result.reason === 'node-missing' ? '节点不存在' : '订阅不存在', 404);
        return json(null, '节点更新成功');
    }

    if (method === 'PATCH') {
        const { enabled } = await readJson(request);
        if (typeof enabled !== 'boolean') return fail('无效的状态值', 400);
        const result = await store.setNodeEnabled(path, nodeId, enabled);
        if (!result.ok) return fail('节点不存在或更新失败', 404);
        return json(null, `节点已${enabled ? '启用' : '禁用'}`);
    }

    if (method === 'DELETE') {
        const result = await store.deleteNodes(path, [nodeId]);
        if (!result.ok) return fail('订阅不存在', 404);
        return json(null, '节点已删除');
    }

    return fail('Method Not Allowed', 405);
}
