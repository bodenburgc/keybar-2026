# KeyBar Shopify Store - Site Audit

**Auditor:** Claude
**Date:** January 11, 2026
**Store:** keybarus.myshopify.com
**Theme:** BODE KeyBar (ID: 186764001563)

---

## Executive Summary

The KeyBar Shopify store is well-structured with proper branding in the header, footer, and homepage. However, there are **critical FishArmor remnants** that must be removed before launch, plus several design/content items that need attention.

| Category | Issues Found |
|----------|--------------|
| Critical (FishArmor content) | 5 |
| Design/Content | 4 |
| Minor/Suggestions | 6 |

---

## Critical Issues - FishArmor Remnants

**Status: FIXED** (January 11, 2026)

~~These MUST be fixed before launch:~~

### 1. Favicon Still Shows FishArmor
**File:** `config/settings_data.json` line 18
**Current:** `"favicon": "shopify://shop_images/fisharmor_favicon.png"`
**Fix:** Upload KeyBar favicon and select in Theme Settings > Logo > Favicon
**Status:** Favicon uploaded, needs manual selection in Theme Editor

### 2. Collection Page - FishArmor Promotion Block
**File:** `templates/collection.json` lines 74-110
**Issue:** Active promotion block displaying:
- Heading: "Fish Armor Hooded Sweatshirt"
- Link: `https://fisharmor.itemorder.com/shop/home/`
- Image: FishArmor product image

**Fix:** Remove or replace with KeyBar promotion content
**Status:** FIXED - Replaced with KeyBar "Stop the Noise" promotion (disabled by default)

### 3. Collection Page - Ice Fishing Text (Disabled but Present)
**File:** `templates/collection.json` lines 112-149
**Issue:** Second promotion block with:
- Heading: "Premium Ice Fishing Protection"
- Text about "ice fishing professionals"
- Currently disabled but clutters template

**Fix:** Remove entire block or replace with KeyBar content
**Status:** FIXED - Block removed entirely

### 4. Product Page - FishArmor Holiday Message
**File:** `templates/product.json` lines 85-95
**Issue:** Alert block displaying:
```
"Holiday Shipping Update: We're taking a brief pause... Happy Holidays from the Fish Armor team!"
```

**Fix:** Update to KeyBar branding or remove seasonal message
**Status:** FIXED - Replaced with KeyBar "Lifetime Guarantee" message (disabled by default)

### 5. Product Page - Batteries Collection Reference
**File:** `templates/product.json` lines 729-762
**Issue:** Featured collection section referencing:
- `"collection": "batteries"` (FishArmor product)
- `"heading": "Batteries"`

**Fix:** Change to KeyBar collection (e.g., "inserts" or "gear") or remove section
**Status:** FIXED - Changed to "Tool Inserts" featuring the inserts collection

---

## Design/Content Issues

### 1. Homepage Hero - No Image
**File:** `templates/index.json` hero section
**Issue:** Hero section has no image set, only background color (#1C1F22)
**Impact:** Hero appears as solid dark background with text - lacks visual impact
**Recommendation:** Add a compelling KeyBar product/lifestyle image

### 2. Homepage CTA Banner - No Image
**File:** `templates/index.json` cta_banner section
**Issue:** "KEEP IT TOGETHER" banner has no image, just background color
**Impact:** Less visual interest in mid-page break
**Recommendation:** Add KeyBar lifestyle or product close-up image

### 3. Collection Banner Image
**File:** `templates/collection.json` line 43
**Current:** `"image": "shopify://shop_images/DSC_0488.jpg"`
**Question:** Is this a KeyBar image or FishArmor? Verify this is appropriate KeyBar imagery

### 4. Help Drawer - Generic Placeholder Content
**File:** `templates/product.json` lines 175-248
**Issue:** All help drawer sections contain placeholder text:
```
"Use this text to answer questions in as much detail as possible for your customers."
```
**Recommendation:** Update with actual KeyBar content for:
- Shipping Information
- Customer Support
- FAQ's
- Contact Us

---

## What's Working Well

### Header (header-group.json)
- Announcement bar with KeyBar messaging:
  - "FREE SHIPPING ON ORDERS $75+ | USA MADE IN SAVANNAH, GA"
  - "STOP THE NOISE | Premium Key Organizers & EDC Gear"
  - "LIFETIME GUARANTEE | We Stand Behind Every KeyBar"
- KeyBar Gold background (#FFD700) with Gunmetal text (#1C1F22)
- Gunmetal header (#1C1F22) with white text

### Footer (footer-group.json)
- Value props with KeyBar messaging:
  - KeyBar Support
  - Fast Shipping (mentions Savannah, GA)
  - Lifetime Guarantee
- Brand text properly mentions KeyBar, Savannah, and lifetime guarantee
- Newsletter signup with "Join the EDC Community"
- Copyright: "KeyBar is a registered trademark. Made with pride in Savannah, GA."

### Homepage (index.json)
- Hero: "STOP THE NOISE" messaging
- Value props: USA Made, Lifetime Guarantee, Modular System, Premium Materials
- Featured KeyBars collection
- Collection list: KeyBars, Inserts, Gear
- Featured Inserts collection
- CTA: "KEEP IT TOGETHER"
- New Arrivals section

### Theme Settings (settings_data.json)
- Social links properly configured for KeyBar accounts
- Color scheme applied (Gold #FFD700, Gunmetal #1C1F22)
- Logo references correctly point to shop images

---

## Design Recommendations

### Color Palette
The current color palette is well-suited for KeyBar's industrial/EDC brand:
- **Primary Gold:** #FFD700 - CTAs, highlights
- **Gunmetal Black:** #1C1F22 - Headers, backgrounds
- **Aluminum Light:** #EBEEF1 - Section backgrounds
- **White:** #FFFFFF - Content backgrounds

**Assessment:** Colors are consistent and on-brand.

### Typography
- **Headers:** Neo Sans Bold (good for industrial feel)
- **Body:** Inter (clean, readable)
- **Header Capitalization:** Enabled (appropriate for EDC brand)

**Assessment:** Typography choices work well for the brand.

### Visual Hierarchy
- Homepage flows well from hero > value props > products > categories > CTA > new arrivals
- Good use of alternating background colors (white/gray/dark)
- Consistent padding (80px vertical on major sections)

**Assessment:** Good structure, needs hero/banner images to complete the look.

### Mobile Considerations
- Hero height: 500px (appropriate)
- 2-column product grids on mobile
- Swipe-enabled carousels
- Abbreviated announcement bar text for mobile

**Assessment:** Mobile settings appear appropriate.

---

## Image Requirements

Before launch, the following images are needed:

| Location | Recommended Size | Content Suggestion |
|----------|------------------|-------------------|
| Homepage Hero | 1920x1080 min | KeyBar product array or lifestyle shot |
| CTA Banner | 1920x800 min | Close-up of KeyBar in use or pocket clip |
| Collection Banner | 1920x600 min | Verify current image is KeyBar |
| Favicon | 180x180 | KeyBar "K" mark or icon |

---

## Checklist Summary

### Must Fix Before Launch
- [x] Remove/replace FishArmor promotion in collection.json - **FIXED**
- [x] Remove/replace FishArmor holiday message in product.json - **FIXED**
- [x] Remove/replace batteries collection reference in product.json - **FIXED**
- [ ] Upload and set KeyBar favicon (uploaded, needs Theme Editor selection)
- [ ] Verify collection banner image is KeyBar

### Should Fix Before Launch
- [ ] Add homepage hero image
- [ ] Add CTA banner image
- [ ] Update help drawer placeholder content

### Nice to Have
- [ ] Remove disabled FishArmor promotion blocks entirely
- [ ] Consider adding product FAQ content
- [ ] Consider adding recently viewed section to homepage

---

## Files Modified/To Modify

| File | Status | Changes Needed |
|------|--------|----------------|
| `config/settings_data.json` | Needs favicon update | Via Shopify Admin |
| `templates/collection.json` | Needs FishArmor removal | Edit directly |
| `templates/product.json` | Needs FishArmor removal | Edit directly |
| `templates/index.json` | Needs images | Via Shopify Admin |

---

## Next Steps

1. **Immediate:** Remove all FishArmor content from templates
2. **Before Launch:** Add hero and banner images
3. **Before Launch:** Upload and select KeyBar favicon
4. **Before Launch:** Update help drawer content
5. **Post-Launch:** Consider adding customer reviews section

---

*Audit completed January 11, 2026*
