# KeyBar Site Audit - Pre-Launch Review

**Date:** January 12, 2026
**Store:** keybarus.myshopify.com

---

## CRITICAL - FishArmor Remnants (Must Fix Before Launch)

### 1. Favicon
**File:** `config/settings_data.json` line 18
```
"favicon": "shopify://shop_images/fisharmor_favicon.png"
```
**Action:** Upload KeyBar favicon to Shopify Files and update in Theme Settings > Logo

### 2. Password Page
**File:** `templates/password.json` line 34
```
"We're putting the finishing touches on our new FishArmor store."
```
**Action:** Change to "KeyBar store"

### 3. 404 Page Text
**File:** `locales/en.default.json` lines 37-39
```
"subtext_html": "This page seems to have drifted off the ice..."
"continue_shopping": "Shop FishArmor Shuttles"
```
**Action:** Update to KeyBar-appropriate language (EDC themed, not ice fishing)

### 4. Gift Card Text
**File:** `locales/en.default.json` lines 608, 612-613
```
"subtext": "Your FishArmor gift card is ready!"
"redeem": "...protect your investment."
"shop_link": "Shop FishArmor"
```
**Action:** Change to "KeyBar" throughout

### 5. Newsletter Popup
**File:** `sections/overlay-group.json` lines 53, 89
```
"text": "<p>Join the Fish Armor crew</p>"
"text": "<p>Be first to know about new shuttles, poles, and accessories..."
```
**Action:** Update to KeyBar EDC language

### 6. Cart Drawer - Empty Cart Collections
**File:** `sections/overlay-group.json` lines 32-35
```
"empty_cart_collections": ["shuttles", "accessories"]
```
**Action:** Update to KeyBar collection handles (e.g., "keybars", "inserts")

### 7. Product Page - Fish Armor Shelf Logic
**File:** `sections/main-product.liquid` lines 553-758
Contains entire JavaScript module for "Fish Armor Shelf" auto-add functionality.
**Action:** Remove this entire code block (lines 549-760) - not applicable to KeyBar

### 8. Dealer Locator Default Text
**File:** `sections/dealer-locator.liquid` line 304
```
"default": "<p>Enter your ZIP code or city to find authorized FishArmor dealers..."
```
**Action:** Change default to KeyBar

### 9. Pro Staff Section
**File:** `sections/pro-staff.liquid` lines 386, 505, 511
```
"Ice fishing experts who trust FishArmor"
"Ice Fishing Legend - Guide - TV Host"
"Ice fishing expert with 20+ years on Minnesota lakes"
```
**Action:** Update defaults or remove section if not using

---

## HIGH PRIORITY - Backend/Config Files

### 10. Theme Info (settings_schema.json)
Lines 4-8:
```
"theme_name": "FishArmor 2024"
"theme_author": "FishArmor"
"theme_documentation_url": "https://fisharmor.com"
"theme_support_url": "https://fisharmor.com/support"
```
**Action:** Update to KeyBar info

### 11. Font Comments
**Files:** `config/settings_schema.json`, `assets/fonts.css`, `snippets/css-variables.liquid`
Various comments reference "FishArmor fonts"
**Action:** Update comments to KeyBar (low priority, not customer-facing)

### 12. Product Recommendations - Shuttle Logic
**File:** `sections/product-recommendations.liquid` lines 21-94
Contains logic checking for "shuttle" products and compatibility tags
**Action:** Review if this logic is needed for KeyBar or can be simplified

---

## QUESTIONS FOR JESS

### Content Questions
1. **Pro Staff Section** - Does KeyBar have ambassadors/pro staff to feature? The section exists but has FishArmor defaults.

2. **Newsletter Popup** - Current image is `Pro-Lite-Series.jpg` (FishArmor product). What KeyBar image should replace it?

3. **Empty Cart Collections** - When cart is empty, which collections should be suggested? Currently shows "shuttles" and "accessories".

4. **Age Verifier** - Currently disabled. Does KeyBar need age verification for any products?

### Page Questions
5. **Contact Page** - Template was deleted (0 pages assigned). Should we create a custom contact template or use the default page layout?

6. **Warranty Page** - Template was deleted (0 pages assigned). Does KeyBar have warranty info that needs a custom layout?

7. **Dealers Page** - Template was deleted (0 pages assigned). The dealer locator (`page.dealers.json`) should be assigned to the "Find a Dealer" page - is this correct?

### SEO Questions
8. **Meta Descriptions** - Are there specific meta descriptions for key pages (homepage, collections, products)?

9. **Social Sharing Image** - What image should appear when pages are shared on social media?

---

## WORKING CORRECTLY

### Header
- Announcement bar: KeyBar branded (FREE SHIPPING, STOP THE NOISE, LIFETIME GUARANTEE)
- Logo: KeyBar logo properly configured
- Navigation: Uses main-menu-1

### Footer
- Brand text: Correct (Savannah, GA since 2013, lifetime guarantee)
- Copyright: "KeyBar is a registered trademark. Made with pride in Savannah, GA."
- Social links: Facebook, Twitter/X, Instagram, YouTube configured

### Social Links (settings_data.json)
- Facebook: https://www.facebook.com/thekeybar
- Twitter: https://x.com/The_KEYBAR
- Instagram: https://www.instagram.com/keybar
- YouTube: https://www.youtube.com/channel/UClYZe_8Sph3ydAVhLlRqQgw

### Page Templates Created
- `page.about.json` - About page with gallery
- `page.faqs.json` - FAQ categories
- `page.setup-care.json` - Assembly & care instructions
- `page.dealer-info.json` - Become a Dealer

### Colors
- Primary: #FFD700 (KeyBar Gold)
- Text: #1C1F22 (Dark)
- Background: #FFFFFF / #EBEEF1

---

## RECOMMENDED FIXES SUMMARY

| Priority | Count | Category |
|----------|-------|----------|
| Critical | 9 | Customer-facing FishArmor content |
| High | 3 | Backend/config files |
| Questions | 9 | Need Jess input |

**Estimated time to fix critical issues:** 1-2 hours

---

## FILES TO EDIT

| File | Issue | Lines |
|------|-------|-------|
| `config/settings_data.json` | Favicon | 18 |
| `templates/password.json` | FishArmor text | 34 |
| `locales/en.default.json` | 404 & gift card text | 37-39, 608-613 |
| `sections/overlay-group.json` | Newsletter popup | 53, 89, 32-35 |
| `sections/main-product.liquid` | Fish Armor Shelf code | 549-760 |
| `sections/dealer-locator.liquid` | Default text | 304 |
| `sections/pro-staff.liquid` | Ice fishing text | 386, 505, 511 |
| `config/settings_schema.json` | Theme info | 4-8 |
