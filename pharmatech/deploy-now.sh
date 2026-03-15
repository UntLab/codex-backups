#!/bin/bash
# Скрипт деплоя PharmaTech на Vercel
# Запуск: ./deploy-now.sh

cd "$(dirname "$0")"

echo "=== PharmaTech → Vercel ==="
echo ""
echo "Шаг 1: Вход в Vercel (если ещё не вошли)"
npx vercel login

echo ""
echo "Шаг 2: Деплой"
npx vercel --prod

echo ""
echo "Готово! Ссылка на сайт появится выше."
