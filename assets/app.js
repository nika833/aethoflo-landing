// ============================================
// aethoflo — shared behavior
// ============================================

(function () {
  'use strict';

  // ----- Scroll reveal -----
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.animation = 'none';
        el.classList.add('in');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  function initReveals() {
    const viewportH = window.innerHeight;
    document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportH * 0.95) {
        // Force inline styles — bypasses frozen CSS animations in preview
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.animation = 'none';
        el.classList.add('in');
      } else {
        revealObserver.observe(el);
      }
    });
  }

  // ----- Hero copy — force visibility (bypasses frozen CSS animations) -----
  function initHeroCopy() {
    const heroSelectors = [
      '.hero-eyebrow', '.hero-title .word', '.hero-title .moment',
      '.hero-lead', '.hero-cta', '.hero-mock',
    ];
    heroSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
        el.style.animation = 'none';
      });
    });
    // Also ensure the underline on "moment/opportunity" draws
    document.querySelectorAll('.hero-title .moment::after').forEach(el => {
      if (el.style) el.style.transform = 'scaleX(1)';
    });
  }
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const toggle = nav.querySelector('.nav-mobile-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('mobile-open');
      });
    }

    // Mark active link
    const path = window.location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('.nav-link').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // ----- Cursor-reactive cards + buttons -----
  function initCursor() {
    document.querySelectorAll('.card, .btn-primary').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--mx', `-200px`);
        el.style.setProperty('--my', `-200px`);
      });
    });
  }

  // ----- Count-up animation for stat numbers -----
  function initCountUp() {
    const els = document.querySelectorAll('[data-countup]');
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.countup, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = Math.round(target * eased);
          el.textContent = val + suffix;
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    els.forEach((el) => obs.observe(el));
  }

  // ----- Smooth anchor scroll (with offset for sticky nav) -----
  function initAnchors() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  // ----- Rotating headline words -----
  function initRotatingWords() {
    document.querySelectorAll('.rotating-word').forEach((container) => {
      const words = Array.from(container.querySelectorAll('.rw-word'));
      if (words.length < 2) return;

      // Initial state: exactly the first word visible (clear any stale)
      words.forEach((w, n) => w.classList.toggle('rw-in', n === 0));

      let i = 0;
      const DWELL = 2400; // time a word stays fully visible
      const OVERLAP = 120; // small overlap so transition feels continuous

      function next() {
        // Remove rw-in from the currently-visible word, add to next.
        // (Everything in one tick so throttled setTimeouts can't cause
        // overlapping "in" states.)
        words[i].classList.remove('rw-in');
        i = (i + 1) % words.length;
        words[i].classList.add('rw-in');
      }

      // Pause when tab hidden; resume when visible
      let timer = setInterval(next, DWELL);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          clearInterval(timer);
        } else {
          timer = setInterval(next, DWELL);
        }
      });
    });
  }

  // ----- Init -----
  function init() {
    initHeroCopy();
    initNav();
    initReveals();
    initCursor();
    initCountUp();
    initAnchors();
    initRotatingWords();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
