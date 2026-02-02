# Feature: Product Add-on Picker (Pocket Clip System)

## Overview

A reusable add-on product system that allows merchants to offer optional products (like pocket clips) on product pages. Customers select from linked add-on products, choose variants (colors), and both products are added to cart together.

**Origin:** Built for KeyBar pocket clips, but designed as a reusable BODE framework feature.

---

## Business Requirements

### KeyBar Use Case

KeyBar products can have optional pocket clips:

| Clip Type | Colors | Pricing |
|-----------|--------|---------|
| Regular Pocket Clip | Plain, Blackwashed, Blue, Bronze, Fuchsia | Plain = $0 (included), Colors = +$3 |
| Deep Carry Clip 3.0 | Plain 3.0, Blackwashed 3.0, Blue 3.0, Bronze 3.0, Fuchsia 3.0 | Plain = +$20.76, Colors = +$23.76 |

### Customer Flow

1. Customer views KeyBar product ($51.95)
2. Add-on section shows dropdown: "Regular Pocket Clip" (default) or "Deep Carry Clip 3.0"
3. Color swatches appear based on selection
4. Price indicator shows cost per swatch (+$0, +$3, +$20.76, etc.)
5. "Add to Cart" adds BOTH the KeyBar AND the selected clip variant
6. Cart shows two line items with individual prices

---

## Technical Architecture

### Files to Create (in BODE-shopify)

```
BODE-shopify/
├── snippets/
│   └── product-addon-picker.liquid     # Main UI component
├── assets/
│   ├── product-addon.js                # Web Component logic
│   └── product-addon.css               # Styles
├── sections/
│   └── main-product.liquid             # MODIFY: Add block type
└── locales/
    └── en.default.json                 # MODIFY: Add translations
```

### Metafield Definitions (Shopify Admin)

| Name | Namespace.Key | Type | Purpose |
|------|---------------|------|---------|
| Enable Clip Add-on | `custom.enable_clip_add_on` | Boolean | Toggle feature per product |
| Clip Add-on Products | `custom.clip_addon_products` | List of products | Linked add-on products (order = display order) |
| Clip Add-on Title | `custom.clip_addon_title` | Single line text | Section heading (default: "Pocket Clip") |
| Clip Add-on Description | `custom.clip_addon_description` | Multi-line text | Helper text below title |

### Product Setup (Shopify Admin)

**Product 1: Regular Pocket Clip**
- Variants: Plain ($0), Blackwashed ($3), Blue ($3), Bronze ($3), Fuchsia ($3)
- Option name: "Color"
- Each variant needs an image for swatches
- Can be hidden from collections (sold only as add-on)

**Product 2: Deep Carry Clip 3.0**
- Variants: Plain 3.0 ($20.76), Blackwashed 3.0 ($23.76), Blue 3.0 ($23.76), Bronze 3.0 ($23.76), Fuchsia 3.0 ($23.76)
- Option name: "Color"
- Each variant needs an image for swatches

---

## Component Behavior

### `<product-addon>` Web Component

**Responsibilities:**
- Listen to product dropdown changes → show/hide variant containers
- Listen to swatch selections → update hidden input with variant ID
- Update price display based on selection
- Expose `getCartData()` method for cart submission

**Events Dispatched:**
- `addon:product-changed` - When dropdown selection changes
- `addon:variant-changed` - When swatch selection changes

### Cart Integration

The JavaScript intercepts the main product form submission:
1. Gets main product variant ID from form
2. Gets add-on variant ID from `<product-addon>` component
3. Submits both as `items[]` array to `/cart/add.js`
4. Updates cart drawer with combined results

---

## Theme Editor Integration

Merchants add the feature via Theme Editor:
1. Customize → Product page template
2. Add block → "Add-on picker"
3. Position in product info area
4. Save

The block only renders if the product has `custom.enable_clip_addon = true` AND has products in `custom.clip_addon_products`.

---

## Future Enhancements

- [ ] Support for multiple add-on sections (not just clips)
- [ ] Quantity selector for add-ons
- [ ] Bundle discount when add-on selected
- [ ] "None" option to explicitly skip add-on
- [ ] Convert to Theme App Extension for cross-theme reusability

---

## Implementation Status

| Task | Status |
|------|--------|
| Create `product-addon-picker.liquid` | Done |
| Create `product-addon.js` | Done |
| Create `product-addon.css` | Done |
| Modify `main-product.liquid` (add block) | Done |
| Add translations | Done |
| Push BODE to GitHub | Done |
| Pull upstream to keybar-2026 | Done |
| Create clip products in Shopify | **NEXT** |
| Create metafield definitions | Pending |
| Configure KeyBar products | Pending |
| Add block in Theme Editor | Pending |
| Test end-to-end | Pending |

## Resume Point (2026-01-24)

**Code is complete and deployed to both repos.**

Next steps are all in Shopify Admin (keybarus.myshopify.com):

1. Create metafield definitions (4 total - see "Metafield Setup" section above)
2. Create "Regular Pocket Clip" product with 5 variants
3. Create "Deep Carry Clip 3.0" product with 5 variants
4. On KeyBar products, set `custom.enable_clip_addon = true` and link clip products
5. In Theme Editor, add "Add-on picker" block to product page template
6. Test checkout flow
