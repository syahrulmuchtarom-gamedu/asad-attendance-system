# Sistem Absensi ASAD

Sistem absensi web untuk organisasi ASAD dengan struktur hierarki Daerah > Desa > Kelompok. Sistem mendukung input absensi bulanan dengan perhitungan persentase kehadiran otomatis.

## 🚀 Fitur Utama

### Authentication & Authorization
- **Super Admin**: Kelola semua data, user management, master data
- **Koordinator Desa**: Input absensi untuk kelompok di desanya
- **Koordinator Daerah**: View semua laporan daerah
- **Viewer**: View dan print laporan

### Dashboard per Role
- **Super Admin**: Overview semua desa, user management, master data
- **Koordinator Desa**: Form input absensi + history desa
- **Koordinator Daerah**: Laporan real-time semua desa
- **Viewer**: Laporan read-only dengan fungsi print

### Input Absensi
- Form input per desa dengan daftar kelompok
- Pilihan bulan/tahun
- Input terpisah untuk Putra (minggu ke-2) dan Putri (minggu ke-4)
- Validasi: tidak boleh input duplikat untuk bulan yang sama
- Auto-save dan konfirmasi sebelum submit

### Perhitungan Otomatis
- Persentase per kelompok: (hadir/target) × 100%
- Persentase per desa: total hadir semua kelompok/total target desa
- Persentase daerah: total hadir semua desa/total target daerah (750 orang)

### Laporan & Export
- Tabel responsif dengan filter bulan/tahun
- Chart visualization (bar chart, pie chart)
- Export ke PDF dan Excel
- Print-friendly layout
- Real-time update data

## 🛠 Tech Stack

- **Frontend**: Next.js 14 dengan App Router
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Repository**: GitHub

## 📊 Struktur Data

### Desa dan Kelompok:
1. **Kapuk Melati**: Melati A, Melati B, BGN
2. **Jelambar**: Indah, Damar, Jaya, Pejagalan
3. **Cengkareng**: Fajar A, Fajar B, Fajar C
4. **Kebon Jahe**: Kebon Jahe A, Kebon Jahe B, Garikas, Taniwan
5. **Bandara**: Rawel, Prima, Kamdur
6. **Taman Kota**: Rawa Buaya A, Rawa Buaya B, Taman Kota A, Taman Kota B
7. **Kalideres**: Tegal Alur A, Tegal Alur B, Prepedan A, Prepedan B, Kebon Kelapa
8. **Cipondoh**: Griya Permata, Semanan A, Semanan B, Pondok Bahar

**Target per kelompok**: 25 orang laki-laki wajib hadir

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
- Pastikan RLS (Row Level Security) sudah aktif

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
- **super_admin**: Full access ke semua fitur
- **koordinator_desa**: Input absensi untuk desa tertentu
- **koordinator_daerah**: View laporan semua desa
- **viewer**: Read-only access ke laporan

### Route Protection
Middleware otomatis melindungi route berdasarkan role:
- `/dashboard/super-admin/*` - Hanya Super Admin
- `/dashboard/koordinator-desa/*` - Hanya Koordinator Desa
- `/dashboard/koordinator-daerah/*` - Hanya Koordinator Daerah
- `/dashboard/viewer/*` - Hanya Viewer

## 📊 Database Schema

### Tables
- **profiles**: User profiles dengan role dan desa assignment
- **desa**: Master data desa
- **kelompok**: Master data kelompok per desa
- **absensi**: Data kehadiran bulanan

### Key Features
- Row Level Security (RLS) untuk data protection
- Automatic triggers untuk timestamps
- Indexes untuk performance optimization
- Views untuk complex queries

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Breakpoints: mobile (320px+), tablet (768px+), desktop (1024px+)
- Touch-friendly interface

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast colors
- Focus indicators

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
- [ ] Login/logout functionality
- [ ] Role-based access control
- [ ] Absensi input dan validation
- [ ] Laporan generation
- [ ] Export functionality
- [ ] Print layouts
- [ ] Mobile responsiveness

### Test Users
Buat test users untuk setiap role:
```sql
-- Super Admin
INSERT INTO profiles (id, email, role) VALUES 
('uuid-1', 'admin@asad.com', 'super_admin');

-- Koordinator Desa
INSERT INTO profiles (id, email, role, desa_id) VALUES 
('uuid-2', 'koordinator@kapukmelati.com', 'koordinator_desa', 1);
```

## 📚 API Documentation

### Key Endpoints
- `GET /api/absensi` - Get attendance data
- `POST /api/absensi` - Create attendance record
- `GET /api/laporan` - Generate reports
- `GET /api/dashboard/stats` - Dashboard statistics

### Error Handling
Semua API endpoints menggunakan consistent error format:
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

### v1.0.0 (2024-01-01)
- Initial release
- Basic authentication system
- Role-based dashboards
- Attendance input system
- Report generation
- Export functionality

---

**Dibuat dengan ❤️ untuk Organisasi ASAD Cengkareng**