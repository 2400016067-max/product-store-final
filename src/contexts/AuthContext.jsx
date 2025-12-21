import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // loading ini HANYA untuk cek sesi awal (Splash Screen di App.jsx)
  const [loading, setLoading] = useState(true); 

  const AUTH_API = "https://694615d7ed253f51719d04d2.mockapi.io/users";

  // 1. Cek Sesi (Hanya jalan sekali saat Web dibuka/refresh)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedUser = sessionStorage.getItem("admin_user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Session Error:", error);
        sessionStorage.removeItem("admin_user");
      } finally {
        // Setelah ini selesai, App.jsx akan berhenti menampilkan Splash Screen
        setLoading(false); 
      }
    };
    
    checkSession();
  }, []);

  // 2. Fungsi Login (LOADING GLOBAL DIHAPUS DARI SINI)
  const login = async (username, password) => {
    try {
      // PENTING: Jangan panggil setLoading(true) di sini!
      // Agar App.jsx tidak menampilkan Splash Screen di tengah proses login.
      
      const response = await fetch(AUTH_API);
      if (!response.ok) throw new Error("Gagal fetch data");
      
      const users = await response.json();
      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        setUser(foundUser); 
        sessionStorage.setItem("admin_user", JSON.stringify(foundUser));
        return { success: true };
      } else {
        return { success: false, message: "Username/Password salah!" };
      }
    } catch (error) {
      return { success: false, message: "Server Error: Koneksi gagal" };
    }
    // PENTING: Jangan panggil setLoading(false) di sini!
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("admin_user");
  };

  const value = {
    user,
    login,
    logout,
    loading, // Ini tetap ada untuk kebutuhan Splash Screen di App.jsx
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return context;
};