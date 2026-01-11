#!/usr/bin/env python3
"""Create Shopify collections via Admin API"""

import urllib.request
import json
import os

TOKEN = os.environ.get("SHOPIFY_ACCESS_TOKEN")
STORE = "keybarus.myshopify.com"

if not TOKEN:
    raise ValueError("SHOPIFY_ACCESS_TOKEN environment variable required")

API_URL = f"https://{STORE}/admin/api/2024-01/smart_collections.json"

COLLECTIONS = [
    {"title": "KeyBars", "rules": [{"column": "type", "relation": "equals", "condition": "KeyBar"}]},
    {"title": "KeyBars JR", "rules": [{"column": "type", "relation": "equals", "condition": "KeyBar JR"}]},
    {"title": "Inserts", "rules": [{"column": "type", "relation": "equals", "condition": "Insert"}]},
    {"title": "Gear", "rules": [{"column": "type", "relation": "equals", "condition": "Gear"}]},
    {"title": "Parts", "rules": [{"column": "type", "relation": "equals", "condition": "Parts"}]},
    {"title": "New Arrivals", "rules": [{"column": "tag", "relation": "equals", "condition": "New Arrivals"}]},
]

for coll in COLLECTIONS:
    print(f"Creating '{coll['title']}'...", end=" ")

    payload = {
        "smart_collection": {
            "title": coll["title"],
            "rules": coll["rules"],
            "published": True
        }
    }

    data = json.dumps(payload).encode('utf-8')

    req = urllib.request.Request(API_URL, data=data, method='POST')
    req.add_header('X-Shopify-Access-Token', TOKEN)
    req.add_header('Content-Type', 'application/json')

    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            coll_id = result["smart_collection"]["id"]
            print(f"OK (ID: {coll_id})")
    except urllib.error.HTTPError as e:
        print(f"ERROR: {e.code}")
        print(f"  {e.read().decode('utf-8')}")

print("\nDone! View collections at:")
print(f"https://{STORE}/admin/collections")
