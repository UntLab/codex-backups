# CardSaaS — Цифровые визитки нового поколения

SaaS-платформа для создания цифровых бизнес-визиток с кибропанк-дизайном, CRM, аналитикой и командным управлением.

## Стек технологий

- **Frontend/Backend:** Next.js 16 (App Router) + TypeScript
- **Стили:** Tailwind CSS 4
- **БД:** PostgreSQL + Prisma ORM 7
- **Авторизация:** NextAuth.js v5 (Credentials)
- **Платежи:** Stripe (подписки $10/мес за визитку)
- **Загрузка файлов:** Cloudinary
- **Email:** Resend
- **QR-коды:** qrcode
- **Иконки:** Lucide React + Font Awesome

## Полный список функций

### Визитки
- 3 шаблона: **Cyberpunk**, **Minimal**, **Gradient**
- Конструктор с визуальным редактором
- Загрузка аватара (Cloudinary) или по URL
- Кастомные цвета (акцент + фон)
- Соцсети: Telegram, GitHub, LinkedIn, Instagram, Facebook, Twitter/X, WhatsApp, YouTube, TikTok
- Теги/навыки
- Webhook для CRM (n8n и др.)
- Кастомный домен (CNAME)
- QR-код для каждой визитки
- vCard экспорт (сохранение контакта)
- Web Share API

### CRM / Лиды
- Форма сбора контактов на каждой визитке
- Все лиды сохраняются в БД
- Страница управления лидами (`/dashboard/leads`)
- Статусы: Новый → Связались → Квалифицирован → Конвертирован / Потерян
- Фильтры по визитке и статусу
- Заметки к каждому лиду
- Автоматический webhook в CRM
- Email-уведомление о новом лиде

### Шаблоны
- Системные шаблоны (предустановленные)
- Пользовательские шаблоны (создание/сохранение)
- Публичные шаблоны (доступны всем)
- Применение шаблона при создании визитки

### Команды
- Создание команды (компания)
- Приглашение сотрудников по email
- Управление участниками

### Платежи (Stripe)
- $10/мес за визитку
- Автоматическая активация при оплате
- Блокировка при просрочке
- Stripe Customer Portal
- Webhook обработка всех событий

### Email-уведомления (Resend)
- Новый лид
- Просроченная оплата
- Еженедельный отчёт

### Аналитика
- Подсчёт просмотров
- Статистика за день/неделю/месяц

### OG-превью
- Динамическая генерация OG-картинок при шеринге ссылки

## Запуск

```bash
# 1. Установить зависимости
npm install

# 2. Скопировать .env.example → .env и заполнить
cp .env.example .env

# 3. Запустить локальную БД + миграции
npx prisma dev

# 4. Запустить dev-сервер
npm run dev
```

## Переменные окружения

| Переменная | Описание |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Секрет NextAuth |
| `STRIPE_SECRET_KEY` | Stripe секретный ключ |
| `STRIPE_PRICE_ID` | Stripe ID цены подписки |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook секрет |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RESEND_API_KEY` | Resend API key |
| `FROM_EMAIL` | Email отправителя |
| `NEXT_PUBLIC_APP_URL` | URL приложения |

## Структура (29 маршрутов)

```
src/
├── app/
│   ├── page.tsx                         # Лендинг
│   ├── (auth)/
│   │   ├── login/                       # Вход
│   │   └── register/                    # Регистрация
│   ├── (dashboard)/dashboard/
│   │   ├── page.tsx                     # Личный кабинет
│   │   ├── cards/new/                   # Создание визитки
│   │   ├── cards/[id]/edit/             # Редактирование
│   │   ├── leads/                       # CRM / Лиды
│   │   ├── templates/                   # Шаблоны
│   │   └── team/                        # Команда
│   ├── card/[slug]/                     # Публичная визитка
│   └── api/
│       ├── auth/                        # NextAuth + регистрация
│       ├── cards/                       # CRUD визиток
│       ├── cards/[id]/qr/              # QR-код
│       ├── cards/[id]/analytics/       # Аналитика
│       ├── cards/[id]/domain/          # Кастомный домен
│       ├── leads/                       # CRUD лидов
│       ├── templates/                   # CRUD шаблонов
│       ├── teams/                       # Команды + приглашения
│       ├── stripe/                      # Checkout, Portal, Webhook
│       ├── upload/                      # Загрузка файлов
│       └── og/                          # OG-картинки
├── components/
│   ├── CyberpunkCard.tsx               # Кибропанк шаблон
│   ├── MinimalCard.tsx                 # Минимал шаблон
│   ├── GradientCard.tsx                # Градиент шаблон
│   ├── CardForm.tsx                    # Конструктор визиток
│   └── SessionProvider.tsx             # Auth провайдер
└── lib/
    ├── auth.ts                          # NextAuth конфигурация
    ├── prisma.ts                        # Prisma клиент
    ├── stripe.ts                        # Stripe утилиты
    ├── cloudinary.ts                    # Cloudinary загрузка
    └── email.ts                         # Email (Resend)
```

## Настройка Stripe

1. Создать аккаунт на [stripe.com](https://stripe.com)
2. Создать продукт «Digital Business Card» с ценой $10/мес
3. Скопировать `price_id` → `STRIPE_PRICE_ID`
4. Webhook endpoint: `{APP_URL}/api/stripe/webhook`
5. События: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`, `customer.subscription.updated`

## Настройка Cloudinary

1. Создать аккаунт на [cloudinary.com](https://cloudinary.com)
2. Скопировать Cloud Name, API Key, API Secret в `.env`

## Настройка Resend

1. Создать аккаунт на [resend.com](https://resend.com)
2. Подтвердить домен `2ai.az`
3. Скопировать API Key в `.env`
