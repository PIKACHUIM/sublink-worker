// Aligns the ported Sub-Hub panel with the landing/converter design system:
// same Inter type stack, same Spaceship-blue palette, same radii and shadows.
export const ADMIN_THEME_HEAD = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --font-ui: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
    --font-heading: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
    --font-code: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
    --radius: 12px;
    --radius-sm: 8px;
    --radius-lg: 16px;
    --bg-body: #0b0f19;
    --bg-card: #111827;
    --bg-input: #0b0f19;
    --bg-hover: #1f2937;
    --border-color: #374151;
    --text-main: #f9fafb;
    --text-sub: #d1d5db;
    --text-dim: #6b7280;
    --primary: #33c5ff;
    --primary-hover: #0aa3eb;
    --primary-light: #6ed4ff;
    --accent: #33c5ff;
    --success: #10b981;
    --success-light: #34d399;
    --danger: #ef4444;
    --danger-light: #f87171;
    --warning: #f59e0b;
    --warning-light: #fbbf24;
    --info: #3b82f6;
    --info-light: #60a5fa;
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.35);
    --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.45);
    --gradient-primary: linear-gradient(135deg, #33c5ff, #0aa3eb);
  }

  [data-theme='light'] {
    --bg-body: #f9fafb;
    --bg-card: #ffffff;
    --bg-input: #ffffff;
    --bg-hover: #f3f4f6;
    --border-color: #e5e7eb;
    --text-main: #111827;
    --text-sub: #4b5563;
    --text-dim: #9ca3af;
    --primary: #0aa3eb;
    --primary-hover: #0082ca;
    --primary-light: #33c5ff;
    --accent: #0aa3eb;
    --shadow-sm: 0 1px 2px rgba(17, 24, 39, 0.06);
    --shadow-md: 0 8px 24px rgba(17, 24, 39, 0.08);
    --shadow-lg: 0 16px 48px rgba(17, 24, 39, 0.12);
    --gradient-primary: linear-gradient(135deg, #33c5ff, #0aa3eb);
  }

  body,
  button,
  input,
  select,
  textarea {
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(10, 163, 235, 0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 90% 80%, rgba(51, 197, 255, 0.05) 0%, transparent 50%);
  }
</style>`;

export function applyAdminTheme(html) {
    if (!html.includes('</head>')) return html;
    return html.replace('</head>', `${ADMIN_THEME_HEAD}\n</head>`);
}
