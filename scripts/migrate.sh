#!/usr/bin/env bash
# Apply pending schema changes on a deploy host.
# Usage: ./scripts/migrate.sh
set -euo pipefail

cd "$(dirname "$0")/.."

echo ">> Applying migrations"
npm run migrate

echo ">> Migration complete"