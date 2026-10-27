/**
 * BRNDNUR Advisory LLP — Universal 3-Column Auto-Sliding Card Carousel Engine
 * 
 * Features:
 * - Desktop (>= 1024px): Exactly 3 cards visible per row in a single horizontal track.
 * - Tablet (640px - 1023px): Exactly 2 cards visible per row.
 * - Mobile (< 640px): 1 card visible in viewport.
 * - Autoplay: Smooth automatic sliding every 5.0s (5000ms).
 * - Pauses on hover, pauses on touch, pauses on document hidden tab.
 * - Respects prefers-reduced-motion: reduce.
 * - Prevents partial clipping at max scroll; seamlessly loops back to start.
 * - Understated Ivory, Navy, and Gold controls with subtle pagination dots.
 * - Fully accessible with keyboard arrow navigation and ARIA states.
 */

(function() {
  function initSingleCarousel(carousel) {
    if (!carousel || carousel._bnInitialized) return;
    carousel._bnInitialized = true;

    const track = carousel.querySelector('.bn-carousel-track');
    if (!track) return;

    const prevBtn = carousel.querySelector('.bn-prev');
    const nextBtn = carousel.querySelector('.bn-next');
    const dotsContainer = carousel.querySelector('.bn-carousel-dots');
    const AUTOPLAY_INTERVAL = 5000;
    const intervalTime = parseInt(carousel.getAttribute('data-interval') || '5000', 10) || AUTOPLAY_INTERVAL;

    const cards = Array.from(track.children);
    if (cards.length === 0) return;

    function getVisibleCount() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }

    function getMaxScroll() {
      return Math.max(0, track.scrollWidth - track.clientWidth - 4);
    }

    function getSnapPositions() {
      const max = getMaxScroll();
      if (max <= 4) return [0];

      const card = cards[0];
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap) || 20;
      const cardWidth = card ? card.getBoundingClientRect().width : (track.clientWidth / getVisibleCount());
      const cardStep = cardWidth + gap;
      const visible = getVisibleCount();
      const pageStep = Math.max(cardStep, visible * cardStep);

      const positions = [0];
      let pos = 0;
      while (pos + pageStep < max - 6) {
        pos += pageStep;
        positions.push(Math.round(pos));
      }
      if (positions[positions.length - 1] < max - 6) {
        positions.push(Math.round(max));
      }
      return positions;
    }

    function renderDots(positions) {
      if (!dotsContainer) return;
      if (positions.length <= 1) {
        dotsContainer.innerHTML = '';
        dotsContainer.style.display = 'none';
        return;
      }
      dotsContainer.style.display = 'inline-flex';
      dotsContainer.innerHTML = '';
      positions.forEach((pos, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'bn-carousel-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${idx + 1} of ${positions.length}`);
        dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
        dot.setAttribute('role', 'tab');
        dot.dataset.index = String(idx);
        dot.dataset.position = String(pos);
        dot.onclick = function(e) {
          e.preventDefault();
          track.scrollTo({ left: pos, behavior: 'smooth' });
          resetAuto();
        };
        dotsContainer.appendChild(dot);
      });
    }

    function updateControls() {
      const max = getMaxScroll();
      const positions = getSnapPositions();

      if (max <= 4) {
        carousel.classList.add('bn-no-scroll-desktop');
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
      } else {
        carousel.classList.remove('bn-no-scroll-desktop');
        if (prevBtn) prevBtn.disabled = false;
        if (nextBtn) nextBtn.disabled = false;
      }

      if (!dotsContainer) return;
      const dots = Array.from(dotsContainer.querySelectorAll('.bn-carousel-dot'));
      if (dots.length === 0) return;

      const currentScroll = track.scrollLeft;
      let closestIndex = 0;
      let minDiff = Infinity;

      positions.forEach((pos, idx) => {
        const diff = Math.abs(currentScroll - pos);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = idx;
        }
      });

      dots.forEach((dot, idx) => {
        const isActive = idx === closestIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    function nextSlide() {
      const max = getMaxScroll();
      if (max <= 4) return;
      const positions = getSnapPositions();
      const currentScroll = track.scrollLeft;

      if (currentScroll >= max - 8) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      const nextPos = positions.find(pos => pos > currentScroll + 8);
      if (nextPos !== undefined) {
        track.scrollTo({ left: nextPos, behavior: 'smooth' });
      } else {
        track.scrollTo({ left: max, behavior: 'smooth' });
      }
    }

    function prevSlide() {
      const max = getMaxScroll();
      if (max <= 4) return;
      const positions = getSnapPositions();
      const currentScroll = track.scrollLeft;

      if (currentScroll <= 8) {
        track.scrollTo({ left: max, behavior: 'smooth' });
        return;
      }

      const rev = [...positions].reverse();
      const prevPos = rev.find(pos => pos < currentScroll - 8);
      if (prevPos !== undefined) {
        track.scrollTo({ left: prevPos, behavior: 'smooth' });
      } else {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }

    let autoTimer = null;
    let isPaused = false;

    function startAuto() {
      stopAuto();
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      if (isPaused) return;
      const max = getMaxScroll();
      if (max <= 4) return;
      autoTimer = setInterval(nextSlide, intervalTime);
    }

    function stopAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function resetAuto() {
      stopAuto();
      startAuto();
    }

    // Hover pause
    carousel.addEventListener('mouseenter', function() {
      isPaused = true;
      stopAuto();
    });
    carousel.addEventListener('mouseleave', function() {
      isPaused = false;
      startAuto();
    });

    // Focus pause (interactive accessibility: cards, buttons, links inside carousel)
    carousel.addEventListener('focusin', function() {
      isPaused = true;
      stopAuto();
    });
    carousel.addEventListener('focusout', function(e) {
      if (!carousel.contains(e.relatedTarget)) {
        isPaused = false;
        startAuto();
      }
    });

    // Touch & drag pause
    let touchResumeTimeout = null;
    track.addEventListener('touchstart', function() {
      isPaused = true;
      if (touchResumeTimeout) {
        clearTimeout(touchResumeTimeout);
        touchResumeTimeout = null;
      }
      stopAuto();
    }, { passive: true });
    track.addEventListener('touchend', function() {
      isPaused = false;
      if (touchResumeTimeout) clearTimeout(touchResumeTimeout);
      touchResumeTimeout = setTimeout(function() {
        startAuto();
      }, AUTOPLAY_INTERVAL);
    }, { passive: true });

    // Tab visibility pause
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        stopAuto();
      } else {
        if (!isPaused) startAuto();
      }
    });

    // Astro view transition cleanup
    document.addEventListener('astro:before-swap', function() {
      stopAuto();
      if (touchResumeTimeout) clearTimeout(touchResumeTimeout);
    });

    // Keyboard navigation
    track.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
        resetAuto();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
        resetAuto();
      }
    });

    if (nextBtn) {
      nextBtn.onclick = function(e) {
        e.preventDefault();
        nextSlide();
        resetAuto();
      };
    }
    if (prevBtn) {
      prevBtn.onclick = function(e) {
        e.preventDefault();
        prevSlide();
        resetAuto();
      };
    }

    track.addEventListener('scroll', function() {
      requestAnimationFrame(updateControls);
    }, { passive: true });

    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        const positions = getSnapPositions();
        renderDots(positions);
        updateControls();
      }, 150);
    }, { passive: true });

    // Initial setup
    const initialPositions = getSnapPositions();
    renderDots(initialPositions);
    updateControls();
    startAuto();
  }

  function initAllCarousels() {
    const list = document.querySelectorAll('[data-bn-carousel], .bn-carousel');
    list.forEach(function(el) {
      initSingleCarousel(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllCarousels);
  } else {
    initAllCarousels();
  }
  document.addEventListener('astro:page-load', initAllCarousels);

  // Expose globally
  window.initBRNDNURCarousels = initAllCarousels;
})();
