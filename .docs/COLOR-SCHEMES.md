# Color Scheme System

## Overview

The color scheme system provides three preset color palettes (light, dark, accent) that can be applied to individual sections. Each scheme automatically adjusts text, background, button, and highlight colors.

## Available Color Schemes

| Scheme | Background | Text | Buttons | Best For |
|--------|------------|------|---------|----------|
| `light` | Default theme colors | Default | Default | Standard content sections |
| `dark` | Gunmetal (#1C1F22) | White | Gold with dark text | Feature sections, testimonials |
| `accent` | Gold (#FFD700) | Dark Teal | Dark with white text | CTAs, promotions |

## How to Apply Color Schemes

### 1. Add Setting to Section Schema

```json
{
  "type": "select",
  "id": "color_scheme",
  "label": "Color scheme",
  "options": [
    { "value": "light", "label": "Light" },
    { "value": "dark", "label": "Dark" },
    { "value": "accent", "label": "Accent (Gold)" }
  ],
  "default": "light",
  "info": "Colors defined in Theme Settings > Color schemes"
}
```

### 2. Render in Section's `<style>` Block

```liquid
{%- liquid
  assign scheme = section.settings.color_scheme | default: 'light'
-%}

<style>
  #shopify-section-{{ section.id }} {
    {%- if scheme != 'light' -%}
      {%- render 'color-scheme', scheme: scheme -%}
    {%- endif -%}
  }
</style>
```

**Note:** Only render `color-scheme` if scheme is NOT 'light' (light uses defaults).

## CSS Variables Reference

All colors are stored as RGB values without `rgb()` wrapper:

| Variable | Light | Dark | Accent |
|----------|-------|------|--------|
| `--color-background` | Default | 28, 31, 34 | 255, 215, 0 |
| `--color-foreground` | Default | 255, 255, 255 | 28, 31, 34 |
| `--color-highlight` | Default | 255, 215, 0 | 28, 31, 34 |
| `--color-button-background` | Default | 255, 215, 0 | 28, 31, 34 |
| `--color-button-text` | Default | 28, 31, 34 | 255, 255, 255 |

### Usage in CSS

```css
/* With rgb() wrapper */
background: rgb(var(--color-background));
color: rgb(var(--color-foreground));

/* With opacity */
border-color: rgba(var(--color-highlight), 0.5);
```

## Files Reference

| File | Purpose |
|------|---------|
| `snippets/color-scheme.liquid` | Main snippet—renders CSS variables |
| `snippets/css-variables.liquid` | Global `:root` variables (light defaults) |
| `config/settings_schema.json` | Color picker inputs in Theme Settings |

## Migration Note

Old sections using `use_dark_scheme` checkbox can be migrated:

```liquid
assign scheme = section.settings.color_scheme | default: 'light'
if section.settings.use_dark_scheme and scheme == 'light'
  assign scheme = 'dark'
endif
```
