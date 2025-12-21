import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL API Users (MockAPI)
  const AUTH_API = "https://694615d7ed253f51719d04d2.mockapi.io/users";

  // 1. CEK SESI SAAT APLIKASI DIBUKA [cite: 2025-12-20]
  useEffect(() => {
    // REVISI KEAMANAN: Gunakan sessionStorage agar data hilang saat browser di-close [cite: 2025-09-29]
    const savedUser = sessionStorage.getItem("admin_user");
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Gagal parsing user data", e);
        sessionStorage.removeItem("admin_user"); // Bersihkan jika data rusak
      }
    }
    setLoading(false);
  }, []);

  // 2. FUNGSI LOGIN
  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await fetch(AUTH_API);
      if (!response.ok) throw new Error("Gagal mengambil data user");
      
      const users = await response.json();

      // Mencari user yang cocok [cite: 2025-11-02]
      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        // REVISI KEAMANAN: Simpan ke sessionStorage (Bukan localStorage) [cite: 2025-09-29]
        setUser(foundUser);
        sessionStorage.setItem("admin_user", JSON.stringify(foundUser));
        return { success: true };
      } else {
        return { success: false, message: "Username atau Password salah!" };
      }
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: "Terjadi gangguan koneksi server." };
    } finally {
      setLoading(false);
    }
  };

  // 3. FUNGSI LOGOUT
  const logout = () => {
    setUser(null);
    // Hapus sesi sementara
    sessionStorage.removeItem("admin_user");
    
    // Redirect Paksa ke Halaman Utama / Login
    // Menggunakan window.location.href agar state React ter-reset total (Hard Refresh)
    window.location.href = "/"; 
  };

  return { 
    user, 
    login, 
    logout, 
    loading, 
    isAuthenticated: !!user // Mengubah object user menjadi boolean true/false
  };
};