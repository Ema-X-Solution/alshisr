#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting AL SHISR API..."
if [ -f dist/src/main.js ]; then
  exec node dist/src/main.js
elif [ -f dist/main.js ]; then
  exec node dist/main.js
else
  echo "Cannot find compiled main.js"
  find dist -name 'main.js' 2>/dev/null || ls -R dist
  exit 1
fi
