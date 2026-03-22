# CardSaaS - Next-Gen Digital Business Cards

CardSaaS is a SaaS platform for creating premium digital business cards with customizable themes, lead capture, analytics, team management, and external automation.

## Tech Stack

- Frontend / Backend: Next.js 16 (App Router) + TypeScript
- Styling: Tailwind CSS 4
- Database: Supabase PostgreSQL + Prisma ORM 7
- Authentication: NextAuth.js v5 (Credentials)
- Payments: Stripe
- File uploads: Cloudinary
- Email: Resend
- QR codes: `qrcode`
- Icons: Lucide React + Font Awesome

## External Services

- Supabase: primary database for users, cards, leads, templates, teams, and subscriptions
- n8n: webhook automation and CRM sync
- Stripe: subscriptions and billing
- Cloudinary: avatar and image hosting
- Resend: transactional email delivery
- DNS provider: custom domains for cards

## Core Features

### Cards

- 3 themes: `Cyberpunk`, `Minimal`, `Gradient`
- Visual card builder
- Avatar upload through Cloudinary or external URL
- Accent and background color customization
- Social links: Telegram, GitHub, LinkedIn, Instagram, Facebook, Twitter/X, WhatsApp, YouTube, TikTok
- Tags and skills
- CRM webhook URL per card
- Custom domain support
- QR code generation
- vCard export
- Web Share API support

### Leads / CRM

- Lead capture form on every card
- Leads stored in Supabase
- Leads dashboard at `/dashboard/leads`
- Lead statuses: `new`, `contacted`, `qualified`, `converted`, `lost`
- Filters by card and status
- Lead notes
- Webhook dispatch to CRM / n8n
- Email notification hook support

### Templates

- System templates
- User templates
- Public templates
- Apply template settings when creating a new card

### Teams

- Team creation
- Member invitation by email
- Team ownership and membership management

### Billing

- Monthly Stripe billing per card
- Checkout session generation
- Stripe customer portal
- Stripe webhook handling

### Analytics

- View tracking
- Daily / weekly / monthly analytics

### OG Images

- Dynamic OG image generation for shared links

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.example .env

# 3. Configure Supabase connection strings in .env

# 4. Apply migrations
npx prisma migrate deploy

# 5. Start the dev server
npm run dev
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Supabase PostgreSQL session pooler connection string |
| `DIRECT_URL` | Supabase direct PostgreSQL connection string |
| `AUTH_URL` | Base Auth.js / NextAuth URL |
| `NEXTAUTH_URL` | NextAuth URL |
| `AUTH_SECRET` | Auth.js secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_PRICE_ID` | Stripe recurring price id |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `CLOUDINARY_URL` | Cloudinary connection URL |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RESEND_API_KEY` | Resend API key |
| `FROM_EMAIL` | Sender email |
| `NEXT_PUBLIC_APP_URL` | Public application URL |
| `WEBHOOK_AUTH_TOKEN` | Bearer token for outgoing lead webhooks |

## Project Structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/dashboard/
│   │   ├── page.tsx
│   │   ├── cards/new/
│   │   ├── cards/[id]/edit/
│   │   ├── leads/
│   │   ├── templates/
│   │   └── team/
│   ├── card/[slug]/
│   └── api/
│       ├── auth/
│       ├── cards/
│       ├── leads/
│       ├── templates/
│       ├── teams/
│       ├── stripe/
│       ├── upload/
│       └── og/
├── components/
│   ├── CyberpunkCard.tsx
│   ├── MinimalCard.tsx
│   ├── GradientCard.tsx
│   ├── CardForm.tsx
│   └── SessionProvider.tsx
└── lib/
    ├── auth.ts
    ├── prisma.ts
    ├── stripe.ts
    ├── cloudinary.ts
    └── email.ts
```

## Stripe Setup

1. Create a Stripe account
2. Create a recurring product for the card subscription
3. Copy the Stripe price id into `STRIPE_PRICE_ID`
4. Set the webhook endpoint to `{APP_URL}/api/stripe/webhook`
5. Subscribe to:
   - `checkout.session.completed`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`

## Cloudinary Setup

1. Create a Cloudinary account
2. Copy either `CLOUDINARY_URL` or the individual cloud / key / secret values into `.env`

## Resend Setup

1. Create a Resend account
2. Verify your sending domain
3. Copy `RESEND_API_KEY` into `.env`
