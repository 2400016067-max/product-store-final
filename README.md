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

# 🎧 ProductStore: Integrated Management & Tracking System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MockAPI](https://img.shields.io/badge/MockAPI-orange?style=for-the-badge)](https://mockapi.io/)

## 📝 Deskripsi Proyek
**ProductStore** adalah platform Sistem Informasi Manajemen (SIM) inventaris dan pelacakan pesanan berbasis web. Proyek ini mensimulasikan ekosistem bisnis nyata yang mengintegrasikan manajemen gudang, kontrol otoritas staf, dan layanan *self-service tracking* bagi pelanggan.

Sistem ini memecahkan masalah sinkronisasi data pada *backend* statis dengan menerapkan mekanisme **Stateful User Interaction** dan **Real-time API Fetching**.

---

## 🛠️ Tech Stack & Arsitektur
* **Core**: React.js (Vite) - *Single Page Application (SPA) architecture.*
* **Styling**: Tailwind CSS & Shadcn UI - *Utility-first CSS for responsive design.*
* **Routing**: React Router DOM (HashRouter) - *Robust navigation with Protected Routes.*
* **State Management**: Context API - *Global state for Authentication & Cart.*
* **Database**: MockAPI (RESTful API Simulation).

---

## 🔐 Matriks Otoritas (Role-Based Access Control)

Kami menerapkan prinsip **Least Privilege**, di mana pengguna hanya memiliki akses ke fungsi yang diperlukan untuk peran mereka.

| Fitur | Admin (Imam) | Staff (Raka) | Viewer (Dadan) |
| :--- | :---: | :---: | :---: |
| Akses Katalog Publik | ✅ | ✅ | ✅ |
| Tambah ke Keranjang | ✅ | ✅ | ✅ |
| Kelola Inventaris (Add/Edit) | ✅ | ✅ | ❌ |
| Hapus Produk (Delete) | ✅ | ❌ | ❌ |
| Manajemen Pesanan (Status/Pesan) | ✅ | ✅ | ❌ |
| Kelola Akun Staf (Otoritas) | ✅ | ❌ | ❌ |
| Lacak Status Pesanan Pribadi | ❌ | ❌ | ✅ |

---

## 🔄 Analisis Aliran Data (Data Flow)

Sistem menggunakan siklus **Manual Entry - Realtime Fetch** untuk menjamin integritas data:

1.  **Transaction Initiation**: Viewer melakukan pemesanan via integrasi WhatsApp (Format otomatis).
2.  **Data Processing**: Admin/Staff menerima notifikasi dan memperbarui log user di `OrderManagement`.
3.  **Persistence Layer**: Menggunakan metode `PUT` ke MockAPI untuk sinkronisasi data permanen.
4.  **Client Update**: Fungsi `refreshUserData` memungkinkan Viewer melihat perubahan status secara *real-time* tanpa perlu *re-login*.

---

## ✨ Fitur Unggulan

### 🛡️ Keamanan Sistem
* **Brute Force Guard**: Mekanisme pembekuan login (30 detik) setelah 3 kali kegagalan autentikasi untuk mencegah serangan kamus.
* **Intelligent Redirect**: Sistem mengingat lokasi terakhir (*location state*) sebelum pengguna diminta login, meningkatkan kenyamanan UX.

### 📦 Efisiensi Operasional
* **Auto-Save Input**: Implementasi *event* `onBlur` pada dashboard admin memastikan data tersimpan ke API tanpa tombol tambahan, mengurangi risiko kehilangan data.
* **WhatsApp Logic**: Integrasi pesan teks dinamis untuk memangkas hambatan komunikasi antara pelanggan dan admin.

### 🎨 User Experience (UX)
* **Interactive Tracking Card**: Visualisasi status pesanan menggunakan komponen balon chat yang intuitif.
* **Advanced Filter**: Algoritma pencarian dan filter kategori yang bekerja secara *asynchronous*.

---

## 📂 Struktur Folder
```text
src/
├── components/
│   ├── admin/           # Dashboard & Management components
│   ├── public/          # Catalog, Tracking, & Common UI
│   └── ProtectedRoute.jsx # Gatekeeper for RBAC
├── contexts/
│   ├── AuthContext.jsx   # Global session & API Sync
│   └── CartContext.jsx   # Shopping cart logic
├── hooks/
│   ├── useProducts.js    # Data fetching logic
│   └── useFilteredProducts.js # Search & Filter algorithms
└── pages/                # Main view compositions
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

