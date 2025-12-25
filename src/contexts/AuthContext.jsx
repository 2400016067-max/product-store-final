import { createContext, useContext, useState, useEffect } from "react";
// 1. IMPORT FIREBASE SDK [cite: 2025-12-13]
import { auth, googleProvider, signInWithPopup } from "../lib/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const AUTH_API = "https://694615d7ed253f51719d04d2.mockapi.io/users";

  // 1. CEK SESI (Mengenali User saat refresh tab)
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

  // 2. FUNGSI LOGIN GOOGLE (Pendaftaran Otomatis) [cite: 2025-09-29, 2025-11-02]
  const loginWithGoogle = async () => {
    try {
      // Trigger Popup Google [cite: 2025-12-13]
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      // Cek apakah email ini sudah ada di MockAPI
      const response = await fetch(AUTH_API);
      const users = await response.json();
      
      // Kita gunakan email Google sebagai 'username' unik [cite: 2025-09-29]
      let foundUser = users.find(u => u.username === googleUser.email);

      // JIKA USER BARU: Daftarkan otomatis ke MockAPI [cite: 2025-09-29, 2025-11-02]
      if (!foundUser) {
        const newUser = {
          username: googleUser.email,
          password: "google-auth-user", // Password dummy
          name: googleUser.displayName,
          role: "viewer", // Otomatis menjadi viewer [cite: 2025-11-02]
          orderStatus: "Belum Ada Pesanan",
          adminMessage: "Selamat datang! Akun Anda diverifikasi via Google.",
          orderProduct: "",
          orderDate: new Date().toISOString()
        };

        const createRes = await fetch(AUTH_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser)
        });
        foundUser = await createRes.json();
      }

      // Finalisasi State & Session [cite: 2025-12-13]
      setUser(foundUser);
      sessionStorage.setItem("admin_user", JSON.stringify(foundUser));
      return { success: true };
    } catch (error) {
      console.error("Google Login Error:", error);
      return { success: false, message: "Gagal masuk dengan Google." };
    }
  };

  // 3. FUNGSI LOGIN MANUAL (Username/Password) [cite: 2025-09-29]
  const login = async (username, password) => {
    try {
      const response = await fetch(AUTH_API);
      if (!response.ok) throw new Error("Gagal fetch data");
      
      const users = await response.json();
      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        const userData = { 
          ...foundUser,
          role: foundUser.role.toLowerCase() // Normalisasi Role [cite: 2025-09-29]
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

  // 4. UPDATE ORDER (ADMIN & STAFF) [cite: 2025-11-02]
  const updateUserOrder = async (userId, updateData) => {
    try {
      const response = await fetch(`${AUTH_API}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...updateData,
          orderDate: new Date().toISOString() 
        }),
      });

      if (!response.ok) throw new Error("Gagal update di server");
      
      const updatedData = await response.json();

      if (user?.id === userId) {
        const newLocalData = { ...user, ...updatedData };
        setUser(newLocalData);
        sessionStorage.setItem("admin_user", JSON.stringify(newLocalData));
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // 5. REFRESH DATA USER (VIEWER) [cite: 2025-09-29]
  const refreshUserData = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${AUTH_API}/${user.id}`);
      if (response.ok) {
        const latestData = await response.json();
        const updatedUser = { ...user, ...latestData };
        setUser(updatedUser);
        sessionStorage.setItem("admin_user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Gagal refresh data:", error);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("admin_user");
  };

  const value = {
    user,
    login,
    loginWithGoogle, // EKSPOS FUNGSI GOOGLE [cite: 2025-09-29]
    logout,
    loading,
    updateUserOrder, 
    refreshUserData, 
    isAuthenticated: !!user,
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