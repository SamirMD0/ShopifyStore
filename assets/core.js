// Core application - event delegation, global utilities, UI components

class DrawerManager {
  constructor() {
    this.drawers = document.querySelectorAll('.drawer');
    this.overlay = document.getElementById('overlay');
    this.bindEvents();
  }

  bindEvents() {
    // Open triggers
    document.querySelectorAll('[data-drawer-trigger]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const drawerId = trigger.getAttribute('data-drawer-trigger');
        this.open(drawerId);
      });
    });

    // Close triggers
    document.querySelectorAll('[data-drawer-close]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeAll();
      });
    });

    // Overlay click
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeAll());
    }
    
    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeAll();
      if (e.key === 'Tab' && this.activeDrawer) this.trapFocus(e);
    });
  }

  trapFocus(e) {
    const focusableElements = this.activeDrawer.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }

  open(id) {
    const drawer = document.getElementById(id);
    if (!drawer) return;
    
    // Close others first
    this.closeAll();
    
    drawer.classList.add('is-open');
    if (this.overlay) this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    this.activeDrawer = drawer;
    this.previouslyFocusedElement = document.activeElement;
    
    // Focus first element
    setTimeout(() => {
      const focusableElements = drawer.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length) focusableElements[0].focus();
    }, 100);
  }

  closeAll() {
    document.querySelectorAll('.drawer, .cart-drawer, .mobile-drawer').forEach(d => d.classList.remove('is-open'));
    if (this.overlay) this.overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    this.activeDrawer = null;
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }
  }
}

class MobileMenu {
  constructor() {
    this.bindEvents();
  }

  bindEvents() {
    document.querySelectorAll('.mobile-nav-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !expanded);
        const subMenu = btn.nextElementSibling;
        if (subMenu) {
          subMenu.style.display = expanded ? 'none' : 'block';
        }
      });
    });
  }
}

class PageLoader {
  constructor() {
    this.loader = document.createElement('div');
    this.loader.className = 'page-loading-bar';
    document.body.appendChild(this.loader);
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && !link.href.startsWith('javascript:') && !link.href.startsWith('#') && link.target !== '_blank') {
        const isInternal = link.host === window.location.host;
        if (isInternal) {
          this.loader.classList.add('is-loading');
        }
      }
    });

    window.addEventListener('pageshow', () => {
      this.loader.classList.remove('is-loading');
    });
  }
}

class QuickAdd {
  constructor() {
    this.bindEvents();
  }

  bindEvents() {
    document.body.addEventListener('click', async (e) => {
      if (e.target.closest('.js-quick-add')) {
        e.preventDefault();
        const btn = e.target.closest('.js-quick-add');
        const form = btn.closest('form');
        if (!form) return;

        const formData = new FormData(form);
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border:2px solid currentColor;border-bottom-color:transparent;border-radius:50%;display:inline-block;animation:spin 1s linear infinite;"></span>';
        btn.disabled = true;

        try {
          const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            body: formData,
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          });

          if (!response.ok) throw new Error('Network error');
          
          btn.innerHTML = 'Added!';
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
          }, 2000);

          // Dispatch event for Cart Drawer to catch
          document.dispatchEvent(new CustomEvent('cart:updated'));
          
        } catch (error) {
          console.error('Error adding to cart:', error);
          btn.innerHTML = 'Error';
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
          }, 2000);
        }
      }
    });
  }
}

class HeroCarousel {
  constructor(el) {
    this.el = el;
    this.slidesContainer = el.querySelector('.hero-slides');
    this.slides = el.querySelectorAll('.hero-slide');
    this.dots = el.querySelectorAll('.dot');
    this.prevBtn = el.querySelector('.prev');
    this.nextBtn = el.querySelector('.next');
    
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.timer = null;
    
    if (this.totalSlides <= 1) return;
    
    this.bindEvents();
    this.startAutoPlay();
  }
  
  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.goToSlide(this.currentIndex - 1);
        this.resetAutoPlay();
      });
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.goToSlide(this.currentIndex + 1);
        this.resetAutoPlay();
      });
    }
    
    this.dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        this.goToSlide(index);
        this.resetAutoPlay();
      });
    });
    
    this.el.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.el.addEventListener('mouseleave', () => this.startAutoPlay());
  }
  
  goToSlide(index) {
    if (index < 0) index = this.totalSlides - 1;
    if (index >= this.totalSlides) index = 0;
    
    this.currentIndex = index;
    const offset = -(index * 100);
    this.slidesContainer.style.transform = `translateX(${offset}%)`;
    
    this.dots.forEach((dot, i) => {
      if (i === index) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  }
  
  startAutoPlay() {
    this.stopAutoPlay();
    this.timer = setInterval(() => {
      this.goToSlide(this.currentIndex + 1);
    }, 5000);
  }
  
  stopAutoPlay() {
    if (this.timer) clearInterval(this.timer);
  }
  
  resetAutoPlay() {
    this.startAutoPlay();
  }
}

class ScrollAnimator {
  constructor() {
    this.elements = document.querySelectorAll('[data-animate]');
    if (this.elements.length === 0) return;
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    this.elements.forEach(el => this.observer.observe(el));
  }
}

class WishlistManager {
  constructor() {
    this.storageKey = 'elecshop_wishlist';
    this.wishlist = this.getWishlist();
    this.bindEvents();
    this.updateUI();
  }

  getWishlist() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
    } catch (e) {}
  }

  toggle(handle) {
    const index = this.wishlist.indexOf(handle);
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(handle);
    }
    this.saveWishlist();
    this.updateUI();
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-wishlist-trigger]');
      if (btn) {
        e.preventDefault();
        const handle = btn.getAttribute('data-wishlist-trigger');
        this.toggle(handle);
      }
    });
  }

  updateUI() {
    document.querySelectorAll('[data-wishlist-trigger]').forEach(btn => {
      const handle = btn.getAttribute('data-wishlist-trigger');
      const emptyIcon = btn.querySelector('.wishlist-icon-empty');
      const filledIcon = btn.querySelector('.wishlist-icon-filled');
      
      if (this.wishlist.includes(handle)) {
        if (emptyIcon) emptyIcon.classList.add('d-none');
        if (filledIcon) filledIcon.classList.remove('d-none');
      } else {
        if (emptyIcon) emptyIcon.classList.remove('d-none');
        if (filledIcon) filledIcon.classList.add('d-none');
      }
    });
  }
}

class PredictiveSearch extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.querySelector('form.search-form');
    form.addEventListener('submit', this.onFormSubmit.bind(this));

    this.input.addEventListener('input', this.debounce((event) => {
      this.onChange(event);
    }, 300).bind(this));
    
    this.input.addEventListener('focus', this.onFocus.bind(this));
    document.addEventListener('click', (event) => {
      if (!this.contains(event.target)) this.close();
    });
  }

  onChange() {
    const searchTerm = this.input.value.trim();
    if (!searchTerm.length) {
      this.close();
      return;
    }
    this.getSearchResults(searchTerm);
  }

  onFocus() {
    const searchTerm = this.input.value.trim();
    if (!searchTerm.length) return;
    if (this.getAttribute('results') === 'true') {
      this.open();
    } else {
      this.getSearchResults(searchTerm);
    }
  }

  onFormSubmit(event) {
    if (!this.input.value.length || this.input.value.length === 0) event.preventDefault();
  }

  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(" ", "-").toLowerCase();
    
    fetch(`/search/suggest?q=${searchTerm}&resources[type]=product&resources[limit]=4&section_id=predictive-search`)
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }
        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
        this.predictiveSearchResults.innerHTML = resultsMarkup;
        this.setAttribute('results', true);
        this.open();
      })
      .catch((error) => {
        this.close();
        throw error;
      });
  }

  open() {
    this.setAttribute('open', true);
    this.input.setAttribute('aria-expanded', true);
  }

  close() {
    this.removeAttribute('open');
    this.input.setAttribute('aria-expanded', false);
  }

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
}
customElements.define('predictive-search', PredictiveSearch);

// Initialize components on load
document.addEventListener('DOMContentLoaded', () => {
  window.drawerManager = new DrawerManager();
  window.mobileMenu = new MobileMenu();
  window.quickAdd = new QuickAdd();
  window.pageLoader = new PageLoader();
  window.scrollAnimator = new ScrollAnimator();
  window.wishlistManager = new WishlistManager();
  
  const carousels = document.querySelectorAll('[data-hero-carousel]');
  carousels.forEach(c => new HeroCarousel(c));
});

// Add spin animation to document head
const style = document.createElement('style');
style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
document.head.appendChild(style);
