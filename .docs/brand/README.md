# KeyBar Brand Guidelines

**Quick reference guide for KeyBar brand identity and design system.**

This design system provides comprehensive guidance for maintaining brand consistency across the KeyBar Shopify store built with the BODE theme framework.

---

## Quick Navigation

### Brand Foundations
- **[Brand Voice](VOICE.md)** - "Stop the Noise" personality, tone, messaging
- **[Colors](COLORS.md)** - Industrial EDC palette (KeyBar Gold, Gunmetal, etc.)
- **[Typography](TYPOGRAPHY.md)** - Gazzetta + Barlow fluid type system

### UI Elements
- **[Components](COMPONENTS.md)** - Buttons, cards, forms, navigation patterns

---

## Quick Reference by Task

**"What colors can I use?"**
→ [COLORS.md](COLORS.md) - Industrial palette (KeyBar Gold, Gunmetal Black, Titanium)

**"What fonts and sizes?"**
→ [TYPOGRAPHY.md](TYPOGRAPHY.md) - Gazzetta (headlines) + Barlow (body)

**"How do I build a button?"**
→ [COMPONENTS.md](COMPONENTS.md#buttons) - KeyBar Gold CTAs, Gunmetal secondary

**"What's the tone of voice?"**
→ [VOICE.md](VOICE.md) - "Stop the Noise", confident, technical, USA-made

---

## Brand at a Glance

### Core Messages
- **Primary**: "Stop the Noise" - declutter, simplify, organize
- **Secondary**: "Keep It Together" - functional, practical
- **Origin**: USA-made in Savannah, Georgia

### Color Palette
| Color | Use |
|-------|-----|
| KeyBar Gold (#FFD700) | Primary CTAs, highlights, badges |
| Gunmetal Black (#1C1F22) | Text, headers, secondary buttons |
| Titanium (#6B7280) | Secondary text |
| Aluminum Light (#EBEEF1) | Backgrounds |

### Typography
- **Headlines**: Gazzetta Bold, uppercase
- **Body**: Barlow family (300-700 weights)
- **Scale**: Fluid with clamp() - no media queries needed

### Product Categories
- KeyBars (main organizers)
- Tool Inserts (fit inside KeyBars)
- Gear/Accessories (standalone products)
- Limited Editions (special releases)

---

## For Developers

**Implementation Files:**
- **CSS Variables**: `snippets/css-variables.liquid`
- **JS Variables**: `snippets/js-variables.liquid`
- **Sections**: `sections/*.liquid`
- **Templates**: `templates/*.json`

**Quick Start:**
1. Read [COLORS.md](COLORS.md) + [TYPOGRAPHY.md](TYPOGRAPHY.md)
2. Review [COMPONENTS.md](COMPONENTS.md) for common patterns
3. Understand BODE framework (see `CLAUDE.md` in repo root)
4. Use `shopify theme dev` for local development

---

## For Content Writers

**Brand Voice:**
- Read [VOICE.md](VOICE.md) first (most important!)
- See [COMPONENTS.md](COMPONENTS.md) for UI copy patterns

**Writing Guidelines:**
- ✅ Active, confident language
- ✅ Specific about materials (6061-T6 aluminum, Grade 5 titanium)
- ✅ USA manufacturing emphasis (Savannah, Georgia)
- ✅ "Stop the Noise" benefits (organization, simplification)
- ❌ Avoid marketing hyperbole ("Ultimate!", "Revolutionary!")
- ❌ Don't use tacti-cool or unnecessary military jargon

**Value Propositions:**
- Primary: "Stop the Noise" - eliminate jingle and bulk
- Secondary: USA-Made, Premium Materials, Modular System
- Supporting: Lifetime guarantee, Technical specifications, EDC community

---

## File Structure

```
.docs/brand/
├── README.md           # ← You are here
├── VOICE.md            # Personality, tone, messaging
├── COLORS.md           # Industrial OKLCH palette
├── TYPOGRAPHY.md       # Gazzetta + Barlow system
└── COMPONENTS.md       # Buttons, cards, badges
```

---

## KeyBar vs. FishArmor

**Same BODE Foundation:**
- Typography system (Gazzetta + Barlow)
- Layout system (containers, grids, spacing)
- Component patterns (buttons, cards, navigation)
- Design principles (consistency, accessibility)

**KeyBar Adaptations:**
- **Colors**: Industrial EDC theme (Gold, Gunmetal) vs. Ice fishing (Steel Ice, Safety Red)
- **Context**: EDC/everyday carry vs. ice fishing
- **Products**: Key organizers vs. protective shuttles
- **Messaging**: "Stop the Noise" vs. "Protect Your Investment"
- **Location**: Savannah, GA vs. Minnesota

---

## Design System Principles

**1. Consistency**
- Use established BODE patterns
- Follow brand guidelines for all new content
- Maintain visual hierarchy

**2. Accessibility**
- WCAG 2.1 AA minimum
- 4.5:1 contrast for body text
- Large touch targets for mobile (48x48px)

**3. Performance**
- Mobile-first responsive design
- Optimized images
- Fast page loads

**4. Brand Authenticity**
- Real product photography
- Technical accuracy (specifications matter to EDC users)
- Confident, industrial tone

---

## Related Documentation

**KeyBar Project:**
- `/CLAUDE.md` (repo root) - Complete project context
- `/README.md` (repo root) - Project overview

**BODE Framework:**
- `/Users/cbodenburg/Sites/BODE-shopify/CLAUDE.md` - Framework documentation
- `upstream` git remote - Pull framework updates

---

**Design System Version**: 1.0
**Platform**: Shopify + BODE Theme Framework
**Brand**: KeyBar - "Stop the Noise"

---

*KeyBar Brand Guidelines*
*Based on BODE Design System*
