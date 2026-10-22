(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function chips(list) {
    return (list || [])
      .map((t) => `<span class="chip">${escapeHtml(t)}</span>`)
      .join("");
  }

  function projectSlides(project) {
    const shots = [...(project.screenshots || [])];
    if (project.cover && !shots.some((s) => s.src === project.cover)) {
      shots.unshift({ src: project.cover, caption: project.title });
    }
    if (shots.length) return shots;
    return [0, 1, 2].map((i) => ({
      placeholder: true,
      variant: i,
      caption: `View ${String(i + 1).padStart(2, "0")}`,
    }));
  }

  function sliderHtml(project, index) {
    const slides = projectSlides(project);
    const n = String((index ?? 0) + 1).padStart(2, "0");
    const slideMarkup = slides
      .map((slide, i) => {
        if (slide.placeholder) {
          return `<div class="slider-slide" data-slide="${i}">
            <div class="cover-placeholder v${slide.variant % 3}">
              <span class="idx">${n}</span>
              <span class="cat">${escapeHtml(slide.caption)}</span>
            </div>
          </div>`;
        }
        return `<div class="slider-slide" data-slide="${i}">
          <img src="${escapeHtml(slide.src)}" alt="${escapeHtml(slide.caption || project.title)}" loading="lazy" width="800" height="450" />
        </div>`;
      })
      .join("");
    const dots = slides
      .map((_, i) => `<button type="button" data-dot="${i}" aria-label="Show screenshot ${i + 1}"${i === 0 ? ' class="is-active"' : ""}></button>`)
      .join("");
    const nav =
      slides.length > 1
        ? `<button type="button" class="slider-nav prev" data-dir="-1" aria-label="Previous screenshot">‹</button>
           <button type="button" class="slider-nav next" data-dir="1" aria-label="Next screenshot">›</button>
           <div class="slider-dots">${dots}</div>`
        : "";
    return `<div class="slider" data-slider data-count="${slides.length}"><div class="slider-track">${slideMarkup}</div>${nav}</div>`;
  }

  function goToSlide(slider, next) {
    const count = Number(slider.dataset.count) || 1;
    if (count < 1) return;
    const index = ((next % count) + count) % count;
    slider.dataset.index = String(index);
    const track = slider.querySelector(".slider-track");
    if (track) track.style.transform = `translateX(-${index * 100}%)`;
    slider.querySelectorAll("[data-dot]").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  }

  function mountSliders(scope) {
    $$("[data-slider]", scope || document).forEach((slider) => {
      if (slider.dataset.bound === "1") return;
      slider.dataset.bound = "1";
      slider.dataset.index = "0";
      slider.addEventListener("click", (e) => {
        const dirBtn = e.target.closest("[data-dir]");
        const dot = e.target.closest("[data-dot]");
        if (dirBtn) {
          e.preventDefault();
          e.stopPropagation();
          goToSlide(slider, Number(slider.dataset.index || 0) + Number(dirBtn.dataset.dir));
        } else if (dot) {
          e.preventDefault();
          e.stopPropagation();
          goToSlide(slider, Number(dot.dataset.dot));
        }
      });
    });
  }

  function initTheme() {
    const stored = localStorage.getItem("theme");
    const theme = stored === "light" || stored === "dark" ? stored : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    syncThemeButton(theme);

    $("#theme-toggle")?.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      syncThemeButton(next);
    });
  }

  function syncThemeButton(theme) {
    const btn = $("#theme-toggle");
    if (!btn) return;
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0c1116" : "#f4f0e8");
  }

  function initHeader() {
    const header = $("#site-header");
    const toggle = $("#nav-toggle");
    const mobile = $("#nav-mobile");

    const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    toggle?.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      if (open) mobile.setAttribute("hidden", "");
      else mobile.removeAttribute("hidden");
    });

    mobile?.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        toggle.setAttribute("aria-expanded", "false");
        mobile.setAttribute("hidden", "");
      }
    });

    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#" || id.startsWith("#/")) return;
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", id);
      });
    });
  }

  function companyHeading(job) {
    const name = escapeHtml(job.company);
    const title = job.website
      ? `<a class="exp-company" href="${escapeHtml(job.website)}" target="_blank" rel="noopener noreferrer">${name}<span class="exp-ext" aria-hidden="true">↗</span></a>`
      : `<span class="exp-company">${name}</span>`;
    const logo = job.logo
      ? `<img class="exp-logo" src="${escapeHtml(job.logo)}" alt="" width="40" height="40" />`
      : "";
    return `<div class="exp-head">${logo}<h3>${title}</h3></div>`;
  }

  function renderExperience() {
    const root = $("#timeline");
    if (!root) return;
    root.innerHTML = (window.EXPERIENCE || [])
      .map(
        (job) => `
        <li>
          <article class="exp-card${job.featured ? " is-featured" : ""}">
            <div class="exp-when">${escapeHtml(job.start)} — ${escapeHtml(job.end)}</div>
            <div>
              ${companyHeading(job)}
              <p class="exp-role">${escapeHtml(job.role)}</p>
              <p class="exp-meta">${escapeHtml(job.location)} · ${escapeHtml(job.period)}</p>
              ${job.product ? `<p class="exp-meta">${escapeHtml(job.product)}</p>` : ""}
              <ul>${(job.responsibilities || []).map((r) => `<li>${escapeHtml(r)}</li>`).join("")}</ul>
              <div class="chip-row">${chips(job.stack)}</div>
            </div>
          </article>
        </li>`
      )
      .join("");
  }

  function renderJourney() {
    const root = $("#journey-line");
    if (!root) return;
    root.innerHTML = (window.CAREER_JOURNEY || [])
      .map(
        (s) => `
        <li class="journey-item">
          <span>${escapeHtml(s.year)}</span>
          <strong>${escapeHtml(s.title)}</strong>
          <em>${escapeHtml(s.place)}</em>
        </li>`
      )
      .join("");
  }

  function renderProjects() {
    const root = $("#project-grid");
    if (!root) return;
    const list = window.PROJECTS || [];
    if (!list.length) {
      root.innerHTML = `<p class="section-lead">No projects yet.</p>`;
      return;
    }
    root.innerHTML = list
      .map((p, i) => {
        return `
        <article class="project-card">
          <div class="project-cover">${sliderHtml(p, i)}</div>
          <div class="project-body">
            <h3>${escapeHtml(p.title)}</h3>
            <p>${escapeHtml(p.summary)}</p>
            <div class="chip-row">${chips(p.stack)}</div>
          </div>
        </article>`;
      })
      .join("");

    mountSliders(root);
    $$(".project-card", root).forEach((el) => el.classList.add("rise-in", "is-in"));
  }

  function renderStack() {
    const root = $("#stack-groups");
    if (!root) return;
    root.innerHTML = (window.SKILLS?.groups || [])
      .map(
        (g) => `
        <article class="stack-group">
          <h3>${escapeHtml(g.title)}</h3>
          <div class="chip-row">
            ${(g.items || [])
              .map(
                (item) =>
                  `<span class="chip" data-level="${escapeHtml(item.level)}" title="${escapeHtml(item.level)}">${escapeHtml(item.name)}</span>`
              )
              .join("")}
          </div>
        </article>`
      )
      .join("");

    const eng = $("#eng-list");
    if (eng) {
      eng.innerHTML = (window.SKILLS?.engineering || [])
        .map((t) => `<span>${escapeHtml(t)}</span>`)
        .join("");
    }
  }

  function renderClients() {
    const root = $("#client-grid");
    const section = $("#clients");
    const list = window.CLIENTS || [];
    if (!list.length) {
      section?.setAttribute("hidden", "");
      if (root) root.innerHTML = "";
      return;
    }
    section?.removeAttribute("hidden");
    if (!root) return;
    root.innerHTML = list
      .map((c) => {
        const logo = c.logo
          ? `<span class="client-logo"><img src="${escapeHtml(c.logo)}" alt="" loading="lazy" /></span>`
          : "";
        const place = c.place ? `<p class="client-place">${escapeHtml(c.place)}</p>` : "";
        return `<article class="client-card">
          <div class="client-title">
            ${logo}
            <div class="client-id">
              <div class="client-mark">${escapeHtml(c.name)}</div>
              ${place}
            </div>
          </div>
          <p>${escapeHtml(c.context)}</p>
        </article>`;
      })
      .join("");
  }

  function renderContact() {
    const site = window.SITE || {};
    const year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());

    wireSocial("linkedin-card", site.linkedin, "LinkedIn", site.linkedinLabel);
    wireResume();
    probeResume();
  }

  function resumeFileName(path) {
    return String(path || "").split("/").pop() || "Shabinlal_Resume.pdf";
  }

  function wireResume() {
    const path = window.SITE?.resumePath;
    if (!path) return;
    const name = resumeFileName(path);
    $$("[data-resume]").forEach((el) => {
      el.setAttribute("href", path);
      if (el.hasAttribute("data-resume-download") || el.id === "resume-download" || el.id === "hero-resume") {
        el.setAttribute("download", name);
      }
    });
  }

  function wireSocial(id, url, label, displayLabel) {
    const card = document.getElementById(id);
    if (!card) return;
    if (url) {
      const a = document.createElement("a");
      a.className = "contact-card";
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML = `<span>${label}</span><strong>${escapeHtml(displayLabel || label)}</strong>`;
      card.replaceWith(a);
    } else {
      card.classList.add("is-placeholder");
    }
  }

  async function probeResume() {
    const path = window.SITE?.resumePath;
    const hint = $("#resume-hint");
    if (!path) return;

    const markMissing = () => {
      hint?.removeAttribute("hidden");
      $$("[data-resume]").forEach((el) => {
        el.setAttribute("aria-disabled", "true");
        el.classList.add("is-disabled");
        el.addEventListener("click", (e) => {
          e.preventDefault();
          hint?.removeAttribute("hidden");
          $("#resume")?.scrollIntoView({ behavior: "smooth" });
        });
      });
    };

    try {
      let res = await fetch(path, { method: "HEAD", cache: "no-store" });
      if (!res.ok && (res.status === 405 || res.status === 501)) {
        res = await fetch(path, { method: "GET", cache: "no-store" });
      }
      if (res.ok || res.status === 206) {
        hint?.setAttribute("hidden", "");
        return;
      }
      if (res.status === 404) markMissing();
    } catch {
      hint?.setAttribute("hidden", "");
    }
  }

  function initReveal() {
    const nodes = $$(".section-head, .exp-card, .project-card, .client-card, .stack-group, .journey-item, .hero-panel, .flow-diagram, .resume-panel, .contact-card");
    nodes.forEach((el) => el.classList.add("rise-in"));
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((el) => io.observe(el));
  }

  function init() {
    initTheme();
    initHeader();
    renderExperience();
    renderJourney();
    renderProjects();
    renderStack();
    renderClients();
    renderContact();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
