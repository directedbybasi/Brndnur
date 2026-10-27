/**
 * BRNDNUR Advisory LLP — Premium Website-Wide Motion Engine
 * 
 * Capabilities:
 * - Progressive Enhancement: Elements remain 100% visible if JS is disabled or fails.
 * - Intro Coordination: Synchronizes hero entrances with first-visit intro curtain.
 * - IntersectionObserver: Smooth, single-shot scroll reveals for sections and card groups.
 * - Article Reading Progress: Smooth, throttled gold indicator for editorial guides.
 * - Accessibility: Strictly respects prefers-reduced-motion: reduce.
 */

(function() {
  function initMotionSystem() {
    // 1. Accessibility Check: Skip all motion if user prefers reduced motion
    var prefersReduced = false;
    try {
      prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch(e) {}

    if (prefersReduced) {
      document.documentElement.classList.add('prefers-reduced-motion');
      // Ensure any hero elements are marked revealed immediately
      var heroes = document.querySelectorAll('.hero, .page-hero, .article-hero');
      heroes.forEach(function(h) {
        h.classList.add('hero-revealed');
      });
      return;
    }

    // 2. Browser capability check: Requires IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // Graceful fallback: everything remains in default visible state
      return;
    }

    // Mark HTML as motion-ready (activates CSS transitions)
    document.documentElement.classList.add('has-motion');

    // 3. Hero Entrance Choreography
    var heroSections = document.querySelectorAll('.hero, .page-hero, .article-hero');
    heroSections.forEach(function(hero) {
      hero.classList.add('hero-animated');
    });

    var heroRevealed = false;
    function triggerHeroEntrance() {
      if (heroRevealed) return;
      heroRevealed = true;
      heroSections.forEach(function(hero) {
        hero.classList.add('hero-revealed');
      });
    }

    var isIntroActive = false;
    try {
      isIntroActive = document.documentElement.classList.contains('bn-show-intro') ||
                      document.body.classList.contains('bn-intro-active');
    } catch(e) {}

    if (isIntroActive) {
      // Intro overlay is playing. Listen for curtain transition or timer
      var introOverlay = document.getElementById('bn-intro-overlay');
      if (introOverlay) {
        var onCurtainDismiss = function(e) {
          if (e.target === introOverlay) {
            triggerHeroEntrance();
            introOverlay.removeEventListener('transitionend', onCurtainDismiss);
          }
        };
        introOverlay.addEventListener('transitionend', onCurtainDismiss);
      }
      // Guaranteed fallback timer matching Phase 4 auto-dismiss (2.15s + small buffer)
      setTimeout(triggerHeroEntrance, 2250);
    } else {
      // Return visitor or subsequent page in session: trigger hero promptly
      setTimeout(triggerHeroEntrance, 50);
    }

    // 4. Scroll Reveal Observer using IntersectionObserver
    var revealObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          target.classList.add('is-revealed');

          // If it's a reveal-group, also mark all child reveal-items
          if (target.classList.contains('reveal-group')) {
            var items = target.querySelectorAll('.reveal-item');
            items.forEach(function(item) {
              item.classList.add('is-revealed');
            });
          }

          observer.unobserve(target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    // Observe all marked scroll-reveal elements
    var revealSelector = '.reveal-on-scroll, .reveal-group, .wrap.split, .cta-panel, .finder-grid, .informed-split';
    var revealElements = document.querySelectorAll(revealSelector);
    revealElements.forEach(function(el) {
      // Check if element is already within viewport on initial load
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-revealed');
        if (el.classList.contains('reveal-group')) {
          var children = el.querySelectorAll('.reveal-item');
          children.forEach(function(c) { c.classList.add('is-revealed'); });
        }
      } else {
        revealObserver.observe(el);
      }
    });

    // Safety fallback: reveal all elements after 3.8s in case observer was bypassed
    setTimeout(function() {
      document.querySelectorAll(revealSelector + ', .reveal-item').forEach(function(el) {
        el.classList.add('is-revealed');
      });
    }, 3800);

    // 5. Editorial Reading Progress Bar (Scoped to article pages)
    var articleMain = document.querySelector('.article-main, .article-layout, .legal-prose');
    if (articleMain && !document.getElementById('bn-reading-progress')) {
      var progressBar = document.createElement('div');
      progressBar.id = 'bn-reading-progress';
      progressBar.className = 'article-reading-progress';
      progressBar.setAttribute('aria-hidden', 'true');
      document.body.appendChild(progressBar);

      var progressTicking = false;
      function updateReadingProgress() {
        var rect = articleMain.getBoundingClientRect();
        var articleTop = window.pageYOffset + rect.top;
        var articleHeight = rect.height;
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        var viewportHeight = window.innerHeight;

        var startOffset = articleTop - 120;
        var endOffset = articleTop + articleHeight - viewportHeight;
        var distance = endOffset - startOffset;

        var progress = 0;
        if (scrollY > startOffset && distance > 0) {
          progress = Math.min(100, Math.max(0, ((scrollY - startOffset) / distance) * 100));
        } else if (scrollY >= endOffset) {
          progress = 100;
        }

        progressBar.style.width = progress.toFixed(1) + '%';
        progressTicking = false;
      }

      window.addEventListener('scroll', function() {
        if (!progressTicking) {
          window.requestAnimationFrame(updateReadingProgress);
          progressTicking = true;
        }
      }, { passive: true });

      updateReadingProgress();
    }
  }

  // Initialize on DOM ready and Astro page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotionSystem);
  } else {
    initMotionSystem();
  }
  document.addEventListener('astro:page-load', initMotionSystem);
})();
