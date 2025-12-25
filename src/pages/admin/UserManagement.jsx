import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { exportToCSV } from "../../utils/exportUtils"; // Pastikan path utility benar
import { 
  UserCog, 
  ShieldCheck, 
  UserCheck, 
  Eye, 
  Loader2, 
  AlertCircle,
  RefreshCw,
  Download // Icon baru untuk export
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function UserManagement() {
  const { user: currentUser } = useAuth(); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); 
  const [error, setError] = useState("");

  const USERS_API = "https://694615d7ed253f51719d04d2.mockapi.io/users";

  // 1. FETCH SEMUA USER
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(USERS_API);
      if (!response.ok) throw new Error("Gagal mengambil data user.");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. FUNGSI EXPORT OTORITAS (Analisis SI) [cite: 2025-11-02]
  const handleExportUsers = () => {
    if (users.length === 0) return alert("Tidak ada data user untuk diunduh!");

    // MAPPING KRITIS: Hanya ambil data profil dan role. PASSWORD DIABAIKAN. [cite: 2025-09-29]
    const reportData = users.map(u => ({
      Nama_Lengkap: u.name || "N/A",
      Username: u.username || "N/A",
      Role: u.role || "viewer",
      ID_Sistem: u.id
    }));

    const headers = ["Nama Lengkap", "Username", "Otoritas/Role", "ID User"];
    
    // Penamaan file yang profesional [cite: 2025-12-25]
    const fileName = `Laporan_Otoritas_User_${new Date().toISOString().split('T')[0]}`;
    
    exportToCSV(reportData, fileName, headers);
  };

  // 3. FUNGSI UPDATE ROLE
  const handleUpdateRole = async (targetUserId, targetUserName, newRole) => {
    if (targetUserId === currentUser.id) {
      alert("Anda tidak bisa mengubah role Anda sendiri demi keamanan sistem.");
      return;
    }

    const confirmMsg = `Ubah jabatan ${targetUserName} menjadi ${newRole.toUpperCase()}?`;
    if (!window.confirm(confirmMsg)) return;

    setActionLoading(targetUserId);
    try {
      const response = await fetch(`${USERS_API}/${targetUserId}`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Gagal memperbarui otoritas.");

      setUsers((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
      );
      alert(`Jabatan ${targetUserName} berhasil diperbarui!`);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p className="text-sm font-medium italic">Memverifikasi Otoritas Pengguna TechStore...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Halaman */}
      <div className="flex justify-between items-end bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic flex items-center gap-2">
            <UserCog className="text-blue-600" /> Manajemen Otoritas
          </h2>
          <p className="text-sm text-slate-500 font-medium">Konfigurasi hak akses tim TechStore (Imam, Raka, Dadan). [cite: 2025-11-02]</p>
        </div>
        
        <div className="flex gap-2">
          {/* Tombol Export User */}
          <Button 
            onClick={handleExportUsers}
            variant="outline"
            size="sm"
            className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-700 font-black hover:bg-emerald-100 uppercase text-[10px]"
          >
            <Download size={14} className="mr-2" /> Export Otoritas
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchUsers}
            className="rounded-xl border-slate-200 text-slate-600 font-black hover:bg-slate-50 uppercase text-[10px]"
          >
            <RefreshCw size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Segarkan
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Tabel Manajemen User */}
      <div className="rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-50 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-black text-[10px] uppercase tracking-wider text-slate-400 p-6">Nama Lengkap</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-wider text-slate-400 p-6">Identitas Sistem</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-wider text-slate-400 text-center p-6">Status Role</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-wider text-slate-400 text-right p-6 px-8">Ubah Otoritas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                <TableCell className="p-6">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md transition-transform group-hover:scale-110 ${u.role === 'admin' ? 'bg-rose-500' : u.role === 'staff' ? 'bg-blue-500' : 'bg-slate-400'}`}>
                      {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 uppercase text-xs tracking-tight">
                        {u.name || "Unknown User"}
                      </p>
                      {u.id === currentUser.id && (
                        <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Sesi Aktif</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="p-6 text-slate-500 font-bold italic text-xs">
                  @{u.username}
                </TableCell>
                <TableCell className="p-6 text-center">
                  <div className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border-b-4 ${
                    u.role === "admin" 
                      ? "bg-rose-50 text-rose-700 border-rose-600" 
                      : u.role === "staff"
                      ? "bg-blue-50 text-blue-700 border-blue-600"
                      : "bg-slate-50 text-slate-700 border-slate-400"
                  }`}>
                    {u.role}
                  </div>
                </TableCell>
                <TableCell className="p-6 text-right px-8">
                  {u.id !== currentUser.id ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading === u.id}
                        className={`rounded-xl text-[10px] font-black h-9 transition-all px-4 ${u.role === 'staff' ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'hover:bg-blue-50 border-slate-200 text-slate-600'}`}
                        onClick={() => handleUpdateRole(u.id, u.name, "staff")}
                      >
                        {actionLoading === u.id ? <Loader2 size={12} className="animate-spin" /> : <UserCheck size={14} className="mr-1.5" />}
                        STAF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading === u.id}
                        className={`rounded-xl text-[10px] font-black h-9 transition-all px-4 ${u.role === 'viewer' ? 'bg-slate-800 text-white border-slate-800 hover:bg-slate-900' : 'hover:bg-slate-100 border-slate-200 text-slate-600'}`}
                        onClick={() => handleUpdateRole(u.id, u.name, "viewer")}
                      >
                        <Eye size={14} className="mr-1.5" /> VIEWER
                      </Button>
                    </div>
                  ) : (
                    <div className="text-[10px] font-black text-slate-300 italic pr-4 flex items-center justify-end gap-2 uppercase tracking-widest">
                      <ShieldCheck size={16} className="text-rose-500" /> Master
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}