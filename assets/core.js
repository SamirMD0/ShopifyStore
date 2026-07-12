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
    });
  }

  open(id) {
    const drawer = document.getElementById(id);
    if (!drawer) return;
    
    // Close others first
    this.closeAll();
    
    drawer.classList.add('is-open');
    if (this.overlay) this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeAll() {
    document.querySelectorAll('.drawer, .cart-drawer').forEach(d => d.classList.remove('is-open'));
    if (this.overlay) this.overlay.classList.remove('active');
    document.body.style.overflow = '';
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

// Initialize components on load
document.addEventListener('DOMContentLoaded', () => {
  window.drawerManager = new DrawerManager();
  window.quickAdd = new QuickAdd();
  
  const carousels = document.querySelectorAll('[data-hero-carousel]');
  carousels.forEach(c => new HeroCarousel(c));
});

// Add spin animation to document head
const style = document.createElement('style');
style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
document.head.appendChild(style);
