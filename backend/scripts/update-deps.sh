#!/bin/bash
# backend/scripts/update-deps.sh
# Actualiza requirements.txt con las librerías instaladas en el entorno local

# Activar venv si existe (opcional)
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Congelar dependencias actuales
pip freeze > requirements.txt

echo "✅ requirements.txt actualizado en backend/"