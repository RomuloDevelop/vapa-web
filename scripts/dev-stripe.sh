#!/bin/bash
# Login to Stripe (if needed) and forward webhooks to local dev server
# Usage: bun run stripe:forward

set -e

ENV_FILE=".env.local"

if ! command -v stripe &>/dev/null; then
  echo "Stripe CLI not found. Install with: brew install stripe/stripe-cli/stripe"
  exit 1
fi

# Only login if not already authenticated
if ! stripe config --list &>/dev/null; then
  echo "Logging in to Stripe..."
  stripe login
  echo ""
fi

# Start stripe listen, capture the webhook secret from output, then keep forwarding
echo "Starting webhook forwarding..."
stripe listen --forward-to localhost:3000/api/webhooks/stripe 2>&1 | while IFS= read -r line; do
  echo "$line"
  if [[ "$line" == *"whsec_"* ]]; then
    SECRET=$(echo "$line" | grep -oE 'whsec_[A-Za-z0-9]+')
    if [ -n "$SECRET" ]; then
      if grep -q "^STRIPE_WEBHOOK_SECRET=" "$ENV_FILE" 2>/dev/null; then
        sed -i '' "s|^STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=$SECRET|" "$ENV_FILE"
      else
        echo "STRIPE_WEBHOOK_SECRET=$SECRET" >> "$ENV_FILE"
      fi
      echo ""
      echo "Updated $ENV_FILE with STRIPE_WEBHOOK_SECRET=$SECRET"
      echo ""
    fi
  fi
done
