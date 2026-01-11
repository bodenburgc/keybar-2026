# KeyBar - Brand Components

## Component Patterns

### Buttons

**Primary Button (CTA) - KeyBar Gold**
```css
.btn-primary {
  background: var(--color-keybar-gold); /* #FFD700 */
  color: var(--color-gunmetal-black);
  padding: 16px 32px;
  font-family: var(--font-body-semi);
  font-size: var(--font-size-base);
  font-weight: 600;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary:hover {
  background: oklch(80% 0.17 85); /* Slightly darker gold */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px oklch(85% 0.17 85 / 0.4);
}
```

**Secondary Button - Gunmetal**
```css
.btn-secondary {
  background: var(--color-gunmetal-black); /* #1C1F22 */
  color: var(--color-white);
  padding: 16px 32px;
  font-family: var(--font-body-semi);
  font-size: var(--font-size-base);
  font-weight: 600;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-secondary:hover {
  background: var(--color-carbon-gray); /* Lighter */
}
```

**Tertiary Button (Outline)**
```css
.btn-tertiary {
  background: transparent;
  color: var(--color-gunmetal-black);
  padding: 16px 32px;
  font-family: var(--font-body-semi);
  font-size: var(--font-size-base);
  font-weight: 600;
  border: 2px solid var(--color-gunmetal-black);
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-tertiary:hover {
  background: var(--color-gunmetal-black);
  color: var(--color-white);
}
```

---

### Product Cards

**Standard Product Card**
```html
<div class="product-card">
  <div class="card-image">
    <img src="product.jpg" alt="Product Name">
    <span class="badge-new">NEW</span>
  </div>
  <div class="card-content">
    <h3 class="product-name">ALUMINUM KEYBAR</h3>
    <p class="product-spec">Holds 12 Keys • Titanium Clip</p>
    <p class="product-price">$65.00</p>
    <button class="btn-primary">Add to Cart</button>
  </div>
</div>
```

**Card Styling:**
```css
.product-card {
  background: var(--color-white);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px oklch(15% 0.01 240 / 0.1);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px oklch(15% 0.01 240 / 0.15);
}

.card-image {
  position: relative;
  background: var(--color-aluminum-light);
  padding: 32px;
  aspect-ratio: 4 / 3;
}

.badge-new {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--color-keybar-gold);
  color: var(--color-gunmetal-black);
  padding: 8px 16px;
  font-family: var(--font-body-semi);
  font-size: var(--font-size-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-content {
  padding: 24px;
}

.product-name {
  font-family: var(--font-headline);
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-gunmetal-black);
  margin-bottom: 8px;
  text-transform: uppercase;
}

.product-spec {
  font-family: var(--font-body-semi);
  font-size: var(--font-size-sm);
  color: var(--color-titanium);
  margin-bottom: 16px;
}

.product-price {
  font-family: var(--font-body);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gunmetal-black);
  margin-bottom: 16px;
}
```

---

### Specification Tables

```css
.spec-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body-semi);
  font-size: var(--font-size-sm);
}

.spec-table th {
  background: var(--color-gunmetal-black);
  color: var(--color-white);
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.spec-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-aluminum-light);
}

.spec-table tr:hover {
  background: var(--color-aluminum-light);
}

.spec-label {
  font-weight: 600;
  color: var(--color-gunmetal-black);
}

.spec-value {
  color: var(--color-titanium);
}
```

---

### Badges & Tags

**NEW Badge**
```css
.badge-new {
  background: var(--color-keybar-gold);
  color: var(--color-gunmetal-black);
  padding: 8px 16px;
  font-family: var(--font-body-semi);
  font-size: var(--font-size-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: inline-block;
}
```

**SALE Badge**
```css
.badge-sale {
  background: var(--color-safety-orange);
  color: var(--color-white);
  padding: 8px 16px;
  font-family: var(--font-body-semi);
  font-size: var(--font-size-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: inline-block;
}
```

**USA Made Badge**
```css
.badge-usa {
  background: var(--color-gunmetal-black);
  color: var(--color-white);
  padding: 8px 16px;
  font-family: var(--font-body-semi);
  font-size: var(--font-size-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: inline-block;
}
```

---

### Navigation

**Primary Navigation (Header)**
```css
.main-nav {
  background: var(--color-white);
  border-bottom: 1px solid var(--color-aluminum-light);
  padding: 16px 0;
}

.nav-link {
  color: var(--color-gunmetal-black);
  font-family: var(--font-body-semi);
  font-size: var(--font-size-base);
  font-weight: 600;
  padding: 12px 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--color-keybar-gold);
}

.nav-link.active {
  color: var(--color-keybar-gold);
  border-bottom: 3px solid var(--color-keybar-gold);
}
```

---

### Trust Badges

**Lifetime Guarantee**
```html
<div class="trust-badge">
  <span class="trust-icon">✓</span>
  <span class="trust-text">Lifetime Guarantee</span>
</div>
```

```css
.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-gunmetal-black);
  color: var(--color-white);
  padding: 12px 20px;
  font-family: var(--font-body-semi);
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.trust-icon {
  color: var(--color-keybar-gold);
  font-size: var(--font-size-lg);
}
```

**Made in USA**
```css
.trust-badge-usa {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-keybar-gold);
  color: var(--color-gunmetal-black);
  padding: 12px 20px;
  font-family: var(--font-body-semi);
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

### Category Headers

```css
.category-header {
  font-family: var(--font-headline);
  font-size: var(--font-size-5xl);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--color-gunmetal-black);
}

.category-header-gold {
  color: var(--color-keybar-gold);
}
```

---

### Form Inputs

```css
.form-input {
  width: 100%;
  padding: 16px;
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  color: var(--color-gunmetal-black);
  background: var(--color-white);
  border: 2px solid var(--color-aluminum-light);
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-keybar-gold);
}

.form-input::placeholder {
  color: var(--color-titanium);
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-family: var(--font-body-semi);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gunmetal-black);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

**Related Documentation:**
- See [`COLORS.md`](COLORS.md) for component colors
- See [`TYPOGRAPHY.md`](TYPOGRAPHY.md) for component typography
- See [`VOICE.md`](VOICE.md) for component copy

---

*Part of KeyBar Brand Guidelines*
*Based on BODE Design System*
