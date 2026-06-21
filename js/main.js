const BI_ICONS = {
  code: 'bi-code-slash',
  article: 'bi-journal-richtext',
  dashboard: 'bi-grid-1x2-fill',
  api: 'bi-braces',
  default: 'bi-box-seam',
};

const SOCIAL_ICONS = {
  github: 'bi-github',
  linkedin: 'bi-linkedin',
  email: 'bi-envelope-fill',
  default: 'bi-link-45deg',
};

const THEME_KEY = 'hub-theme';

function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const stored = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');

  applyTheme(theme);

  toggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-bs-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function createAppCard(app, index) {
  const isLive = app.status === 'live';
  const iconClass = BI_ICONS[app.icon] || BI_ICONS.default;
  const col = document.createElement('div');
  col.className = 'col-md-6 col-xl-4';
  col.setAttribute('role', 'listitem');
  col.setAttribute('data-aos', 'fade-up');
  col.setAttribute('data-aos-delay', String(100 + index * 80));
  col.setAttribute('data-aos-duration', '700');

  const card = document.createElement(isLive ? 'a' : 'div');
  card.className = `app-card${isLive ? '' : ' app-card--disabled'}`;
  card.style.setProperty('--card-accent', app.accent || '#6366f1');

  if (isLive) {
    card.href = app.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('aria-label', `Open ${app.name}`);
  }

  const tagsHtml = (app.tags || [])
    .map((tag) => `<span class="app-card__tag">${tag}</span>`)
    .join('');

  card.innerHTML = `
    <div class="app-card__border" aria-hidden="true"></div>
    <div class="app-card__inner">
      <i class="bi ${iconClass} app-card__bg-icon" aria-hidden="true"></i>
      <div class="app-card__header">
        <div class="app-card__icon"><i class="bi ${iconClass}"></i></div>
        <span class="badge ${isLive ? 'badge-live' : 'badge-soon'}">${isLive ? '● Live' : 'Coming Soon'}</span>
      </div>
      <h3 class="app-card__title">${app.name}</h3>
      <p class="app-card__desc">${app.description}</p>
      ${tagsHtml ? `<div class="app-card__tags">${tagsHtml}</div>` : ''}
      <div class="app-card__footer">
        <span class="app-card__domain">${getHostname(app.url)}</span>
        <span class="app-card__cta">
          ${isLive ? 'Launch <i class="bi bi-arrow-up-right"></i>' : 'Soon <i class="bi bi-hourglass-split"></i>'}
        </span>
      </div>
    </div>
  `;

  col.appendChild(card);
  return col;
}

function renderApps(data) {
  const grid = document.getElementById('apps-grid');
  if (!grid) return;

  populateSite(data.site);
  renderSocialLinks(data.social);
  updateStats(data.apps);

  grid.innerHTML = '';
  (data.apps || []).forEach((app, index) => {
    grid.appendChild(createAppCard(app, index));
  });

  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
}

function updateStats(apps) {
  const live = apps.filter((a) => a.status === 'live').length;
  const soon = apps.filter((a) => a.status === 'coming-soon').length;

  animateCounter('stat-apps', apps.length);
  animateCounter('stat-live', live);
  animateCounter('stat-soon', soon);
}

function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;

  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function renderSocialLinks(social) {
  const container = document.getElementById('social-links');
  if (!container || !social?.length) return;

  container.innerHTML = social
    .map((link) => {
      const icon = SOCIAL_ICONS[link.icon] || SOCIAL_ICONS.default;
      return `<a href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${link.label}"><i class="bi ${icon}"></i></a>`;
    })
    .join('');
}

function populateSite(site) {
  if (!site) return;

  document.title = `${site.name} | ${site.title}`;

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  };

  const initial = site.name?.charAt(0) || 'S';
  setText('brand-initials', initial);
  setText('brand-name', site.title);
  setText('hero-name', site.name);
  setText('hero-initial', initial);
  setText('hero-tagline', site.tagline);
  setText('hero-desc', site.description);
  setText('footer-name', site.name);
}

function showLoadError() {
  const grid = document.getElementById('apps-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="col-12 load-error">Could not load applications. Check <code>data/apps.js</code>.</div>';
}

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.min(80, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

function loadApps() {
  if (window.APP_CONFIG?.apps?.length) {
    renderApps(window.APP_CONFIG);
    return;
  }
  showLoadError();
}

function init() {
  initTheme();
  document.getElementById('footer-year').textContent = new Date().getFullYear();

  if (typeof AOS !== 'undefined') {
    AOS.init({ once: true, offset: 60, duration: 800, easing: 'ease-out-cubic' });
  }

  initParticles();
  loadApps();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
