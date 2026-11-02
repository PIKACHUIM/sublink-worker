export const SUBHUB_KEY_PREFIX = 'subhub:v1:';
export const SUBHUB_META_KEY = `${SUBHUB_KEY_PREFIX}meta`;
export const SUBHUB_SUBSCRIPTIONS_INDEX_KEY = `${SUBHUB_KEY_PREFIX}index:subscriptions`;

export function subscriptionKey(path) {
    return `${SUBHUB_KEY_PREFIX}sub:${path}`;
}

export function sessionKey(sessionId) {
    return `${SUBHUB_KEY_PREFIX}session:${sessionId}`;
}

export function sessionUserIndexKey(usernameHash) {
    return `${SUBHUB_KEY_PREFIX}index:sessions:user:${usernameHash}`;
}

export async function hashUsername(username) {
    const bytes = new TextEncoder().encode(String(username ?? ''));
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function sortSubscriptions(subscriptions) {
    const orderValue = (item) => {
        // D1 sorts by COALESCE(sub_order, id): only NULL falls back to id, 0 stays 0.
        if (item.sub_order === null || item.sub_order === undefined) return Number(item.id) || 0;
        return Number(item.sub_order) || 0;
    };
    return [...subscriptions].sort((left, right) => orderValue(left) - orderValue(right));
}

export function sortNodes(nodes) {
    return [...nodes].sort((left, right) => {
        const orderDiff = (Number(left.node_order) || 0) - (Number(right.node_order) || 0);
        return orderDiff !== 0 ? orderDiff : (Number(left.id) || 0) - (Number(right.id) || 0);
    });
}

export class SubhubStore {
    constructor(kv) {
        if (!kv) {
            throw new Error('Subhub store requires a KV binding');
        }
        this.kv = kv;
    }

    async getMeta() {
        return this.readJson(SUBHUB_META_KEY);
    }

    async listSubscriptions() {
        const paths = (await this.readJson(SUBHUB_SUBSCRIPTIONS_INDEX_KEY)) || [];
        const docs = await Promise.all(paths.map((path) => this.readJson(subscriptionKey(path))));
        const subscriptions = docs
            .filter(Boolean)
            .map((doc) => ({
                id: doc.subscription.id,
                name: doc.subscription.name,
                path: doc.subscription.path,
                sub_order: doc.subscription.sub_order,
                updated_at: doc.subscription.updated_at,
                converter_backend: doc.subscription.converter_backend,
                nodeCount: doc.nodes.length
            }));
        return sortSubscriptions(subscriptions);
    }

    async getSubscription(path) {
        const doc = await this.readJson(subscriptionKey(path));
        return doc ? doc.subscription : null;
    }

    async listNodes(path) {
        const doc = await this.readJson(subscriptionKey(path));
        if (!doc) return null;
        return sortNodes(doc.nodes).map((node) => ({
            id: node.id,
            name: node.name,
            original_link: node.original_link,
            node_order: node.node_order,
            enabled: node.enabled === null || node.enabled === undefined ? 1 : node.enabled
        }));
    }

    async getSubscriptionContent(path) {
        const nodes = await this.listNodes(path);
        if (!nodes) return '';
        return nodes
            .filter((node) => node.enabled === 1 && node.original_link)
            .map((node) => node.original_link)
            .join('\n');
    }

    async getSession(sessionId) {
        const session = await this.readJson(sessionKey(sessionId));
        if (!session) return null;
        if (!Number.isFinite(session.expires_at) || session.expires_at <= Date.now()) {
            return null;
        }
        return session;
    }

    async listSessionIdsForUser(username) {
        return (await this.readJson(sessionUserIndexKey(await hashUsername(username)))) || [];
    }

    async readJson(key) {
        const stored = await this.kv.get(key);
        if (stored === null || stored === undefined) return null;
        try {
            return JSON.parse(stored);
        } catch {
            throw new Error(`KV value at ${key} is not valid JSON`);
        }
    }
}
