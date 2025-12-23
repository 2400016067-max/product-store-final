# 🛒 TechStore Inventory Management System
**Final Project: Sistem Informasi - Pengembangan Web Berbasis React**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MockAPI](https://img.shields.io/badge/MockAPI-orange?style=for-the-badge)](https://mockapi.io/)


---

# 🛒 TechStore Inventory Management System

**Final Project: Sistem Informasi - Pengembangan Web Berbasis React**

---

## 📌 Deskripsi Proyek

Aplikasi ini adalah sistem manajemen inventaris yang mengintegrasikan **Katalog Publik** dan **Dashboard Internal**. Fokus utama pengembangan ini adalah pada implementasi **Role-Based Access Control (RBAC)**, di mana fungsionalitas aplikasi berubah secara dinamis tergantung pada level otoritas pengguna yang login.

## 🔑 Otoritas & Kredensial (Data Uji Dosen)

Sistem ini mendukung tiga level otorisasi. Mohon gunakan akun berikut untuk menguji perbedaan hak akses di Dashboard:

| Nama Pengguna | Username | Password | Role | Deskripsi Hak Akses |
| --- | --- | --- | --- | --- |
| **Imam Faqih M.** | `Imam` | `admin123` | **Admin** | Full Control (Create, Read, Update, Delete) |
| **Asprak** | `asprak` | `asprak` | **Admin** | Full Control untuk keperluan penilaian |
| **Dadan Julianto** | `Dadan` | `mamang` | **Staff** | Operasional (Create, Read, Update) - *No Delete* |
| **Mamang Dadan** | `mamang` | `dadan` | **Staff** | Operasional Standar |
| **Ahmad Raka P.** | `Raka` | `Raka` | **Viewer** | Read-Only (Hanya dapat memantau data) |

> **Analisis Sistem:** Perbedaan role ini dikelola melalui *logic conditional rendering* pada komponen UI dan *protected routes* menggunakan React Router.

---

## 🚀 Fitur Unggulan

1. **Multi-Role Dashboard**: Interface yang beradaptasi secara otomatis (Tombol 'Delete' hanya muncul untuk Admin).
2. **Stateful Authentication**: Manajemen sesi pengguna yang terintegrasi dengan MockAPI.
3. **Real-time Inventory Sync**: Sinkronisasi data produk menggunakan Axios dengan penanganan error yang komprehensif.
4. **Responsive Management**: Form input dengan validasi yang dioptimalkan untuk perangkat mobile maupun desktop.

---

## 🛠️ Tech Stack & Arsitektur

* **Core**: React.js 18+ dengan Vite sebagai *build tool* tercepat saat ini.
* **Routing**: `React Router DOM` dengan implementasi `ProtectedRoute` untuk menjaga keamanan data.
* **Data Fetching**: Axios untuk komunikasi dengan **MockAPI** (Simulasi NoSQL Document DB).
* **Design System**: Tailwind CSS untuk memastikan UI yang modern, bersih, dan profesional.

---

## 📂 Struktur Arsitektur Logika

```text
src/
 ├── hooks/         # Custom Hooks: useAuth (Logika RBAC), useProducts (API handling)
 ├── components/    # Atomic Design: UI Reusable, Navbar, Sidebar
 ├── pages/         # View Layer: Login, Dashboard, Public Catalog
 ├── context/       # AuthContext: Global state untuk menyimpan data user yang login
 └── utils/         # Helper functions untuk formatting data

```

---

## 👥 Tim Pengembang (Kelompok)

* **Imam Faqih Masduqi** - *Logic Architect & Security* (Backend Integration, RBAC Logic).
* **Ahmad Raka Putra Pratama** - *Frontend Engineer* (UI Implementation, Public Catalog).
* **Dadan Julianto** - *System Analyst* (Data Structure, Form Logic & Testing).

---

*Proyek ini merupakan bagian dari pemenuhan Tugas Besar mata kuliah Teknologi Web, Jurusan Sistem Informasi 2025.*

---

