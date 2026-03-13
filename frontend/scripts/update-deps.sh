#!/bin/bash
# frontend/scripts/update-deps.sh
# Muestra dependencias desactualizadas y las actualiza según package.json

echo "📦 Dependencias desactualizadas:"
npm outdated

echo "🔄 Actualizando dentro de los rangos permitidos..."
npm update

# (Opcional) Para actualizar a últimas versiones, descomentar:
# npx npm-check-updates -u && npm install

echo "✅ package.json y package-lock.json actualizados en frontend/"