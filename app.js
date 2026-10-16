/* =========================================================
   BARSAN BANERJEE – PORTFOLIO JAVASCRIPT
   ========================================================= */

'use strict';

// ── LOADER ──────────────────────────────────────────────────
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1700);
  });

  document.body.style.overflow = 'hidden';
})();

// ── PARTICLES CANVAS ─────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const COLORS = ['rgba(16,213,159,', 'rgba(34,211,238,', 'rgba(168,85,247,'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.opacity = Math.random() * 0.5 + 0.1;
      this.opacityDir = Math.random() > 0.5 ? 0.003 : -0.003;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.opacityDir;
      if (this.opacity > 0.6 || this.opacity < 0.05) this.opacityDir *= -1;
      if (this.x < -5 || this.x > W + 5 || this.y < -5 || this.y > H + 5) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(16,213,159,${0.07 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animId = requestAnimationFrame(loop);
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((W * H) / 12000), 80);
    particles = Array.from({ length: count }, () => new Particle());
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      if (!animId) loop();
    } else {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }, { threshold: 0 });

  observer.observe(canvas.parentElement);

  window.addEventListener('resize', debounce(init, 300));
  init();
})();

// ── TYPED EFFECT ──────────────────────────────────────────────
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Full-Stack Web Apps',
    'ML & AI Models',
    'Network Systems',
    'Clean, Scalable Code',
    'Innovative Solutions'
  ];

  let phraseIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIdx === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 2200);
})();

// ── NAVBAR ─────────────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = navLinks ? navLinks.querySelectorAll('.nav-link') : [];

  if (!navbar) return;

  // Scroll class
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    // Back to top
    const btn = document.getElementById('back-to-top');
    if (btn) btn.classList.toggle('visible', window.scrollY > 500);

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      navLinks.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
})();

// ── BACK TO TOP ─────────────────────────────────────────────────
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ── SCROLL ANIMATIONS ───────────────────────────────────────────
(function initScrollAnimate() {
  const targets = document.querySelectorAll('[data-animate]');
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(getComputedStyle(entry.target).getPropertyValue('--delay') || '0') * 1000;
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(t => observer.observe(t));
})();

// ── GITHUB REPOS ─────────────────────────────────────────────────
(async function initGitHub() {
  const container = document.getElementById('github-repos');
  if (!container) return;

  const GITHUB_USER = 'barsan-collab';
  const PINNED_REPOS = ['CV-Intellect', 'FileShare', 'House-Price-Predictioner'];

  const LANG_COLORS = {
    Python: '#3776ab',
    JavaScript: '#f1e05a',
    Java: '#b07219',
    HTML: '#e34c26',
    CSS: '#563d7c',
    C: '#555555',
    TypeScript: '#2b7489',
    'Jupyter Notebook': '#da5b0b'
  };

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );

    if (!res.ok) throw new Error('GitHub API error');
    const repos = await res.json();

    // Filter out pinned repos and forks, show up to 6
    const filtered = repos
      .filter(r => !PINNED_REPOS.includes(r.name) && !r.fork)
      .slice(0, 6);

    if (!filtered.length) {
      container.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:20px;grid-column:1/-1">No additional repositories found.</p>`;
      return;
    }

    container.innerHTML = filtered.map(repo => {
      const lang = repo.language || '';
      const color = LANG_COLORS[lang] || 'var(--text-muted)';
      const desc = repo.description || 'No description provided.';
      const stars = repo.stargazers_count;
      const forks = repo.forks_count;

      return `
        <a href="${repo.html_url}" target="_blank" rel="noopener" class="repo-card" id="repo-${repo.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}">
          <div class="repo-name">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
            </svg>
            ${escapeHtml(repo.name)}
          </div>
          <p class="repo-desc">${escapeHtml(desc)}</p>
          <div class="repo-meta">
            ${lang ? `<span><span class="lang-dot" style="background:${color}"></span>${escapeHtml(lang)}</span>` : ''}
            ${stars > 0 ? `<span><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ${stars}</span>` : ''}
            ${forks > 0 ? `<span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9a9 9 0 01-9 9M6 9a9 9 0 009 9"/></svg> ${forks}</span>` : ''}
          </div>
        </a>
      `;
    }).join('');

  } catch (err) {
    console.warn('GitHub API unavailable, showing fallback:', err.message);
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding: 32px 20px;">
        <p style="color:var(--text-secondary); margin-bottom:16px;">Live repos couldn't be loaded right now.</p>
        <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener" class="btn btn-outline" style="display:inline-flex;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          Browse GitHub Profile
        </a>
      </div>
    `;
  }
})();

// ── CONTACT FORM ──────────────────────────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    const mailtoLink = `mailto:barsanbanerjee99@gmail.com?subject=${encodeURIComponent(subject + ' (from ' + name + ')')}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)}`;
    window.location.href = mailtoLink;
    showToast('Opening email client...', 'success');
  });
})();

// ── TOAST NOTIFICATION ────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed;bottom:80px;right:24px;z-index:9999;
    padding:14px 22px;border-radius:10px;font-size:0.88rem;font-weight:600;
    background:${type === 'success' ? 'rgba(16,213,159,0.15)' : 'rgba(239,68,68,0.15)'};
    border:1px solid ${type === 'success' ? 'rgba(16,213,159,0.4)' : 'rgba(239,68,68,0.4)'};
    color:${type === 'success' ? '#10d59f' : '#ef4444'};
    backdrop-filter:blur(20px);
    animation:toastIn 0.4s ease both;
    font-family:'Inter',sans-serif;
  `;

  const style = document.createElement('style');
  style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(style);

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ── FOOTER YEAR ───────────────────────────────────────────────────
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

// ── SMOOTH SCROLL ─────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── SKILL CHIP TOOLTIP ─────────────────────────────────────────────
(function initSkillTooltips() {
  document.querySelectorAll('.skill-chip[data-level]').forEach(chip => {
    chip.addEventListener('mouseenter', function (e) {
      const existing = document.querySelector('.skill-tooltip');
      if (existing) existing.remove();

      const level = this.getAttribute('data-level');
      const tooltip = document.createElement('div');
      tooltip.className = 'skill-tooltip';
      tooltip.innerHTML = `
        <span>Proficiency</span>
        <div class="tooltip-bar">
          <div class="tooltip-fill" style="width:0;background:var(--grad-primary);height:4px;border-radius:2px;transition:width 0.5s ease"></div>
        </div>
        <strong>${level}%</strong>
      `;
      tooltip.style.cssText = `
        position:fixed;
        padding:10px 14px;
        background:rgba(10,10,15,0.95);
        border:1px solid var(--border-color);
        border-radius:10px;
        font-size:0.78rem;
        color:var(--text-secondary);
        font-family:'Inter',sans-serif;
        display:flex;flex-direction:column;gap:6px;min-width:130px;
        box-shadow:0 8px 32px rgba(0,0,0,0.5);
        pointer-events:none;z-index:999;
        backdrop-filter:blur(20px);
      `;

      const tooltipBar = tooltip.querySelector('.tooltip-bar');
      tooltipBar.style.cssText = 'background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;';

      document.body.appendChild(tooltip);

      const rect = this.getBoundingClientRect();
      tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
      tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

      requestAnimationFrame(() => {
        tooltip.querySelector('.tooltip-fill').style.width = level + '%';
      });
    });

    chip.addEventListener('mouseleave', () => {
      document.querySelector('.skill-tooltip')?.remove();
    });
  });
})();

// ── PARALLAX HERO ──────────────────────────────────────────────────
(function initParallax() {
  const hero = document.getElementById('home');
  if (!hero) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const split = hero.querySelector('.hero-split');
        if (split && scrollY < window.innerHeight) {
          split.style.transform = `translateY(${scrollY * 0.2}px)`;
          split.style.opacity = `${1 - scrollY / (window.innerHeight * 0.75)}`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ── UTILITY: DEBOUNCE ─────────────────────────────────────────────
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ── UTILITY: ESCAPE HTML ──────────────────────────────────────────
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(str).replace(/[&<>"']/g, c => map[c]);
}

// ── CURSOR GLOW EFFECT (desktop only) ────────────────────────────
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;pointer-events:none;z-index:9998;
    width:300px;height:300px;border-radius:50%;
    background:radial-gradient(circle,rgba(16,213,159,0.04) 0%,transparent 70%);
    transform:translate(-50%,-50%);
    transition:opacity 0.3s ease;
    will-change:left,top;
  `;
  document.body.appendChild(glow);

  let x = 0, y = 0, active = false;

  document.addEventListener('mousemove', e => {
    x = e.clientX;
    y = e.clientY;
    if (!active) {
      active = true;
      requestAnimationFrame(movGlow);
    }
  });

  function movGlow() {
    glow.style.left = x + 'px';
    glow.style.top = y + 'px';
    active = false;
  }
})();
