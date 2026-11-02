import { decodeBase64 } from '../utils.js';

export const ADMIN_STATE_KEY = 'subhub:v1:db';

export const RESERVED_PATHS = new Set([
    'admin',
    'clash',
    'singbox',
    'surge',
    'xray',
    'resolve',
    'config',
    'shorten-v2',
    'favicon.ico',
    's',
    'b',
    'c',
    'x'
]);

const SUPPORTED_PREFIXES = [
    'ss://',
    'vmess://',
    'vless://',
    'trojan://',
    'socks://',
    'hysteria2://',
    'tuic://',
    'wireguard://'
];

export function validateSubscriptionPath(path) {
    return typeof path === 'string' && /^[a-z0-9-]{5,50}$/.test(path) && !RESERVED_PATHS.has(path);
}

export function isSupportedNodeLink(link) {
    const lower = String(link || '').toLowerCase();
    if (lower.includes('=') && lower.includes('snell,')) return true;
    return SUPPORTED_PREFIXES.some((prefix) => lower.startsWith(prefix));
}

function extractNameFromLink(link) {
    const hashIndex = link.indexOf('#');
    if (hashIndex >= 0) {
        try {
            const name = decodeURIComponent(link.slice(hashIndex + 1)).trim();
            if (name) return name;
        } catch {
            const fallback = link.slice(hashIndex + 1).trim();
            if (fallback) return fallback;
        }
    }
    if (link.toLowerCase().startsWith('vmess://')) {
        try {
            const parsed = JSON.parse(decodeBase64(link.slice(8)));
            if (parsed?.ps) return String(parsed.ps);
        } catch {
            // vmess payloads are often non-standard; fall through to the default name.
        }
    }
    const snellIndex = link.indexOf('snell,');
    if (snellIndex > 0) {
        const name = link.slice(0, link.indexOf('=')).trim();
        if (name) return name;
    }
    return '未命名节点';
}

export function normalizeNodeInput(rawNode, fallbackOrder) {
    const content = String(rawNode?.content ?? '').trim();
    if (!content) return null;

    let link = content;
    try {
        const decoded = decodeBase64(content);
        if (isSupportedNodeLink(decoded) && !isSupportedNodeLink(content)) {
            link = decoded.trim();
        }
    } catch {
        // Not base64; keep the original link.
    }

    if (!isSupportedNodeLink(link)) return null;

    const order = rawNode?.order !== undefined ? Number(rawNode.order) : fallbackOrder;
    return {
        content: link,
        name: rawNode?.name ? String(rawNode.name) : extractNameFromLink(link),
        order
    };
}

function emptyState() {
    return {
        schemaVersion: 1,
        seq: { subscriptions: 0, nodes: 0 },
        subscriptions: [],
        nodes: [],
        sessions: []
    };
}

function normalizeState(state) {
    const base = emptyState();
    const merged = { ...base, ...(state || {}) };
    merged.seq = { ...base.seq, ...(state?.seq || {}) };
    merged.subscriptions = Array.isArray(merged.subscriptions) ? merged.subscriptions : [];
    merged.nodes = Array.isArray(merged.nodes) ? merged.nodes : [];
    merged.sessions = Array.isArray(merged.sessions) ? merged.sessions : [];
    return merged;
}

export class SubhubAdminStore {
    constructor(kv, options = {}) {
        if (!kv) {
            throw new Error('Subscription admin store requires a KV binding');
        }
        this.kv = kv;
        this.stateKey = options.stateKey || ADMIN_STATE_KEY;
    }

    async read() {
        const stored = await this.kv.get(this.stateKey);
        if (!stored) return emptyState();
        try {
            return normalizeState(typeof stored === 'string' ? JSON.parse(stored) : stored);
        } catch {
            throw new Error('Stored subscription data is not valid JSON');
        }
    }

    async write(state) {
        await this.kv.put(this.stateKey, JSON.stringify(state));
        return state;
    }

    findSubscription(state, path) {
        return state.subscriptions.find((item) => item.path === path) || null;
    }

    nodesOf(state, subscriptionId) {
        return state.nodes
            .filter((node) => node.subscription_id === subscriptionId)
            .sort((left, right) => (left.node_order - right.node_order) || (left.id - right.id));
    }

    listSubscriptions(state) {
        return [...state.subscriptions]
            .sort((left, right) => {
                const leftKey = left.sub_order === null || left.sub_order === undefined ? left.id : left.sub_order;
                const rightKey = right.sub_order === null || right.sub_order === undefined ? right.id : right.sub_order;
                return leftKey - rightKey;
            })
            .map((subscription) => ({
                name: subscription.name,
                path: subscription.path,
                nodeCount: state.nodes.filter((node) => node.subscription_id === subscription.id).length,
                sub_order: subscription.sub_order || 0,
                updated_at: subscription.updated_at || null,
                converter_backend: subscription.converter_backend || 'sub.xeton.dev'
            }));
    }

    async getSubscription(path) {
        const state = await this.read();
        return this.findSubscription(state, path);
    }

    async listNodes(path) {
        const state = await this.read();
        const subscription = this.findSubscription(state, path);
        if (!subscription) return null;
        return this.nodesOf(state, subscription.id).map((node) => ({
            id: node.id,
            name: node.name,
            original_link: node.original_link,
            node_order: node.node_order,
            enabled: node.enabled === null || node.enabled === undefined ? 1 : node.enabled
        }));
    }

    async getEnabledLinks(path) {
        const state = await this.read();
        const subscription = this.findSubscription(state, path);
        if (!subscription) return null;
        return this.nodesOf(state, subscription.id)
            .filter((node) => node.enabled === null || node.enabled === undefined || node.enabled === 1)
            .map((node) => node.original_link);
    }

    async touch(state, subscriptionId, now) {
        const subscription = state.subscriptions.find((item) => item.id === subscriptionId);
        if (subscription) subscription.updated_at = now;
    }

    async createSubscription(name, path) {
        const state = await this.read();
        if (this.findSubscription(state, path)) {
            return { ok: false, reason: 'duplicate' };
        }
        const now = Date.now();
        const id = (state.seq.subscriptions += 1);
        state.subscriptions.push({
            id,
            name,
            path,
            sub_order: now,
            updated_at: now,
            converter_backend: 'sub.xeton.dev'
        });
        await this.write(state);
        return { ok: true, id };
    }

    async reorderSubscriptions(orders) {
        const state = await this.read();
        for (const { path, order } of orders) {
            const subscription = this.findSubscription(state, path);
            if (subscription) subscription.sub_order = Number(order);
        }
        await this.write(state);
    }

    async updateSubscriptionInfo(path, { name, path: newPath, converter_backend }) {
        const state = await this.read();
        const subscription = this.findSubscription(state, path);
        if (!subscription) return { ok: false, reason: 'missing' };
        if (newPath !== path && this.findSubscription(state, newPath)) {
            return { ok: false, reason: 'duplicate' };
        }
        subscription.name = name;
        subscription.path = newPath;
        subscription.converter_backend = converter_backend;
        await this.write(state);
        return { ok: true, subscription };
    }

    async deleteSubscription(path) {
        const state = await this.read();
        const subscription = this.findSubscription(state, path);
        if (!subscription) return { ok: true, removedNodes: 0 };
        const before = state.nodes.length;
        state.subscriptions = state.subscriptions.filter((item) => item.id !== subscription.id);
        state.nodes = state.nodes.filter((node) => node.subscription_id !== subscription.id);
        await this.write(state);
        return { ok: true, removedNodes: before - state.nodes.length };
    }

    async appendNodes(path, normalizedNodes) {
        const state = await this.read();
        const subscription = this.findSubscription(state, path);
        if (!subscription) return { ok: false, reason: 'missing' };
        const now = Date.now();
        for (const node of normalizedNodes) {
            const id = (state.seq.nodes += 1);
            state.nodes.push({
                id,
                subscription_id: subscription.id,
                name: node.name,
                original_link: node.content,
                node_order: Number.isFinite(node.order) ? node.order : now,
                enabled: 1
            });
        }
        subscription.updated_at = now;
        await this.write(state);
        return { ok: true, added: normalizedNodes.length };
    }

    async replaceNodes(path, normalizedNodes) {
        const state = await this.read();
        const subscription = this.findSubscription(state, path);
        if (!subscription) return { ok: false, reason: 'missing' };
        const now = Date.now();
        state.nodes = state.nodes.filter((node) => node.subscription_id !== subscription.id);
        for (const node of normalizedNodes) {
            const id = (state.seq.nodes += 1);
            state.nodes.push({
                id,
                subscription_id: subscription.id,
                name: node.name,
                original_link: node.content,
                node_order: Number.isFinite(node.order) ? node.order : now,
                enabled: 1
            });
        }
        subscription.updated_at = now;
        await this.write(state);
        return { ok: true, count: normalizedNodes.length };
    }

    async deleteNodes(path, nodeIds) {
        const state = await this.read();
        const subscription = this.findSubscription(state, path);
        if (!subscription) return { ok: false, reason: 'missing' };
        const ids = new Set(nodeIds.map(Number));
        const before = state.nodes.length;
        state.nodes = state.nodes.filter(
            (node) => !(ids.has(node.id) && node.subscription_id === subscription.id)
        );
        await this.touch(state, subscription.id, Date.now());
        await this.write(state);
        return { ok: true, removed: before - state.nodes.length };
    }

    async reorderNodes(path, orders) {
        const state = await this.read();
        const subscription = this.findSubscription(state, path);
        if (!subscription) return { ok: false, reason: 'missing' };
        for (const { id, order } of orders) {
            const node = state.nodes.find(
                (item) => item.id === Number(id) && item.subscription_id === subscription.id
            );
            if (node) node.node_order = Number(order);
        }
        await this.write(state);
        return { ok: true };
    }

    async updateNode(path, nodeId, rawContent) {
        const state = await this.read();
        const subscription = this.findSubscription(state, path);
        if (!subscription) return { ok: false, reason: 'missing' };
        const node = state.nodes.find(
            (item) => item.id === Number(nodeId) && item.subscription_id === subscription.id
        );
        if (!node) return { ok: false, reason: 'node-missing' };

        const normalized = normalizeNodeInput({ content: rawContent }, node.node_order);
        if (!normalized) return { ok: false, reason: 'invalid-node' };
        node.original_link = normalized.content;
        node.name = normalized.name;
        subscription.updated_at = Date.now();
        await this.write(state);
        return { ok: true };
    }

    async setNodeEnabled(path, nodeId, enabled) {
        const state = await this.read();
        const subscription = this.findSubscription(state, path);
        if (!subscription) return { ok: false, reason: 'missing' };
        const node = state.nodes.find(
            (item) => item.id === Number(nodeId) && item.subscription_id === subscription.id
        );
        if (!node) return { ok: false, reason: 'node-missing' };
        node.enabled = enabled ? 1 : 0;
        subscription.updated_at = Date.now();
        await this.write(state);
        return { ok: true };
    }

    async verifySession(sessionId) {
        if (!sessionId) return false;
        const state = await this.read();
        const now = Date.now();
        const session = state.sessions.find((item) => item.session_id === sessionId);
        if (!session || !(session.expires_at > now)) return false;
        session.expires_at = now + 24 * 60 * 60 * 1000;
        await this.write(state);
        return true;
    }

    async createSession(username) {
        const state = await this.read();
        const now = Date.now();
        const expiresAt = now + 24 * 60 * 60 * 1000;
        state.sessions = state.sessions.filter(
            (item) => item.username !== username && item.expires_at >= now
        );
        const sessionId = crypto.randomUUID();
        state.sessions.push({ session_id: sessionId, username, expires_at: expiresAt });
        await this.write(state);
        return sessionId;
    }

    async destroySession(sessionId) {
        const state = await this.read();
        const before = state.sessions.length;
        state.sessions = state.sessions.filter((item) => item.session_id !== sessionId);
        if (state.sessions.length !== before) {
            await this.write(state);
        }
    }
}
