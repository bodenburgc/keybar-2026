#!/bin/bash
# Requires SHOPIFY_ACCESS_TOKEN environment variable
TOKEN="${SHOPIFY_ACCESS_TOKEN:?SHOPIFY_ACCESS_TOKEN environment variable required}"
STORE="keybarus.myshopify.com"
API="https://$STORE/admin/api/2024-01/smart_collections.json"

echo "Creating KeyBars collection..."
curl -s -X POST "$API" \
  -H "X-Shopify-Access-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"smart_collection":{"title":"KeyBars","rules":[{"column":"type","relation":"equals","condition":"KeyBar"}],"published":true}}'
echo ""

echo "Creating KeyBars JR collection..."
curl -s -X POST "$API" \
  -H "X-Shopify-Access-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"smart_collection":{"title":"KeyBars JR","rules":[{"column":"type","relation":"equals","condition":"KeyBar JR"}],"published":true}}'
echo ""

echo "Creating Inserts collection..."
curl -s -X POST "$API" \
  -H "X-Shopify-Access-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"smart_collection":{"title":"Inserts","rules":[{"column":"type","relation":"equals","condition":"Insert"}],"published":true}}'
echo ""

echo "Creating Gear collection..."
curl -s -X POST "$API" \
  -H "X-Shopify-Access-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"smart_collection":{"title":"Gear","rules":[{"column":"type","relation":"equals","condition":"Gear"}],"published":true}}'
echo ""

echo "Creating Parts collection..."
curl -s -X POST "$API" \
  -H "X-Shopify-Access-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"smart_collection":{"title":"Parts","rules":[{"column":"type","relation":"equals","condition":"Parts"}],"published":true}}'
echo ""

echo "Creating New Arrivals collection..."
curl -s -X POST "$API" \
  -H "X-Shopify-Access-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"smart_collection":{"title":"New Arrivals","rules":[{"column":"tag","relation":"equals","condition":"New Arrivals"}],"published":true}}'
echo ""

echo "Done!"
