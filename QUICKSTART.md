# CoForm - Quick Start

## What's Built (Week 1 + 2)

✅ **Form Editor** - Drag-and-drop form builder  
✅ **5 Field Types** - Text, email, number, select, checkbox  
✅ **Authentication** - Sign up, sign in, sign out  
✅ **Database** - Supabase integration with RLS  
✅ **Auto-Save** - 2-second debounced saves  
✅ **Dashboard** - View, create, delete forms  
✅ **Protected Routes** - Auth-gated pages  

## Run Locally

```bash
# 1. Install
cd liveforms && pnpm install

# 2. Configure Supabase
# Create .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# 3. Run migration
# Copy supabase/migrations/001_initial_schema.sql to Supabase SQL Editor

# 4. Start
pnpm dev
```

## Test Flow

1. Visit `http://localhost:3000`
2. Click "Get Started" → Sign up
3. Create a form → Add fields → Auto-saves
4. Go to Dashboard → See your forms
5. Edit/Delete forms

## Key Files

```
src/
├── app/
│   ├── login/page.tsx          # Login page
│   ├── signup/page.tsx         # Signup page
│   ├── dashboard/page.tsx      # User dashboard
│   └── editor/
│       ├── new/page.tsx        # Create form
│       └── [id]/page.tsx       # Edit form
├── components/
│   ├── auth/                   # Auth forms
│   ├── editor/                 # Form editor
│   └── dashboard/              # Dashboard UI
├── lib/
│   ├── auth/actions.ts         # Auth server actions
│   ├── forms/actions.ts        # Form CRUD actions
│   └── forms/queries.ts        # Database queries
└── hooks/
    ├── use-form-editor.ts      # Form state
    └── use-auto-save.ts        # Auto-save logic
```

## Architecture

- **Server Components**: Pages, initial data fetching
- **Client Components**: Interactive UI (editor, forms)
- **Server Actions**: Database mutations, auth
- **Hooks**: Reusable logic (auto-save, form state)
- **RLS Policies**: Row-level security on all tables

## Next: Week 3

- Real-time collaboration (Supabase Realtime)
- Form sharing (public links)
- Form submissions (public form view)

See `WEEK1.md` and `WEEK2.md` for details.
