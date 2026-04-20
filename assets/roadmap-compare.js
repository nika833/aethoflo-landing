// ============================================
// Roadmap comparison — move & match animation
// ============================================

(function () {
  const BUNDLES = [
    'Rapport Building (Client)',
    'Rapport Building (Family)',
    'Rapport Building (Colleagues)',
    'Session Structure',
    'Environmental Safety',
    'Learning Opportunities',
    'Instructional Procedures',
    'Data Collection',
    'Behavior Reduction',
    'Skill Acquisition',
    'Generalization Opportunities',
    'Parent Involvement',
    'Documentation',
    'Ethics',
    'Professionalism',
    'Communication'
  ];

  const INTRO = '#2B3D8F';
  const COMPETENCY = '#E87A4E';
  const MAINTENANCE = '#F5CC4C';

  // Helper to make an id-stable dot list.
  // Each dot has: id, row, beforeCol, beforeColor, afterCol, afterColor
  // "col" is 1..25. Additional dots appear only in AFTER state (col defined, beforeCol=null).
  function buildDots() {
    const dots = [];
    let id = 0;

    // ---- BEFORE pattern — per reference image ----
    // Visit 01: ALL 16 rows, blue (onboarding baseline)
    BUNDLES.forEach((_, r) => dots.push({
      id: id++, row: r, beforeCol: 1, beforeColor: INTRO, afterCol: null, afterColor: null
    }));

    // Visit 08: yellow bursts on many rows (maintenance burst)
    const v08Rows = [0, 3, 5, 6, 7, 8, 9, 12, 13, 14];
    v08Rows.forEach(r => dots.push({
      id: id++, row: r, beforeCol: 8, beforeColor: MAINTENANCE, afterCol: null, afterColor: null
    }));

    // Visit 16: yellow bursts
    const v16Rows = [2, 3, 4, 5, 7, 8, 10, 12];
    v16Rows.forEach(r => dots.push({
      id: id++, row: r, beforeCol: 16, beforeColor: MAINTENANCE, afterCol: null, afterColor: null
    }));

    // Visit 24: yellow bursts
    const v24Rows = [1, 2, 4, 5, 10, 14, 15];
    v24Rows.forEach(r => dots.push({
      id: id++, row: r, beforeCol: 24, beforeColor: MAINTENANCE, afterCol: null, afterColor: null
    }));

    // ---- AFTER pattern — staggered diagonal cascade per row ----
    // Each row gets: intro (blue) → competency x2 (orange) → maintenance (yellow) stretching across months
    // The intro column starts at (row % 5 + 1), cascading diagonally then wrapping
    BUNDLES.forEach((_, r) => {
      // Intro timing — diagonal cascade
      const introStart = 1 + (r % 6);

      // Intro dot (blue)
      dots.push({
        id: id++, row: r, beforeCol: null, beforeColor: null,
        afterCol: introStart, afterColor: INTRO
      });

      // Competency assessments (orange) — 1-2 close to intro
      dots.push({
        id: id++, row: r, beforeCol: null, beforeColor: null,
        afterCol: introStart + 1, afterColor: COMPETENCY
      });
      if (r % 2 === 0) {
        dots.push({
          id: id++, row: r, beforeCol: null, beforeColor: null,
          afterCol: introStart + 2, afterColor: COMPETENCY
        });
      }
      if (r % 3 === 0) {
        dots.push({
          id: id++, row: r, beforeCol: null, beforeColor: null,
          afterCol: introStart + 4, afterColor: COMPETENCY
        });
      }

      // Additional competency checks mid-stream
      if (r % 2 === 1) {
        dots.push({
          id: id++, row: r, beforeCol: null, beforeColor: null,
          afterCol: introStart + 5, afterColor: COMPETENCY
        });
      }

      // Maintenance (yellow) — spread across the later months
      const maintStart = introStart + 5 + (r % 3);
      for (let m = 0; m < 5; m++) {
        const c = maintStart + m * (2 + (r % 3));
        if (c >= 1 && c <= 25) {
          dots.push({
            id: id++, row: r, beforeCol: null, beforeColor: null,
            afterCol: c, afterColor: MAINTENANCE
          });
        }
      }
    });

    // ---- For BEFORE-only dots, assign them new AFTER positions (reused in new layout) ----
    // The before-only dots (onboarding bursts) transform into the new cascade.
    // Rather than leaving them stranded, they BECOME the first intro/competency dots.
    // We already created new after dots above; mark the before-only dots as fading out.
    // But for visual continuity we'll MATCH some of them (move & match).
    // Simpler approach: before-only dots exit (fade + shrink), after-only dots enter.
    // The "move & match" feeling comes from them leaving as the new ones arrive.

    return dots;
  }

  function render(stage) {
    const chart = stage.querySelector('.rc-chart');
    const cols = stage.querySelector('#rc-cols');
    const grid = stage.querySelector('#rc-grid');

    // Column headers
    cols.innerHTML = '<span></span>' + Array.from({length: 25}, (_, i) => {
      const n = String(i + 1).padStart(2, '0');
      return `<span class="rc-col-num">${n}</span>`;
    }).join('');

    // Rows
    grid.innerHTML = BUNDLES.map((name, r) => {
      const cells = Array.from({length: 25}, (_, c) =>
        `<div class="rc-cell" data-row="${r}" data-col="${c + 1}"></div>`
      ).join('');
      return `<div class="rc-row"><div class="rc-row-label">${name}</div>${cells}</div>`;
    }).join('');

    // Build dot list
    const dots = buildDots();
    const dotEls = {};

    // Position cache: compute cell centers
    function cellCenter(row, col) {
      const cell = grid.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      if (!cell) return null;
      const cr = cell.getBoundingClientRect();
      const pr = chart.getBoundingClientRect();
      return {
        x: cr.left - pr.left + cr.width / 2,
        y: cr.top - pr.top + cr.height / 2
      };
    }

    // Create dots absolutely positioned inside chart
    dots.forEach(d => {
      const el = document.createElement('div');
      el.className = 'rc-d';
      el.style.color = d.beforeColor || d.afterColor;
      el.style.background = d.beforeColor || d.afterColor;
      chart.appendChild(el);
      dotEls[d.id] = el;
    });

    // Position function given state
    function applyState(state, animate) {
      stage.classList.toggle('state-after', state === 'after');
      const w = 16;
      dots.forEach(d => {
        const el = dotEls[d.id];
        let col = state === 'before' ? d.beforeCol : d.afterCol;
        let color = state === 'before' ? d.beforeColor : d.afterColor;

        if (col == null) {
          // Dot doesn't exist in this state → fade out in place
          el.classList.remove('in');
          el.style.opacity = '0';
          el.style.transform = 'scale(0.3)';
          return;
        }

        const center = cellCenter(d.row, col);
        if (!center) return;

        el.style.color = color;
        el.style.background = color;
        el.style.left = (center.x - w / 2) + 'px';
        el.style.top = (center.y - w / 2) + 'px';

        // Stagger a little based on row for wave effect
        const delay = animate ? d.row * 18 + (col * 4) : 0;
        el.style.transitionDelay = delay + 'ms';

        // Show
        setTimeout(() => {
          el.classList.add('in');
          el.style.opacity = '';
          el.style.transform = '';
        }, animate ? 20 : 0);
      });
    }

    // Initial state
    let current = 'before';
    requestAnimationFrame(() => {
      applyState('before', false);
    });

    // ---- Transition ----
    function transition(to, opts) {
      opts = opts || {};
      if (to === current) return;
      current = to;
      stage.classList.add('transitioning');

      // Update labels/captions
      const eyebrow = stage.querySelector('#rc-state-eyebrow');
      const title = stage.querySelector('#rc-state-title');
      const axis = stage.querySelector('#rc-axis-title');
      const captionText = stage.querySelector('#rc-caption-text');
      const captionIdx = stage.querySelector('.rc-caption .mono');

      if (to === 'after') {
        eyebrow.textContent = 'IMPACT';
        title.textContent = 'aethoflo learning journey';
        axis.textContent = 'Week';
        captionIdx.textContent = '02';
        captionText.innerHTML = 'With aethoflo: skills introduce on a cascade, get assessed in close competency loops, and shift into ongoing maintenance &mdash; matched to each provider\'s real timeline.';
      } else {
        eyebrow.textContent = 'PROBLEM';
        title.textContent = 'Providers & Organizations';
        axis.textContent = 'Week';
        captionIdx.textContent = '01';
        captionText.textContent = 'Current state: all providers receive the same training bundle on visit 01 — and again as scattered refreshers on visits 08, 16, and 24.';
      }

      // Animate
      applyState(to, true);
      setTimeout(() => stage.classList.remove('transitioning'), 1800);

      // Update toggle
      stage.querySelectorAll('.rc-toggle button[data-state]').forEach(b => {
        b.classList.toggle('on', b.dataset.state === to);
      });

      // If this was an automatic (looped) transition, queue the next one.
      // If it was a user click, the pause already stopped the loop.
      if (opts.auto && !userOverride) {
        scheduleNext();
      }
    }

    // ---- Auto-loop ----
    // When the stage scrolls into view, start cycling: before → (pause) → after → (pause) → before → …
    // Any click on the toggle or replay pauses the auto-loop and hands control to the user.
    let userOverride = false;
    let loopTimer = null;

    function clearLoop() {
      if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; }
    }

    function scheduleNext() {
      clearLoop();
      if (userOverride) return;
      // Dwell on each state long enough to read it, then flip.
      // Before = slightly shorter (less to absorb), After = longer (more detail).
      const dwell = current === 'before' ? 3800 : 5200;
      loopTimer = setTimeout(() => {
        if (userOverride) return;
        const next = current === 'before' ? 'after' : 'before';
        transition(next, { auto: true });
      }, dwell);
    }

    function pauseLoop() {
      userOverride = true;
      clearLoop();
      stage.classList.add('rc-paused');
      const btn = stage.querySelector('.rc-replay');
      if (btn) {
        btn.setAttribute('aria-label', 'Resume auto-play');
        btn.setAttribute('title', 'Paused · click to resume');
      }
    }

    function resumeLoop() {
      userOverride = false;
      stage.classList.remove('rc-paused');
      const btn = stage.querySelector('.rc-replay');
      if (btn) {
        btn.setAttribute('aria-label', 'Pause auto-play');
        btn.setAttribute('title', 'Playing · click to pause');
      }
      scheduleNext();
    }

    // ---- Controls ----
    stage.querySelectorAll('.rc-toggle button[data-state]').forEach(btn => {
      btn.addEventListener('click', () => {
        pauseLoop();
        transition(btn.dataset.state);
      });
    });

    stage.querySelector('.rc-replay').addEventListener('click', () => {
      if (userOverride) {
        // Currently paused → resume auto-loop
        resumeLoop();
      } else {
        // Currently auto-playing → pause AND immediately flip state so click feels responsive
        pauseLoop();
        const next = current === 'before' ? 'after' : 'before';
        transition(next);
      }
    });

    // ---- Start auto-loop when stage scrolls into view ----
    let started = false;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !started && !userOverride) {
          started = true;
          // Kick off with the first transition to After, then loop.
          loopTimer = setTimeout(() => {
            if (userOverride) return;
            transition('after', { auto: true });
          }, 1400);
        } else if (!e.isIntersecting) {
          // Out of view — stop looping to save cycles; resume on re-enter.
          clearLoop();
          started = false;
        } else if (e.isIntersecting && !userOverride && started === false) {
          started = true;
          scheduleNext();
        }
      });
    }, { threshold: 0.35 });
    obs.observe(stage);

    // ---- Reflow on resize ----
    let raf;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => applyState(current, false));
    });
  }

  function init() {
    const stage = document.getElementById('rc-stage');
    if (!stage) return;
    if (stage.dataset.rcInited) return;
    stage.dataset.rcInited = '1';
    try {
      render(stage);
    } catch (err) {
      console.error('[roadmap-compare] render failed:', err);
    }
  }

  // Run immediately if DOM is ready; otherwise on DOMContentLoaded.
  // Also run on window load as a belt-and-suspenders retry (idempotent via data attr).
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('load', init);
})();
