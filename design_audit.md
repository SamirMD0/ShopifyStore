# ElecSHOP Theme — Senior Design Audit & Improvement Roadmap

> **Prepared by:** Senior Shopify Theme Designer  
> **Date:** July 12, 2026  
> **Scope:** Design polish, UX smoothness, mobile responsiveness, accessibility, and merchant-readiness  

---

## Executive Summary

The theme has a solid foundation — a well-structured design token system, modern layout patterns (glassmorphism header, split PDP, AJAX cart drawer), and a clean component library. However, to sell this to a paying customer and compete with premium themes on the Shopify Theme Store, there are several areas that need attention across **visual refinement**, **interaction smoothness**, **mobile experience**, and **merchant customizability**.

Below is a prioritized roadmap organized into three tiers.

---

## 🔴 Critical — Must Fix Before Selling

### 1. Responsive Layout Is Broken on Tablet/Desktop

**The Problem:** Many sections use inline `style` attributes with `@media` queries embedded in them. **This does not work.** Media queries inside a `style=""` attribute are silently ignored by all browsers. This means your two-column layouts (PDP, Cart, Account) are rendering as single-column stacks on ALL screen sizes.

**Affected Files:**
- [main-product.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/main-product.liquid) — Lines 2, 5, 10
- [main-cart.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/main-cart.liquid) — Lines 12, 83
- [account.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/account.liquid)
- [order.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/order.liquid)
- [hero-banner.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/hero-banner.liquid) — Line 2

**Fix:** Move all responsive grid/flex rules into proper `<style>` blocks or into your CSS files using real `@media` queries. For example:

```css
/* In sections.css or a <style> tag */
@media (min-width: 1024px) {
  .product-page-layout { flex-direction: row; }
  .product-media-column { width: 50%; }
  .product-info-column { width: 50%; }
}
```

> [!CAUTION]
> This is the single most damaging issue in the theme. Every page that uses this pattern is visually broken on desktop. A customer would immediately reject the theme.

---

### 2. Empty JavaScript Files

**The Problem:** [base.js](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/assets/base.js) and [core.js](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/assets/core.js) are essentially empty (just a comment, no actual code), yet they are loaded on every page via [theme.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/layout/theme.liquid#L89-L90). This adds two unnecessary HTTP requests to every page load.

**Fix:** Either populate them with the utility code they're supposed to contain (drawer toggle logic, event delegation, predictive search init, hero carousel JS) or remove the `script_tag` lines from `theme.liquid` and consolidate everything into a single `theme.js`.

---

### 3. Hero Carousel Has No JavaScript

**The Problem:** The hero banner renders slides and dot indicators, but there is no JavaScript anywhere in the codebase to actually drive the carousel — no auto-advance, no dot click handlers, no prev/next button wiring. The carousel is completely non-functional.

**Affected File:** [hero-banner.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/hero-banner.liquid)

**Fix:** Add a `<script>` block (or a separate `hero-carousel.js` asset) that:
- Auto-advances slides every 5–7 seconds
- Handles prev/next button clicks
- Updates the active dot indicator
- Pauses on hover
- Supports touch/swipe gestures on mobile

---

### 4. Quick Add Button Doesn't Work

**The Problem:** The product card's "Quick Add" button has class `js-quick-add` but there is no JavaScript handler anywhere in the codebase that listens for clicks on `.js-quick-add`. The button does nothing.

**Affected File:** [product-card.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/snippets/product-card.liquid#L61)

**Fix:** Add an event listener (in `cart.js` or a new file) that:
1. Intercepts the click
2. Reads the variant ID from the hidden input
3. POSTs to `/cart/add.js`
4. Dispatches a `cart:updated` event to trigger the cart drawer refresh
5. Shows a brief success animation on the button

---

## 🟠 High Priority — Strongly Recommended

### 5. No Page Transition or Loading Feedback

**The Problem:** Navigating between pages is a hard, jarring reload. There's no loading indicator, no skeleton screens, and no smooth transition. Premium themes use at minimum a thin progress bar at the top of the viewport.

**Fix:**
- Add a CSS-only top-loading bar that triggers on link clicks (using `NProgress` or a custom implementation)
- Consider adding `view-transition` CSS for browsers that support it
- Add skeleton shimmer placeholders to collection grids (you already have the `.skeleton-shimmer` class defined but never use it)

---

### 6. Mobile Navigation Drawer Has No JS

**The Problem:** The mobile menu button has `data-drawer-trigger="mobile-menu"` but there's no JavaScript that handles the `data-drawer-trigger` attribute for the mobile menu. The mobile hamburger menu doesn't open.

**Affected Files:**
- [header.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/header.liquid#L5)
- [mobile-menu.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/snippets/mobile-menu.liquid)

**Fix:** Add a generic drawer manager in your JS that handles `data-drawer-trigger` / `data-drawer-close` patterns for all drawers (mobile menu, cart, search).

---

### 7. Missing Hover/Focus Micro-Animations

**The Problem:** Buttons snap between states instead of transitioning. The `btn` class has `transition: all`, which is good, but many interactive elements lack proper hover states entirely:
- Footer newsletter input has no focus glow
- Breadcrumb links are plain
- Pagination buttons lack hover feedback
- Filter accordion items don't have hover highlights

**Fix:** Audit every interactive element and ensure:
- Buttons scale subtly on hover (`transform: scale(1.02)`)
- Links have underline animations (sliding underline from left)
- Cards lift with shadow on hover (already done for product cards, but missing on article cards, collection cards in some contexts)
- Inputs glow with accent color on focus (done in `.input-field:focus` but not applied everywhere)

---

### 8. Typography Scale Needs Refinement

**The Problem:** The type scale jumps too aggressively between sizes. On mobile, `text-3xl` (1.875rem) headings are too large for section titles, causing awkward wrapping. There's no fluid typography using `clamp()` except in the hero title.

**Fix:** Update the CSS custom properties to use fluid values:

```css
:root {
  --font-size-3xl: clamp(1.5rem, 4vw, 1.875rem);
  --font-size-4xl: clamp(1.875rem, 5vw, 2.25rem);
}
```

---

### 9. Inconsistent Spacing System

**The Problem:** The spacing scale in `base.css` skips `--space-5` (1.25rem), `--space-10` (2.5rem), and `--space-20` (5rem). Meanwhile, sections use hardcoded values like `py-12` (3rem), `py-16` (4rem), and `py-20` (5rem) — but `py-12`, `py-16`, and `py-20` are never defined in `utilities.css`. They won't work.

**Fix:** Either:
- Add the missing utility classes (`py-12`, `py-16`, `py-20`, `mb-6`, `mb-12`, `p-6`, `p-8`, etc.)
- Or move to using the `--space-*` variables directly in section `<style>` blocks

---

### 10. Cart Drawer — No Escape Key or Focus Trap

**The Problem:** The cart drawer can only be closed by clicking the X button or the overlay. Pressing `Escape` does nothing. There's also no focus trap, meaning keyboard users can tab behind the drawer into the page content.

**Fix:**
- Add `keydown` listener for `Escape` key
- Implement a focus trap (trap Tab/Shift+Tab within the drawer while it's open)
- Add `aria-modal="true"` and `role="dialog"` to the drawer element

---

## 🟡 Medium Priority — Polish & Merchant Experience

### 11. Limited Theme Editor Customization

**The Problem:** A paying customer expects to customize colors, fonts, spacing, and layout from the Theme Editor without touching code. Currently, the `settings_schema.json` offers only basic color/font options. Missing:
- Section background color pickers
- Button style options (rounded vs. sharp, filled vs. outline)
- Product card style selector (minimal, detailed, overlay)
- Font family selection (currently hardcoded to Inter)
- Section spacing controls (top/bottom padding per section)

**Fix:** Add section-level settings for padding, background color, and layout variants. Add global settings for button border-radius, card border-radius, and font pairing.

---

### 12. No 404 Page Design

**The Problem:** The [404.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/404.liquid) section exists but likely uses a basic template. A polished 404 page is a trust signal and a chance to redirect traffic.

**Fix:** Create a styled 404 page with:
- A friendly illustration or icon
- Search bar
- Popular collection links
- "Back to Home" CTA

---

### 13. No Scroll-Triggered Animations

**The Problem:** Sections appear instantly as the user scrolls. Premium themes use `IntersectionObserver` to fade/slide sections in as they enter the viewport. You have `fadeIn`, `slideUp`, and `scaleIn` keyframes defined in `base.css` but they're never used.

**Fix:** Add a small JS utility that applies `.is-visible` to elements with `[data-animate]` when they enter the viewport, then trigger the CSS animations.

---

### 14. Product Card — Missing Wishlist

**The Problem:** The product card actions area only has "Quick Add." Most premium electronics themes also include a heart/wishlist icon button. This is a highly requested feature by merchants.

**Fix:** Add a wishlist icon button that toggles a saved state (using `localStorage` for a simple implementation, or integrate with a Shopify app like Wishlist Plus).

---

### 15. No Predictive Search Results

**The Problem:** The header renders a `search-form.liquid` snippet, and there's a `predictive-search.liquid` snippet, but there's no JavaScript to power the predictive/autocomplete search dropdown. The search input just does a hard form submit.

**Fix:** Wire up `fetch` calls to `/search/suggest.json` on keyup, render results in a dropdown, and handle keyboard navigation (arrow keys, Enter to select).

---

### 16. Side Promo Cards Hidden on Desktop

**The Problem:** In [hero-banner.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/hero-banner.liquid#L59), the side promos wrapper has class `hidden-desktop`, which means it's hidden on screens ≥768px. The inline style attempts to override this with `@media(min-width: 1024px) { display: grid !important; }`, but as noted in Issue #1, inline media queries don't work.

**Fix:** Move the responsive display logic to a `<style>` block.

---

## Summary Table

| # | Issue | Priority | Effort |
|---|-------|----------|--------|
| 1 | Broken responsive layouts (inline @media) | 🔴 Critical | Medium |
| 2 | Empty JS files loaded on every page | 🔴 Critical | Low |
| 3 | Hero carousel has no JavaScript | 🔴 Critical | Medium |
| 4 | Quick Add button does nothing | 🔴 Critical | Medium |
| 5 | No page transition / loading feedback | 🟠 High | Medium |
| 6 | Mobile menu drawer has no JS | 🟠 High | Medium |
| 7 | Missing hover/focus micro-animations | 🟠 High | Low |
| 8 | Typography needs fluid scaling | 🟠 High | Low |
| 9 | Missing utility classes (py-12, py-16, etc.) | 🟠 High | Low |
| 10 | Cart drawer missing Escape key & focus trap | 🟠 High | Low |
| 11 | Limited Theme Editor customization | 🟡 Medium | High |
| 12 | No styled 404 page | 🟡 Medium | Low |
| 13 | No scroll-triggered animations | 🟡 Medium | Medium |
| 14 | Product card missing wishlist button | 🟡 Medium | Medium |
| 15 | No predictive search functionality | 🟡 Medium | High |
| 16 | Side promos hidden on desktop | 🟡 Medium | Low |

---

## Recommended Execution Order

1. **Fix all broken responsive layouts** (#1, #16) — This is the most visible problem
2. **Wire up all JavaScript** (#3, #4, #6, #15) — Without working interactions, the theme is a static mockup
3. **Clean up empty JS files** (#2) — Quick win for performance
4. **Add missing utilities & fluid type** (#8, #9) — Consistency pass
5. **Add micro-animations & scroll reveals** (#5, #7, #13) — The "wow" factor
6. **Cart drawer accessibility** (#10) — Required for ADA/WCAG compliance
7. **Polish pages** (#12, #14) — Final touches
8. **Expand Theme Editor settings** (#11) — Merchant self-service

> [!IMPORTANT]
> Items 1–4 are **blockers**. The theme cannot be demoed or sold to a customer until these are resolved. A customer clicking "Quick Add" and seeing nothing happen, or viewing a single-column product page on desktop, would be an immediate deal-breaker.
