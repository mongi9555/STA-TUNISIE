#!/bin/bash

echo "========================================================"
echo "        CHERY TUNISIE - ESPACE COMMERCIAL & DIRECTION"
echo "========================================================"
echo ""

if [ ! -d "node_modules" ]; then
    echo "[1/2] Installation initiale des dépendances..."
    npm install
    echo ""
fi

echo "[2/2] Démarrage et ouverture automatique..."
if command -v xdg-open > /dev/null; then
  xdg-open http://localhost:3000 &
elif command -v open > /dev/null; then
  open http://localhost:3000 &
fi

npm run dev
