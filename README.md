# APKgaminghub - Game Download Platform

A modern, full-featured game download platform built with Next.js 16, featuring an admin panel for content management, hero banners, and game information pages.

## Table of Contents

- Features
- Tech Stack
- Prerequisites
- Quick Start
- Environment Variables
- Supabase Setup
- Deployment on Vercel
- Project Structure
- Admin Panel
- API Routes
- Customization
- Common Issues
- License

## Features

- Game Management: Add, edit, and delete games with detailed information
- Image Upload: Upload game thumbnails and banners (Supabase Storage)
- Hero Banners: Manage rotating hero banners on the homepage
- Blog Content: Customizable game overview, tips, FAQs, and more
- Admin Panel: Secure admin interface for content management
- Responsive Design: Fully responsive across all devices
- Dark Theme: Purple-themed dark mode
- Fast Performance: Optimized with Next.js 16 and Turbopack
- PostgreSQL Database: Supabase PostgreSQL for production

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui |
| Database | Supabase PostgreSQL |
| ORM | Prisma |
| State | Zustand |
| Animations | Framer Motion |
| Icons | Lucide React |
| Storage | Supabase Storage |

## Prerequisites

- Node.js >= 18.x
- Bun >= 1.x (or npm/yarn/pnpm)
- Git
- Supabase account (free tier works)

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repository-url>
cd my-project
bun install
```

### 2. Create Supabase Project

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Note down:
   - Your Project Reference
   - Your Database Password

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials (see `Environment Variables` below).

### 4. Create Storage Buckets

In the Supabase Dashboard:

1. Go to Storage -> Create a new bucket
2. Create these buckets (set Public = Yes for each):
   - `game-thumbnails`
   - `game-banners`
   - `hero-banners`
   - `user-avatars`

### 5. Push Database Schema

```bash
bun run db:push
```

### 6. Run Development Server

```bash
bun run dev
```

Open `http://localhost:3000` in your browser.

## Environment Variables

Create a `.env` file with the following:

```env
# ===========================================
# DATABASE (Supabase PostgreSQL)
# ===========================================

# Connection Pooler (for serverless/Vercel)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (for migrations)
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# ===========================================
# SUPABASE
# ===========================================

NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"

# ===========================================
# NEXTAUTH
# ===========================================

NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

### Where to Find Values

| Variable | Supabase Dashboard Location |
|---|---|
| `DATABASE_URL` | Settings -> Database -> Connection string (Pooler) |
| `DIRECT_URL` | Settings -> Database -> Connection string (Direct) |
| `NEXT_PUBLIC_SUPABASE_URL` | Settings -> API -> Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings -> API -> Project API keys -> anon public |

## Supabase Setup

### Step 1: Create Project

1. Sign up at https://supabase.com
2. Click "New Project"
3. Choose an organization, enter project name
4. Set a strong database password (save it)
5. Select a region close to your users
6. Click "Create new project"

### Step 2: Get Connection Strings

In Supabase Dashboard -> Settings -> Database:

1. Scroll to Connection string
2. Select URI format
3. Copy:
   - Pooler connection string -> use as `DATABASE_URL`
   - Direct connection string -> use as `DIRECT_URL`
4. Replace `[PASSWORD]` with your database password

### Step 3: Get API Keys

In Supabase Dashboard -> Settings -> API:

1. Copy Project URL -> `NEXT_PUBLIC_SUPABASE_URL`
2. Copy anon public key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Create Storage Buckets

In Supabase Dashboard -> Storage:

| Bucket Name | Public | Use Case |
|---|---|---|
| `game-thumbnails` | Yes | Game thumbnail images |
| `game-banners` | Yes | Game banner images |
| `hero-banners` | Yes | Homepage hero banners |
| `user-avatars` | Yes | User profile avatars |

### Step 5: Configure CORS (if needed)

In Supabase Dashboard -> Settings -> API:

Add your domains to allowed origins:

- `http://localhost:3000` (development)
- `https://your-app.vercel.app` (production)

## Deployment on Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

### Step 2: Create Vercel Project

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework: Next.js
   - Build Command: `bun run build`
   - Install Command: `bun install`

### Step 3: Add Environment Variables

In Vercel Dashboard -> Settings -> Environment Variables:

Add all variables from your `.env` file:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

### Step 4: Deploy

Click Deploy and wait for the build to complete.

### Step 5: Update Supabase Allowed Origins

Add your Vercel URL to Supabase:

Supabase Dashboard -> Settings -> API

- Add `https://your-app.vercel.app` to allowed origins

## Project Structure

```text
my-project/
├── prisma/
│   └── schema.prisma           # Database schema
├── public/
│   └── uploads/                # Local uploads (dev only)
├── src/
│   ├── app/
│   │   ├── api/                # API routes
│   │   │   ├── upload/         # File upload endpoint
│   │   │   ├── games/          # Games CRUD
│   │   │   └── ...
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main application
│   ├── components/
│   │   ├── admin/              # Admin panel
│   │   ├── games/              # Game components
│   │   ├── layout/             # Header, Footer
│   │   └── ui/                 # shadcn/ui
│   ├── lib/
│   │   ├── db.ts               # Prisma client
│   │   ├── storage.ts          # Supabase storage helper
│   │   ├── store.ts            # Zustand store
│   │   └── supabase/         # Supabase clients
│   └── hooks/                  # React hooks
├── .env                        # Environment variables
├── .env.example                # Template
└── package.json
```

## Admin Panel

### Accessing Admin

1. Click `Admin` in the header
2. Enter password: `admin123`
3. Start managing content

Note: change the default password in your code or auth configuration before production.

### Features

- Dashboard: Overview statistics
- Homepage Banners: Add/edit/delete hero banners
- Game Management:
  - Upload thumbnails and banners
  - Set download links
  - Edit blog content
  - Manage FAQs

## Game detail pages (shareable URLs)

Each game has a public page at **`/games/[slug-or-id]`** (slug is used when set, otherwise the game `id`). Example: `/games/book-of-ra`. Cards and “Read More” use these routes; canonical and Open Graph URLs point here.

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/games` | GET, POST | List or create games |
| `/api/games/[id]` | GET, PUT, DELETE | Single game operations |
| `/api/upload` | POST | Upload images |
| `/api/user` | GET, POST | User operations |
| `/api/favorites` | GET, POST | Manage favorites |

## Customization

### Theme Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: #F59E0B;     /* Gold */
  --secondary: #6B21A8;   /* Purple */
  --background: #0F0A1A;  /* Dark */
}
```

### Game Categories

Edit `src/lib/games-data.ts`:

```ts
export const gameCategories = [
  { id: 'slots', name: 'Slots', icon: 'slots' },
  { id: 'casino', name: 'Casino', icon: 'casino' },
  // Add your categories
];
```

## Common Issues

### Database Connection Error

Symptom:

`Error: Can't reach database server`

Fix:

- Check your `DATABASE_URL` and `DIRECT_URL` are correct.

### Storage Upload Fails

Symptom:

`Error: Storage bucket not found`

Fix:

- Create the required buckets in Supabase Dashboard -> Storage.

### Prisma Migration Error

Symptom:

`Error: P1001: Can't reach database server`

Fix:

- Use `DIRECT_URL` for migrations:

```bash
DATABASE_URL=$DIRECT_URL bun run db:push
```

## License

MIT License

Built with <3 using Next.js 16 & Supabase

