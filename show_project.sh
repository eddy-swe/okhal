#!/bin/bash
# show_project.sh
# Run from your project root: bash show_project.sh

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Project structure: $(pwd)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

find . \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/.vercel/*" \
  -not -path "*/dist/*" \
  -not -path "*/.supabase/*" \
  -not -name "*.lock" \
  | sort \
  | sed 's|[^/]*/|  |g'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Key file contents"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Print every package.json found (shows structure + dependencies)
find . -name "package.json" \
  -not -path "*/node_modules/*" \
  | sort | while read f; do
    echo ""
    echo "── $f ──"
    cat "$f"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " .env files (values redacted)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Show .env files but redact actual secret values
find . -name ".env*" \
  -not -path "*/node_modules/*" \
  -not -name "*.example" \
  | sort | while read f; do
    echo ""
    echo "── $f ──"
    sed 's/=.*/=<redacted>/' "$f"
done

echo ""
echo "Done."
