# Deployment Guide

## Prerequisites
- Vercel account
- Supabase project (production)
- Custom domain (optional)

## Step 1: Prepare Supabase

### 1.1 Create Production Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project (choose region close to users)
3. Wait for project to be ready (~2 minutes)

### 1.2 Run Migrations
1. Go to SQL Editor
2. Copy contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run
4. Verify tables created: `profiles`, `forms`, `submissions`

### 1.3 Get Credentials
1. Go to Project Settings → API
2. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep secure!)

## Step 2: Deploy to Vercel

### 2.1 Connect Repository
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
cd liveforms
vercel link
```

### 2.2 Set Environment Variables
```bash
# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_APP_URL

# Or via Vercel Dashboard:
# Project Settings → Environment Variables
```

**Required Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 2.3 Deploy
```bash
# Deploy to production
vercel --prod

# Or push to main branch (auto-deploy)
git push origin main
```

## Step 3: Post-Deployment

### 3.1 Verify Deployment
- [ ] Visit your production URL
- [ ] Sign up for an account
- [ ] Create a form
- [ ] Make form public
- [ ] Submit a response
- [ ] View submissions
- [ ] Export CSV/JSON

### 3.2 Configure Domain (Optional)
1. Go to Vercel Dashboard → Domains
2. Add your custom domain
3. Update DNS records
4. Wait for SSL certificate

### 3.3 Update Supabase URLs
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your production URL to:
   - Site URL
   - Redirect URLs

## Step 4: Monitoring

### 4.1 Error Tracking (Optional)
```bash
# Install Sentry
pnpm add @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

### 4.2 Analytics (Optional)
```bash
# Install Vercel Analytics
pnpm add @vercel/analytics

# Add to layout.tsx
import { Analytics } from '@vercel/analytics/react';
<Analytics />
```

### 4.3 Performance Monitoring
```bash
# Install Speed Insights
pnpm add @vercel/speed-insights

# Add to layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
<SpeedInsights />
```

## Step 5: Database Backup

### 5.1 Enable Backups
1. Go to Supabase Dashboard → Database → Backups
2. Enable daily backups
3. Configure retention period

### 5.2 Manual Backup
```bash
# Export database
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```

## Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf .next
pnpm build

# Check TypeScript
pnpm tsc --noEmit
```

### Environment Variables Not Working
- Redeploy after adding env vars
- Check variable names (case-sensitive)
- Verify values are correct

### Database Connection Issues
- Check Supabase project is active
- Verify RLS policies are enabled
- Check connection pooling limits

### 404 on Routes
- Verify all pages are in `src/app`
- Check dynamic routes `[id]` syntax
- Clear Vercel cache and redeploy

## Performance Optimization

### 1. Enable Caching
```typescript
// app/layout.tsx
export const revalidate = 3600; // 1 hour
```

### 2. Optimize Images
```typescript
// Use Next.js Image component
import Image from 'next/image';
<Image src="/logo.png" width={200} height={50} alt="Logo" />
```

### 3. Code Splitting
```typescript
// Dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

## Security Checklist

- [ ] Environment variables set
- [ ] RLS policies enabled
- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Rate limiting (Supabase)
- [ ] Input validation
- [ ] SQL injection prevention (RLS)
- [ ] XSS prevention (React)

## Maintenance

### Regular Tasks
- Monitor error logs
- Check performance metrics
- Review database usage
- Update dependencies
- Backup database

### Updates
```bash
# Update dependencies
pnpm update

# Check for security issues
pnpm audit

# Deploy updates
vercel --prod
```

## Rollback

### Revert Deployment
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

### Database Rollback
```bash
# Restore from backup
psql -h db.your-project.supabase.co -U postgres -d postgres < backup.sql
```

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Deployment Status:** Ready for Production ✅
