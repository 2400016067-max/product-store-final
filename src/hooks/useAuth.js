import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL API Users (Sesuaikan dengan URL MockAPI kamu)
  const AUTH_API = "https://694615d7ed253f51719d04d2.mockapi.io/users";

  // 1. Cek status login saat aplikasi pertama kali dibuka [cite: 2025-12-20]
  useEffect(() => {
    const savedUser = localStorage.getItem("admin_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // 2. Fungsi Login
  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await fetch(AUTH_API);
      const users = await response.json();

      // Mencari user yang username DAN password-nya cocok [cite: 2025-11-02]
      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        // Simpan ke State dan LocalStorage [cite: 2025-09-29]
        setUser(foundUser);
        localStorage.setItem("admin_user", JSON.stringify(foundUser));
        return { success: true };
      } else {
        return { success: false, message: "Username atau Password salah!" };
      }
    } catch (error) {
      return { success: false, message: "Terjadi gangguan koneksi." };
    } finally {
      setLoading(false);
    }
  };

  // 3. Fungsi Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("admin_user");
    window.location.href = "/product-store-final/#/"; // Tendang balik ke depan [cite: 2025-12-20]
  };

  return { user, login, logout, loading, isAuthenticated: !!user };
};