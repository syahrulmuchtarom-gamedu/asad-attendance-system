# Absensi Penderesan ASAD

Website absensi web untuk organisasi ASAD dengan struktur hierarki Daerah > Desa > Kelompok. Sistem mendukung input absensi bulanan dengan perhitungan persentase kehadiran otomatis dan fitur drill-down laporan.

## 🚀 Fitur Utama

### Authentication & Authorization
- **Super Admin**: Kelola semua data, user management, master data, input absensi semua desa
- **Koordinator Desa**: Input absensi untuk kelompok di desanya saja
- **Koordinator Daerah**: View semua laporan daerah
- **Viewer**: View dan print laporan
- **Astrida**: Input absensi semua desa + view laporan semua desa (tanpa user management & master data)

### Dashboard per Role
- **Super Admin**: Overview semua desa, user management, master data, input absensi per desa
- **Koordinator Desa**: Form input absensi langsung untuk kelompok desanya
- **Koordinator Daerah**: Laporan real-time semua desa
- **Viewer**: Laporan read-only dengan fungsi print
- **Astrida**: Input absensi semua desa + laporan semua desa (tanpa user management)

### Input Absensi dengan Desa Selector
- **Super Admin**: Pilih desa dari grid card → Input kelompok desa tersebut
- **Koordinator Desa**: Langsung form input kelompok desanya
- UPSERT functionality: Auto-detect insert baru atau update existing
- Input terpisah untuk Putra dan Putri per kelompok
- Indikator visual: data tersimpan (hijau), data diubah (biru)
- Validasi target maksimal per kelompok

### Perhitungan Otomatis
- Persentase per kelompok: (hadir/target) × 100%
- Persentase per desa: total hadir semua kelompok/total target desa
- Agregasi real-time saat input data
- Summary cards: Total Target, Total Hadir, Persentase

### Laporan dengan Drill-Down
- **Laporan Kehadiran**: Tabel per desa dengan drill-down ke detail kelompok
- **Klik nama desa** → Modal pop-up detail kelompok (putra/putri terpisah)
- Filter bulan/tahun dengan data real-time
- Status indikator: Sangat Baik (≥90%), Baik (≥80%), Perlu Perbaikan (<80%)
- Export ke PDF dan Excel (planned)
- Print-friendly layout

## 🛠 Tech Stack

- **Frontend**: Next.js 14.2.32 dengan App Router
- **UI Framework**: React 18.2.0
- **Styling**: Tailwind CSS 3.3.6 + Shadcn/ui components
- **UI Components**: Radix UI primitives (@radix-ui/*)
- **Theme System**: next-themes 0.2.1 dengan smooth dark mode
- **Icons**: Lucide React 0.294.0
- **Database**: Supabase (PostgreSQL) dengan @supabase/supabase-js 2.38.5
- **Authentication**: Custom session dengan Cookie + localStorage fallback
- **State Management**: React useState/useEffect + React Hook Form 7.48.2
- **Validation**: Zod 3.22.4
- **Export**: jsPDF 2.5.1 + xlsx 0.18.5 (planned)
- **Date Handling**: date-fns 2.30.0
- **Security**: DOMPurify + Validator.js
- **Deployment**: Vercel (auto-deploy from GitHub)
- **Repository**: GitHub

## 📊 Struktur Data

### Desa dan Kelompok:
1. **Kapuk Melati**: Melati A, Melati B, BGN (3 kelompok)
2. **Jelambar**: Indah, Damar, Jaya, Pejagalan (4 kelompok)
3. **Cengkareng**: Fajar A, Fajar B, Fajar C (3 kelompok)
4. **Kebon Jahe**: Kebon Jahe A, Kebon Jahe B, Garikas, Taniwan (4 kelompok)
5. **Bandara**: Prima, Rawa Lele, Kampung Duri (3 kelompok)
6. **Taman Kota**: Rawa Buaya A, Rawa Buaya B, Taman Kota A, Taman Kota B (4 kelompok)
7. **Kalideres**: Tegal Alur A, Tegal Alur B, Prepedan A, Prepedan B, Kebon Kelapa (5 kelompok)
8. **Cipondoh**: Griya Permata, Semanan A, Semanan B, Pondok Bahar (4 kelompok)

**Total**: 8 desa, 30 kelompok
**Target per kelompok**: 25 putra + 25 putri = 50 orang per kelompok

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Akun Supabase
- Akun Vercel (untuk deployment)

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd attendance-system-asad
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` dengan konfigurasi Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. **Setup database**
- Buat project baru di Supabase
- Jalankan SQL schema dari file `supabase-schema.sql`
- Jalankan SQL untuk test users: `create-super-admin.sql`
- Jalankan SQL untuk user Astrida: `create-astrida-user.sql`
- Perbaiki desa_id koordinator: `fix-koordinator-desa-id.sql`
- Pastikan semua koordinator desa punya desa_id yang benar

5. **Run development server**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Struktur Project

```
attendance-system/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Dashboard pages per role
│   ├── absensi/          # Attendance input
│   ├── laporan/          # Reports
│   └── api/              # API routes
├── components/            # Reusable components
│   ├── ui/               # Shadcn/ui components
│   ├── forms/            # Form components
│   ├── tables/           # Table components
│   ├── charts/           # Chart components
│   └── layouts/          # Layout components
├── lib/                  # Utilities and configurations
│   ├── supabase/         # Supabase client config
│   ├── utils/            # Utility functions
│   ├── validations/      # Zod schemas
│   └── constants/        # App constants
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
└── middleware.ts         # Next.js middleware
```

## 🔐 Authentication & Authorization

### User Roles
- **super_admin**: Full access ke semua fitur, input absensi semua desa
- **koordinator_desa**: Input absensi untuk desa tertentu saja (filtered by desa_id)
- **koordinator_daerah**: View laporan semua desa
- **viewer**: Read-only access ke laporan
- **astrida**: Input absensi semua desa + view laporan semua desa (tanpa user management & master data)

### Session Management
- **Primary**: HTTP Cookie dengan user session data
- **Fallback**: localStorage untuk client-side access
- **Auto-redirect**: Ke login jika session tidak valid
- **Role-based filtering**: API otomatis filter data berdasarkan role dan desa_id

### Route Protection
Middleware otomatis melindungi route berdasarkan role:
- `/dashboard/super-admin/*` - Hanya Super Admin
- `/dashboard/koordinator-desa/*` - Hanya Koordinator Desa
- `/dashboard/koordinator-daerah/*` - Hanya Koordinator Daerah
- `/dashboard/viewer/*` - Hanya Viewer
- `/dashboard/astrida/*` - Hanya Astrida
- `/absensi` - Super Admin (semua desa) + Koordinator Desa (desa sendiri) + Astrida (semua desa)
- `/laporan` - Semua role dengan filter sesuai akses

## 📊 Database Schema

### Tables Structure

#### 1. **users** - User Management
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'koordinator_desa', 'koordinator_daerah', 'viewer', 'astrida')),
  desa_id BIGINT REFERENCES desa(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_desa_id ON users(desa_id);
```

#### 2. **desa** - Master Data Desa
```sql
CREATE TABLE desa (
  id BIGSERIAL PRIMARY KEY,
  nama_desa VARCHAR(100) UNIQUE NOT NULL,
  kode_desa VARCHAR(10) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert 8 Desa
INSERT INTO desa (nama_desa, kode_desa) VALUES
('Kapuk Melati', 'KM'),
('Jelambar', 'JB'),
('Cengkareng', 'CK'),
('Kebon Jahe', 'KJ'),
('Bandara', 'BD'),
('Taman Kota', 'TK'),
('Kalideres', 'KD'),
('Cipondoh', 'CP');
```

#### 3. **kelompok** - Master Data Kelompok
```sql
CREATE TABLE kelompok (
  id BIGSERIAL PRIMARY KEY,
  desa_id BIGINT NOT NULL REFERENCES desa(id) ON DELETE CASCADE,
  nama_kelompok VARCHAR(100) NOT NULL,
  target_putra INTEGER DEFAULT 25,
  target_putri INTEGER DEFAULT 25,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(desa_id, nama_kelompok)
);

CREATE INDEX idx_kelompok_desa_id ON kelompok(desa_id);

-- Insert 30 Kelompok (contoh untuk Kapuk Melati)
INSERT INTO kelompok (desa_id, nama_kelompok, target_putra, target_putri) VALUES
((SELECT id FROM desa WHERE nama_desa = 'Kapuk Melati'), 'Melati A', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Kapuk Melati'), 'Melati B', 25, 25),
((SELECT id FROM desa WHERE nama_desa = 'Kapuk Melati'), 'BGN', 25, 25);
-- ... (ulangi untuk 7 desa lainnya)
```

#### 4. **absensi** - Data Kehadiran Bulanan
```sql
CREATE TABLE absensi (
  id BIGSERIAL PRIMARY KEY,
  kelompok_id BIGINT NOT NULL REFERENCES kelompok(id) ON DELETE CASCADE,
  bulan INTEGER NOT NULL CHECK (bulan BETWEEN 1 AND 12),
  tahun INTEGER NOT NULL CHECK (tahun >= 2024),
  hadir_putra INTEGER DEFAULT 0 CHECK (hadir_putra >= 0),
  hadir_putri INTEGER DEFAULT 0 CHECK (hadir_putri >= 0),
  input_by BIGINT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(kelompok_id, bulan, tahun)
);

CREATE INDEX idx_absensi_kelompok_id ON absensi(kelompok_id);
CREATE INDEX idx_absensi_bulan_tahun ON absensi(bulan, tahun);
CREATE INDEX idx_absensi_input_by ON absensi(input_by);
```

#### 5. **settings** - Application Settings (Optional)
```sql
CREATE TABLE settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  setting_value TEXT,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, description) VALUES
('app_name', 'Absensi Penderesan ASAD', 'Nama aplikasi'),
('contact_email', 'support@asad.com', 'Email kontak'),
('contact_phone', '+62-xxx-xxxx-xxxx', 'Nomor telepon kontak');
```

### Database Features
- **UPSERT Logic**: API otomatis handle insert baru atau update existing menggunakan unique constraint
- **Role-based Filtering**: Query otomatis filter berdasarkan user role dan desa_id
- **Data Aggregation**: Real-time calculation untuk laporan dengan JOIN queries
- **Referential Integrity**: Foreign keys dengan CASCADE delete untuk data consistency
- **Indexes**: Optimized queries dengan proper indexing
- **Constraints**: Data validation di database level (CHECK, UNIQUE, NOT NULL)
- **Timestamps**: Auto-tracking created_at dan updated_at untuk audit trail

## 🎨 UI/UX Features

### Dark Mode Support
- **Smooth theme transitions** with cubic-bezier easing (0.3s duration)
- **System preference detection** (auto light/dark)
- **Manual toggle** with Light/Dark/System options
- **WCAG compliant** contrast ratios (4.5:1 minimum)
- **Optimized colors**: #1a1a1a backgrounds, #e5e5e5 text
- **Accessibility friendly** with reduced motion support
- **Persistent theme** via localStorage

### Responsive Design
- **Mobile-first approach** dengan breakpoint optimization
- **Breakpoints**: 
  - Mobile: 320px - 767px (Card layout)
  - Tablet: 768px - 1023px (Hybrid layout)
  - Desktop: 1024px+ (Table layout)
- **Adaptive Components**:
  - Desktop: Table view untuk data management
  - Mobile: Card view dengan touch-friendly buttons
- **Touch-optimized**: Button size minimal 44x44px untuk tap target
- **Smooth scrolling** dan gesture support

### Modal & Dialog System
- **Pop-up forms** untuk edit/create (tidak perlu scroll)
- **Backdrop blur** untuk fokus ke konten
- **ESC key** dan click outside untuk close
- **Smooth animations** (zoom in/out, fade)
- **Auto-scroll** untuk form panjang
- **Accessibility compliant** dengan ARIA labels

### Accessibility (WCAG 2.1 AA)
- **Keyboard navigation** support penuh
- **Screen reader friendly** dengan semantic HTML
- **High contrast colors** (light & dark modes)
- **Focus indicators** yang jelas
- **Reduced motion** support untuk users dengan vestibular disorders
- **ARIA labels** untuk interactive elements
- **Alt text** untuk images

### Print Support
- **Print-optimized layouts** dengan @media print
- **Hide navigation** dan interactive elements saat print
- **Professional report formatting** dengan proper margins
- **Page break** optimization untuk tabel panjang

## 🔧 Development

### Code Quality
- **TypeScript 5.3.2** untuk type safety
- **ESLint 8.54.0** untuk code linting
- **Zod 3.22.4** untuk runtime validation
- **React Hook Form 7.48.2** untuk form management
- **Strict mode** enabled untuk development

### Performance Optimization
- **Code splitting** per route dengan Next.js App Router
- **Lazy loading** components dengan dynamic imports
- **Image optimization** dengan Next.js Image component
- **Efficient database queries** dengan proper indexing
- **Memoization** untuk expensive calculations
- **Debouncing** untuk search dan filter

### Security Best Practices
- **Input validation** dengan Zod schemas
- **Sanitization** dengan DOMPurify untuk XSS prevention
- **SQL Injection** prevention via Supabase parameterized queries
- **CSRF protection** dengan SameSite cookies
- **Secure headers** via next.config.js
- **Password hashing** (implement bcrypt di production)
- **Rate limiting** (implement di API routes)
- **Environment variables** untuk sensitive data

### Development Workflow
```bash
# Development server dengan hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build

# Production server
npm start
```

## 📈 Deployment

### Vercel Deployment
1. Push code ke GitHub
2. Connect repository ke Vercel
3. Set environment variables di Vercel dashboard
4. Deploy otomatis setiap push ke main branch

### Environment Variables untuk Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 🧪 Testing

### Manual Testing Checklist

#### Authentication & Authorization
- [x] Login/logout functionality (cookie + localStorage)
- [x] Role-based access control (5 roles)
- [x] Session persistence across page refresh
- [x] Auto-redirect ke login jika session expired
- [x] Middleware protection untuk protected routes

#### User Management (Super Admin)
- [x] CRUD operations untuk users
- [x] Modal pop-up form (edit/create)
- [x] Reset password functionality
- [x] Role dropdown dengan 5 options
- [x] Active/inactive toggle
- [x] Responsive card layout di mobile
- [x] Desktop table layout

#### Input Absensi
- [x] Super Admin: Desa selector → Input kelompok
- [x] Astrida: Desa selector → Input kelompok (sama seperti Super Admin)
- [x] Koordinator Desa: Langsung form kelompok desanya (filtered by desa_id)
- [x] UPSERT functionality (insert baru + update existing)
- [x] Visual indicators (data tersimpan hijau, data diubah biru)
- [x] Validasi target maksimal per kelompok
- [x] Input terpisah untuk Putra dan Putri

#### Laporan & Reports
- [x] Laporan dengan drill-down (klik desa → detail kelompok)
- [x] Modal pop-up untuk detail kelompok
- [x] Real-time aggregation dan filtering
- [x] Filter bulan/tahun
- [x] Status indikator (Sangat Baik/Baik/Perlu Perbaikan)
- [x] Perhitungan persentase otomatis
- [ ] Export to PDF (planned)
- [ ] Export to Excel (planned)
- [x] Print layouts

#### UI/UX
- [x] Dark mode functionality (Light/Dark/System toggle)
- [x] Theme persistence dan smooth transitions
- [x] Mobile responsiveness (iOS & Android)
- [x] Touch-friendly buttons (44x44px minimum)
- [x] Modal dialogs dengan backdrop blur
- [x] Loading states
- [x] Toast notifications
- [x] Error handling

#### Performance
- [x] Fast page load (<3s)
- [x] Smooth animations (60fps)
- [x] Efficient database queries
- [x] No memory leaks

#### Accessibility
- [x] Keyboard navigation
- [x] Screen reader support (ARIA labels)
- [x] High contrast colors
- [x] Focus indicators
- [x] Reduced motion support

### Test Users
Buat test users untuk setiap role:
```sql
-- Super Admin
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('admin', 'admin123', 'Super Administrator', 'super_admin', NULL, true);

-- Astrida User (akses input semua desa + laporan)
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('astrida', 'astrida123', 'Astrida User', 'astrida', NULL, true);

-- Koordinator Desa (harus punya desa_id yang valid)
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('koordinator_kalideres', 'kalideres123', 'Koordinator Kalideres', 'koordinator_desa', 
 (SELECT id FROM desa WHERE nama_desa = 'Kalideres'), true),
('koordinator_bandara', 'bandara123', 'Koordinator Bandara', 'koordinator_desa', 
 (SELECT id FROM desa WHERE nama_desa = 'Bandara'), true);

-- Koordinator Daerah (view semua laporan)
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('koordinator_daerah', 'daerah123', 'Koordinator Daerah', 'koordinator_daerah', NULL, true);

-- Viewer (read-only)
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('viewer', 'viewer123', 'Viewer User', 'viewer', NULL, true);
```

### Fix Existing Data
```sql
-- Perbaiki desa_id untuk koordinator yang sudah ada
UPDATE users 
SET desa_id = (SELECT id FROM desa WHERE nama_desa = 'Bandara')
WHERE username = 'koordinator_bandara' AND role = 'koordinator_desa';

-- Pastikan semua koordinator desa punya desa_id
SELECT username, full_name, role, desa_id 
FROM users 
WHERE role = 'koordinator_desa' AND desa_id IS NULL;
-- Jika ada hasil, update manual dengan desa_id yang sesuai
```
```

## 📚 API Documentation

### Authentication Endpoints

#### `POST /api/auth/login`
Login dengan username dan password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "full_name": "Super Administrator",
    "role": "super_admin",
    "desa_id": null
  }
}
```

#### `POST /api/auth/logout`
Logout dan clear session.

---

### User Management Endpoints

#### `GET /api/users`
Get all users (Super Admin only).

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "username": "admin",
      "full_name": "Super Administrator",
      "role": "super_admin",
      "desa_id": null,
      "is_active": true
    }
  ]
}
```

#### `POST /api/users`
Create new user (Super Admin only).

**Request Body:**
```json
{
  "username": "newuser",
  "password": "password123",
  "full_name": "New User",
  "role": "viewer",
  "is_active": true
}
```

#### `PUT /api/users`
Update existing user (Super Admin only).

**Request Body:**
```json
{
  "id": 1,
  "username": "admin",
  "full_name": "Updated Name",
  "role": "super_admin",
  "is_active": true,
  "resetPassword": false
}
```

#### `DELETE /api/users?id={userId}`
Delete user (Super Admin only).

---

### Master Data Endpoints

#### `GET /api/desa`
Get all desa.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nama_desa": "Kapuk Melati",
      "kode_desa": "KM"
    }
  ]
}
```

#### `GET /api/kelompok`
Get kelompok data (filtered by role).

**Query Parameters:**
- `desa` (optional): Filter by nama_desa

**Role-based Filtering:**
- Super Admin & Astrida: Semua kelompok atau filter by `?desa=NamaDesa`
- Koordinator Desa: Hanya kelompok desanya (by desa_id)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nama_kelompok": "Melati A",
      "desa_id": 1,
      "target_putra": 25,
      "target_putri": 25,
      "desa": {
        "nama_desa": "Kapuk Melati"
      }
    }
  ]
}
```

---

### Absensi Endpoints

#### `GET /api/absensi`
Get attendance data (filtered by role).

**Query Parameters:**
- `bulan` (required): 1-12
- `tahun` (required): 2024+
- `desa` (optional): Filter by nama_desa

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "kelompok_id": 1,
      "bulan": 1,
      "tahun": 2025,
      "hadir_putra": 20,
      "hadir_putri": 22,
      "kelompok": {
        "nama_kelompok": "Melati A",
        "target_putra": 25,
        "target_putri": 25
      }
    }
  ]
}
```

#### `POST /api/absensi`
Create new attendance record.

**Request Body:**
```json
{
  "kelompok_id": 1,
  "bulan": 1,
  "tahun": 2025,
  "hadir_putra": 20,
  "hadir_putri": 22
}
```

#### `PUT /api/absensi`
Update existing attendance (with UPSERT fallback).

**UPSERT Logic:**
1. Coba UPDATE existing record (by kelompok_id, bulan, tahun)
2. Jika tidak ada (error PGRST116) → INSERT new record
3. Return success message

**Request Body:**
```json
{
  "kelompok_id": 1,
  "bulan": 1,
  "tahun": 2025,
  "hadir_putra": 23,
  "hadir_putri": 24
}
```

---

### Laporan Endpoints

#### `GET /api/laporan`
Generate aggregated reports per desa.

**Query Parameters:**
- `bulan` (required): 1-12
- `tahun` (required): 2024+

**Response:**
```json
{
  "data": [
    {
      "desa_id": 1,
      "nama_desa": "Kapuk Melati",
      "total_target_putra": 75,
      "total_target_putri": 75,
      "total_hadir_putra": 65,
      "total_hadir_putri": 68,
      "persentase_putra": 86.67,
      "persentase_putri": 90.67,
      "persentase_total": 88.67
    }
  ]
}
```

#### `GET /api/laporan/detail`
Get detailed kelompok data per desa.

**Query Parameters:**
- `desa` (required): nama_desa
- `bulan` (required): 1-12
- `tahun` (required): 2024+

**Response:**
```json
{
  "data": [
    {
      "kelompok_id": 1,
      "nama_kelompok": "Melati A",
      "target_putra": 25,
      "target_putri": 25,
      "hadir_putra": 20,
      "hadir_putri": 22,
      "persentase_putra": 80.00,
      "persentase_putri": 88.00
    }
  ]
}
```

---

### Settings Endpoints

#### `GET /api/settings`
Get application settings.

#### `PUT /api/settings`
Update settings (Super Admin only).

---

### Error Handling

Semua API endpoint menggunakan format error yang konsisten:

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common Error Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

**Example Error:**
```json
{
  "error": "Username already exists",
  "code": "DUPLICATE_USERNAME",
  "details": {
    "field": "username",
    "value": "admin"
  }
}
```

## 🤝 Contributing

Kontribusi sangat diterima! Ikuti langkah berikut:

### Development Workflow

1. **Fork repository**
   ```bash
   # Fork via GitHub UI, lalu clone
   git clone https://github.com/YOUR_USERNAME/absensi-asad.git
   cd absensi-asad
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   # atau
   git checkout -b fix/bug-fix
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Setup environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local dengan credentials Anda
   ```

5. **Make changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments untuk logic kompleks
   - Test thoroughly

6. **Test locally**
   ```bash
   npm run dev
   npm run type-check
   npm run lint
   ```

7. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   # atau
   git commit -m "fix: resolve bug in user management"
   ```

   **Commit Message Convention:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

8. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```

9. **Open Pull Request**
   - Buka GitHub repository
   - Click "New Pull Request"
   - Isi description dengan detail perubahan
   - Link ke issue (jika ada)
   - Request review

### Code Style Guidelines

- **TypeScript**: Use strict typing, avoid `any`
- **Components**: Functional components dengan hooks
- **Naming**: 
  - Components: PascalCase (`UserCard.tsx`)
  - Functions: camelCase (`getUserData`)
  - Constants: UPPER_SNAKE_CASE (`MAX_USERS`)
- **Imports**: Group by external → internal → relative
- **Comments**: Explain "why", not "what"

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added untuk complex logic
- [ ] No console.log() left in code
- [ ] TypeScript types properly defined
- [ ] Tested on desktop & mobile
- [ ] No breaking changes (or documented)
- [ ] Documentation updated (if needed)

## 📂 Project Structure

```
absensi-asad/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication pages
│   │   ├── login/              # Login page
│   │   └── layout.tsx          # Auth layout
│   ├── dashboard/              # Dashboard pages
│   │   ├── super-admin/        # Super Admin dashboard
│   │   │   └── users/         # User management
│   │   ├── koordinator-desa/   # Koordinator Desa dashboard
│   │   ├── koordinator-daerah/ # Koordinator Daerah dashboard
│   │   ├── viewer/            # Viewer dashboard
│   │   ├── astrida/           # Astrida dashboard
│   │   └── layout.tsx         # Dashboard layout
│   ├── absensi/               # Attendance input
│   │   └── page.tsx
│   ├── laporan/               # Reports
│   │   ├── desa/             # Desa reports
│   │   └── page.tsx
│   ├── laporan-dki/          # DKI reports
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication APIs
│   │   ├── users/           # User management APIs
│   │   ├── desa/            # Desa APIs
│   │   ├── kelompok/        # Kelompok APIs
│   │   ├── absensi/         # Absensi APIs
│   │   ├── laporan/         # Report APIs
│   │   └── settings/        # Settings APIs
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── ui/                 # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── forms/              # Form components
│   │   ├── login-form.tsx
│   │   ├── absensi-form.tsx
│   │   └── ...
│   ├── tables/             # Table components
│   ├── layouts/            # Layout components
│   ├── theme-provider.tsx  # Theme provider
│   └── client-toaster.tsx  # Toast notifications
├── lib/                    # Utilities and configs
│   ├── supabase/          # Supabase client
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   ├── auth/              # Auth utilities
│   │   └── session.ts
│   ├── utils/             # Helper functions
│   │   ├── calculation-helpers.ts
│   │   ├── color-helpers.ts
│   │   └── index.ts
│   ├── validations/       # Zod schemas
│   └── constants/         # App constants
├── hooks/                 # Custom React hooks
│   ├── use-toast.ts
│   └── use-theme.ts
├── types/                 # TypeScript types
│   └── index.ts
├── middleware.ts          # Next.js middleware (route protection)
├── database-schema.sql    # Database schema
├── .env.local.example     # Environment variables example
├── DEPLOYMENT.md          # Deployment guide
├── README.md              # This file
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind config
└── next.config.js         # Next.js config
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

### Untuk Support dan Pertanyaan:

**Email**: support@asad.com

**GitHub Issues**: [Report Bug atau Request Feature](https://github.com/YOUR_USERNAME/absensi-asad/issues)

**Documentation**:
- [README.md](README.md) - Overview dan setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [database-schema.sql](database-schema.sql) - Database schema

### Frequently Asked Questions (FAQ)

**Q: Bagaimana cara reset password user?**
A: Login sebagai Super Admin → User Management → Click tombol Reset pada user → Password akan direset ke `{username}123`

**Q: Koordinator Desa tidak bisa input absensi?**
A: Pastikan user tersebut memiliki `desa_id` yang valid di database. Check dengan query:
```sql
SELECT username, role, desa_id FROM users WHERE role = 'koordinator_desa';
```

**Q: Dark mode tidak persist setelah refresh?**
A: Clear browser cache dan localStorage, lalu set theme lagi. Theme disimpan di localStorage dengan key `theme`.

**Q: Error "Missing Description" di console?**
A: Hard refresh browser (Ctrl+Shift+R) untuk clear cache. Warning ini sudah di-fix di v1.2.0.

**Q: Mobile layout tidak responsive?**
A: Pastikan menggunakan versi terbaru (v1.2.0+). Clear browser cache jika masih bermasalah.

**Q: Bagaimana cara export laporan ke PDF/Excel?**
A: Fitur ini masih dalam development (planned). Sementara gunakan fungsi Print browser.

### Reporting Issues

Jika menemukan bug, buat issue di GitHub dengan informasi:
1. **Deskripsi bug**: Apa yang terjadi?
2. **Steps to reproduce**: Langkah-langkah untuk reproduce bug
3. **Expected behavior**: Apa yang seharusnya terjadi?
4. **Screenshots**: Jika memungkinkan
5. **Environment**: Browser, OS, device
6. **Console errors**: Screenshot dari browser console

### Feature Requests

Punya ide fitur baru? Buat issue dengan label `enhancement` dan jelaskan:
1. **Use case**: Untuk apa fitur ini?
2. **Proposed solution**: Bagaimana implementasinya?
3. **Alternatives**: Solusi alternatif yang sudah dipertimbangkan?
4. **Priority**: Low / Medium / High

## 🔄 Changelog

### v1.2.0 (2025-01-11) - Mobile Optimization
- ✅ **Mobile-First Responsive Design**:
  - User Management: Desktop table → Mobile card layout
  - Breakpoint optimization (768px)
  - Touch-friendly buttons (44x44px minimum)
  - Tested on iOS & Android browsers
- ✅ **Modal Dialog System**:
  - Edit/Create user via pop-up modal (no scroll needed)
  - Backdrop blur untuk fokus
  - ESC key & click outside support
  - Smooth zoom animations
- ✅ **Accessibility Improvements**:
  - DialogDescription untuk screen readers
  - ARIA labels compliance
  - WCAG 2.1 AA compliant
- ✅ **Bug Fixes**:
  - Fixed console warning untuk Dialog accessibility
  - Browser cache handling
  - Dark mode support untuk semua modal components

### v1.1.0 (2025-01-10) - Dark Mode & Astrida Role
- ✅ **Dark Mode System**: Smooth theme transitions dengan next-themes
- ✅ **Astrida Role**: Role khusus dengan akses input absensi semua desa + laporan
- ✅ **Theme Features**: 
  - Default light mode dengan user toggle
  - Light/Dark/System options
  - WCAG compliant colors (#1a1a1a backgrounds, #e5e5e5 text)
  - Smooth cubic-bezier transitions (0.3s duration)
  - Theme persistence di localStorage
  - Accessibility support (prefers-reduced-motion)
- ✅ **Enhanced UI**: All components mendukung dark mode
- ✅ **User Management**: Dropdown role di form user sudah include Astrida

### v1.0.0 (2025-01-09) - Initial Release
- ✅ **Authentication System**: Custom session dengan cookie + localStorage fallback
- ✅ **Role-based Access**: 5 roles (Super Admin, Koordinator Desa, Koordinator Daerah, Viewer, Astrida)
- ✅ **Input Absensi**: 
  - Super Admin & Astrida: Desa selector → Form kelompok
  - Koordinator Desa: Langsung form kelompok desanya
  - UPSERT functionality (auto insert/update)
  - Visual indicators (data tersimpan hijau, data diubah biru)
- ✅ **Laporan dengan Drill-down**: 
  - Tabel per desa dengan klik untuk detail kelompok
  - Modal pop-up dengan data putra/putri terpisah
  - Real-time aggregation dan filtering
  - Status indikator (Sangat Baik/Baik/Perlu Perbaikan)
- ✅ **Database Schema**: 8 desa, 30 kelompok, target putra/putri terpisah
- ✅ **API Endpoints**: Role-based filtering, UPSERT logic, error handling
- ✅ **UI/UX**: Responsive design, loading states, status indicators, toast notifications

---

**Dibuat dengan ❤️ untuk Organisasi ASAD**