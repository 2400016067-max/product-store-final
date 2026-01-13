import { createContext, useContext, useState, useEffect, useCallback } from "react";
// Import tambahan untuk manual auth dari firebase/auth
import { 
  auth, 
  googleProvider, 
  signInWithPopup 
} from "../lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const AUTH_API = "https://694615d7ed253f51719d04d2.mockapi.io/users";

  // DEFAULT STRUCTURE: Standarisasi data promo agar tidak crash [cite: 2026-01-10]
  const defaultPromo = { 
    isActive: false, 
    code: "", 
    discount: 0, 
    message: "", 
    validUntil: "" 
  };

  // ============================================================
  // HELPER INTERNAL: Sinkronisasi State & Storage (ANTI-CRASH)
  // ============================================================
  const syncUser = (userData) => {
    if (userData) {
      if (Array.isArray(userData.personalPromo) || !userData.personalPromo) {
        userData.personalPromo = { ...defaultPromo };
      }
      
      setUser(userData);
      sessionStorage.setItem("admin_user", JSON.stringify(userData));
    } else {
      setUser(null);
      sessionStorage.removeItem("admin_user");
    }
  };

  // 1. CEK SESI AWAL (Auto-load saat refresh tab)
  useEffect(() => {
    const checkSession = () => {
      try {
        const savedUser = sessionStorage.getItem("admin_user");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          syncUser(parsedUser); 
        }
      } catch (error) {
        sessionStorage.removeItem("admin_user");
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // 2. MONITORING OTORITAS & AUTO-CLEANUP PROMO (Background Sync)
  useEffect(() => {
    const verifyAuthorityAndPromo = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`${AUTH_API}/${user.id}`);
        if (response.ok) {
          const latestData = await response.json();
          let needsDatabaseUpdate = false;

          if (Array.isArray(latestData.personalPromo) || !latestData.personalPromo) {
            latestData.personalPromo = { ...defaultPromo };
            needsDatabaseUpdate = true;
          }

          let updatedPromo = { ...latestData.personalPromo };
          let updatedBroadcast = latestData.managerBroadcast || ""; // Ambil broadcast saat ini

          // STEP B: Logika Real-time Expiry & Auto-Cleanup [cite: 2026-01-10]
          if (updatedPromo.isActive && updatedPromo.validUntil) {
            const now = new Date();
            const expiryDate = new Date(updatedPromo.validUntil);
            
            if (now > expiryDate) {
              console.warn("🚨 Promo kadaluarsa! Membersihkan sistem...");
              updatedPromo.isActive = false;
              
              // FITUR BARU: Kosongkan pesan siaran otomatis saat promo habis [cite: 2026-01-10]
              updatedBroadcast = ""; 
              
              needsDatabaseUpdate = true;
            }
          }

          const isDataChanged = 
            latestData.role !== user.role || 
            JSON.stringify(latestData.personalPromo) !== JSON.stringify(user.personalPromo) ||
            latestData.referralCode !== user.referralCode ||
            latestData.managerBroadcast !== updatedBroadcast;

          if (needsDatabaseUpdate) {
            const updateRes = await fetch(`${AUTH_API}/${user.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                ...latestData, 
                personalPromo: updatedPromo,
                managerBroadcast: updatedBroadcast // Terapkan penghapusan siaran ke DB
              }),
            });
            const cleanedData = await updateRes.json();
            syncUser(cleanedData); 
          } else if (isDataChanged) {
            syncUser(latestData);
          }
        } else if (response.status === 404) {
          logout();
        }
      } catch (e) {
        console.error("Authority Check Error:", e);
      }
    };

    let authInterval;
    if (user) {
      authInterval = setInterval(verifyAuthorityAndPromo, 40000); 
      verifyAuthorityAndPromo(); 
    }
    return () => clearInterval(authInterval);
  }, [user?.id, user?.role, user?.personalPromo]); 

  // 3. REFRESH DATA MANUAL
  const refreshUserData = useCallback(async () => {
    if (!user?.id) return { success: false };
    try {
      const response = await fetch(`${AUTH_API}/${user.id}`);
      if (response.ok) {
        const latestData = await response.json();
        syncUser(latestData); 
        return { success: true, data: latestData };
      }
    } catch (e) {
      return { success: false };
    }
  }, [user?.id]);

  // 4. FUNGSI REGISTER MANUAL
  const registerManual = async (name, email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const newUser = {
        username: email,
        password: "secured-by-firebase",
        name: name,
        role: "viewer",
        orderStatus: "Belum Ada Pesanan",
        personalNotes: [], 
        adminMessage: "Akun berhasil dibuat secara manual.",
        managerBroadcast: "",
        orderProduct: "",
        orderDate: new Date().toISOString(),
        referralCode: "",
        personalPromo: { ...defaultPromo } 
      };

      const response = await fetch(AUTH_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      const foundUser = await response.json();
      syncUser(foundUser);
      return { success: true };
    } catch (error) {
      return { success: false, message: "Gagal membuat akun." };
    }
  };

  // 5. FUNGSI LOGIN MANUAL
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const response = await fetch(AUTH_API);
      const users = await response.json();
      const foundUser = users.find(u => u.username === email);
      if (foundUser) {
        syncUser(foundUser);
        return { success: true };
      }
      return { success: false, message: "Data profil tidak ditemukan." };
    } catch (error) {
      return { success: false, message: "Login gagal." };
    }
  };

  // 6. FUNGSI LOGIN GOOGLE
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      const response = await fetch(AUTH_API);
      const users = await response.json();
      let foundUser = users.find(u => u.username === googleUser.email);

      if (!foundUser) {
        const newUser = {
          username: googleUser.email,
          password: "google-auth-user",
          name: googleUser.displayName,
          role: "viewer",
          orderStatus: "Belum Ada Pesanan",
          personalNotes: [], 
          adminMessage: "Selamat datang! Akun Anda diverifikasi via Google.",
          managerBroadcast: "",
          orderProduct: "",
          orderDate: new Date().toISOString(),
          referralCode: "",
          personalPromo: { ...defaultPromo }
        };
        const createRes = await fetch(AUTH_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser)
        });
        foundUser = await createRes.json();
      }
      syncUser(foundUser);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  // 7. UPDATE DATA PROFIL
  const updateProfile = async (updates) => {
    if (!user) return { success: false };
    try {
      const response = await fetch(`${AUTH_API}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, ...updates }),
      });
      const updatedData = await response.json();
      syncUser(updatedData);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  // 8. UPDATE DATA PESANAN
  const updateUserOrder = async (userId, updateData) => {
    try {
      const res = await fetch(`${AUTH_API}/${userId}`);
      const targetData = await res.json();
      const response = await fetch(`${AUTH_API}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...targetData, ...updateData, orderDate: new Date().toISOString() }),
      });
      const data = await response.json();
      if (user?.id === userId) syncUser(data);
      return { success: true, data };
    } catch (error) {
      return { success: false };
    }
  };

  // 9. BROADCAST MASSAL
  const broadcastMessage = async (message) => {
    try {
      const res = await fetch(AUTH_API);
      const allUsers = await res.json();
      const updatePromises = allUsers.map(u => 
        fetch(`${AUTH_API}/${u.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...u, managerBroadcast: message })
        })
      );
      await Promise.all(updatePromises);
      await refreshUserData(); 
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  };

  // 10. STICKY NOTES
  const sendStickyNote = async (targetUserId, content, color = "yellow") => {
    try {
      const res = await fetch(`${AUTH_API}/${targetUserId}`);
      const targetData = await res.json();
      const newNote = {
        id: Date.now().toString(),
        content,
        senderName: user?.name || "Manager",
        color,
        createdAt: new Date().toISOString()
      };
      const oldNotes = Array.isArray(targetData.personalNotes) ? targetData.personalNotes : [];
      await fetch(`${AUTH_API}/${targetUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...targetData, personalNotes: [...oldNotes, newNote] })
      });
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  };

  const clearNote = async (noteId) => {
    if (!user) return;
    try {
      const currentNotes = Array.isArray(user.personalNotes) ? user.personalNotes : [];
      const updatedNotes = currentNotes.filter(n => n.id !== noteId);
      const response = await fetch(`${AUTH_API}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, personalNotes: updatedNotes })
      });
      if (response.ok) syncUser({ ...user, personalNotes: updatedNotes });
    } catch (e) { console.error(e); }
  };

  // 11. FITUR: SEND PERSONAL PROMO
  const sendPersonalPromo = async (targetUserId, promoData) => {
    try {
      const res = await fetch(`${AUTH_API}/${targetUserId}`);
      const targetData = await res.json();
      const response = await fetch(`${AUTH_API}/${targetUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...targetData, 
          personalPromo: { ...promoData, isActive: true } 
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (user?.id === targetUserId) syncUser(data);
        return { success: true };
      }
    } catch (e) {
      return { success: false };
    }
  };

  // 12. REDEEM PROMO (HANYA SEKALI PAKAI)
  const redeemPersonalPromo = async () => {
    if (!user?.id || !user?.personalPromo?.isActive) return { success: false };
    try {
      const response = await fetch(`${AUTH_API}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...user, 
          personalPromo: { 
            ...user.personalPromo, 
            isActive: false 
          } 
        }),
      });
      if (response.ok) {
        const updatedData = await response.json();
        syncUser(updatedData); 
        return { success: true };
      }
    } catch (e) {
      return { success: false };
    }
  };

  // 13. DELETE PERSONAL PROMO (MANUAL RESET)
  const deletePersonalPromo = async (targetUserId) => {
    try {
      const res = await fetch(`${AUTH_API}/${targetUserId}`);
      if (!res.ok) throw new Error("User tidak ditemukan");
      const targetData = await res.json();

      const response = await fetch(`${AUTH_API}/${targetUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...targetData, 
          personalPromo: { ...defaultPromo } 
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        if (user?.id === targetUserId) syncUser(updatedData);
        return { success: true };
      }
      return { success: false };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  // 14. LOGOUT
  const logout = () => {
    syncUser(null);
  };

  const value = {
    user, login, registerManual, loginWithGoogle, logout, loading,
    updateUserOrder, updateProfile, refreshUserData, 
    sendStickyNote, clearNote, broadcastMessage,
    sendPersonalPromo,
    redeemPersonalPromo,
    deletePersonalPromo, 
    isAuthenticated: !!user,
    isAdmin: user?.role?.toLowerCase() === "admin",
    isStaff: user?.role?.toLowerCase() === "staff",
    isManager: user?.role?.toLowerCase() === "manager",
    isViewer: user?.role?.toLowerCase() === "viewer"
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};