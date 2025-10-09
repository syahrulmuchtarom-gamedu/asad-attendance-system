# 🚀 Quick Start Guide - Absensi ASAD

Panduan cepat untuk setup dan menjalankan aplikasi dalam 5 menit.

---

## ⚡ Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm atau yarn
- Akun Supabase ([Sign up](https://supabase.com))
- Git

---

## 📦 Installation (5 Steps)

### 1️⃣ Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/absensi-asad.git
cd absensi-asad
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment Variables
```bash
# Copy example file
cp .env.local.example .env.local

# Edit .env.local dengan text editor
# Isi dengan Supabase credentials Anda
```

**Minimal required:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXTAUTH_SECRET=generate_random_32_chars
NEXTAUTH_URL=http://localhost:3000
```

**Generate NEXTAUTH_SECRET:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 4️⃣ Setup Database
1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Create new project
3. Buka **SQL Editor**
4. Copy-paste isi file `database-schema.sql`
5. Click **Run**

### 5️⃣ Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🔐 Test Login

**Super Admin:**
- Username: `admin`
- Password: `admin123`

**Astrida:**
- Username: `astrida`
- Password: `astrida123`

**Koordinator Desa (Kalideres):**
- Username: `koordinator_kalideres`
- Password: `kalideres123`

**Koordinator Daerah:**
- Username: `koordinator_daerah`
- Password: `daerah123`

**Viewer:**
- Username: `viewer`
- Password: `viewer123`

---

## 📁 Project Structure (Simplified)

```
absensi-asad/
├── app/                    # Pages & API routes
│   ├── (auth)/login/      # Login page
│   ├── dashboard/         # Role-based dashboards
│   ├── absensi/          # Input absensi
│   ├── laporan/          # Reports
│   └── api/              # API endpoints
├── components/            # Reusable components
├── lib/                  # Utilities & configs
├── database-schema.sql   # Database setup
├── .env.local.example    # Environment template
└── README.md             # Full documentation
```

---

## 🎯 Common Tasks

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Type Check
```bash
npm run type-check
```

### Lint Code
```bash
npm run lint
npm run lint:fix
```

### Clean Build Cache
```bash
npm run clean
```

---

## 🔧 Troubleshooting

### Issue: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Database connection error"
- Check `.env.local` credentials
- Verify Supabase project is active
- Check internet connection

### Issue: "Port 3000 already in use"
```bash
# Kill process on port 3000
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "Build failed"
```bash
npm run type-check  # Check TypeScript errors
npm run lint        # Check linting errors
```

---

## 📚 Next Steps

1. **Read Full Documentation**: [README.md](README.md)
2. **Deploy to Production**: [DEPLOYMENT.md](DEPLOYMENT.md)
3. **Check Changelog**: [CHANGELOG.md](CHANGELOG.md)
4. **Customize**: Edit components, add features
5. **Contribute**: See Contributing section in README.md

---

## 🆘 Need Help?

- **Documentation**: README.md, DEPLOYMENT.md
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/absensi-asad/issues)
- **Email**: support@asad.com

---

## ✅ Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` configured
- [ ] Database schema executed
- [ ] Development server running (`npm run dev`)
- [ ] Login tested with test users
- [ ] All features working

**🎉 Ready to go! Happy coding!**
