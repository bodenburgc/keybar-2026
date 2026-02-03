# KeyBar 2026 - Task List

## Priority Legend
- **P0** - Critical, do now
- **P1** - High priority, do soon
- **P2** - Medium priority, when time permits
- **P3** - Low priority, nice to have

---

## Proposal Audit (vs BODE Design Proposal)

### Brand & Design

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Rugged industrial style, mobile-first theme | ✅ Done | BODE theme framework |
| "Our Story" page (USA mfg, Stop the Noise) | ✅ Done | `/pages/about` |
| Trust signals (warranty, Made in USA, free shipping) | ✅ Done | Announcement bar + footer icons |

### Shopify Build & Migration

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Products/content migrated from WooCommerce | ✅ Done | |
| SEO-friendly URLs | ✅ Done | Clean handles |
| 301 redirects configured | ⚠️ Verify | Check Shopify admin |
| Homepage | ✅ Done | |
| Product pages | ✅ Done | With add-on picker |
| About page | ✅ Done | `/pages/about` |
| Contact page | ⏭️ Skipped | Client preference - reducing contact points |
| Warranty page | ✅ Done | `/pages/warranty` |
| FAQ page | ✅ Done | `/pages/faqs` |

### Product Content & Optimization

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Benefit-driven product descriptions | ✅ Done | |
| High-res images + video/360° support | ✅ Done | Media gallery with video |
| Comparison/guide content | ⚠️ Partial | Sections exist (`product-comparison.liquid`), verify usage |
| Upsell/bundling (add-ons at checkout) | ✅ Done | Add-on picker + cart drawer |

### User Experience & Conversion Flow

| Deliverable | Status | Notes |
|-------------|--------|-------|
| Clear navigation (KeyBars, Inserts, Accessories, Limited Editions, Bundles) | ⚠️ Partial | Missing: Bundles, Limited Editions |
| **Bundles collection** | ❌ Missing | Needs Shopify admin setup |
| **Limited Editions collection** | ❌ Missing | Needs Shopify admin setup (if needed) |
| Strong CTAs ("Shop KeyBars", "Complete Your Setup") | ✅ Done | |
| Cart drawer with suggested add-ons | ✅ Done | Configured in overlay-group |
| **Accelerated checkout (Shop Pay, Apple Pay, Google Pay)** | ⚠️ Verify | Check Shopify Payments settings |
| **Product reviews on homepage and product pages** | ❌ Missing | Needs app (Judge.me, Loox, etc.) |

---

## UI/UX SEO Audit (2026-02-02)

### Audit Screenshots

Screenshots captured via Playwright in `.playwright-mcp/`:
- `audit-homepage-desktop.png` - Homepage (1280px)
- `audit-homepage-mobile.png` - Homepage (375px)
- `audit-product-desktop.png` - Product page (1280px)
- `audit-product-mobile.png` - Product page (375px)
- `audit-collection-desktop.png` - Collection page (1280px)
- `audit-faqs-desktop.png` - FAQs page (1280px)

### SEO Audit Results

| Page | Title | H1 | Meta Desc | Canonical | OG Tags | Schema |
|------|-------|-----|-----------|-----------|---------|--------|
| Homepage | ✅ | ✅ (1) | ✅ | ✅ | ✅ | ✅ |
| Product | ✅ | ✅ (1) | ✅ | ✅ | ✅ | ✅ Product |
| Collection | ✅ | ✅ (1) | - | ✅ | - | ✅ |
| FAQs | ✅ | ✅ (1) | - | ✅ | - | ✅ FAQPage (3x) |

### Issues Found

| Issue | Priority | Status |
|-------|----------|--------|
| Page content duplication bug | P0 | ✅ Fixed (#19) |
| Warranty page broken contact link | P1 | ⚠️ Admin task (#29) |
| FAQs page broken "Contact Us" link | P1 | ✅ Fixed (#30) |
| Images missing alt text (8 total) | P2 | ✅ Fixed (#31) |
| Add-on picker shows dropdown on desktop | P2 | ✅ Fixed (#24) |
| Collection accessibility (screen readers) | P2 | ✅ Fixed (#22) |
| Multiple FAQPage schemas (should be 1) | P3 | ✅ Fixed (#32) |

### Positive Findings

- ✅ Mobile responsive design working well
- ✅ Mobile dock navigation functional
- ✅ Add-on picker shows image cards on mobile
- ✅ Product structured data complete
- ✅ FAQ structured data present (though split)
- ✅ Proper heading hierarchy (single H1 per page)
- ✅ Skip to content link present
- ✅ Breadcrumbs on collection pages

---

## In Progress

_None currently_

---

## Pending Tasks

### Critical Bugs (P0)

- [x] **#19 - Page Content Duplication** - Fixed by changing footer CSS from unconditional `position: absolute` to conditional `[data-parallax]` selector. Footer now renders in normal document flow unless parallax is explicitly enabled.

### Broken Links (P1)

- [ ] **#29 - Fix warranty page contact link** - Content is in Shopify admin (Pages → Warranty). Update "contact us" link to `mailto:info@keybar.us`
- [x] **#30 - Fix FAQs page "Contact Us" link** - Changed to `mailto:info@keybar.us`
- [x] **Fix Setup & Care page "Contact Us" link** - Changed to `mailto:info@keybar.us`

### Proposal Gaps - Admin Tasks (P2)

- [ ] **#27 - Enable product reviews** - Theme has full review support built-in. Install Judge.me/Loox/Yotpo app, enable "rating" block in product template via theme editor
- [ ] **#26 - Create Bundles collection** - Set up in Shopify admin, add bundle products
- [ ] **#28 - Verify accelerated checkout** - Shopify admin → Settings → Payments → Enable Shop Pay, Apple Pay, Google Pay
- [ ] **Verify 301 redirects** - Check URL Redirects in Shopify admin for old WooCommerce URLs

### Content Issues - Admin Tasks (P1)

- [ ] **#35 - Fix product description nested lists** - Freedom Aluminum KeyBar has invalid HTML: `<ul><ul>` nesting (4 instances). In Shopify admin → Products → Freedom Aluminum KeyBar → Edit description. The "What's included?" list has `<ul>` directly inside `<ul>` without `<li>` wrapper. Same for "How much does the KeyBar weigh?" section. Fix by ensuring proper list structure.
- [ ] **#36 - Replace watermarked product image** - Freedom Aluminum KeyBar image 1 shows "Filter Status" watermark (stock photo). In Shopify admin → Products → Freedom Aluminum KeyBar → Media, replace `Aluminum-Freedom-Update-1.jpg` with final watermark-free photo.

### UI Enhancements (P2)

- [x] **#24 - Add-on Picker Image Cards on Desktop** - Already implemented with image cards for all screen sizes (commit 08083cf)
- [x] **#33 - Empty product carousels on product page** - Fixed `product-recommendations.liquid` to only render section when products are found. Pre-counts available products before rendering. Both carousels now display 12 products.
- [x] **#34 - Add breadcrumbs to product pages** - Added breadcrumb block to `templates/product.json`. Uses existing `snippets/product-breadcrumb.liquid` with BreadcrumbList schema. Shows: Home > Collection > Product.
- [x] **#42 - Move breadcrumb above product columns** - Moved breadcrumb render from block loop to before the grid container in `sections/main-product.liquid`. Now spans full width above both columns.

### Visual Design Issues (P2)

- [x] **#37 - H3 font size inconsistency** - Changed addon picker title to use `h4` class instead of `text-base` for proper visual hierarchy (18-24px responsive).
- [x] **#38 - Customize button uses wrong gold color** - Updated `--addon-accent-color` fallback from #b78726 to brand gold #ffd700.
- [x] **#39 - Add-Ons links lack visual distinction** - Added subtle underline (40% opacity, 2px offset) to addon card titles. Underline removes when selected.
- [x] **#40 - Increase vendor label letter-spacing** - Increased from 0.1em to 0.15em in main-product.liquid.
- [x] **#41 - Fix Add to Cart button border color** - Added `--color-button-border: 22 50 62` to match dark teal background.
- [x] **#43 - Remove space below vendor label** - Set `margin-block-end: 0` on `.product__vendor` in `sections/main-product.liquid`.
- [x] **#44 - Increase vendor letter-spacing further** - Increased from 0.15em to 0.25em in `sections/main-product.liquid`.

### Accessibility (P2)

- [x] **#22 - Collection Product Accessibility** - Added `role="list"` and `aria-label` to product grid, `aria-live` announcements for filter/sort changes, screen reader announcements when products load (commit 8575fc4)
- [x] **#31 - Add missing alt text** - Fixed 7 images: product-card.liquid (4) and main-product.liquid (3)

### Performance (P2)

- [x] Add `.finally()` blocks to fetch chains in theme.js for proper cleanup - Added to RecentlyViewed, ProductRecommendations, APIButton.renderSectionFromFetch, QuickView.quickview (4 of 7 fetch chains that needed it)
- [x] Add explicit width/height attributes to images to prevent layout shift - Added to media.liquid (3 image_tag calls) and main-product.liquid (2 bundle variant images)
- [x] Add preload hints for critical product images in gallery - Added `<link rel="preload">` for featured product image in layout/theme.liquid with responsive srcset
- [x] Review and optimize large CSS/JS bundle sizes - Audit complete: theme.css (337KB), theme.js (241KB). Potential 27-48KB savings possible but requires medium-high effort (consolidate 84 web components, dedupe media queries). No critical issues found.

### Code Quality (P3)

- [x] Sanitize innerHTML assignments throughout JS - Security audit complete: **No XSS vulnerabilities found**. All 24 JS files reviewed. Codebase uses DOMParser for server responses and textContent for user input. No changes needed.
- [x] Remove console.log statements from theme.js - Removed 6 debug statements (commit 8575fc4)
- [x] Replace hardcoded `#ccc` color - Fixed in `product-addon.css` print media query (was not in apps.css as originally noted)
- [x] Clean up precise calc() values in theme.css - Reviewed: values are intentionally precise for fluid typography scale calculations. Rounding would affect visual output. No changes needed.

### SEO (P3)

- [x] **#32 - Consolidate FAQ schema** - Added `enable_faq_schema` setting to FAQ section. Only first section outputs schema now. For full consolidation, combine all FAQs into single section.
- [ ] Add hreflang tags if supporting multiple locales
- [ ] Implement AggregateRating schema when product reviews are added
- [ ] Add explicit robots meta tag if needed

### Documentation (P3)

- [x] Document color scheme usage patterns - Created `.docs/COLOR-SCHEMES.md`
- [x] Add JSDoc comments to complex theme.js functions - Added documentation to `theme.a11y`, `theme.utils`, `theme.pubsub` namespaces and `ProductInfo`, `VariantPicker`, `ModalElement` classes

---

## Completed (Recent)

### 2026-02-03 - Visual Design Fixes

- [x] **#37 - H3 font size** - Changed addon picker title to `h4` class for proper hierarchy
- [x] **#38 - Gold color** - Updated addon accent color to brand gold #ffd700
- [x] **#39 - Links accessibility** - Added subtle underline to addon card titles (WCAG 2.1)
- [x] **#40 - Vendor letter-spacing** - Increased to 0.15em
- [x] **#41 - Button border** - Fixed Add to Cart border to match dark teal background

### 2026-02-03 - UI & Documentation Fixes

- [x] **#33 - Fix product carousels** - Fixed `product-recommendations.liquid` to pre-count products before rendering section. Section now only displays when products exist.
- [x] **#34 - Add breadcrumbs to product pages** - Added breadcrumb block to `templates/product.json` (first in block order). Uses existing snippet with BreadcrumbList schema.
- [x] **Add JSDoc to theme.js** - Added documentation to core namespaces (`theme.a11y`, `theme.utils`, `theme.pubsub`) and key classes (`ProductInfo`, `VariantPicker`, `ModalElement`)

### 2026-02-03 - Accessibility & Code Quality Audit (commit 8575fc4)

- [x] **#22 - Collection Product Accessibility** - Added `role="list"` and `aria-label` to motion-list, `aria-live="polite"` to product count, live region announcer for dynamic product loads
- [x] **Security Audit** - Reviewed all 24 JS files for innerHTML XSS vulnerabilities. No issues found - codebase follows best practices (DOMParser, textContent).
- [x] **Bundle Size Audit** - theme.css (337KB), theme.js (241KB), apps.css (62KB). 27-48KB potential savings identified but requires medium-high effort.
- [x] **Remove console.log** - Removed 6 debug statements from theme.js
- [x] Added translation strings for accessibility announcements (`collections.general.products_list`, `collections.general.products_loaded`)

### 2026-02-02 - UI/UX SEO Audit

- [x] **#23 - Verify mobile responsive design** - Tested all pages on mobile (375px). Mobile dock navigation works, add-on picker shows image cards, touch targets adequate, layout adapts correctly.

### 2026-02-02 - Build Session Fixes

- [x] **Add-on Picker Image Cards (Mobile)** - Mobile view shows image cards for clip selection. Desktop still shows dropdown (Task #24 to update desktop).
- [x] **Create Contact page template** - Created `templates/page.contact.json` with contact form, subject selector, and sidebar info. **Admin action:** Create page with handle "contact" and assign template.
- [x] **Fix font_url error** - Removed invalid font preload lines using `font_url` filter (requires font_picker settings). Fonts load via fonts.css
- [x] **Fix empty product carousels** - Fixed Liquid `default` filter issue with empty arrays in featured-collection.liquid
- [x] Add alt text to `snippets/background-image.liquid`
- [x] Add alt text to `snippets/collage.liquid` and `collage-grid.liquid`
- [x] Add alt text to `snippets/header-nav-mega.liquid` (nav promo images, collection images, tab icons)
- [x] Add alt text to `snippets/gift-wrapping-list.liquid` and `gift-wrapping-list-horizontal.liquid`
- [x] Add alt text to `snippets/header-icons.liquid` (country flags)
- [x] Add alt text to `snippets/portfolio.liquid`

### 2026-02-02 - Site Audit Fixes (commit 7a7b6ae)

- [x] Fix invalid CSS `calc(infinity * 1px)` → `9999px` in theme.css
- [x] Update themeName from 'Concept' to 'KeyBar' in js-variables
- [x] Fix clip addon metafield documentation (`enable_clip_add_on`)
- [x] Add alt text to collection-card.liquid
- [x] Add alt text to article-card.liquid
- [x] Add alt text to footer-logo.liquid
- [x] Add aria-hidden to placeholder SVGs in collection-card
- [x] Add disconnectedCallback cleanup to FacetForm in collection.js
- [x] Remove BODE console.log branding from theme.js
- [x] Replace scroll-spy with IntersectionObserver for better performance
- [x] Remove console.log statements from 8 JS files
- [x] Consolidate !important rules in apps.css with documentation

### 2026-02-02 - Add-on & Branding Fixes (commits acea86d, 7ad6eed)

- [x] Fix product add-on not being added to cart with main product
- [x] Remove all Fish Armor references, update branding to KeyBar

---

## Notes

- Run `shopify theme check` before pushing to validate theme
- Test locally with `shopify theme dev -s keybarus.myshopify.com`
- Framework changes should go to BODE-shopify first, then pull upstream
- **Proposal PDF:** `/Users/cbodenburg/Downloads/KeyBar Shopify Proposal.pdf`
