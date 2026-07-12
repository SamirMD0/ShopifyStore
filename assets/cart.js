class CartApi {
  static async updateQuantity(line, quantity) {
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        line: line,
        quantity: quantity
      })
    };

    try {
      const response = await fetch(routes.cart_change_url, config);
      const cart = await response.json();
      return cart;
    } catch (error) {
      console.error('Error updating cart:', error);
      return null;
    }
  }

  static async fetchSection(sectionId) {
    try {
      const response = await fetch(`${routes.cart_url}?section_id=${sectionId}`);
      const text = await response.text();
      const html = new DOMParser().parseFromString(text, 'text/html');
      return html.getElementById(sectionId);
    } catch (error) {
      console.error('Error fetching section:', error);
      return null;
    }
  }
}

class CartDrawer {
  constructor() {
    this.drawer = document.getElementById('cart-drawer');
    this.overlay = document.getElementById('overlay');
    if (!this.drawer) return;

    this.bindEvents();
    
    // Listen for global cart updates
    document.addEventListener('cart:updated', () => {
      this.refresh();
      this.open();
    });
  }

  bindEvents() {
    // Close Drawer
    const closeBtns = document.querySelectorAll('[data-drawer-close]');
    closeBtns.forEach(btn => btn.addEventListener('click', () => this.close()));
    
    if (this.overlay) {
      this.overlay.addEventListener('click', () => {
        // Only close if cart drawer is the active one
        if (this.drawer.classList.contains('is-open')) this.close();
      });
    }

    // Open Drawer Triggers
    const openBtns = document.querySelectorAll('[data-drawer-trigger="cart-drawer"]');
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    this.bindCartItemEvents();
  }

  bindCartItemEvents() {
    if (!this.drawer) return;

    // Quantity Plus/Minus
    const qtyBtns = this.drawer.querySelectorAll('.quantity__button');
    qtyBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const line = btn.getAttribute('data-line');
        const input = this.drawer.querySelector(`input[data-line="${line}"]`);
        if (!input) return;

        let qty = parseInt(input.value);
        if (btn.name === 'plus') qty += 1;
        else if (btn.name === 'minus') qty = Math.max(0, qty - 1);

        this.setLoading(true);
        await CartApi.updateQuantity(line, qty);
        await this.refresh();
      });
    });

    // Remove Buttons
    const removeBtns = this.drawer.querySelectorAll('.cart-remove-btn');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const line = btn.getAttribute('data-line');
        this.setLoading(true);
        await CartApi.updateQuantity(line, 0);
        await this.refresh();
      });
    });
    
    // Input direct change
    const qtyInputs = this.drawer.querySelectorAll('.quantity__input');
    qtyInputs.forEach(input => {
      input.addEventListener('change', async (e) => {
        const line = input.getAttribute('data-line');
        let qty = parseInt(input.value);
        if (isNaN(qty) || qty < 0) qty = 0;
        
        this.setLoading(true);
        await CartApi.updateQuantity(line, qty);
        await this.refresh();
      });
    });
  }

  async refresh() {
    this.setLoading(true);
    
    // Fetch updated cart drawer section
    const newDrawer = await CartApi.fetchSection('cart-drawer');
    if (newDrawer) {
      this.drawer.innerHTML = newDrawer.innerHTML;
      this.bindCartItemEvents(); // Re-bind events to new DOM
      
      // Update global badges
      const newBadge = this.drawer.querySelector('[data-cart-count]');
      if (newBadge) {
        const globalBadges = document.querySelectorAll('[data-cart-count]');
        globalBadges.forEach(badge => {
          badge.textContent = newBadge.textContent;
          // Hide badge if 0
          if (parseInt(newBadge.textContent.trim()) === 0) {
            badge.style.display = 'none';
          } else {
            badge.style.display = 'flex';
          }
        });
      }
    }
    
    this.setLoading(false);
  }

  open() {
    this.drawer.classList.add('is-open');
    if (this.overlay) this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.drawer.classList.remove('is-open');
    if (this.overlay) this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  setLoading(isLoading) {
    if (isLoading) {
      this.drawer.classList.add('is-loading');
    } else {
      this.drawer.classList.remove('is-loading');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cartDrawer = new CartDrawer();
});
