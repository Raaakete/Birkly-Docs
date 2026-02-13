#!/usr/bin/env sh
# Start a local server for the Birkly Docs website.
# Usage: ./serve-docs.sh   (or: sh serve-docs.sh)
# Then open http://localhost:3000 (or the port shown).

cd "$(dirname "$0")"
if command -v npx >/dev/null 2>&1; then
  echo "Starting docs at http://localhost:3000"
  npx serve . -p 3000
elif command -v python3 >/dev/null 2>&1; then
  echo "Starting docs at http://localhost:8080"
  python3 -m http.server 8080
else
  echo "Install Node (npx serve) or Python 3 to run a local server."
  exit 1
fi
