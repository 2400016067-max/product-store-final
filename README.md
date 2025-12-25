# 🛒 TechStore Inventory Management System
**Final Project: Sistem Informasi - Pengembangan Web Berbasis React**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MockAPI](https://img.shields.io/badge/MockAPI-orange?style=for-the-badge)](https://mockapi.io/)


---


Sistem ini adalah sebuah **Hybrid E-Commerce Management & Order Tracking System**. Keunikan sistem ini terletak pada kemampuannya menjembatani keterbatasan *backend* statis (MockAPI) dengan interaksi dinamis antara tiga entitas: Admin, Staff, dan Pelanggan .

**Keunggulan Sistem:**

1. **Modularitas**: Pemisahan komponen seperti `OrderDetailModal` dan `CartModal` memastikan kode mudah dipelihara (Maintainable) .
2. **Keamanan Berlapis**: Adanya fitur *Brute Force Protection* (timer login) dan *Protected Routes* berbasis peran (Role-Based Access Control) .
3. **Aliran Data Tertutup**: Sinkronisasi antara input manual Admin dengan tampilan *real-time* pelanggan menggunakan mekanisme `refreshUserData` .

---


```markdown
# 🎧 ProductStore: Integrated Management & Tracking System

ProductStore adalah platform sistem informasi manajemen inventaris dan layanan pelanggan berbasis web. Proyek ini dirancang untuk mensimulasikan ekosistem bisnis nyata yang melibatkan manajemen gudang, otoritas staf, dan layanan pelacakan pesanan mandiri bagi pelanggan. 

## 🚀 Filosofi Sistem
Aplikasi ini menerapkan prinsip **Separation of Concerns (SoC)** dan **Stateful User Interaction**. Setiap peran pengguna memiliki batas otoritas yang ketat untuk menjaga integritas data perusahaan.

---

## 🛠️ Tech Stack
* **Frontend**: React.js (Vite) 
* **Styling**: Tailwind CSS & Shadcn UI 
* **Routing**: React Router DOM (HashRouter) 
* **Icons**: Lucide React 
* **Database/API**: MockAPI (RESTful API Simulation) 

---

## 🔐 Matriks Otoritas (Access Control)

Sistem ini membagi pengguna ke dalam tiga tingkatan otoritas utama: 

| Fitur | Admin (Imam/Asprak) | Staff (Raka) | Viewer (Dadan) |
| :--- | :---: | :---: | :---: |
| Akses Katalog Publik | ✅ | ✅ | ✅ |
| Tambah ke Keranjang | ✅ | ✅ | ✅ |
| Login / Logout | ✅ | ✅ | ✅ |
| Kelola Inventaris (Add/Edit) | ✅ | ✅ | ❌ |
| Hapus Produk (Delete) | ✅ | ❌ | ❌ |
| Manajemen Pesanan (Status/Pesan) | ✅ | ✅ | ❌ |
| Kelola Akun Staf (Otoritas) | ✅ | ❌ | ❌ |
| Lacak Status Pesanan Pribadi | ❌ | ❌ | ✅ |

---

## 🔄 Aliran Data (Data Flow)

Sistem ini menggunakan mekanisme **Manual Entry - Realtime Fetch** untuk mensimulasikan pengiriman paket: 

1.  **Transaction Initiation**: Viewer melakukan "pemesanan" melalui integrasi WhatsApp di halaman detail produk atau keranjang. 
2.  **Operational Processing**: Admin/Staff melihat log user di `OrderManagement`. Admin mengisi field `orderProduct` (apa yang dibeli) dan `adminMessage` (catatan khusus) secara manual.
3.  **Data Persistence**: Perubahan dikirim ke MockAPI menggunakan metode `PUT` dan disimpan secara permanen. 
4.  **Client Update**: Viewer mengklik tombol "Lacak Pesanan" di Navbar. Fungsi `refreshUserData` akan menarik data terbaru dari MockAPI untuk menampilkan status terkini. 



---

## ✨ Fitur Unggulan

### 🛡️ Keamanan & Integritas
* **Brute Force Guard**: Pembekuan akses login selama 30 detik setelah 3 kali percobaan gagal. 
* **Intelligent Redirect**: Mengingat halaman terakhir yang diakses user sebelum dipaksa login, dan mengembalikannya ke sana setelah login sukses. 

### 📦 Manajemen Operasional
* **Auto-Save Input**: Admin/Staff tidak perlu menekan tombol simpan; data otomatis terkirim saat kursor keluar dari area input (*onBlur*). 
* **Interactive Tracking Card**: Kartu detail pesanan di sisi Viewer menggunakan desain balon chat untuk pesan personal dari Admin. 

### 🛒 Pengalaman Belanja
* **Advanced Filter**: Mesin filter produk berdasarkan kategori dan pencarian nama secara *real-time*. 
* **WhatsApp Integration**: Otomatisasi pesan format teks profesional untuk pemesanan langsung ke Admin. 

---

## 📖 Panduan Penggunaan (User Manual)

### A. Untuk Pelanggan (Viewer)
1.  **Login**: Masuk menggunakan akun (Username: `Dadan`, Pass: `Dadan`). 
2.  **Belanja**: Pilih produk, masukkan ke keranjang, atau klik "Tanya Admin". 
3.  **Tracking**: Setelah berdiskusi dengan admin via WA, cek status pesananmu di tombol **"Lacak Pesanan"** pada Navbar. 
4.  **Refresh**: Jika admin berkata sudah diupdate, tekan tombol **"Refresh"** di dalam kartu pesanan untuk melihat info terbaru. 

### B. Untuk Staf Operasional (Staff)
1.  **Dashboard**: Login (Username: `Raka`), akses **Inventory Dashboard** untuk update stok. 
2.  **Update Pesanan**: Masuk ke menu **Manajemen Pesanan**. Masukkan nama barang yang dipesan pelanggan di kolom yang tersedia dan ubah statusnya. 

### C. Untuk Administrator (Admin)
1.  **Kontrol Penuh**: Login (Username: `Imam`), akses penuh ke semua menu. 
2.  **Otoritas**: Gunakan menu **Kelola Otoritas** untuk menambah atau mengubah role user lain (misal: menaikkan Viewer menjadi Staff). 

---

## 📂 Struktur Direktori Utama
```text
src/
├── components/
│   ├── admin/        # Komponen khusus panel kontrol
│   ├── public/       # Komponen katalog & pelacakan pelanggan
│   └── ProtectedRoute.jsx # Penjaga gerbang akses role
├── contexts/
│   ├── AuthContext.jsx   # Manajemen sesi & sinkronisasi API
│   └── CartContext.jsx   # Logika keranjang belanja
├── hooks/
│   ├── useProducts.js    # Fetching data produk
│   └── useFilteredProducts.js # Algoritma pencarian produk
└── pages/
    ├── admin/        # Halaman Inventory, Users, & Orders
    └── public/       # Halaman Katalog & Detail Produk

```

---

## 👨‍💻 Kontributor

* **Imam Faqih Masduqi (2400016067)** - Lead Developer & System Architect 
* **Ahmad Raka Putra Pratama (2400016089)** - Developer 
* **Dadan Julianto (2400016070)** - Developer 

---

*Proyek ini dibuat untuk memenuhi tugas mata kuliah Teknologi Web - Jurusan Sistem Informasi.* 

```

---

