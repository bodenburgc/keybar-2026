# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**KeyBar 2026** - Shopify store for KeyBar EDC (Everyday Carry) key organizers. Built on the BODE theme framework.

| Key Info | Value |
|----------|-------|
| Store URL | keybarus.myshopify.com |
| Live Theme ID | 186764001563 |
| Theme Framework | BODE 1.0.0 |
| Shopify API | 2024-01 |

**Task List:** `TODO.md` | **Feature Specs:** `.docs/` | **Brand Guidelines:** `.docs/brand/`

## Shopify CLI Commands

```bash
shopify auth login                              # Authenticate (opens browser)
shopify theme dev -s keybarus.myshopify.com     # Local development with hot reload
shopify theme push -s keybarus.myshopify.com    # Deploy to store
shopify theme push -s keybarus.myshopify.com -t 186764001563 --allow-live  # Deploy to live theme
shopify theme pull -s keybarus.myshopify.com    # Pull live theme changes
shopify theme check                             # Lint/validate theme
shopify theme share -s keybarus.myshopify.com   # Generate preview link
```

**No build step required** - CSS/JS are served as-is from `/assets/`.

**Slash command:** `/build <description>` runs a structured multi-feature workflow (analysis → planning → execution → verification).

## BODE Upstream Framework

This repo is a downstream fork of BODE (migrated from WordPress). **Framework changes (sections, snippets, core JS/CSS) should be made in BODE-shopify first**, then pulled here.

**Git Remotes:**

| Remote | Repo | Purpose |
|--------|------|---------|
| origin | `bodenburgc/keybar-2026` | Push project changes |
| upstream | `bodenburgc/BODE-shopify` | Pull framework updates |

```bash
# Pull framework updates
git fetch upstream && git merge upstream/main && git push origin main
```

| Change Type | Where |
|-------------|-------|
| Section/snippet bug fixes, new reusable sections, JS/CSS framework | BODE-shopify first |
| KeyBar brand (colors, fonts, logos, homepage, `.docs/brand/`) | This repo |

When making framework-level fixes directly in this repo (e.g. bug fixes that should go upstream), add a comment:
```js
// TODO(BODE): backport to BODE-shopify
```

**Protected files (merge=ours):** `config/settings_data.json`, `.shopify/*`, `templates/index.json`, `sections/header-group.json`, `sections/footer-group.json`, `sections/overlay-group.json`, `.docs/brand/*`

## Theme Architecture

### Component Hierarchy

```
layout/theme.liquid
├── sections 'header-group'     → sections/header-group.json
├── sections 'overlay-group'    → sections/overlay-group.json
├── content_for_layout          → templates/*.json → sections/*.liquid
│                                  sections can contain blocks/ components
└── sections 'footer-group'     → sections/footer-group.json
```

### Settings → CSS → Components Flow

```
config/settings_schema.json (definitions)
        ↓
config/settings_data.json (current values, auto-generated)
        ↓
snippets/css-variables.liquid ({{ settings.* }} → :root CSS variables)
        ↓
snippets/js-variables.liquid ({{ settings.* }} → window.theme object)
        ↓
theme.css + theme.js (consume variables)
```

### Section Color Schemes

Sections support `light` (default), `dark` (gunmetal/white/gold), and `accent` (gold/dark) color schemes.

```liquid
{%- render 'color-scheme', scheme: section.settings.color_scheme -%}
```

See `.docs/COLOR-SCHEMES.md` for implementation details.

### Asset Loading

**Always loaded:** `fonts.css` → `css-variables.liquid` → `theme.css` (16K lines) → `vendor.js` → `theme.js` (8K lines, 70+ web components)

**Template-specific:** Assets like `cart.js/css`, `collection.js/css`, `product-bundle.js/css` are loaded in their respective sections.

### Web Components

Interactive features use custom elements (70+ in `theme.js`). Key ones:
- **Product:** `<product-bundle>`, `<product-addon>`, `<variant-picker>`, `<product-info>`, `<media-gallery>`
- **UI:** `<modal-element>`, `<accordion-details>`, `<carousel-element>`, `<slider-element>`, `<motion-list>`
- **Other:** `<sticky-element>`, `<countdown-timer>`, `<g-map>` (dealer locator)

### Key Files

| File | Purpose |
|------|---------|
| `snippets/css-variables.liquid` | Theme settings → CSS custom properties (`:root`) |
| `snippets/js-variables.liquid` | Routes, feature flags → `window.theme` object |
| `config/settings_schema.json` | Theme settings definitions (from BODE) |
| `config/settings_data.json` | Current values (**DO NOT edit manually**) |
| `locales/en.default.json` | Translation strings |

## KeyBar-Specific Sections

- `product-bundle.liquid` + `product-bundle.js` - Bundle KeyBar + inserts
- `product-addon-picker.liquid` - Pocket clip add-on selector (see `.docs/FEATURE-CLIP-ADDON.md`)
- `product-comparison.liquid` - Compare KeyBar sizes/materials
- `dealer-locator.liquid` + `dealer-locator.js` - Find retailers (Maps API)

## Development Notes

**Section Schema Pattern:**
```liquid
<style>
  #shopify-section-{{ section.id }} { /* scoped CSS */ }
</style>
{%- liquid
  # Liquid logic here
-%}
<!-- HTML content -->
{% schema %}
{ "name": "Section Name", "settings": [...], "blocks": [...], "presets": [...] }
{% endschema %}
```

All section styles must be scoped to `#shopify-section-{{ section.id }}` to avoid conflicts.

**Liquid Syntax:** `{%- liquid ... -%}` (logic), `{{ variable }}` (output), `{% render 'snippet' %}` (include), `{{ 'key' | t }}` (translations)

**Snippet Documentation:**
```liquid
{%- doc -%}
  @param {type} name - Description
{%- enddoc -%}
```

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| KeyBar Gold | #FFD700 | Primary accent, buttons |
| Dark Teal | #16323e | Text, headings |
| Gunmetal | #1c1f22 | Footer, dark sections |
| Light Gray | #EBEEF1 | Alternate backgrounds |

## SEO Implementation

**Structured Data (JSON-LD):** All schemas use `https://schema.org` (not http)
- `Product` in `main-product.liquid` (images, price, SKU, shipping, returns)
- `BreadcrumbList` in `product-breadcrumb.liquid`
- `FAQPage` in `faq.liquid`
- `CollectionPage`, `BlogPosting`, `Organization` in respective sections

**Best Practices:** One H1 per page, all images need alt text, canonical URLs handled by Shopify.

## Cart & Page Configuration

**Cart:** Free shipping threshold $75, cart drawer enabled with recommendations. Vendor hidden (KeyBar is sole brand).

**Page Templates:** `page.about.json`, `page.faqs.json`, `page.setup-care.json`, `page.dealer-info.json`, `page.style-guide.json`

## Product Add-On System

Add-on picker for optional products (pocket clips) when purchasing KeyBars. **Full spec:** `.docs/FEATURE-CLIP-ADDON.md`

**Files:** `snippets/product-addon-picker.liquid`, `assets/product-addon.js`, `assets/product-addon.css`

**Product Metafields** (defined in `.shopify/metafields.json`):

| Metafield | Type | Purpose |
|-----------|------|---------|
| `custom.enable_clip_add_on` | boolean | Enable add-on picker on product |
| `custom.clip_addon_optional` | boolean | Start deselected (user must opt in) |
| `custom.clip_addon_products` | product list | Which clips to offer |
| `custom.clip_addon_title` | text | Optional custom heading |
| `custom.clip_addon_description` | multiline text | Optional custom description |
| `custom.description_short` | multiline text | Short description for product cards |
| `custom.card_description` | text | One-line card description override |

## Code Patterns

**Error handling in fetch chains:** Never use silent `.catch(() => {})`. Use:
```js
.catch((e) => { if (e.name !== 'AbortError') console.error(e); })
```

**Web component cleanup:** All custom elements with observers, listeners, or AbortControllers must implement `disconnectedCallback()` to prevent memory leaks.

**CSS containment:** Use `contain: content` on isolated sections, `contain: layout style` on fixed-position elements (e.g. mobile-dock).

**Reduced motion:** Add a single `@media (prefers-reduced-motion: reduce)` block at the end of each CSS file, setting `transition-duration: 0s` and `animation-duration: 0s`.

**DOM queries in loops:** Hoist `querySelectorAll` calls before loops when the selector is loop-invariant.

## Important Constraints

1. **Never edit `config/settings_data.json` manually** - Auto-generated by Shopify admin
2. **Test locally first** - `shopify theme dev` before any `theme push`
3. **Validate before deploying** - Run `shopify theme check` to catch accessibility/SEO issues (aria labels, image alt text, deprecated tags)
4. **Framework changes go to BODE** - Then pull upstream here
5. **English only** - Non-English locale files have been removed
6. **Mobile-first** - Design for mobile, enhance for desktop
7. **SEO schemas use https** - Always use `https://schema.org`, not http
8. **Vendor hidden** - KeyBar is sole brand; `show_vendor` disabled throughout
