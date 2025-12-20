# 🛒 TechStore Inventory Management System
**Final Project: Sistem Informasi - Pengembangan Web Berbasis React**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MockAPI](https://img.shields.io/badge/MockAPI-orange?style=for-the-badge)](https://mockapi.io/)

---

## 📌 Deskripsi Proyek
Aplikasi ini merupakan sistem manajemen inventaris toko teknologi yang dibangun untuk memenuhi tugas akhir mata kuliah Sistem Informasi [cite: 2025-11-02]. Sistem ini memisahkan antara **Katalog Publik** (untuk pengunjung) dan **Dashboard Admin** (untuk manajemen data) dengan proteksi autentikasi yang terintegrasi dengan MockAPI [cite: 2025-12-13].

## 🔑 Kredensial Akses (Untuk Pengujian Dosen)
Gunakan akun di bawah ini untuk menguji fitur **Admin Login**. Silakan akses halaman login melalui link **"Staff Access"** di bagian footer katalog [cite: 2025-12-20].

| Nama Lengkap | Username | Password | Role |
| :--- | :--- | :--- | :--- |
| **Imam Faqih Masduqi** | `Imam` | `M@mangDadan123` | Lead Project [cite: 2025-09-29] |
| **Ahmad Raka Putra Pratama** | `Raka` | `R@kaGante9` | Admin [cite: 2025-12-10] |
| **Dadan Julianto** | `Dadan` | `Dadan9anteng` | Admin [cite: 2025-12-10] |

---

## 🚀 Fitur Utama
1.  **Public Catalog**: Menampilkan produk secara dinamis dari MockAPI [cite: 2025-12-13].
2.  **Authentication System**: Login admin dengan pengecekan database secara live [cite: 2025-12-13].
3.  **Protected Routes**: Jalur `/admin` tidak dapat diakses tanpa sesi login yang valid [cite: 2025-09-29, 2025-12-20].
4.  **Full CRUD Operations**:
    * **Create**: Menambah produk baru melalui modal [cite: 2025-12-13].
    * **Read**: Menampilkan tabel produk di dashboard admin [cite: 2025-12-13].
    * **Update**: Mengubah data produk yang sudah ada [cite: 2025-12-13].
    * **Delete**: Menghapus produk dengan konfirmasi keamanan [cite: 2025-12-13].
5.  **Responsive UI**: Tampilan optimal di berbagai perangkat menggunakan Tailwind CSS [cite: 2025-11-12].

---

## 🛠️ Tech Stack
* **Frontend**: React.js (Vite) [cite: 2025-11-12].
* **Styling**: Tailwind CSS [cite: 2025-11-12].
* **Routing**: React Router DOM (HashRouter untuk stabilitas GH Pages) [cite: 2025-12-20].
* **Backend & DB**: MockAPI (RESTful API) [cite: 2025-12-13].
* **Hooks**: Custom Hooks (`useProducts`, `useAuth`) untuk pemisahan logika dan tampilan [cite: 2025-09-29].

---

## 📂 Struktur Folder
```text
src/
 ├── components/       # UI Reusable (Layouts, Cards, Modals)
 ├── hooks/            # Logika Bisnis (useProducts.js, useAuth.js)
 ├── pages/            # Halaman Utama (Katalog, Detail, Login)
 ├── App.jsx           # Routing & Central Logic
 └── main.jsx          # Entry Point

 💻 Cara Menjalankan Secara Lokal
Clone repository ini: git clone [URL-REPO] [cite: 2025-12-20].

Masuk ke folder: cd product-store-final.

Install dependensi: npm install [cite: 2025-12-20].

Jalankan server lokal: npm run dev [cite: 2025-12-13].
-----------------------------------------------------------------------------

##👥 Tim Pengembang
Imam Faqih Masduqi - Logic & Security [cite: 2025-09-29].

Ahmad Raka Putra Pratama - Admin Interface & UI [cite: 2025-12-10].

Dadan Julianto - Admin Management & Form Logic [cite: 2025-12-10].
------------------------------------------------------------------------------
Proyek ini dibuat untuk kepentingan akademik tugas akhir Sistem Informasi 2025.