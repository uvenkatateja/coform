# CoForm Setup Guide

## Prerequisites
- Node.js 18+ installed
- pnpm package manager
- Supabase account

## Quick Start

### 1. Install Dependencies
```bash
cd liveforms
pnpm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run Database Migration

Go to your Supabase project → SQL Editor → New Query, then paste and run:
```sql
-- Copy contents from supabase/migrations/001_initial_schema.sql
```

Or use Supabase CLI:
```bash
npx supabase db push
```

### 4. Start Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000`

## Testing the App

### Week 1 Features (Form Editor)
1. Go to `/editor/new` (will redirect to login first)
2. Sign up for an account
3. Create a form with drag-and-drop fields
4. Test field types: text, email, number, select, checkbox
5. Edit field properties (label, placeholder, required)
6. Reorder fields by dragging

### Week 2 Features (Supabase Integration)
1. **Authentication**
   - Sign up at `/signup`
   - Sign in at `/login`
   - Sign out from dashboard

2. **Dashboard**
   - View all your forms at `/dashboard`
   - Create new form (redirects to editor)
   - Delete forms

3. **Auto-Save**
   - Edit a form at `/editor/[id]`
   - Make changes (auto-saves after 2 seconds)
   - Refresh page (changes persist)

4. **Protected Routes**
   - Try accessing `/dashboard` without login (redirects to `/login`)
   - Try accessing `/editor/[id]` without login (redirects to `/login`)

## Project Structure

```
liveforms/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── dashboard/         # User dashboard
│   │   └── editor/            # Form editor
│   │       ├── new/           # Create new form
│   │       └── [id]/          # Edit existing form
│   ├── components/
│   │   ├── auth/              # Auth forms
│   │   ├── dashboard/         # Dashboard components
│   │   ├── editor/            # Form editor components
│   │   ├── home/              # Landing page components
│   │   ├── layout/            # Header, footer
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/
│   │   ├── use-form-editor.ts # Form state management
│   │   ├── use-auto-save.ts   # Auto-save hook
│   │   └── use-toast.ts       # Toast notifications
│   ├── lib/
│   │   ├── auth/              # Auth actions
│   │   ├── forms/             # Form queries & actions
│   │   ├── supabase/          # Supabase clients
│   │   └── utils.ts           # Utilities
│   └── types/
│       ├── form.types.ts      # Form type definitions
│       └── database.types.ts  # Supabase types
├── supabase/
│   └── migrations/            # Database migrations
├── public/                    # Static assets
└── package.json
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Drag & Drop**: dnd-kit
- **Package Manager**: pnpm

## Common Issues

### "Cannot find module" errors
```bash
pnpm install
```

### Supabase connection errors
- Check `.env.local` has correct credentials
- Verify Supabase project is active
- Check database migration ran successfully

### Auto-save not working
- Check browser console for errors
- Verify user is authenticated
- Check Supabase RLS policies are enabled

## Development Commands

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Next Steps

See `WEEK1.md` and `WEEK2.md` for detailed feature documentation.

Week 3 will add:
- Real-time collaboration
- Form sharing
- Public form submissions
