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

const TYPED_WORDS = ['amazing apps', 'scalable systems', 'clean code', 'cloud solutions', 'great UX'];

function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function createAppCard(app, index, isFeatured) {
  const isLive = app.status === 'live';
  const iconClass = BI_ICONS[app.icon] || BI_ICONS.default;
  const col = document.createElement('div');
  col.className = `col-12 app-card-col${isFeatured ? ' app-card-col--featured' : ''}`;
  col.setAttribute('role', 'listitem');

  const card = document.createElement(isLive ? 'a' : 'div');
  card.className = `app-card js-app-card${isLive ? '' : ' app-card--disabled'}${isFeatured ? ' app-card--featured' : ''}`;
  card.style.setProperty('--card-accent', app.accent || '#4f46e5');

  if (isLive) {
    card.href = app.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('aria-label', `Open ${app.name}`);
  }

  const tagsHtml = (app.tags || [])
    .map((tag) => `<span class="app-card__tag">${tag}</span>`)
    .join('');

  const num = String(index + 1).padStart(2, '0');

  card.innerHTML = `
    <div class="app-card__inner">
      <div class="app-card__glow" aria-hidden="true"></div>
      <div class="app-card__shine" aria-hidden="true"></div>
      <div class="app-card__blob" aria-hidden="true"></div>
      <span class="app-card__num" aria-hidden="true">${num}</span>
      <div class="app-card__header">
        <div class="app-card__icon"><i class="bi ${iconClass}"></i></div>
        <span class="${isLive ? 'badge-live' : 'badge-soon'}">${isLive ? 'Live' : 'Soon'}</span>
      </div>
      <h3 class="app-card__title">${app.name}</h3>
      <p class="app-card__desc">${app.description}</p>
      ${tagsHtml ? `<div class="app-card__tags">${tagsHtml}</div>` : ''}
      <div class="app-card__footer">
        <span class="app-card__domain">${getHostname(app.url)}</span>
        <span class="app-card__cta">
          ${isLive ? 'Launch <i class="bi bi-arrow-up-right"></i>' : 'Wait <i class="bi bi-hourglass-split"></i>'}
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
  const apps = data.apps || [];
  const featuredIndex = apps.findIndex((a) => a.status === 'live');

  apps.forEach((app, index) => {
    grid.appendChild(createAppCard(app, index, index === featuredIndex));
  });

  initCardAnimations();
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
  if (!el || typeof gsap === 'undefined') {
    if (el) el.textContent = target;
    return;
  }
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: 2.2,
    ease: 'power3.out',
    delay: 1.4,
    onUpdate: () => {
      el.textContent = Math.round(obj.val);
    },
  });
}

function renderSocialLinks(social) {
  const container = document.getElementById('social-links');
  if (!container || !social?.length) return;
  container.innerHTML = social
    .map((link) => {
      const icon = SOCIAL_ICONS[link.icon] || SOCIAL_ICONS.default;
      return `<a href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${link.label}" class="js-social-link"><i class="bi ${icon}"></i></a>`;
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
  setText('hero-desc', site.description);
  setText('footer-name', site.name);
  setText('preloader-text', site.name);

  splitNameChars(site.name || 'Shabin');
}

function splitNameChars(name) {
  const wrap = document.getElementById('hero-name');
  if (!wrap) return;
  wrap.innerHTML = name
    .split('')
    .map((c) => `<span class="hero-name__char">${c === ' ' ? '&nbsp;' : c}</span>`)
    .join('');
}

function showLoadError() {
  const grid = document.getElementById('apps-grid');
  if (!grid) return;
  grid.innerHTML =
    '<div class="col-12 load-error">Could not load applications. Check <code>data/apps.js</code>.</div>';
}

function loadApps() {
  if (window.APP_CONFIG?.apps?.length) {
    renderApps(window.APP_CONFIG);
    return;
  }
  showLoadError();
}

/* ---- Preloader ---- */

function initPreloader(onDone) {
  const preloader = document.getElementById('preloader');
  document.body.classList.remove('is-loading');

  if (!preloader || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    preloader?.classList.add('is-done');
    onDone?.();
    return;
  }

  const finish = () => {
    if (typeof gsap !== 'undefined') {
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          preloader.classList.add('is-done');
          onDone?.();
        },
      });
    } else {
      preloader.classList.add('is-done');
      onDone?.();
    }
  };

  // Brief branded flash, then reveal page — don't block on external CDN assets
  setTimeout(finish, 500);
}

/* ---- Particle network ---- */

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let w, h;
  let particles;
  const mouse = { x: -9999, y: -9999 };
  const colors = ['79, 70, 229', '124, 58, 237', '236, 72, 153', '6, 182, 212'];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function create() {
    const n = Math.min(80, Math.floor((w * h) / 18000));
    particles = Array.from({ length: n }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2.2 + 0.8,
      color: colors[i % colors.length],
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      p.pulse += 0.02;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        p.x -= dx * 0.025;
        p.y -= dy * 0.025;
      }

      const glow = 0.35 + Math.sin(p.pulse) * 0.15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${glow})`;
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const alpha = 0.2 * (1 - dist / 140);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  create();
  draw();
  window.addEventListener('resize', () => {
    resize();
    create();
  });
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
}

/* ---- Cursor ---- */

function initCursor() {
  const glow = document.getElementById('cursor-glow');
  const dot = document.getElementById('cursor-dot');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let mx = 0;
  let my = 0;
  let gx = 0;
  let gy = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (dot) {
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    }
  });

  function tick() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    if (glow) {
      glow.style.left = `${gx}px`;
      glow.style.top = `${gy}px`;
    }
    requestAnimationFrame(tick);
  }
  tick();
}

/* ---- Magnetic buttons ---- */

function initMagnetic() {
  if (typeof gsap === 'undefined') return;

  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.35, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });

  document.querySelectorAll('.btn-hero-primary').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = btn.querySelector('.btn-hero-primary__ripple');
      if (ripple) {
        ripple.style.setProperty('--rx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        ripple.style.setProperty('--ry', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      }
    });
  });
}

/* ---- Typed words ---- */

function initTypedWords() {
  const el = document.getElementById('typed-words');
  if (!el) return;

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = TYPED_WORDS[wordIndex];
    if (!deleting) {
      el.textContent = word.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 75);
    } else {
      el.textContent = word.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % TYPED_WORDS.length;
        setTimeout(tick, 350);
        return;
      }
      setTimeout(tick, 35);
    }
  }

  setTimeout(tick, 1800);
}

/* ---- Parallax ---- */

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.js-parallax').forEach((el) => {
    const speed = parseFloat(el.dataset.speed) || 0.1;
    gsap.to(el, {
      y: () => speed * 200,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });
  });

  const visual = document.getElementById('hero-visual');
  if (visual) {
  window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 18;
      gsap.to(visual, { x, y, duration: 0.8, ease: 'power2.out' });
    });
  }
}

/* ---- GSAP animations ---- */

function initHeroAnimation() {
  if (typeof gsap === 'undefined') return;

  const targets = gsap.utils.toArray('.js-hero-item');
  const chars = gsap.utils.toArray('.hero-name__char');
  const visual = document.querySelector('.js-hero-visual');

  const revealAll = () => {
    gsap.set([...targets, ...chars, visual].filter(Boolean), { clearProps: 'opacity,transform,visibility' });
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealAll();
    return;
  }

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: revealAll,
  });

  if (targets.length) {
    tl.from(targets, { y: 40, duration: 0.7, stagger: 0.08, delay: 0.1 });
  }

  if (chars.length) {
    tl.from(chars, { y: 50, duration: 0.6, stagger: 0.05, ease: 'back.out(1.5)' }, '-=0.4');
  }

  if (visual) {
    tl.from(visual, { scale: 0.9, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.5');
    tl.from(visual.querySelectorAll('.code-window'), { y: 30, duration: 0.5, stagger: 0.1 }, '-=0.5');
    tl.from(visual.querySelectorAll('.orbit-icon'), { scale: 0, duration: 0.4, stagger: 0.08, ease: 'back.out(2)' }, '-=0.35');
  }

  // Safety net — never leave hero hidden
  setTimeout(revealAll, 2500);

  gsap.to('.orbit-icon', {
    y: '+=14',
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: { each: 0.35, from: 'random' },
  });

  gsap.to('.shape', {
    y: '+=20',
    x: '+=8',
    rotation: '+=15',
    duration: 5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: { each: 0.6, from: 'random' },
  });
}

function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const bar = document.getElementById('scroll-progress');
      if (bar) bar.style.width = `${self.progress * 100}%`;
    },
  });

  ScrollTrigger.create({
    start: 80,
    onUpdate: (self) => {
      document.getElementById('site-nav')?.classList.toggle('scrolled', self.scroll() > 80);
    },
  });

  gsap.utils.toArray('.js-reveal').forEach((el) => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      immediateRender: false,
    });
  });

  gsap.utils.toArray('.title-word').forEach((word, i) => {
    gsap.from(word, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'back.out(1.5)',
      scrollTrigger: { trigger: '.section-intro', start: 'top 82%', once: true },
      immediateRender: false,
    });
  });

  gsap.from('.section-divider__line', {
    strokeDashoffset: 1200,
    duration: 2,
    ease: 'power2.inOut',
    scrollTrigger: { trigger: '.section-divider', start: 'top 90%', toggleActions: 'play none none reverse' },
  });
}

let cardsAnimated = false;

function initCardAnimations() {
  if (cardsAnimated) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  cardsAnimated = true;

  const cards = gsap.utils.toArray('.js-app-card');
  if (cards.length) {
    gsap.from(cards, {
      y: 80,
      opacity: 0,
      scale: 0.92,
      duration: 0.8,
      stagger: 0.15,
      ease: 'back.out(1.3)',
      scrollTrigger: { trigger: '#apps-grid', start: 'top 85%', once: true },
      immediateRender: false,
    });
  }

  document.querySelectorAll('.app-card:not(.app-card--disabled)').forEach((card) => {
    const glow = card.querySelector('.app-card__glow');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotateY: x * 14,
        rotateX: -y * 14,
        duration: 0.45,
        ease: 'power2.out',
        transformPerspective: 1200,
      });

      if (glow) {
        glow.style.left = `${e.clientX - rect.left}px`;
        glow.style.top = `${e.clientY - rect.top}px`;
      }
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
    });
  });

  const socialLinks = gsap.utils.toArray('.js-social-link');
  if (socialLinks.length) {
    gsap.from(socialLinks, {
      scale: 0,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'back.out(2)',
      scrollTrigger: { trigger: '.footer-social', start: 'top 90%', once: true },
      immediateRender: false,
    });
  }
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

function startApp() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initParticles();
  initCursor();

  if (typeof gsap === 'undefined') {
    return;
  }

  initMagnetic();
  initTypedWords();
  initParallax();
  initHeroAnimation();
  initScrollAnimations();
  initSmoothAnchors();
}

function init() {
  // Show name, stats, and cards right away — never wait for animations
  loadApps();
  initPreloader(startApp);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
