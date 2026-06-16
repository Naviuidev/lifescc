#!/usr/bin/env bash
# Build a Hostinger-ready folder for https://tefenoza.com/test/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/deploy/test/output"

echo "→ Cleaning $OUT"
rm -rf "$OUT"
mkdir -p "$OUT/uploads/blogs" "$OUT/uploads/reviews" "$OUT/data"

echo "→ Building React (VITE_BASE_PATH=/test/)"
(cd "$ROOT/web" && npm run build)

echo "→ Installing PHP dependencies"
(cd "$ROOT/backend" && composer install --no-dev --optimize-autoloader)

echo "→ Assembling deploy package"
cp -R "$ROOT/web/dist/"* "$OUT/"
cp "$ROOT/backend/public/index.php" "$OUT/"
cp -R "$ROOT/backend/src" "$OUT/"
cp -R "$ROOT/backend/vendor" "$OUT/"
cp "$ROOT/deploy/test/.htaccess" "$OUT/"
cp "$ROOT/web/src/constants/siteEmbeddedChatbot.json" "$OUT/data/"
cp "$ROOT/backend/.env.example" "$OUT/.env.example"
cp "$ROOT/deploy/test/.env.hostinger" "$OUT/.env.hostinger"

if [ -d "$ROOT/backend/public/uploads" ]; then
  cp -R "$ROOT/backend/public/uploads/"* "$OUT/uploads/" 2>/dev/null || true
fi

cp "$ROOT/deploy/test/protect-private.htaccess" "$OUT/src/.htaccess"
cp "$ROOT/deploy/test/protect-private.htaccess" "$OUT/vendor/.htaccess"
cp "$ROOT/deploy/test/protect-private.htaccess" "$OUT/data/.htaccess"

echo ""
echo "Done. Upload everything inside:"
echo "  $OUT"
echo "to Hostinger: public_html/test/"
echo ""
echo "On the server:"
echo "  1. Copy .env.hostinger → .env on the server; set DB_* and SMTP_PASS"
echo "  2. chmod 755 uploads data && chmod 644 data/siteEmbeddedChatbot.json (writable for chatbot toggle)"
echo "  3. Import database/init.sql in phpMyAdmin"
echo "  4. Visit https://tefenoza.com/test/api/health"
