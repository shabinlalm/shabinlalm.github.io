/* ==========================================================================
   Portfolio application
   Content comes from /data/*.js — keep UI logic here, copy there.
   ========================================================================== */

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const PLACEHOLDER = "[Add project-specific details here]";

  function yearsSince(iso) {
    const start = new Date(iso + "-01");
    if (Number.isNaN(start.getTime())) return null;
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    const m = now.getMonth() - start.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < start.getDate())) years -= 1;
    return Math.max(0, years);
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isPlaceholder(text) {
    return !text || String(text).includes(PLACEHOLDER);
  }

  function textBlock(value) {
    const raw = String(value || PLACEHOLDER);
    const cls = isPlaceholder(raw) ? ' class="placeholder-note"' : "";
    return `<p${cls}>${escapeHtml(raw)}</p>`;
  }

  function chips(list) {
    return (list || [])
      .map((t) => `<span class="chip">${escapeHtml(t)}</span>`)
      .join("");
  }

  function projectById(id) {
    return (window.PROJECTS || []).find((p) => p.id === id);
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

  function sliderHtml(project, index, opts = {}) {
    const slides = projectSlides(project);
    const n = String((index ?? 0) + 1).padStart(2, "0");
    const slideMarkup = slides
      .map((slide, i) => {
        if (slide.placeholder) {
          return `<div class="slider-slide" data-slide="${i}">
            <div class="cover-placeholder v${slide.variant % 3}">
              <span class="idx">${n} / ${escapeHtml(project.category)}</span>
              <span class="cat">${escapeHtml(slide.caption)} · add files in public/projects/${escapeHtml(project.id)}/</span>
            </div>
          </div>`;
        }
        return `<div class="slider-slide" data-slide="${i}">
          <img src="${escapeHtml(slide.src)}" alt="${escapeHtml(slide.caption || project.title)}" loading="lazy" width="800" height="450" ${opts.lightbox ? `data-shot="${i}"` : ""} />
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
    $$( "[data-slider]", scope || document).forEach((slider) => {
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

  /* ----- Theme ----- */

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

  /* ----- Header / nav ----- */

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

  /* ----- Experience ----- */

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
              <h3>${escapeHtml(job.company)}</h3>
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

  function renderExpertise() {
    const root = $("#expertise-grid");
    if (!root) return;
    root.innerHTML = (window.EXPERTISE || [])
      .map(
        (item) => `
        <article class="exp-tile">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </article>`
      )
      .join("");
  }

  /* ----- Projects ----- */

  const FILTERS = [
    { id: "all", label: "All" },
    { id: "industrial", label: "Industrial" },
    { id: "integration", label: "Integration" },
    { id: "enterprise", label: "Enterprise" },
    { id: "hms", label: "HMS" },
  ];

  let activeFilter = "all";

  function visibleProjects() {
    const list = window.PROJECTS || [];
    if (activeFilter === "all") return list.filter((p) => !p.supporting);
    return list.filter((p) => (p.tags || []).includes(activeFilter) && !p.supporting);
  }

  function renderFilters() {
    const root = $("#project-filters");
    if (!root) return;
    root.innerHTML = FILTERS.map(
      (f) =>
        `<button type="button" data-filter="${f.id}" aria-pressed="${f.id === activeFilter}">${f.label}</button>`
    ).join("");
    root.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      $$("button", root).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      renderProjects();
    });
  }

  function renderProjects() {
    const root = $("#project-grid");
    if (!root) return;
    const list = visibleProjects();
    if (!list.length) {
      root.innerHTML = `<p class="section-lead">No projects in this category yet.</p>`;
      return;
    }
    root.innerHTML = list
      .map((p, i) => {
        return `
        <article class="project-card">
          <div class="project-cover">${sliderHtml(p, i)}</div>
          <div class="project-body">
            <p class="project-cat">${escapeHtml(p.category)}</p>
            <h3>${escapeHtml(p.title)}</h3>
            <p>${escapeHtml(p.summary)}</p>
            <div class="chip-row">${chips(p.stack)}</div>
            <div class="project-foot">
              <button type="button" class="link-btn" data-open-case="${escapeHtml(p.id)}">View Case Study</button>
            </div>
          </div>
        </article>`;
      })
      .join("");

    renderSupporting();
    mountSliders(root);
    $$(".project-card", root).forEach((el) => el.classList.add("rise-in", "is-in"));
  }

  function renderSupporting() {
    const root = $("#more-projects");
    if (!root) return;
    if (activeFilter !== "all") {
      root.innerHTML = "";
      return;
    }
    const extra = (window.PROJECTS || []).filter((p) => p.supporting);
    if (!extra.length) {
      root.innerHTML = "";
      return;
    }
    root.innerHTML = `
      <h3 class="more-title">Additional systems</h3>
      <p class="section-lead">Earlier product and customer work kept here as supporting history — not the current focus.</p>
      <div class="study-list">
        ${extra
          .map(
            (p) => `
          <button type="button" class="study-row" data-open-case="${escapeHtml(p.id)}">
            <span class="study-idx">${escapeHtml(p.category)}</span>
            <div>
              <h3>${escapeHtml(p.title)}</h3>
              <p>${escapeHtml(p.summary)}</p>
            </div>
            <span class="link-btn">Open</span>
          </button>`
          )
          .join("")}
      </div>`;
  }

  /* ----- Skills / clients ----- */

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
    if (!root) return;
    root.innerHTML = (window.CLIENTS || [])
      .map((c) => {
        const visual = c.logo
          ? `<img src="${escapeHtml(c.logo)}" alt="${escapeHtml(c.name)} logo" loading="lazy" />`
          : `<div class="client-mark">${escapeHtml(c.name)}</div>`;
        return `<article class="client-card">${visual}<p>${escapeHtml(c.context)}</p></article>`;
      })
      .join("");
  }

  /* ----- Contact / resume ----- */

  function renderContact() {
    const site = window.SITE || {};
    const year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());

    wireSocial("linkedin-card", site.linkedin, "LinkedIn");
    wireSocial("github-card", site.github, "GitHub");
    probeResume();
  }

  function wireSocial(id, url, label) {
    const card = document.getElementById(id);
    if (!card) return;
    if (url) {
      const a = document.createElement("a");
      a.className = "contact-card";
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML = `<span>${label}</span><strong>${escapeHtml(url.replace(/^https?:\/\//, ""))}</strong>`;
      card.replaceWith(a);
    } else {
      card.classList.add("is-placeholder");
    }
  }

  async function probeResume() {
    const path = window.SITE?.resumePath;
    const hint = $("#resume-hint");
    if (!path) return;
    try {
      const res = await fetch(path, { method: "HEAD" });
      if (!res.ok) throw new Error("missing");
    } catch {
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
    }
  }

  /* ----- Case study ----- */

  function bindCaseOpens() {
    document.addEventListener("click", (e) => {
      if (e.target.closest("#case-close")) {
        closeCase();
        return;
      }
      const btn = e.target.closest("[data-open-case]");
      if (btn) openCase(btn.getAttribute("data-open-case"));
    });

    $("#case-root")?.addEventListener("click", (e) => {
      if (e.target.id === "case-root") closeCase();
    });

    $("#case-page")?.addEventListener("click", (e) => {
      const shot = e.target.closest("[data-shot]");
      if (!shot) return;
      openLightbox(Number(shot.dataset.shot));
    });
  }

  function openCase(id) {
    const project = projectById(id);
    if (!project) return;
    const root = $("#case-root");
    const page = $("#case-page");
    lbShots = projectSlides(project).filter((s) => s.src);
    page.innerHTML = caseHtml(project);
    root.hidden = false;
    document.body.classList.add("case-open");
    mountSliders(page);
    page.focus();
    history.replaceState(null, "", `#/work/${project.id}`);
  }

  function closeCase() {
    $("#case-root").hidden = true;
    document.body.classList.remove("case-open");
    if (location.hash.startsWith("#/work/")) {
      history.replaceState(null, "", "#work");
    }
  }

  function caseHtml(p) {
    const cs = p.caseStudy || {};
    const docs = p.documents || [];
    const gallery = sliderHtml(p, 0, { lightbox: true });

    const docsHtml = docs.length
      ? docs
          .map(
            (d) => `
          <div class="doc-row">
            <div>
              <strong>${escapeHtml(d.title)}</strong>
              <p>${escapeHtml(d.description || "")}</p>
            </div>
            <div>
              <a href="${escapeHtml(d.src)}" target="_blank" rel="noopener">View PDF</a>
              ·
              <a href="${escapeHtml(d.src)}" download>Download PDF</a>
            </div>
          </div>`
          )
          .join("")
      : `<p class="placeholder-note">No public documents attached. Add PDFs under public/documents/ when they are cleared for sharing.</p>`;

    const arch = p.architectureImage
      ? `<img src="${escapeHtml(p.architectureImage)}" alt="Architecture" loading="lazy" />`
      : textBlock(cs.architecture);

    const video = p.video
      ? `<p><a class="link-btn" href="${escapeHtml(p.video)}" target="_blank" rel="noopener">Watch demo video</a></p>`
      : "";

    return `
      <div class="case-top">
        <div>
          <p class="case-k">${escapeHtml(p.category)}</p>
          <h2 id="case-title">${escapeHtml(p.title)}</h2>
          ${p.client ? `<p>Project / solution delivered for ${escapeHtml(p.client)}</p>` : ""}
        </div>
        <button type="button" class="icon-btn" id="case-close" aria-label="Close case study">×</button>
      </div>
      <p>${escapeHtml(p.summary)}</p>
      <div class="chip-row">${chips(p.stack)}</div>
      <div class="case-block"><h3>Problem</h3>${textBlock(cs.problem)}</div>
      <div class="case-block"><h3>Business context</h3>${textBlock(cs.context)}</div>
      <div class="case-block"><h3>Solution</h3>${textBlock(cs.solution)}</div>
      <div class="case-block"><h3>My role</h3>${textBlock(cs.role)}</div>
      <div class="case-block"><h3>Architecture / flow</h3>${arch}</div>
      <div class="case-block"><h3>Key features</h3><ul>${(p.features || []).map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul></div>
      <div class="case-block"><h3>Integrations</h3>${
        (p.integrations || []).length
          ? `<div class="chip-row">${chips(p.integrations)}</div>`
          : `<p class="placeholder-note">No integrations listed for this project.</p>`
      }</div>
      <div class="case-block"><h3>Challenges</h3>${textBlock(cs.challenges)}</div>
      <div class="case-block"><h3>Outcome</h3>${textBlock(cs.outcome)}</div>
      <div class="case-block"><h3>Screenshots</h3>${gallery}${video}</div>
      <div class="case-block"><h3>Documents</h3>${docsHtml}</div>
    `;
  }

  function routeFromHash() {
    const m = location.hash.match(/^#\/work\/([a-z0-9-]+)/i);
    if (m) openCase(m[1]);
  }

  /* ----- Lightbox ----- */

  let lbShots = [];
  let lbIndex = 0;

  function openLightbox(index) {
    if (!lbShots.length) return;
    lbIndex = index;
    const box = $("#lightbox");
    box.hidden = false;
    document.body.classList.add("lb-open");
    showLb();
  }

  function closeLightbox() {
    $("#lightbox").hidden = true;
    document.body.classList.remove("lb-open");
    $("#case-page")?.focus();
  }

  function showLb() {
    const shot = lbShots[lbIndex];
    if (!shot) return;
    const img = $("#lightbox-img");
    img.src = shot.src;
    img.alt = shot.caption || "Project screenshot";
    $("#lightbox-cap").textContent = shot.caption || "";
  }

  function initLightbox() {
    $("#lightbox-close")?.addEventListener("click", closeLightbox);
    $("#lightbox-prev")?.addEventListener("click", () => {
      lbIndex = (lbIndex - 1 + lbShots.length) % lbShots.length;
      showLb();
    });
    $("#lightbox-next")?.addEventListener("click", () => {
      lbIndex = (lbIndex + 1) % lbShots.length;
      showLb();
    });
    $("#lightbox")?.addEventListener("click", (e) => {
      if (e.target.id === "lightbox") closeLightbox();
    });
  }

  /* ----- Keyboard ----- */

  function initKeys() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!$("#lightbox").hidden) {
          closeLightbox();
          return;
        }
        if (!$("#case-root").hidden) closeCase();
      }
      if ($("#lightbox").hidden) return;
      if (e.key === "ArrowLeft") $("#lightbox-prev")?.click();
      if (e.key === "ArrowRight") $("#lightbox-next")?.click();
    });
  }

  function initReveal() {
    const nodes = $$(".section-head, .exp-card, .project-card, .exp-tile, .client-card, .stack-group, .journey-item, .hero-panel, .flow-diagram, .integ-board, .resume-panel, .contact-card");
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
    renderExpertise();
    renderFilters();
    renderProjects();
    renderStack();
    renderClients();
    renderContact();
    bindCaseOpens();
    initLightbox();
    initKeys();
    initReveal();
    routeFromHash();
    window.addEventListener("hashchange", routeFromHash);

    const y = yearsSince(window.SITE?.careerStart);
    if (y) {
      /* years available for future copy; kept for maintainability */
      document.documentElement.dataset.years = String(y);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
