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

- **Frontend**: Next.js 14 dengan App Router
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Theme System**: next-themes dengan smooth dark mode
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom session dengan Cookie + localStorage fallback
- **State Management**: React useState/useEffect
- **Deployment**: Vercel
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

### Tables
- **users**: User accounts dengan username/password, role, desa_id
- **desa**: Master data desa (8 desa)
- **kelompok**: Master data kelompok per desa (30 kelompok total)
  - `target_putra`, `target_putri` per kelompok
  - Foreign key ke `desa_id`
- **absensi**: Data kehadiran bulanan
  - `hadir_putra`, `hadir_putri` per kelompok per bulan
  - `kelompok_id`, `bulan`, `tahun`, `input_by`
  - Unique constraint: (kelompok_id, bulan, tahun)

### Key Features
- **UPSERT Logic**: API otomatis handle insert baru atau update existing
- **Role-based Filtering**: Query otomatis filter berdasarkan user role dan desa_id
- **Data Aggregation**: Real-time calculation untuk laporan
- **Referential Integrity**: Foreign keys dengan proper constraints

## 🎨 UI/UX Features

### Dark Mode Support
- **Smooth theme transitions** with cubic-bezier easing
- **System preference detection** (auto light/dark)
- **Manual toggle** with Light/Dark/System options
- **WCAG compliant** contrast ratios (4.5:1 minimum)
- **Optimized colors**: #1a1a1a backgrounds, #e5e5e5 text
- **Accessibility friendly** with reduced motion support

### Responsive Design
- Mobile-first approach
- Breakpoints: mobile (320px+), tablet (768px+), desktop (1024px+)
- Touch-friendly interface

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast colors (light & dark modes)
- Focus indicators
- Reduced motion support

### Print Support
- Print-optimized layouts
- Hide navigation saat print
- Professional report formatting

## 🔧 Development

### Code Quality
- TypeScript untuk type safety
- ESLint untuk code linting
- Prettier untuk code formatting
- Zod untuk runtime validation

### Performance
- Code splitting per route
- Lazy loading components
- Image optimization
- Efficient database queries

### Security
- Input validation dan sanitization
- CSRF protection
- Secure headers
- Rate limiting

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
- [x] Login/logout functionality (cookie + localStorage)
- [x] Role-based access control (Super Admin vs Koordinator Desa vs Astrida)
- [x] Super Admin: Desa selector → Input kelompok
- [x] Astrida: Desa selector → Input kelompok (sama seperti Super Admin)
- [x] Koordinator Desa: Langsung form kelompok desanya (filtered by desa_id)
- [x] UPSERT functionality (insert baru + update existing)
- [x] Laporan dengan drill-down (klik desa → detail kelompok)
- [x] Real-time aggregation dan filtering
- [x] Visual indicators (data tersimpan, data diubah)
- [x] Dark mode functionality (Light/Dark/System toggle)
- [x] Theme persistence dan smooth transitions
- [ ] Export functionality (PDF/Excel - planned)
- [x] Print layouts
- [x] Mobile responsiveness

### Test Users
Buat test users untuk setiap role:
```sql
-- Super Admin
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('admin', 'admin123', 'Super Administrator', 'super_admin', NULL, true);

-- Astrida User
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('astrida', 'astrida123', 'Astrida User', 'astrida', NULL, true);

-- Koordinator Desa (harus punya desa_id yang valid)
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('koordinator_kalideres', 'kalideres123', 'Koordinator Kalideres', 'koordinator_desa', 
 (SELECT id FROM desa WHERE nama_desa = 'Kalideres'), true);

-- Koordinator Daerah
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('koordinator_daerah', 'daerah123', 'Koordinator Daerah', 'koordinator_daerah', NULL, true);

-- Viewer
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('viewer', 'viewer123', 'Viewer User', 'viewer', NULL, true);
```oordinator_desa', 
 (SELECT id FROM desa WHERE nama_desa = 'Kalideres'), true);

-- Perbaiki desa_id untuk koordinator yang sudah ada
UPDATE users 
SET desa_id = (SELECT id FROM desa WHERE nama_desa = 'Bandara')
WHERE username = 'koordinator_bandara';
```

## 📚 API Documentation

### Key Endpoints
- `GET /api/kelompok` - Get kelompok data (filtered by role)
  - Super Admin: semua kelompok atau filter by `?desa=NamaDesa`
  - Koordinator Desa: hanya kelompok desanya (by desa_id)
- `GET /api/absensi` - Get attendance data (filtered by role)
- `POST /api/absensi` - Create new attendance record
- `PUT /api/absensi` - Update existing attendance (with UPSERT fallback)
- `GET /api/laporan` - Generate aggregated reports per desa
- `GET /api/laporan/detail` - Get detailed kelompok data per desa
- `POST /api/auth/login` - Login with username/password

### UPSERT Logic
API `/api/absensi` PUT method menggunakan UPSERT:
1. Coba UPDATE existing record
2. Jika tidak ada (error PGRST116) → INSERT new record
3. Return success message

### Error Handling
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

Untuk support dan pertanyaan:
- Email: support@asad.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues](link-to-issues)

## 🔄 Changelog

### v1.1.0 (2025-01-10)
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

### v1.0.0 (2025-01-09)
- ✅ **Authentication System**: Custom session dengan cookie + localStorage fallback
- ✅ **Role-based Access**: Super Admin (semua desa) vs Koordinator Desa (desa sendiri)
- ✅ **Input Absensi**: 
  - Super Admin: Desa selector → Form kelompok
  - Koordinator Desa: Langsung form kelompok desanya
  - UPSERT functionality (auto insert/update)
  - Visual indicators (data tersimpan, data diubah)
- ✅ **Laporan dengan Drill-down**: 
  - Tabel per desa dengan klik untuk detail kelompok
  - Modal pop-up dengan data putra/putri terpisah
  - Real-time aggregation dan filtering
- ✅ **Database Schema**: 8 desa, 30 kelompok, target putra/putri terpisah
- ✅ **API Endpoints**: Role-based filtering, UPSERT logic, error handling
- ✅ **UI/UX**: Responsive design, loading states, status indicators

---

**Dibuat dengan ❤️ untuk Organisasi ASAD**