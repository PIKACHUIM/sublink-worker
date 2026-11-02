/** @jsxRuntime automatic */
/** @jsxImportSource hono/jsx */
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { HUD_STYLES } from './hudStyles.js';
import { getLandingCopy } from '../i18n/landing.js';

export const NotFoundPage = ({ lang, path = '/' }) => {
    const copy = getLandingCopy(lang);
    const dir = lang === 'fa' ? 'rtl' : 'ltr';

    return (
        <div class="hud flex min-h-screen flex-col" dir={dir}>
            <style dangerouslySetInnerHTML={{ __html: HUD_STYLES }} />
            <div class="hud-grid-bg" aria-hidden="true"></div>
            <Navbar lang={lang} />

            <main class="relative z-10 flex flex-1 items-center">
                <div class="mx-auto w-full max-w-7xl px-4 py-24 md:px-6">
                    <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                        <div>
                            <div class="hud-rise hud-d1 hud-mono flex items-center gap-2 text-[10px] text-[var(--hud-accent-ink)]">
                                <span class="hud-dot hud-dot-alert" aria-hidden="true"></span>
                                {copy.notFoundKicker}
                            </div>
                            <div class="hud-rise hud-d2 hud-display hud-accent-text mt-4 text-[clamp(4rem,15vw,9rem)] leading-none tabular-nums">
                                404
                            </div>
                            <h1 class="hud-rise hud-d3 hud-display mt-2 text-2xl md:text-3xl">
                                {copy.notFoundTitle}
                            </h1>
                            <p class="hud-rise hud-d4 mt-4 max-w-md text-sm leading-relaxed text-[var(--hud-muted)] md:text-base">
                                {copy.notFoundDesc}
                            </p>
                            <div class="hud-rise hud-d5 mt-8 flex flex-wrap items-center gap-3">
                                <a href="/" class="hud-cta">
                                    {copy.notFoundHome}
                                    <i class="fas fa-arrow-left text-xs" aria-hidden="true"></i>
                                </a>
                                <a href="/app" class="hud-cta-ghost">
                                    {copy.notFoundConverter}
                                </a>
                            </div>
                        </div>

                        <div class="hud-frame hud-console hud-rise hud-d3 p-5">
                            <div class="hud-console-dim hud-mono text-[9px]">REQUEST</div>
                            <div class="hud-code mt-2 break-all text-sm text-[#ff9b9b]">{path}</div>
                            <div class="my-4 border-t border-[rgba(51,197,255,0.14)]"></div>
                            <div class="hud-console-body hud-code text-xs">status: 404</div>
                            <div class="hud-console-body hud-code text-xs">handler: none</div>
                            <div class="hud-code mt-4 text-xs text-[#4dd6ff]">-&gt; try / or /app</div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
