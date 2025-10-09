# 🚀 Deployment Guide - Absensi Penderesan ASAD

Panduan lengkap untuk deploy aplikasi ke production menggunakan Vercel + Supabase.

---

## 📋 Prerequisites

- [x] Akun GitHub (untuk repository)
- [x] Akun Vercel (untuk hosting frontend)
- [x] Akun Supabase (untuk database)
- [x] Node.js 18+ installed locally
- [x] Git installed

---

## 🗄️ Step 1: Setup Supabase Database

### 1.1 Create Supabase Project
1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Isi:
   - **Name**: `absensi-asad-production`
   - **Database Password**: Generate strong password (simpan!)
   - **Region**: Singapore (Southeast Asia)
4. Wait ~2 menit untuk project setup

### 1.2 Run Database Schema
1. Di Supabase Dashboard, buka **SQL Editor**
2. Copy semua isi file `database-schema.sql`
3. Paste ke SQL Editor
4. Click **"Run"**
5. Verify: Check **Table Editor** → harus ada 5 tables (users, desa, kelompok, absensi, settings)

### 1.3 Get API Keys
1. Buka **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (untuk client-side)
   - **service_role key**: `eyJhbGc...` (untuk server-side, RAHASIA!)

### 1.4 Configure Row Level Security (RLS) - OPTIONAL
```sql
-- Enable RLS untuk security tambahan
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE desa ENABLE ROW LEVEL SECURITY;
ALTER TABLE kelompok ENABLE ROW LEVEL SECURITY;
ALTER TABLE absensi ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access
CREATE POLICY "Service role full access" ON users
FOR ALL USING (auth.role() = 'service_role');

-- Ulangi untuk table lain
```

---

## 📦 Step 2: Prepare GitHub Repository

### 2.1 Create Repository
```bash
# Di folder project
git init
git add .
git commit -m "Initial commit - Absensi ASAD v1.2.0"

# Create repo di GitHub, lalu:
git remote add origin https://github.com/YOUR_USERNAME/absensi-asad.git
git branch -M main
git push -u origin main
```

### 2.2 Add .gitignore
Pastikan `.gitignore` sudah include:
```
.env.local
.env*.local
node_modules/
.next/
out/
.vercel
```

### 2.3 Protect Sensitive Files
**JANGAN commit:**
- `.env.local` (environment variables)
- `node_modules/`
- `.next/` (build output)

---

## 🌐 Step 3: Deploy to Vercel

### 3.1 Connect GitHub to Vercel
1. Login ke [Vercel Dashboard](https://vercel.com)
2. Click **"Add New Project"**
3. **Import Git Repository** → Pilih repo `absensi-asad`
4. Click **"Import"**

### 3.2 Configure Project Settings
**Framework Preset**: Next.js (auto-detected)

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `.next` (default)
- Install Command: `npm install`

**Root Directory**: `./` (default)

### 3.3 Add Environment Variables
Di Vercel Dashboard → **Settings** → **Environment Variables**, tambahkan:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (RAHASIA!)

# NextAuth
NEXTAUTH_SECRET=<generate dengan: openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.vercel.app

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Optional
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

**PENTING**: 
- Set untuk **Production**, **Preview**, dan **Development**
- `SUPABASE_SERVICE_ROLE_KEY` hanya untuk Production & Preview

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait ~2-3 menit
3. Vercel akan auto-build dan deploy
4. Dapatkan URL: `https://your-project.vercel.app`

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Login
1. Buka `https://your-domain.vercel.app`
2. Login dengan test user:
   - Username: `admin`
   - Password: `admin123`
3. Verify dashboard muncul

### 4.2 Test Functionality
- [x] Login/Logout
- [x] User Management (Super Admin)
- [x] Input Absensi
- [x] Laporan Kehadiran
- [x] Dark Mode Toggle
- [x] Mobile Responsive (test di smartphone)

### 4.3 Check Console Errors
1. Buka Browser DevTools (F12)
2. Check **Console** → tidak ada error merah
3. Check **Network** → semua API calls success (200/201)

---

## 🔒 Step 5: Security Hardening (PRODUCTION)

### 5.1 Change Default Passwords
```sql
-- Di Supabase SQL Editor
UPDATE users SET password = 'NEW_STRONG_PASSWORD' WHERE username = 'admin';
-- Ulangi untuk semua test users
```

**PENTING**: Implement password hashing (bcrypt/argon2) di production!

### 5.2 Enable HTTPS Only
Vercel otomatis provide HTTPS. Pastikan:
- `NEXTAUTH_URL` pakai `https://`
- `NEXT_PUBLIC_APP_URL` pakai `https://`

### 5.3 Configure CORS (jika perlu)
Di Supabase Dashboard → **Settings** → **API**:
- Allowed Origins: `https://your-domain.vercel.app`

### 5.4 Rate Limiting
Implement di API routes (contoh: `/api/auth/login`):
```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});
```

### 5.5 Enable Supabase Auth (Optional)
Jika ingin pakai Supabase Auth instead of custom session:
1. Enable Email Auth di Supabase
2. Migrate dari custom session ke Supabase Auth
3. Update middleware.ts

---

## 🔄 Step 6: Auto-Deploy Setup

### 6.1 Configure Auto-Deploy
Vercel otomatis deploy setiap push ke GitHub:
- **Push ke `main`** → Deploy to Production
- **Push ke branch lain** → Deploy to Preview

### 6.2 Branch Strategy
```
main (production)
├── develop (staging)
└── feature/* (preview)
```

### 6.3 Deploy Workflow
```bash
# Development
git checkout develop
git add .
git commit -m "feat: new feature"
git push origin develop
# → Auto-deploy to preview URL

# Production
git checkout main
git merge develop
git push origin main
# → Auto-deploy to production URL
```

---

## 📊 Step 7: Monitoring & Analytics

### 7.1 Vercel Analytics
1. Di Vercel Dashboard → **Analytics**
2. Enable **Web Analytics** (free)
3. Monitor:
   - Page views
   - Performance (Core Web Vitals)
   - Errors

### 7.2 Supabase Monitoring
1. Di Supabase Dashboard → **Database**
2. Monitor:
   - Query performance
   - Database size
   - Connection pool

### 7.3 Error Tracking (Optional)
Integrate Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

---

## 🔧 Step 8: Custom Domain (Optional)

### 8.1 Add Custom Domain
1. Di Vercel Dashboard → **Settings** → **Domains**
2. Add domain: `absensi.asad.com`
3. Configure DNS:
   - Type: `CNAME`
   - Name: `absensi` (atau `@` untuk root)
   - Value: `cname.vercel-dns.com`
4. Wait ~10 menit untuk propagation

### 8.2 Update Environment Variables
```env
NEXTAUTH_URL=https://absensi.asad.com
NEXT_PUBLIC_APP_URL=https://absensi.asad.com
```

### 8.3 Force HTTPS Redirect
Vercel otomatis redirect HTTP → HTTPS.

---

## 🐛 Troubleshooting

### Issue: Build Failed
**Error**: `Module not found`
**Fix**: 
```bash
# Locally
npm install
npm run build
# Jika success, push ke GitHub
```

### Issue: Environment Variables Not Working
**Fix**:
1. Check typo di variable names
2. Redeploy: Vercel Dashboard → **Deployments** → **Redeploy**

### Issue: Database Connection Error
**Fix**:
1. Check Supabase project status (bisa down)
2. Verify API keys di Vercel env vars
3. Check Supabase logs: Dashboard → **Logs**

### Issue: 500 Internal Server Error
**Fix**:
1. Check Vercel logs: Dashboard → **Deployments** → Click deployment → **Logs**
2. Check API route errors
3. Verify database schema

### Issue: Session Not Persisting
**Fix**:
1. Check `NEXTAUTH_SECRET` di env vars
2. Clear browser cookies
3. Check middleware.ts logic

---

## 📝 Maintenance Checklist

### Daily
- [ ] Check error logs (Vercel + Supabase)
- [ ] Monitor uptime (Vercel Analytics)

### Weekly
- [ ] Review database size (Supabase Dashboard)
- [ ] Check slow queries
- [ ] Backup database (Supabase → Database → Backups)

### Monthly
- [ ] Update dependencies: `npm outdated` → `npm update`
- [ ] Security audit: `npm audit`
- [ ] Review user feedback
- [ ] Performance optimization

---

## 🆘 Support

**Issues?**
- GitHub Issues: [Link to repo issues]
- Email: support@asad.com
- Documentation: README.md

**Useful Links:**
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**Deployment Checklist:**
- [x] Supabase project created
- [x] Database schema executed
- [x] GitHub repository created
- [x] Vercel project connected
- [x] Environment variables configured
- [x] First deployment successful
- [x] Login tested
- [x] All features verified
- [x] Security hardening applied
- [x] Monitoring enabled

**🎉 Selamat! Aplikasi sudah live di production!**
