# KeyBar 2026

Shopify theme for **KeyBar** - premium EDC (everyday carry) key organizers, crafted in the USA.

## Store

- **URL:** TBD
- **Framework:** [BODE](https://github.com/bodenburgc/BODE-shopify)
- **Migration:** From WordPress (71 plugins → Shopify native)

## Quick Start

```bash
# Install Shopify CLI (if needed)
npm install -g @shopify/cli

# Authenticate (update store URL when available)
shopify auth login --store your-store.myshopify.com

# Start local development
shopify theme dev
```

## Commands

| Command | Description |
|---------|-------------|
| `shopify theme dev` | Local development server with hot reload |
| `shopify theme push` | Deploy to store |
| `shopify theme pull` | Pull live theme changes |
| `shopify theme check` | Lint and validate theme |
| `shopify theme share` | Generate preview link |

## Framework Updates

This project uses BODE as its upstream framework. To pull framework improvements:

```bash
git fetch upstream
git merge upstream/main
# Resolve any conflicts in brand-specific files
git push origin main
```

## Project Structure

```
keybar-2026/
├── assets/          # CSS, JS, images
├── blocks/          # Reusable block components
├── config/          # Theme settings
├── layout/          # Theme layouts
├── locales/         # Translations (English only)
├── sections/        # Page sections
├── snippets/        # Reusable Liquid snippets
├── templates/       # Page templates (JSON)
└── .docs/           # Brand documentation
```

## Git Remotes

| Remote | URL | Purpose |
|--------|-----|---------|
| origin | `bodenburgc/keybar-2026` | Push project changes |
| upstream | `bodenburgc/BODE-shopify` | Pull framework updates |

## Documentation

- `CLAUDE.md` - AI assistant guidance
- `.docs/brand/` - Brand guidelines (colors, voice, typography)

## Migration Notes

KeyBar is migrating from WordPress to Shopify. Key considerations:
- URL redirects from old WordPress structure
- Product data migration
- Customer account migration
- SEO preservation
