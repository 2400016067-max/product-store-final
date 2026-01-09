import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { exportToCSV } from "../../utils/exportUtils";
import { 
  UserCog, 
  ShieldCheck, 
  ShieldAlert, // Icon untuk Manager/Admin lain
  UserCheck, 
  Eye, 
  Loader2, 
  AlertCircle,
  RefreshCw,
  Download 
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

  // LOGIKA AUDIT OTORITAS (Hirarki Sistem) [cite: 2025-09-29]
  const canManage = (targetUser) => {
    // 1. Manager bersifat untouchable (Kasta tertinggi)
    if (targetUser.role?.toLowerCase() === "manager") return false;
    
    // 2. Admin tidak boleh mengganggu sesama Admin lain
    if (targetUser.role?.toLowerCase() === "admin" && targetUser.id !== currentUser.id) return false;
    
    // 3. User tidak bisa mengubah dirinya sendiri di sini (untuk mencegah kehilangan akses secara tidak sengaja)
    if (targetUser.id === currentUser.id) return false;

    // 4. Selebihnya (Staff & Viewer) bisa dikelola
    return true;
  };

  const handleExportUsers = () => {
    if (users.length === 0) return alert("Tidak ada data user!");
    const reportData = users.map(u => ({
      Nama_Lengkap: u.name || "N/A",
      Username: u.username || "N/A",
      Role: u.role || "viewer",
      ID_Sistem: u.id
    }));
    const headers = ["Nama Lengkap", "Username", "Otoritas/Role", "ID User"];
    const fileName = `Laporan_Otoritas_${new Date().toISOString().split('T')[0]}`;
    exportToCSV(reportData, fileName, headers);
  };

  const handleUpdateRole = async (targetUserId, targetUserName, newRole) => {
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
        <p className="text-sm font-medium italic">Memverifikasi Otoritas Pengguna...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic flex items-center gap-2">
            <UserCog className="text-blue-600" /> Manajemen Otoritas
          </h2>
          <p className="text-sm text-slate-500 font-medium italic">
            Login as: <span className="text-rose-600 font-black">{currentUser?.role.toUpperCase()}</span>
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleExportUsers} variant="outline" size="sm" className="rounded-xl border-emerald-200 bg-emerald-50 text-emerald-700 font-black hover:bg-emerald-100 uppercase text-[10px]">
            <Download size={14} className="mr-2" /> Export Otoritas
          </Button>
          <Button variant="outline" size="sm" onClick={fetchUsers} className="rounded-xl border-slate-200 text-slate-600 font-black hover:bg-slate-50 uppercase text-[10px]">
            <RefreshCw size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Segarkan
          </Button>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-50 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-black text-[10px] uppercase tracking-wider text-slate-400 p-6">Nama Lengkap</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-wider text-slate-400 p-6 text-center">Status Role</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-wider text-slate-400 text-right p-6 px-8">Aksi Otoritas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                <TableCell className="p-6">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md ${u.role === 'manager' ? 'bg-indigo-600' : u.role === 'admin' ? 'bg-rose-500' : 'bg-blue-500'}`}>
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 uppercase text-xs tracking-tight">{u.name}</p>
                      <p className="text-[10px] text-slate-400 italic">@{u.username}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="p-6 text-center">
                  <div className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border-b-4 ${
                    u.role === "manager" ? "bg-indigo-50 text-indigo-700 border-indigo-600" :
                    u.role === "admin" ? "bg-rose-50 text-rose-700 border-rose-600" :
                    "bg-blue-50 text-blue-700 border-blue-600"
                  }`}>
                    {u.role}
                  </div>
                </TableCell>
                <TableCell className="p-6 text-right px-8">
                  {canManage(u) ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm" variant="outline"
                        disabled={actionLoading === u.id}
                        className={`rounded-xl text-[10px] font-black h-9 transition-all px-4 ${u.role === 'staff' ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-blue-50 text-slate-600'}`}
                        onClick={() => handleUpdateRole(u.id, u.name, "staff")}
                      >
                        {actionLoading === u.id ? <Loader2 size={12} className="animate-spin" /> : <UserCheck size={14} className="mr-1.5" />}
                        STAF
                      </Button>
                      <Button
                        size="sm" variant="outline"
                        disabled={actionLoading === u.id}
                        className={`rounded-xl text-[10px] font-black h-9 transition-all px-4 ${u.role === 'viewer' ? 'bg-slate-800 text-white border-slate-800' : 'hover:bg-slate-100 text-slate-600'}`}
                        onClick={() => handleUpdateRole(u.id, u.name, "viewer")}
                      >
                        <Eye size={14} className="mr-1.5" /> VIEWER
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end items-center gap-2 text-[9px] font-black text-slate-300 italic pr-4 uppercase tracking-[0.2em]">
                      {u.role === "manager" ? <ShieldAlert size={16} className="text-indigo-500" /> : <ShieldCheck size={16} className="text-rose-500" />}
                      {u.role === "manager" ? "High Authority" : u.id === currentUser.id ? "Your Profile" : "Restricted"}
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