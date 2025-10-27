// Custom smooth scrolling utility for luxurious Web3 experience
export class SmoothScroll {
  constructor(options = {}) {
    this.duration = options.duration || 1200; // Slower than default 800ms
    this.easing = options.easing || this.easeInOutCubic;
    this.offset = options.offset || 0;
    this.isScrolling = false;

    this.init();
  }

  init() {
    // Override default anchor link behavior
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          this.scrollTo(targetElement);
        }
      }
    });

    // Handle programmatic scrolling
    this.overrideScrollTo();
  }

  scrollTo(target, customDuration) {
    if (this.isScrolling) return;

    const start = window.pageYOffset;
    const targetPosition = this.getTargetPosition(target);
    const distance = targetPosition - start;
    const duration = customDuration || this.duration;

    if (Math.abs(distance) < 10) return; // Don't scroll if already close

    this.isScrolling = true;
    let startTime = null;

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;

      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const easeProgress = this.easing(progress);
      const currentPosition = start + (distance * easeProgress);

      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(animation);
      } else {
        this.isScrolling = false;
      }
    };

    requestAnimationFrame(animation);
  }

  getTargetPosition(target) {
    if (typeof target === 'number') {
      return target;
    }

    const element = typeof target === 'string'
      ? document.querySelector(target)
      : target;

    if (!element) return 0;

    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return rect.top + scrollTop - this.offset;
  }

  // Premium easing function for luxurious feel
  easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Alternative easing functions for different feels
  easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  easeInOutQuart(t) {
    return t < 0.5
      ? 8 * t * t * t * t
      : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  // Override window.scrollTo for programmatic scrolling
  overrideScrollTo() {
    const originalScrollTo = window.scrollTo;

    window.scrollTo = (options) => {
      if (typeof options === 'object' && options.behavior === 'smooth') {
        const targetY = options.top || 0;
        this.scrollTo(targetY);
      } else {
        originalScrollTo.apply(window, arguments);
      }
    };
  }

  // Utility method for scrolling to top
  scrollToTop() {
    this.scrollTo(0);
  }

  // Utility method for scrolling to bottom
  scrollToBottom() {
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    this.scrollTo(documentHeight - window.innerHeight);
  }
}

// Initialize smooth scrolling when DOM is ready
export const initSmoothScroll = () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    // Create smooth scroll instance with luxurious timing
    window.smoothScroll = new SmoothScroll({
      duration: 1200, // 1.2 seconds for premium feel
      offset: 20, // Small offset for better UX
      easing: 'easeInOutCubic'
    });
  }
};

// Auto-initialize if this script is loaded
if (typeof window !== 'undefined' && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else if (typeof window !== 'undefined') {
  initSmoothScroll();
}
