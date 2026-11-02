import { SVG_ICONS } from './icons.js';

export function renderAdminPanel({ adminPath, converterBackendsJson }) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sub-Hub - 代理节点订阅管理系统</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
  <style>
    :root {
      --bg-body: #0a0a0f;
      --bg-card: #1a1a2e;
      --bg-input: #161625;
      --bg-hover: #252540;
      --border-color: #2d2d42;
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --primary-light: #818cf8;
      --text-main: #f0f0ff;
      --text-sub: #a1a1cc;
      --text-dim: #7171a6;
      --success: #10b981;
      --success-light: #34d399;
      --danger: #ef4444;
      --danger-light: #f87171;
      --warning: #f59e0b;
      --warning-light: #fbbf24;
      --info: #3b82f6;
      --info-light: #60a5fa;
      --radius: 12px;
      --radius-sm: 8px;
      --radius-lg: 16px;
      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
      --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4);
      --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.5);
      --font-ui: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-code: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
      --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      --gradient-success: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      --gradient-danger: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
    }

    [data-theme="light"] {
      --bg-body: #f5f5f5;
      --bg-card: #ffffff;
      --bg-input: #f0f0f0;
      --bg-hover: #e8e8e8;
      --border-color: #e0e0e0;
      --text-main: #1a1a1a;
      --text-sub: #666666;
      --text-dim: #999999;
      --success: #059669;
      --success-light: #10b981;
      --danger: #dc2626;
      --danger-light: #ef4444;
      --warning: #d97706;
      --warning-light: #f59e0b;
      --info: #2563eb;
      --info-light: #3b82f6;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: var(--bg-body);
    }

    ::-webkit-scrollbar-thumb {
      background: #3f3f46;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #52525b;
    }

    [data-theme="light"] ::-webkit-scrollbar-thumb {
      background: #c0c0c0;
    }

    [data-theme="light"] ::-webkit-scrollbar-thumb:hover {
      background: #a0a0a0;
    }

    body {
      font-family: var(--font-ui);
      background: var(--bg-body);
      color: var(--text-main);
      min-height: 100vh;
      font-size: 13px;
      line-height: 1.5;
      transition: background-color 0.3s, color 0.3s;
    }

    .navbar {
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-color);
      padding: 0 1.5rem;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
      transition: background-color 0.3s, border-color 0.3s;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-family: var(--font-code);
      font-weight: 600;
      font-size: 1rem;
      color: var(--text-main);
      text-decoration: none;
    }

    .navbar-brand .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, var(--primary) 0%, #8b5cf6 100%);
      border-radius: 8px;
      color: white;
    }

    .navbar-brand .logo svg {
      width: 18px;
      height: 18px;
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-layout {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      padding: 0 0.5rem;
      height: 32px;
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      color: var(--text-sub);
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.7rem;
      font-family: var(--font-ui);
      line-height: 1;
    }
    
    .btn-layout svg {
      vertical-align: middle;
    }
    
    .btn-layout span {
      display: inline-flex;
      align-items: center;
    }

    .btn-theme {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      color: var(--text-sub);
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-theme:hover {
      background: var(--bg-hover);
      color: var(--warning);
      border-color: var(--warning);
    }

    .btn-layout:hover {
      background: var(--bg-hover);
      color: var(--primary);
      border-color: var(--primary);
    }

    .btn-layout.active {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      color: var(--text-sub);
      font-size: 0.75rem;
      font-family: var(--font-ui);
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-logout:hover {
      background: var(--bg-hover);
      color: var(--danger);
      border-color: var(--danger);
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-title {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-family: var(--font-code);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
      padding: 0.5rem 0.875rem;
      height: 32px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      color: var(--text-main);
      font-size: 0.75rem;
      font-weight: 500;
      font-family: var(--font-ui);
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .btn:hover {
      background: var(--bg-hover);
    }

    .btn-primary {
      background: var(--gradient-primary);
      border-color: transparent;
      color: white;
      box-shadow: var(--shadow-sm);
    }

    .btn-primary:hover {
      background: var(--primary-hover);
      border-color: var(--primary-hover);
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }

    .btn-success {
      background: var(--gradient-success);
      border-color: transparent;
      color: white;
      box-shadow: var(--shadow-sm);
    }

    .btn-success:hover {
      background: var(--success-light);
      border-color: var(--success-light);
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }

    .btn-danger {
      background: transparent;
      border-color: var(--danger);
      color: var(--danger);
    }

    .btn-danger:hover {
      background: var(--danger);
      color: white;
    }

    .btn-warning {
      background: var(--warning);
      border-color: var(--warning);
      color: #000;
    }

    .btn-warning:hover {
      background: var(--warning-light);
      border-color: var(--warning-light);
    }

    .btn-info {
      background: var(--info);
      border-color: var(--info);
      color: white;
    }

    .btn-info:hover {
      background: var(--info-light);
      border-color: var(--info-light);
    }

    .btn-sm {
      height: 26px;
      padding: 0 0.5rem;
      font-size: 0.7rem;
    }

    .btn-icon {
      width: 26px;
      height: 26px;
      padding: 0;
    }

    .btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* 订阅卡片 - 科技感设计 */
    .subscription-card {
      background: linear-gradient(145deg, var(--bg-card), rgba(26, 26, 46, 0.8));
      border: 1px solid rgba(99, 102, 241, 0.15);
      border-radius: var(--radius-lg);
      margin-bottom: 1.25rem;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 
        0 4px 20px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
      position: relative;
      backdrop-filter: blur(10px);
    }

    .subscription-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
      transition: left 0.6s ease;
    }

    .subscription-card:hover {
      box-shadow: 
        0 8px 40px rgba(99, 102, 241, 0.2),
        0 2px 8px rgba(0, 0, 0, 0.4);
      transform: translateY(-4px) scale(1.01);
      border-color: rgba(99, 102, 241, 0.3);
    }

    .subscription-card:hover::before {
      left: 100%;
    }

    .subscription-header {
      padding: 1rem 1.25rem;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      position: relative;
    }

    .sub-drag-handle {
      cursor: grab;
      color: var(--text-dim);
      opacity: 0.5;
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
      padding: 0.25rem;
      margin-right: 0.5rem;
      flex-shrink: 0;
    }

    .sub-drag-handle:hover {
      opacity: 1;
      color: var(--primary);
    }

    .subscription-info {
      flex: 1;
      min-width: 0;
    }

    .subscription-title-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
      flex-wrap: wrap;
    }

    .subscription-name {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-main);
      font-family: var(--font-ui);
    }

    .node-count {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.125rem 0.5rem;
      background: var(--bg-input);
      border-radius: 999px;
      font-size: 0.7rem;
      font-family: var(--font-code);
      color: var(--text-sub);
    }

    .update-time {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.7rem;
      font-family: var(--font-code);
      color: var(--text-dim);
    }

    .subscription-links {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .link-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
    }

    .link-label {
      color: var(--text-dim);
      font-family: var(--font-code);
      min-width: 70px;
    }

    .link-url {
      color: var(--primary-light);
      font-family: var(--font-code);
      text-decoration: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 200px;
      transition: color 0.2s;
    }

    .link-url:hover {
      color: var(--primary);
      text-decoration: underline;
    }

    .btn-copy-link {
      opacity: 0.6;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .btn-copy-link:hover {
      opacity: 1;
      color: var(--primary);
    }

    .btn-copy-link.copied {
      color: var(--success) !important;
      opacity: 1;
    }

    .subscription-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .subscription-actions-row {
      display: flex;
      gap: 0.5rem;
    }

    .subscription-actions-row .btn {
      flex: 1;
      min-width: 0;
    }

    /* 紧凑模式样式 */
      flex: 1;
      min-width: 0;
    }
    

    /* 紧凑模式样式 */
    .compact-mode .subscription-card {
      margin-bottom: 0;
      border-radius: 0;
      border-bottom: none;
    }
    
    .compact-mode .subscription-card:first-child {
      border-radius: var(--radius) var(--radius) 0 0;
    }
    
    .compact-mode .subscription-card:last-child {
      border-radius: 0 0 var(--radius) var(--radius);
      border-bottom: 1px solid var(--border-color);
    }
    
    .compact-mode .subscription-card:only-child {
      border-radius: var(--radius);
      border-bottom: 1px solid var(--border-color);
    }
    
    .compact-mode .subscription-header {
      padding: 0.5rem 1rem;
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
    }
    
    .compact-mode .subscription-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
      min-width: 0;
    }
    
    .compact-mode .subscription-title-row {
      margin-bottom: 0;
      flex-wrap: nowrap;
      flex-shrink: 0;
    }
    
    .compact-mode .update-time {
      display: none;
    }
    
    .compact-mode .subscription-links {
      display: none;
    }
    
    .compact-mode .compact-links {
      display: flex !important;
      align-items: center;
      gap: 0.375rem;
      flex: 1;
      overflow: hidden;
    }
    
    .compact-links {
      display: none;
    }
    
    .compact-link-item {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.5rem;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 0.65rem;
      font-family: var(--font-code);
      color: var(--text-sub);
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }
    
    .compact-link-item:hover {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }
    
    .compact-mode .subscription-actions {
      flex-direction: row;
      flex-wrap: nowrap;
      gap: 0.375rem;
    }
    
    .compact-mode .subscription-actions-row {
      display: contents;
    }
    
    .compact-mode .subscription-actions .btn {
      flex: none;
      padding: 0.375rem 0.625rem;
      height: 28px;
      font-size: 0.7rem;
    }
    
    @media (max-width: 992px) {
      .compact-mode .compact-links {
        display: none !important;
      }
      
      .compact-mode .subscription-header {
        flex-wrap: wrap;
      }
      
      .compact-mode .subscription-actions {
        width: 100%;
        margin-top: 0.5rem;
        flex-wrap: wrap;
      }
      
      .compact-mode .subscription-actions .btn {
        flex: 1;
      }
    }
    
    

    /* 下拉菜单 */
    .dropdown {
      position: relative;
      display: inline-block;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 4px;
      min-width: 200px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px);
      transition: all 0.15s ease;
    }

    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      color: var(--text-main);
      font-size: 0.75rem;
      cursor: pointer;
      transition: background-color 0.15s;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }

    .dropdown-item:hover {
      background: var(--bg-hover);
    }

    .dropdown-item:first-child {
      border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    }

    .dropdown-item:last-child {
      border-radius: 0 0 var(--radius-sm) var(--radius-sm);
    }

    .dropdown-divider {
      height: 1px;
      background: var(--border-color);
      margin: 0.25rem 0;
    }

    /* 节点列表区域 */
    .node-list-area {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
      border-top: 1px solid transparent;
    }

    .node-list-area.expanded {
      max-height: none;
      border-top-color: var(--border-color);
      overflow: visible;
    }

    .node-list-content {
      padding: 1rem 1.25rem;
    }

    .node-toolbar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .node-search {
      flex: 1;
      min-width: 200px;
      position: relative;
    }

    .node-search input {
      width: 100%;
      padding: 0.5rem 0.75rem 0.5rem 2rem;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      color: var(--text-main);
      font-size: 0.8rem;
      font-family: var(--font-code);
      transition: all 0.2s ease;
    }

    .node-search input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .node-search input::placeholder {
      color: var(--text-dim);
    }

    .node-search-icon {
      position: absolute;
      left: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-dim);
    }

    .node-filters {
      display: flex;
      gap: 0.25rem;
      flex-wrap: wrap;
    }

    .node-filter-btn {
      padding: 0.25rem 0.5rem;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      color: var(--text-sub);
      font-size: 0.65rem;
      font-family: var(--font-code);
      cursor: pointer;
      transition: all 0.15s;
      text-transform: uppercase;
    }

    .node-filter-btn:hover {
      background: var(--bg-hover);
      border-color: var(--primary);
    }

    .node-filter-btn.active {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }

    /* 节点表格 */
    .node-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    .node-table th {
      text-align: left;
      padding: 0.5rem 0.75rem;
      font-size: 0.7rem;
      font-weight: 500;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border-color);
      font-family: var(--font-code);
    }

    .node-row {
      border-bottom: 1px solid var(--border-color);
      transition: all 0.15s ease;
    }

    .node-row:last-child {
      border-bottom: none;
    }

    .node-row:hover {
      background: var(--bg-hover);
      transform: translateX(2px);
    }

    .node-row td {
      padding: 0.625rem 0.75rem;
      vertical-align: middle;
    }

    .node-row.disabled {
      opacity: 0.5;
    }

    .node-row.disabled .node-name {
      text-decoration: line-through;
    }

    .node-row.hidden {
      display: none;
    }

    .node-cell-name {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .node-checkbox {
      width: 14px;
      height: 14px;
      cursor: pointer;
      accent-color: var(--primary);
      display: none;
    }

    .batch-mode .node-checkbox {
      display: inline-block;
    }

    .drag-handle {
      cursor: grab;
      color: var(--text-dim);
      opacity: 0.5;
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
    }

    .drag-handle:hover {
      opacity: 1;
      color: var(--primary);
    }

    .node-name {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-code);
      font-size: 0.8rem;
      color: var(--text-main);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .node-name-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .node-actions {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      justify-content: flex-end;
    }

    /* 节点类型标签 */
    .node-type-tag {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-size: 0.6rem;
      font-weight: 600;
      font-family: var(--font-code);
      text-transform: uppercase;
      flex-shrink: 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .node-type-ss { background: var(--success); color: white; }
    .node-type-vmess { background: var(--primary); color: white; }
    .node-type-trojan { background: var(--danger); color: white; }
    .node-type-vless { background: var(--info); color: white; }
    .node-type-hysteria2 { background: var(--warning); color: #000; }
    .node-type-tuic { background: #ec4899; color: white; }
    .node-type-socks { background: #6b7280; color: white; }
    .node-type-snell { background: #14b8a6; color: white; }
    .node-type-unknown { background: #374151; color: white; }

    /* 批量操作栏 */
    .batch-actions-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      background: var(--bg-input);
      border-radius: var(--radius-sm);
      margin-bottom: 1rem;
      box-shadow: var(--shadow-sm);
    }

    .batch-actions-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .batch-actions-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* 拖拽样式 */
    .sortable-ghost {
      opacity: 0.4;
      background: var(--primary) !important;
    }

    .sortable-drag {
      background: var(--bg-card);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }

    .sortable-chosen {
      background: var(--bg-hover);
    }

    /* 模态框 */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s, visibility 0.2s;
      padding: 1rem;
    }

    .modal-overlay.show {
      opacity: 1;
      visibility: visible;
    }

    .modal {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      width: 100%;
      max-width: 480px;
      max-height: 90vh;
      overflow: hidden;
      transform: scale(0.95);
      transition: transform 0.2s, background-color 0.3s, border-color 0.3s;
    }

    .modal-overlay.show .modal {
      transform: scale(1);
    }

    .modal-lg {
      max-width: 640px;
    }

    .modal-header {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .modal-title svg {
      color: var(--primary);
    }

    .modal-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: transparent;
      border: none;
      border-radius: var(--radius-sm);
      color: var(--text-sub);
      cursor: pointer;
      transition: all 0.15s;
    }

    .modal-close:hover {
      background: var(--bg-hover);
      color: var(--text-main);
    }

    .modal-body {
      padding: 1.25rem;
      overflow-y: auto;
      max-height: 60vh;
    }

    .modal-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .modal-footer-split {
      justify-content: space-between;
    }

    /* 表单 */
    .form-group {
      margin-bottom: 1rem;
    }

    .form-group:last-child {
      margin-bottom: 0;
    }

    .form-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-sub);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-label .required {
      color: var(--danger);
    }

    .form-input, .form-select {
      width: 100%;
      padding: 0.625rem 0.875rem;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      color: var(--text-main);
      font-size: 0.8125rem;
      font-family: var(--font-code);
      transition: border-color 0.2s, box-shadow 0.2s, background-color 0.3s;
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }

    .form-input::placeholder {
      color: var(--text-dim);
    }

    .form-hint {
      font-size: 0.7rem;
      color: var(--text-dim);
      margin-top: 0.375rem;
      font-family: var(--font-code);
    }

    .form-error {
      font-size: 0.7rem;
      color: var(--danger);
      margin-top: 0.375rem;
      display: none;
    }

    .form-error.show {
      display: block;
    }

    textarea.form-input {
      min-height: 200px;
      resize: vertical;
      line-height: 1.6;
    }

    /* Toast */
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.75rem 1rem;
      background: var(--bg-card);
      backdrop-filter: blur(8px);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      font-family: var(--font-code);
      color: var(--text-main);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transform: translateX(120%);
      transition: transform 0.3s ease, background-color 0.3s;
      max-width: 360px;
    }

    .toast.show {
      transform: translateX(0);
    }

    .toast-icon {
      flex-shrink: 0;
    }

    .toast-success { border-left: 3px solid var(--success); }
    .toast-success .toast-icon { color: var(--success); }

    .toast-danger { border-left: 3px solid var(--danger); }
    .toast-danger .toast-icon { color: var(--danger); }

    .toast-warning { border-left: 3px solid var(--warning); }
    .toast-warning .toast-icon { color: var(--warning); }

    .toast-info { border-left: 3px solid var(--info); }
    .toast-info .toast-icon { color: var(--info); }

    .toast-prefix {
      color: var(--text-dim);
    }

    /* 空状态 */
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--text-dim);
      font-family: var(--font-code);
      font-size: 0.8rem;
    }

    .empty-state-large {
      padding: 3rem 2rem;
    }

    .empty-state-large svg {
      color: var(--text-dim);
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state-large h3 {
      font-size: 1rem;
      color: var(--text-main);
      margin-bottom: 0.5rem;
    }

    .empty-state-large p {
      font-size: 0.8rem;
      color: var(--text-sub);
      margin-bottom: 1rem;
    }

    /* 加载动画 */
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    /* 二维码模态框 */
    .qrcode-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .qrcode-image {
      background: white;
      padding: 1rem;
      border-radius: var(--radius);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qrcode-image img {
      display: block;
      width: 200px;
      height: 200px;
      min-width: 200px;
      min-height: 200px;
    }

    .qrcode-url {
      font-size: 0.75rem;
      font-family: var(--font-code);
      color: var(--text-sub);
      word-break: break-all;
      text-align: center;
      max-width: 100%;
      padding: 0 1rem;
    }

    /* 响应式 */
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .subscription-header {
        flex-direction: column;
      }

      .subscription-actions {
        width: 100%;
      }

      .subscription-actions-row {
        width: 100%;
      }

      .subscription-actions-row .btn {
        flex: 1;
      }

      .subscription-links {
        width: 100%;
      }

      .link-url {
        max-width: 120px;
      }

      .node-name {
        max-width: 150px;
      }

      .node-actions {
        flex-wrap: nowrap;
      }

      .batch-actions-bar {
        flex-direction: column;
        gap: 0.75rem;
      }

      .batch-actions-left,
      .batch-actions-right {
        width: 100%;
        flex-wrap: wrap;
      }

      .batch-actions-right .btn {
        flex: 1;
      }

      .toast-container {
        left: 1rem;
        right: 1rem;
      }

      .toast {
        max-width: 100%;
      }

      .modal {
        max-height: 85vh;
      }

      .modal-body {
        max-height: 50vh;
      }

      .node-toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .node-search {
        min-width: auto;
      }

      .node-filters {
        overflow-x: auto;
        flex-wrap: nowrap;
        padding-bottom: 0.25rem;
      }
    }
  </style>
</head>
<body>
  <nav class="navbar">
    <a class="navbar-brand" href="#">
      <span class="logo">${SVG_ICONS.cube}</span>
      <span>Sub-Hub 管理系统</span>
    </a>
    <div class="navbar-right">
    <button class="btn-layout" id="layoutToggle" onclick="toggleLayout()" title="切换布局">
    <span id="layoutIcon">${SVG_ICONS.layoutList}</span>
    <span id="layoutText">紧凑</span>
  </button>
      <button class="btn-theme" onclick="toggleTheme()" title="切换主题">
        <span id="themeIcon">${SVG_ICONS.moon}</span>
      </button>
      <a href="/" class="btn-theme" title="返回前台" style="width:auto;padding:0 12px;gap:6px;text-decoration:none;">
        ${SVG_ICONS.cube}
        <span style="font-size:13px;">前台</span>
      </a>
      <a href="/${adminPath}/logout" class="btn-logout">
        ${SVG_ICONS.logout}
        <span>退出</span>
      </a>
    </div>
  </nav>

  <div class="container">
  <div class="page-header">
  <div class="page-title">
    ${SVG_ICONS.terminal} 订阅管理控制台
    <span id="globalStats" style="margin-left: 1rem; font-size: 0.7rem; color: var(--text-dim);"></span>
  </div>
  <button class="btn btn-primary" onclick="showModal('addSubscriptionModal')">

        ${SVG_ICONS.plus}
        <span>添加订阅</span>
      </button>
    </div>

    <div id="subscriptionList"></div>
  </div>

  <!-- 添加订阅模态框 -->
  <div class="modal-overlay" id="addSubscriptionModal">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">${SVG_ICONS.plus} 添加订阅</h3>
        <button class="modal-close" onclick="hideModal('addSubscriptionModal')">${SVG_ICONS.x}</button>
      </div>
      <div class="modal-body">
        <form id="addSubscriptionForm" onsubmit="return false;">
          <div class="form-group">
            <label class="form-label">订阅名称 <span class="required">*</span></label>
            <input type="text" class="form-input" name="name" required placeholder="例如: My Subscription">
          </div>
          <div class="form-group">
            <label class="form-label">订阅路径 <span class="required">*</span></label>
            <input type="text" class="form-input" name="path" required pattern="^[a-z0-9-]+$" minlength="5" maxlength="50" placeholder="例如: my-sub-path">
            <div class="form-hint">仅支持小写字母、数字和连字符，5-50个字符</div>
            <div class="form-error" id="addSubPathError"></div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="hideModal('addSubscriptionModal')">取消</button>
        <button class="btn btn-primary" onclick="createSubscription()">创建</button>
      </div>
    </div>
  </div>

  <!-- 编辑订阅模态框 -->
  <div class="modal-overlay" id="editSubscriptionModal">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">${SVG_ICONS.edit} 编辑订阅</h3>
        <button class="modal-close" onclick="hideModal('editSubscriptionModal')">${SVG_ICONS.x}</button>
      </div>
      <div class="modal-body">
        <form id="editSubscriptionForm" onsubmit="return false;">
          <input type="hidden" name="originalPath">
          <div class="form-group">
            <label class="form-label">订阅名称 <span class="required">*</span></label>
            <input type="text" class="form-input" name="name" required>
          </div>
          <div class="form-group">
            <label class="form-label">订阅路径 <span class="required">*</span></label>
            <input type="text" class="form-input" name="path" required pattern="^[a-z0-9-]+$" minlength="5" maxlength="50">
            <div class="form-hint">仅支持小写字母、数字和连字符，5-50个字符</div>
            <div class="form-error" id="editSubPathError"></div>
          </div>
          <div class="form-group">
            <label class="form-label">订阅转换后端</label>
            <select class="form-select" name="converterBackend" id="editConverterBackend">
            </select>
            <div class="form-hint">选择不同的订阅转换后端服务器</div>
          </div>
        </form>
      </div>
      <div class="modal-footer modal-footer-split">
        <button class="btn btn-danger" onclick="confirmDeleteSubscription()">
          ${SVG_ICONS.trash} 删除订阅
        </button>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn" onclick="hideModal('editSubscriptionModal')">取消</button>
          <button class="btn btn-primary" onclick="updateSubscriptionInfo()">保存</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 添加节点模态框 -->
  <div class="modal-overlay" id="addNodeModal">
    <div class="modal modal-lg">
      <div class="modal-header">
        <h3 class="modal-title">${SVG_ICONS.plus} 添加节点</h3>
        <button class="modal-close" onclick="hideModal('addNodeModal')">${SVG_ICONS.x}</button>
      </div>
      <div class="modal-body">
        <form id="addNodeForm" onsubmit="return false;">
          <input type="hidden" name="subscriptionPath">
          <div class="form-group">
            <label class="form-label">节点内容 <span class="required">*</span></label>
            <textarea class="form-input" name="content" required placeholder="支持的格式：
ss://...
vmess://...
trojan://...
vless://...
socks://...
hysteria2://...
tuic://...
wireguard://...
snell格式（仅Surge）
Base64编码格式

可一次添加多个节点，每行一个"></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="hideModal('addNodeModal')">取消</button>
        <button class="btn btn-primary" onclick="createNode()">${SVG_ICONS.plus} 添加</button>
      </div>
    </div>
  </div>

  <!-- 替换节点模态框 -->
  <div class="modal-overlay" id="replaceNodeModal">
    <div class="modal modal-lg">
      <div class="modal-header">
        <h3 class="modal-title">${SVG_ICONS.refresh} 替换节点</h3>
        <button class="modal-close" onclick="hideModal('replaceNodeModal')">${SVG_ICONS.x}</button>
      </div>
      <div class="modal-body">
        <form id="replaceNodeForm" onsubmit="return false;">
          <input type="hidden" name="subscriptionPath">
          <div class="form-group">
            <label class="form-label">新节点内容 <span class="required">*</span></label>
            <textarea class="form-input" name="content" required placeholder="粘贴新的节点内容，将删除所有旧节点并替换为新节点

支持的格式：
ss://...
vmess://...
trojan://...
vless://...
socks://...
hysteria2://...
tuic://...
snell格式（仅Surge）
Base64编码格式

可一次添加多个节点，每行一个"></textarea>
          </div>
          <div class="form-hint" style="color: var(--warning);">⚠️ 此操作将删除该订阅下的所有现有节点！</div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="hideModal('replaceNodeModal')">取消</button>
        <button class="btn btn-warning" onclick="replaceNodes()">${SVG_ICONS.refresh} 确认替换</button>
      </div>
    </div>
  </div>

  <!-- 编辑节点模态框 -->
  <div class="modal-overlay" id="editNodeModal">
    <div class="modal modal-lg">
      <div class="modal-header">
        <h3 class="modal-title">${SVG_ICONS.edit} 编辑节点</h3>
        <button class="modal-close" onclick="hideModal('editNodeModal')">${SVG_ICONS.x}</button>
      </div>
      <div class="modal-body">
        <form id="editNodeForm" onsubmit="return false;">
          <input type="hidden" name="subscriptionPath">
          <input type="hidden" name="nodeId">
          <div class="form-group">
            <label class="form-label">节点内容 <span class="required">*</span></label>
            <textarea class="form-input" name="content" required></textarea>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="hideModal('editNodeModal')">取消</button>
        <button class="btn btn-primary" onclick="updateNode()">保存</button>
      </div>
    </div>
  </div>

  <!-- 二维码模态框 -->
  <div class="modal-overlay" id="qrcodeModal">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">${SVG_ICONS.qrcode} 订阅二维码</h3>
        <button class="modal-close" onclick="hideModal('qrcodeModal')">${SVG_ICONS.x}</button>
      </div>
      <div class="modal-body">
        <div class="qrcode-container">
          <div class="qrcode-image">
            <img id="qrcodeImage" src="" alt="QR Code">
          </div>
          <div class="qrcode-url" id="qrcodeUrl"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="copyQRCodeUrl()">复制链接</button>
      </div>
    </div>
  </div>

  <!-- Toast容器 -->
  <div class="toast-container" id="toastContainer"></div>

  <script>
    const adminPath = '${adminPath}';
    const CONVERTER_BACKENDS = ${converterBackendsJson};
    
    const SVG_ICONS = {
      cube: \`${SVG_ICONS.cube}\`,
      server: \`${SVG_ICONS.server}\`,
      edit: \`${SVG_ICONS.edit}\`,
      copy: \`${SVG_ICONS.copy}\`,
      trash: \`${SVG_ICONS.trash}\`,
      plus: \`${SVG_ICONS.plus}\`,
      list: \`${SVG_ICONS.list}\`,
      arrowUp: \`${SVG_ICONS.arrowUp}\`,
      arrowDown: \`${SVG_ICONS.arrowDown}\`,
      chevronsUp: \`${SVG_ICONS.chevronsUp}\`,
      chevronsDown: \`${SVG_ICONS.chevronsDown}\`,
      check: \`${SVG_ICONS.check}\`,
      x: \`${SVG_ICONS.x}\`,
      checkSquare: \`${SVG_ICONS.checkSquare}\`,
      toggleOn: \`${SVG_ICONS.toggleOn}\`,
      toggleOff: \`${SVG_ICONS.toggleOff}\`,
      tasks: \`${SVG_ICONS.tasks}\`,
      grip: \`${SVG_ICONS.grip}\`,
      terminal: \`${SVG_ICONS.terminal}\`,
      info: \`${SVG_ICONS.info}\`,
      alertTriangle: \`${SVG_ICONS.alertTriangle}\`,
      alertCircle: \`${SVG_ICONS.alertCircle}\`,
      loader: \`${SVG_ICONS.loader}\`,
      externalLink: \`${SVG_ICONS.externalLink}\`,
      sun: \`${SVG_ICONS.sun}\`,
      moon: \`${SVG_ICONS.moon}\`,
      qrcode: \`${SVG_ICONS.qrcode}\`,
      refresh: \`${SVG_ICONS.refresh}\`,
      copyAll: \`${SVG_ICONS.copyAll}\`,
      download: \`${SVG_ICONS.download}\`,
      chevronDown: \`${SVG_ICONS.chevronDown}\`,
      clock: \`${SVG_ICONS.clock}\`,
      settings: \`${SVG_ICONS.settings}\`,
      search: \`${SVG_ICONS.search}\`,
      filter: \`${SVG_ICONS.filter}\`,
      layoutGrid: \`${SVG_ICONS.layoutGrid}\`,
      layoutList: \`${SVG_ICONS.layoutList}\`,
      package: \`${SVG_ICONS.package}\`
    };

    // 存储订阅数据
    let subscriptionsData = [];
    let currentQRCodeUrl = '';
    let isCompactMode = localStorage.getItem('compactMode') === 'true';

    // 初始化后端选择器
    function initConverterSelect() {
      const select = document.getElementById('editConverterBackend');
      if (select) {
        select.innerHTML = CONVERTER_BACKENDS.map(b => 
          \`<option value="\${b.id}">\${b.name} (\${b.label})</option>\`
        ).join('');
      }
    }

    // 布局切换
    function initLayout() {
      updateLayoutUI();
    }

    function toggleLayout() {
      isCompactMode = !isCompactMode;
      localStorage.setItem('compactMode', isCompactMode);
      updateLayoutUI();
      loadSubscriptions();
    }

    function updateLayoutUI() {
      const btn = document.getElementById('layoutToggle');
      const icon = document.getElementById('layoutIcon');
      const text = document.getElementById('layoutText');
      if (isCompactMode) {
        btn.classList.add('active');
        icon.innerHTML = SVG_ICONS.layoutList;
        text.textContent = '紧凑';
        document.getElementById('subscriptionList').classList.add('compact-mode');
      } else {
        btn.classList.remove('active');
        icon.innerHTML = SVG_ICONS.layoutGrid;
        text.textContent = '宽松';
        document.getElementById('subscriptionList').classList.remove('compact-mode');
      }
    }
    
    

    // 主题切换功能
    function initTheme() {
      const savedTheme = localStorage.getItem('theme')
        || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', savedTheme);
      updateThemeIcon(savedTheme);
    }

    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
      const iconEl = document.getElementById('themeIcon');
      iconEl.innerHTML = theme === 'dark' ? SVG_ICONS.moon : SVG_ICONS.sun;
    }

    // 节点类型常量
    const NODE_TYPES_FRONTEND = {
      SS: 'ss://',
      VMESS: 'vmess://',
      TROJAN: 'trojan://',
      VLESS: 'vless://',
      SOCKS: 'socks://',
      HYSTERIA2: 'hysteria2://',
      TUIC: 'tuic://',
      SNELL: 'snell,',
      WIREGUARD: 'wireguard://'
    };

    // 获取节点类型
    function getNodeType(nodeLink) {
      if (!nodeLink) return 'unknown';
      const lowerLink = nodeLink.toLowerCase();
      
      if (lowerLink.startsWith('ss://')) return 'ss';
      if (lowerLink.startsWith('vmess://')) return 'vmess';
      if (lowerLink.startsWith('trojan://')) return 'trojan';
      if (lowerLink.startsWith('vless://')) return 'vless';
      if (lowerLink.startsWith('hysteria2://')) return 'hysteria2';
      if (lowerLink.startsWith('tuic://')) return 'tuic';
      if (lowerLink.startsWith('socks://')) return 'socks';
      if (lowerLink.startsWith('wireguard://')) return 'wireguard';
      if (lowerLink.includes('snell,')) return 'snell';
      
      return 'unknown';
    }

    function getNodeTypeLabel(type) {
      const labels = {
        ss: 'SS',
        vmess: 'VMess',
        trojan: 'Trojan',
        vless: 'VLESS',
        hysteria2: 'Hy2',
        tuic: 'TUIC',
        socks: 'SOCKS',
        snell: 'Snell',
        unknown: '?'
      };
      return labels[type] || '?';
    }

    function isMobileDevice() {
      return window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // 格式化相对时间
    function formatRelativeTime(timestamp) {
      if (!timestamp) return '从未更新';
      
      const now = Date.now();
      const diff = now - timestamp;
      
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (seconds < 60) return '刚刚';
      if (minutes < 60) return \`\${minutes}分钟前\`;
      if (hours < 24) return \`\${hours}小时前\`;
      if (days < 30) return \`\${days}天前\`;
      
      const date = new Date(timestamp);
      return date.toLocaleDateString('zh-CN');
    }

    // Toast 提示
    function showToast(message, type = 'success') {
      const container = document.getElementById('toastContainer');
      const toast = document.createElement('div');
      toast.className = \`toast toast-\${type}\`;
      
      const icons = {
        success: SVG_ICONS.check,
        danger: SVG_ICONS.alertCircle,
        warning: SVG_ICONS.alertTriangle,
        info: SVG_ICONS.info
      };
      
      const prefixes = {
        success: '[OK]',
        danger: '[ERR]',
        warning: '[WARN]',
        info: '[INFO]'
      };
      
      toast.innerHTML = \`
        <span class="toast-icon">\${icons[type] || icons.info}</span>
        <span class="toast-prefix">\${prefixes[type] || prefixes.info}</span>
        <span>\${message}</span>
      \`;
      
      container.appendChild(toast);
      
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    // 模态框控制
    function showModal(id) {
      document.getElementById(id).classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    function hideModal(id) {
      document.getElementById(id).classList.remove('show');
      document.body.style.overflow = '';
    }

    // 复制到剪贴板（带动画）
    function copyToClipboard(text, buttonEl) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('已复制到剪贴板', 'success');
        if (buttonEl) {
          const originalHTML = buttonEl.innerHTML;
          buttonEl.innerHTML = SVG_ICONS.check;
          buttonEl.classList.add('copied');
          setTimeout(() => {
            buttonEl.innerHTML = originalHTML;
            buttonEl.classList.remove('copied');
          }, 1500);
        }
      }).catch(() => {
        showToast('复制失败', 'danger');
      });
    }



    // 显示节点二维码
    function showNodeQRCode(nodeLink, nodeName) {
      const qrcodeImage = document.getElementById('qrcodeImage');
      const qrcodeUrl = document.getElementById('qrcodeUrl');
      
      // 更新模态框标题显示节点名称
      const displayName = nodeName.length > 30 ? nodeName.substring(0, 30) + '...' : nodeName;
      document.querySelector('#qrcodeModal .modal-title').innerHTML = SVG_ICONS.qrcode + ' ' + displayName;
      
      // 生成二维码
      const qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(nodeLink);
      qrcodeImage.src = qrApiUrl;
      
      // 显示链接（太长就截断）
      qrcodeUrl.textContent = nodeLink.length > 80 ? nodeLink.substring(0, 80) + '...' : nodeLink;
      
      currentQRCodeUrl = nodeLink;
      showModal('qrcodeModal');
    }
    
    






    // 显示二维码
    function showQRCode(url) {
      currentQRCodeUrl = url;
      const qrcodeImage = document.getElementById('qrcodeImage');
      const qrcodeUrl = document.getElementById('qrcodeUrl');
      
      const qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(url);
      qrcodeImage.src = qrApiUrl;
      qrcodeUrl.textContent = url;
      
      showModal('qrcodeModal');
    }

    function copyQRCodeUrl() {
      copyToClipboard(currentQRCodeUrl);
    }

    // 生成订阅转换器链接
    function generateSubConverterUrl(path, backend, target = 'clash') {
      const origin = window.location.origin;
      const v2rayUrl = origin + '/' + path + '/v2ray';
      const encodedUrl = encodeURIComponent(v2rayUrl);
      
      const backendUrl = backend || 'sub.xeton.dev';
      
      let targetParam = target;
      let extraParams = '';
      
      switch(target) {
        case 'clash':
          targetParam = 'clash';
          break;
        case 'surge':
          targetParam = 'surge';
          extraParams = '&ver=4';
          break;
        case 'loon':
          targetParam = 'loon';
          break;
        case 'quanx':
          targetParam = 'quanx';
          break;
        case 'shadowrocket':
          targetParam = 'mixed';
          break;
        default:
          targetParam = 'clash';
      }
      
      return \`https://\${backendUrl}/sub?target=\${targetParam}&url=\${encodedUrl}&insert=false&config=https%3A%2F%2Fraw.githubusercontent.com%2Fszkane%2FClashRuleSet%2Fmain%2FClash%2Fkclash.ini&emoji=true&list=false&xudp=false&udp=true&tfo=false&expand=false&scv=false&fdn=false&new_name=true\${extraParams}\`;
    }

    // 一键导入各客户端
    function importToClient(path, backend, client) {
      const converterUrl = generateSubConverterUrl(path, backend, client === 'surge' ? 'surge' : client === 'quanx' ? 'quanx' : client === 'loon' ? 'loon' : 'clash');
      
      let importUrl = '';
      switch(client) {
        case 'clash':
          importUrl = 'clash://install-config?url=' + encodeURIComponent(converterUrl);
          break;
        case 'stash':
          importUrl = 'stash://install-config?url=' + encodeURIComponent(converterUrl);
          break;
        case 'surge':
          importUrl = 'surge:///install-config?url=' + encodeURIComponent(converterUrl);
          break;
        case 'loon':
          importUrl = 'loon://import?sub=' + encodeURIComponent(converterUrl);
          break;
        case 'shadowrocket':
          const origin = window.location.origin;
          const v2rayUrl = origin + '/' + path + '/v2ray';
          importUrl = 'sub://' + btoa(v2rayUrl);
          break;
        case 'quanx':
          importUrl = 'quantumult-x:///add-resource?remote-resource=' + encodeURIComponent(JSON.stringify({
            server_remote: [converterUrl + ', tag=SubHub']
          }));
          break;
      }
      
      if (importUrl) {
        window.location.href = importUrl;
        showToast(\`正在唤起 \${client} 客户端...\`, 'info');
      }
    }

    // 关闭所有下拉菜单
    function closeAllDropdowns() {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
      });
    }

    // 切换下拉菜单
    function toggleDropdown(e, menuId) {
      e.stopPropagation();
      const menu = document.getElementById(menuId);
      const isOpen = menu.classList.contains('show');
      closeAllDropdowns();
      if (!isOpen) {
        menu.classList.add('show');
      }
    }

    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', closeAllDropdowns);

    // 复制订阅链接
    function copySubscriptionLink(path, type, backend, btnEl) {
      const origin = window.location.origin;
      let url = '';
      switch(type) {
        case 1: url = origin + '/' + path; break;
        case 2: url = origin + '/' + path + '/v2ray'; break;
        case 3: url = origin + '/' + path + '/surge'; break;
        case 4: url = origin + '/' + path + '/clash'; break;
        case 5: url = generateSubConverterUrl(path, backend); break;
      }
      copyToClipboard(url, btnEl);
    }

    // 显示订阅二维码
    function showSubscriptionQRCode(path, type, backend) {
      const origin = window.location.origin;
      let url = '';
      switch(type) {
        case 1: url = origin + '/' + path; break;
        case 2: url = origin + '/' + path + '/v2ray'; break;
        case 3: url = origin + '/' + path + '/surge'; break;
        case 4: url = origin + '/' + path + '/clash'; break;
        case 5: url = generateSubConverterUrl(path, backend); break;
      }
      showQRCode(url);
    }

    // 复制所有节点
    async function copyAllNodes(subscriptionPath) {
      try {
        const response = await fetch('/' + adminPath + '/api/subscriptions/' + subscriptionPath + '/nodes');
        if (!response.ok) throw new Error('加载失败');
        
        const result = await response.json();
        if (!result.success) throw new Error(result.message || '加载失败');
        
        const nodes = result.data || [];
        const enabledNodes = nodes.filter(n => n.enabled === 1);
        
        if (enabledNodes.length === 0) {
          showToast('没有已启用的节点', 'warning');
          return;
        }
        
        const allLinks = enabledNodes.map(n => n.original_link).join('\\n');
        copyToClipboard(allLinks);
        showToast(\`已复制 \${enabledNodes.length} 个节点\`, 'success');
      } catch (error) {
        showToast('复制失败: ' + error.message, 'danger');
      }
    }

    // 显示替换节点模态框
    function showReplaceNodeModal(subscriptionPath) {
      const form = document.getElementById('replaceNodeForm');
      form.reset();
      form.querySelector('[name="subscriptionPath"]').value = subscriptionPath;
      showModal('replaceNodeModal');
    }

    // 替换节点
    async function replaceNodes() {
      const form = document.getElementById('replaceNodeForm');
      const subscriptionPath = form.querySelector('[name="subscriptionPath"]').value;
      const content = form.querySelector('[name="content"]').value.trim();
      
      if (!content) {
        showToast('请输入节点内容', 'warning');
        return;
      }
      
      if (!confirm('确定要删除所有现有节点并替换为新节点吗？此操作不可撤销！')) {
        return;
      }
      
      const lines = content.split(/\\r?\\n/);
      const validNodes = [];
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        try {
          const decodedContent = safeBase64DecodeFrontend(trimmedLine);
          const decodedLines = decodedContent.split(/\\r?\\n/);
          for (const decodedLine of decodedLines) {
            if (decodedLine.trim() && isValidNodeLink(decodedLine.trim())) {
              validNodes.push({
                name: extractNodeNameFrontend(decodedLine.trim()),
                content: decodedLine.trim()
              });
            }
          }
        } catch (e) {
          if (isValidNodeLink(trimmedLine)) {
            validNodes.push({
              name: extractNodeNameFrontend(trimmedLine),
              content: trimmedLine
            });
          }
        }
      }
      
      if (validNodes.length === 0) {
        showToast('未找到有效的节点', 'warning');
        return;
      }
      
      try {
        showToast('正在替换...', 'info');
        
        const timestamp = Date.now();
        const nodesWithOrder = validNodes.map((node, index) => ({
          name: node.name,
          content: node.content,
          order: timestamp + index
        }));
        
        const response = await fetch('/' + adminPath + '/api/subscriptions/' + subscriptionPath + '/nodes/replace', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodes: nodesWithOrder })
        });
        
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        
        showToast(\`成功替换为 \${result.data?.count || validNodes.length} 个节点\`, 'success');
        hideModal('replaceNodeModal');
        form.reset();
        await loadSubscriptions();
        
        const nodeListArea = document.getElementById('node-list-' + subscriptionPath);
        if (nodeListArea && nodeListArea.classList.contains('expanded')) {
          await loadNodeList(subscriptionPath);
        }
      } catch (error) {
        showToast('替换失败: ' + error.message, 'danger');
      }
    }

    // 路径验证
    function validateSubscriptionPathFrontend(path) {
      return /^[a-z0-9-]{5,50}$/.test(path);
    }

    // 安全的Base64解码
    function safeBase64DecodeFrontend(str) {
      try {
        const decoded = atob(str);
        const bytes = [];
        for (let i = 0; i < decoded.length; i++) {
          bytes.push(decoded.charCodeAt(i));
        }
        if (typeof TextDecoder !== 'undefined') {
          const decoder = new TextDecoder('utf-8');
          return decoder.decode(new Uint8Array(bytes));
        } else {
          let utf8String = '';
          for (let i = 0; i < bytes.length; i++) {
            utf8String += String.fromCharCode(bytes[i]);
          }
          return decodeURIComponent(escape(utf8String));
        }
      } catch (e) {
        try {
          return atob(str);
        } catch (e2) {
          return str;
        }
      }
    }

    function safeUtf8DecodeFrontend(str) {
      if (!str) return str;
      try {
        return decodeURIComponent(escape(str));
      } catch (e1) {
        try {
          return decodeURIComponent(str);
        } catch (e2) {
          return str;
        }
      }
    }

    function extractNodeNameFrontend(nodeLink) {
      if (!nodeLink) return '未命名节点';
      
      if(nodeLink.includes(NODE_TYPES_FRONTEND.SNELL)) {
        const name = nodeLink.split('=')[0].trim();
        return name || '未命名节点';
      }
      
      if (nodeLink.toLowerCase().startsWith(NODE_TYPES_FRONTEND.VMESS)) {
        try {
          const config = JSON.parse(safeBase64DecodeFrontend(nodeLink.substring(8)));
          if (config.ps) {
            return safeUtf8DecodeFrontend(config.ps);
          }
        } catch {}
        return '未命名节点';
      }

      const hashIndex = nodeLink.indexOf('#');
      if (hashIndex !== -1) {
        try {
          return decodeURIComponent(nodeLink.substring(hashIndex + 1));
        } catch {
          return nodeLink.substring(hashIndex + 1) || '未命名节点';
        }
      }
      return '未命名节点';
    }

    function isValidNodeLink(link) {
      const lowerLink = link.toLowerCase();
      if(lowerLink.includes('=') && lowerLink.includes('snell,')) {
        const parts = link.split('=')[1]?.trim().split(',');
        return parts && parts.length >= 4 && parts[0].trim() === 'snell';
      }
      return Object.values(NODE_TYPES_FRONTEND).some(prefix => lowerLink.startsWith(prefix));
    }

    // 加载订阅列表
    async function loadSubscriptions() {
      try {
        const response = await fetch('/' + adminPath + '/api/subscriptions');
        if (!response.ok) throw new Error('加载失败');
        const result = await response.json();
        
        if (!result.success) throw new Error(result.message || '加载失败');
        
        subscriptionsData = result.data || [];
        // 更新顶部统计
const totalNodes = subscriptionsData.reduce((sum, sub) => sum + (sub.nodeCount || 0), 0);
document.getElementById('globalStats').textContent = 
  '[ ' + subscriptionsData.length + ' 个订阅 / ' + totalNodes + ' 个节点 ]';

        const listElement = document.getElementById('subscriptionList');
        
        if (isCompactMode) {
          listElement.classList.add('compact-mode');
        } else {
          listElement.classList.remove('compact-mode');
        }
        
        if (subscriptionsData.length === 0) {
          listElement.innerHTML = \`
            <div class="empty-state empty-state-large">
              \${SVG_ICONS.package}
              <h3>还没有订阅</h3>
              <p>点击上方"添加订阅"按钮创建你的第一个订阅</p>
              <button class="btn btn-primary" onclick="showModal('addSubscriptionModal')">
                \${SVG_ICONS.plus} 添加订阅
              </button>
            </div>
          \`;
          return;
        }
        
        listElement.innerHTML = subscriptionsData.map(sub => {
          const backend = sub.converter_backend || 'sub.xeton.dev';
          const subConverterUrl = generateSubConverterUrl(sub.path, backend);
          const updateTimeStr = formatRelativeTime(sub.updated_at);
          
          return \`
            <div class="subscription-card" data-path="\${sub.path}" data-order="\${sub.sub_order || 0}">
              <div class="subscription-header">
                <span class="sub-drag-handle" title="拖拽排序">\${SVG_ICONS.grip}</span>
                <div class="subscription-info">
                  <div class="subscription-title-row">
                    <span class="subscription-name">\${sub.name}</span>
                    <span class="node-count">\${SVG_ICONS.server} \${sub.nodeCount}</span>
                    <span class="update-time">\${SVG_ICONS.clock} \${updateTimeStr}</span>
                    <button class="btn btn-sm btn-icon" onclick="showEditSubscriptionModal('\${sub.path}', '\${sub.name}', '\${backend}')" title="设置">
                      \${SVG_ICONS.settings}
                    </button>
                  </div>

                  <div class="subscription-links">
                    <div class="link-row">
                      <span class="link-label">Default:</span>
                      <a href="/\${sub.path}" target="_blank" class="link-url">原始订阅</a>
                      <button class="btn btn-sm btn-icon btn-copy-link" onclick="copySubscriptionLink('\${sub.path}', 1, '\${backend}', this)" title="复制">\${SVG_ICONS.copy}</button>
                      <button class="btn btn-sm btn-icon btn-copy-link" onclick="showSubscriptionQRCode('\${sub.path}', 1, '\${backend}')" title="二维码">\${SVG_ICONS.qrcode}</button>
                    </div>
                    <div class="link-row">
                      <span class="link-label">V2Ray:</span>
                      <a href="/\${sub.path}/v2ray" target="_blank" class="link-url">v2ray</a>
                      <button class="btn btn-sm btn-icon btn-copy-link" onclick="copySubscriptionLink('\${sub.path}', 2, '\${backend}', this)" title="复制">\${SVG_ICONS.copy}</button>
                      <button class="btn btn-sm btn-icon btn-copy-link" onclick="showSubscriptionQRCode('\${sub.path}', 2, '\${backend}')" title="二维码">\${SVG_ICONS.qrcode}</button>
                    </div>
                    <div class="link-row">
                      <span class="link-label">Surge:</span>
                      <a href="/\${sub.path}/surge" target="_blank" class="link-url">surge</a>
                      <button class="btn btn-sm btn-icon btn-copy-link" onclick="copySubscriptionLink('\${sub.path}', 3, '\${backend}', this)" title="复制">\${SVG_ICONS.copy}</button>
                      <button class="btn btn-sm btn-icon btn-copy-link" onclick="showSubscriptionQRCode('\${sub.path}', 3, '\${backend}')" title="二维码">\${SVG_ICONS.qrcode}</button>
                    </div>
                    <div class="link-row">
                      <span class="link-label">Clash:</span>
                      <a href="/\${sub.path}/clash" target="_blank" class="link-url">clash</a>
                      <button class="btn btn-sm btn-icon btn-copy-link" onclick="copySubscriptionLink('\${sub.path}', 4, '\${backend}', this)" title="复制">\${SVG_ICONS.copy}</button>
                      <button class="btn btn-sm btn-icon btn-copy-link" onclick="showSubscriptionQRCode('\${sub.path}', 4, '\${backend}')" title="二维码">\${SVG_ICONS.qrcode}</button>
                    </div>
                    <div class="link-row">
                      <span class="link-label">Convert:</span>
                      <a href="\${subConverterUrl}" target="_blank" class="link-url">订阅转换 \${SVG_ICONS.externalLink}</a>
                      <button class="btn btn-sm btn-icon btn-copy-link" onclick="copySubscriptionLink('\${sub.path}', 5, '\${backend}', this)" title="复制">\${SVG_ICONS.copy}</button>
                      <button class="btn btn-sm btn-icon btn-copy-link" onclick="showSubscriptionQRCode('\${sub.path}', 5, '\${backend}')" title="二维码">\${SVG_ICONS.qrcode}</button>
                      <div class="dropdown">
                      <button class="btn btn-sm btn-copy-link" onclick="toggleDropdown(event, 'import-menu-\${sub.path}')" title="一键导入">
                      \${SVG_ICONS.download}
                          \${SVG_ICONS.chevronDown}
                        </button>
                        <div class="dropdown-menu" id="import-menu-\${sub.path}">
                          <button class="dropdown-item" onclick="importToClient('\${sub.path}', '\${backend}', 'clash')">
                            <span style="width:20px;text-align:center;">🔥</span> Clash
                          </button>
                          <button class="dropdown-item" onclick="importToClient('\${sub.path}', '\${backend}', 'stash')">
                            <span style="width:20px;text-align:center;">📦</span> Stash
                          </button>
                          <button class="dropdown-item" onclick="importToClient('\${sub.path}', '\${backend}', 'surge')">
                            <span style="width:20px;text-align:center;">⚡</span> Surge
                          </button>
                          <div class="dropdown-divider"></div>
                          <button class="dropdown-item" onclick="importToClient('\${sub.path}', '\${backend}', 'loon')">
                          <span style="width:20px;text-align:center;">🎈</span> Loon
                        </button>
                        <button class="dropdown-item" onclick="importToClient('\${sub.path}', '\${backend}', 'shadowrocket')">
                          <span style="width:20px;text-align:center;">🚀</span> Shadowrocket
                        </button>
                        <button class="dropdown-item" onclick="importToClient('\${sub.path}', '\${backend}', 'quanx')">
                          <span style="width:20px;text-align:center;">🔰</span> Quantumult X
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="compact-links">
                  <span class="compact-link-item" onclick="copySubscriptionLink('\${sub.path}', 1, '\${backend}', this)">Default</span>
                  <span class="compact-link-item" onclick="copySubscriptionLink('\${sub.path}', 2, '\${backend}', this)">V2Ray</span>
                  <span class="compact-link-item" onclick="copySubscriptionLink('\${sub.path}', 3, '\${backend}', this)">Surge</span>
                  <span class="compact-link-item" onclick="copySubscriptionLink('\${sub.path}', 4, '\${backend}', this)">Clash</span>
                  <span class="compact-link-item" onclick="copySubscriptionLink('\${sub.path}', 5, '\${backend}', this)">Convert</span>
                </div>
              </div>
              <div class="subscription-actions">
                <div class="subscription-actions-row">
                  <button class="btn btn-success" onclick="showAddNodeModal('\${sub.path}')">
                    \${SVG_ICONS.plus} 添加节点
                  </button>

                    <button class="btn btn-primary" onclick="toggleNodeList('\${sub.path}')">
                      \${SVG_ICONS.list} 节点列表
                    </button>
                  </div>
                  <div class="subscription-actions-row">
                    <button class="btn" onclick="copyAllNodes('\${sub.path}')" title="复制所有已启用节点">
                      \${SVG_ICONS.copyAll} 复制全部
                    </button>
                    <button class="btn btn-warning" onclick="showReplaceNodeModal('\${sub.path}')" title="删除旧节点并替换">
                      \${SVG_ICONS.refresh} 替换节点
                    </button>
                  </div>
                </div>
              </div>
              <div class="node-list-area" id="node-list-\${sub.path}">
                <div class="node-list-content">
                  <div id="batch-bar-\${sub.path}" style="display: none;"></div>
                  <div class="node-toolbar" id="node-toolbar-\${sub.path}">
                    <div class="node-search">
                      <span class="node-search-icon">\${SVG_ICONS.search}</span>
                      <input type="text" placeholder="搜索节点..." oninput="filterNodes('\${sub.path}', this.value)">
                    </div>
                    <div class="node-filters" id="node-filters-\${sub.path}">
                      <button class="node-filter-btn active" data-type="all" onclick="filterNodesByType('\${sub.path}', 'all', this)">全部</button>
                    </div>
                    <button class="btn btn-sm" id="batch-btn-\${sub.path}" onclick="enterBatchMode('\${sub.path}')">\${SVG_ICONS.tasks} 批量</button>
                  </div>
                  <table class="node-table">
                    <thead>
                      <tr>
                        <th style="width: 65%;">节点名称</th>
                        <th style="width: 35%; text-align: right;">操作</th>
                      </tr>
                    </thead>
                    <tbody id="node-tbody-\${sub.path}"></tbody>
                  </table>
                  <div id="node-empty-\${sub.path}" style="display: none;"></div>
                </div>
              </div>
            </div>
          \`;
        }).join('');

        // 初始化订阅拖拽排序
        initSubscriptionSortable();
      } catch (error) {
        showToast('加载订阅列表失败: ' + error.message, 'danger');
      }
    }

    // 初始化订阅拖拽排序
    function initSubscriptionSortable() {
      const listElement = document.getElementById('subscriptionList');
      if (listElement.sortableInstance) {
        listElement.sortableInstance.destroy();
      }
      
      listElement.sortableInstance = new Sortable(listElement, {
        animation: 150,
        handle: '.sub-drag-handle',
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        forceFallback: true,
        fallbackTolerance: 3,
        touchStartThreshold: 3,
        delay: isMobileDevice() ? 150 : 0,
        delayOnTouchOnly: true,
        onEnd: async function(evt) {
          try {
            const cards = Array.from(listElement.querySelectorAll('.subscription-card'));
            const newOrders = cards.map((card, index) => ({
              path: card.dataset.path,
              order: index
            }));
            
            const response = await fetch('/' + adminPath + '/api/subscriptions/reorder', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orders: newOrders })
            });
            
            const result = await response.json();
            if (!result.success) throw new Error(result.message);
            
            showToast('订阅顺序已更新', 'success');
          } catch (error) {
            showToast('更新排序失败: ' + error.message, 'danger');
            await loadSubscriptions();
          }
        }
      });
    }

    // 切换节点列表显示
    async function toggleNodeList(subscriptionPath) {
      const nodeListArea = document.getElementById('node-list-' + subscriptionPath);
      const isExpanded = nodeListArea.classList.contains('expanded');
      
      if (isExpanded) {
        nodeListArea.classList.remove('expanded');
      } else {
        nodeListArea.classList.add('expanded');
        await loadNodeList(subscriptionPath);
      }
    }

    // 节点搜索过滤
    function filterNodes(subscriptionPath, keyword) {
      const tbody = document.getElementById('node-tbody-' + subscriptionPath);
      const rows = tbody.querySelectorAll('.node-row');
      const lowerKeyword = keyword.toLowerCase();
      
      rows.forEach(row => {
        const name = row.querySelector('.node-name-text')?.textContent?.toLowerCase() || '';
        if (name.includes(lowerKeyword)) {
          row.classList.remove('hidden');
        } else {
          row.classList.add('hidden');
        }
      });
    }

    // 按类型过滤节点
    function filterNodesByType(subscriptionPath, type, btn) {
      const tbody = document.getElementById('node-tbody-' + subscriptionPath);
      const rows = tbody.querySelectorAll('.node-row');
      const filtersContainer = document.getElementById('node-filters-' + subscriptionPath);
      
      // 更新按钮状态
      filtersContainer.querySelectorAll('.node-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      rows.forEach(row => {
        if (type === 'all') {
          row.classList.remove('hidden');
        } else {
          const nodeType = row.dataset.type;
          if (nodeType === type) {
            row.classList.remove('hidden');
          } else {
            row.classList.add('hidden');
          }
        }
      });
    }

    // 加载节点列表
    async function loadNodeList(subscriptionPath) {
      const tbody = document.getElementById('node-tbody-' + subscriptionPath);
      const emptyEl = document.getElementById('node-empty-' + subscriptionPath);
      const filtersContainer = document.getElementById('node-filters-' + subscriptionPath);
      
      tbody.innerHTML = \`<tr><td colspan="2" class="empty-state">\${SVG_ICONS.loader} loading...</td></tr>\`;
      
      try {
        const response = await fetch('/' + adminPath + '/api/subscriptions/' + subscriptionPath + '/nodes');
        if (!response.ok) throw new Error('加载失败');
        
        const result = await response.json();
        if (!result.success) throw new Error(result.message || '加载失败');
        
        const nodes = result.data || [];
        
        if (nodes.length === 0) {
          tbody.innerHTML = '';
          emptyEl.style.display = 'block';
          emptyEl.innerHTML = \`
            <div class="empty-state empty-state-large">
              \${SVG_ICONS.package}
              <h3>还没有节点</h3>
              <p>点击"添加节点"按钮添加你的第一个节点</p>
              <button class="btn btn-success" onclick="showAddNodeModal('\${subscriptionPath}')">
              + 添加节点
            </button>
            
            </div>
          \`;
          return;
        }
        
        emptyEl.style.display = 'none';
        
        // 统计节点类型
        const typeCounts = {};
        nodes.forEach(node => {
          const type = getNodeType(node.original_link);
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        
        // 更新过滤按钮
        let filterBtns = \`<button class="node-filter-btn active" data-type="all" onclick="filterNodesByType('\${subscriptionPath}', 'all', this)">全部(\${nodes.length})</button>\`;
        Object.entries(typeCounts).forEach(([type, count]) => {
          filterBtns += \`<button class="node-filter-btn" data-type="\${type}" onclick="filterNodesByType('\${subscriptionPath}', '\${type}', this)">\${getNodeTypeLabel(type)}(\${count})</button>\`;
        });
        filtersContainer.innerHTML = filterBtns;
        
        tbody.innerHTML = nodes.map((node, index) => {
          const isEnabled = node.enabled === 1;
          const escapedLink = node.original_link.replace(/&/g, '&amp;').replace(/'/g, "\\'").replace(/"/g, '\\"');
          const nodeType = getNodeType(node.original_link);
          const nodeTypeLabel = getNodeTypeLabel(nodeType);
          
          return \`
            <tr class="node-row \${!isEnabled ? 'disabled' : ''}" data-id="\${node.id}" data-order="\${node.node_order}" data-type="\${nodeType}">
              <td>
                <div class="node-cell-name">
                  <input type="checkbox" class="node-checkbox" value="\${node.id}">
                  <span class="drag-handle" title="拖拽排序">\${SVG_ICONS.grip}</span>
                  <div class="node-name">
                    <span class="node-type-tag node-type-\${nodeType}">\${nodeTypeLabel}</span>
                    <span class="node-name-text" title="\${node.name}">\${node.name}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="node-actions">
                  <button class="btn btn-sm btn-icon" onclick="showEditNodeModal('\${subscriptionPath}', '\${node.id}', '\${escapedLink}')" title="编辑">\${SVG_ICONS.edit}</button>
                  <button class="btn btn-sm btn-icon" onclick="copyToClipboard('\${escapedLink}', this)" title="复制">\${SVG_ICONS.copy}</button>
                  <button class="btn btn-sm btn-icon" onclick="showNodeQRCode('\${escapedLink}', '\${node.name.replace(/'/g, \"\\\\\\'\")}' )" title="二维码">\${SVG_ICONS.qrcode}</button>
                  <button class="btn btn-sm btn-icon btn-danger" onclick="deleteNode('\${subscriptionPath}', \${node.id})" title="删除">\${SVG_ICONS.trash}</button>
                </div>
              </td>
            </tr>
          \`;
        }).join('');

        initializeSortable(tbody, subscriptionPath);
        
      } catch (error) {
        tbody.innerHTML = \`<tr><td colspan="2" class="empty-state" style="color: var(--danger);">\${SVG_ICONS.alertCircle} \${error.message}</td></tr>\`;
      }
    }

    // 初始化拖拽排序
    function initializeSortable(tbody, subscriptionPath) {
      if (tbody.sortableInstance) {
        tbody.sortableInstance.destroy();
      }
      
      tbody.sortableInstance = new Sortable(tbody, {
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        forceFallback: true,
        fallbackTolerance: 3,
        touchStartThreshold: 3,
        delay: isMobileDevice() ? 150 : 0,
        delayOnTouchOnly: true,
        onEnd: async function(evt) {
          try {
            const rows = Array.from(tbody.querySelectorAll('.node-row'));
            const newOrders = rows.map((row, index) => ({
              id: parseInt(row.dataset.id),
              order: index
            }));
            await updateNodeOrder(subscriptionPath, newOrders);
            showToast('节点顺序已更新', 'success');
          } catch (error) {
            showToast('更新排序失败: ' + error.message, 'danger');
            await loadNodeList(subscriptionPath);
          }
        }
      });
    }

    // 更新节点顺序
    async function updateNodeOrder(subscriptionPath, orders) {
      const response = await fetch('/' + adminPath + '/api/subscriptions/' + subscriptionPath + '/nodes/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders })
      });
      
      const result = await response.json();
      if (!result.success) throw new Error(result.message || '保存排序失败');
      
      return result;
    }

    // 批量操作模式
    function enterBatchMode(subscriptionPath) {
      const nodeListArea = document.getElementById('node-list-' + subscriptionPath);
      const batchBar = document.getElementById('batch-bar-' + subscriptionPath);
      const batchBtn = document.getElementById('batch-btn-' + subscriptionPath);
      const toolbar = document.getElementById('node-toolbar-' + subscriptionPath);
      
      nodeListArea.querySelector('.node-list-content').classList.add('batch-mode');
      
      if (batchBtn) batchBtn.style.display = 'none';
      
      batchBar.style.display = 'block';
      batchBar.innerHTML = \`
        <div class="batch-actions-bar">
          <div class="batch-actions-left">
            <button class="btn btn-sm" onclick="toggleSelectAll('\${subscriptionPath}')" id="select-all-btn-\${subscriptionPath}">
              \${SVG_ICONS.checkSquare} 全选
            </button>
            <button class="btn btn-sm" onclick="invertSelection('\${subscriptionPath}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3l4 4-4 4"></path><path d="M20 7H4"></path><path d="M8 21l-4-4 4-4"></path><path d="M4 17h16"></path></svg> 反选
            </button>
          </div>
          <div class="batch-actions-right">
            <button class="btn btn-sm btn-success" onclick="executeBatchStatusChange('\${subscriptionPath}', true)">
              \${SVG_ICONS.toggleOn} 启用
            </button>
            <button class="btn btn-sm btn-warning" onclick="executeBatchStatusChange('\${subscriptionPath}', false)">
              \${SVG_ICONS.toggleOff} 禁用
            </button>
            <button class="btn btn-sm btn-danger" onclick="executeBatchDelete('\${subscriptionPath}')">
              \${SVG_ICONS.trash} 删除
            </button>
            <button class="btn btn-sm" onclick="exitBatchMode('\${subscriptionPath}')">
              \${SVG_ICONS.x} 取消
            </button>
          </div>
        </div>
      \`;
      
      showToast('已进入批量操作模式', 'info');
    }

    function exitBatchMode(subscriptionPath) {
      const nodeListArea = document.getElementById('node-list-' + subscriptionPath);
      const batchBar = document.getElementById('batch-bar-' + subscriptionPath);
      const batchBtn = document.getElementById('batch-btn-' + subscriptionPath);
      
      nodeListArea.querySelector('.node-list-content').classList.remove('batch-mode');
      batchBar.style.display = 'none';
      
      if (batchBtn) batchBtn.style.display = '';
      
      nodeListArea.querySelectorAll('.node-checkbox').forEach(cb => cb.checked = false);
    }

    function toggleSelectAll(subscriptionPath) {
      const nodeListArea = document.getElementById('node-list-' + subscriptionPath);
      const checkboxes = nodeListArea.querySelectorAll('.node-checkbox');
      const btn = document.getElementById('select-all-btn-' + subscriptionPath);
      
      const checkedCount = nodeListArea.querySelectorAll('.node-checkbox:checked').length;
      const isAllSelected = checkedCount === checkboxes.length && checkboxes.length > 0;
      
      checkboxes.forEach(cb => cb.checked = !isAllSelected);
      btn.innerHTML = isAllSelected ? \`\${SVG_ICONS.checkSquare} 全选\` : \`\${SVG_ICONS.x} 取消全选\`;
    }

    function invertSelection(subscriptionPath) {
      const nodeListArea = document.getElementById('node-list-' + subscriptionPath);
      const checkboxes = nodeListArea.querySelectorAll('.node-checkbox');
      checkboxes.forEach(cb => cb.checked = !cb.checked);
    }

    async function executeBatchDelete(subscriptionPath) {
      const nodeListArea = document.getElementById('node-list-' + subscriptionPath);
      const checkedNodes = nodeListArea.querySelectorAll('.node-checkbox:checked');
      
      if (checkedNodes.length === 0) {
        showToast('请先选择节点', 'warning');
        return;
      }
      
      if (!confirm(\`确定删除选中的 \${checkedNodes.length} 个节点？\`)) return;
      
      const nodeIds = Array.from(checkedNodes).map(cb => parseInt(cb.value));
      
      try {
        showToast('正在删除...', 'info');
        
        const response = await fetch('/' + adminPath + '/api/subscriptions/' + subscriptionPath + '/nodes/batch-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodeIds })
        });
        
        const result = await response.json();
        if (!result.success) throw new Error(result.message);
        
        showToast(\`成功删除 \${nodeIds.length} 个节点\`, 'success');
        exitBatchMode(subscriptionPath);
        await loadNodeList(subscriptionPath);
        await loadSubscriptions();
      } catch (error) {
        showToast('删除失败: ' + error.message, 'danger');
      }
    }

    async function executeBatchStatusChange(subscriptionPath, enabled) {
      const nodeListArea = document.getElementById('node-list-' + subscriptionPath);
      const checkedNodes = nodeListArea.querySelectorAll('.node-checkbox:checked');
      
      if (checkedNodes.length === 0) {
        showToast('请先选择节点', 'warning');
        return;
      }
      
      const action = enabled ? '启用' : '禁用';
      if (!confirm(\`确定\${action}选中的 \${checkedNodes.length} 个节点？\`)) return;
      
      try {
        showToast(\`正在\${action}...\`, 'info');
        
        let successCount = 0;
        for (const cb of checkedNodes) {
          try {
            const response = await fetch('/' + adminPath + '/api/subscriptions/' + subscriptionPath + '/nodes/' + cb.value, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ enabled })
            });
            if (response.ok) successCount++;
          } catch (e) {}
        }
        
        showToast(\`成功\${action} \${successCount} 个节点\`, 'success');
        exitBatchMode(subscriptionPath);
        await loadNodeList(subscriptionPath);
        await loadSubscriptions();
      } catch (error) {
        showToast(\`\${action}失败: \` + error.message, 'danger');
      }
    }

    // 显示添加节点模态框
    function showAddNodeModal(subscriptionPath) {
      const form = document.getElementById('addNodeForm');
      form.reset();
      form.querySelector('[name="subscriptionPath"]').value = subscriptionPath;
      showModal('addNodeModal');
    }

    // 创建节点
    async function createNode() {
      const form = document.getElementById('addNodeForm');
      const subscriptionPath = form.querySelector('[name="subscriptionPath"]').value;
      const content = form.querySelector('[name="content"]').value.trim();
      
      if (!content) {
        showToast('请输入节点内容', 'warning');
        return;
      }
      
      const lines = content.split(/\\r?\\n/);
      const validNodes = [];
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        try {
          const decodedContent = safeBase64DecodeFrontend(trimmedLine);
          const decodedLines = decodedContent.split(/\\r?\\n/);
          for (const decodedLine of decodedLines) {
            if (decodedLine.trim() && isValidNodeLink(decodedLine.trim())) {
              validNodes.push({
                name: extractNodeNameFrontend(decodedLine.trim()),
                content: decodedLine.trim()
              });
            }
          }
        } catch (e) {
          if (isValidNodeLink(trimmedLine)) {
            validNodes.push({
              name: extractNodeNameFrontend(trimmedLine),
              content: trimmedLine
            });
          }
        }
      }
      
      if (validNodes.length === 0) {
        showToast('未找到有效的节点', 'warning');
        return;
      }
      
      try {
        showToast('正在添加...', 'info');
        
        const timestamp = Date.now();
        const nodesWithOrder = validNodes.map((node, index) => ({
          name: node.name,
          content: node.content,
          order: timestamp + index
        }));
        
        const response = await fetch('/' + adminPath + '/api/subscriptions/' + subscriptionPath + '/nodes/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodes: nodesWithOrder })
        });
        
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        
        showToast(\`成功添加 \${result.data?.count || validNodes.length} 个节点\`, 'success');
        hideModal('addNodeModal');
        form.reset();
        await loadSubscriptions();
        
        const nodeListArea = document.getElementById('node-list-' + subscriptionPath);
        if (nodeListArea && nodeListArea.classList.contains('expanded')) {
          await loadNodeList(subscriptionPath);
        }
      } catch (error) {
        showToast('添加失败: ' + error.message, 'danger');
      }
    }

    // 显示编辑节点模态框
    function showEditNodeModal(subscriptionPath, nodeId, nodeContent) {
      const form = document.getElementById('editNodeForm');
      form.querySelector('[name="subscriptionPath"]').value = subscriptionPath;
      form.querySelector('[name="nodeId"]').value = nodeId;
      form.querySelector('[name="content"]').value = nodeContent;
      form.setAttribute('data-original-content', nodeContent);
      showModal('editNodeModal');
    }

    // 更新节点
    async function updateNode() {
      const form = document.getElementById('editNodeForm');
      const subscriptionPath = form.querySelector('[name="subscriptionPath"]').value;
      const nodeId = form.querySelector('[name="nodeId"]').value;
      const content = form.querySelector('[name="content"]').value.trim();
      const originalContent = form.getAttribute('data-original-content');
      
      if (!content) {
        showToast('请输入节点内容', 'warning');
        return;
      }
      
      if (content === originalContent) {
        showToast('内容未修改', 'info');
        hideModal('editNodeModal');
        return;
      }
      
      try {
        const response = await fetch('/' + adminPath + '/api/subscriptions/' + subscriptionPath + '/nodes/' + nodeId, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        });
        
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        
        showToast('节点已更新', 'success');
        hideModal('editNodeModal');
        await loadSubscriptions();
        await loadNodeList(subscriptionPath);
      } catch (error) {
        showToast('更新失败: ' + error.message, 'danger');
      }
    }

    // 删除节点
    async function deleteNode(subscriptionPath, nodeId) {
      if (!confirm('确定删除此节点？')) return;
      
      try {
        const response = await fetch('/' + adminPath + '/api/subscriptions/' + subscriptionPath + '/nodes/' + nodeId, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        
        showToast('节点已删除', 'success');
        await loadNodeList(subscriptionPath);
        await loadSubscriptions();
      } catch (error) {
        showToast('删除失败: ' + error.message, 'danger');
      }
    }

    // 创建订阅
    async function createSubscription() {
      const form = document.getElementById('addSubscriptionForm');
      const name = form.querySelector('[name="name"]').value.trim();
      const path = form.querySelector('[name="path"]').value.trim();
      const errorEl = document.getElementById('addSubPathError');
      
      if (!name) {
        showToast('请输入订阅名称', 'warning');
        return;
      }
      
      if (!validateSubscriptionPathFrontend(path)) {
        errorEl.textContent = '路径格式不正确';
        errorEl.classList.add('show');
        return;
      }
      
      errorEl.classList.remove('show');
      
      try {
        const response = await fetch('/' + adminPath + '/api/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, path })
        });
        
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        
        showToast('订阅创建成功', 'success');
        hideModal('addSubscriptionModal');
        form.reset();
        await loadSubscriptions();
      } catch (error) {
        showToast('创建失败: ' + error.message, 'danger');
      }
    }

    // 显示编辑订阅模态框
    function showEditSubscriptionModal(path, name, backend) {
      const form = document.getElementById('editSubscriptionForm');
      form.querySelector('[name="originalPath"]').value = path;
      form.querySelector('[name="name"]').value = name;
      form.querySelector('[name="path"]').value = path;
      
      const backendSelect = document.getElementById('editConverterBackend');
      backendSelect.value = backend || 'sub.xeton.dev';
      
      document.getElementById('editSubPathError').classList.remove('show');
      showModal('editSubscriptionModal');
    }

    // 更新订阅信息
    async function updateSubscriptionInfo() {
      const form = document.getElementById('editSubscriptionForm');
      const originalPath = form.querySelector('[name="originalPath"]').value;
      const name = form.querySelector('[name="name"]').value.trim();
      const path = form.querySelector('[name="path"]').value.trim();
      const converterBackend = document.getElementById('editConverterBackend').value;
      const errorEl = document.getElementById('editSubPathError');
      
      if (!name) {
        showToast('请输入订阅名称', 'warning');
        return;
      }
      
      if (!validateSubscriptionPathFrontend(path)) {
        errorEl.textContent = '路径格式不正确';
        errorEl.classList.add('show');
        return;
      }
      
      errorEl.classList.remove('show');
      
      try {
        if (path !== originalPath) {
          const checkResponse = await fetch('/' + adminPath + '/api/subscriptions/' + path);
          if (checkResponse.ok) {
            errorEl.textContent = '该路径已被使用';
            errorEl.classList.add('show');
            return;
          }
        }
        
        const response = await fetch('/' + adminPath + '/api/subscriptions/' + originalPath, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, path, converter_backend: converterBackend, action: 'update_info' })
        });
        
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        
        showToast('订阅信息已更新', 'success');
        hideModal('editSubscriptionModal');
        await loadSubscriptions();
      } catch (error) {
        showToast('更新失败: ' + error.message, 'danger');
      }
    }

    // 确认删除订阅
    async function confirmDeleteSubscription() {
      const form = document.getElementById('editSubscriptionForm');
      const path = form.querySelector('[name="originalPath"]').value;
      
      if (!confirm('确定删除此订阅及其所有节点？')) return;
      
      try {
        const response = await fetch('/' + adminPath + '/api/subscriptions/' + path, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message);
        }
        
        showToast('订阅已删除', 'success');
        hideModal('editSubscriptionModal');
        await loadSubscriptions();
      } catch (error) {
        showToast('删除失败: ' + error.message, 'danger');
      }
    }

    // 页面加载完成后初始化
    window.addEventListener('load', function() {
      initTheme();
      initLayout();
      initConverterSelect();
      loadSubscriptions();
    });
  </script>
</body>
</html>`;
}
