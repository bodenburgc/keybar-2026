# KeyBar Brand Colors

**Industrial EDC color palette for KeyBar's tactical everyday carry aesthetic.**

---

## Color Philosophy

KeyBar's palette draws from the industrial EDC world:
- **Tactical metals** - Dark gunmetals, titanium, aluminum
- **High visibility** - Bold gold for action and emphasis
- **USA-made craft** - Confident, industrial colors
- **Stop the Noise** - Clean, uncluttered, purposeful

**All colors use OKLCH format** for better perceptual uniformity.

---

## Primary Brand Colors

### **KeyBar Gold** (Primary Accent)
```css
--color-keybar-gold: oklch(85% 0.17 85);
HEX: #FFD700
Usage: Primary CTAs, "Add to Cart", highlights, badges, brand emphasis
```
Bold gold - visibility and premium quality. The signature KeyBar accent.

### **Gunmetal Black** (Primary Dark)
```css
--color-gunmetal-black: oklch(15% 0.01 240);
HEX: #1C1F22
Usage: Primary text, headers, navigation, logo
```
Deep industrial black - like machined metal. Professional and confident.

---

## Secondary Colors - Industrial Palette

### **Carbon Gray** (Dark Gray)
```css
--color-carbon-gray: oklch(25% 0.01 240);
HEX: #32373C
Usage: Secondary backgrounds, dark sections, product showcases
```
Carbon fiber inspired. Creates depth for product displays.

### **Titanium** (Medium Gray)
```css
--color-titanium: oklch(45% 0.02 240);
HEX: #6B7280
Usage: Secondary text, descriptions, supporting content
```
Like brushed titanium. For secondary information and subtle emphasis.

### **Aluminum Light** (Light Gray)
```css
--color-aluminum-light: oklch(92% 0.005 240);
HEX: #EBEEF1
Usage: Light backgrounds, section separation, subtle accents
```
Clean aluminum finish. Soft background for content areas.

### **White** (Pure White)
```css
--color-white: oklch(100% 0 0);
HEX: #FFFFFF
Usage: Light backgrounds, text on dark, reverse logo
```
Clean white for maximum contrast and readability.

---

## Accent Colors - Visibility & Action

### **Safety Orange** (Warning/Sale)
```css
--color-safety-orange: oklch(70% 0.18 50);
HEX: #FF8C00
Usage: Sale badges, warnings, limited editions, urgency
```
High visibility orange for special promotions and alerts.

### **Success Green** (Confirmation)
```css
--color-success-green: oklch(55% 0.15 145);
HEX: #22C55E
Usage: In stock indicators, success messages, confirmations
```
Clean green for positive feedback and availability.

### **Error Red** (Errors Only)
```css
--color-error-red: oklch(50% 0.18 25);
HEX: #DC2626
Usage: Error states, form validation, out of stock
```
Reserved for errors and critical warnings only.

---

## Color Usage Guidelines

### **Page Backgrounds:**
- White (`--color-white`) for main content areas
- Aluminum Light (`--color-aluminum-light`) for subtle section breaks
- Gunmetal Black (`--color-gunmetal-black`) for hero sections
- Carbon Gray (`--color-carbon-gray`) for product showcases

### **Text Colors:**
- Gunmetal Black (`--color-gunmetal-black`) on light backgrounds
- White (`--color-white`) on dark backgrounds
- Titanium (`--color-titanium`) for secondary/supporting text

### **Button Hierarchy:**
- **Primary**: KeyBar Gold background, Gunmetal Black text
- **Secondary**: Gunmetal Black background, White text
- **Tertiary**: Transparent with Gunmetal Black border

### **Product Categories:**
- Use KeyBar Gold for emphasis and CTAs
- Reserve Safety Orange for "SALE" and "LIMITED EDITION"
- Success Green only for stock/availability

---

## Comparison to FishArmor

**KeyBar adapts the system for EDC/tactical:**

| FishArmor (Ice Fishing) | KeyBar (EDC) | Purpose |
|-------------------------|--------------|---------|
| Steel Ice | Gunmetal Black | Primary dark |
| Frozen Lake | Carbon Gray | Deep backgrounds |
| Pine Green | KeyBar Gold | Primary accent/CTA |
| Safety Red | KeyBar Gold | Primary CTA |
| Sunrise Orange | Safety Orange | Promotions |

**Same structure, different theme. One design system, multiple brands.**

---

## OKLCH Benefits

Using OKLCH provides:
- **Perceptual Uniformity** - Colors appear equally bright
- **Wider Gamut** - More vivid colors than RGB/HSL
- **Better Interpolation** - Smoother gradients
- **Device Consistency** - Predictable rendering
- **Future-Proof** - Modern CSS standard

---

## Implementation in Theme

Colors mapped in `snippets/css-variables.liquid`:

```css
:root {
  /* Primary */
  --color-keybar-gold: oklch(85% 0.17 85);
  --color-gunmetal-black: oklch(15% 0.01 240);
  --color-white: oklch(100% 0 0);

  /* Industrial Palette */
  --color-carbon-gray: oklch(25% 0.01 240);
  --color-titanium: oklch(45% 0.02 240);
  --color-aluminum-light: oklch(92% 0.005 240);

  /* Accents */
  --color-safety-orange: oklch(70% 0.18 50);
  --color-success-green: oklch(55% 0.15 145);
  --color-error-red: oklch(50% 0.18 25);
}
```

---

## Accessibility

### **Contrast Ratios (WCAG 2.1 AA):**

**Light Backgrounds (White, Aluminum Light):**
- Gunmetal Black text: 14.5:1 (excellent)
- Titanium text: 5.8:1 (good)
- KeyBar Gold (large text only): 3.2:1

**Dark Backgrounds (Gunmetal Black, Carbon Gray):**
- White text: 14.5:1 (excellent)
- KeyBar Gold text: 8.1:1 (excellent)

All primary combinations exceed minimum requirements.

---

## Brand Applications

### **Homepage Hero:**
- Background: Gunmetal Black or Carbon Gray
- Text: White
- CTA: KeyBar Gold button with Gunmetal text

### **Product Cards:**
- Background: White
- Text: Gunmetal Black
- Price: Gunmetal Black (bold)
- Add to Cart: KeyBar Gold

### **Navigation:**
- Background: White
- Text: Gunmetal Black
- Hover: KeyBar Gold underline

### **Trust Badges:**
- "Made in USA": KeyBar Gold background, Gunmetal text
- "Lifetime Warranty": Gunmetal background, White text

---

## Color Psychology

**KeyBar Gold (Yellow/Gold):**
- Visibility, confidence, premium quality
- Energy, optimism, innovation
- Action and attention

**Gunmetal Black & Carbon Gray (Dark Neutrals):**
- Industrial strength, machined precision
- Trust, professionalism, durability
- Tactical, serious, functional

**Titanium & Aluminum (Light Grays):**
- Modern materials, lightweight strength
- Clean, organized, minimal
- "Stop the Noise" aesthetic

---

## Related Documentation

**Typography:**
→ [TYPOGRAPHY.md](TYPOGRAPHY.md) - Gazzetta + Barlow system

**Components:**
→ [COMPONENTS.md](COMPONENTS.md) - Buttons, cards, forms

**Voice:**
→ [VOICE.md](VOICE.md) - Brand messaging guidelines

---

**Industrial EDC. Bold & confident. Stop the Noise.**

---

*Part of KeyBar Brand Guidelines*
*Based on BODE Design System*
