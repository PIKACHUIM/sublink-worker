<div align="center">
  <img src="public/favicon.png" alt="Sublink Worker" width="120" height="120"/>

  <h1><b>Sublink Worker</b></h1>
  <h5><i>One Worker, All Subscriptions</i></h5>

  <p><b>A lightweight subscription converter and manager for proxy protocols, deployable on Cloudflare Workers, Tencent EdgeOne, Aliyun ESA, Vercel, Node.js, or Docker.</b></p>

  <a href="https://trendshift.io/repositories/12291" target="_blank">
    <img src="https://trendshift.io/api/badge/repositories/12291" alt="7Sageer%2Fsublink-worker | Trendshift" width="250" height="55"/>
  </a>

  <br>

  <h3>Deploy in one click</h3>
  <p>
    <a href="https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2F7Sageer%2Fsublink-worker">
      <img src="https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?style=for-the-badge&amp;logo=cloudflare&amp;logoColor=white" alt="Deploy to Cloudflare Workers"/>
    </a>
    <a href="https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2F7Sageer%2Fsublink-worker&amp;project-name=sublink-worker">
      <img src="https://img.shields.io/badge/Deploy-EdgeOne%20Makers-0052D9?style=for-the-badge&amp;logoColor=white" alt="Deploy to EdgeOne Makers"/>
    </a>
    <a href="https://esa.console.aliyun.com/">
      <img src="https://img.shields.io/badge/Deploy-Alibaba%20Cloud%20ESA-FF6A00?style=for-the-badge&amp;logo=alibabacloud&amp;logoColor=white" alt="Deploy to Alibaba Cloud ESA"/>
    </a>
    <a href="https://vercel.com/new/clone?repository-url=https://github.com/7Sageer/sublink-worker&amp;env=KV_REST_API_URL,KV_REST_API_TOKEN&amp;envDescription=Vercel%20KV%20credentials%20for%20data%20storage&amp;envLink=https://vercel.com/docs/storage/vercel-kv">
      <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&amp;logo=vercel&amp;logoColor=white" alt="Deploy to Vercel"/>
    </a>
  </p>
  <p><sub>ESA opens the console; first-time setup requires GitHub authorization and repository import.</sub></p>

  <h3>📚 Documentation</h3>
  <p>
    <a href="https://app.sublink.works"><b>⚡ Live Demo</b></a> ·
    <a href="https://sublink.works/en/"><b>English Docs</b></a> ·
    <a href="https://sublink.works"><b>中文文档</b></a>
  </p>
  <p>
    <a href="https://sublink.works/guide/quick-start/">Quick Start</a> ·
    <a href="https://sublink.works/api/">API Reference</a> ·
    <a href="https://sublink.works/guide/faq/">FAQ</a>
  </p>
</div>

## 🚀 Quick Start

### One-Click Deployment
- Cloudflare and EdgeOne open deployment flows with this repository preselected.
- For ESA, open the console, then choose **Edge Computing and AI → Functions and Pages → Create → Import from GitHub Repo**. See the setup below.
- Review the [Quick Start](https://sublink.works/guide/quick-start/) for provider-specific configuration.

### Alternative Runtimes
- **Node.js**: `npm run build:node && node dist/node-server.cjs`
- **Vercel**: `vercel deploy` (configure KV in project settings)
- **Docker**: `docker pull ghcr.io/7sageer/sublink-worker:latest`
- **Docker Compose**: `docker compose up -d` (includes Redis)

## Subscription Admin Panel

The same Worker now hosts the Sub-Hub management panel and its storage, so one deployment covers both conversion and subscription management.

| Path | Purpose |
| --- | --- |
| `/admin` | Panel (login required) |
| `/admin/api/*` | Panel API used by the page |
| `/<path>` | Stored subscription, raw links |
| `/<path>/v2ray` | Base64 subscription |
| `/<path>/clash` | Clash YAML built by this project's converter |
| `/<path>/surge` | Surge config |
| `/<path>/singbox` | Sing-Box JSON |
| `/<path>/xray` | Raw links for Xray |

- Admin credentials come from the `ADMIN_USERNAME` / `ADMIN_PASSWORD` secrets. Set them with `npx wrangler secret put ADMIN_USERNAME` (secrets survive deployments, unlike plain vars).
- `ADMIN_PATH` in `wrangler.toml` sets the panel prefix.
- Subscription data lives in KV under `subhub:v1:db`; `scripts/migrate-d1-to-kv.mjs` produces that key from a D1 database.
- Subscription paths must match `^[a-z0-9-]{5,50}$` and may not use `admin`, `clash`, `surge`, `singbox`, `xray`, `resolve`, `config`, `shorten-v2`, `favicon.ico`, `s`, `b`, `c`, `x` — those stay reserved for existing routes.

## Edge Platforms

### Tencent EdgeOne Makers Functions

Import this repository as an EdgeOne Makers project. `edge-functions/index.js` serves `/`; `edge-functions/[[default]].js` handles the remaining routes.

- **KV**: bind an EdgeOne KV namespace as `SUBLINK_KV` and set `STORAGE_BACKEND=kv` (the default).
- **Blob**: set `STORAGE_BACKEND=edgeone-blob`; optionally set `EDGEONE_BLOB_STORE` (default: `sublink-worker`).
- Connect the project to the repository for automatic builds, or use the EdgeOne Makers deployment flow.

### Alibaba Cloud ESA Edge Functions

The ESA button opens the console. To deploy from GitHub, choose **Edge Computing and AI → Functions and Pages → Create → Import from GitHub Repo**, connect GitHub, and select this repository. Use these build settings:

- **Install command**: `npm ci`
- **Build command**: `npm run build:esa`
- **Function file path**: `./dist/aliyun-esa.js`

See Alibaba Cloud's [GitHub import guide](https://www.alibabacloud.com/help/en/edge-security-acceleration/esa/user-guide/connect-pages-to-github). Alternatively, build the bundle locally and upload it as an Edge Function:

```bash
npm ci
npm run build:esa
```

Create an ESA EdgeKV namespace and set `STORAGE_BACKEND=kv` plus `SUBLINK_KV_NAMESPACE` to its name.

### Storage Configuration

| Platform | `STORAGE_BACKEND` | Required binding/configuration |
| --- | --- | --- |
| Cloudflare Workers | `kv` | Existing `SUBLINK_KV` binding |
| EdgeOne Makers Functions | `kv` or `edgeone-blob` | `SUBLINK_KV` binding, or optional `EDGEONE_BLOB_STORE` |
| Aliyun ESA Edge Functions | `kv` | Existing `SUBLINK_KV_NAMESPACE` EdgeKV namespace |

`STORAGE_BACKEND` defaults to `kv`. `edgeone-blob` is supported only on EdgeOne. Switching providers/backends does not migrate existing data; migrate records separately before switching.

`CONFIG_TTL_SECONDS` defaults to 30 days and `SHORT_LINK_TTL_SECONDS` is unset by default. EdgeOne KV, EdgeOne Blob, and ESA EdgeKV do not provide the same native TTL behavior as Cloudflare KV; the adapter enforces expiry on reads, while expired records remain stored and may need manual cleanup. EdgeOne KV and ESA EdgeKV are eventually consistent across edge nodes; ESA EdgeKV may take up to 300 seconds to propagate writes. EdgeOne Blob reads use strong consistency. ESA EdgeKV values are limited to 1.8 MB.

### Sub-Hub D1 to KV Migration

`scripts/migrate-d1-to-kv.mjs` copies the Sub-Hub D1 business tables (`subscriptions`, `nodes`, `sessions`) into KV and adds query indexes. It only reads D1.

```bash
node scripts/migrate-d1-to-kv.mjs --dry-run   # read D1, build snapshot, write nothing
node scripts/migrate-d1-to-kv.mjs             # write and verify
```

KV layout under the `subhub:v1:` prefix:

| Key | Content |
| --- | --- |
| `subhub:v1:meta` | Snapshot counts, source, checksum; written last as the publish marker |
| `subhub:v1:index:subscriptions` | Ordered list of subscription paths |
| `subhub:v1:sub:<path>` | Subscription record plus its nodes |
| `subhub:v1:session:<id>` | Session record |
| `subhub:v1:index:sessions:user:<sha256(username)>` | Session IDs per user |

`src/adapters/kv/subhubStore.js` reads these keys through the shared KV adapter, so the snapshot is queryable without scanning the namespace. Re-running the migration is idempotent: an identical checksum skips the write, a different one is rejected unless `--force` is passed. `_cf_KV` is a Cloudflare reserved table and is intentionally not migrated. D1 is never modified.

## ✨ Features

### Supported Protocols
ShadowSocks • VMess • VLESS • Hysteria2 • Trojan • TUIC

### Client Support
Sing-Box • Clash • Xray/V2Ray • Surge

### Input Support
- Base64 subscriptions
- HTTP/HTTPS subscriptions
- Full configs (Sing-Box JSON, Clash YAML, Surge INI)

### Core Capabilities
- Import subscriptions from multiple sources
- Generate fixed/random short links (KV-based)
- Light/Dark theme toggle
- Flexible API for script automation
- Multi-language support (Chinese, English, Persian, Russian)
- Web interface with predefined rule sets and customizable policy groups

## 🤝 Contributing

Issues and Pull Requests are welcome to improve this project.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This project is for learning and exchange purposes only. Please do not use it for illegal purposes. All consequences resulting from the use of this project are solely the responsibility of the user and are not related to the developer.

## ⭐ Star History

Thanks to everyone who has starred this project! 🌟

<a href="https://star-history.com/#7Sageer/sublink-worker&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=7Sageer/sublink-worker&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=7Sageer/sublink-worker&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=7Sageer/sublink-worker&type=Date" />
 </picture>
</a>
