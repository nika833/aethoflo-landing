// ============================================
// Shared nav + footer — injected into every page
// ============================================

(function () {
  const NAV_HTML = `
    <nav class="nav" id="nav">
      <div class="nav-inner">
        <a class="nav-logo" href="index.html">
          <svg class="nav-glyph" viewBox="0 0 120 100" aria-hidden="true">
            <circle cx="74" cy="46" r="32" fill="#E87A4E"/>
            <circle cx="42" cy="60" r="20" fill="#2A1810"/>
            <clipPath id="navglyph-clip"><circle cx="42" cy="60" r="20"/></clipPath>
            <g clip-path="url(#navglyph-clip)"><circle cx="74" cy="46" r="32" fill="#FAF5EF"/></g>
          </svg>
          <span class="nav-wm">aetho<span class="flo">flo</span></span>
        </a>
        <div class="nav-links">
          <a class="nav-link" href="how-it-works.html">How It Works</a>
          <a class="nav-link" href="who-its-for.html">Who It's For</a>
          <a class="nav-link" href="services.html">Services</a>
          <a class="nav-link" href="waitlist.html">Early Access</a>
        </div>
        <a class="nav-cta" href="https://aethoflo-frontend.vercel.app">Find your flo</a>
        <button class="nav-mobile-toggle" aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <line x1="4" y1="7" x2="20" y2="7"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="17" x2="20" y2="17"/>
          </svg>
        </button>
      </div>
    </nav>
  `;

  const FOOTER_HTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="nav-logo" href="index.html">
              <svg class="nav-glyph" viewBox="0 0 120 100" aria-hidden="true">
                <circle cx="74" cy="46" r="32" fill="#E87A4E"/>
                <circle cx="42" cy="60" r="20" fill="#2A1810"/>
                <clipPath id="footglyph-clip"><circle cx="42" cy="60" r="20"/></clipPath>
                <g clip-path="url(#footglyph-clip)"><circle cx="74" cy="46" r="32" fill="#FAF5EF"/></g>
              </svg>
              <span class="nav-wm">aetho<span class="flo">flo</span></span>
            </a>
            <p>The right learning, at the right moment. Training built around the provider's journey — not the calendar.</p>
          </div>
          <div class="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="how-it-works.html">How It Works</a></li>
              <li><a href="who-its-for.html">Who It's For</a></li>
              <li><a href="waitlist.html">Early Access</a></li>
              <li><a href="https://aethoflo-frontend.vercel.app">Sign in</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a href="services.html">Corva Consulting</a></li>
              <li><a href="services.html#approach">Our Approach</a></li>
              <li><a href="waitlist.html">Start a Conversation</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 aethoflo · consulting services by corva</span>
          <span class="footer-status">system operational · v0.4.2</span>
        </div>
      </div>
    </footer>
  `;

  function inject() {
    const navSlot = document.getElementById('nav-slot');
    const footerSlot = document.getElementById('footer-slot');
    if (navSlot) navSlot.outerHTML = NAV_HTML;
    if (footerSlot) footerSlot.outerHTML = FOOTER_HTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
