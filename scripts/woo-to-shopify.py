#!/usr/bin/env python3
"""
WooCommerce to Shopify Product Migration Script
Filters active products, cleans data, and exports Shopify-ready CSV
"""

import csv
import re
import os
from datetime import datetime

# File paths
INPUT_CSV = "/Users/cbodenburg/Downloads/wc-product-export-11-1-2026-1768153925908.csv"
OUTPUT_DIR = "/Users/cbodenburg/Sites/keybar-2026/scripts/output"
OUTPUT_CSV = f"{OUTPUT_DIR}/keybar-shopify-import.csv"
REPORT_FILE = f"{OUTPUT_DIR}/migration-report.txt"

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Shopify CSV headers (standard import format)
SHOPIFY_HEADERS = [
    "Handle", "Title", "Body (HTML)", "Vendor", "Product Category", "Type", "Tags",
    "Published", "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value",
    "Option3 Name", "Option3 Value", "Variant SKU", "Variant Grams",
    "Variant Inventory Tracker", "Variant Inventory Qty", "Variant Inventory Policy",
    "Variant Fulfillment Service", "Variant Price", "Variant Compare At Price",
    "Variant Requires Shipping", "Variant Taxable", "Variant Barcode",
    "Image Src", "Image Position", "Image Alt Text", "Gift Card",
    "SEO Title", "SEO Description", "Variant Image", "Variant Weight Unit", "Status"
]

def clean_handle(name):
    """Convert product name to URL-friendly handle"""
    handle = name.lower().strip()
    handle = re.sub(r'[^a-z0-9\s-]', '', handle)
    handle = re.sub(r'\s+', '-', handle)
    handle = re.sub(r'-+', '-', handle)
    return handle.strip('-')

def clean_title(name):
    """Standardize product title formatting with KeyBar naming conventions"""
    # Remove extra whitespace
    name = ' '.join(name.split())

    # Naming convention fixes
    # 1. "Insert" should come after the product name: "Pick Insert" not "Insert Pick"
    # 2. "KeyBar" is one word with capital B
    # 3. Material comes before product: "Titanium KeyBar" not "KeyBar Titanium"

    # Fix common naming issues
    name = re.sub(r'\bkeybar\b', 'KeyBar', name, flags=re.IGNORECASE)
    name = re.sub(r'\bKey Bar\b', 'KeyBar', name, flags=re.IGNORECASE)
    name = re.sub(r'\bKey-Bar\b', 'KeyBar', name, flags=re.IGNORECASE)

    # Remove redundant words
    name = re.sub(r'\s*-\s*$', '', name)  # Trailing dashes
    name = re.sub(r'^-\s*', '', name)  # Leading dashes
    name = re.sub(r'\s*\(Copy\)\s*', '', name, flags=re.IGNORECASE)
    name = re.sub(r'\s*Copy\s*$', '', name, flags=re.IGNORECASE)

    # Capitalize properly (title case for most words)
    words = name.split()
    cleaned = []

    for word in words:
        word_lower = word.lower()

        # Keep uppercase for acronyms/abbreviations
        if word.isupper() and len(word) <= 4:
            cleaned.append(word)
        # Keep specific brand terms exactly as they should be
        elif word_lower == 'keybar':
            cleaned.append('KeyBar')
        elif word_lower in ['usa', 'edc', 'ti', 'jr']:
            cleaned.append(word.upper())
        elif word_lower in ['and', 'or', 'the', 'a', 'an', 'of', 'for', 'with']:
            cleaned.append(word_lower)
        else:
            cleaned.append(word.title())

    result = ' '.join(cleaned)

    # Final cleanup - capitalize first word always
    if result:
        result = result[0].upper() + result[1:]

    return result

def clean_html(html):
    """Clean up HTML description - remove WordPress blocks and clean formatting"""
    if not html:
        return ""

    # Remove WordPress Gutenberg block comments
    html = re.sub(r'<!--\s*/?wp:[^>]+-->', '', html)
    html = re.sub(r'<!--\s*/wp:[^>]+\s*-->', '', html)

    # Remove empty paragraphs and divs
    html = re.sub(r'<p[^>]*>\s*</p>', '', html)
    html = re.sub(r'<div[^>]*>\s*</div>', '', html)

    # Remove inline styles that reference WordPress classes
    html = re.sub(r'class="[^"]*has-text-align[^"]*"', '', html)
    html = re.sub(r'class="[^"]*wp-[^"]*"', '', html)

    # Remove empty class attributes
    html = re.sub(r'\s*class=""', '', html)

    # Fix common entities
    html = html.replace('&amp;', '&')
    html = html.replace('&nbsp;', ' ')

    # Remove excessive whitespace
    html = re.sub(r'\n\s*\n', '\n', html)
    html = re.sub(r'>\s+<', '><', html)
    html = re.sub(r'\s+', ' ', html)

    # Clean up list items with empty list-style-type
    html = re.sub(r'style="list-style-type:\s*none;?"', '', html)
    html = re.sub(r'\s*style=""', '', html)

    # Convert old WooCommerce URLs to relative paths
    html = re.sub(r'https?://www\.keybar\.us/product/', '/products/', html)
    html = re.sub(r'https?://www\.keybar\.us/product-category/', '/collections/', html)

    # Remove literal \n characters - HTML doesn't need them
    html = html.replace('\\n', ' ')
    html = html.replace('\n', ' ')

    # Clean up multiple spaces
    html = re.sub(r' +', ' ', html)

    return html.strip()

def map_category_to_type(categories, name=''):
    """Map WooCommerce categories to Shopify product types"""
    if not categories:
        categories = ''

    cats_lower = categories.lower()
    name_lower = name.lower()

    # Check product name first for more accurate typing
    if 'keybar' in name_lower and 'insert' not in name_lower:
        if 'jr' in name_lower or 'junior' in name_lower:
            return "KeyBar JR"
        return "KeyBar"

    # Check categories
    if 'jr size keybar' in cats_lower or 'junior' in cats_lower:
        return "KeyBar JR"
    elif 'full size keybar' in cats_lower:
        return "KeyBar"
    elif 'limited edition' in cats_lower:
        return "KeyBar Limited"
    elif 'keybar' in cats_lower and 'insert' not in cats_lower:
        return "KeyBar"
    elif 'insert' in name_lower or 'insert' in cats_lower:
        return "Insert"
    elif 'hardware' in cats_lower or 'parts' in cats_lower:
        return "Parts"
    elif 'gear' in cats_lower or 'cool gear' in cats_lower:
        return "Gear"
    elif 'apparel' in cats_lower or 'clothing' in cats_lower:
        return "Apparel"
    else:
        return "Gear"  # Default to Gear instead of Other

def extract_tags(categories, tags):
    """Combine categories and tags into Shopify tags"""
    all_tags = []

    # Add categories as tags
    if categories:
        for cat in categories.split(', '):
            cat = cat.strip()
            if cat and cat not in ['Uncategorized', 'Drafts']:
                all_tags.append(cat)

    # Add existing tags
    if tags:
        for tag in tags.split(', '):
            tag = tag.strip()
            if tag:
                all_tags.append(tag)

    # Remove duplicates while preserving order
    seen = set()
    unique_tags = []
    for tag in all_tags:
        if tag.lower() not in seen:
            seen.add(tag.lower())
            unique_tags.append(tag)

    return ', '.join(unique_tags)

def parse_images(images_str):
    """Parse WooCommerce image URLs"""
    if not images_str:
        return []
    return [img.strip() for img in images_str.split(', ') if img.strip()]

def process_products():
    """Main processing function"""

    products = []
    variations = {}
    stats = {
        'total_rows': 0,
        'active_products': 0,
        'draft_products': 0,
        'variations': 0,
        'simple': 0,
        'variable': 0,
        'composite': 0,
        'bundle': 0,
        'skipped_types': [],
        'categories': {},
        'no_sku': 0,
        'no_price': 0,
    }

    # Read WooCommerce CSV
    with open(INPUT_CSV, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)

        for row in reader:
            stats['total_rows'] += 1

            published = row.get('Published', '0')
            product_type = row.get('Type', '').lower()

            # Only process active products
            if published != '1':
                stats['draft_products'] += 1
                continue

            stats['active_products'] += 1

            # Track categories
            categories = row.get('Categories', '')
            for cat in categories.split(', '):
                cat = cat.strip()
                if cat:
                    stats['categories'][cat] = stats['categories'].get(cat, 0) + 1

            # Handle different product types
            if product_type == 'variation':
                stats['variations'] += 1
                parent_sku = row.get('Parent', '')
                if parent_sku not in variations:
                    variations[parent_sku] = []
                variations[parent_sku].append(row)

            elif product_type == 'simple':
                stats['simple'] += 1
                products.append(row)

            elif product_type == 'variable':
                stats['variable'] += 1
                products.append(row)

            elif product_type == 'composite':
                stats['composite'] += 1
                # Convert composite to simple product (Shopify doesn't have composites)
                products.append(row)

            elif product_type == 'yith_bundle':
                stats['bundle'] += 1
                # Skip bundles for now (need manual setup in Shopify)
                stats['skipped_types'].append(f"Bundle: {row.get('Name', 'Unknown')}")

            else:
                stats['skipped_types'].append(f"{product_type}: {row.get('Name', 'Unknown')}")

    # Generate Shopify CSV
    shopify_rows = []

    for product in products:
        name = product.get('Name', '')
        sku = product.get('SKU', '')

        # Skip products without SKU
        if not sku:
            stats['no_sku'] += 1
            continue

        # Get price
        regular_price = product.get('Regular price', '')
        sale_price = product.get('Sale price', '')

        if not regular_price and not sale_price:
            stats['no_price'] += 1
            continue

        price = sale_price if sale_price else regular_price
        compare_price = regular_price if sale_price else ''

        # Build Shopify row
        handle = clean_handle(name)
        title = clean_title(name)
        categories = product.get('Categories', '')
        product_type = map_category_to_type(categories, name)
        tags = extract_tags(categories, product.get('Tags', ''))
        images = parse_images(product.get('Images', ''))

        # Get stock info
        in_stock = product.get('In stock?', '1')
        stock_qty = product.get('Stock', '')

        # Weight (convert lbs to grams)
        weight_lbs = product.get('Weight (lbs)', '')
        weight_grams = ''
        if weight_lbs:
            try:
                weight_grams = int(float(weight_lbs) * 453.592)
            except:
                pass

        # Check if this is a variable product with variations
        parent_sku = product.get('SKU', '')
        product_variations = variations.get(parent_sku, [])

        if product_variations:
            # Variable product - create rows for each variation
            for i, var in enumerate(product_variations):
                var_sku = var.get('SKU', '')
                var_price = var.get('Sale price', '') or var.get('Regular price', '')
                var_compare = var.get('Regular price', '') if var.get('Sale price', '') else ''
                var_stock = var.get('Stock', '')
                var_in_stock = var.get('In stock?', '1')

                # Get variant attributes
                attr1_name = var.get('Attribute 1 name', '')
                attr1_value = var.get('Attribute 1 value(s)', '')
                attr2_name = var.get('Attribute 2 name', '')
                attr2_value = var.get('Attribute 2 value(s)', '')
                attr3_name = var.get('Attribute 3 name', '')
                attr3_value = var.get('Attribute 3 value(s)', '')

                # Weight for variant
                var_weight = var.get('Weight (lbs)', '')
                var_weight_grams = ''
                if var_weight:
                    try:
                        var_weight_grams = int(float(var_weight) * 453.592)
                    except:
                        pass

                row = {
                    'Handle': handle,
                    'Title': title if i == 0 else '',
                    'Body (HTML)': clean_html(product.get('Description', '')) if i == 0 else '',
                    'Vendor': 'KeyBar',
                    'Product Category': '',
                    'Type': product_type if i == 0 else '',
                    'Tags': tags if i == 0 else '',
                    'Published': 'TRUE',
                    'Option1 Name': attr1_name.title() if attr1_name else '',
                    'Option1 Value': attr1_value if attr1_value else '',
                    'Option2 Name': attr2_name.title() if attr2_name else '',
                    'Option2 Value': attr2_value if attr2_value else '',
                    'Option3 Name': attr3_name.title() if attr3_name else '',
                    'Option3 Value': attr3_value if attr3_value else '',
                    'Variant SKU': var_sku,
                    'Variant Grams': var_weight_grams or weight_grams,
                    'Variant Inventory Tracker': 'shopify',
                    'Variant Inventory Qty': var_stock or '0',
                    'Variant Inventory Policy': 'deny' if var_in_stock == '1' else 'continue',
                    'Variant Fulfillment Service': 'manual',
                    'Variant Price': var_price,
                    'Variant Compare At Price': var_compare,
                    'Variant Requires Shipping': 'TRUE',
                    'Variant Taxable': 'TRUE',
                    'Variant Barcode': '',
                    'Image Src': images[0] if images and i == 0 else '',
                    'Image Position': '1' if images and i == 0 else '',
                    'Image Alt Text': title if images and i == 0 else '',
                    'Gift Card': 'FALSE',
                    'SEO Title': title if i == 0 else '',
                    'SEO Description': clean_html(product.get('Short description', ''))[:320] if i == 0 else '',
                    'Variant Image': '',
                    'Variant Weight Unit': 'g',
                    'Status': 'active'
                }
                shopify_rows.append(row)

                # Add additional images for first variant only
                if i == 0 and len(images) > 1:
                    for j, img in enumerate(images[1:], start=2):
                        img_row = {key: '' for key in SHOPIFY_HEADERS}
                        img_row['Handle'] = handle
                        img_row['Image Src'] = img
                        img_row['Image Position'] = str(j)
                        img_row['Image Alt Text'] = f"{title} - Image {j}"
                        shopify_rows.append(img_row)
        else:
            # Simple product - single row
            attr1_name = product.get('Attribute 1 name', '')
            attr1_value = product.get('Attribute 1 value(s)', '')

            row = {
                'Handle': handle,
                'Title': title,
                'Body (HTML)': clean_html(product.get('Description', '')),
                'Vendor': 'KeyBar',
                'Product Category': '',
                'Type': product_type,
                'Tags': tags,
                'Published': 'TRUE',
                'Option1 Name': 'Title',
                'Option1 Value': 'Default Title',
                'Option2 Name': '',
                'Option2 Value': '',
                'Option3 Name': '',
                'Option3 Value': '',
                'Variant SKU': sku,
                'Variant Grams': weight_grams,
                'Variant Inventory Tracker': 'shopify',
                'Variant Inventory Qty': stock_qty or '0',
                'Variant Inventory Policy': 'deny' if in_stock == '1' else 'continue',
                'Variant Fulfillment Service': 'manual',
                'Variant Price': price,
                'Variant Compare At Price': compare_price,
                'Variant Requires Shipping': 'TRUE',
                'Variant Taxable': 'TRUE',
                'Variant Barcode': '',
                'Image Src': images[0] if images else '',
                'Image Position': '1' if images else '',
                'Image Alt Text': title if images else '',
                'Gift Card': 'FALSE',
                'SEO Title': title,
                'SEO Description': clean_html(product.get('Short description', ''))[:320],
                'Variant Image': '',
                'Variant Weight Unit': 'g',
                'Status': 'active'
            }
            shopify_rows.append(row)

            # Add additional images
            if len(images) > 1:
                for j, img in enumerate(images[1:], start=2):
                    img_row = {key: '' for key in SHOPIFY_HEADERS}
                    img_row['Handle'] = handle
                    img_row['Image Src'] = img
                    img_row['Image Position'] = str(j)
                    img_row['Image Alt Text'] = f"{title} - Image {j}"
                    shopify_rows.append(img_row)

    # Write Shopify CSV
    with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=SHOPIFY_HEADERS)
        writer.writeheader()
        writer.writerows(shopify_rows)

    # Generate report
    report = f"""
================================================================================
KeyBar WooCommerce to Shopify Migration Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
================================================================================

SOURCE FILE: {INPUT_CSV}
OUTPUT FILE: {OUTPUT_CSV}

SUMMARY
-------
Total rows in source:     {stats['total_rows']}
Draft/unpublished:        {stats['draft_products']}
Active products:          {stats['active_products']}

PRODUCT TYPES (Active Only)
---------------------------
Simple products:          {stats['simple']}
Variable products:        {stats['variable']}
Variations:               {stats['variations']}
Composite products:       {stats['composite']} (converted to simple)
Bundles:                  {stats['bundle']} (skipped - manual setup needed)

ISSUES
------
Products without SKU:     {stats['no_sku']} (skipped)
Products without price:   {stats['no_price']} (skipped)

CATEGORIES (Active Products)
----------------------------
"""
    for cat, count in sorted(stats['categories'].items(), key=lambda x: -x[1]):
        report += f"{cat}: {count}\n"

    report += f"""
SHOPIFY IMPORT READY
--------------------
Total rows in output:     {len(shopify_rows)}
Output file:              {OUTPUT_CSV}

NEXT STEPS
----------
1. Review the output CSV for any issues
2. Import via Shopify Admin > Products > Import
3. After import, set up:
   - Collections (KeyBars, Inserts, Gear, New Arrivals)
   - Bundle products manually (Shopify doesn't have native bundles)
   - Verify images loaded correctly
   - Set up redirects from old WooCommerce URLs

SKIPPED PRODUCTS (Bundles/Other)
--------------------------------
"""
    for item in stats['skipped_types'][:20]:
        report += f"- {item}\n"

    if len(stats['skipped_types']) > 20:
        report += f"... and {len(stats['skipped_types']) - 20} more\n"

    with open(REPORT_FILE, 'w') as f:
        f.write(report)

    print(report)
    return stats, shopify_rows

if __name__ == '__main__':
    stats, rows = process_products()
    print(f"\n✓ Shopify CSV saved to: {OUTPUT_CSV}")
    print(f"✓ Migration report saved to: {REPORT_FILE}")
