/** @jsxRuntime automatic */
/** @jsxImportSource hono/jsx */
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { HUD_STYLES } from './hudStyles.js';
import { getLandingCopy } from '../i18n/landing.js';
import { APP_VERSION, DOCS_URL } from '../constants.js';

// Terminal rows are technical identifiers, so they stay untranslated.
const CONSOLE_INPUT = [
    { tag: 'ss', body: 'aes-256-gcm @ hk-01', state: 'OK' },
    { tag: 'vmess', body: 'ws + tls @ jp-02', state: 'OK' },
    { tag: 'vless', body: 'reality @ us-03', state: 'OK' },
    { tag: 'hy2', body: ':443 @ de-04', state: 'OK' },
    { tag: 'https', body: 'sub.example.com/api', state: '200' }
];

const CONSOLE_OUTPUT = [
    { tag: 'sing-box', body: 'route + 27 rule-sets', state: 'READY' },
    { tag: 'clash', body: 'proxy-groups + providers', state: 'READY' },
    { tag: 'xray', body: 'base64 · 42 nodes', state: 'READY' },
    { tag: 'surge', body: 'policy-path · 8 groups', state: 'READY' }
];

const STATS = [
    { value: '06', label: 'PROTOCOLS' },
    { value: '04', label: 'OUTPUTS' },
    { value: '03', label: 'RUNTIMES' },
    { value: '30D', label: 'CONFIG TTL' }
];

const SectionHead = ({ label, title, note }) => (
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
            <div class="hud-mono text-[10px] text-[var(--hud-accent-ink)]">{label}</div>
            <h2 class="hud-display mt-3 text-2xl md:text-4xl">{title}</h2>
        </div>
        {note ? (
            <p class="max-w-sm text-sm leading-relaxed text-[var(--hud-muted)] md:text-right">{note}</p>
        ) : null}
    </div>
);

const ConsoleRow = ({ tag, body, state }) => (
    <div class="hud-console-row flex items-center gap-3 py-[7px]">
        <span class="hud-tag hud-console-tag w-[74px] justify-center">{tag}</span>
        <span class="hud-console-body hud-code truncate text-[12px]">{body}</span>
        <span class="hud-console-dim hud-mono ml-auto text-[9px]">{state}</span>
    </div>
);

export const LandingPage = ({ lang }) => {
    const copy = getLandingCopy(lang);
    const dir = lang === 'fa' ? 'rtl' : 'ltr';

    return (
        <div class="hud min-h-screen" dir={dir}>
            <style dangerouslySetInnerHTML={{ __html: HUD_STYLES }} />
            <div class="hud-grid-bg" aria-hidden="true"></div>
            <Navbar current="landing" />

            <main class="relative z-10">
                {/* Hero: asymmetric split, terminal panel carries the contrast */}
                <section class="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-28 md:px-6 md:pb-20 md:pt-36">
                    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                        <div class="hud-glow -left-32 -top-32 h-[28rem] w-[28rem]"></div>
                        <div class="hud-glow -bottom-40 right-0 h-[22rem] w-[22rem] opacity-60"></div>
                    </div>
                    <div class="relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
                        <div class="max-w-xl lg:max-w-2xl">
                            <div class="hud-rise hud-d1 flex flex-wrap items-center gap-3">
                                <span class="hud-mono flex items-center gap-2 text-[10px] text-[var(--hud-muted)]">
                                    <span class="hud-dot" aria-hidden="true"></span>
                                    ENGINE READY
                                </span>
                                <span class="hud-mono text-[10px] text-[var(--hud-line-strong)]">/</span>
                                <span class="hud-mono text-[10px] text-[var(--hud-accent-ink)]">
                                    SUBSCRIPTION COMPILER v{APP_VERSION}
                                </span>
                            </div>

                            <h1 class="hud-rise hud-d2 hud-display mt-6 text-[clamp(2.3rem,5.4vw,4.1rem)]">
                                {copy.titleLead}
                                <span class="hud-accent-text mt-1 block">{copy.titleAccent}</span>
                            </h1>

                            <p class="hud-rise hud-d3 mt-6 max-w-[54ch] text-base leading-relaxed text-[var(--hud-muted)] md:text-lg">
                                {copy.description}
                            </p>

                            <div class="hud-rise hud-d4 mt-8 flex flex-wrap items-center gap-3">
                                <a href="/app" class="hud-cta">
                                    {copy.primaryCta}
                                    <i class="fas fa-arrow-right text-xs" aria-hidden="true"></i>
                                </a>
                                <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" class="hud-cta-ghost">
                                    <i class="fas fa-book text-xs" aria-hidden="true"></i>
                                    {copy.secondaryCta}
                                </a>
                            </div>

                            <p class="hud-rise hud-d5 hud-mono mt-6 text-[10px] text-[var(--hud-muted)]">
                                {copy.meta}
                            </p>
                        </div>

                        <figure class="hud-frame hud-console hud-rise hud-d3 relative lg:translate-y-3">
                            <div class="hud-console-bar flex items-center gap-2 px-4 py-3">
                                <span class="h-2 w-2 rounded-full bg-[#ff5f57]/70" aria-hidden="true"></span>
                                <span class="h-2 w-2 rounded-full bg-[#febc2e]/70" aria-hidden="true"></span>
                                <span class="h-2 w-2 rounded-full bg-[#28c840]/70" aria-hidden="true"></span>
                                <figcaption class="hud-console-dim hud-mono ml-2 text-[10px]">
                                    edge://compiler
                                </figcaption>
                                <span class="hud-mono ml-auto flex items-center gap-2 text-[9px] text-[#4dd6ff]">
                                    <span class="hud-dot" aria-hidden="true"></span>
                                    LIVE
                                </span>
                            </div>

                            <div class="relative overflow-hidden">
                                <div class="hud-scan" aria-hidden="true"></div>
                                <div class="px-4 py-4">
                                    <div class="hud-console-dim hud-mono text-[9px]">INPUT / SUBSCRIPTION</div>
                                    <div class="mt-2">
                                        {CONSOLE_INPUT.map((row) => (
                                            <ConsoleRow {...row} />
                                        ))}
                                    </div>

                                    <div class="my-4 border-t border-[rgba(51,197,255,0.14)]"></div>

                                    <div class="hud-console-dim hud-mono text-[9px]">OUTPUT / CLIENT</div>
                                    <div class="mt-2">
                                        {CONSOLE_OUTPUT.map((row) => (
                                            <ConsoleRow {...row} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div class="hud-console-bar flex items-center justify-between border-t px-4 py-2.5">
                                <span class="hud-console-dim hud-mono text-[9px]">
                                    6 PROTOCOLS · 4 TARGETS · 27 RULE SETS
                                </span>
                                <span class="hud-mono text-[9px] text-[#4dd6ff]">READY</span>
                            </div>
                        </figure>
                    </div>
                </section>

                {/* Numbers strip, mono labels keep it in the HUD register */}
                <section class="mx-auto w-full max-w-7xl px-4 md:px-6">
                    <div class="hud-rise hud-d5 grid grid-cols-2 divide-x divide-y divide-[var(--hud-line)] border-y border-[var(--hud-line)] md:grid-cols-4 md:divide-y-0">
                        {STATS.map((stat) => (
                            <div class="px-4 py-5 md:px-6 md:py-6">
                                <div class="hud-display text-3xl tabular-nums md:text-4xl">{stat.value}</div>
                                <div class="hud-mono mt-2 text-[9px] text-[var(--hud-muted)]">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pipeline doubles as the quickstart */}
                <section class="mx-auto w-full max-w-7xl px-4 pt-20 md:px-6 md:pt-28">
                    <SectionHead label="01 / PIPELINE" title={copy.pipelineTitle} note={copy.pipelineNote} />
                    <ol class="mt-10 grid gap-4 md:grid-cols-3 md:gap-3">
                        {copy.steps.map((step, index) => (
                            <li
                                class={`hud-frame p-6 md:p-7 ${
                                    index === 1 ? 'md:-mt-4' : index === 2 ? 'md:mt-4' : ''
                                }`}
                            >
                                <div class="flex items-center justify-between">
                                    <span class="hud-mono text-[10px] text-[var(--hud-accent-ink)]">
                                        STEP 0{index + 1}
                                    </span>
                                    <span class="hud-mono text-[9px] text-[var(--hud-muted)]">
                                        {step.tags.length} MODULES
                                    </span>
                                </div>
                                <h3 class="hud-display mt-4 text-xl">{step.title}</h3>
                                <p class="mt-2 text-sm leading-relaxed text-[var(--hud-muted)]">
                                    {step.desc}
                                </p>
                                <div class="mt-5 flex flex-wrap gap-2">
                                    {step.tags.map((tag) => (
                                        <span class="hud-tag">{tag}</span>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Capabilities as a ledger, not a card grid */}
                <section class="mx-auto w-full max-w-7xl px-4 pt-20 md:px-6 md:pt-28">
                    <SectionHead label="02 / CAPABILITIES" title={copy.capabilitiesTitle} />
                    <div class="mt-10 grid gap-x-12 md:grid-cols-2">
                        {copy.capabilities.map((item, index) => (
                            <div class="hud-ledger-row grid grid-cols-[auto_1fr_auto] gap-4 border-t border-[var(--hud-line)] py-5">
                                <span class="hud-mono pt-1 text-[10px] text-[var(--hud-accent-ink)]">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <div>
                                    <h3 class="hud-display text-base md:text-lg">{item.title}</h3>
                                    <p class="mt-1.5 text-sm leading-relaxed text-[var(--hud-muted)]">
                                        {item.desc}
                                    </p>
                                </div>
                                <i
                                    class="hud-ledger-arrow fas fa-arrow-right pt-1 text-[10px] text-[var(--hud-accent-ink)]"
                                    aria-hidden="true"
                                ></i>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Outputs: target list on the right, title column kept narrow */}
                <section class="mx-auto w-full max-w-7xl px-4 pt-20 md:px-6 md:pt-28">
                    <div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
                        <SectionHead label="03 / OUTPUTS" title={copy.outputsTitle} note={copy.outputsNote} />
                        <div class="hud-frame">
                            <div class="flex items-center justify-between border-b border-[var(--hud-line)] px-5 py-3">
                                <span class="hud-mono text-[9px] text-[var(--hud-muted)]">TARGET</span>
                                <span class="hud-mono text-[9px] text-[var(--hud-muted)]">FORMAT</span>
                            </div>
                            <ul>
                                {copy.outputRows.map((row) => (
                                    <li class="hud-ledger-row flex flex-wrap items-center gap-3 border-t border-[var(--hud-line)] px-5 py-4 first:border-t-0">
                                        <span class="hud-display text-lg">{row.name}</span>
                                        <span class="hud-tag">{row.tag}</span>
                                        <span class="w-full text-xs text-[var(--hud-muted)] md:ml-auto md:w-auto md:text-right">
                                            {row.detail}
                                        </span>
                                        <span class="hud-mono hidden text-[9px] text-[var(--hud-signal)] md:inline">
                                            READY
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Closing CTA */}
                <section class="mx-auto w-full max-w-7xl px-4 pb-24 pt-20 md:px-6 md:pt-28">
                    <div class="hud-frame">
                        <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                            <div class="hud-glow -right-20 -top-24 h-72 w-72"></div>
                        </div>
                        <div class="relative grid gap-8 p-7 md:grid-cols-[1.1fr_0.9fr] md:items-end md:p-12">
                            <h2 class="hud-display text-3xl md:text-5xl">{copy.ctaTitle}</h2>
                            <div class="md:justify-self-end md:text-right">
                                <p class="text-sm leading-relaxed text-[var(--hud-muted)] md:text-base">
                                    {copy.ctaDesc}
                                </p>
                                <a href="/app" class="hud-cta mt-5">
                                    {copy.ctaButton}
                                    <i class="fas fa-arrow-right text-xs" aria-hidden="true"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};
