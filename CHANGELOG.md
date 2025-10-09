# Changelog

All notable changes to Absensi Penderesan ASAD will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2025-01-11

### Added
- **Mobile-First Responsive Design**
  - User Management page: Desktop table → Mobile card layout
  - Breakpoint optimization at 768px (Tailwind `md:`)
  - Touch-friendly buttons with 44x44px minimum tap target
  - Tested and verified on iOS Safari and Android Chrome
- **Modal Dialog System**
  - Edit/Create user via pop-up modal (eliminates need to scroll to top)
  - Backdrop blur effect for better focus
  - ESC key and click-outside-to-close support
  - Smooth zoom-in/zoom-out animations
  - Auto-scroll for long forms with `max-h-[90vh] overflow-y-auto`
- **Documentation**
  - Complete `database-schema.sql` with all tables, indexes, and test data
  - `.env.local.example` with detailed environment variable documentation
  - `DEPLOYMENT.md` with step-by-step production deployment guide
  - Enhanced README.md with API documentation and project structure
  - `CHANGELOG.md` for version tracking

### Fixed
- Console warning: "Missing Description for DialogContent" (added DialogDescription for accessibility)
- Browser cache handling for theme and modal updates
- Dark mode support for all modal components and hover states

### Changed
- User Management form moved from inline card to modal dialog
- Improved UX: No need to scroll when editing users from bottom of list
- Enhanced accessibility with proper ARIA labels (WCAG 2.1 AA compliant)

---

## [1.1.0] - 2025-01-10

### Added
- **Dark Mode System**
  - Smooth theme transitions with cubic-bezier easing (0.3s duration)
  - System preference detection (auto light/dark based on OS)
  - Manual toggle with Light/Dark/System options
  - WCAG compliant contrast ratios (4.5:1 minimum)
  - Optimized colors: #1a1a1a backgrounds, #e5e5e5 text in dark mode
  - Theme persistence via localStorage
  - Accessibility support for users with prefers-reduced-motion
- **Astrida Role**
  - New role with special permissions: input absensi for all desa + view all reports
  - Similar to Super Admin but without user management and master data access
  - Useful for data entry personnel with broader access than Koordinator Desa
- **Enhanced UI Components**
  - All components now support dark mode (buttons, cards, tables, forms, modals)
  - Theme toggle component in navigation
  - Smooth color transitions across all interactive elements

### Changed
- User Management form: Role dropdown now includes "Astrida" option
- Default theme set to light mode with user preference override
- Updated color palette for better dark mode contrast

---

## [1.0.0] - 2025-01-09

### Added
- **Authentication System**
  - Custom session management with HTTP Cookie (primary)
  - localStorage fallback for client-side access
  - Auto-redirect to login if session invalid
  - Secure password storage (plain text in dev, needs hashing in production)
- **Role-Based Access Control (RBAC)**
  - 5 user roles: Super Admin, Koordinator Desa, Koordinator Daerah, Viewer, Astrida
  - Middleware-based route protection
  - API-level role filtering for data access
- **User Management (Super Admin)**
  - CRUD operations for users
  - Role assignment with dropdown
  - Active/inactive toggle
  - Reset password functionality (resets to `{username}123`)
- **Input Absensi**
  - Super Admin & Astrida: Desa selector → Input kelompok for selected desa
  - Koordinator Desa: Direct form for their assigned desa only (filtered by desa_id)
  - UPSERT functionality: Auto-detect insert new or update existing
  - Separate input for Putra and Putri per kelompok
  - Visual indicators: Data saved (green), Data modified (blue)
  - Validation: Maximum target per kelompok
- **Laporan dengan Drill-Down**
  - Table view per desa with aggregated data
  - Click desa name → Modal pop-up with detailed kelompok breakdown
  - Separate columns for Putra and Putri
  - Real-time percentage calculation: (hadir/target) × 100%
  - Filter by month/year
  - Status indicators:
    - Sangat Baik (≥90%) - Green
    - Baik (≥80%) - Yellow
    - Perlu Perbaikan (<80%) - Red
- **Dashboard per Role**
  - Super Admin: Overview all desa, user management, master data, input absensi
  - Koordinator Desa: Direct form for input absensi for their desa
  - Koordinator Daerah: Real-time reports for all desa
  - Viewer: Read-only reports with print function
  - Astrida: Input absensi all desa + view reports (no user management)
- **Database Schema**
  - 4 main tables: users, desa, kelompok, absensi
  - 8 desa with 30 kelompok total
  - Target per kelompok: 25 putra + 25 putri = 50 total
  - Unique constraint: (kelompok_id, bulan, tahun) for absensi
  - Foreign keys with proper CASCADE rules
  - Indexes for performance optimization
- **API Endpoints**
  - `/api/auth/login` - Authentication
  - `/api/users` - User CRUD (Super Admin only)
  - `/api/desa` - Get all desa
  - `/api/kelompok` - Get kelompok (role-filtered)
  - `/api/absensi` - CRUD absensi with UPSERT logic
  - `/api/laporan` - Aggregated reports per desa
  - `/api/laporan/detail` - Detailed kelompok data
- **UI/UX Features**
  - Responsive design (mobile-first approach)
  - Loading states for async operations
  - Toast notifications for user feedback
  - Status indicators with color coding
  - Print-friendly layouts
  - Error handling with user-friendly messages
- **Tech Stack**
  - Next.js 14.2.32 with App Router
  - React 18.2.0
  - TypeScript 5.3.2
  - Tailwind CSS 3.3.6
  - Shadcn/ui components (Radix UI primitives)
  - Supabase (PostgreSQL)
  - Vercel deployment

### Security
- Input validation with Zod schemas
- SQL injection prevention via Supabase parameterized queries
- XSS prevention with DOMPurify
- CSRF protection with SameSite cookies
- Role-based API access control

### Performance
- Code splitting per route
- Efficient database queries with proper indexing
- Memoization for expensive calculations
- Optimized bundle size

---

## [Unreleased]

### Planned Features
- [ ] Export to PDF functionality
- [ ] Export to Excel functionality
- [ ] Password hashing with bcrypt/argon2
- [ ] Email notifications for password reset
- [ ] Bulk import absensi via CSV/Excel
- [ ] Advanced filtering and search
- [ ] Data visualization with charts (Recharts)
- [ ] Audit log for user actions
- [ ] Multi-language support (i18n)
- [ ] Progressive Web App (PWA) support
- [ ] Offline mode with service workers

### Known Issues
- Password stored in plain text (needs hashing in production)
- No email verification for new users
- No forgot password functionality yet
- Export features not implemented yet

---

## Version History

- **v1.2.0** (2025-01-11) - Mobile Optimization & Modal System
- **v1.1.0** (2025-01-10) - Dark Mode & Astrida Role
- **v1.0.0** (2025-01-09) - Initial Release

---

## Migration Guide

### From v1.1.0 to v1.2.0
No database migration needed. Just update code:
```bash
git pull origin main
npm install
npm run build
```

### From v1.0.0 to v1.1.0
No database migration needed. Add Astrida test user:
```sql
INSERT INTO users (username, password, full_name, role, desa_id, is_active) VALUES 
('astrida', 'astrida123', 'Astrida User', 'astrida', NULL, true)
ON CONFLICT (username) DO NOTHING;
```

---

## Support

For questions or issues, please:
- Open an issue on GitHub
- Email: support@asad.com
- Check documentation: README.md and DEPLOYMENT.md
