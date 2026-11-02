// Aligns the ported Sub-Hub panel with the landing/converter design system.
// Sub-Hub hardcodes gradients, glass blur and indigo tints in its own CSS, so this
// layer overrides tokens first and then the specific rules that ignore them.
export const ADMIN_THEME_HEAD = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --font-ui: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
    --font-heading: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
    --font-code: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
    --radius: 10px;
    --radius-sm: 8px;
    --radius-lg: 14px;
    --bg-body: #0b0f19;
    --bg-card: #111827;
    --bg-input: #0b0f19;
    --bg-hover: #1f2937;
    --border-color: #374151;
    --text-main: #f9fafb;
    --text-sub: #d1d5db;
    --text-dim: #9ca3af;
    --primary: #33c5ff;
    --primary-hover: #0aa3eb;
    --primary-light: #6ed4ff;
    --accent: #33c5ff;
    --success: #10b981;
    --success-light: #34d399;
    --danger: #f87171;
    --danger-light: #fca5a5;
    --warning: #fbbf24;
    --warning-light: #fcd34d;
    --info: #60a5fa;
    --info-light: #93c5fd;
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.35);
    --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.45);
    --gradient-primary: none;
    --gradient-success: none;
    --gradient-danger: none;
  }

  [data-theme='light'] {
    --bg-body: #f9fafb;
    --bg-card: #ffffff;
    --bg-input: #ffffff;
    --bg-hover: #f3f4f6;
    --border-color: #e5e7eb;
    --text-main: #111827;
    --text-sub: #4b5563;
    --text-dim: #6b7280;
    --primary: #0aa3eb;
    --primary-hover: #0082ca;
    --primary-light: #0082ca;
    --accent: #0aa3eb;
    --shadow-sm: 0 1px 2px rgba(17, 24, 39, 0.06);
    --shadow-md: 0 8px 24px rgba(17, 24, 39, 0.08);
    --shadow-lg: 0 16px 48px rgba(17, 24, 39, 0.12);
  }

  body,
  button,
  input,
  select,
  textarea {
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  }

  body {
    font-size: 14px;
    background: var(--bg-body);
  }

  /* Sub-Hub paints cards with a dark hardcoded gradient plus a glass blur. */
  .subscription-card,
  .card,
  .modal,
  .node-row,
  .batch-actions-bar {
    background: var(--bg-card) !important;
    border-color: var(--border-color) !important;
    backdrop-filter: none !important;
    box-shadow: var(--shadow-sm) !important;
  }

  .subscription-card:hover {
    box-shadow: var(--shadow-md) !important;
  }

  /* One accent colour, neutral secondary actions. */
  .btn {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    color: var(--text-sub);
    border-radius: var(--radius-sm);
    font-weight: 500;
    font-size: 13px;
    height: 34px;
    box-shadow: none;
  }

  .btn:hover {
    background: var(--bg-hover);
    color: var(--text-main);
  }

  .btn-success {
    background: var(--primary) !important;
    border-color: var(--primary) !important;
    color: #ffffff !important;
    box-shadow: none !important;
  }

  .btn-success:hover {
    background: var(--primary-hover) !important;
    border-color: var(--primary-hover) !important;
  }

  .btn-primary {
    background: var(--bg-card) !important;
    border-color: var(--border-color) !important;
    color: var(--text-main) !important;
    box-shadow: none !important;
  }

  .btn-primary:hover {
    background: var(--bg-hover) !important;
    border-color: var(--primary) !important;
    color: var(--primary) !important;
  }

  .btn-warning {
    background: transparent !important;
    border-color: var(--border-color) !important;
    color: var(--text-sub) !important;
  }

  .btn-warning:hover {
    border-color: var(--warning) !important;
    color: var(--warning) !important;
  }

  .btn-danger {
    background: transparent;
    border-color: var(--border-color);
    color: var(--danger);
  }

  .btn-danger:hover {
    border-color: var(--danger);
    background: transparent;
  }

  .link-label {
    color: var(--text-dim);
    min-width: 68px;
  }

  .link-url {
    color: var(--primary);
  }

  .link-url:hover {
    color: var(--primary-hover);
    text-decoration: underline;
  }

  .subscription-name {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .subscription-header {
    padding: 1rem 1.25rem 0.75rem;
  }

  /* Sub-Hub stretches action buttons to fill the column; keep a compact cluster. */
  .subscription-actions {
    align-items: flex-end;
  }

  .subscription-actions-row .btn {
    flex: 0 0 auto;
  }

  .link-row {
    font-size: 13px;
    gap: 0.5rem;
    min-height: 26px;
  }

  .btn-icon,
  .btn-copy-link {
    width: 28px;
    height: 28px;
    padding: 0;
    color: var(--text-dim);
  }

  .btn-icon:hover,
  .btn-copy-link:hover {
    color: var(--primary);
  }

  .sub-drag-handle {
    opacity: 0.35;
  }

  /* Sub-Hub stacks the header into a column well above phone widths. */
  .subscription-header {
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .subscription-info {
    flex: 1 1 240px;
    min-width: 0;
  }

  .subscription-actions {
    flex-direction: row !important;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  /* Flatten the two action rows so all buttons wrap as one row of four. */
  .subscription-actions-row {
    display: contents;
  }
</style>`;

export function applyAdminTheme(html) {
    if (!html.includes('</head>')) return html;
    return html.replace('</head>', `${ADMIN_THEME_HEAD}\n</head>`);
}
