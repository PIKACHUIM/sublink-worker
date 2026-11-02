import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
    SUBHUB_KEY_PREFIX,
    SUBHUB_META_KEY,
    SUBHUB_SUBSCRIPTIONS_INDEX_KEY,
    sessionKey,
    sessionUserIndexKey,
    subscriptionKey
} from '../src/adapters/kv/subhubStore.js';

export const SUBHUB_STATE_KEY = 'subhub:v1:db';
const DEFAULT_DATABASE = 'worklink-data';
const DEFAULT_NAMESPACE_ID = '953fcf4d7b8148fc88f438203bf863cf';

function resolveWranglerCommand() {
    if (process.env.WRANGLER_BIN) {
        return { command: process.env.WRANGLER_BIN, prefix: [] };
    }
    try {
        const require = createRequire(import.meta.url);
        const packageJson = require.resolve('wrangler/package.json');
        return { command: process.execPath, prefix: [path.join(path.dirname(packageJson), 'bin', 'wrangler.js')] };
    } catch {
        return {
            command: process.platform === 'win32' ? 'npx.cmd' : 'npx',
            prefix: ['--yes', 'wrangler@4.156.1'],
            shell: true
        };
    }
}

const WRANGLER = resolveWranglerCommand();

const TABLES = {
    subscriptions: 'SELECT id, name, path, sub_order, updated_at, converter_backend FROM subscriptions ORDER BY id',
    nodes: 'SELECT id, subscription_id, name, original_link, node_order, enabled FROM nodes ORDER BY subscription_id, node_order, id',
    sessions: 'SELECT session_id, username, expires_at FROM sessions ORDER BY session_id'
};

function parseArgs(argv) {
    const options = {
        database: DEFAULT_DATABASE,
        namespaceId: DEFAULT_NAMESPACE_ID,
        force: false,
        dryRun: false
    };
    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];
        if (arg === '--database') options.database = argv[++i];
        else if (arg === '--namespace-id') options.namespaceId = argv[++i];
        else if (arg === '--force') options.force = true;
        else if (arg === '--dry-run') options.dryRun = true;
        else if (arg === '--help' || arg === '-h') {
            console.log('Usage: node scripts/migrate-d1-to-kv.mjs [--database name] [--namespace-id id] [--force] [--dry-run]');
            process.exit(0);
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }
    if (!options.namespaceId) throw new Error('--namespace-id is required');
    return options;
}

function runWrangler(args, { allowFailure = false } = {}) {
    try {
        return execFileSync(WRANGLER.command, [...WRANGLER.prefix, ...args], {
            encoding: 'utf8',
            maxBuffer: 64 * 1024 * 1024,
            shell: WRANGLER.shell === true,
            stdio: ['ignore', 'pipe', 'pipe']
        });
    } catch (error) {
        if (allowFailure) return null;
        const stderr = error.stderr ? error.stderr.toString() : '';
        throw new Error(`wrangler ${args.join(' ')} failed: ${stderr || error.message}`);
    }
}

function readTable(database, sql) {
    const output = runWrangler(['d1', 'execute', database, '--remote', '--json', '--command', sql]);
    const parsed = JSON.parse(output.slice(output.indexOf('[')));
    const payload = Array.isArray(parsed) ? parsed[0] : parsed;
    if (!payload || payload.success !== true || !Array.isArray(payload.results)) {
        throw new Error(`Unexpected D1 response for query: ${sql}`);
    }
    return payload.results;
}

function canonicalize(value) {
    if (Array.isArray(value)) return value.map(canonicalize);
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
    }
    return value;
}

function checksum(snapshot) {
    return createHash('sha256').update(JSON.stringify(canonicalize(snapshot))).digest('hex');
}

function buildSnapshot(subscriptions, nodes, sessions, source) {
    const nodesBySubscription = new Map();
    for (const node of nodes) {
        const list = nodesBySubscription.get(node.subscription_id) || [];
        list.push(node);
        nodesBySubscription.set(node.subscription_id, list);
    }

    const documents = subscriptions.map((subscription) => ({
        key: subscriptionKey(subscription.path),
        value: JSON.stringify({
            subscription,
            nodes: nodesBySubscription.get(subscription.id) || []
        })
    }));

    const sessionRecords = sessions.map((session) => ({
        key: sessionKey(session.session_id),
        value: JSON.stringify(session)
    }));

    const sessionIndex = new Map();
    for (const session of sessions) {
        const usernameHash = createHash('sha256').update(String(session.username ?? '')).digest('hex');
        const ids = sessionIndex.get(usernameHash) || [];
        ids.push(session.session_id);
        sessionIndex.set(usernameHash, ids);
    }

    const indexRecords = [...sessionIndex.entries()].map(([usernameHash, ids]) => ({
        key: sessionUserIndexKey(usernameHash),
        value: JSON.stringify(ids)
    }));

    const data = {
        subscriptions,
        nodes,
        sessions
    };

    const meta = {
        version: 1,
        source,
        exportedAt: new Date().toISOString(),
        counts: {
            subscriptions: subscriptions.length,
            nodes: nodes.length,
            sessions: sessions.length
        },
        checksum: checksum(data)
    };

    const state = {
        schemaVersion: 1,
        seq: {
            subscriptions: subscriptions.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0),
            nodes: nodes.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0)
        },
        subscriptions,
        nodes,
        sessions
    };

    return {
        meta,
        records: [
            ...documents,
            ...sessionRecords,
            ...indexRecords,
            {
                key: SUBHUB_SUBSCRIPTIONS_INDEX_KEY,
                value: JSON.stringify(subscriptions.map((subscription) => subscription.path))
            },
            {
                key: SUBHUB_STATE_KEY,
                value: JSON.stringify(state)
            }
        ]
    };
}

function readExistingMeta(namespaceId) {
    const output = runWrangler(
        ['kv', 'key', 'get', SUBHUB_META_KEY, '--namespace-id', namespaceId, '--remote'],
        { allowFailure: true }
    );
    if (!output) return null;
    try {
        return JSON.parse(output.slice(output.indexOf('{')));
    } catch {
        return null;
    }
}

async function writeRecords(records, namespaceId) {
    const tempFile = path.join(os.tmpdir(), `sublink-kv-migration-${process.pid}-${Date.now()}.json`);
    await fs.writeFile(tempFile, JSON.stringify(records), 'utf8');
    try {
        const output = runWrangler(['kv', 'bulk', 'put', tempFile, '--namespace-id', namespaceId, '--remote']);
        return output.trim();
    } finally {
        await fs.rm(tempFile, { force: true }).catch(() => {});
    }
}

function verifyRemote(namespaceId, expected) {
    // KV is eventually consistent: a freshly written key can 404 for a few seconds.
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const output = runWrangler(
            ['kv', 'key', 'get', SUBHUB_META_KEY, '--namespace-id', namespaceId, '--remote'],
            { allowFailure: true }
        );
        if (output) {
            let meta;
            try {
                meta = JSON.parse(output.slice(output.indexOf('{')));
            } catch {
                meta = null;
            }
            if (meta) {
                const ok = meta.checksum === expected.checksum
                    && meta.counts.subscriptions === expected.counts.subscriptions
                    && meta.counts.nodes === expected.counts.nodes
                    && meta.counts.sessions === expected.counts.sessions;
                return { ok, meta, reason: ok ? null : 'checksum or counts mismatch' };
            }
        }
        if (attempt < 4) execFileSync(process.execPath, ['-e', 'setTimeout(() => {}, 2000)']);
    }
    return { ok: false, reason: 'meta key is not readable after write' };
}

async function main() {
    const options = parseArgs(process.argv.slice(2));
    console.log(`Reading D1 "${options.database}" (read-only)...`);

    const subscriptions = readTable(options.database, TABLES.subscriptions);
    const nodes = readTable(options.database, TABLES.nodes);
    const sessions = readTable(options.database, TABLES.sessions);
    console.log(`Read subscriptions=${subscriptions.length} nodes=${nodes.length} sessions=${sessions.length}`);

    const paths = subscriptions.map((item) => item.path);
    if (new Set(paths).size !== paths.length) {
        throw new Error('Duplicate subscription paths found in D1; refusing to build ambiguous KV indexes');
    }

    const snapshot = buildSnapshot(subscriptions, nodes, sessions, {
        type: 'd1',
        database: options.database
    });
    console.log(`Checksum ${snapshot.meta.checksum}; writing ${snapshot.records.length} KV keys under ${SUBHUB_KEY_PREFIX}`);

    if (options.dryRun) {
        console.log('Dry run only; nothing written.');
        return;
    }

    const existing = readExistingMeta(options.namespaceId);
    if (existing && existing.checksum !== snapshot.meta.checksum && !options.force) {
        throw new Error(
            `KV already has a different snapshot (${existing.checksum}). Re-run with --force only if you intend to replace it.`
        );
    }
    if (existing && existing.checksum === snapshot.meta.checksum && !options.force) {
        console.log('KV already contains an identical snapshot; verifying without rewriting.');
        const verification = verifyRemote(options.namespaceId, snapshot.meta);
        if (!verification.ok) {
            throw new Error(`KV verification failed: ${verification.reason}`);
        }
        console.log(`Verified KV snapshot: ${JSON.stringify(verification.meta.counts)} checksum=${verification.meta.checksum}`);
        return;
    }

    // Write data and indexes first, then the meta key: meta is the publish marker.
    const dataRecords = snapshot.records.filter((record) => record.key !== SUBHUB_META_KEY);
    await writeRecords(dataRecords, options.namespaceId);
    await writeRecords([{ key: SUBHUB_META_KEY, value: JSON.stringify(snapshot.meta) }], options.namespaceId);

    const verification = verifyRemote(options.namespaceId, snapshot.meta);
    if (!verification.ok) {
        throw new Error(`KV verification failed: ${verification.reason || 'checksum mismatch'}`);
    }
    console.log(`Verified KV snapshot: ${JSON.stringify(verification.meta.counts)} checksum=${verification.meta.checksum}`);
    console.log('D1 was not modified. Delete it only after the Worker reads this KV snapshot.');
}

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
