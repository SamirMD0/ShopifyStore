# Shopify Theme — ElecSHOP Design (Customer Storefront Only)

Rebuild the existing Shopify theme at `d:\User\Documents\PorfolioProjects\ShopifyStore` to match the premium, modern design of the [ElecSHOP](file:///d:/User/Documents/PorfolioProjects/ElecSHOP/frontend) Next.js storefront — **without** the admin dashboard. All store management happens through the Shopify admin; this theme is purely customer-facing.

## Current State

The Shopify theme already has a basic skeleton:
- 32 sections, 44 snippets, basic `theme.liquid` layout
- Minimal/placeholder CSS (most asset files are <100 bytes)
- Templates for homepage, product, collection, cart, blog, search, customer accounts
- Settings schema with typography, colors, layout, cart, social media, checkout

The ElecSHOP design features:
- **Glassmorphism navbar** with search autocomplete, categories dropdown, cart/wishlist/account icons
- **Hero carousel** with side promo banners
- **Service features** strip (shipping, security, support)
- **Browse categories** grid with images
- **Brand showcase** logo rail
- **Product rails** (new arrivals, best sellers, featured, category/brand sections)
- **Product cards** with hover effects, quick add-to-cart, wishlist toggle, badges (sale/new/stock)
- **Countdown promo** timer section
- **Testimonials** carousel
- **Newsletter** signup
- **Premium footer** with multi-column layout, social icons
- **Store page** with sidebar filters (price, category, brand), sort, grid/list toggle, pagination
- **Product detail** page with image gallery, variant picker, tabs (description, reviews, Q&A)
- **Cart drawer** slide-in panel
- All static pages: About, Contact, FAQ, Privacy, Return Policy, Terms

## User Review Required

> [!IMPORTANT]
> **Color scheme**: The ElecSHOP uses a blue accent (`#2563eb`) with a light slate background (`#f8fafc`). The current Shopify theme uses green (`#2c6e49`). **Which brand colors should we use?** I'll default to the blue ElecSHOP palette unless you prefer the green or a different scheme.

> [!IMPORTANT]
> **Typography**: ElecSHOP uses **Inter** font. The Shopify theme currently uses **Assistant**. Shopify supports Google Fonts via `font_picker`. Should we switch to Inter or keep Assistant?

> [!IMPORTANT]
> **Wishlist**: Shopify doesn't have native wishlist support. We can implement a client-side wishlist using `localStorage` (no backend needed) or skip wishlist entirely. Which do you prefer?

> [!IMPORTANT]
> **Product reviews**: Shopify has a free reviews app or we can build a static testimonials section. Do you want to integrate Shopify Product Reviews app or just have a visual testimonials section on the homepage?

## Open Questions

> [!NOTE]
> **Store name**: The current Shopify store is connected to `electro-20072.myshopify.com`. Should the theme name/branding match "ElecSHOP" or use a different store name?

> [!NOTE]
> **Checkout**: Shopify handles checkout natively. The theme only controls checkout colors (already in `settings_schema.json`). No custom checkout page is needed.

## Proposed Changes

The work is organized into **7 phases**, each building on the previous. Every phase produces a working, testable theme.

---

### Phase 1 — Design System & Layout Foundation

Build the core CSS design system and update `theme.liquid` to match ElecSHOP's structure.

#### [MODIFY] [base.css](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/assets/base.css)
- CSS reset, box-sizing, smooth scrolling
- CSS custom properties mirroring ElecSHOP's design tokens:
  - Colors: `--color-bg-primary`, `--color-accent`, `--color-text-primary`, etc.
  - Typography: Inter font stack, size scale (xs through 4xl)
  - Spacing: consistent scale
  - Shadows, border-radius, transitions
- Utility classes: `.container`, `.glass`, `.glass-card`, `.premium-card`, `.text-gradient`, `.skeleton-shimmer`
- Animation keyframes: `fadeIn`, `slideIn`, `slideUp`, `scaleIn`, `shimmer`, `bounceShort`
- `prefers-reduced-motion` support

#### [MODIFY] [core.css](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/assets/core.css)
- Button system (primary, secondary, outline, ghost variants + sizes)
- Form inputs matching ElecSHOP's `.input-field` style
- Badge component (sale, new, out-of-stock)
- Breadcrumb styles

#### [MODIFY] [components.css](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/assets/components.css)
- Product card component (image, hover overlay, quick-add button, badges, price)
- Collection card component
- Section title pattern (eyebrow + heading + "View All" link)
- Empty state component

#### [MODIFY] [sections.css](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/assets/sections.css)
- Header/navbar glassmorphism styles
- Hero banner/carousel styles
- Footer multi-column layout
- Service features strip
- Newsletter section
- Testimonials carousel
- Countdown promo section

#### [MODIFY] [utilities.css](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/assets/utilities.css)
- Responsive visibility helpers
- Flex/grid utilities
- Text alignment, truncation
- Scroll snap for carousels
- Overlay/backdrop

#### [MODIFY] [theme.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/layout/theme.liquid)
- Add Google Fonts link (Inter)
- Load all CSS files properly
- Add CSS custom property declarations from theme settings (dynamic colors/fonts)
- Add `components.css`, `sections.css`, `utilities.css` stylesheet tags
- Improve skip-to-content styling

---

### Phase 2 — Header, Navigation & Footer

Rebuild the header to match ElecSHOP's glassmorphism navbar and the footer to match the multi-column premium design.

#### [MODIFY] [header.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/header.liquid)
- Glassmorphism background with backdrop blur
- Three-tier layout: logo | search bar (with predictive search dropdown) | action icons
- Category dropdown on hover/click
- Mobile hamburger → slide-in drawer
- Sticky header with scroll shadow
- Cart icon with item count badge
- Account icon (link to `/account`)

#### [MODIFY] [desktop-menu.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/snippets/desktop-menu.liquid)
- Horizontal nav with category mega-menu/dropdown
- Hover underline animation
- Active state highlighting

#### [MODIFY] [mobile-menu.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/snippets/mobile-menu.liquid)
- Full-height slide-in drawer from left
- Accordion for nested menus
- Close button, overlay backdrop
- Search bar at top

#### [MODIFY] [footer.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/footer.liquid)
- 4-column responsive grid (About, Quick Links, Customer Service, Newsletter)
- Dark background with light text
- Social media icon row
- Payment method icons
- Copyright bar at bottom
- WhatsApp support link (optional)

#### [MODIFY] [announcement-bar.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/announcement-bar.liquid)
- Slim top bar with accent background
- Scrolling/rotating announcements
- Dismissable with close button

#### [MODIFY] [search-form.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/snippets/search-form.liquid)
- Expanded search input matching ElecSHOP's navbar search
- Search icon and clear button

#### [MODIFY] [predictive-search.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/snippets/predictive-search.liquid)
- Dropdown with product image thumbnails, titles, prices
- "View all results" link at bottom

---

### Phase 3 — Homepage Sections

Build all the homepage sections to mirror ElecSHOP's rich homepage layout.

#### [MODIFY] [hero-banner.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/hero-banner.liquid)
- Convert to carousel with multiple slides (using blocks)
- Full-width image with overlay gradient
- Eyebrow text, heading, subtext, CTA button
- Dot navigation + prev/next arrows
- Auto-play with pause-on-hover
- Side promo banners grid (2 blocks beside carousel on desktop)

#### [NEW] service-features.liquid
- Horizontal strip below hero
- 3-4 icon cards: Free Shipping, Secure Payment, 24/7 Support, Easy Returns
- Icon + title + short description
- Responsive: horizontal scroll on mobile

#### [MODIFY] [featured-collections.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/featured-collections.liquid)
- "Browse Categories" grid matching ElecSHOP's `BrowseCategories`
- Card with collection image, name, product count
- Hover zoom effect on image
- Responsive grid (2 cols mobile, 3 tablet, 4+ desktop)

#### [MODIFY] [featured-products.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/featured-products.liquid)
- "New Arrivals" / "Featured Products" section
- Section title pattern (eyebrow + heading + "View All" button)
- Horizontal scrolling product rail
- Product cards with hover effects

#### [NEW] best-sellers.liquid
- "Best Sellers" section with tabbed interface (by collection)
- Same product card component
- Configurable via section settings (select collections)

#### [NEW] countdown-promo.liquid
- Promotional banner with countdown timer
- Background image/gradient
- JavaScript countdown to configurable date
- CTA button

#### [MODIFY] [testimonials.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/testimonials.liquid)
- Carousel of customer testimonial cards
- Star rating, quote text, customer name/photo
- Auto-scroll with dot navigation
- Glass card styling

#### [MODIFY] [newsletter.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/newsletter.liquid)
- Full-width section with gradient background
- Heading, subtext, email input + subscribe button
- Integration with Shopify's customer newsletter

#### [NEW] brand-showcase.liquid
- Horizontal logo carousel/rail
- Auto-scrolling brand logos
- Configurable via image blocks

#### [MODIFY] [rich-text.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/rich-text.liquid)
- Clean content section for reusable text blocks
- Centered layout with max-width

#### [MODIFY] [index.json](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/templates/index.json)
- Update section order: hero → service-features → featured-collections → featured-products → best-sellers → brand-showcase → countdown-promo → testimonials → newsletter

---

### Phase 4 — Product Card, Collection & Product Pages

Build the product browsing experience matching ElecSHOP's store and product detail pages.

#### [MODIFY] [product-card.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/snippets/product-card.liquid)
- Image with hover zoom and overlay
- Sale/New/Out-of-stock badges
- Product title, vendor, price (with compare-at-price strikethrough)
- Quick "Add to Cart" button on hover
- Star rating display
- Wishlist heart icon (localStorage-based)

#### [MODIFY] [product-grid.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/product-grid.liquid)
- Responsive grid: 2 cols mobile, 3 tablet, 4 desktop
- Animated stagger on load
- Grid/list view toggle

#### [MODIFY] [collection.json](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/templates/collection.json)
- Sidebar filters section + product grid
- Sort dropdown
- Active filters chips
- Pagination

#### [MODIFY] [filters.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/snippets/filters.liquid)
- Sidebar filter panel matching ElecSHOP's `StoreFilters`
- Price range slider
- Category/type checkboxes
- Vendor/brand filter
- Availability filter
- Collapsible filter groups
- Mobile: bottom sheet or slide-in drawer

#### [MODIFY] [product.json](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/templates/product.json)
- Layout: image gallery left, product info right
- Update section ordering

#### [NEW] product-main.liquid *(section)*
- Image gallery with thumbnail strip (matching ElecSHOP's `ProductDisplay`)
- Main image zoom on hover
- Product title, vendor, SKU
- Star rating
- Price display with sale styling
- Variant picker (color swatches, size buttons)
- Quantity selector
- Add to Cart button (with loading state)
- Stock badge
- Share buttons
- Tabs below: Description, Reviews, Q&A (static)

#### [MODIFY] [variant-picker.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/snippets/variant-picker.liquid)
- Color swatches (circular with checkmark)
- Size/option buttons
- Unavailable variant styling (strikethrough)

#### [MODIFY] [related-products.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/related-products.liquid)
- "You might also like" product rail
- Same product card component

#### [MODIFY] [recently-viewed.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/recently-viewed.liquid)
- localStorage-based recently viewed products
- Horizontal scroll rail

---

### Phase 5 — Cart, Search & Utility Pages

#### [MODIFY] [cart-drawer.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/cart-drawer.liquid)
- Slide-in drawer from right
- Line items with image, title, variant, quantity ± buttons, price, remove
- Subtotal, discount code input
- "Checkout" button
- Empty cart state with "Continue Shopping" CTA
- Overlay backdrop

#### [MODIFY] [cart.json](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/templates/cart.json)
- Full cart page as fallback
- Same line item styling
- Recommended products below cart

#### [MODIFY] [search.json](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/templates/search.json)
- Search results page with product grid
- Filters sidebar
- "No results" state with suggestions

#### [MODIFY] [contact.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/contact.liquid)
- Modern contact form with glass card styling
- Contact info sidebar (phone, email, address, WhatsApp)
- Map embed option

#### [MODIFY] [faq.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/faq.liquid)
- Accordion FAQ with smooth expand/collapse
- Search within FAQ
- Category grouping

#### [MODIFY] [page.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/page.liquid)
- Clean content page template for About, Privacy, Terms, etc.
- Proper typography and spacing

---

### Phase 6 — JavaScript & Interactivity

#### [MODIFY] [base.js](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/assets/base.js)
- Sticky header scroll behavior
- Mobile menu toggle (slide-in/out)
- Overlay management
- Announcement bar dismiss
- Smooth scroll to anchors

#### [MODIFY] [core.js](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/assets/core.js)
- Hero carousel (auto-play, swipe, dots, arrows)
- Testimonials carousel
- Brand logo auto-scroll
- Countdown timer logic
- Accordion (FAQ)
- Tabs (product page)
- Image zoom on hover (product page)

#### [MODIFY] [components.js](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/assets/components.js)
- Product card hover effects
- Quick add-to-cart (AJAX via Shopify Cart API)
- Wishlist toggle (localStorage)
- Recently viewed tracking (localStorage)

#### [MODIFY] [cart.js](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/assets/cart.js)
- Cart drawer open/close
- Add/remove/update line items via Shopify Cart API (`/cart/add.js`, `/cart/change.js`)
- Cart count badge update
- Loading states

#### [MODIFY] [product.js](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/assets/product.js)
- Variant selection → update price, image, availability
- Quantity selector
- Image gallery thumbnail switching
- Add to cart with AJAX

#### [MODIFY] [sections.js](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/assets/sections.js)
- Predictive search (debounced fetch to Shopify predictive search API)
- Filter sidebar toggle on mobile
- Sort dropdown
- Grid/list view toggle
- Newsletter form AJAX submit

---

### Phase 7 — Customer Accounts & Blog

#### [MODIFY] [login.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/login.liquid)
- Premium login form with glass card
- "Forgot password" link
- "Create account" link

#### [MODIFY] [register.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/register.liquid)
- Registration form matching login design
- First/last name, email, password

#### [MODIFY] [account.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/account.liquid)
- Account dashboard with order history
- Address management link
- Profile info

#### [MODIFY] [order.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/order.liquid)
- Order detail view with line items, status, totals

#### [MODIFY] [blog.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/blog.liquid)
- Blog listing with card grid
- Featured image, title, excerpt, date

#### [MODIFY] [article.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/article.liquid)
- Article detail with proper typography
- Author, date, share buttons
- Comments section

#### [MODIFY] [404.liquid](file:///d:/User/Documents/PorfolioProjects/ShopifyStore/sections/404.liquid)
- Styled 404 page with illustration
- "Back to Home" CTA
- Search bar

---

## Verification Plan

### Manual Verification
Each phase will be verified by running the existing `shopify theme dev` command and checking:

1. **Phase 1**: CSS custom properties render, layout structure correct, fonts load
2. **Phase 2**: Header sticky behavior, mobile menu, footer layout, search works
3. **Phase 3**: All homepage sections render with Shopify data, carousel works, responsive
4. **Phase 4**: Product cards display, collection filters work, product page gallery works
5. **Phase 5**: Cart drawer add/remove works, search returns results, contact form submits
6. **Phase 6**: All JavaScript interactions smooth, no console errors
7. **Phase 7**: Customer login/register flow, account page shows orders, blog renders

### Cross-Browser Testing
- Chrome, Firefox, Edge (latest)
- Mobile responsiveness at 375px, 768px, 1024px, 1440px

### Performance
- Lighthouse audit targeting 90+ performance score
- All images use Shopify's CDN with proper sizing
- CSS/JS files minified where possible

---

## Summary

| Phase | Scope | New Files | Modified Files |
|-------|-------|-----------|----------------|
| 1 | Design system & layout | 0 | 6 |
| 2 | Header, nav & footer | 0 | 7 |
| 3 | Homepage sections | 3 | 7 |
| 4 | Product card, collection & product pages | 1 | 7 |
| 5 | Cart, search & utility pages | 0 | 6 |
| 6 | JavaScript & interactivity | 0 | 6 |
| 7 | Customer accounts & blog | 0 | 6 |
| **Total** | | **4 new** | **~45 modified** |

Estimated effort: This is a significant theme rebuild (~4 new sections, ~45 file modifications across 7 phases).
