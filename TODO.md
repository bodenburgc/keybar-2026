# KeyBar 2026 - Task List

## Priority Legend
- **P0** - Critical, do now
- **P1** - High priority, do soon
- **P2** - Medium priority, when time permits
- **P3** - Low priority, nice to have

---

## In Progress

_None currently_

---

## Pending Tasks

### Accessibility (P1)

- [ ] Add alt text to `snippets/background-image.liquid`
- [ ] Add alt text to `snippets/collage.liquid` and `collage-grid.liquid`
- [ ] Add alt text to `snippets/header-nav-mega.liquid` (nav promo images)
- [ ] Add alt text to `snippets/gift-wrapping-list.liquid` and `gift-wrapping-list-horizontal.liquid`
- [ ] Add alt text to `snippets/header-icons.liquid` (country flags)
- [ ] Add alt text to `snippets/portfolio.liquid`

### Performance (P2)

- [ ] Add `.finally()` blocks to fetch chains in theme.js for proper cleanup
- [ ] Add explicit width/height attributes to images to prevent layout shift
- [ ] Add preload hints for critical product images in gallery
- [ ] Review and optimize large CSS/JS bundle sizes

### Code Quality (P2)

- [ ] Sanitize innerHTML assignments throughout JS (use DOMPurify or textContent)
- [ ] Replace hardcoded `#ccc` color in `apps.css` print media query with theme variable
- [ ] Clean up precise calc() values in theme.css (round to cleaner values)

### SEO (P3)

- [ ] Add hreflang tags if supporting multiple locales
- [ ] Implement AggregateRating schema when product reviews are added
- [ ] Validate FAQ schema with Google Rich Results Test
- [ ] Add explicit robots meta tag if needed

### Documentation (P3)

- [ ] Document color scheme usage patterns
- [ ] Add JSDoc comments to complex theme.js functions

---

## Completed (Recent)

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
