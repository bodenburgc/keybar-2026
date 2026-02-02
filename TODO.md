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
| Page content duplication bug | P0 | Task #19 |
| Warranty page broken contact link | P1 | Task #29 |
| FAQs page broken "Contact Us" link | P1 | Task #30 |
| Images missing alt text (8 total) | P2 | Task #31 |
| Add-on picker shows dropdown on desktop | P2 | Task #24 |
| Multiple FAQPage schemas (should be 1) | P3 | Task #32 |

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

- [ ] **#19 - Page Content Duplication** (P0) - Investigate and fix

---

## Pending Tasks

### Critical Bugs (P0)

- [ ] **#19 - Page Content Duplication** - Full-page screenshots show content rendering twice (header and sections appear again below footer). Affects all pages. Check `layout/theme.liquid`, CSS positioning, section groups, or JS rendering.

### Broken Links (P1)

- [ ] **#29 - Fix warranty page contact link** - Content is in Shopify admin (Pages → Warranty). Update "contact us" link to `mailto:info@keybar.us`
- [x] **#30 - Fix FAQs page "Contact Us" link** - Changed to `mailto:info@keybar.us`
- [x] **Fix Setup & Care page "Contact Us" link** - Changed to `mailto:info@keybar.us`

### Proposal Gaps - Admin Tasks (P2)

- [ ] **#27 - Enable product reviews** - Theme has full review support built-in. Install Judge.me/Loox/Yotpo app, enable "rating" block in product template via theme editor
- [ ] **#26 - Create Bundles collection** - Set up in Shopify admin, add bundle products
- [ ] **#28 - Verify accelerated checkout** - Shopify admin → Settings → Payments → Enable Shop Pay, Apple Pay, Google Pay
- [ ] **Verify 301 redirects** - Check URL Redirects in Shopify admin for old WooCommerce URLs

### UI Enhancements (P2)

- [ ] **#24 - Add-on Picker Image Cards on Desktop** - Mobile already shows image cards; update to show on desktop too (see `snippets/product-addon-picker.liquid`)

### Accessibility (P2)

- [ ] **#22 - Collection Product Accessibility** - Products render visually but may not be in accessibility tree (test with screen reader)
- [ ] **#31 - Add missing alt text** - 4 images on product page + 4 on collection page missing alt attributes

### Performance (P2)

- [ ] Add `.finally()` blocks to fetch chains in theme.js for proper cleanup
- [ ] Add explicit width/height attributes to images to prevent layout shift
- [ ] Add preload hints for critical product images in gallery
- [ ] Review and optimize large CSS/JS bundle sizes

### Code Quality (P3)

- [ ] Sanitize innerHTML assignments throughout JS (use DOMPurify or textContent)
- [ ] Replace hardcoded `#ccc` color in `apps.css` print media query with theme variable
- [ ] Clean up precise calc() values in theme.css (round to cleaner values)

### SEO (P3)

- [ ] **#32 - Consolidate FAQ schema** - Currently 3 separate FAQPage schemas; combine into single schema
- [ ] Add hreflang tags if supporting multiple locales
- [ ] Implement AggregateRating schema when product reviews are added
- [ ] Add explicit robots meta tag if needed

### Documentation (P3)

- [ ] Document color scheme usage patterns
- [ ] Add JSDoc comments to complex theme.js functions

---

## Completed (Recent)

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
