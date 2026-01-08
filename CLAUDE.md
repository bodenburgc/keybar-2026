# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BODE** - A modern Shopify theme framework designed for deployment across multiple client projects.

| Key Info | Value |
|----------|-------|
| Theme Framework | BODE 1.0.0 |
| Shopify API | 2024-01 |
| Architecture | Liquid + Web Components |
| CSS System | CSS Variables + Utility Classes |

## Shopify CLI Commands

```bash
shopify theme dev          # Local development server
shopify theme push         # Deploy to store
shopify theme pull         # Pull live theme changes
shopify theme check        # Lint/validate theme
shopify theme share        # Generate preview link
shopify auth login         # Authenticate (required first)
```

## Theme Architecture

### Component Hierarchy

```
layout/theme.liquid
├── sections 'header-group'     → sections/header-group.json
├── sections 'overlay-group'    → sections/overlay-group.json (cart-drawer, search, popups)
├── content_for_layout          → templates/*.json → sections/*.liquid
└── sections 'footer-group'     → sections/footer-group.json
```

### Section Groups (Global Components)

Section groups render across all pages. Defined in JSON files:
- `header-group.json` - Header, announcement bar
- `footer-group.json` - Footer, mobile dock, cookie banner
- `overlay-group.json` - Cart drawer, search drawer, age verification, newsletter popup

### Template → Section Flow

Templates are JSON files referencing sections:
```
templates/product.json → sections/main-product.liquid
                       → sections/product-recommendations.liquid
                       → sections/recently-viewed.liquid
```

### Key Files

| File | Purpose |
|------|---------|
| `snippets/css-variables.liquid` | Global CSS custom properties from theme settings |
| `snippets/js-variables.liquid` | JavaScript config (routes, feature flags) |
| `config/settings_schema.json` | Theme settings definitions |
| `config/settings_data.json` | Current setting values (auto-generated, DO NOT edit) |
| `locales/en.default.json` | Translation strings (English only) |

### Asset Loading

CSS loads in `<head>` (blocking), JS loads with `defer`:
```liquid
{{ 'theme.css' | asset_url | stylesheet_tag: preload: true }}
<script src="{{ 'theme.js' | asset_url }}" defer="defer"></script>
```

Feature-specific assets load conditionally in sections (e.g., `cart.css`, `cart.js`).

## Core Sections

### Essential (Always Needed)
- `main-product.liquid` - Product page
- `main-collection.liquid` - Collection listing
- `main-cart.liquid` - Cart page
- `cart-drawer.liquid` - Cart sidebar
- `header.liquid` - Navigation header
- `footer.liquid` - Site footer
- `mobile-dock.liquid` - Mobile bottom nav
- `search-drawer.liquid` - Search interface
- `announcement-bar.liquid` - Top banner
- `cookie-banner.liquid` - Cookie consent

### Specialized
- `dealer-locator.liquid` - Google Maps store finder
- `product-bundle.liquid` - Bundle builder
- `product-comparison.liquid` - Feature comparison tables
- `pro-staff.liquid` - Team/ambassador showcase

## JavaScript Architecture

**Pattern:** Vanilla JavaScript with Web Components (Custom Elements API)

**Core Components:**
- `cart-drawer`, `drawer-element`, `modal-element` - Overlays
- `quantity-input`, `product-recommendations` - Product features
- `sticky-header`, `custom-navigation` - Navigation
- `accordion-details`, `dropdown-element` - UI elements
- `loading-bar`, `animate-element` - Feedback/animation

**Global Config:** `window.theme` object initialized via `js-variables.liquid`

## CSS Architecture

**System:** CSS Custom Properties generated from theme settings

**Variables Categories:**
- Colors: `--color-base-*`, `--color-button-*`, `--color-drawer-*`
- Typography: `--font-heading-family`, `--font-body-family`
- Spacing: `--sp-1` through `--sp-100` (0.25rem to 32rem)
- Layout: `--page-width`, `--page-padding`
- Rounding: `--rounded-button`, `--rounded-card`

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px+
- Desktop: 1024px+
- Large: 1280px+

## Development Notes

**Section Schema Pattern:**
```liquid
{% schema %}
{
  "name": "Section Name",
  "settings": [...],
  "blocks": [...],
  "presets": [...]
}
{% endschema %}
```

**Liquid Syntax:**
- Logic: `{%- liquid ... -%}` (whitespace-trimmed)
- Output: `{{ variable }}`
- Include: `{% render 'snippet-name', param: value %}`
- Asset: `{{ 'file.css' | asset_url }}`
- Translation: `{{ 'key.path' | t }}`

**Block Naming:**
- `_` prefix = internal/helper blocks (`_counter.liquid`, `_accordion-row.liquid`)
- Regular blocks are user-facing in theme editor

## Multi-Project Usage

BODE is designed as a GitHub template for multiple Shopify projects.

**For new projects:**
```bash
# Create from template
gh repo create project-name --template bodenburgc/BODE-shopify
cd project-name

# Add upstream for framework updates
git remote add upstream https://github.com/bodenburgc/BODE-shopify.git

# Pull framework updates (periodic)
git fetch upstream
git merge upstream/main
```

**Project-specific files (customize per brand):**
- `config/settings_data.json` - Theme settings values
- `sections/*-group.json` - Header/footer configuration
- `templates/index.json` - Homepage layout
- `.docs/brand/` - Brand guidelines

## Third-Party Integrations

| Integration | Files |
|-------------|-------|
| Google Maps | `sections/dealer-locator.liquid`, `assets/dealer-locator.js` |
| PhotoSwipe | `assets/photoswipe.min.js` - Image galleries |

## Important Constraints

1. **Never edit `config/settings_data.json` manually** - Auto-generated by Shopify admin
2. **Test locally first** - `shopify theme dev` before any `theme push`
3. **English only** - Non-English locale files have been removed
4. **Mobile-first** - Design for mobile, enhance for desktop
