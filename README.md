# BODE

A modern Shopify theme framework designed for deployment across multiple client projects.

## Quick Start

```bash
# Clone
git clone https://github.com/bodenburgc/BODE-shopify.git
cd BODE-shopify

# Development
shopify theme dev

# Deploy
shopify theme push
```

## For New Projects

Use BODE as a template for new Shopify stores:

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

## Documentation

See [CLAUDE.md](CLAUDE.md) for detailed architecture and development guidelines.

## License

Private - BODE Design
