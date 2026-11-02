// HUD (heads-up display) style layer for the landing and 404 pages.
// Scoped to `.hud` so the converter UI keeps using plain Tailwind tokens.
export const HUD_STYLES = `
.hud {
  --hud-bg: #f3f8fc;
  --hud-surface: rgba(255, 255, 255, 0.82);
  --hud-text: #08151f;
  --hud-muted: #4f6478;
  --hud-line: rgba(6, 73, 111, 0.14);
  --hud-line-strong: rgba(6, 73, 111, 0.3);
  --hud-accent: #0082ca;
  --hud-accent-ink: #00659e;
  --hud-accent-soft: rgba(0, 130, 202, 0.1);
  --hud-signal: #0f9d63;
  --hud-grid: rgba(6, 73, 111, 0.08);
  --hud-glow: rgba(10, 163, 235, 0.16);
  --hud-display: 'Chakra Petch', 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --hud-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  --hud-ease: cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  isolation: isolate;
  background: var(--hud-bg);
  color: var(--hud-text);
}

html.dark .hud,
.dark .hud {
  --hud-bg: #04090f;
  --hud-surface: rgba(8, 16, 26, 0.72);
  --hud-text: #e6f2ff;
  --hud-muted: #8095ab;
  --hud-line: rgba(51, 197, 255, 0.16);
  --hud-line-strong: rgba(51, 197, 255, 0.32);
  --hud-accent: #33c5ff;
  --hud-accent-ink: #33c5ff;
  --hud-accent-soft: rgba(51, 197, 255, 0.12);
  --hud-signal: #4ade80;
  --hud-grid: rgba(51, 197, 255, 0.07);
  --hud-glow: rgba(51, 197, 255, 0.2);
}

/* Reticle grid: fades out below the fold so long content stays readable. */
.hud-grid-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(to right, var(--hud-grid) 1px, transparent 1px),
    linear-gradient(to bottom, var(--hud-grid) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: radial-gradient(ellipse 80% 62% at 50% 0%, #000 12%, transparent 76%);
  mask-image: radial-gradient(ellipse 80% 62% at 50% 0%, #000 12%, transparent 76%);
}

.hud-glow {
  position: absolute;
  z-index: -1;
  border-radius: 999px;
  filter: blur(90px);
  background: var(--hud-glow);
  pointer-events: none;
}

.hud-display {
  font-family: var(--hud-display);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.04;
}

.hud-mono {
  font-family: var(--hud-mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
}

.hud-accent-text {
  color: var(--hud-accent-ink);
}

.hud-code {
  font-family: var(--hud-mono);
  font-variant-numeric: tabular-nums;
}

/* Letter-spacing breaks Arabic-script shaping, so RTL drops it entirely. */
[dir='rtl'] .hud-mono {
  letter-spacing: 0;
  text-transform: none;
}

[dir='rtl'] .hud .fa-arrow-right {
  transform: scaleX(-1);
}

/* Corner-bracket frame: the one decorative signature of the page. */
.hud-frame {
  position: relative;
  border: 1px solid var(--hud-line);
  background: var(--hud-surface);
  border-radius: 2px;
}

.hud-frame::before,
.hud-frame::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  border: 1px solid var(--hud-accent);
  opacity: 0.7;
  transition: opacity 200ms ease-out, width 200ms ease-out, height 200ms ease-out;
}

.hud-frame::before {
  top: -1px;
  inset-inline-start: -1px;
  border-inline-end: 0;
  border-bottom: 0;
}

.hud-frame::after {
  bottom: -1px;
  inset-inline-end: -1px;
  border-inline-start: 0;
  border-top: 0;
}

a.hud-frame:hover::before,
a.hud-frame:hover::after,
a.hud-frame:focus-visible::before,
a.hud-frame:focus-visible::after {
  opacity: 1;
  width: 22px;
  height: 22px;
}

.hud-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 7px;
  border: 1px solid var(--hud-line-strong);
  border-radius: 2px;
  font-family: var(--hud-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--hud-muted);
  white-space: nowrap;
}

.hud-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--hud-signal);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--hud-signal) 18%, transparent);
  animation: hudPulse 2.6s ease-in-out infinite;
  flex: none;
}

.hud-dot-alert {
  background: #e5484d;
  box-shadow: 0 0 0 3px rgba(229, 72, 77, 0.18);
  animation: none;
}

/* Terminal panel stays dark in both themes: it is the contrast anchor of the hero. */
.hud-console {
  background: #050c15;
  border-color: rgba(51, 197, 255, 0.22);
  color: #cfe4f7;
  box-shadow: 0 24px 64px rgba(3, 10, 20, 0.32);
}

.hud-console::before,
.hud-console::after {
  border-color: rgba(51, 197, 255, 0.85);
  opacity: 0.9;
}

.hud-console-bar {
  border-bottom: 1px solid rgba(51, 197, 255, 0.14);
}

.hud-console-row {
  border-top: 1px solid rgba(51, 197, 255, 0.08);
}

.hud-console-tag {
  border-color: rgba(51, 197, 255, 0.28);
  color: #4dd6ff;
}

.hud-console-body {
  color: #a9c2d8;
}

.hud-console-strong {
  color: #eaf6ff;
}

.hud-console-dim {
  color: #6f8aa5;
}

.hud-scan {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.hud-scan::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  height: 34%;
  background: linear-gradient(180deg, transparent, rgba(51, 197, 255, 0.08), transparent);
  animation: hudScan 7s linear infinite;
}

.hud-ledger-row {
  transition: border-color 180ms ease-out, background-color 180ms ease-out;
}

.hud-ledger-row:hover {
  border-color: var(--hud-line-strong);
  background: color-mix(in srgb, var(--hud-accent) 4%, transparent);
}

.hud-ledger-arrow {
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 180ms ease-out, transform 180ms ease-out;
}

.hud-ledger-row:hover .hud-ledger-arrow,
.hud-ledger-row:focus-within .hud-ledger-arrow {
  opacity: 1;
  transform: none;
}

.hud-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 22px;
  border-radius: 2px;
  background: var(--hud-accent);
  color: #02121d;
  font-family: var(--hud-display);
  font-weight: 700;
  letter-spacing: 0.01em;
  transition: transform 180ms var(--hud-ease), box-shadow 180ms var(--hud-ease), filter 180ms ease-out;
}

.hud-cta:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--hud-accent) 28%, transparent);
}

.hud-cta-ghost {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 20px;
  border-radius: 2px;
  border: 1px solid var(--hud-line-strong);
  color: var(--hud-text);
  font-family: var(--hud-display);
  font-weight: 600;
  transition: border-color 180ms ease-out, background-color 180ms ease-out;
}

.hud-cta-ghost:hover {
  border-color: var(--hud-accent);
  background: var(--hud-accent-soft);
}

.hud a:focus-visible,
.hud button:focus-visible {
  outline: 2px solid var(--hud-accent);
  outline-offset: 3px;
}

@keyframes hudPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

@keyframes hudScan {
  0% { transform: translateY(-120%); }
  100% { transform: translateY(400%); }
}

@keyframes hudRise {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: none; }
}

/* One orchestrated entrance: the only animation run on load. */
.hud-rise {
  animation: hudRise 700ms var(--hud-ease) both;
}

.hud-d1 { animation-delay: 60ms; }
.hud-d2 { animation-delay: 140ms; }
.hud-d3 { animation-delay: 220ms; }
.hud-d4 { animation-delay: 300ms; }
.hud-d5 { animation-delay: 380ms; }
.hud-d6 { animation-delay: 460ms; }

@media (prefers-reduced-motion: reduce) {
  .hud *,
  .hud *::before,
  .hud *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;
