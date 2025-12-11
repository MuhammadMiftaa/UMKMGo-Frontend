# Dokumentasi Source Code UMKMGo - Frontend

## 7. Pages

Direktori `pages` berisi komponen-komponen halaman utama aplikasi yang merepresentasikan berbagai fitur dan fungsionalitas sistem. Setiap halaman bertanggung jawab untuk menampilkan UI dan mengelola logika bisnis spesifik untuk fitur tertentu.

### a. Authentication Pages

#### LoginPage (`src/pages/LoginPage.tsx`)

**Deskripsi:**
Halaman login adalah entry point untuk admin mengakses dashboard. Halaman ini menyediakan form autentikasi untuk memverifikasi kredensial pengguna sebelum memberikan akses ke sistem.

**Fungsi Utama:**

- Menyediakan form login dengan input email dan password
- Validasi kredensial pengguna menggunakan `AuthContext`
- Redirect otomatis ke dashboard jika user sudah login
- Menampilkan pesan error jika kredensial tidak valid
- Loading state saat proses autentikasi

**State Management:**

- `email`: Menyimpan input email pengguna
- `password`: Menyimpan input password pengguna
- `isLoading`: Status loading saat proses login
- `error`: Pesan error jika login gagal

**Integrasi:**

- Menggunakan `useAuth()` context untuk fungsi login
- Redirect ke "/" menggunakan `<Navigate>` jika user sudah terautentikasi

**UI Components:**

- Logo UMKMGo sebagai branding
- Card container untuk form login
- Input fields untuk email dan password
- Button submit dengan loading state

**Flow:**

1. User memasukkan email dan password
2. Submit form trigger `handleSubmit`
3. `login()` function dipanggil dari AuthContext
4. Jika berhasil, redirect ke dashboard
5. Jika gagal, tampilkan pesan error

### b. Dashboard Pages

#### DashboardPage (`src/pages/DashboardPage.tsx`)

**Deskripsi:**
Halaman dashboard adalah halaman utama setelah login yang menampilkan ringkasan statistik dan visualisasi data pengajuan UMKM. Halaman ini memberikan overview menyeluruh tentang status aplikasi sistem.

**Fungsi Utama:**

- Menampilkan statistik ringkasan pengajuan (total, dalam proses, disetujui, ditolak)
- Visualisasi data menggunakan charts (Pie Chart, Bar Chart)
- Menampilkan daftar 5 pengajuan terbaru yang perlu ditindaklanjuti
- Distribusi pengajuan berdasarkan jenis program
- Distribusi pengguna berdasarkan jenis kartu

**Data yang Ditampilkan:**

1. **Cards Statistik:**
   - Total Pengajuan
   - Dalam Proses (screening + revised + final)
   - Disetujui
   - Ditolak

2. **Chart Distribusi Status:**
   - Pie Chart menampilkan sebaran status (screening, revised, final, approved, rejected)
   - Warna berbeda untuk setiap status

3. **Chart Jenis Pengajuan:**
   - Bar Chart menampilkan jumlah pengajuan per tipe (training, certification, funding)
4. **Chart Distribusi Jenis Kartu:**
   - Horizontal Bar Chart menampilkan jumlah pengguna per jenis kartu

5. **Pengajuan Terbaru:**
   - List 5 pengajuan terakhir dengan status screening
   - Clickable untuk navigasi ke detail

**State Management:**
Menggunakan context:

- `useApplications()`: Untuk data pengajuan
- `useDashboard()`: Untuk statistik dan aggregated data

**Integrasi Charts:**
Menggunakan Recharts library:

- `<PieChart>` dengan `<Pie>` untuk distribusi status
- `<BarChart>` dengan `<Bar>` untuk jenis pengajuan
- Custom colors dari array `COLORS`

**Loading State:**

- Menampilkan spinner dan loading message saat fetch data
- Skeleton loading untuk mencegah layout shift

**Flow:**

1. Mount component → trigger `fetchAllDashboardData()`
2. Fetch data dari multiple endpoints
3. Transform data untuk charts
4. Render visualizations
5. Auto-refresh saat navigation kembali ke dashboard

### c. Application Management Pages

#### TrainingPage (`src/pages/TrainingPage.tsx`)

**Deskripsi:**
Halaman untuk mengelola pengajuan pelatihan UMKM. Admin dapat melihat daftar semua aplikasi pelatihan, melakukan filtering, dan mengakses detail setiap pengajuan.

**Fungsi Utama:**

- Menampilkan list semua pengajuan pelatihan
- Filter berdasarkan pencarian (nama, usaha, ID)
- Filter berdasarkan status (screening, revised, final, approved, rejected)
- Indikator SLA (Service Level Agreement) untuk setiap pengajuan
- Quick access ke detail pengajuan

**Filter & Search:**

- Search box untuk mencari berdasarkan:
  - Nama pemohon
  - Nama usaha
  - ID pengajuan
- Dropdown filter status dengan 6 opsi:
  - Semua Status
  - Screening
  - Revisi
  - Final
  - Disetujui
  - Ditolak

**SLA Badge:**
Menggunakan fungsi `getSLABadge()` untuk menampilkan badge warna:

- **Merah (Destructive)**: Terlambat atau < 24 jam
- **Kuning (Warning)**: 24-72 jam tersisa
- **Abu-abu (Outline)**: > 72 jam tersisa

**Card Display:**
Setiap card pengajuan menampilkan:

- Nama pemohon
- ID pengajuan (format: TRAN-XXX)
- Nama usaha
- Nama program
- Penyedia program
- Tanggal pengajuan
- Status badge
- SLA badge
- Button detail
- Catatan (jika ada)

**State Management:**

- `searchTerm`: Untuk pencarian
- `statusFilter`: Untuk filter status
- `applications`: Data dari ApplicationContext

**Navigation:**

- Klik "Detail" → redirect ke `/application/:id`

#### CertificationPage (`src/pages/CertificationPage.tsx`)

**Deskripsi:**
Halaman untuk mengelola pengajuan sertifikasi UMKM. Strukturnya mirip dengan TrainingPage namun khusus untuk aplikasi sertifikasi.

**Fungsi Utama:**

- Menampilkan list pengajuan sertifikasi
- Filter dan search functionality
- SLA monitoring
- Navigation ke detail pengajuan

**Perbedaan dengan TrainingPage:**

- Filter untuk type `Programs.CERTIFICATION`
- ID format: `CERT-XXX`
- Data spesifik sertifikasi ditampilkan

**Filter & Search:**
Sama seperti TrainingPage:

- Search input untuk nama/usaha/ID
- Status dropdown filter

**SLA System:**
Menggunakan sistem yang sama:

- Perhitungan jam tersisa
- Color-coded badges
- Warning thresholds

**Card Information:**

- ID: CERT-XXX
- Semua informasi standar pengajuan
- Link ke detail sertifikasi spesifik

#### FundingPage (`src/pages/FundingPage.tsx`)

**Deskripsi:**
Halaman untuk mengelola pengajuan pendanaan UMKM. Menampilkan list aplikasi funding dengan informasi finansial.

**Fungsi Utama:**

- List pengajuan pendanaan
- Filter dan search
- Display jumlah dana yang diajukan (optional, jika diperlukan)
- SLA monitoring
- Navigation ke detail

**Karakteristik Khusus:**

- Fokus pada aplikasi pendanaan
- ID format: `FUND-XXX`
- Dapat menampilkan informasi finansial dalam list

**Filter & Search:**
Consistency dengan pages lain:

- Search functionality
- Status filter dropdown

**Currency Formatting:**
Fungsi `formatCurrency()` untuk format Rupiah:

```typescript
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
```

**SLA Badge:**
Sama dengan training/certification pages

#### ApplicationDetailPage (`src/pages/ApplicationDetailPage.tsx`)

**Deskripsi:**
Halaman detail lengkap dari sebuah pengajuan. Ini adalah halaman paling kompleks yang menampilkan semua informasi pengajuan dan menyediakan action buttons untuk proses approval/rejection.

**Fungsi Utama:**

- Menampilkan informasi lengkap pemohon
- Detail pengajuan berdasarkan tipe (training/certification/funding)
- Menampilkan dokumen yang diupload
- Timeline/history pengajuan
- Action buttons untuk screening dan final approval
- Form rejection dengan alasan
- Form revision dengan instruksi

**Struktur Layout:**

1. **Header:**
   - Judul "Detail Pengajuan"
   - ID pengajuan (TRAN/CERT/FUND-XXX)
   - Button kembali

2. **Main Content (2 kolom):**

   **Kolom Kiri (2/3):**
   - **Informasi Pemohon:**
     - Nama lengkap
     - Nomor telepon
     - NIK
     - Nama usaha
     - Alamat
     - Wilayah (kota, provinsi)
   - **Detail Pengajuan:**
     - Jenis program
     - Nama program
     - Fields spesifik per tipe:

       **Training:**
       - Motivasi
       - Pengalaman usaha
       - Target pembelajaran
       - Catatan ketersediaan

       **Certification:**
       - Sektor usaha
       - Lama usaha (tahun)
       - Produk/layanan yang disertifikasi
       - Deskripsi usaha
       - Standar yang diterapkan
       - Tujuan sertifikasi

       **Funding:**
       - Sektor usaha
       - Lama usaha
       - Jumlah dana diajukan
       - Tenor (bulan)
       - Omzet bulanan
       - Deskripsi usaha
       - Tujuan penggunaan dana
       - Rencana bisnis
       - Proyeksi omzet
       - Agunan/jaminan

   - **Berkas Pengajuan:**
     - List dokumen yang diupload
     - Button untuk buka/download dokumen
     - Tanggal upload
     - Tipe dokumen (formatted)
   - **Riwayat Status:**
     - Timeline pengajuan
     - Status changes
     - Admin yang menangani
     - Timestamp setiap aksi
   - **Catatan:**
     - Notes dari history terakhir

   **Kolom Kanan (1/3):**
   - **Status & Batas Waktu:**
     - Status saat ini (badge)
     - Deadline approval
   - **Tindakan (Actions):**
     Conditional berdasarkan status dan permissions:

     **Jika status = SCREENING & user punya permission:**
     - Button "Lolos Screening"
     - Button "Minta Perbaikan" (expand form revisi)
     - Button "Tolak Administratif" (expand form rejection)

     **Jika status = FINAL & user punya permission:**
     - Button "Setujui Final"
     - Button "Tolak Final" (expand form rejection)

**Permission Checking:**

```typescript
// Example untuk Training
if (
  application.status === Status.SCREENING &&
  user?.permissions?.includes(Permissions.SCREENING_TRAINING)
) {
  // Show screening actions
}

if (
  application.status === Status.FINAL &&
  user?.permissions?.includes(Permissions.FINAL_TRAINING)
) {
  // Show final actions
}
```

**Action Handlers:**

1. **handleScreeningApprove():**
   - Show confirmation dialog
   - Call `screeningApprove(applicationId)`
   - Show success toast
   - Navigate back

2. **handleScreeningReject():**
   - Validate rejection reason
   - Show confirmation
   - Call `screeningReject(payload)`
   - Navigate back

3. **handleScreeningRevise():**
   - Validate revision notes
   - Show confirmation
   - Call `screeningRevise(payload)`
   - Navigate back

4. **handleFinalApprove():**
   - Show confirmation
   - Call `finalApprove(applicationId)`
   - Navigate back

5. **handleFinalReject():**
   - Validate rejection reason
   - Show confirmation
   - Call `finalReject(payload)`
   - Navigate back

**Document Handling:**

```typescript
const formatDocumentType = (type: string): string => {
  return type
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
};

const handleDownloadDocument = (file: string, type: string) => {
  window.open(file, "_blank");
};
```

**Loading States:**

- Initial loading: Spinner + message
- Action loading: Disabled buttons + loading text
- Not found: Error message + back button

**Navigation:**

- Auto-redirect jika aplikasi tidak ditemukan
- Navigate back setelah action berhasil

### d. Program Management Pages

#### TrainingListPage (`src/pages/programs/TrainingListPage.tsx`)

**Deskripsi:**
Halaman untuk menampilkan dan mengelola daftar program pelatihan. Admin dapat melihat semua program training yang tersedia, melakukan pencarian, filter, dan navigasi ke detail atau form create/edit.

**Fungsi Utama:**

- Menampilkan grid card program pelatihan
- Search program berdasarkan judul
- Filter berdasarkan status (aktif/tidak aktif)
- Button create program baru
- Quick access ke detail program

**UI Layout:**

1. **Header:**
   - Title: "Program Pelatihan"
   - Description
   - Button "Buat Program" (link ke create page dengan type=training)

2. **Filter Bar:**
   - Search input dengan icon
   - Status dropdown filter

3. **Program Grid:**
   - Layout 3 kolom (responsive)
   - Card per program

**Program Card Content:**

- Banner image (2:3 ratio)
- Status badge (aktif/tidak aktif) - top right overlay
- Provider logo + name
- Program title
- Description (truncated 150 chars)
- Created date
- Created by name
- Button "Detail"

**Filter Logic:**

```typescript
const filteredPrograms = trainingPrograms.filter((program) => {
  const matchesSearch = program.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  const matchesStatus =
    statusFilter === "all" ||
    (statusFilter === "active" && program.is_active) ||
    (statusFilter === "inactive" && !program.is_active);
  return matchesSearch && matchesStatus;
});
```

**State Management:**

- `searchTerm`: Search query
- `statusFilter`: "all" | "active" | "inactive"
- `programs`: Data dari ProgramContext

**Navigation:**

- Create: `/programs/training/create?type=training`
- Detail: `/programs/training/:id`

**Empty State:**
Jika tidak ada program:

```
"Program pelatihan tidak ditemukan."
```

#### CertificationListPage (`src/pages/programs/CertificationListPage.tsx`)

**Deskripsi:**
Halaman untuk menampilkan dan mengelola daftar program sertifikasi. Strukturnya identik dengan TrainingListPage namun untuk tipe certification.

**Fungsi Utama:**

- Grid view program sertifikasi
- Search & filter functionality
- Create new certification program
- Navigate to details

**Perbedaan dengan TrainingListPage:**

- Filter untuk `Programs.CERTIFICATION`
- URL paths menggunakan `/programs/certification/...`
- Title & description spesifik sertifikasi

**Program Card:**
Sama dengan training list:

- Banner, logo, title, description
- Status badge
- Created info
- Detail button

#### FundingListPage (`src/pages/programs/FundingListPage.tsx`)

**Deskripsi:**
Halaman untuk menampilkan dan mengelola daftar program pendanaan.

**Fungsi Utama:**

- Grid view program funding
- Search & filter
- Create funding program
- Detail access

**Karakteristik Khusus:**

- Fokus pada program pendanaan
- Dapat menampilkan range amount di card (optional)
- Interest rate info (optional)

**URL Paths:**

- List: `/programs/funding`
- Create: `/programs/funding/create?type=funding`
- Detail: `/programs/funding/:id`

#### CreateProgramPage (`src/pages/programs/CreateProgramPage.tsx`)

**Deskripsi:**
Halaman form untuk membuat program baru atau mengedit program yang sudah ada. Form ini dinamis menyesuaikan field berdasarkan tipe program (training/certification/funding).

**Fungsi Utama:**

- Form create/edit program
- Upload banner dan logo
- Manage benefits dan requirements lists
- Preview images
- Conditional fields berdasarkan program type

**Mode Operasi:**

1. **Create Mode:** `!id`
   - Form kosong
   - Type dari query param
   - Submit → `createProgram()`

2. **Edit Mode:** `!!id`
   - Load existing data
   - Populate form
   - Submit → `updateProgram()`

**Form Structure:**

**1. Informasi Dasar (Semua Tipe):**

```typescript
- title: string (required)
- description: string (required)
- provider: string (required)
- type: ProgramType (required, disabled saat edit)
- application_deadline: date (required)
- is_active: boolean (switch)
```

**2. Detail Training/Certification:**

```typescript
- training_type: "online" | "offline" | "hybrid"
- batch: number
- batch_start_date: date
- batch_end_date: date
- location: string
```

**3. Detail Funding:**

```typescript
- min_amount: number (IDR)
- max_amount: number (IDR)
- interest_rate: number (%)
- max_tenure_months: number
```

**4. Gambar:**

```typescript
- banner: base64 string (required, ratio 2:3)
- provider_logo: base64 string (required, ratio 1:1)
```

**5. Benefits (Array):**

- Dynamic list
- Add button
- Remove button per item
- String input per benefit

**6. Requirements (Array):**

- Dynamic list
- Add/remove functionality
- String input per requirement

**Image Upload:**

Fungsi `handleFileUpload()`:

```typescript
const handleFileUpload = async (
  field: "banner" | "provider_logo",
  file: File
) => {
  // Validasi tipe file (image only)
  if (!isImageFile(file)) {
    showWarningToast("Mohon upload file gambar");
    return;
  }

  // Validasi ukuran (max 5MB)
  if (!validateImageSize(file, 5)) {
    showWarningToast("Ukuran file maksimal 5MB");
    return;
  }

  // Convert to base64
  const base64String = await fileToBase64(file);

  // Update form data
  handleInputChange(field, base64String);

  // Set preview
  if (field === "banner") {
    setBannerPreview(base64String);
  } else {
    setLogoPreview(base64String);
  }
};
```

**Benefits Management:**

```typescript
const addBenefit = () => {
  setFormData((prev) => ({
    ...prev,
    benefits: [...(prev.benefits ?? []), ""],
  }));
};

const removeBenefit = (index: number) => {
  setFormData((prev) => ({
    ...prev,
    benefits: (prev.benefits ?? []).filter((_, i) => i !== index),
  }));
};

const updateBenefit = (index: number, value: string) => {
  setFormData((prev) => ({
    ...prev,
    benefits: (prev.benefits ?? []).map((b, i) => (i === index ? value : b)),
  }));
};
```

**Requirements Management:**
Similar to benefits management dengan fungsi:

- `addRequirement()`
- `removeRequirement(index)`
- `updateRequirement(index, value)`

**Form Validation:**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Basic validation
  if (
    !formData.title ||
    !formData.description ||
    !formData.application_deadline
  ) {
    showWarningToast("Mohon lengkapi semua field yang wajib diisi");
    return;
  }

  // Image validation
  if (!formData.banner || !formData.provider_logo) {
    showWarningToast("Mohon upload banner dan logo provider");
    return;
  }

  // Submit logic...
};
```

**Loading States:**

1. **Initial Load (Edit Mode):**
   - Spinner + "Memuat data program..."

2. **Upload State:**
   - `isUploading`: true
   - Disable inputs
   - "Mengupload..." text

3. **Submit State:**
   - Disable buttons
   - "Membuat..." atau "Memperbarui..."

**Not Found Handling (Edit Mode):**

```typescript
if (isEditMode && !isLoading && !currentProgram && id) {
  return (
    <div>
      <h2>Program Tidak Ditemukan</h2>
      <Button onClick={() => navigate("/programs")}>
        Kembali ke Program
      </Button>
    </div>
  );
}
```

**Navigation:**

- Success submit → `/programs/{type}`
- Cancel → `/programs/{type}`
- Back → `/programs/{type}`

#### ProgramDetailPage (`src/pages/programs/ProgramDetailPage.tsx`)

**Deskripsi:**
Halaman untuk menampilkan detail lengkap dari sebuah program. Menampilkan semua informasi program, benefits, requirements, dan menyediakan action untuk edit, delete, dan toggle status aktif.

**Fungsi Utama:**

- Display complete program information
- View banner dan provider logo
- List benefits dan requirements
- Toggle program active status
- Edit program
- Delete program (dengan confirmasi)

**Layout Structure:**

1. **Header:**
   - Program title
   - "Detail Program" subtitle
   - Back button
   - Edit button
   - Delete button (destructive)

2. **Banner Section:**
   - Full-width banner image
   - Status badge overlay (aktif/tidak aktif)

3. **Main Content (2 kolom):**

   **Kolom Kiri (2/3):**

   a. **Informasi Program:**
   - Provider logo + name
   - Program type badge
   - Description
   - Created by & created date

   b. **Detail Training/Certification** (conditional):
   - Training type badge
   - Batch number
   - Date range (start - end)
   - Location

   c. **Detail Funding** (conditional):
   - Amount range (min - max)
   - Interest rate (%)
   - Max tenure (months)

   d. **Manfaat:**
   - Bullet list of benefits
   - Styled dengan dot indicator

   e. **Persyaratan:**
   - Bullet list of requirements
   - Styled dengan dot indicator

   **Kolom Kanan (1/3):**

   a. **Status Program:**
   - Toggle switch untuk aktif/tidak aktif
   - Description text
   - Confirmation dialog saat toggle

   b. **Batas Waktu Pendaftaran:**
   - Calendar icon
   - Formatted deadline date

**Action Handlers:**

1. **handleDelete():**

```typescript
const handleDelete = () => {
  showConfirmAlert({
    message: `Apakah Anda yakin ingin menghapus program "${program?.title}"?`,
    confirmText: "Ya, Hapus",
    onConfirm: async () => {
      const result = await deleteProgram(Number(id));
      if (result.success) {
        showSuccessToast("Program berhasil dihapus");
        navigate(`/programs/${program?.type}`);
      }
    },
  });
};
```

2. **handleToggleActive():**

```typescript
const handleToggleActive = (checked: boolean) => {
  const action = checked ? "mengaktifkan" : "menonaktifkan";

  showConfirmAlert({
    message: `Apakah Anda yakin ingin ${action} program ini?`,
    onConfirm: async () => {
      const result = checked
        ? await activateProgram(Number(id))
        : await deactivateProgram(Number(id));

      if (result.success) {
        setIsActive(checked);
        showSuccessToast(
          `Program berhasil ${checked ? "diaktifkan" : "dinonaktifkan"}`
        );
      }
    },
  });
};
```

**Helper Functions:**

1. **formatCurrency():**

```typescript
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
```

2. **getProgramTypeLabel():**

```typescript
const getProgramTypeLabel = (type: string) => {
  switch (type) {
    case Programs.TRAINING:
      return "Pelatihan";
    case Programs.CERTIFICATION:
      return "Sertifikasi";
    case Programs.FUNDING:
      return "Pendanaan";
    default:
      return type;
  }
};
```

3. **getTrainingTypeLabel():**

```typescript
const getTrainingTypeLabel = (type: string) => {
  switch (type) {
    case "online":
      return "Online";
    case "offline":
      return "Offline";
    case "hybrid":
      return "Hybrid";
    default:
      return type;
  }
};
```

**Loading State:**

- Spinner dengan "Memuat detail program..."

**Not Found State:**

- Message "Program Tidak Ditemukan"
- Back button

**Benefits & Requirements Rendering:**

```typescript
// Benefits
{program.benefits && program.benefits.length > 0 && (
  <Card>
    <CardHeader><CardTitle>Manfaat</CardTitle></CardHeader>
    <CardContent>
      <ul>
        {program.benefits.map((benefit, idx) => (
          <li key={idx}>
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
)}
```

**Navigation:**

- Back: Previous page atau `/programs/{type}`
- Edit: `/programs/{type}/{id}/edit`
- After delete: `/programs/{type}`

### e. Admin Management Pages

#### AddAdminPage (`src/pages/AddAdminPage.tsx`)

**Deskripsi:**
Halaman form untuk menambahkan admin baru ke sistem. Form ini memungkinkan super admin atau admin dengan permission yang sesuai untuk membuat akun admin baru dengan role tertentu.

**Fungsi Utama:**

- Create new admin account
- Assign role ke admin
- Set password awal
- Validate form inputs
- Redirect ke admin list setelah berhasil

**Form Fields:**

```typescript
interface CreateUserData {
  name: string; // Nama lengkap (required)
  email: string; // Email (required, unique)
  password: string; // Password (required, min 8 chars)
  confirm_password: string; // Konfirmasi password (must match)
  role_id: number; // Role ID (default: 2 = admin_screening)
}
```

**Form Structure:**

1. **Personal Information:**
   - Nama Lengkap (Input text)
   - Email (Input email)

2. **Role Selection:**
   - Dropdown select dengan list dari `rolePermissions`
   - Options: Admin Screening, Admin Final, Super Admin, etc.
   - Format display: "Admin Screening" (formatted dari "admin_screening")

3. **Password Setup:**
   - Password (Input password, min 8 chars)
   - Konfirmasi Password (Input password, must match)

**Validation Rules:**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // 1. Check nama tidak kosong
  if (!formData.name.trim()) {
    showWarningToast("Nama lengkap tidak boleh kosong");
    return;
  }

  // 2. Check email tidak kosong
  if (!formData.email.trim()) {
    showWarningToast("Email tidak boleh kosong");
    return;
  }

  // 3. Check password match
  if (formData.password !== formData.confirm_password) {
    showWarningToast("Password dan konfirmasi password tidak cocok");
    return;
  }

  // 4. Check password length
  if (formData.password.length < 8) {
    showWarningToast("Password minimal 8 karakter");
    return;
  }

  // Submit...
};
```

**Role Display Formatting:**

```typescript
// Convert "admin_screening" → "Admin Screening"
role.role_name
  .replace("_", " ")
  .split(" ")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
```

**Submit Flow:**

1. Validate all fields
2. Set loading state
3. Call `createUser(formData)`
4. If success:
   - Show success toast
   - Navigate to `/admin/list`
5. If error:
   - Show error toast
   - Display error message

**State Management:**

- `formData`: Form values
- `error`: Error message string
- `submitLoading`: Submit button loading state
- `rolePermissions`: Available roles from context

**Loading States:**

1. **Initial Load:**
   - Fetch `rolePermissions` via `getListRolePermissions()`

2. **Submit Loading:**
   - Disable all inputs
   - Show spinner on button
   - Text: "Menyimpan..."

**Navigation:**

- Success: `/admin/list`
- Cancel: `/settings`
- Back button: `/settings`

**UI Components:**

- Card container
- Grid layout untuk form fields
- Disabled state saat loading
- Action buttons (Submit & Batal)

#### EditAdminPage (`src/pages/EditAdminPage.tsx`)

**Deskripsi:**
Halaman form untuk mengedit informasi admin yang sudah ada. Mirip dengan AddAdminPage namun dengan pre-populated data dan password yang optional.

**Fungsi Utama:**

- Edit existing admin data
- Update nama, email, role
- Optional password change
- Load current admin data

**Form Fields:**

```typescript
interface UpdateUserData {
  name: string;
  email: string;
  password: string; // Optional (kosongkan jika tidak diubah)
  confirm_password: string;
  role_id: number;
}
```

**Data Loading Flow:**

1. Get `id` from URL params
2. Call `getUserById(Number(id))`
3. Populate form dengan `currentUser` data
4. Pre-select role

**Pre-population:**

```typescript
useEffect(() => {
  if (currentUser) {
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      password: "", // Kosong untuk optional change
      confirm_password: "",
      role_id: 2, // Default atau dari currentUser
    });
  }
}, [currentUser]);
```

**Password Change Logic:**

```typescript
// Password optional
if (formData.password && formData.password !== formData.confirm_password) {
  showWarningToast("Password dan konfirmasi password tidak cocok");
  return;
}

if (formData.password && formData.password.length < 8) {
  showWarningToast("Password minimal 8 karakter");
  return;
}
```

**Validation:**

- Nama tidak boleh kosong
- Email tidak boleh kosong
- Jika password diisi:
  - Must match confirmation
  - Min 8 characters
- Jika password kosong:
  - Skip password validation
  - Backend tidak update password

**Submit Flow:**

1. Validate fields
2. Set loading state
3. Call `updateUser(Number(id), formData)`
4. If success:
   - Show success toast
   - Navigate to `/admin/list`
5. If error:
   - Show error toast

**Loading States:**

1. **Initial Load:**
   - Check if `currentUser` exists
   - Show spinner: "Loading user data..."

2. **Not Found State:**
   - If `!currentUser` after loading
   - Show error message
   - Back button to `/admin/list`

3. **Submit Loading:**
   - Disable inputs
   - Button text: "Memperbarui..."

**UI Sections:**

1. **Personal Info:**
   - Nama, Email (pre-filled)

2. **Role Selection:**
   - Dropdown (pre-selected)

3. **Password Section:**
   - Border separator
   - Note: "Kosongkan kolom password jika tidak ingin mengubah password"
   - Password fields (optional)

**Navigation:**

- Success: `/admin/list`
- Cancel: `/admin/list`
- Back: `/admin/list`
- Not found: Show error + back button

#### AdminListPage (`src/pages/AdminListPage.tsx`)

**Deskripsi:**
Halaman untuk menampilkan daftar semua admin dalam sistem. Admin dapat melakukan search, filter, edit, dan delete admin lain (dengan permission yang sesuai).

**Fungsi Utama:**

- Display list of all admins
- Search by nama atau email
- Filter by status (aktif/tidak aktif)
- Edit admin
- Delete admin (dengan confirmation)

**Data Display:**

Setiap admin card menampilkan:

```typescript
- name: string
- email: string
- role_name: string (formatted)
- is_active: boolean (badge)
- last_login_at: datetime
- created_at: date
- Action buttons: Edit, Hapus
```

**Filter & Search:**

```typescript
const filteredAdmins = users.filter((admin) => {
  // Search filter
  const matchesSearch =
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase());

  // Status filter
  const matchesStatus =
    statusFilter === "all" ||
    (admin.is_active ? "active" : "inactive") === statusFilter;

  return matchesSearch && matchesStatus;
});
```

**Filter Options:**

- Search: Nama atau Email
- Status: "Semua Status" | "Aktif" | "Tidak Aktif"

**Card Layout:**

```
┌─────────────────────────────────────────────────────────┐
│ [Name] [Email Badge]                          [Edit] [Del]│
│ Role: Admin Screening                                    │
│ Status: [Aktif Badge]                                    │
│ Login terakhir: 10 Dec 2025, 14:30                      │
│ Dibuat: 1 Jan 2025                                       │
└─────────────────────────────────────────────────────────┘
```

**Action Handlers:**

1. **handleEdit(adminId):**

```typescript
const handleEdit = (adminId: number) => {
  Navigate(`/admin/edit/${adminId}`);
};
```

2. **handleDelete(adminId, adminName):**

```typescript
const handleDelete = async (adminId: number, adminName: string) => {
  showConfirmAlert({
    message: `Apakah Anda yakin ingin menghapus admin "${adminName}"? Tindakan ini tidak dapat dibatalkan.`,
    confirmText: "Ya, Hapus",
    onConfirm: async () => {
      setDeleteLoading(adminId);
      const result = await deleteUser(adminId);

      if (result.success) {
        showSuccessToast("Admin berhasil dihapus");
        await getAllUsers(); // Refresh list
      } else {
        showErrorToast(result.message || "Gagal menghapus admin");
      }

      setDeleteLoading(null);
    },
  });
};
```

**Loading States:**

1. **Initial Load:**
   - Show skeleton cards: `<CardListSkeleton count={5} />`

2. **Delete Loading:**
   - Set `deleteLoading` to specific adminId
   - Disable buttons for that admin
   - Show spinner on delete button
   - Text: "Deleting..."

**Status Badge:**

```typescript
<Badge variant={admin.is_active ? "success" : "secondary"}>
  {admin.is_active ? "Aktif" : "Tidak Aktif"}
</Badge>
```

**Role Name Formatting:**

```typescript
admin.role_name
  .split("_")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
// "admin_screening" → "Admin Screening"
```

**Empty State:**

```typescript
{!isLoading && filteredAdmins.length === 0 && (
  <Card>
    <CardContent>
      <Users className="h-12 w-12" />
      <p>Tidak ada admin yang ditemukan.</p>
    </CardContent>
  </Card>
)}
```

**Navigation:**

- Back: `/settings`
- Edit: `/admin/edit/:id`

#### AdminPermissionsPage (`src/pages/AdminPermissionsPage.tsx`)

**Deskripsi:**
Halaman untuk mengatur hak akses (permissions) untuk setiap role admin. Super admin dapat assign/unassign permissions ke role tertentu.

**Fungsi Utama:**

- Display list of roles
- Display list of permissions
- Assign/unassign permissions to roles
- Save permission changes
- Real-time permission checkboxes

**Layout Structure:**

**2 Kolom Layout:**

1. **Kolom Kiri (1/3) - Role Selection:**

   ```
   ┌─────────────────────┐
   │ [Shield Icon]       │
   │ Pilih Role          │
   ├─────────────────────┤
   │ [•] Admin Screening │
   │     3 permissions   │
   │                     │
   │ [ ] Admin Final     │
   │     2 permissions   │
   │                     │
   │ [ ] Super Admin     │
   │     10 permissions  │
   └─────────────────────┘
   ```

2. **Kolom Kanan (2/3) - Permissions:**
   ```
   ┌─────────────────────────────────────┐
   │ Hak Akses untuk Admin Screening     │
   ├─────────────────────────────────────┤
   │ [✓] Screening Training              │
   │     Dapat melakukan screening...    │
   │     [Aktif Badge]                   │
   │                                     │
   │ [ ] Final Training                  │
   │     Dapat melakukan approval...     │
   │     [Tidak Aktif Badge]             │
   │                                     │
   │ [Save Button - Full Width]          │
   └─────────────────────────────────────┘
   ```

**Data Flow:**

1. **Load Data:**

```typescript
useEffect(() => {
  getListPermissions(); // Get all available permissions
  getListRolePermissions(); // Get role-permission mappings
}, []);
```

2. **Role Selection:**

```typescript
const handleRoleChange = (role_id: number) => {
  setSelectedRole(role_id);

  // Find permissions for this role
  const permissions = rolePermissions.find(
    (role) => role.role_id === role_id
  )?.permissions;

  setSelectedPermissions(permissions || []);
};
```

3. **Permission Toggle:**

```typescript
const handlePermissionChange = (permissionId: string, checked: boolean) => {
  if (checked) {
    // Add permission
    setSelectedPermissions([...selectedPermissions, permissionId]);
  } else {
    // Remove permission
    setSelectedPermissions(
      selectedPermissions.filter((id) => id !== permissionId)
    );
  }
};
```

**Save Flow:**

```typescript
const handleSave = () => {
  if (!selectedRole) {
    showWarningToast("Silakan pilih role terlebih dahulu");
    return;
  }

  showConfirmAlert({
    title: "Konfirmasi Perubahan",
    message: "Apakah Anda yakin ingin menyimpan perubahan hak akses?",
    onConfirm: async () => {
      setSaveLoading(true);

      const data: UpdateRolePermissionsData = {
        role_id: selectedRole,
        permissions: selectedPermissions,
      };

      const result = await updateRolePermissions(data);

      if (result.success) {
        showSuccessToast("Hak akses berhasil diperbarui!");
        await getListRolePermissions(); // Refresh
      }

      setSaveLoading(false);
    },
  });
};
```

**Permission Card:**

```typescript
<div className="flex items-start space-x-3 p-3 border rounded-lg">
  <Checkbox
    id={permission.code}
    checked={selectedPermissions.includes(permission.code)}
    onCheckedChange={(checked) =>
      handlePermissionChange(permission.code, checked as boolean)
    }
  />
  <div className="flex-1">
    <label className="text-sm font-medium">
      {permission.name}
    </label>
    <p className="text-xs text-muted-foreground">
      {permission.description}
    </p>
  </div>
  <Badge variant={
    selectedPermissions.includes(permission.code)
      ? "success"
      : "secondary"
  }>
    {selectedPermissions.includes(permission.code)
      ? "Aktif"
      : "Tidak Aktif"}
  </Badge>
</div>
```

**Role Card (Active State):**

```typescript
<div
  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
    role.role_id === selectedRole
      ? "bg-primary/10 border-primary"  // Active
      : "hover:bg-muted"                 // Inactive
  }`}
  onClick={() => handleRoleChange(role.role_id)}
>
  <div className="font-medium">
    {formatRoleName(role.role_name)}
  </div>
  <div className="text-sm text-muted-foreground">
    {role.permissions.length} permissions
  </div>
</div>
```

**Empty Selection State:**

```typescript
{!selectedRole && (
  <div className="text-center py-8 text-muted-foreground">
    Pilih role untuk melihat dan mengelola hak akses
  </div>
)}
```

**Loading States:**

1. **Initial Load:**
   - Full page spinner
   - "Loading permissions..."

2. **Save Loading:**
   - Disable all checkboxes
   - Disable save button
   - Button text: "Menyimpan..."

**Permission Structure:**

```typescript
interface Permission {
  code: string; // "screening_training"
  name: string; // "Screening Training"
  description: string; // "Dapat melakukan screening..."
}

interface RolePermission {
  role_id: number;
  role_name: string;
  permissions: string[]; // Array of permission codes
}
```

**Navigation:**

- Back button: `/settings`

### f. Settings Pages

#### SettingsPage (`src/pages/SettingsPage.tsx`)

**Deskripsi:**
Halaman pengaturan sistem yang menyediakan berbagai konfigurasi dan management tools untuk admin. Halaman ini adalah central hub untuk settings terkait user, SLA, profile, dan reporting.

**Fungsi Utama:**

- Update admin profile (nama, email)
- Configure SLA (Screening & Final)
- User management shortcuts
- Export reports (applications & programs)

**Layout Sections:**

**1. User Management Section** (conditional - based on permissions)

Ditampilkan jika user memiliki:

- `Permissions.USER_MANAGEMENT` atau
- `Permissions.ROLE_PERMISSIONS_MANAGEMENT`

```typescript
<Card>
  <CardHeader>
    <CardTitle>Manajemen Pengguna</CardTitle>
    <CardDescription>Kelola akun admin dan hak akses</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Shortcuts to user management pages */}
    <Button>Tambah Admin Baru</Button>
    <Button>Lihat Daftar Admin</Button>
    <Button>Atur Hak Akses</Button>
  </CardContent>
</Card>
```

**2. Profile Settings Section**

```typescript
<Card>
  <CardHeader>
    <CardTitle>Profil Pengguna</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Form fields */}
    - Nama: Input (editable)
    - Email: Input (editable)
    - Role: Input (disabled, display only)

    <Button onClick={handleUpdateProfile}>
      Update Profil
    </Button>
  </CardContent>
</Card>
```

**Profile Update Handler:**

```typescript
const handleUpdateProfile = async () => {
  if (!profileForm.name.trim() || !profileForm.email.trim()) {
    showWarningToast("Nama dan email tidak boleh kosong");
    return;
  }

  showConfirmAlert({
    title: "Konfirmasi Update Profil",
    message: "Apakah Anda yakin ingin memperbarui profil Anda?",
    onConfirm: async () => {
      setProfileLoading(true);

      const result = await updateProfile(profileForm);

      if (result.success) {
        showSuccessToast("Profil berhasil diperbarui!");
      } else {
        showErrorToast(result.message || "Gagal memperbarui profil");
      }

      setProfileLoading(false);
    },
  });
};
```

**3. SLA Configuration Section** (conditional)

Ditampilkan jika user memiliki `Permissions.SLA_CONFIGURATION`

```typescript
<Card>
  <CardHeader>
    <CardTitle>Konfigurasi SLA</CardTitle>
    <CardDescription>
      Atur batas waktu maksimal pengambilan keputusan
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Screening SLA */}
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={screeningSLADays}
        onChange={(e) => setScreeningSLADays(Number(e.target.value))}
        placeholder="Jumlah hari"
      />
      <Button onClick={handleUpdateScreeningSLA}>
        Simpan
      </Button>
    </div>

    {/* Final SLA */}
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={finalSLADays}
        onChange={(e) => setFinalSLADays(Number(e.target.value))}
        placeholder="Jumlah hari"
      />
      <Button onClick={handleUpdateFinalSLA}>
        Simpan
      </Button>
    </div>
  </CardContent>
</Card>
```

**SLA Update Handlers:**

```typescript
const handleUpdateScreeningSLA = async () => {
  if (screeningSLADays <= 0) {
    showWarningToast("Jumlah hari harus lebih dari 0");
    return;
  }

  showConfirmAlert({
    message: `Apakah Anda yakin ingin mengubah SLA Screening menjadi ${screeningSLADays} hari?`,
    onConfirm: async () => {
      setSlaLoading(true);

      const result = await updateScreeningSLA({
        max_days: screeningSLADays,
        description: "Screening SLA",
      });

      if (result.success) {
        showSuccessToast("SLA Screening berhasil diperbarui!");
      }

      setSlaLoading(false);
    },
  });
};

// Similar handler for Final SLA
```

**4. Export Reports Section** (conditional)

Ditampilkan jika user memiliki `Permissions.GENERATE_REPORT`

**4a. Export Applications Report:**

```typescript
<Card>
  <CardHeader>
    <CardTitle>Cetak Laporan Pengajuan</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid gap-4 md:grid-cols-3">
      {/* Tipe Pengajuan */}
      <select
        value={applicationsType}
        onChange={(e) => setApplicationsType(e.target.value)}
      >
        <option value="all">Semua Tipe</option>
        <option value="funding">Pendanaan</option>
        <option value="training">Pelatihan</option>
        <option value="certification">Sertifikasi</option>
      </select>

      {/* Format File */}
      <select
        value={applicationsFileType}
        onChange={(e) => setApplicationsFileType(e.target.value)}
      >
        <option value="pdf">PDF</option>
        <option value="excel">Excel</option>
      </select>

      {/* Action Button */}
      <Button onClick={handleExportApplications}>
        <FileText /> Cetak Laporan
      </Button>
    </div>
  </CardContent>
</Card>
```

**4b. Export Programs Report:**
Similar structure dengan different handler dan state

**Export Handler:**

```typescript
const handleExportApplications = async () => {
  setExportLoading(true);

  try {
    const result = await exportApplications({
      file_type: applicationsFileType,
      application_type: applicationsType,
    });

    if (result.success && result.data) {
      // Determine file extension
      const fileExt = applicationsFileType === "pdf" ? "pdf" : "xlsx";

      // Create download link
      const url = window.URL.createObjectURL(result.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `applications-${applicationsType}-${new Date().toISOString()}.${fileExt}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccessToast(
        `Laporan berhasil diunduh (${applicationsFileType.toUpperCase()})!`
      );
    } else {
      showErrorToast(result.message || "Gagal mengekspor laporan");
    }
  } catch (error) {
    showErrorToast("Terjadi kesalahan saat mengekspor laporan");
  } finally {
    setExportLoading(false);
  }
};
```

**State Management:**

```typescript
// Profile form
const [profileForm, setProfileForm] = useState({
  name: user?.name || "",
  email: user?.email || "",
});

// SLA configuration
const [screeningSLADays, setScreeningSLADays] = useState<number>(7);
const [finalSLADays, setFinalSLADays] = useState<number>(14);

// Export applications
const [applicationsType, setApplicationsType] = useState<
  "all" | "training" | "certification" | "funding"
>("all");
const [applicationsFileType, setApplicationsFileType] = useState<
  "pdf" | "excel"
>("pdf");

// Export programs
const [programsType, setProgramsType] = useState<
  "all" | "training" | "certification" | "funding"
>("all");
const [programsFileType, setProgramsFileType] = useState<"pdf" | "excel">(
  "pdf"
);

// Loading states
const [profileLoading, setProfileLoading] = useState(false);
const [slaLoading, setSlaLoading] = useState(false);
const [exportLoading, setExportLoading] = useState(false);
```

**Data Loading:**

```typescript
useEffect(() => {
  // Load SLA data
  getScreeningSLA();
  getFinalSLA();
}, []);

useEffect(() => {
  // Update profile form when user changes
  if (user) {
    setProfileForm({
      name: user.name,
      email: user.email,
    });
  }
}, [user]);

useEffect(() => {
  // Update SLA days when loaded
  if (screeningSLA) {
    setScreeningSLADays(screeningSLA.max_days);
  }
}, [screeningSLA]);
```

**Permission-Based Rendering:**

```typescript
// Example: Only show SLA section if user has permission
{user?.permissions.includes(Permissions.SLA_CONFIGURATION) && (
  <Card>
    {/* SLA Configuration */}
  </Card>
)}
```

**Navigation Links:**

- Tambah Admin → `/admin/add`
- Lihat Daftar Admin → `/admin/list`
- Atur Hak Akses → `/admin/permissions`

### g. News Management Pages

#### NewsListPage (`src/pages/NewsListPage.tsx`)

**Deskripsi:**
Halaman untuk menampilkan dan mengelola daftar berita. Admin dapat membuat, edit, delete, dan toggle publish status berita. Halaman ini menggunakan grid card layout untuk display berita.

**Fungsi Utama:**

- Display grid of news articles
- Search berita berdasarkan judul/excerpt
- Filter berdasarkan kategori (announcement, success_story, event, article)
- Filter berdasarkan status publikasi (published/draft)
- Create new news
- Edit existing news
- Delete news (dengan confirmation)
- Toggle publish/unpublish (dengan confirmation)

**Permission Checking:**

```typescript
// View permission
if (!user?.permissions?.includes(Permissions.VIEW_NEWS)) {
  return <AccessDeniedCard />;
}

// Create button
{user?.permissions?.includes(Permissions.CREATE_NEWS) && (
  <Button onClick={() => navigate("/news/create")}>
    <Plus /> Buat Berita
  </Button>
)}

// Edit/Delete actions
{user?.permissions?.includes(Permissions.EDIT_NEWS) && (
  <Button onClick={() => navigate(`/news/${news.id}/edit`)}>
    <Edit />
  </Button>
)}
```

**Filter Structure:**

```typescript
const filteredNews = newsList.filter((news) => {
  // Search filter
  const matchesSearch =
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

  // Category filter
  const matchesCategory =
    categoryFilter === "all" || news.category === categoryFilter;

  // Status filter
  const matchesStatus =
    statusFilter === "all" ||
    (statusFilter === "published" && news.is_published) ||
    (statusFilter === "draft" && !news.is_published);

  return matchesSearch && matchesCategory && matchesStatus;
});
```

**Filter UI:**

```typescript
<Card>
  <CardHeader>
    <div className="flex gap-4">
      {/* Search */}
      <Input
        placeholder="Cari judul atau isi berita..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Category Filter */}
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectItem value="all">Semua Kategori</SelectItem>
        <SelectItem value="announcement">Pengumuman</SelectItem>
        <SelectItem value="success_story">Kisah Sukses</SelectItem>
        <SelectItem value="event">Event</SelectItem>
        <SelectItem value="article">Artikel</SelectItem>
      </Select>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectItem value="all">Semua Status</SelectItem>
        <SelectItem value="published">Dipublikasikan</SelectItem>
        <SelectItem value="draft">Draft</SelectItem>
      </Select>
    </div>
  </CardHeader>
</Card>
```

**News Card Layout:**

```
┌─────────────────────────────────────────┐
│                                         │
│         Thumbnail Image                 │
│     [Published/Draft Badge]             │
│     [Category Badge]                    │
│                                         │
├─────────────────────────────────────────┤
│ Provider Logo   Provider Name           │
│                                         │
│ News Title (2 lines max)                │
│                                         │
│ Excerpt (3 lines max, stripped HTML)   │
│                                         │
│ #tag1 #tag2 #tag3 (+2 more)            │
│                                         │
│ Dibuat: 10 Dec 2025                     │
│ Oleh: Admin Name                        │
│                                         │
│ [Lihat] [Edit] [Toggle] [Delete]       │
└─────────────────────────────────────────┘
```

**News Card Component:**

```typescript
<Card className="overflow-hidden hover:shadow-lg transition-shadow">
  {/* Thumbnail with overlay badges */}
  <div className="relative h-48">
    <img src={news.thumbnail} alt={news.title} />
    <Badge variant={news.is_published ? "default" : "secondary"}>
      {news.is_published ? "Dipublikasikan" : "Draft"}
    </Badge>
    <Badge variant="outline">
      {NewsCategoriesMap[news.category]}
    </Badge>
  </div>

  <CardContent>
    {/* Title */}
    <h3 className="line-clamp-2">{news.title}</h3>

    {/* Excerpt (stripped HTML) */}
    <p className="line-clamp-3">
      {stripHtml(news.excerpt, 120)}
    </p>

    {/* Tags */}
    <div className="flex gap-1">
      {news.tags?.slice(0, 3).map(tag => (
        <Badge>#{tag}</Badge>
      ))}
      {news.tags?.length > 3 && (
        <Badge>+{news.tags.length - 3}</Badge>
      )}
    </div>

    {/* Meta info */}
    <div className="text-xs">
      <p>Dibuat: {formatDate(news.created_at)}</p>
      <p>Oleh: {news.created_by_name}</p>
    </div>

    {/* Action buttons */}
    <div className="flex gap-2">
      <Button onClick={() => navigate(`/news/${news.id}`)}>
        <Eye /> Lihat
      </Button>

      {user?.permissions?.includes(Permissions.EDIT_NEWS) && (
        <>
          <Button onClick={() => navigate(`/news/${news.id}/edit`)}>
            <Edit />
          </Button>
          <Button onClick={() => handleTogglePublish(news.id, news.is_published, news.title)}>
            {news.is_published ? <EyeOff /> : <Eye />}
          </Button>
        </>
      )}

      {user?.permissions?.includes(Permissions.DELETE_NEWS) && (
        <Button
          variant="destructive"
          onClick={() => handleDelete(news.id, news.title)}
        >
          {actionLoading === news.id ? <Spinner /> : <Trash2 />}
        </Button>
      )}
    </div>
  </CardContent>
</Card>
```

**Strip HTML Function:**

```typescript
const stripHtml = (html: string, maxLength: number = 150) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
```

**Action Handlers:**

**1. Delete Handler:**

```typescript
const handleDelete = async (id: number, title: string) => {
  showConfirmAlert({
    message: `Apakah Anda yakin ingin menghapus berita "${title}"?`,
    confirmText: "Ya, Hapus",
    onConfirm: async () => {
      setActionLoading(id);

      const result = await deleteNews(id);

      if (result.success) {
        showSuccessToast("Berita berhasil dihapus");
      } else {
        showErrorToast(result.message);
      }

      setActionLoading(null);
    },
  });
};
```

**2. Toggle Publish Handler:**

```typescript
const handleTogglePublish = async (
  id: number,
  isPublished: boolean,
  title: string
) => {
  const action = isPublished ? "membatalkan publikasi" : "mempublikasikan";

  showConfirmAlert({
    message: `Apakah Anda yakin ingin ${action} berita "${title}"?`,
    confirmText: `Ya, ${isPublished ? "Batalkan" : "Publikasikan"}`,
    onConfirm: async () => {
      setActionLoading(id);

      const result = isPublished
        ? await unpublishNews(id)
        : await publishNews(id);

      if (result.success) {
        showSuccessToast(
          `Berita berhasil ${isPublished ? "dibatalkan publikasinya" : "dipublikasikan"}`
        );
      }

      setActionLoading(null);
    },
  });
};
```

**Loading States:**

1. **Initial Load:**
   - `<CardListSkeleton count={5} />`

2. **Action Loading:**
   - Set `actionLoading` to specific news ID
   - Show spinner on action button

**Empty States:**

**1. No Permission:**

```typescript
<Card>
  <CardContent>
    <ShieldAlert />
    <h3>Akses Ditolak</h3>
    <p>Anda tidak memiliki izin untuk melihat daftar artikel.</p>
  </CardContent>
</Card>
```

**2. No Results:**

```typescript
<Card>
  <CardContent>
    <p>Tidak ada berita yang ditemukan.</p>
  </CardContent>
</Card>
```

**Grid Layout:**

```typescript
<div className="grid gap-6 md:gri-cols-2 lg:grid-cols-3">
  {filteredNews.map(news => (
    <NewsCard key={news.id} news={news} />
  ))}
</div>
```

#### NewsDetailPage (`src/pages/NewsDetailPage.tsx`)

**Deskripsi:**
Halaman untuk menampilkan detail lengkap dari sebuah berita. Menampilkan thumbnail, content, tags, dan menyediakan action untuk edit, delete, dan toggle publish status.

**Fungsi Utama:**

- Display full news article
- Show thumbnail, title, excerpt, content (HTML)
- Display tags
- Show creation/update metadata
- Edit news
- Delete news
- Toggle publish status

**Layout Structure:**

**1. Header:**

```typescript
<div className="flex items-center justify-between">
  <div>
    <h1>{news.title}</h1>
    <p>Detail Berita</p>
  </div>
  <div className="flex gap-2">
    <Button onClick={() => navigate("/news")}>
      <ArrowLeft /> Kembali
    </Button>
    <Button onClick={() => navigate(`/news/${news.id}/edit`)}>
      <Edit /> Edit
    </Button>
    <Button variant="destructive" onClick={handleDelete}>
      {actionLoading ? "Memproses..." : <><Trash2 /> Hapus</>}
    </Button>
  </div>
</div>
```

**2. Thumbnail Section:**

```typescript
<Card>
  <CardContent className="p-0">
    <div className="relative">
      <img
        src={news.thumbnail}
        alt={news.title}
        className="w-full h-96 object-cover"
      />
      <div className="absolute top-4 right-4 flex gap-2">
        <Badge variant={isPublished ? "default" : "secondary"}>
          {isPublished ? "Dipublikasikan" : "Draft"}
        </Badge>
        <Badge variant="outline">
          {NewsCategoriesMap[news.category]}
        </Badge>
      </div>
    </div>
  </CardContent>
</Card>
```

**3. Main Content (2 Kolom):**

**Kolom Kiri (2/3):**

a. **Ringkasan:**

```typescript
<Card>
  <CardHeader><CardTitle>Ringkasan</CardTitle></CardHeader>
  <CardContent>
    <p className="italic">{news.excerpt}</p>
  </CardContent>
</Card>
```

b. **Konten:**

```typescript
<Card>
  <CardHeader><CardTitle>Konten</CardTitle></CardHeader>
  <CardContent>
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: news.content }}
    />
  </CardContent>
</Card>
```

c. **Tags:**

```typescript
{news.tags && news.tags.length > 0 && (
  <Card>
    <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2">
        {news.tags.map((tag, idx) => (
          <Badge key={idx} variant="outline">
            #{tag}
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
)}
```

**Kolom Kanan (1/3):**

a. **Status Publikasi:**

```typescript
<Card>
  <CardHeader><CardTitle>Status Publikasi</CardTitle></CardHeader>
  <CardContent>
    <div className="flex items-center justify-between">
      <Label>Publikasikan</Label>
      <Switch
        checked={isPublished}
        onCheckedChange={handleTogglePublish}
        disabled={actionLoading}
      />
    </div>
    <p className="text-sm text-muted-foreground">
      {isPublished
        ? "Berita ini sudah dipublikasikan..."
        : "Berita ini masih dalam status draft..."}
    </p>
  </CardContent>
</Card>
```

b. **Informasi:**

```typescript
<Card>
  <CardHeader><CardTitle>Informasi</CardTitle></CardHeader>
  <CardContent>
    <div className="space-y-4">
      {/* Created Date */}
      <div className="flex items-start gap-2">
        <Calendar className="h-4 w-4" />
        <div>
          <p className="font-medium">Dibuat</p>
          <p className="text-muted-foreground">
            {formatDate(news.created_at)}
          </p>
        </div>
      </div>

      {/* Updated Date */}
      <div className="flex items-start gap-2">
        <Calendar className="h-4 w-4" />
        <div>
          <p className="font-medium">Terakhir Diupdate</p>
          <p className="text-muted-foreground">
            {formatDate(news.updated_at)}
          </p>
        </div>
      </div>

      {/* Creator */}
      {news.created_by_name && (
        <div className="flex items-start gap-2">
          <User className="h-4 w-4" />
          <div>
            <p className="font-medium">Pembuat</p>
            <p className="text-muted-foreground">
              {news.created_by_name}
            </p>
          </div>
        </div>
      )}
    </div>
  </CardContent>
</Card>
```

**Action Handlers:**

**1. Delete Handler:**

```typescript
const handleDelete = () => {
  showConfirmAlert({
    message: `Apakah Anda yakin ingin menghapus berita "${news?.title}"?`,
    confirmText: "Ya, Hapus",
    onConfirm: async () => {
      setActionLoading(true);

      const result = await deleteNews(Number(id));

      if (result.success) {
        showSuccessToast("Berita berhasil dihapus");
        setTimeout(() => {
          navigate("/news");
        }, 1500);
      } else {
        showErrorToast(result.message);
      }

      setActionLoading(false);
    },
  });
};
```

**2. Toggle Publish Handler:**

```typescript
const handleTogglePublish = (checked: boolean) => {
  const action = checked ? "mempublikasikan" : "membatalkan publikasi";

  showConfirmAlert({
    message: `Apakah Anda yakin ingin ${action} berita ini?`,
    confirmText: `Ya, ${checked ? "Publikasikan" : "Batalkan"}`,
    onConfirm: async () => {
      setActionLoading(true);

      const result = checked
        ? await publishNews(Number(id))
        : await unpublishNews(Number(id));

      if (result.success) {
        setIsPublished(checked);
        showSuccessToast(
          `Berita berhasil ${checked ? "dipublikasikan" : "dibatalkan publikasinya"}`
        );
      }

      setActionLoading(false);
    },
  });
};
```

**Loading State:**

```typescript
if (isLoading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <Spinner />
        <p>Memuat detail berita...</p>
      </div>
    </div>
  );
}
```

**Not Found State:**

```typescript
if (!news && !isLoading) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Berita Tidak Ditemukan</h1>
        <Button onClick={() => navigate("/news")}>
          <ArrowLeft /> Kembali
        </Button>
      </div>
      <Card>
        <CardContent>
          <p>Berita yang Anda cari tidak ada.</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Date Formatting:**

```typescript
new Date(news.created_at).toLocaleDateString("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
// Output: "10 Desember 2025"
```

#### NewsFormPage (`src/pages/NewsFormPage.tsx`)

**Deskripsi:**
Halaman form untuk membuat berita baru atau mengedit berita yang sudah ada. Form ini menyediakan rich text editor sederhana dengan HTML formatting, image upload untuk thumbnail, dan tag management.

**Fungsi Utama:**

- Create/edit news article
- Upload thumbnail image (base64)
- Write HTML content dengan formatting toolbar
- Add/remove tags
- Set category
- Toggle publish status
- Preview thumbnail

**Mode Operasi:**

**1. Create Mode:** `!id`

- Empty form
- Submit → `createNews()`

**2. Edit Mode:** `!!id`

- Load existing news
- Pre-populate form
- Submit → `updateNews()`

**Form Structure:**

**1. Informasi Dasar:**

```typescript
interface CreateNewsData {
  title: string; // Judul berita (required)
  excerpt: string; // Ringkasan max 200 chars (required)
  content: string; // Konten HTML (required)
  thumbnail: string; // Base64 image (required)
  category: NewsCategory; // Category (required)
  is_published: boolean; // Publish switch
  tags: string[]; // Array of tags
}
```

**Form Fields:**

**a. Informasi Dasar Card:**

```typescript
<Card>
  <CardHeader><CardTitle>Informasi Dasar</CardTitle></CardHeader>
  <CardContent>
    {/* Title */}
    <Label>Judul Berita *</Label>
    <Input
      value={formData.title}
      onChange={(e) => handleInputChange("title", e.target.value)}
      placeholder="Masukkan judul berita"
      required
    />

    {/* Category */}
    <Label>Kategori *</Label>
    <Select
      value={formData.category}
      onValueChange={(value) => handleInputChange("category", value)}
    >
      <SelectItem value={NewsCategories.ANNOUNCEMENT}>
        Pengumuman
      </SelectItem>
      <SelectItem value={NewsCategories.SUCCESS_STORY}>
        Kisah Sukses
      </SelectItem>
      <SelectItem value={NewsCategories.EVENT}>
        Event
      </SelectItem>
      <SelectItem value={NewsCategories.ARTICLE}>
        Artikel
      </SelectItem>
    </Select>

    {/* Excerpt */}
    <Label>Ringkasan *</Label>
    <Textarea
      value={formData.excerpt}
      onChange={(e) => handleInputChange("excerpt", e.target.value)}
      placeholder="Masukkan ringkasan berita (maks. 200 karakter)"
      rows={3}
      maxLength={200}
      required
    />
    <p className="text-xs">
      {formData.excerpt.length}/200 karakter
    </p>

    {/* Publish Toggle */}
    <div className="flex items-center space-x-2">
      <Switch
        id="is_published"
        checked={formData.is_published}
        onCheckedChange={(checked) =>
          handleInputChange("is_published", checked)
        }
      />
      <Label>Publikasikan Sekarang</Label>
    </div>
  </CardContent>
</Card>
```

**b. Thumbnail Card:**

```typescript
<Card>
  <CardHeader><CardTitle>Thumbnail</CardTitle></CardHeader>
  <CardContent>
    {thumbnailPreview ? (
      <div className="space-y-2">
        <img
          src={thumbnailPreview}
          alt="Pratinjau thumbnail"
          className="w-full max-w-md h-48 object-cover rounded"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setThumbnailPreview("");
            handleInputChange("thumbnail", "");
          }}
        >
          Hapus
        </Button>
      </div>
    ) : (
      <div className="border-2 border-dashed rounded-lg p-8">
        <Upload className="mx-auto h-12 w-12" />
        <Label htmlFor="thumbnail-upload" className="cursor-pointer">
          <span>
            {isUploading
              ? "Mengupload..."
              : "Klik untuk upload thumbnail (rasio 16:9)"}
          </span>
          <Input
            id="thumbnail-upload"
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </Label>
      </div>
    )}
  </CardContent>
</Card>
```

**Image Upload Handler:**

```typescript
const handleFileUpload = async (file: File) => {
  try {
    // Validate image type
    if (!isImageFile(file)) {
      showWarningToast("Mohon upload file gambar (JPG, PNG, dll)");
      return;
    }

    // Validate size (max 5MB)
    if (!validateImageSize(file, 5)) {
      showWarningToast("Ukuran file maksimal 5MB");
      return;
    }

    setIsUploading(true);

    // Convert to base64
    const base64String = await fileToBase64(file);

    // Update form
    handleInputChange("thumbnail", base64String);
    setThumbnailPreview(base64String);

    showSuccessToast("Gambar berhasil diupload!");
  } catch (error) {
    showErrorToast("Gagal mengupload gambar.");
  } finally {
    setIsUploading(false);
  }
};
```

**c. Konten Berita Card:**

**HTML Formatting Toolbar:**

```typescript
<div className="flex flex-wrap gap-2 p-2 bg-muted rounded-lg">
  <Button type="button" variant="outline" size="sm" onClick={() => insertHtmlTag("h2")}>
    H2
  </Button>
  <Button type="button" variant="outline" size="sm" onClick={() => insertHtmlTag("h3")}>
    H3
  </Button>
  <Button type="button" variant="outline" size="sm" onClick={() => insertHtmlTag("p")}>
    P
  </Button>
  <Button type="button" variant="outline" size="sm" onClick={() => insertHtmlTag("strong")}>
    <strong>B</strong>
  </Button>
  <Button type="button" variant="outline" size="sm" onClick={() => insertHtmlTag("em")}>
    <em>I</em>
  </Button>
  <Button type="button" variant="outline" size="sm" onClick={() => insertHtmlTag("ul")}>
    UL
  </Button>
  <Button type="button" variant="outline" size="sm" onClick={() => insertHtmlTag("ol")}>
    OL
  </Button>
  <Button type="button" variant="outline" size="sm" onClick={() => insertHtmlTag("blockquote")}>
    Quote
  </Button>
</div>
```

**Insert HTML Tag Function:**

```typescript
const insertHtmlTag = (tag: string) => {
  const textarea = contentRef.current;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = formData.content.substring(start, end);

  let insertion = "";
  switch (tag) {
    case "h2":
      insertion = `<h2>${selectedText || "Heading 2"}</h2>`;
      break;
    case "h3":
      insertion = `<h3>${selectedText || "Heading 3"}</h3>`;
      break;
    case "p":
      insertion = `<p>${selectedText || "Paragraf"}</p>`;
      break;
    case "strong":
      insertion = `<strong>${selectedText || "Bold"}</strong>`;
      break;
    case "em":
      insertion = `<em>${selectedText || "Italic"}</em>`;
      break;
    case "ul":
      insertion = `<ul>\n  <li>${selectedText || "Item 1"}</li>\n  <li>Item 2</li>\n</ul>`;
      break;
    case "ol":
      insertion = `<ol>\n  <li>${selectedText || "Item 1"}</li>\n  <li>Item 2</li>\n</ol>`;
      break;
    case "blockquote":
      insertion = `<blockquote>${selectedText || "Quote"}</blockquote>`;
      break;
  }

  const newContent =
    formData.content.substring(0, start) +
    insertion +
    formData.content.substring(end);

  handleInputChange("content", newContent);

  // Set cursor position
  setTimeout(() => {
    textarea.focus();
    const newPosition = start + insertion.length;
    textarea.setSelectionRange(newPosition, newPosition);
  }, 0);
};
```

**Content Textarea:**

```typescript
<Textarea
  ref={contentRef}
  value={formData.content}
  onChange={(e) => handleInputChange("content", e.target.value)}
  placeholder="Tulis konten berita dengan HTML..."
  rows={20}
  className="font-mono text-sm"
  required
/>
<p className="text-xs text-muted-foreground">
  Gunakan HTML tags untuk formatting. Contoh: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, dll.
</p>
```

**d. Tags Card:**

**Tag Management:**

```typescript
<Card>
  <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
  <CardContent>
    {/* Add Tag Input */}
    <div className="flex gap-2">
      <Input
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
          }
        }}
        placeholder="Masukkan tag dan tekan Enter"
      />
      <Button type="button" variant="outline" onClick={handleAddTag}>
        Tambah
      </Button>
    </div>

    {/* Display Tags */}
    {formData.tags.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {formData.tags.map((tag, idx) => (
          <div key={idx} className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
            <span>#{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>
```

**Tag Functions:**

```typescript
const handleAddTag = () => {
  if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()],
    }));
    setTagInput("");
  }
};

const handleRemoveTag = (tagToRemove: string) => {
  setFormData((prev) => ({
    ...prev,
    tags: prev.tags.filter((tag) => tag !== tagToRemove),
  }));
};
```

**Form Validation:**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  // Required fields
  if (!formData.title || !formData.excerpt || !formData.content) {
    showWarningToast("Mohon lengkapi semua field yang wajib diisi");
    return;
  }

  // Thumbnail required
  if (!formData.thumbnail) {
    showWarningToast("Mohon upload gambar thumbnail");
    return;
  }

  // Submit...
  setIsUploading(true);

  try {
    let result;
    if (isEditMode && id) {
      result = await updateNews(Number(id), formData);
    } else {
      result = await createNews(formData);
    }

    if (result.success) {
      showSuccessToast(
        isEditMode ? "Berita berhasil diperbarui!" : "Berita berhasil dibuat!"
      );
      navigate("/news");
    } else {
      showErrorToast(result.message);
      setError(result.message);
    }
  } catch (error) {
    showErrorToast("Terjadi kesalahan");
    setError("Terjadi kesalahan yang tidak terduga");
  } finally {
    setIsUploading(false);
  }
};
```

**Action Buttons:**

```typescript
<div className="flex gap-4 justify-end">
  <Button
    type="button"
    variant="outline"
    onClick={() => navigate("/news")}
    disabled={isLoading || isUploading}
  >
    Batal
  </Button>
  <Button type="submit" disabled={isLoading || isUploading}>
    {isLoading
      ? isEditMode ? "Memperbarui..." : "Membuat..."
      : isEditMode ? "Perbarui Berita" : "Buat Berita"}
  </Button>
</div>
```

**Loading States:**

1. **Initial Load (Edit Mode):**
   - Spinner + "Memuat data berita..."

2. **Upload State:**
   - `isUploading`: true
   - Disable thumbnail input
   - "Mengupload..." text

3. **Submit State:**
   - Disable all form inputs
   - Submit button shows "Membuat..." atau "Memperbarui..."

**Data Loading (Edit Mode):**

```typescript
useEffect(() => {
  if (isEditMode && id) {
    getNewsById(Number(id));
  }

  return () => {
    if (isEditMode) {
      clearCurrentNews();
    }
  };
}, [id, isEditMode]);

useEffect(() => {
  if (isEditMode && currentNews) {
    setFormData({
      title: currentNews.title || "",
      excerpt: currentNews.excerpt || "",
      content: currentNews.content || "",
      thumbnail: currentNews.thumbnail || "",
      category: currentNews.category || NewsCategories.ANNOUNCEMENT,
      is_published: currentNews.is_published ?? false,
      tags: currentNews.tags || [],
    });

    if (currentNews.thumbnail) {
      setThumbnailPreview(currentNews.thumbnail);
    }
  }
}, [currentNews, isEditMode]);
```

**Navigation:**

- Success: `/news`
- Cancel: `/news`
- Back: `/news`

## 8. Services & API Integration

### a. API Configuration

#### Base URL Setup

**File:** `src/lib/const.ts`

**Deskripsi:**
Konfigurasi Base URL adalah pengaturan dasar untuk menentukan alamat server backend yang akan digunakan oleh aplikasi frontend untuk berkomunikasi dengan API.

**Implementasi:**

```typescript
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/v1";
```

**Penjelasan:**

- **Environment Variable**: Menggunakan `import.meta.env.VITE_API_URL` untuk membaca URL dari environment variable
- **Fallback Value**: Jika environment variable tidak tersedia, akan menggunakan `http://localhost:8080/v1` sebagai default
- **Kegunaan**: Base URL ini digunakan oleh semua service untuk membentuk endpoint lengkap saat melakukan request ke API
- **Fleksibilitas**: Memudahkan deployment ke berbagai environment (development, staging, production) tanpa mengubah kode

**Penggunaan:**

```typescript
const response = await fetch(`${API_BASE_URL}/endpoint`, options);
```

#### API Call Utilities

**Deskripsi:**
API Call Utilities adalah fungsi-fungsi helper yang digunakan untuk mempermudah dan menstandardisasi pemanggilan API di seluruh aplikasi.

**Lokasi Implementasi:**

- `src/contexts/AuthContext.tsx`
- `src/contexts/ApplicationContext.tsx`
- `src/contexts/ProgramContext.tsx`
- `src/contexts/NewsContext.tsx`
- `src/contexts/UserContext.tsx`
- `src/contexts/SettingsContext.tsx`
- `src/contexts/DashboardContext.tsx`

**Fungsi Utama:**

##### 1. `apiCall<T>()` - Standard API Call

**Implementasi:**

```typescript
async function apiCall<T>(
  endpoint: string,
  token: string | null,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
```

**Fitur:**

- **Generic Type Support**: Menggunakan TypeScript generics untuk type safety
- **Automatic Header Management**: Otomatis menambahkan Content-Type dan Authorization headers
- **Token Injection**: Menyisipkan JWT token jika tersedia
- **Error Handling**: Menangani error response dan melempar exception yang sesuai
- **Response Validation**: Memvalidasi status response sebelum mengembalikan data

**Parameter:**

- `endpoint`: String path endpoint (contoh: `/users`, `/applications/1`)
- `token`: JWT authentication token (nullable)
- `options`: RequestInit object untuk konfigurasi tambahan (method, body, dll)

**Return Type:**

```typescript
interface ApiResponse<T> {
  statusCode: number;
  status: boolean;
  message: string;
  data: T;
}
```

##### 2. `apiCallFile()` - File Download API Call

**Implementasi:**

```typescript
async function apiCallFile(
  endpoint: string,
  token: string | null,
  options: RequestInit = {}
): Promise<Blob> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to download file");
  }

  return await response.blob();
}
```

**Fitur:**

- **Blob Response**: Mengembalikan file sebagai Blob untuk download
- **File Export**: Digunakan khusus untuk export PDF/Excel
- **Stream Handling**: Menangani binary data dengan efisien

**Kegunaan:**

- Export laporan aplikasi
- Export laporan program
- Download dokumen

### b. Authentication Services

#### Login API

**File:** `src/contexts/AuthContext.tsx`

**Deskripsi:**
Service untuk menangani proses autentikasi pengguna ke dalam sistem.

**Implementasi:**

```typescript
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    setIsLoading(true);

    const response = await apiCall<LoginResponse>("/webauth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.status && response.data) {
      const jwtToken = response.data;

      // Parse JWT to get user data
      const userData = parseJwt(jwtToken);

      if (userData) {
        // Save to state
        setToken(jwtToken);
        setUser(userData);

        // Persist to localStorage
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem(
          "permissions",
          JSON.stringify(userData.permissions)
        );

        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  } finally {
    setIsLoading(false);
  }
};
```

**Fitur:**

- **JWT Authentication**: Menggunakan JSON Web Token untuk autentikasi
- **Token Parsing**: Ekstraksi informasi user dari JWT payload
- **State Management**: Menyimpan token dan user data di React state
- **Persistence**: Menyimpan data ke localStorage untuk session persistence
- **Error Handling**: Menangani error login dengan graceful
- **Loading State**: Mengelola loading state untuk UI feedback

**Request Format:**

```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response Format:**

```typescript
interface LoginResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: string; // JWT token
}
```

**User Data Structure:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: number;
  role_name: string;
  permissions: string[];
}
```

**JWT Parsing Function:**

```typescript
function parseJwt(token: string): User | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return null;
  }
}
```

**Penggunaan:**

```typescript
const { login } = useAuth();

const handleLogin = async () => {
  const success = await login("admin@example.com", "password123");
  if (success) {
    navigate("/");
  } else {
    showErrorToast("Login gagal");
  }
};
```

#### Register API

**File:** `src/contexts/AuthContext.tsx`

**Deskripsi:**
Service untuk registrasi pengguna baru (admin) ke dalam sistem.

**Implementasi:**

```typescript
const register = async (
  data: RegisterData
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);

    const response = await apiCall<RegisterResponse>(
      "/webauth/register",
      token,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (response.status) {
      return {
        success: true,
        message: response.message || "Registration successful",
      };
    }

    return {
      success: false,
      message: response.message || "Registration failed",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Registration failed";
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

**Fitur:**

- **User Creation**: Membuat akun admin baru
- **Role Assignment**: Mengassign role ke user baru
- **Password Validation**: Validasi password dan konfirmasi password
- **Response Handling**: Mengembalikan status success/failure dengan message
- **Error Management**: Menangani berbagai error scenario

**Request Format:**

```typescript
interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  role_id: number;
}
```

**Response Format:**

```typescript
interface RegisterResponse {
  statusCode: number;
  status: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
  };
}
```

**Validasi:**

```typescript
// Password match validation
if (data.password !== data.confirm_password) {
  throw new Error("Passwords do not match");
}

// Password length validation
if (data.password.length < 8) {
  throw new Error("Password must be at least 8 characters");
}
```

**Penggunaan:**

```typescript
const { register } = useAuth();

const handleRegister = async () => {
  const result = await register({
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    confirm_password: "password123",
    role_id: 2,
  });

  if (result.success) {
    showSuccessToast(result.message);
    navigate("/admin/list");
  } else {
    showErrorToast(result.message);
  }
};
```

#### Token Management

**File:** `src/contexts/AuthContext.tsx`

**Deskripsi:**
System untuk mengelola JWT token yang digunakan untuk autentikasi di seluruh aplikasi.

**Implementasi:**

##### 1. Token Initialization

```typescript
const [token, setToken] = useState<string | null>(null);

useEffect(() => {
  const initAuth = () => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      // Clear corrupted data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  };

  initAuth();
}, []);
```

##### 2. Token Storage

```typescript
// Save token after successful login
localStorage.setItem("token", jwtToken);
localStorage.setItem("user", JSON.stringify(userData));
localStorage.setItem("permissions", JSON.stringify(userData.permissions));
```

##### 3. Token Usage in API Calls

```typescript
async function apiCall<T>(
  endpoint: string,
  token: string | null,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // ... rest of implementation
}
```

##### 4. Token Cleanup on Logout

```typescript
const logout = () => {
  setUser(null);
  setToken(null);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("permissions");
};
```

**Fitur:**

- **Persistence**: Token disimpan di localStorage untuk session persistence
- **Auto-Injection**: Token otomatis diinjeksi ke semua API requests
- **Security**: Token dikirim via Authorization header dengan Bearer scheme
- **Initialization**: Auto-load token saat aplikasi dimulai
- **Cleanup**: Token dihapus saat logout
- **Error Recovery**: Handling corrupted token data

**Token Format:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Security Considerations:**

- Token disimpan di localStorage (vulnerable to XSS)
- Menggunakan HTTPS untuk mencegah man-in-the-middle attacks
- Token memiliki expiration time
- Validasi token di setiap request

### c. Application Services

#### Get Applications

**File:** `src/contexts/ApplicationContext.tsx`

**Deskripsi:**
Service untuk mengambil daftar aplikasi/pengajuan dari database dengan opsi filtering berdasarkan tipe.

**Implementasi:**

##### 1. Get All Applications

```typescript
const getAllApplications = async (filterType?: ApplicationType) => {
  try {
    setIsLoading(true);
    setError(null);
    startProgress();

    const queryParams = filterType ? `?type=${filterType}` : "";
    const response = await apiCall<Application[]>(
      `/applications/${queryParams}`,
      token,
      {
        method: "GET",
      }
    );

    setApplications(response.data);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch applications";
    setError(errorMessage);
    console.error("Get all applications error:", err);
  } finally {
    setIsLoading(false);
    stopProgress();
  }
};
```

##### 2. Get Application by ID

```typescript
const getApplicationById = async (id: number) => {
  try {
    setIsLoading(true);
    setError(null);
    startProgress();

    const response = await apiCall<Application>(`/applications/${id}`, token, {
      method: "GET",
    });

    setCurrentApplication(response.data);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch application";
    setError(errorMessage);
    console.error("Get application by ID error:", err);
  } finally {
    setIsLoading(false);
    stopProgress();
  }
};
```

**Fitur:**

- **Filtering**: Mendukung filter berdasarkan tipe aplikasi (training, certification, funding)
- **Detail View**: Mengambil detail lengkap aplikasi berdasarkan ID
- **Loading State**: Mengelola loading state dengan NProgress
- **Error Handling**: Menangani error dengan informasi yang jelas
- **State Management**: Menyimpan data di React state untuk akses cepat

**Application Data Structure:**

```typescript
interface Application {
  id: number;
  umkm_id: number;
  program_id: number;
  type: ApplicationType; // "training" | "certification" | "funding"
  status: ApplicationStatus; // "screening" | "revised" | "final" | "approved" | "rejected"
  submitted_at: string;
  expired_at: string;
  created_at: string;
  updated_at: string;
  documents?: ApplicationDocument[];
  histories?: ApplicationHistory[];
  program?: Program;
  umkm?: UMKM;

  // Type-specific data
  training_data?: TrainingApplicationData;
  certification_data?: CertificationApplicationData;
  funding_data?: FundingApplicationData;
}
```

**Query Parameters:**

```typescript
// Get all applications
GET /applications/

// Get training applications only
GET /applications/?type=training

// Get certification applications only
GET /applications/?type=certification

// Get funding applications only
GET /applications/?type=funding

// Get specific application
GET /applications/123
```

**Penggunaan:**

```typescript
const {
  getAllApplications,
  getApplicationById,
  applications,
  currentApplication,
} = useApplications();

// Get all applications
useEffect(() => {
  getAllApplications();
}, []);

// Get filtered applications
useEffect(() => {
  getAllApplications("training");
}, []);

// Get specific application
useEffect(() => {
  if (id) {
    getApplicationById(Number(id));
  }
}, [id]);
```

**Related Components:**

- `TrainingPage.tsx` - Menampilkan aplikasi pelatihan
- `CertificationPage.tsx` - Menampilkan aplikasi sertifikasi
- `FundingPage.tsx` - Menampilkan aplikasi pendanaan
- `ApplicationDetailPage.tsx` - Menampilkan detail aplikasi

#### Application Approval/Rejection

**File:** `src/contexts/ApplicationContext.tsx`

**Deskripsi:**
Service untuk menangani proses approval dan rejection aplikasi pada tahap screening dan final.

**Implementasi:**

##### 1. Screening Approve

```typescript
const screeningApprove = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);
    startProgress();

    const response = await apiCall<Application>(
      `/applications/screening-approve/${id}`,
      token,
      {
        method: "PUT",
      }
    );

    // Refresh applications list
    await getAllApplications();
    const successMessage =
      response.message || "Application approved by screening";

    return {
      success: true,
      message: successMessage,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to approve application";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
    stopProgress();
  }
};
```

##### 2. Screening Reject

```typescript
const screeningReject = async (
  decision: ApplicationDecision
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);
    startProgress();

    const response = await apiCall<Application>(
      `/applications/screening-reject/${decision.application_id}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify({ notes: decision.notes }),
      }
    );

    // Refresh applications list
    await getAllApplications();
    const successMessage =
      response.message || "Application rejected by screening";

    return {
      success: true,
      message: successMessage,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to reject application";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
    stopProgress();
  }
};
```

##### 3. Final Approve

```typescript
const finalApprove = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<Application>(
      `/applications/final-approve/${id}`,
      token,
      {
        method: "PUT",
      }
    );

    // Refresh applications list
    await getAllApplications();

    return {
      success: true,
      message: response.message || "Application approved by vendor",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to approve application";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

##### 4. Final Reject

```typescript
const finalReject = async (
  decision: ApplicationDecision
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<Application>(
      `/applications/final-reject/${decision.application_id}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify({ notes: decision.notes }),
      }
    );

    // Refresh applications list
    await getAllApplications();

    return {
      success: true,
      message: response.message || "Application rejected by vendor",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to reject application";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

**Fitur:**

- **Two-Stage Approval**: Mendukung approval di tahap screening dan final
- **Rejection with Notes**: Mewajibkan catatan/alasan saat reject
- **Auto Refresh**: Otomatis refresh daftar aplikasi setelah action
- **Status Update**: Mengupdate status aplikasi di database
- **History Tracking**: Mencatat semua action ke history log
- **Permission-Based**: Hanya user dengan permission yang sesuai yang bisa approve/reject

**Request Format:**

```typescript
interface ApplicationDecision {
  application_id: number;
  action: "approve" | "reject" | "revise";
  notes?: string;
}
```

**Workflow:**

```
SUBMITTED → SCREENING → [Approve] → FINAL → [Approve] → APPROVED
                     ↓                    ↓
                  [Reject]            [Reject]
                     ↓                    ↓
                  REJECTED            REJECTED
```

**Endpoints:**

```
PUT /applications/screening-approve/:id
PUT /applications/screening-reject/:id
PUT /applications/final-approve/:id
PUT /applications/final-reject/:id
```

**Penggunaan:**

```typescript
const { screeningApprove, screeningReject, finalApprove, finalReject } =
  useApplications();

// Screening approve
const handleScreeningApprove = async () => {
  const result = await screeningApprove(applicationId);
  if (result.success) {
    showSuccessToast(result.message);
    navigate(-1);
  }
};

// Screening reject with notes
const handleScreeningReject = async () => {
  const result = await screeningReject({
    application_id: applicationId,
    action: "reject",
    notes: "Dokumen tidak lengkap",
  });
  if (result.success) {
    showSuccessToast(result.message);
  }
};

// Final approve
const handleFinalApprove = async () => {
  const result = await finalApprove(applicationId);
  if (result.success) {
    showSuccessToast(result.message);
  }
};

// Final reject with notes
const handleFinalReject = async () => {
  const result = await finalReject({
    application_id: applicationId,
    action: "reject",
    notes: "Tidak memenuhi kriteria pendanaan",
  });
  if (result.success) {
    showSuccessToast(result.message);
  }
};
```

**Permission Requirements:**

```typescript
// Screening stage
SCREENING_TRAINING;
SCREENING_CERTIFICATION;
SCREENING_FUNDING;

// Final stage
FINAL_TRAINING;
FINAL_CERTIFICATION;
FINAL_FUNDING;
```

#### Application Revision

**File:** `src/contexts/ApplicationContext.tsx`

**Deskripsi:**
Service untuk meminta revisi/perbaikan pada aplikasi yang perlu dilengkapi atau diperbaiki oleh pemohon.

**Implementasi:**

```typescript
const screeningRevise = async (
  decision: ApplicationDecision
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<Application>(
      `/applications/screening-revise/${decision.application_id}`,
      token,
      {
        method: "PUT",
        body: JSON.stringify({ notes: decision.notes }),
      }
    );

    // Refresh applications list
    await getAllApplications();

    return {
      success: true,
      message: response.message || "Application revision requested",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to request revision";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

**Fitur:**

- **Revision Notes**: Mewajibkan catatan instruksi perbaikan
- **Status Update**: Mengubah status aplikasi menjadi "revised"
- **Notification**: Notifikasi ke pemohon tentang revisi yang diminta
- **Multiple Revisions**: Mendukung multiple rounds of revision
- **History Tracking**: Mencatat request revisi di history log

**Request Format:**

```typescript
interface ApplicationDecision {
  application_id: number;
  action: "revise";
  notes: string; // Required - instruksi perbaikan
}
```

**Workflow:**

```
SCREENING → [Request Revision] → REVISED
                                    ↓
                            [User resubmits]
                                    ↓
                              SCREENING (again)
```

**Endpoint:**

```
PUT /applications/screening-revise/:id
Body: { notes: "Mohon lengkapi dokumen KTP dan NPWP" }
```

**Penggunaan:**

```typescript
const { screeningRevise } = useApplications();

const handleRequestRevision = async () => {
  if (!revisionNotes.trim()) {
    showWarningToast("Instruksi perbaikan tidak boleh kosong");
    return;
  }

  showConfirmAlert({
    message: "Kirim instruksi perbaikan ke pemohon?",
    confirmText: "Ya, Kirim",
    cancelText: "Batal",
    onConfirm: async () => {
      const result = await screeningRevise({
        application_id: applicationId,
        action: "revise",
        notes: revisionNotes,
      });

      if (result.success) {
        showSuccessToast("Instruksi perbaikan berhasil dikirim");
        setRevisionNotes("");
        navigate(-1);
      } else {
        showErrorToast(result.message);
      }
    },
  });
};
```

**Contoh Notes:**

```
"Mohon lengkapi dokumen berikut:
1. Fotokopi KTP yang masih berlaku
2. NPWP perusahaan
3. Surat keterangan domisili usaha

Silakan upload ulang dalam 7 hari."
```

**UI Component (ApplicationDetailPage.tsx):**

```typescript
{showRevisionInput && (
  <div className="space-y-2">
    <Textarea
      placeholder="Masukkan instruksi perbaikan..."
      value={revisionReason}
      onChange={(e) => setRevisionReason(e.target.value)}
      disabled={actionLoading}
    />
    <Button
      className="w-full"
      size="sm"
      onClick={handleScreeningRevise}
      disabled={actionLoading}
    >
      {actionLoading ? "Sending..." : "Kirim Instruksi Perbaikan"}
    </Button>
  </div>
)}
```

**Related Data:**

```typescript
interface ApplicationHistory {
  id: number;
  application_id: number;
  status: "revise";
  notes: string; // Instruksi perbaikan
  actioned_at: string;
  actioned_by: number;
  actioned_by_name: string;
}
```

### d. Program Services

#### Get Programs

**File:** `src/contexts/ProgramContext.tsx`

**Deskripsi:**
Service untuk mengambil daftar program dan detail program individual dari database.

**Implementasi:**

##### 1. Get All Programs

```typescript
const getAllPrograms = async () => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<Program[]>("/programs/", token, {
      method: "GET",
    });

    setPrograms(response.data);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch programs";
    setError(errorMessage);
    console.error("Get all programs error:", err);
  } finally {
    setIsLoading(false);
  }
};
```

##### 2. Get Program by ID

```typescript
const getProgramById = async (id: number) => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<Program>(`/programs/${id}`, token, {
      method: "GET",
    });

    setCurrentProgram(response.data);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch program";
    setError(errorMessage);
    console.error("Get program by ID error:", err);
  } finally {
    setIsLoading(false);
  }
};
```

**Fitur:**

- **Complete List**: Mengambil semua program dari semua tipe
- **Detail View**: Detail lengkap program termasuk benefits dan requirements
- **Type Agnostic**: Mendukung semua tipe program (training, certification, funding)
- **Relational Data**: Menyertakan data relasi seperti created_by_name
- **Error Handling**: Menangani error dengan informasi yang jelas

**Program Data Structure:**

```typescript
interface Program {
  id: number;
  title: string;
  description: string;
  banner: string;
  provider: string;
  provider_logo: string;
  type: ProgramType; // "training" | "certification" | "funding"

  // Training & Certification specific
  training_type?: TrainingType; // "online" | "offline" | "hybrid"
  batch?: number;
  batch_start_date?: string;
  batch_end_date?: string;
  location?: string;

  // Funding specific
  min_amount?: number;
  max_amount?: number;
  interest_rate?: number;
  max_tenure_months?: number;

  application_deadline: string;
  is_active: boolean;
  created_by?: number;
  created_by_name?: string;
  created_at?: string;
  updated_at?: string;
  benefits?: string[];
  requirements?: string[];
}
```

**Endpoints:**

```
GET /programs/       // Get all programs
GET /programs/:id    // Get specific program
```

**Response Format:**

```typescript
interface ApiResponse<Program[]> {
  statusCode: 200
  status: true
  message: "Programs retrieved successfully"
  data: Program[]
}
```

**Penggunaan:**

```typescript
const { getAllPrograms, getProgramById, programs, currentProgram } =
  usePrograms();

// Get all programs
useEffect(() => {
  getAllPrograms();
}, []);

// Filter programs by type in component
const trainingPrograms = programs.filter((p) => p.type === "training");
const certificationPrograms = programs.filter(
  (p) => p.type === "certification"
);
const fundingPrograms = programs.filter((p) => p.type === "funding");

// Get specific program
useEffect(() => {
  if (id) {
    getProgramById(Number(id));
  }
}, [id]);
```

**Related Components:**

- `TrainingListPage.tsx` - Display training programs
- `CertificationListPage.tsx` - Display certification programs
- `FundingListPage.tsx` - Display funding programs
- `ProgramDetailPage.tsx`- Display program details

#### Create/Update Programs

**File:** `src/contexts/ProgramContext.tsx`

**Deskripsi:**
Service untuk membuat program baru dan mengupdate program yang sudah ada.

**Implementasi:**

##### 1. Create Program

```typescript
const createProgram = async (
  data: CreateProgramData
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<Program>("/programs/", token, {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Refresh programs list
    await getAllPrograms();

    return {
      success: true,
      message: response.message || "Program created successfully",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to create program";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

##### 2. Update Program

```typescript
const updateProgram = async (
  id: number,
  data: CreateProgramData
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<Program>(`/programs/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    // Refresh programs list
    await getAllPrograms();

    return {
      success: true,
      message: response.message || "Program updated successfully",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update program";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

**Fitur:**

- **Type-Specific Fields**: Mendukung field khusus untuk setiap tipe program
- **Image Upload**: Support base64 image upload untuk banner dan logo
- **Validation**: Validasi data sebelum submit
- **Auto Refresh**: Otomatis refresh list setelah create/update
- **Benefits & Requirements**: Mendukung multiple benefits dan requirements
- **Response Handling**: Return success status dengan message

**Request Format:**

```typescript
interface CreateProgramData {
  title: string;
  description: string;
  banner: string; // base64 or URL
  provider: string;
  provider_logo: string; // base64 or URL
  type: ProgramType;

  // Training/Certification specific
  training_type?: TrainingType;
  batch?: number;
  batch_start_date?: string;
  batch_end_date?: string;
  location?: string;

  // Funding specific
  min_amount?: number;
  max_amount?: number;
  interest_rate?: number;
  max_tenure_months?: number;

  application_deadline: string;
  is_active: boolean;
  benefits?: string[];
  requirements?: string[];
}
```

**Endpoints:**

```
POST /programs/      // Create new program
PUT  /programs/:id   // Update existing program
```

**Validations:**

```typescript
// Required fields
if (
  !formData.title ||
  !formData.description ||
  !formData.application_deadline
) {
  showWarningToast("Mohon lengkapi semua field yang wajib diisi");
  return;
}

// Image uploads
if (!formData.banner || !formData.provider_logo) {
  showWarningToast("Mohon upload banner dan logo provider");
  return;
}

// Type-specific validations
if (formData.type === "funding") {
  if (formData.min_amount > formData.max_amount) {
    showWarningToast("Jumlah minimum tidak boleh lebih besar dari maksimum");
    return;
  }
}
```

**Image Upload Helper:**

```typescript
const handleFileUpload = async (
  field: "banner" | "provider_logo",
  file: File
) => {
  try {
    if (!isImageFile(file)) {
      showWarningToast("Mohon upload file gambar (JPG, PNG, dll)");
      return;
    }

    if (!validateImageSize(file, 5)) {
      showWarningToast("Ukuran file maksimal 5MB");
      return;
    }

    setIsUploading(true);
    const base64String = await fileToBase64(file);
    handleInputChange(field, base64String);

    showSuccessToast("File berhasil diupload!");
  } catch (error) {
    showErrorToast("Gagal mengupload file");
  } finally {
    setIsUploading(false);
  }
};
```

**Penggunaan:**

```typescript
const { createProgram, updateProgram } = usePrograms();

// Create new program
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const result = await createProgram(formData);

  if (result.success) {
    showSuccessToast("Program berhasil dibuat!");
    navigate(`/programs/${formData.type}`);
  } else {
    showErrorToast(result.message);
  }
};

// Update existing program
const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();

  const result = await updateProgram(programId, formData);

  if (result.success) {
    showSuccessToast("Program berhasil diperbarui!");
    navigate(`/programs/${formData.type}`);
  } else {
    showErrorToast(result.message);
  }
};
```

**Form Component (CreateProgramPage.tsx):**

```typescript
<form onSubmit={handleSubmit}>
  {/* Basic Information */}
  <Input
    value={formData.title}
    onChange={(e) => handleInputChange('title', e.target.value)}
    placeholder="Judul Program"
    required
  />

  <Textarea
    value={formData.description}
    onChange={(e) => handleInputChange('description', e.target.value)}
    placeholder="Deskripsi Program"
    required
  />

  {/* Type Selection */}
  <Select
    value={formData.type}
    onValueChange={(value: ProgramType) => handleInputChange('type', value)}
  >
    <SelectItem value="training">Pelatihan</SelectItem>
    <SelectItem value="certification">Sertifikasi</SelectItem>
    <SelectItem value="funding">Pendanaan</SelectItem>
  </Select>

  {/* Image Uploads */}
  <Input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files?.[0]
      if (file) handleFileUpload('banner', file)
    }}
  />

  {/* Dynamic Benefits */}
  {formData.benefits.map((benefit, index) => (
    <Input
      key={index}
      value={benefit}
      onChange={(e) => updateBenefit(index, e.target.value)}
    />
  ))}

  <Button type="submit">
    {isEditMode ? 'Perbarui Program' : 'Buat Program'}
  </Button>
</form>
```

#### Activate/Deactivate Programs

**File:** `src/contexts/ProgramContext.tsx`

**Deskripsi:**
Service untuk mengaktifkan dan menonaktifkan program.

**Implementasi:**

##### 1. Activate Program

```typescript
const activateProgram = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<Program>(`/programs/activate/${id}`, token, {
      method: "PUT",
    });

    // Update local state
    setPrograms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: true } : p))
    );

    return {
      success: true,
      message: response.message || "Program activated successfully",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to activate program";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

##### 2. Deactivate Program

```typescript
const deactivateProgram = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<Program>(
      `/programs/deactivate/${id}`,
      token,
      {
        method: "PUT",
      }
    );

    // Update local state
    setPrograms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: false } : p))
    );

    return {
      success: true,
      message: response.message || "Program deactivated successfully",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to deactivate program";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

**Fitur:**

- **Status Toggle**: Toggle status aktif/non-aktif program
- **Optimistic Update**: Update local state langsung untuk fast UI
- **Application Control**: Program non-aktif tidak menerima aplikasi baru
- **Visibility Control**: Program non-aktif tidak ditampilkan di mobile app
- **Confirmation Dialog**: Konfirmasi sebelum melakukan action

**Endpoints:**

```
PUT /programs/activate/:id    // Activate program
PUT /programs/deactivate/:id  // Deactivate program
```

**Use Cases:**

- **Temporary Closure**: Menutup sementara pendaftaran program
- **Program Ended**: Menonaktifkan program yang sudah berakhir
- **Capacity Full**: Menonaktifkan program yang kuota sudah penuh
- **Maintenance**: Menonaktifkan saat update informasi program

**Penggunaan:**

```typescript
const { activateProgram, deactivateProgram } = usePrograms();

const handleToggleActive = (checked: boolean) => {
  const action = checked ? "mengaktifkan" : "menonaktifkan";

  showConfirmAlert({
    message: `Apakah Anda yakin ingin ${action} program ini?`,
    confirmText: `Ya, ${checked ? "Aktifkan" : "Nonaktifkan"}`,
    cancelText: "Batal",
    onConfirm: async () => {
      setActionLoading(true);

      const result = checked
        ? await activateProgram(programId)
        : await deactivateProgram(programId);

      if (result.success) {
        setIsActive(checked);
        showSuccessToast(
          `Program berhasil ${checked ? "diaktifkan" : "dinonaktifkan"}`
        );
      } else {
        showErrorToast(result.message);
      }

      setActionLoading(false);
    },
  });
};
```

**UI Component (ProgramDetailPage.tsx):**

```typescript
<Card>
  <CardHeader>
    <CardTitle>Status Program</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex items-center justify-between">
      <Label htmlFor="active-toggle">Status Aktif</Label>
      <Switch
        id="active-toggle"
        checked={isActive}
        onCheckedChange={handleToggleActive}
        disabled={actionLoading}
      />
    </div>
    <p className="text-sm text-muted-foreground">
      {isActive
        ? 'Program saat ini aktif dan menerima pendaftaran.'
        : 'Program tidak aktif dan tidak menerima pendaftaran.'}
    </p>
  </CardContent>
</Card>
```

**Program Status Badge:**

```typescript
<Badge variant={program.is_active ? 'default' : 'secondary'}>
  {program.is_active ? 'Aktif' : 'Tidak Aktif'}
</Badge>
```

**Filter by Status:**

```typescript
// In list pages
const filteredPrograms = programs.filter((program) => {
  const matchesStatus =
    statusFilter === "all" ||
    (statusFilter === "active" && program.is_active) ||
    (statusFilter === "inactive" && !program.is_active);
  return matchesStatus;
});
```

### e. Dashboard Services

#### Get Statistics

**File:** `src/contexts/DashboardContext.tsx`

**Deskripsi:**
Service untuk mengambil data statistik yang ditampilkan di dashboard admin.

**Implementasi:**

##### 1. Get Status Summary

```typescript
const fetchStatusSummary = async () => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<StatusSummary[]>(
      "/dashboard/application-status-summary",
      token,
      { method: "GET" }
    );

    // Convert array to single object
    const summary = response.data.reduce((acc, item) => {
      return { ...acc, ...item };
    }, {} as StatusSummary);

    setStatusSummary(summary);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch status summary";
    setError(errorMessage);
    console.error("Fetch status summary error:", err);
  } finally {
    setIsLoading(false);
  }
};
```

##### 2. Get Status Detail

```typescript
const fetchStatusDetail = async () => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<StatusDetail[]>(
      "/dashboard/application-status-detail",
      token,
      { method: "GET" }
    );

    // Convert array to single object
    const detail = response.data.reduce((acc, item) => {
      return { ...acc, ...item };
    }, {} as StatusDetail);

    setStatusDetail(detail);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch status detail";
    setError(errorMessage);
    console.error("Fetch status detail error:", err);
  } finally {
    setIsLoading(false);
  }
};
```

##### 3. Get Application by Type

```typescript
const fetchApplicationByType = async () => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<ApplicationByType[]>(
      "/dashboard/application-by-type",
      token,
      { method: "GET" }
    );

    // Convert array to single object
    const byType = response.data.reduce((acc, item) => {
      return { ...acc, ...item };
    }, {} as ApplicationByType);

    setApplicationByType(byType);
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Failed to fetch application by type";
    setError(errorMessage);
    console.error("Fetch application by type error:", err);
  } finally {
    setIsLoading(false);
  }
};
```

##### 4. Fetch All Dashboard Data

```typescript
const fetchAllDashboardData = async () => {
  try {
    setIsLoading(true);
    setError(null);

    await Promise.all([
      fetchCardTypeData(),
      fetchStatusSummary(),
      fetchStatusDetail(),
      fetchApplicationByType(),
    ]);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch dashboard data";
    setError(errorMessage);
    console.error("Fetch all dashboard data error:", err);
  } finally {
    setIsLoading(false);
  }
};
```

**Fitur:**

- **Aggregate Statistics**: Menampilkan statistik agregat aplikasi
- **Multiple Endpoints**: Mengambil data dari multiple endpoints secara paralel
- **Data Transformation**: Transform array response menjadi object
- **Performance**: Menggunakan Promise.all untuk paralel fetching
- **Error Handling**: Menangani error untuk setiap endpoint

**Data Structures:**

```typescript
interface StatusSummary {
  total_applications: number;
  in_process: number;
  approved: number;
  rejected: number;
}

interface StatusDetail {
  screening: number;
  revised: number;
  final: number;
  approved: number;
  rejected: number;
}

interface ApplicationByType {
  funding: number;
  certification: number;
  training: number;
}
```

**Endpoints:**

```
GET /dashboard/application-status-summary
GET /dashboard/application-status-detail
GET /dashboard/application-by-type
```

**Response Examples:**

Status Summary:

```json
{
  "statusCode": 200,
  "status": true,
  "message": "Success",
  "data": [
    {
      "total_applications": 150,
      "in_process": 45,
      "approved": 85,
      "rejected": 20
    }
  ]
}
```

Status Detail:

```json
{
  "statusCode": 200,
  "status": true,
  "message": "Success",
  "data": [
    {
      "screening": 25,
      "revised": 10,
      "final": 10,
      "approved": 85,
      "rejected": 20
    }
  ]
}
```

Application by Type:

```json
{
  "statusCode": 200,
  "status": true,
  "message": "Success",
  "data": [
    {
      "training": 60,
      "certification": 45,
      "funding": 45
    }
  ]
}
```

**Penggunaan:**

```typescript
const {
  statusSummary,
  statusDetail,
  applicationByType,
  fetchAllDashboardData
} = useDashboard()

// Fetch all data on mount
useEffect(() => {
  fetchAllDashboardData()
}, [])

// Display statistics
return (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader>
        <CardTitle>Total Pengajuan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {statusSummary?.total_applications || 0}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Dalam Proses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {statusSummary?.in_process || 0}
        </div>
      </CardContent>
    </Card>

    {/* More cards... */}
  </div>
)
```

**Charts Integration:**

```typescript
// Status Distribution Pie Chart
const statusData = statusDetail
  ? [
      { name: "Screening", value: statusDetail.screening },
      { name: "Revised", value: statusDetail.revised },
      { name: "Final", value: statusDetail.final },
      { name: "Approved", value: statusDetail.approved },
      { name: "Rejected", value: statusDetail.rejected },
    ].filter((item) => item.value > 0)
  : [];

// Application Type Bar Chart
const typeData = applicationByType
  ? [
      { name: "Pelatihan", count: applicationByType.training },
      { name: "Sertifikasi", count: applicationByType.certification },
      { name: "Pendanaan", count: applicationByType.funding },
    ]
  : [];
```

#### Get Card Type Data

**File:** `src/contexts/DashboardContext.tsx`

**Deskripsi:**
Service untuk mengambil data distribusi UMKM berdasarkan jenis kartu bantuan sosial yang dimiliki.

**Implementasi:**

```typescript
const fetchCardTypeData = async () => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<CardTypeData[]>(
      "/dashboard/umkm-by-card-type",
      token,
      { method: "GET" }
    );

    setCardTypeData(response.data);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch card type data";
    setError(errorMessage);
    console.error("Fetch card type data error:", err);
  } finally {
    setIsLoading(false);
  }
};
```

**Fitur:**

- **Card Type Distribution**: Menampilkan distribusi UMKM berdasarkan kepemilikan kartu
- **Social Assistance Data**: Data bantuan sosial yang dimiliki UMKM
- **Chart Visualization**: Data digunakan untuk bar chart visualization
- **Demographic Insights**: Memberikan insight demografi pengguna

**Data Structure:**

```typescript
interface CardTypeData {
  name: string; // Card type name (e.g., "KIP", "PKH", "BPNT")
  count: number; // Number of UMKMs with this card type
}
```

**Endpoint:**

```
GET /dashboard/umkm-by-card-type
```

**Response Example:**

```json
{
  "statusCode": 200,
  "status": true,
  "message": "Success",
  "data": [
    { "name": "KIP", "count": 45 },
    { "name": "PKH", "count": 32 },
    { "name": "BPNT", "count": 28 },
    { "name": "KKS", "count": 15 },
    { "name": "Tidak Ada", "count": 30 }
  ]
}
```

**Card Types:**

- **KIP** (Kartu Indonesia Pintar): Kartu bantuan pendidikan
- **PKH** (Program Keluarga Harapan): Program bantuan sosial bersyarat
- **BPNT** (Bantuan Pangan Non Tunai): Bantuan pangan elektronik
- **KKS** (Kartu Keluarga Sejahtera): Kartu identitas penerima bantuan
- **Tidak Ada**: UMKM yang tidak memiliki kartu bantuan

**Penggunaan:**

```typescript
const { cardTypeData, fetchCardTypeData } = useDashboard()

// Fetch card type data
useEffect(() => {
  fetchCardTypeData()
}, [])

// Display in chart
<Card>
  <CardHeader>
    <CardTitle>Distribusi Jenis Kartu</CardTitle>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart
        data={cardTypeData}
        layout="vertical"
      >
        <XAxis type="number" dataKey="count" />
        <YAxis type="category" dataKey="name" />
        <Bar dataKey="count" fill="var(--color-sky-500)" />
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
```

**Chart Configuration:**

```typescript
const chartConfig = {
  count: {
    label: "Count",
    color: "var(--color-sky-500)",
  },
} satisfies ChartConfig;

const COLORS = [
  "#0284c7", // sky-600
  "#0ea5e9", // sky-500
  "#38bdf8", // sky-400
  "#7dd3fc", // sky-300
];
```

**Use Cases:**

- **Demographic Analysis**: Analisis demografi pengguna berdasarkan kepemilikan kartu
- **Targeting**: Membantu targeting program untuk kelompok tertentu
- **Policy Planning**: Data untuk perencanaan kebijakan bantuan
- **Reporting**: Data untuk laporan distribusi bantuan

**Dashboard Display (DashboardPage.tsx):**

```typescript
<Card>
  <CardHeader>
    <CardTitle>Distribusi Jenis Kartu</CardTitle>
    <CardDescription>
      Perbandingan jumlah pengguna berdasarkan jenis kartu yang dimiliki
    </CardDescription>
  </CardHeader>
  <CardContent>
    {cardTypeData.length > 0 ? (
      <ChartContainer config={chartConfig}>
        <BarChart
          data={cardTypeData}
          layout="vertical"
        >
          <XAxis type="number" dataKey="count" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={100}
            fontSize={14}
          />
          <Bar
            dataKey="count"
            fill="var(--color-sky-500)"
            radius={10}
          >
            {cardTypeData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    ) : (
      <div className="text-center text-muted-foreground">
        No data available
      </div>
    )}
  </CardContent>
</Card>
```

### f. Settings Services

#### Update SLA

**File:** `src/contexts/SettingsContext.tsx`

**Deskripsi:**
Service untuk mengatur dan memperbarui Service Level Agreement (SLA) untuk proses persetujuan aplikasi.

**Implementasi:**

##### 1. Get Screening SLA

```typescript
const getScreeningSLA = async () => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<SLAConfig>("/sla/screening", token, {
      method: "GET",
    });

    setScreeningSLA(response.data);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch screening SLA";
    setError(errorMessage);
    console.error("Get screening SLA error:", err);
  } finally {
    setIsLoading(false);
  }
};
```

##### 2. Get Final SLA

```typescript
const getFinalSLA = async () => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<SLAConfig>("/sla/final", token, {
      method: "GET",
    });

    setFinalSLA(response.data);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch final SLA";
    setError(errorMessage);
    console.error("Get final SLA error:", err);
  } finally {
    setIsLoading(false);
  }
};
```

##### 3. Update Screening SLA

```typescript
const updateScreeningSLA = async (
  data: SLAConfig
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<SLAConfig>("/sla/screening", token, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    setScreeningSLA(response.data);

    return {
      success: true,
      message: response.message || "Screening SLA updated successfully",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update screening SLA";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

##### 4. Update Final SLA

```typescript
const updateFinalSLA = async (
  data: SLAConfig
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<SLAConfig>("/sla/final", token, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    setFinalSLA(response.data);

    return {
      success: true,
      message: response.message || "Final SLA updated successfully",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update final SLA";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

**Fitur:**

- **Two-Stage SLA**: SLA terpisah untuk screening dan final approval
- **Flexible Configuration**: Admin dapat mengatur batas waktu sesuai kebutuhan
- **Deadline Calculation**: SLA digunakan untuk calculate deadline aplikasi
- **Warning System**: Menampilkan warning saat mendekati deadline
- **Performance Monitoring**: Tracking keterlambatan approval

**Data Structure:**

```typescript
interface SLAConfig {
  max_days: number; // Maximum days allowed for approval
  description: string; // Description of the SLA
}
```

**Endpoints:**

```
GET /sla/screening    // Get screening SLA config
GET /sla/final        // Get final SLA config
PUT /sla/screening    // Update screening SLA
PUT /sla/final        // Update final SLA
```

**Request/Response Format:**

```typescript
// Request
{
  max_days: 7,
  description: "Screening SLA"
}

// Response
{
  statusCode: 200,
  status: true,
  message: "SLA updated successfully",
  data: {
    max_days: 7,
    description: "Screening SLA"
  }
}
```

**SLA Application:**

When an application is submitted:

```typescript
// Calculate deadline based on SLA
const screeningDeadline = new Date();
screeningDeadline.setDate(screeningDeadline.getDate() + screeningSLA.max_days);

const finalDeadline = new Date();
finalDeadline.setDate(
  finalDeadline.getDate() + (screeningSLA.max_days + finalSLA.max_days)
);
```

**Warning Badges:**

```typescript
const getSLABadge = (deadline: string) => {
  const now = new Date()
  const slaDate = new Date(deadline)
  const hoursLeft = Math.max(
    0,
    (slaDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  )

  if (hoursLeft < 0) return <Badge variant="destructive">Terlambat</Badge>
  if (hoursLeft < 24) return <Badge variant="destructive">{Math.floor(hoursLeft)}h tersisa</Badge>
  if (hoursLeft < 72) return <Badge variant="warning">{Math.floor(hoursLeft)}h tersisa</Badge>
  return <Badge variant="outline">{Math.floor(hoursLeft / 24)}d tersisa</Badge>
}
```

**Penggunaan:**

```typescript
const {
  screeningSLA,
  finalSLA,
  getScreeningSLA,
  getFinalSLA,
  updateScreeningSLA,
  updateFinalSLA,
} = useSettings();

// Load SLA on mount
useEffect(() => {
  getScreeningSLA();
  getFinalSLA();
}, []);

// Update screening SLA
const handleUpdateScreeningSLA = async () => {
  if (screeningSLADays <= 0) {
    showWarningToast("Jumlah hari harus lebih dari 0");
    return;
  }

  showConfirmAlert({
    message: `Ubah SLA Screening menjadi ${screeningSLADays}?`,
    onConfirm: async () => {
      const result = await updateScreeningSLA({
        max_days: screeningSLADays,
        description: "Screening SLA",
      });

      if (result.success) {
        showSuccessToast("SLA Screening berhasil diperbarui!");
      }
    },
  });
};
```

**UI Component (SettingsPage.tsx):**

```typescript
<Card>
  <CardHeader>
    <CardTitle>Konfigurasi SLA</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <Label>Screening (hari)</Label>
        <Input
          type="number"
          value={screeningSLADays}
          onChange={(e) => setScreeningSLADays(parseInt(e.target.value))}
        />
      </div>
      <Button
        onClick={handleUpdateScreeningSLA}
        disabled={slaLoading}
      >
        Simpan
      </Button>
    </div>

    <div className="flex items-center gap-2">
      <div className="flex-1">
        <Label>Final (hari)</Label>
        <Input
          type="number"
          value={finalSLADays}
          onChange={(e) => setFinalSLADays(parseInt(e.target.value))}
        />
      </div>
      <Button
        onClick={handleUpdateFinalSLA}
        disabled={slaLoading}
      >
        Simpan
      </Button>
    </div>
  </CardContent>
</Card>
```

**Permission Required:**

```typescript
Permissions.SLA_CONFIGURATION;
```

#### Export Reports

**File:** `src/contexts/SettingsContext.tsx`

**Deskripsi:**
Service untuk mengekspor laporan aplikasi dan program dalam format PDF atau Excel.

**Implementasi:**

##### 1. Export Applications

```typescript
const exportApplications = async (
  params: ExportDataParams
): Promise<{ success: boolean; message?: string; data?: Blob }> => {
  try {
    setIsLoading(true);
    setError(null);

    const blob = await apiCallFile("/sla/export-applications", token, {
      method: "POST",
      body: JSON.stringify(params),
    });

    return {
      success: true,
      message: "Applications exported successfully",
      data: blob,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to export applications";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

##### 2. Export Programs

```typescript
const exportPrograms = async (
  params: ExportDataParams
): Promise<{ success: boolean; message?: string; data?: Blob }> => {
  try {
    setIsLoading(true);
    setError(null);

    const blob = await apiCallFile("/sla/export-programs", token, {
      method: "POST",
      body: JSON.stringify(params),
    });

    return {
      success: true,
      message: "Programs exported successfully",
      data: blob,
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to export programs";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

**Fitur:**

- **Multiple Formats**: Support PDF dan Excel export
- **Filtered Export**: Export berdasarkan tipe aplikasi/program
- **Blob Handling**: Menangani binary data untuk file download
- **Auto Download**: Otomatis trigger download di browser
- **Filename Generation**: Generate filename dengan timestamp

**Data Structure:**

```typescript
interface ExportDataParams {
  file_type: "pdf" | "excel";
  application_type: "all" | "training" | "certification" | "funding";
}
```

**Endpoints:**

```
POST /sla/export-applications
POST /sla/export-programs
```

**Request Format:**

```json
{
  "file_type": "pdf",
  "application_type": "all"
}
```

**File Download Handler:**

```typescript
const handleExportApplications = async () => {
  setExportLoading(true);

  try {
    const result = await exportApplications({
      file_type: applicationsFileType,
      application_type: applicationsType,
    });

    if (result.success && result.data) {
      // Determine file extension
      const fileExt = applicationsFileType === "pdf" ? "pdf" : "xlsx";

      // Create download link
      const url = window.URL.createObjectURL(result.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `applications-${applicationsType}-${new Date().toISOString()}.${fileExt}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccessToast(
        `Laporan pengajuan berhasil diunduh (${applicationsFileType.toUpperCase()})!`
      );
    } else {
      showErrorToast(result.message || "Gagal mengekspor laporan pengajuan");
    }
  } catch (error) {
    showErrorToast("Terjadi kesalahan saat mengekspor laporan");
  } finally {
    setExportLoading(false);
  }
};
```

**Penggunaan:**

```typescript
const { exportApplications, exportPrograms } = useSettings();

// Export applications
const handleExportApplications = async () => {
  const result = await exportApplications({
    file_type: "pdf",
    application_type: "training",
  });

  if (result.success && result.data) {
    // Download file
    downloadBlob(result.data, "applications-training.pdf");
  }
};

// Export programs
const handleExportPrograms = async () => {
  const result = await exportPrograms({
    file_type: "excel",
    application_type: "all",
  });

  if (result.success && result.data) {
    // Download file
    downloadBlob(result.data, "programs-all.xlsx");
  }
};
```

**UI Component (SettingsPage.tsx):**

```typescript
<Card>
  <CardHeader>
    <CardTitle>Cetak Laporan Pengajuan</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid gap-4 md:grid-cols-3">
      {/* Type Selection */}
      <select
        value={applicationsType}
        onChange={(e) => setApplicationsType(e.target.value)}
      >
        <option value="all">Semua Tipe</option>
        <option value="funding">Pendanaan</option>
        <option value="training">Pelatihan</option>
        <option value="certification">Sertifikasi</option>
      </select>

      {/* Format Selection */}
      <select
        value={applicationsFileType}
        onChange={(e) => setApplicationsFileType(e.target.value)}
      >
        <option value="pdf">PDF</option>
        <option value="excel">Excel</option>
      </select>

      {/* Export Button */}
      <Button
        onClick={handleExportApplications}
        disabled={exportLoading}
      >
        {exportLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Mengekspor...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 mr-2" />
            Cetak Laporan
          </>
        )}
      </Button>
    </div>
  </CardContent>
</Card>
```

**Report Contents:**

Applications Report:

- Application ID
- Applicant Name
- Business Name
- Type (Training/Certification/Funding)
- Status
- Submission Date
- Deadline
- Processing Time
- Assigned Admin

Programs Report:

- Program ID
- Title
- Type
- Provider
- Status (Active/Inactive)
- Application Deadline
- Number of Applicants
- Created By
- Created Date

**Permission Required:**

```typescript
Permissions.GENERATE_REPORT;
```

### g. User Management Services

#### CRUD Operations

**File:** `src/contexts/UserContext.tsx`

**Deskripsi:**
Service untuk mengelola operasi CRUD (Create, Read, Update, Delete) pada data pengguna admin.

**Implementasi:**

##### 1. Get All Users

```typescript
const getAllUsers = async () => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<User[]>("/users", token, {
      method: "GET",
    });

    setUsers(response.data);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch users";
    setError(errorMessage);
    console.error("Get all users error:", err);
  } finally {
    setIsLoading(false);
  }
};
```

##### 2. Get User by ID

```typescript
const getUserById = async (id: number) => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<User>(`/users/${id}`, token, {
      method: "GET",
    });

    setCurrentUser(response.data);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch user";
    setError(errorMessage);
    console.error("Get user by ID error:", err);
  } finally {
    setIsLoading(false);
  }
};
```

##### 3. Create User

```typescript
const createUser = async (
  data: CreateUserData
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (data.password !== data.confirm_password) {
      throw new Error("Passwords do not match");
    }

    const response = await apiCall<User>("/webauth/register", token, {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Refresh users list
    await getAllUsers();

    return {
      success: true,
      message: response.message || "User created successfully",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to create user";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

##### 4. Update User

```typescript
const updateUser = async (
  id: number,
  data: UpdateUserData
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (data.password !== data.confirm_password) {
      throw new Error("Passwords do not match");
    }

    const response = await apiCall<User>(`/users/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    // Refresh users list
    await getAllUsers();

    return {
      success: true,
      message: response.message || "User updated successfully",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update user";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

##### 5. Delete User

```typescript
const deleteUser = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<User>(`/users/${id}`, token, {
      method: "DELETE",
    });

    // Remove from local state
    setUsers((prev) => prev.filter((u) => u.id !== id));

    return {
      success: true,
      message: response.message || "User deleted successfully",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to delete user";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

**Fitur:**

- **Complete CRUD**: Full create, read, update, delete operations
- **Password Validation**: Validasi password dan confirm password
- **Auto Refresh**: Refresh list setelah create/update/delete
- **Optimistic Updates**: Update local state untuk delete operation
- **Error Handling**: Comprehensive error handling untuk setiap operation

**Data Structures:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role_name: string;
  last_login_at: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  role_id: number;
}

interface UpdateUserData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  role_id: number;
}
```

**Endpoints:**

```
GET    /users           // Get all users
GET    /users/:id       // Get user by ID
POST   /webauth/register // Create user
PUT    /users/:id       // Update user
DELETE /users/:id       // Delete user
```

**Validations:**

```typescript
// Name validation
if (!formData.name.trim()) {
  showWarningToast("Nama lengkap tidak boleh kosong");
  return;
}

// Email validation
if (!formData.email.trim()) {
  showWarningToast("Email tidak boleh kosong");
  return;
}

// Password match validation
if (formData.password !== formData.confirm_password) {
  showWarningToast("Password dan konfirmasi password tidak cocok");
  return;
}

// Password length validation
if (formData.password.length < 8) {
  showWarningToast("Password minimal 8 karakter");
  return;
}
```

**Penggunaan:**

```typescript
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  users,
  currentUser,
} = useUsersManagement();

// Get all users
useEffect(() => {
  getAllUsers();
}, []);

// Create new user
const handleCreate = async () => {
  const result = await createUser({
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    confirm_password: "password123",
    role_id: 2,
  });

  if (result.success) {
    showSuccessToast("Admin berhasil ditambahkan!");
    navigate("/admin/list");
  }
};

// Update user
const handleUpdate = async () => {
  const result = await updateUser(userId, {
    name: "John Doe Updated",
    email: "john.updated@example.com",
    password: "",
    confirm_password: "",
    role_id: 2,
  });

  if (result.success) {
    showSuccessToast("Data admin berhasil diperbarui!");
  }
};

// Delete user with confirmation
const handleDelete = async (userId: number, userName: string) => {
  showConfirmAlert({
    message: `Apakah Anda yakin ingin menghapus admin "${userName}"?`,
    onConfirm: async () => {
      const result = await deleteUser(userId);
      if (result.success) {
        showSuccessToast("Admin berhasil dihapus");
      }
    },
  });
};
```

**Permission Required:**

```typescript
Permissions.USER_MANAGEMENT;
```

**Related Components:**

- `AddAdminPage.tsx` - Create new admin
- `EditAdminPage.tsx` - Edit existing admin
- `AdminListPage.tsx` - List all admins

#### Role Permissions

**File:** `src/contexts/UserContext.tsx`

**Deskripsi:**
Service untuk mengelola permissions yang dimiliki oleh setiap role dalam sistem.

**Implementasi:**

##### 1. Get List Permissions

```typescript
const getListPermissions = async () => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<Permission[]>("/permissions", token, {
      method: "GET",
    });

    setPermissions(response.data);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch permissions";
    setError(errorMessage);
    console.error("Get permissions error:", err);
  } finally {
    setIsLoading(false);
  }
};
```

##### 2. Get List Role Permissions

```typescript
const getListRolePermissions = async () => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<RolePermission[]>(
      "/role-permissions",
      token,
      {
        method: "GET",
      }
    );

    setRolePermissions(response.data);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch role permissions";
    setError(errorMessage);
    console.error("Get role permissions error:", err);
  } finally {
    setIsLoading(false);
  }
};
```

##### 3. Update Role Permissions

```typescript
const updateRolePermissions = async (
  data: UpdateRolePermissionsData
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);

    const response = await apiCall<void>("/role-permissions", token, {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Refresh role permissions list
    await getListRolePermissions();

    return {
      success: true,
      message: response.message || "Role permissions updated successfully",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update role permissions";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
  }
};
```

**Fitur:**

- **Permission Management**: Mengelola hak akses untuk setiap role
- **Granular Control**: Control akses di level permission
- **Role-Based**: Permissions dikelompokkan berdasarkan role
- **Dynamic**: Admin dapat mengubah permissions tanpa code change
- **Audit Trail**: Track perubahan permissions

**Data Structures:**

```typescript
interface Permission {
  id: number;
  name: string;
  code: string;
  description: string;
}

interface RolePermission {
  role_id: number;
  role_name: string;
  permissions: string[]; // Array of permission codes
}

interface UpdateRolePermissionsData {
  role_id: number;
  permissions: string[]; // Array of permission codes
}
```

**Endpoints:**

```
GET  /permissions           // Get all available permissions
GET  /role-permissions      // Get role-permission mappings
POST /role-permissions      // Update role permissions
```

**Available Permissions:**

```typescript
export const Permissions = {
  // Training
  SCREENING_TRAINING: "SCREENING_TRAINING",
  MANAGE_TRAINING_PROGRAMS: "MANAGE_TRAINING_PROGRAMS",
  FINAL_TRAINING: "FINAL_TRAINING",
  VIEW_TRAINING: "VIEW_TRAINING",

  // Certification
  SCREENING_CERTIFICATION: "SCREENING_CERTIFICATION",
  MANAGE_CERTIFICATION_PROGRAMS: "MANAGE_CERTIFICATION_PROGRAMS",
  FINAL_CERTIFICATION: "FINAL_CERTIFICATION",
  VIEW_CERTIFICATION: "VIEW_CERTIFICATION",

  // Funding
  SCREENING_FUNDING: "SCREENING_FUNDING",
  MANAGE_FUNDING_PROGRAMS: "MANAGE_FUNDING_PROGRAMS",
  FINAL_FUNDING: "FINAL_FUNDING",
  VIEW_FUNDING: "VIEW_FUNDING",

  // User Management
  USER_MANAGEMENT: "USER_MANAGEMENT",
  ROLE_PERMISSIONS_MANAGEMENT: "ROLE_PERMISSIONS_MANAGEMENT",

  // Reporting
  GENERATE_REPORT: "GENERATE_REPORT",
  SLA_CONFIGURATION: "SLA_CONFIGURATION",

  // News
  MANAGE_NEWS: "MANAGE_NEWS",
  CREATE_NEWS: "CREATE_NEWS",
  EDIT_NEWS: "EDIT_NEWS",
  DELETE_NEWS: "DELETE_NEWS",
  VIEW_NEWS: "VIEW_NEWS",
};
```

**Response Examples:**

Permissions List:

```json
{
  "statusCode": 200,
  "status": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Screening Training",
      "code": "SCREENING_TRAINING",
      "description": "Approve/reject training applications at screening stage"
    }
    // ... more permissions
  ]
}
```

Role Permissions:

```json
{
  "statusCode": 200,
  "status": true,
  "message": "Success",
  "data": [
    {
      "role_id": 2,
      "role_name": "admin_screening",
      "permissions": [
        "SCREENING_TRAINING",
        "SCREENING_CERTIFICATION",
        "SCREENING_FUNDING",
        "VIEW_TRAINING",
        "VIEW_CERTIFICATION",
        "VIEW_FUNDING"
      ]
    },
    {
      "role_id": 3,
      "role_name": "admin_vendor",
      "permissions": [
        "FINAL_TRAINING",
        "FINAL_CERTIFICATION",
        "FINAL_FUNDING",
        "MANAGE_TRAINING_PROGRAMS",
        "MANAGE_CERTIFICATION_PROGRAMS",
        "MANAGE_FUNDING_PROGRAMS"
      ]
    }
  ]
}
```

**Penggunaan:**

```typescript
const {
  permissions,
  rolePermissions,
  getListPermissions,
  getListRolePermissions,
  updateRolePermissions,
} = useUsersManagement();

// Load permissions on mount
useEffect(() => {
  getListPermissions();
  getListRolePermissions();
}, []);

// Select role
const handleRoleChange = (roleId: number) => {
  setSelectedRole(roleId);
  const perms = rolePermissions.find((r) => r.role_id === roleId)?.permissions;
  setSelectedPermissions(perms || []);
};

// Toggle permission
const handlePermissionChange = (permissionCode: string, checked: boolean) => {
  if (checked) {
    setSelectedPermissions([...selectedPermissions, permissionCode]);
  } else {
    setSelectedPermissions(
      selectedPermissions.filter((p) => p !== permissionCode)
    );
  }
};

// Save permissions
const handleSave = async () => {
  const result = await updateRolePermissions({
    role_id: selectedRole,
    permissions: selectedPermissions,
  });

  if (result.success) {
    showSuccessToast("Hak akses berhasil diperbarui!");
  }
};
```

**UI Component (AdminPermissionsPage.tsx):**

```typescript
<Card>
  <CardHeader>
    <CardTitle>Hak Akses untuk {selectedRoleName}</CardTitle>
  </CardHeader>
  <CardContent>
    {permissions.map((permission) => (
      <div key={permission.code} className="flex items-start space-x-3 p-3 border rounded-lg">
        <Checkbox
          id={permission.code}
          checked={selectedPermissions.includes(permission.code)}
          onCheckedChange={(checked) =>
            handlePermissionChange(permission.code, checked as boolean)
          }
        />
        <div className="flex-1">
          <label htmlFor={permission.code} className="text-sm font-medium">
            {permission.name}
          </label>
          <p className="text-xs text-muted-foreground">
            {permission.description}
          </p>
        </div>
        <Badge variant={selectedPermissions.includes(permission.code) ? "success" : "secondary"}>
          {selectedPermissions.includes(permission.code) ? "Aktif" : "Tidak Aktif"}
        </Badge>
      </div>
    ))}

    <Button onClick={handleSave} className="w-full mt-4">
      <Save className="h-4 w-4 mr-2" />
      Simpan Hak Akses
    </Button>
  </CardContent>
</Card>
```

**Permission Check in Components:**

```typescript
// Check if user has permission
const { user } = useAuth()

{user?.permissions?.includes(Permissions.SCREENING_TRAINING) && (
  <Button onClick={handleScreeningApprove}>
    Lolos Screening
  </Button>
)}

{user?.permissions?.includes(Permissions.CREATE_NEWS) && (
  <Button onClick={() => navigate('/news/create')}>
    <Plus className="h-4 w-4 mr-2" />
    Buat Berita
  </Button>
)}
```

**Permission Required:**

```typescript
Permissions.ROLE_PERMISSIONS_MANAGEMENT;
```

### h. News Services

#### CRUD Operations

**File:** `src/contexts/NewsContext.tsx`

**Deskripsi:**
Service untuk mengelola operasi CRUD pada berita/artikel yang ditampilkan di aplikasi mobile.

**Implementasi:**

##### 1. Get All News

```typescript
const getAllNews = async () => {
  try {
    setIsLoading(true);
    setError(null);
    startProgress();

    const response = await apiCall<News[]>("/news/", token, {
      method: "GET",
    });

    setNewsList(response.data);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch news";
    setError(errorMessage);
    console.error("Get all news error:", err);
  } finally {
    setIsLoading(false);
    stopProgress();
  }
};
```

##### 2. Get News by ID

```typescript
const getNewsById = async (id: number) => {
  try {
    setIsLoading(true);
    setError(null);
    startProgress();

    const response = await apiCall<News>(`/news/${id}`, token, {
      method: "GET",
    });

    setCurrentNews(response.data);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to fetch news";
    setError(errorMessage);
    console.error("Get news by ID error:", err);
  } finally {
    setIsLoading(false);
    stopProgress();
  }
};
```

##### 3. Create News

```typescript
const createNews = async (
  data: CreateNewsData
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);
    startProgress();

    const response = await apiCall<News>("/news/", token, {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Refresh news list
    await getAllNews();

    return {
      success: true,
      message: response.message || "Berita berhasil dibuat",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to create news";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
    stopProgress();
  }
};
```

##### 4. Update News

```typescript
const updateNews = async (
  id: number,
  data: CreateNewsData
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);
    startProgress();

    const response = await apiCall<News>(`/news/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    // Refresh news list
    await getAllNews();

    return {
      success: true,
      message: response.message || "Berita berhasil diperbarui",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update news";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
    stopProgress();
  }
};
```

##### 5. Delete News

```typescript
const deleteNews = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);
    startProgress();

    const response = await apiCall<News>(`/news/${id}`, token, {
      method: "DELETE",
    });

    // Remove from local state
    setNewsList((prev) => prev.filter((n) => n.id !== id));

    return {
      success: true,
      message: response.message || "Berita berhasil dihapus",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to delete news";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
    stopProgress();
  }
};
```

**Fitur:**

- **Complete CRUD**: Full create, read, update, delete operations
- **Rich Content**: Support HTML content dengan WYSIWYG editor
- **Image Upload**: Base64 image upload untuk thumbnail
- **Tags Support**: Multiple tags untuk kategorisasi
- **Category System**: Kategorisasi berita (announcement, success_story, event, article)
- **Auto Refresh**: Refresh list setelah create/update/delete

**Data Structures:**

```typescript
interface News {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: NewsCategory;
  is_published: boolean;
  tags: string[];
  created_by?: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

type NewsCategory = "announcement" | "success_story" | "event" | "article";

interface CreateNewsData {
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string; // base64 or URL
  category: NewsCategory;
  is_published: boolean;
  tags: string[];
}
```

**Endpoints:**

```
GET    /news/       // Get all news
GET    /news/:id    // Get news by ID
POST   /news/       // Create news
PUT    /news/:id    // Update news
DELETE /news/:id    // Delete news
```

**Validations:**

```typescript
// Required fields
if (!formData.title || !formData.excerpt || !formData.content) {
  showWarningToast("Mohon lengkapi semua field yang wajib diisi");
  return;
}

// Thumbnail validation
if (!formData.thumbnail) {
  showWarningToast("Mohon upload gambar thumbnail");
  return;
}

// Excerpt length
if (formData.excerpt.length > 200) {
  showWarningToast("Ringkasan maksimal 200 karakter");
  return;
}
```

**HTML Content Editor:**

```typescript
// Insert HTML tags
const insertHtmlTag = (tag: string) => {
  const textarea = contentRef.current;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = formData.content.substring(start, end);

  let insertion = "";
  switch (tag) {
    case "h2":
      insertion = `<h2>${selectedText || "Heading 2"}</h2>`;
      break;
    case "h3":
      insertion = `<h3>${selectedText || "Heading 3"}</h3>`;
      break;
    case "p":
      insertion = `<p>${selectedText || "Paragraf"}</p>`;
      break;
    case "strong":
      insertion = `<strong>${selectedText || "Bold"}</strong>`;
      break;
    case "em":
      insertion = `<em>${selectedText || "Italic"}</em>`;
      break;
    case "ul":
      insertion = `<ul>\n  <li>${selectedText || "Item 1"}</li>\n  <li>Item 2</li>\n</ul>`;
      break;
    // ... more tags
  }

  const newContent =
    formData.content.substring(0, start) +
    insertion +
    formData.content.substring(end);

  handleInputChange("content", newContent);
};
```

**Penggunaan:**

```typescript
const {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  newsList,
  currentNews,
} = useNews();

// Get all news
useEffect(() => {
  getAllNews();
}, []);

// Create news
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const result = await createNews({
    title: "Judul Berita",
    excerpt: "Ringkasan berita...",
    content: "<p>Isi berita lengkap...</p>",
    thumbnail: base64Image,
    category: "announcement",
    is_published: false,
    tags: ["umkm", "bantuan"],
  });

  if (result.success) {
    showSuccessToast("Berita berhasil dibuat!");
    navigate("/news");
  }
};

// Delete with confirmation
const handleDelete = async (newsId: number, newsTitle: string) => {
  showConfirmAlert({
    message: `Apakah Anda yakin ingin menghapus berita "${newsTitle}"?`,
    onConfirm: async () => {
      const result = await deleteNews(newsId);
      if (result.success) {
        showSuccessToast("Berita berhasil dihapus");
      }
    },
  });
};
```

**Permission Required:**

```typescript
Permissions.VIEW_NEWS; // View news list
Permissions.CREATE_NEWS; // Create news
Permissions.EDIT_NEWS; // Edit news
Permissions.DELETE_NEWS; // Delete news
```

**Related Components:**

- `NewsListPage.tsx` - Display news list
- `NewsDetailPage.tsx` - Display news detail
- `NewsFormPage.tsx` - Create/Edit news form

#### Publish/Unpublish

**File:** `src/contexts/NewsContext.tsx`

**Deskripsi:**
Service untuk mengontrol status publikasi berita (draft atau published).

**Implementasi:**

##### 1. Publish News

```typescript
const publishNews = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);
    startProgress();

    const response = await apiCall<News>(`/news/publish/${id}`, token, {
      method: "PUT",
    });

    // Update local state
    setNewsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_published: true } : n))
    );

    return {
      success: true,
      message: response.message || "Berita berhasil dipublikasikan",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to publish news";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
    stopProgress();
  }
};
```

##### 2. Unpublish News

```typescript
const unpublishNews = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    setIsLoading(true);
    setError(null);
    startProgress();

    const response = await apiCall<News>(`/news/unpublish/${id}`, token, {
      method: "PUT",
    });

    // Update local state
    setNewsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_published: false } : n))
    );

    return {
      success: true,
      message: response.message || "Berita berhasil dibatalkan publikasinya",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to unpublish news";
    setError(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  } finally {
    setIsLoading(false);
    stopProgress();
  }
};
```

**Fitur:**

- **Publication Control**: Control visibility berita di mobile app
- **Draft Mode**: Save sebagai draft sebelum publish
- **Optimistic Update**: Update local state untuk fast UI
- **Toggle Functionality**: Easy toggle antara published dan draft
- **Confirmation Dialog**: Konfirmasi sebelum publish/unpublish

**Endpoints:**

```
PUT /news/publish/:id     // Publish news
PUT /news/unpublish/:id   // Unpublish news
```

**Use Cases:**

- **Review Process**: Admin bisa review sebelum publish
- **Scheduled Publishing**: Save as draft, publish later
- **Emergency Unpublish**: Unpublish jika ada kesalahan
- **Content Updates**: Unpublish untuk update, re-publish setelah selesai

**Penggunaan:**

```typescript
const { publishNews, unpublishNews } = useNews();

const handleTogglePublish = (checked: boolean) => {
  const action = checked ? "mempublikasikan" : "membatalkan publikasi";

  showConfirmAlert({
    message: `Apakah Anda yakin ingin ${action} berita ini?`,
    confirmText: `Ya, ${checked ? "Publikasikan" : "Batalkan"}`,
    cancelText: "Batal",
    onConfirm: async () => {
      setActionLoading(true);

      const result = checked
        ? await publishNews(newsId)
        : await unpublishNews(newsId);

      if (result.success) {
        setIsPublished(checked);
        showSuccessToast(
          `Berita berhasil ${checked ? "dipublikasikan" : "dibatalkan publikasinya"}`
        );
      } else {
        showErrorToast(result.message);
      }

      setActionLoading(false);
    },
  });
};
```

**UI Component (NewsDetailPage.tsx):**

```typescript
<Card>
  <CardHeader>
    <CardTitle>Status Publikasi</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex items-center justify-between">
      <Label htmlFor="publish-toggle">Publikasikan</Label>
      <Switch
        id="publish-toggle"
        checked={isPublished}
        onCheckedChange={handleTogglePublish}
        disabled={actionLoading}
      />
    </div>
    <p className="text-sm text-muted-foreground">
      {isPublished
        ? 'Berita ini sudah dipublikasikan dan dapat dilihat oleh publik.'
        : 'Berita ini masih dalam status draft dan belum dipublikasikan.'}
    </p>
  </CardContent>
</Card>
```

**Status Badge:**

```typescript
<Badge variant={news.is_published ? 'default' : 'secondary'}>
  {news.is_published ? 'Dipublikasikan' : 'Draft'}
</Badge>
```

**Filter by Status:**

```typescript
const filteredNews = newsList.filter((news) => {
  const matchesStatus =
    statusFilter === "all" ||
    (statusFilter === "published" && news.is_published) ||
    (statusFilter === "draft" && !news.is_published);
  return matchesStatus;
});
```

**Mobile App Integration:**

- Published news akan tampil di mobile app
- Draft news tidak akan tampil di mobile app
- Real-time update saat publish/unpublish

**Permission Required:**

```typescript
Permissions.EDIT_NEWS; // Required to publish/unpublish
```
