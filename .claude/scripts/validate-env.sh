#!/bin/bash
# Validate that .env.example exists and matches .env usage in code
# Run during deployment setup

PROJECT_ROOT="${1:-.}"

echo "Checking environment variables..."

# Find all env var references in code
ENV_VARS=$(grep -roh 'process\.env\.\w\+\|import\.meta\.env\.\w\+' "$PROJECT_ROOT/src" 2>/dev/null | sort -u | sed 's/process\.env\.//;s/import\.meta\.env\.//')

if [ -z "$ENV_VARS" ]; then
  echo "No environment variables found in code."
  exit 0
fi

# Check if .env.example exists
if [ ! -f "$PROJECT_ROOT/.env.example" ]; then
  echo "WARNING: .env.example not found. Create one with these variables:"
  echo "$ENV_VARS" | while read var; do
    echo "  $var="
  done
  exit 1
fi

# Check each env var is documented
MISSING=0
echo "$ENV_VARS" | while read var; do
  if ! grep -q "$var" "$PROJECT_ROOT/.env.example" 2>/dev/null; then
    echo "MISSING in .env.example: $var"
    MISSING=1
  fi
done

if [ "$MISSING" -eq 0 ]; then
  echo "All environment variables are documented."
fi

exit 0
