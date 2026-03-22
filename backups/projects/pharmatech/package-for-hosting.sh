#!/bin/bash
# Собирает PharmaTech в одну папку для загрузки на ваш хостинг
# Запуск: ./package-for-hosting.sh

cd "$(dirname "$0")"
DEPLOY_DIR="pharmatech-upload"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

echo "1. Сборка проекта..."
npm run build

echo ""
echo "2. Копирование standalone..."
cp -r .next/standalone/* "$DEPLOY_DIR/"
cp -r .next/static "$DEPLOY_DIR/.next/"
cp -r public "$DEPLOY_DIR/" 2>/dev/null || true

echo "3. Копирование .env.example..."
cp .env.example "$DEPLOY_DIR/"
echo "# Заполните и переименуйте в .env.local" > "$DEPLOY_DIR/ENV_README.txt"

echo ""
echo "4. Создание zip-архива..."
cd "$DEPLOY_DIR"
zip -r ../pharmatech-for-hosting.zip . -x "*.DS_Store"
cd ..

echo ""
echo "=== Готово! ==="
echo ""
echo "Папка: $(pwd)/$DEPLOY_DIR"
echo "Архив: $(pwd)/pharmatech-for-hosting.zip"
echo ""
echo "На хостинге:"
echo "  1. Загрузите и распакуйте pharmatech-for-hosting.zip"
echo "  2. Создайте .env.local с ключами (скопируйте из ENV_README)"
echo "  3. В панели Node.js укажите: node server.js"
echo "  4. Либо по SSH: node server.js"
echo ""
