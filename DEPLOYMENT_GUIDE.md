# 🚀 Deployment Guide - Sistem Absensi ASAD

## 📋 **Project Information**
- **GitHub Repository**: `asad-attendance-system`
- **Supabase Project**: `asad-attendance-prod`
- **Vercel Project**: `asad-attendance-system`

## 🔧 **Step 1: Setup GitHub Repository**

### Create Repository
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: Sistem Absensi ASAD"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/asad-attendance-system.git
git branch -M main
git push -u origin main
```

### Repository Settings
- **Name**: `asad-attendance-system`
- **Description**: `Sistem Absensi Kelompok ASAD Cengkareng - Web-based attendance management system`
- **Visibility**: Private (recommended)
- **Topics**: `attendance`, `nextjs`, `supabase`, `typescript`, `asad`

## 🗄️ **Step 2: Setup Supabase Project**

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. **Project Name**: `asad-attendance-prod`
4. **Database Password**: Generate strong password
5. **Region**: Southeast Asia (Singapore) - closest to Indonesia

### Database Setup
1. Go to SQL Editor
2. Copy and paste content from `supabase-schema.sql`
3. Click "Run" to execute all SQL commands
4. Verify all tables are created successfully

### Get API Keys
1. Go to Settings > API
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Authentication Settings
1. Go to Authentication > Settings
2. **Site URL**: `https://asad-attendance-system.vercel.app`
3. **Redirect URLs**: Add your domain
4. Enable email confirmation if needed

## ☁️ **Step 3: Deploy to Vercel**

### Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import `asad-attendance-system` from GitHub
4. **Project Name**: `asad-attendance-system`

### Environment Variables
Add these in Vercel dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXTAUTH_SECRET=your-random-32-char-secret
NEXTAUTH_URL=https://asad-attendance-system.vercel.app
```

### Generate NEXTAUTH_SECRET
```bash
# Generate random secret
openssl rand -base64 32
```

### Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Test deployment at provided URL

## 👤 **Step 4: Create Initial Users**

### Super Admin User
1. Register through the app or create in Supabase Auth
2. Update role in SQL Editor:

```sql
-- Update user role to super_admin
UPDATE profiles 
SET role = 'super_admin' 
WHERE email = 'admin@asad-cengkareng.org';
```

### Test Users (Optional)
```sql
-- Koordinator Desa Kapuk Melati
UPDATE profiles 
SET role = 'koordinator_desa', desa_id = 1 
WHERE email = 'koordinator.kapukmelati@asad.org';

-- Koordinator Daerah
UPDATE profiles 
SET role = 'koordinator_daerah' 
WHERE email = 'koordinator.daerah@asad.org';

-- Viewer
UPDATE profiles 
SET role = 'viewer' 
WHERE email = 'viewer@asad.org';
```

## 🔒 **Step 5: Security Configuration**

### Supabase Security
1. **RLS Policies**: Verify all policies are active
2. **API Keys**: Keep service role key secure
3. **Database Access**: Restrict to application only

### Vercel Security
1. **Environment Variables**: Never expose in client
2. **Domain**: Configure custom domain if needed
3. **Headers**: Security headers already configured

## 📊 **Step 6: Testing Checklist**

### Authentication Testing
- [ ] User registration works
- [ ] Login/logout functionality
- [ ] Role-based access control
- [ ] Password reset (if enabled)

### Core Functionality
- [ ] Dashboard loads for each role
- [ ] Absensi input works
- [ ] Data validation works
- [ ] Reports generate correctly
- [ ] Export functions work

### Performance Testing
- [ ] Page load times < 3 seconds
- [ ] Mobile responsiveness
- [ ] Database queries optimized
- [ ] No console errors

## 🌐 **Step 7: Custom Domain (Optional)**

### Setup Custom Domain
1. Purchase domain (e.g., `attendance.asad-cengkareng.org`)
2. Add domain in Vercel dashboard
3. Configure DNS records as instructed
4. Update environment variables:

```env
NEXTAUTH_URL=https://attendance.asad-cengkareng.org
```

5. Update Supabase Site URL to match

## 📈 **Step 8: Monitoring & Maintenance**

### Vercel Analytics
- Enable Vercel Analytics for performance monitoring
- Monitor error rates and page load times

### Supabase Monitoring
- Monitor database usage
- Check API request limits
- Review authentication metrics

### Regular Maintenance
- [ ] Update dependencies monthly
- [ ] Monitor error logs
- [ ] Backup database regularly
- [ ] Review security settings

## 🚨 **Troubleshooting**

### Common Issues

**Build Errors**
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting issues
npm run lint
```

**Database Connection Issues**
- Verify environment variables
- Check Supabase project status
- Test connection from local environment

**Authentication Problems**
- Check redirect URLs in Supabase
- Verify NEXTAUTH_SECRET is set
- Clear browser cookies and try again

## 📞 **Support Information**

### Project Contacts
- **Technical Lead**: [Your Name]
- **Database Admin**: [Database Admin]
- **System Admin**: [System Admin]

### Emergency Contacts
- **Supabase Issues**: Check Supabase status page
- **Vercel Issues**: Check Vercel status page
- **Critical Bugs**: Create GitHub issue

## 🎯 **Success Criteria**

✅ **Deployment Successful When:**
- All users can access their respective dashboards
- Absensi input works without errors
- Reports generate correctly
- Export functions work properly
- Mobile interface is responsive
- No security vulnerabilities detected

---

**🎉 Congratulations! Sistem Absensi ASAD is now live and ready for production use!**

**Live URL**: `https://asad-attendance-system.vercel.app`
**Admin Panel**: Login with super admin credentials
**Documentation**: Available in repository README.md