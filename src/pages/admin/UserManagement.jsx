import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  UserCog, 
  ShieldCheck, 
  UserCheck, 
  Eye, 
  Loader2, 
  AlertCircle,
  RefreshCw 
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
  const { user: currentUser } = useAuth(); // Ambil data Admin yang sedang login
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // ID user yang sedang diproses
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

  // 2. FUNGSI UPDATE ROLE (Menggunakan PUT sesuai izin MockAPI kamu)
  const handleUpdateRole = async (targetUserId, targetUserName, newRole) => {
    // Proteksi: Jangan edit diri sendiri
    if (targetUserId === currentUser.id) {
      alert("Anda tidak bisa mengubah role Anda sendiri demi keamanan sistem.");
      return;
    }

    const confirmMsg = `Ubah jabatan ${targetUserName} menjadi ${newRole.toUpperCase()}?`;
    if (!window.confirm(confirmMsg)) return;

    setActionLoading(targetUserId);
    try {
      // Kita gunakan PUT karena MockAPI kamu belum mengizinkan PATCH
      const response = await fetch(`${USERS_API}/${targetUserId}`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Gagal memperbarui otoritas.");

      // Update state lokal agar UI langsung berubah
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
        <p className="text-sm font-medium">Memverifikasi Otoritas Pengguna...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Otoritas</h2>
          <p className="text-sm text-slate-500 font-medium">Atur hak akses Imam, Raka, dan Dadan di sini.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchUsers}
          className="rounded-xl border-slate-200 text-slate-600 font-bold"
        >
          <RefreshCw size={14} className="mr-2" /> Segarkan
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Tabel Manajemen User */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold text-slate-600">Nama Lengkap</TableHead>
              <TableHead className="font-bold text-slate-600">Username</TableHead>
              <TableHead className="font-bold text-slate-600 text-center">Status Role</TableHead>
              <TableHead className="font-bold text-slate-600 text-right px-6">Ubah Otoritas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-sm ${u.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'}`}>
                      {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="font-bold text-slate-800">
                      {u.name || "Unknown User"} {u.id === currentUser.id && <span className="text-blue-600 text-[10px] ml-1">(Anda)</span>}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-500 font-medium italic text-sm">@{u.username}</TableCell>
                <TableCell className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                    u.role === "admin" 
                      ? "bg-red-50 text-red-700 border-red-100" 
                      : u.role === "staff"
                      ? "bg-blue-50 text-blue-700 border-blue-100"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}>
                    {u.role}
                  </div>
                </TableCell>
                <TableCell className="text-right px-6">
                  {/* Jangan biarkan Admin mengedit dirinya sendiri */}
                  {u.id !== currentUser.id ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading === u.id}
                        className={`rounded-xl text-[11px] font-bold h-8 transition-all ${u.role === 'staff' ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'hover:bg-blue-50'}`}
                        onClick={() => handleUpdateRole(u.id, u.name, "staff")}
                      >
                        {actionLoading === u.id ? <Loader2 size={12} className="animate-spin" /> : <UserCheck size={12} className="mr-1" />}
                        STAF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading === u.id}
                        className={`rounded-xl text-[11px] font-bold h-8 transition-all ${u.role === 'viewer' ? 'bg-slate-800 text-white border-slate-800 hover:bg-slate-900' : 'hover:bg-amber-50'}`}
                        onClick={() => handleUpdateRole(u.id, u.name, "viewer")}
                      >
                        <Eye size={12} className="mr-1" /> VIEWER
                      </Button>
                    </div>
                  ) : (
                    <div className="text-[10px] font-bold text-slate-400 italic pr-4 flex items-center justify-end gap-1">
                      <ShieldCheck size={12} /> Master Account
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