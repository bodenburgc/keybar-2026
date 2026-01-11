#!/usr/bin/env python3
"""Apply KeyBar brand colors to Shopify theme settings"""

import urllib.request
import json

import os

TOKEN = os.environ.get("SHOPIFY_ACCESS_TOKEN")
STORE = "keybarus.myshopify.com"
THEME_ID = os.environ.get("SHOPIFY_THEME_ID", "186764001563")

if not TOKEN:
    raise ValueError("SHOPIFY_ACCESS_TOKEN environment variable required")

API_URL = f"https://{STORE}/admin/api/2024-01/themes/{THEME_ID}/assets.json"

# KeyBar Brand Colors (from .docs/brand/COLORS.md)
KEYBAR_COLORS = {
    # Primary colors
    "color_text": "#1C1F22",              # Gunmetal Black - primary text
    "color_highlight": "#FFD700",          # KeyBar Gold - highlights/links
    "color_background": "#FFFFFF",         # White - main background

    # Buttons
    "color_button_background": "#FFD700",  # KeyBar Gold - primary CTA
    "color_button_text": "#1C1F22",        # Gunmetal Black - button text

    # Drawers/Menus
    "color_drawer_text": "#FFFFFF",        # White text on dark drawer
    "color_drawer_background": "#1C1F22",  # Gunmetal Black drawer bg
    "color_drawer_button_background": "#FFD700",  # KeyBar Gold
    "color_drawer_button_text": "#1C1F22", # Gunmetal Black

    # Pricing
    "color_price": "#1C1F22",              # Gunmetal Black - regular price
    "color_sale_price": "#DC2626",         # Error Red - sale price
    "color_sale_tag": "#FF8C00",           # Safety Orange - sale badge
    "color_sale_tag_text": "#FFFFFF",      # White text on sale badge

    # Feedback colors
    "color_success_text": "#166534",       # Dark green text
    "color_success_background": "#DCFCE7", # Light green bg
    "color_error_text": "#991B1B",         # Dark red text
    "color_error_background": "#FEE2E2",   # Light red bg
    "color_info_text": "#1C1F22",          # Gunmetal Black
    "color_info_background": "#EBEEF1",    # Aluminum Light

    # Other
    "color_rating": "#FFD700",             # KeyBar Gold - stars
    "color_keyboard_focus": "#FFD700",     # KeyBar Gold - focus ring
    "color_shadow": "#1C1F22",             # Gunmetal Black - shadows
    "color_image_background": "#EBEEF1",   # Aluminum Light - placeholders
    "color_drawer_overlay": "#1C1F22",     # Gunmetal Black - overlay
}

def get_current_settings():
    """Get current theme settings"""
    url = f"{API_URL}?asset[key]=config/settings_data.json"
    req = urllib.request.Request(url)
    req.add_header('X-Shopify-Access-Token', TOKEN)

    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        return json.loads(data['asset']['value'])

def update_settings(settings):
    """Update theme settings"""
    payload = {
        "asset": {
            "key": "config/settings_data.json",
            "value": json.dumps(settings)
        }
    }

    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(API_URL, data=data, method='PUT')
    req.add_header('X-Shopify-Access-Token', TOKEN)
    req.add_header('Content-Type', 'application/json')

    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

print("Fetching current theme settings...")
settings = get_current_settings()

print("Applying KeyBar brand colors...")

# Update the current theme settings
current = settings.get('current', {})

for key, value in KEYBAR_COLORS.items():
    old_value = current.get(key, 'not set')
    current[key] = value
    print(f"  {key}: {old_value} → {value}")

settings['current'] = current

print("\nSaving updated settings...")
result = update_settings(settings)

print("\nDone! KeyBar brand colors applied.")
print(f"Preview: https://{STORE}?preview_theme_id={THEME_ID}")
