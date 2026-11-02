// Copy for the landing page and the branded 404 page.
// Kept out of i18n/index.js because these strings are page-level, not UI labels.
export const LANDING_COPY = {
    'zh-CN': {
        titleLead: '把散乱的分享链接',
        titleAccent: '编译成能跑的配置',
        description: 'Sublink Worker 解析 Shadowsocks、VMess、VLESS、Hysteria2、Trojan、TUIC 订阅，按规则集编排分流，直接输出 Sing-Box、Clash、Xray 与 Surge 配置。同一份代码跑在 Cloudflare Workers、Node.js 与 Vercel。',
        primaryCta: '打开转换器',
        secondaryCta: '查看文档',
        meta: '无需注册 · 无需数据库 · 转换在边缘节点完成',
        pipelineTitle: '一条链路，三段处理',
        pipelineNote: '从链接到可导入的配置文件，中间只有三个动作。',
        steps: [
            { title: '采集', desc: '粘贴分享链接或订阅地址，自动识别 Base64 列表、Clash YAML、Sing-Box JSON 与 Surge INI。', tags: ['base64', 'yaml', 'json', 'ini'] },
            { title: '编排', desc: '选择极简、均衡或全面规则集，也可以写入自定义路由、来源 IP 与按国家分组。', tags: ['rules', 'groups', 'override'] },
            { title: '输出', desc: '按目标客户端生成字段结构，并把你的基础配置合并进结果，代理与规则永不被覆盖。', tags: ['sing-box', 'clash', 'xray', 'surge'] }
        ],
        capabilitiesTitle: '系统能力',
        capabilities: [
            { title: '订阅识别', desc: '自动判别 Base64 列表、Clash YAML、Sing-Box JSON 与 Surge INI，无需手动标注格式。' },
            { title: '规则编排', desc: '预置规则集覆盖广告、流媒体、AI 服务与国内直连，也支持自定义 geosite / geoip / 协议规则。' },
            { title: '国家分组', desc: '按地区聚合同区域节点，自动生成地区选择组，节点再多也不会乱。' },
            { title: '基础配置覆盖', desc: '上传自己的配置作为模板，非代理字段合并进结果，proxies 与 rules 始终保留。' },
            { title: '短链托管', desc: '订阅参数存进 KV，生成短地址；支持 Redis、Upstash 与内存兜底。' },
            { title: '多运行时', desc: '同一套 Hono 应用跑在 Cloudflare Workers、Node.js / Docker 与 Vercel。' }
        ],
        outputsTitle: '输出目标',
        outputsNote: '一份订阅，四种客户端。版本差异由 UA 与参数自动判断。',
        outputRows: [
            { name: 'sing-box', detail: 'JSON · 1.11 / 1.12 / 1.14 三档结构', tag: '1.11–1.14' },
            { name: 'clash', detail: 'YAML · proxy-groups + rule-providers', tag: 'mihomo' },
            { name: 'xray', detail: 'Base64 订阅，保留原始分享链接', tag: 'base64' },
            { name: 'surge', detail: 'INI · policy-path 与策略组', tag: 'ini' }
        ],
        ctaTitle: '现在，把链接丢进来',
        ctaDesc: '粘贴订阅，三十秒后拿走四份配置。',
        ctaButton: '打开转换器',
        notFoundKicker: 'SIGNAL LOST',
        notFoundTitle: '路径未接入',
        notFoundDesc: '这个地址没有对应的处理器。检查拼写，或返回主页重新开始。',
        notFoundHome: '返回主页',
        notFoundConverter: '打开转换器',
        pageTitle: 'Sublink Worker - 订阅转换与节点编排',
        pageDescription: '把分享链接、Clash、Sing-Box、Surge 订阅编译成 Sing-Box / Clash / Xray / Surge 配置，跑在 Cloudflare Workers、Node.js 与 Vercel 上。'
    },
    'en-US': {
        titleLead: 'Scattered share links,',
        titleAccent: 'compiled into configs.',
        description: 'Sublink Worker parses Shadowsocks, VMess, VLESS, Hysteria2, Trojan and TUIC subscriptions, arranges them into rule-based routing, and emits Sing-Box, Clash, Xray and Surge configs. One codebase runs on Cloudflare Workers, Node.js and Vercel.',
        primaryCta: 'Open converter',
        secondaryCta: 'Read docs',
        meta: 'No signup · no database · conversion runs at the edge',
        pipelineTitle: 'One pipeline, three stages',
        pipelineNote: 'From a pasted link to an importable config file, nothing else in between.',
        steps: [
            { title: 'Collect', desc: 'Paste share links or a subscription URL. Base64 lists, Clash YAML, Sing-Box JSON and Surge INI are detected automatically.', tags: ['base64', 'yaml', 'json', 'ini'] },
            { title: 'Compose', desc: 'Pick minimal, balanced or comprehensive rule sets, or write custom routes, source IP rules and country groups.', tags: ['rules', 'groups', 'override'] },
            { title: 'Emit', desc: 'Generate the field layout each client expects and merge your base config, without ever overwriting proxies or rules.', tags: ['sing-box', 'clash', 'xray', 'surge'] }
        ],
        capabilitiesTitle: 'Capabilities',
        capabilities: [
            { title: 'Format detection', desc: 'Base64 lists, Clash YAML, Sing-Box JSON and Surge INI are recognized without manual tagging.' },
            { title: 'Rule orchestration', desc: 'Preset rule sets cover ads, streaming, AI services and direct domestic traffic, plus custom geosite / geoip / protocol rules.' },
            { title: 'Country grouping', desc: 'Nodes are clustered by region and grouped into selectors, so large subscriptions stay navigable.' },
            { title: 'Base config override', desc: 'Use your own config as a template. Non-proxy fields merge in; proxies and rules are never replaced.' },
            { title: 'Short link hosting', desc: 'Subscription parameters live in KV and resolve through short URLs, backed by Redis, Upstash or memory.' },
            { title: 'Multi runtime', desc: 'The same Hono app runs on Cloudflare Workers, Node.js / Docker and Vercel.' }
        ],
        outputsTitle: 'Output targets',
        outputsNote: 'One subscription, four clients. Version quirks are resolved from UA and query flags.',
        outputRows: [
            { name: 'sing-box', detail: 'JSON · 1.11 / 1.12 / 1.14 layouts', tag: '1.11–1.14' },
            { name: 'clash', detail: 'YAML · proxy-groups + rule-providers', tag: 'mihomo' },
            { name: 'xray', detail: 'Base64 subscription, share links preserved', tag: 'base64' },
            { name: 'surge', detail: 'INI · policy-path and policy groups', tag: 'ini' }
        ],
        ctaTitle: 'Drop the link in.',
        ctaDesc: 'Paste a subscription, take four configs thirty seconds later.',
        ctaButton: 'Open converter',
        notFoundKicker: 'SIGNAL LOST',
        notFoundTitle: 'No handler on this path',
        notFoundDesc: 'This address has no processor behind it. Check the spelling, or head back to the start.',
        notFoundHome: 'Back home',
        notFoundConverter: 'Open converter',
        pageTitle: 'Sublink Worker - Subscription conversion and node routing',
        pageDescription: 'Compile share links and Clash, Sing-Box or Surge subscriptions into Sing-Box / Clash / Xray / Surge configs on Cloudflare Workers, Node.js and Vercel.'
    },
    fa: {
        titleLead: 'لینک‌های پراکنده را',
        titleAccent: 'به کانفیگ قابل اجرا تبدیل کن',
        description: 'Sublink Worker اشتراک‌های Shadowsocks، VMess، VLESS، Hysteria2، Trojan و TUIC را تحلیل می‌کند، مسیرها را بر پایه قواعد می‌چیند و خروجی Sing-Box، Clash، Xray و Surge می‌سازد. یک کد، روی Cloudflare Workers، Node.js و Vercel.',
        primaryCta: 'باز کردن مبدل',
        secondaryCta: 'مستندات',
        meta: 'بدون ثبت‌نام · بدون پایگاه‌داده · تبدیل روی لبه شبکه',
        pipelineTitle: 'یک مسیر، سه مرحله',
        pipelineNote: 'از لینک تا فایل کانفیگ، فقط سه حرکت.',
        steps: [
            { title: 'دریافت', desc: 'لینک اشتراک‌اکانت را بچسبان؛ فهرست Base64، Clash YAML، Sing-Box JSON و Surge INI خودکار شناسایی می‌شود.', tags: ['base64', 'yaml', 'json', 'ini'] },
            { title: 'چیدمان', desc: 'مجموعه قواعد کمینه، متعادل یا کامل را انتخاب کن یا قاعده سفارشی و گروه کشوری بنویس.', tags: ['rules', 'groups', 'override'] },
            { title: 'خروجی', desc: 'ساختار فیلدهای هر کلاینت ساخته می‌شود و کانفیگ پایه تو ادغام می‌گردد، بدون بازنویسی پروکسی و قواعد.', tags: ['sing-box', 'clash', 'xray', 'surge'] }
        ],
        capabilitiesTitle: 'توانمندی‌ها',
        capabilities: [
            { title: 'تشخیص قالب', desc: 'فهرست Base64، Clash YAML، Sing-Box JSON و Surge INI بدون برچسب‌گذاری دستی شناسایی می‌شوند.' },
            { title: 'چیدمان قواعد', desc: 'مجموعه‌های آماده تبلیغات، استریم، سرویس‌های هوش مصنوعی و مسیر داخلی را پوشش می‌دهند؛ قواعد geosite و geoip هم پشتیبانی می‌شود.' },
            { title: 'گروه کشوری', desc: 'نودهای هر منطقه کنار هم جمع می‌شوند و انتخابگر منطقه ساخته می‌شود.' },
            { title: 'ادغام کانفیگ پایه', desc: 'کانفیگ خودت را قالب کن؛ فیلدهای غیرپروکسی ادغام می‌شوند و proxies و rules هرگز جایگزین نمی‌شوند.' },
            { title: 'میزبانی لینک کوتاه', desc: 'پارامترها در KV ذخیره و با لینک کوتاه بازگردانی می‌شوند؛ Redis و Upstash هم پشتیبانی می‌شوند.' },
            { title: 'چند محیط اجرا', desc: 'همان اپ Hono روی Cloudflare Workers، Node.js / Docker و Vercel اجرا می‌شود.' }
        ],
        outputsTitle: 'خروجی‌ها',
        outputsNote: 'یک اشتراک، چهار کلاینت. تفاوت نسخه‌ها از UA و پارامترها تشخیص داده می‌شود.',
        outputRows: [
            { name: 'sing-box', detail: 'JSON · ساختار 1.11 / 1.12 / 1.14', tag: '1.11–1.14' },
            { name: 'clash', detail: 'YAML · proxy-groups + rule-providers', tag: 'mihomo' },
            { name: 'xray', detail: 'اشتراک Base64 با حفظ لینک اصلی', tag: 'base64' },
            { name: 'surge', detail: 'INI · policy-path و گروه‌های سیاست', tag: 'ini' }
        ],
        ctaTitle: 'حالا لینک را وارد کن',
        ctaDesc: 'اشتراک را بچسبان، سی ثانیه بعد چهار کانفیگ بردار.',
        ctaButton: 'باز کردن مبدل',
        notFoundKicker: 'SIGNAL LOST',
        notFoundTitle: 'این مسیر پردازشگر ندارد',
        notFoundDesc: 'برای این آدرس پردازشگری تعریف نشده است. املای آن را بررسی کن یا به صفحه اصلی برگرد.',
        notFoundHome: 'صفحه اصلی',
        notFoundConverter: 'باز کردن مبدل',
        pageTitle: 'Sublink Worker - تبدیل اشتراک و چیدمان نودها',
        pageDescription: 'لینک‌های اشتراک و کانفیگ‌های Clash، Sing-Box و Surge را به خروجی Sing-Box / Clash / Xray / Surge تبدیل کن.'
    },
    ru: {
        titleLead: 'Разрозненные ссылки —',
        titleAccent: 'в готовый конфиг',
        description: 'Sublink Worker разбирает подписки Shadowsocks, VMess, VLESS, Hysteria2, Trojan и TUIC, раскладывает трафик по правилам и отдаёт конфиги Sing-Box, Clash, Xray и Surge. Одна кодовая база для Cloudflare Workers, Node.js и Vercel.',
        primaryCta: 'Открыть конвертер',
        secondaryCta: 'Документация',
        meta: 'Без регистрации · без базы данных · конвертация на edge',
        pipelineTitle: 'Один конвейер, три шага',
        pipelineNote: 'От вставленной ссылки до импортируемого файла — ничего лишнего.',
        steps: [
            { title: 'Сбор', desc: 'Вставьте ссылки или адрес подписки: Base64-список, Clash YAML, Sing-Box JSON и Surge INI определяются автоматически.', tags: ['base64', 'yaml', 'json', 'ini'] },
            { title: 'Сборка', desc: 'Выберите минимальный, сбалансированный или полный набор правил либо задайте свои маршруты и группы по странам.', tags: ['rules', 'groups', 'override'] },
            { title: 'Вывод', desc: 'Структура полей под каждый клиент, с вашим базовым конфигом внутри. Прокси и правила не перезаписываются.', tags: ['sing-box', 'clash', 'xray', 'surge'] }
        ],
        capabilitiesTitle: 'Возможности',
        capabilities: [
            { title: 'Определение формата', desc: 'Base64-список, Clash YAML, Sing-Box JSON и Surge INI распознаются без ручной разметки.' },
            { title: 'Оркестрация правил', desc: 'Готовые наборы закрывают рекламу, стриминг, AI-сервисы и прямой трафик; поддерживаются свои geosite и geoip.' },
            { title: 'Группы по странам', desc: 'Узлы кластеризуются по регионам и попадают в селекторы, поэтому большие подписки остаются управляемыми.' },
            { title: 'Базовый конфиг', desc: 'Свой конфиг используется как шаблон: непрокси-поля объединяются, proxies и rules остаются нетронутыми.' },
            { title: 'Короткие ссылки', desc: 'Параметры подписки хранятся в KV и отдаются коротким адресом; есть Redis и Upstash.' },
            { title: 'Несколько сред', desc: 'Одно приложение Hono работает на Cloudflare Workers, Node.js / Docker и Vercel.' }
        ],
        outputsTitle: 'Цели вывода',
        outputsNote: 'Одна подписка, четыре клиента. Версии различаются по UA и параметрам.',
        outputRows: [
            { name: 'sing-box', detail: 'JSON · схемы 1.11 / 1.12 / 1.14', tag: '1.11–1.14' },
            { name: 'clash', detail: 'YAML · proxy-groups + rule-providers', tag: 'mihomo' },
            { name: 'xray', detail: 'Base64-подписка с исходными ссылками', tag: 'base64' },
            { name: 'surge', detail: 'INI · policy-path и группы политик', tag: 'ini' }
        ],
        ctaTitle: 'Вставляйте ссылки',
        ctaDesc: 'Одна подписка — четыре конфига через тридцать секунд.',
        ctaButton: 'Открыть конвертер',
        notFoundKicker: 'SIGNAL LOST',
        notFoundTitle: 'Путь не найден',
        notFoundDesc: 'У этого адреса нет обработчика. Проверьте написание или вернитесь на главную.',
        notFoundHome: 'На главную',
        notFoundConverter: 'Открыть конвертер',
        pageTitle: 'Sublink Worker - конвертация подписок и маршрутизация',
        pageDescription: 'Превращает ссылки и подписки Clash, Sing-Box и Surge в конфиги Sing-Box / Clash / Xray / Surge.'
    }
};

export function getLandingCopy(lang) {
    const fallback = LANDING_COPY['en-US'];
    if (!lang) return fallback;
    if (LANDING_COPY[lang]) return LANDING_COPY[lang];
    if (lang.startsWith('fa')) return LANDING_COPY.fa;
    if (lang.startsWith('ru')) return LANDING_COPY.ru;
    if (lang.startsWith('en')) return fallback;
    return LANDING_COPY['zh-CN'];
}
