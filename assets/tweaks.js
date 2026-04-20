// ============================================
// aethoflo — Tweaks panel
// ============================================
// Exposes: light/dark mode, hero variant, motion intensity, accent color

(function () {
  'use strict';

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "heroVariant": "roadmap",
    "motion": "medium",
    "accent": "coral",
    "mode": "light"
  }/*EDITMODE-END*/;

  const ACCENTS = {
    coral:    { name: 'Coral',     main: '#E87A4E', bright: '#FF8A5B', deep: '#C85E35', glow: '#FFB896' },
    ember:    { name: 'Ember',     main: '#D9502E', bright: '#F26A45', deep: '#B33E20', glow: '#FFA080' },
    sienna:   { name: 'Sienna',    main: '#B8633D', bright: '#D27A54', deep: '#964F2E', glow: '#E8A888' },
    indigo:   { name: 'Indigo',    main: '#4F56E8', bright: '#6B72FF', deep: '#3A41B8', glow: '#A8ACFF' },
    teal:     { name: 'Teal',      main: '#2E8E8A', bright: '#3FA8A3', deep: '#1F6E6A', glow: '#7FC7C3' },
    matcha:   { name: 'Matcha',    main: '#7A9E5C', bright: '#96B977', deep: '#5C7D42', glow: '#C5D9AC' },
  };

  let state = Object.assign({}, TWEAK_DEFAULTS);

  // Apply state -> DOM
  function apply() {
    const root = document.documentElement;
    const a = ACCENTS[state.accent] || ACCENTS.coral;
    root.style.setProperty('--orange', a.main);
    root.style.setProperty('--orange-bright', a.bright);
    root.style.setProperty('--orange-deep', a.deep);
    root.style.setProperty('--orange-glow', a.glow);
    root.style.setProperty('--signal', a.main);

    root.setAttribute('data-motion', state.motion);
    root.setAttribute('data-mode', state.mode);
    root.setAttribute('data-hero', state.heroVariant);

    // Dispatch so individual pages can re-render variant-sensitive bits
    window.dispatchEvent(new CustomEvent('tweak:change', { detail: state }));
  }

  function persist(partial) {
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: partial }, '*');
    } catch (_) {}
  }

  // ----- Build panel -----
  function buildPanel() {
    const panel = document.createElement('aside');
    panel.className = 'tweaks-panel';
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML = `
      <div class="tweaks-header">
        <div class="tweaks-title">
          <span class="tweaks-dot"></span>
          <span>Tweaks</span>
        </div>
        <button class="tweaks-close" aria-label="Close tweaks">×</button>
      </div>
      <div class="tweaks-body">
        <div class="tweak-group">
          <div class="tweak-label">Hero variant</div>
          <div class="tweak-options" data-key="heroVariant">
            <button data-val="roadmap">Roadmap</button>
            <button data-val="signal">Signal</button>
            <button data-val="moment">Moment</button>
          </div>
        </div>
        <div class="tweak-group">
          <div class="tweak-label">Motion</div>
          <div class="tweak-options" data-key="motion">
            <button data-val="subtle">Subtle</button>
            <button data-val="medium">Medium</button>
            <button data-val="expressive">Expressive</button>
          </div>
        </div>
        <div class="tweak-group">
          <div class="tweak-label">Accent</div>
          <div class="tweak-swatches" data-key="accent">
            ${Object.entries(ACCENTS).map(([k, v]) => `
              <button data-val="${k}" title="${v.name}" style="--sw:${v.main}">
                <span style="background:${v.main}"></span>
              </button>
            `).join('')}
          </div>
        </div>
        <div class="tweak-group">
          <div class="tweak-label">Mode</div>
          <div class="tweak-options" data-key="mode">
            <button data-val="light">Light</button>
            <button data-val="dark">Dark</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Bind clicks
    panel.querySelectorAll('[data-key]').forEach((group) => {
      const key = group.dataset.key;
      group.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', () => {
          state[key] = btn.dataset.val;
          apply();
          persist({ [key]: btn.dataset.val });
          refreshSelected();
        });
      });
    });

    panel.querySelector('.tweaks-close').addEventListener('click', close);

    function refreshSelected() {
      panel.querySelectorAll('[data-key]').forEach((group) => {
        const key = group.dataset.key;
        group.querySelectorAll('button').forEach((btn) => {
          btn.classList.toggle('on', btn.dataset.val === state[key]);
        });
      });
    }
    refreshSelected();
    return panel;
  }

  let panelEl = null;
  function open() {
    if (!panelEl) panelEl = buildPanel();
    panelEl.classList.add('open');
    panelEl.setAttribute('aria-hidden', 'false');
  }
  function close() {
    if (panelEl) {
      panelEl.classList.remove('open');
      panelEl.setAttribute('aria-hidden', 'true');
    }
  }

  // ----- Host protocol -----
  window.addEventListener('message', (e) => {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === '__activate_edit_mode') open();
    if (e.data.type === '__deactivate_edit_mode') close();
  });

  // Apply defaults on load
  function init() {
    apply();
    try {
      window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    } catch (_) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debug
  window.__aethoTweaks = { state, apply };
})();
