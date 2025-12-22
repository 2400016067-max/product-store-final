import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  const AUTH_API = "https://694615d7ed253f51719d04d2.mockapi.io/users";

  // 1. Cek Sesi (Mengenali Imam, Raka, atau Dadan saat refresh)
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
        setLoading(false); 
      }
    };
    checkSession();
  }, []);

  // 2. Fungsi Login (Menangkap Otoritas/Role)
  const login = async (username, password) => {
    try {
      const response = await fetch(AUTH_API);
      if (!response.ok) throw new Error("Gagal fetch data");
      
      const users = await response.json();
      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        // --- UPGRADE: Mapping Data secara Eksplisit ---
        // Kita hanya mengambil data yang diperlukan termasuk 'role'
        const userData = { 
          id: foundUser.id, 
          username: foundUser.username, 
          name: foundUser.name,
          role: foundUser.role // "admin", "staff", atau "viewer"
        };

        setUser(userData); 
        sessionStorage.setItem("admin_user", JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, message: "Username atau Password salah!" };
      }
    } catch (error) {
      return { success: false, message: "Masalah koneksi ke server." };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("admin_user");
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    // Helper tambahan: mengecek apakah user punya role tertentu
    isAdmin: user?.role === "admin",
    isStaff: user?.role === "staff",
    isViewer: user?.role === "viewer"
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