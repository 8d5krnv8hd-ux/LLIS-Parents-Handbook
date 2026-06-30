(function () {

  // ══════════════════════════════════════════════════════════════
  //  THEME: apply saved / system preference immediately
  //  (runs before first paint to minimise flash)
  // ══════════════════════════════════════════════════════════════
  var html = document.documentElement;
  var savedTheme = localStorage.getItem('llis-theme');
  if (savedTheme === 'dark') {
    html.setAttribute('data-theme', 'dark');
  } else if (savedTheme === 'light') {
    html.setAttribute('data-theme', 'light');
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
  }

  // ══════════════════════════════════════════════════════════════
  //  FONT SIZE: apply saved preference
  // ══════════════════════════════════════════════════════════════
  var savedFs = parseInt(localStorage.getItem('llis-fs') || '0', 10);
  if (savedFs === 1) html.classList.add('fs-1');
  if (savedFs === 2) html.classList.add('fs-2');

  // ══════════════════════════════════════════════════════════════
  //  NAV: hamburger toggle
  // ══════════════════════════════════════════════════════════════
  var toggle = document.querySelector('.nav__toggle');
  var links  = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  // ══════════════════════════════════════════════════════════════
  //  BACK TO TOP
  // ══════════════════════════════════════════════════════════════
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('is-visible', window.scrollY > 400);
    }, { passive: true });
  }

  // ══════════════════════════════════════════════════════════════
  //  SIDENAV / SUBNAV: active link on scroll
  // ══════════════════════════════════════════════════════════════
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.sidenav a[href^="#"], .subnav a[href^="#"]');

  if (sections.length && navLinks.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.classList.remove('is-active');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.classList.add('is-active');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  // ══════════════════════════════════════════════════════════════
  //  SCROLL REVEAL
  // ══════════════════════════════════════════════════════════════
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  // ══════════════════════════════════════════════════════════════
  //  LUCIDE ICONS
  // ══════════════════════════════════════════════════════════════
  if (window.lucide) { lucide.createIcons(); }

  // ══════════════════════════════════════════════════════════════
  //  ACCESSIBILITY: skip-to-content link
  // ══════════════════════════════════════════════════════════════
  var skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Mark the main content landmark
  var mainTarget =
    document.querySelector('main') ||
    document.querySelector('.home-grid') ||
    document.querySelector('.page-layout') ||
    document.querySelector('.container');
  if (mainTarget && !mainTarget.id) { mainTarget.id = 'main-content'; }

  // ══════════════════════════════════════════════════════════════
  //  ACCESSIBILITY: floating toolbar (dark mode + font size)
  // ══════════════════════════════════════════════════════════════
  var MOON = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
  var SUN  = '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/><line x1="12" y1="2"  x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2"    y1="12"   x2="4"    y2="12"/><line x1="20"   y1="12"   x2="22"   y2="12"/><line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/><line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/></svg>';

  var toolbar = document.createElement('div');
  toolbar.className = 'a11y-toolbar no-print';
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', 'Zugänglichkeit / Accessibility');
  toolbar.innerHTML =
    '<span class="a11y-toolbar-label" aria-hidden="true">Aa</span>' +
    '<div class="a11y-sep" aria-hidden="true"></div>' +
    '<button class="a11y-btn" id="a11y-dark" aria-pressed="false">' + MOON + '</button>' +
    '<div class="a11y-sep" aria-hidden="true"></div>' +
    '<button class="a11y-btn" id="a11y-fs-down" aria-label="Kleinere Schrift (Smaller text)" title="Smaller text">A−</button>' +
    '<button class="a11y-btn" id="a11y-fs-up"   aria-label="Größere Schrift (Larger text)"  title="Larger text">A+</button>';
  document.body.appendChild(toolbar);

  // — Dark mode toggle —
  var btnDark = document.getElementById('a11y-dark');

  function updateDarkBtn() {
    var isDark = html.getAttribute('data-theme') === 'dark';
    btnDark.setAttribute('aria-pressed', String(isDark));
    btnDark.setAttribute('aria-label', isDark ? 'Hellmodus aktivieren (Light mode)' : 'Dunkelmodus aktivieren (Dark mode)');
    btnDark.setAttribute('title', isDark ? 'Light mode' : 'Dark mode');
    btnDark.innerHTML = isDark ? SUN : MOON;
  }
  updateDarkBtn();

  btnDark.addEventListener('click', function () {
    var isDark = html.getAttribute('data-theme') === 'dark';
    var next = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('llis-theme', next);
    updateDarkBtn();
  });

  // — Font size toggle —
  var currentFs = savedFs;
  var btnFsDown = document.getElementById('a11y-fs-down');
  var btnFsUp   = document.getElementById('a11y-fs-up');

  function applyFs() {
    html.classList.remove('fs-1', 'fs-2');
    if (currentFs === 1) html.classList.add('fs-1');
    if (currentFs === 2) html.classList.add('fs-2');
    btnFsDown.disabled = (currentFs === 0);
    btnFsUp.disabled   = (currentFs === 2);
    localStorage.setItem('llis-fs', String(currentFs));
  }
  applyFs();

  btnFsDown.addEventListener('click', function () {
    if (currentFs > 0) { currentFs--; applyFs(); }
  });
  btnFsUp.addEventListener('click', function () {
    if (currentFs < 2) { currentFs++; applyFs(); }
  });

})();
