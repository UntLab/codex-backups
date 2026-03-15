# PharmaTech — мобильное приложение

Красивое нативное приложение для PharmaTech с центральной кнопкой действий.

## Как выглядит

### Экран приложения
- **Хедер** — бирюзовый градиент, логотип «PharmaTech», нативный вид
- **Контент** — полный сайт в WebView (каталог, корзина, чат)
- **Кнопка «+»** (справа внизу) — центральная точка для действий

### Меню «+»
При нажатии открывается карточка снизу с двумя действиями:

| Действие | Описание |
|----------|----------|
| 💬 **WhatsApp-a yazın** | Открывает чат с PharmaTech в WhatsApp |
| 📤 **Tətbiqi paylaşın** | Поделиться ссылкой на приложение/сайт |

## Запуск

```bash
cd /Users/ais/Cursor/projects/fullstack/pharmatech-mobile
npm start
```

### Android-эмулятор

```bash
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
npm run android
```

Или: `./run-android.sh` (сначала запустит эмулятор при необходимости)

На телефоне: установите **Expo Go**, отсканируйте QR-код.

## Сборка APK

```bash
# 1. Установить EAS CLI
npm install -g eas-cli

# 2. Войти в Expo
eas login

# 3. Собрать APK
eas build --platform android --profile preview
```

APK скачается из облака Expo (~10–15 минут). Установите на Android.

## Изменение URL или WhatsApp

В `App.js` измените константы:
- `SITE_URL` — адрес сайта
- `WHATSAPP_NUMBER` — номер для WhatsApp
- `APP_SHARE_URL` — ссылка при «Поделиться»
