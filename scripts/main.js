/* =========================================================
   TFOLIX portfolio — shared site script
   Handles: mobile navigation, active link highlighting,
   scroll-triggered reveal animations, slideshow pause,
   and the footer year.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Dark mode ---------- */
  var themeToggle = document.querySelector('.theme-toggle');
  var STORAGE_KEY = 'tfolix-theme';

  function applyTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
  }

  var savedTheme = null;
  try { savedTheme = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }

  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isDark = document.body.classList.contains('dark-mode');
      var next = isDark ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* storage unavailable */ }
    });
  }

  /* ---------- Mobile navigation ---------- */
  var header = document.querySelector('.header');
  var sub = document.querySelector('.sub');
  var toggle = document.querySelector('.menu-toggle');

  if (toggle && sub) {
    toggle.addEventListener('click', function () {
      var isOpen = sub.classList.toggle('nav-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the mobile menu after a link is tapped
    sub.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        sub.classList.remove('nav-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // On touch/small screens, tapping "Projects" opens the dropdown
  // instead of relying on a hover that touch devices don't have.
  var dropdown = document.querySelector('.dropdown');
  var dropdownLink = dropdown ? dropdown.querySelector('.projects') : null;

  if (dropdown && dropdownLink) {
    dropdownLink.addEventListener('click', function (e) {
      if (window.matchMedia('(max-width: 768px)').matches) {
        e.preventDefault();
        dropdown.classList.toggle('open');
      }
    });

    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

  /* ---------- Active nav link ---------- */
  var currentPage = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.sub a, .dropdown-menu a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active-link');
    }
  });

  /* ---------- Scroll-triggered reveal ---------- */
  var revealTargets = document.querySelectorAll(
    '.abouts, .box, .grid, .grids, .gridss, .tools-section, .tool-item, ' +
    '.cta-section, .project-card, .picture, .gets'
  );

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    // No IntersectionObserver support, or the visitor asked for less motion:
    // just show everything immediately.
    revealTargets.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Slideshow: pause on hover / focus / touch ---------- */
  var slideshow = document.querySelector('.remain');
  if (slideshow) {
    var pause = function () { slideshow.classList.add('paused'); };
    var resume = function () { slideshow.classList.remove('paused'); };

    slideshow.addEventListener('mouseenter', pause);
    slideshow.addEventListener('mouseleave', resume);
    slideshow.addEventListener('touchstart', pause, { passive: true });
    slideshow.addEventListener('touchend', resume);
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Back-to-top button ---------- */
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('visible', window.scrollY > 500);
    });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }
});
