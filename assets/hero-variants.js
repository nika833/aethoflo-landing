// ============================================
// Hero variant enhancements — signal + moment
// Animates the signal waveform chart when visible
// ============================================

(function () {
  function renderSignalChart() {
    const chart = document.getElementById('signal-chart');
    if (!chart) return;

    const W = 340, H = 120;
    const svg = `
      <svg viewBox="0 0 ${W} ${H}" width="100%" height="120" preserveAspectRatio="none" style="overflow:visible">
        <defs>
          <linearGradient id="sig-fade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="var(--orange)" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="var(--orange)" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <!-- grid -->
        <g stroke="var(--rule)" stroke-width="0.5" opacity="0.5">
          <line x1="0" y1="30" x2="${W}" y2="30"/>
          <line x1="0" y1="60" x2="${W}" y2="60"/>
          <line x1="0" y1="90" x2="${W}" y2="90"/>
        </g>
        <!-- signal area -->
        <path id="sig-area" d="M0,90 C40,85 60,60 100,55 C150,50 170,80 210,75 C250,70 270,30 310,25 L${W},25 L${W},${H} L0,${H} Z"
              fill="url(#sig-fade)" opacity="0"/>
        <!-- signal line -->
        <path id="sig-line" d="M0,90 C40,85 60,60 100,55 C150,50 170,80 210,75 C250,70 270,30 310,25 L${W},25"
              fill="none" stroke="var(--orange)" stroke-width="2" stroke-linecap="round"
              stroke-dasharray="600" stroke-dashoffset="600"/>
        <!-- trigger point -->
        <circle id="sig-dot" cx="310" cy="25" r="0" fill="var(--orange)">
          <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" begin="2s"/>
        </circle>
      </svg>
    `;
    chart.innerHTML = svg;

    requestAnimationFrame(() => {
      const line = chart.querySelector('#sig-line');
      const area = chart.querySelector('#sig-area');
      const dot = chart.querySelector('#sig-dot');
      if (line) {
        line.style.transition = 'stroke-dashoffset 2200ms cubic-bezier(0.22,1,0.36,1)';
        line.style.strokeDashoffset = '0';
      }
      if (area) {
        area.style.transition = 'opacity 1400ms ease-out 1200ms';
        area.style.opacity = '1';
      }
      setTimeout(() => { if (dot) dot.setAttribute('r', '5'); }, 2000);
    });
  }

  function init() {
    renderSignalChart();
    window.addEventListener('tweak:change', (e) => {
      if (e.detail && e.detail.heroVariant === 'signal') {
        setTimeout(renderSignalChart, 50);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
