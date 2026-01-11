# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**KeyBar 2026** - Shopify store for KeyBar EDC (Everyday Carry) key organizers. Built on the BODE theme framework.

| Key Info | Value |
|----------|-------|
| Brand | KeyBar |
| Theme Framework | BODE 1.0.0 |
| Store URL | keybarus.myshopify.com |
| Shopify API | 2024-01 |
| Target Market | EDC enthusiasts, "Stop the Noise" |

## Shopify CLI Commands

```bash
shopify auth login                              # Authenticate (opens browser)
shopify theme dev -s keybarus.myshopify.com     # Local development with hot reload
shopify theme push -s keybarus.myshopify.com    # Deploy to store
shopify theme pull -s keybarus.myshopify.com    # Pull live theme changes
shopify theme check                             # Lint/validate theme
shopify theme share -s keybarus.myshopify.com   # Generate preview link
```

**No build step required** - No npm, webpack, or compilation. CSS/JS are served as-is from `/assets/`.

## Framework Relationship (BODE Upstream)

```
/Users/cbodenburg/Sites/BODE-shopify/    ← Master framework (upstream)
    ↓
/Users/cbodenburg/Sites/keybar-2026/     ← KeyBar-specific customizations (this repo)
```

**BODE is a separate local project.** Framework changes (sections, snippets, core JS/CSS) should be made in BODE-shopify first, then pulled here.

### Git Remotes

```
origin   → https://github.com/bodenburgc/keybar-2026.git      (KeyBar changes)
upstream → https://github.com/bodenburgc/BODE-shopify.git     (Framework updates)
```

### Development Workflow

| Change Type | Where to Make Change |
|-------------|---------------------|
| Bug fix in section/snippet | BODE-shopify → push → pull upstream here |
| New reusable section | BODE-shopify → push → pull upstream here |
| Improve JS/CSS framework | BODE-shopify → push → pull upstream here |
| KeyBar colors/fonts/logos | HERE (keybar-2026) |
| KeyBar homepage layout | HERE (keybar-2026) |
| Brand guidelines | HERE (`.docs/brand/`) |

### Pulling Framework Updates

```bash
git fetch upstream
git merge upstream/main
# Resolve any conflicts in brand-specific files (.gitattributes protects key files)
git push origin main
```

**Protected files (merge=ours via .gitattributes):** `config/settings_data.json`, `templates/index.json`, `sections/*-group.json`, `.docs/brand/*`

## Theme Architecture

### Component Hierarchy

```
layout/theme.liquid
├── sections 'header-group'     → sections/header-group.json
├── sections 'overlay-group'    → sections/overlay-group.json
├── content_for_layout          → templates/*.json → sections/*.liquid
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

### Asset Loading (in layout/theme.liquid)

**Always loaded:** `fonts.css` → `css-variables` → `theme.css` → `vendor.js` → `theme.js`

**Conditionally loaded based on page type:**
- Customer pages: `shopify_common.js`
- RTL languages: `rtl.css`
- Tab attention feature: `tab-attention.js`
- Preload links: `instant-page.js`

**Template-specific assets** (loaded in individual sections):
- `cart.js/css`, `collection.js/css`, `product-bundle.js/css`, `dealer-locator.js/css`, etc.

### Web Components

Interactive features use custom elements:
- `<product-bundle>` - Bundle builder interface
- `<motion-list>` - Animated product grids
- `<sticky-element>` - Sticky sidebars
- `<split-words>` - Text animations
- `<footer-group>` - Footer container

### Key Files

| File | Purpose |
|------|---------|
| `snippets/css-variables.liquid` | Theme settings → CSS custom properties (`:root`) |
| `snippets/js-variables.liquid` | Routes, feature flags → `window.theme` object |
| `config/settings_schema.json` | Theme settings definitions (from BODE) |
| `config/settings_data.json` | Current values (DO NOT edit manually) |
| `locales/en.default.json` | Translation strings |

## KeyBar-Specific Sections

- `product-bundle.liquid` + `product-bundle.js` - Bundle KeyBar + inserts
- `product-comparison.liquid` - Compare KeyBar sizes/materials
- `dealer-locator.liquid` + `dealer-locator.js` - Find retailers (Maps API)
- `compact-product-bundle.liquid` - Simplified bundle UI

## Development Notes

**Section Schema Pattern:**
```liquid
<style>/* section-scoped styles */</style>
{%- liquid
  # Liquid logic here
-%}
<!-- HTML content -->
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
- Translations: `{{ 'key.path' | t }}`
- Assets: `{{ 'filename' | asset_url }}`

## Important Constraints

1. **Never edit `config/settings_data.json` manually** - Auto-generated by Shopify admin
2. **Test locally first** - `shopify theme dev` before any `theme push`
3. **Framework changes go to BODE** - Then pull upstream here
4. **English only** - Non-English locale files have been removed
5. **Mobile-first** - Design for mobile, enhance for desktop
