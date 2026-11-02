import { SVG_ICONS } from './icons.js';

export function renderLoginPage({ adminPath }) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sub-Hub | 登录认证</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+Pro:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      /* 科技编辑风格配色 */
      --bg-body: #0a0f1c;
      --bg-card: rgba(16, 23, 41, 0.95);
      --bg-input: rgba(22, 30, 54, 0.8);
      --border-color: rgba(64, 97, 169, 0.3);
      --primary: #00d4ff;
      --primary-hover: #00b8e6;
      --accent: #ff6b9d;
      --text-main: #e8f4ff;
      --text-sub: #a8c6e8;
      --text-dim: #6d8cb8;
      --success: #4ade80;
      --danger: #f87171;
      --warning: #fbbf24;
      --radius: 16px;
      --radius-sm: 8px;
      --font-heading: 'Playfair Display', serif;
      --font-body: 'Source Sans Pro', sans-serif;
      --shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      --shadow-sm: 0 8px 24px rgba(0, 0, 0, 0.3);
    }

    [data-theme="light"] {
      --bg-body: #f8fafc;
      --bg-card: rgba(255, 255, 255, 0.95);
      --bg-input: rgba(248, 250, 252, 0.8);
      --border-color: rgba(203, 213, 225, 0.6);
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --accent: #ec4899;
      --text-main: #1e293b;
      --text-sub: #475569;
      --text-dim: #64748b;
      --shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      --shadow-sm: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
font-family: var(--font-ui);
      background: var(--bg-body);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: var(--text-main);
      transition: background-color 0.6s ease, color 0.6s ease;
      position: relative;
      overflow: hidden;
    }

    /* 背景效果 */
    body::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 107, 157, 0.05) 0%, transparent 50%),
        linear-gradient(135deg, var(--bg-body) 0%, transparent 100%);
      z-index: -1;
    }

    .login-container {
      width: 100%;
      max-width: 420px;
      animation: fadeInUp 0.8s ease-out;
    }

    .login-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      overflow: hidden;
      transition: all 0.4s ease;
      backdrop-filter: blur(20px);
      box-shadow: var(--shadow);
      position: relative;
    }

    .login-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--primary), var(--accent));
    }

    .login-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
    }

    .login-header {
      padding: 3rem 2.5rem 2rem;
      text-align: center;
      border-bottom: 1px solid var(--border-color);
      position: relative;
    }

    .login-logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      border-radius: 20px;
      margin-bottom: 1.5rem;
      color: white;
      box-shadow: 0 12px 24px rgba(0, 212, 255, 0.3);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .login-logo:hover {
      transform: scale(1.05) rotate(5deg);
      box-shadow: 0 16px 32px rgba(0, 212, 255, 0.4);
    }

    .login-logo svg {
      width: 36px;
      height: 36px;
    }

    .login-title {
      font-family: var(--font-heading);
      font-size: 2.5rem;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, var(--text-main), var(--primary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .login-subtitle {
      font-size: 0.9rem;
      color: var(--text-dim);
      font-weight: 300;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .login-form {
      padding: 2rem 2.5rem 2.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
      position: relative;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-sub);
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .form-label svg {
      color: var(--primary);
      transition: color 0.3s ease;
    }

    .form-input {
      width: 100%;
      padding: 1rem 1.25rem;
      background: var(--bg-input);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-sm);
      color: var(--text-main);
      font-size: 1rem;
font-family: var(--font-ui);
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(0, 212, 255, 0.15);
      transform: translateY(-2px);
    }

    .form-input::placeholder {
      color: var(--text-dim);
      font-weight: 300;
    }

    .btn-login {
      width: 100%;
      padding: 1.25rem 2rem;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border: none;
      border-radius: var(--radius-sm);
      color: white;
      font-size: 1rem;
      font-weight: 600;
font-family: var(--font-ui);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      transition: all 0.3s ease;
      margin-top: 2rem;
      position: relative;
      overflow: hidden;
    }

    .btn-login::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s ease;
    }

    .btn-login:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 24px rgba(0, 212, 255, 0.3);
    }

    .btn-login:hover::before {
      left: 100%;
    }

    .btn-login:active {
      transform: translateY(-1px);
    }

    .alert {
      display: none;
      padding: 1rem 1.25rem;
      background: rgba(248, 113, 113, 0.1);
      border: 1px solid rgba(248, 113, 113, 0.3);
      border-radius: var(--radius-sm);
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      color: var(--danger);
font-family: var(--font-ui);
      animation: shake 0.5s ease;
    }

    .alert.show {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .terminal-prompt {
      color: var(--text-dim);
font-family: var(--font-ui);
      font-size: 0.8rem;
      text-align: center;
      margin-top: 2rem;
      font-weight: 300;
      letter-spacing: 0.05em;
    }

    .terminal-prompt span {
      color: var(--success);
      font-weight: 600;
    }

    .theme-toggle {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      color: var(--text-main);
      backdrop-filter: blur(10px);
      box-shadow: var(--shadow-sm);
      z-index: 1000;
    }

    .theme-toggle:hover {
      background: var(--bg-input);
      transform: scale(1.1) rotate(15deg);
      border-color: var(--primary);
    }

    /* 动画定义 */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    /* 响应式设计 */
    @media (max-width: 480px) {
      .login-container {
        max-width: 100%;
      }
      
      .login-header {
        padding: 2rem 1.5rem 1.5rem;
      }
      
      .login-form {
        padding: 1.5rem 1.5rem 2rem;
      }
      
      .login-logo {
        width: 64px;
        height: 64px;
      }
      
      .login-title {
        font-size: 2rem;
      }
    }
  </style>
</head>
<body>
  <button class="theme-toggle" onclick="toggleTheme()" title="切换主题">
    <span id="themeIcon">${SVG_ICONS.moon}</span>
  </button>

  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="login-logo">
          ${SVG_ICONS.cube}
        </div>
        <h1 class="login-title">Sub-Hub</h1>
        <p class="login-subtitle">认证访问</p>
      </div>
      
      <form class="login-form" id="loginForm">
        <div class="alert" id="loginAlert">
          ${SVG_ICONS.alertCircle}
          <span id="alertMessage">认证失败</span>
        </div>
        
        <div class="form-group">
          <label class="form-label">
            ${SVG_ICONS.user}
            用户名
          </label>
          <input type="text" class="form-input" id="username" name="username" placeholder="输入用户名" required autocomplete="username">
        </div>
        
        <div class="form-group">
          <label class="form-label">
            ${SVG_ICONS.lock}
            密码
          </label>
          <input type="password" class="form-input" id="password" name="password" placeholder="输入密码" required autocomplete="current-password">
        </div>
        
        <button type="submit" class="btn-login">
          ${SVG_ICONS.login}
          <span>登录系统</span>
        </button>
      </form>
    </div>
    
    <p class="terminal-prompt">
      <span>$</span> secure connection established_
    </p>
  </div>
  
  <script>
    const sunIcon = \`${SVG_ICONS.sun}\`;
    const moonIcon = \`${SVG_ICONS.moon}\`;

    function initTheme() {
      const savedTheme = localStorage.getItem('theme') || 'dark';
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
      iconEl.innerHTML = theme === 'dark' ? moonIcon : sunIcon;
    }

    // 页面加载动画
    document.addEventListener('DOMContentLoaded', function() {
      initTheme();
      
      // 表单元素逐个显示动画
      const formElements = document.querySelectorAll('.form-group, .btn-login');
      formElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
          el.style.transition = 'all 0.6s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 200 + index * 100);
      });
    });

    document.getElementById('loginForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const alert = document.getElementById('loginAlert');
      const alertMessage = document.getElementById('alertMessage');
      
      try {
        const response = await fetch('/${adminPath}/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          // 登录成功动画
          document.querySelector('.btn-login').style.background = 'linear-gradient(135deg, #10b981, #6366f1)';
          setTimeout(() => {
            window.location.href = data.redirect;
          }, 800);
        } else {
          alertMessage.textContent = data.message || '认证失败';
          alert.classList.add('show');
        }
      } catch (error) {
        alertMessage.textContent = '网络错误，请重试';
        alert.classList.add('show');
      }
    });
  </script>
</body>
</html>`;
}
