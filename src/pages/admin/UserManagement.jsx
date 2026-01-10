import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { exportToCSV } from "../../utils/exportUtils";
import { toast } from "sonner"; // [cite: 2025-12-24]
import { 
  UserCog, 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  Eye, 
  Loader2, 
  AlertCircle,
  RefreshCw,
  Download,
  Briefcase,
  UserMinus
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
      toast.error("Gagal Memuat Tim", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const canManage = (targetUser) => {
    const myRole = currentUser?.role?.toLowerCase();
    const targetRole = targetUser.role?.toLowerCase();

    if (targetUser.id === currentUser.id) return false;

    if (myRole === "manager") {
        return targetRole !== "manager";
    }

    if (myRole === "admin") {
        if (targetRole === "manager") return false; 
        if (targetRole === "admin") return false;  
        return true; 
    }

    return false;
  };

  const handleExportUsers = () => {
    if (users.length === 0) return toast.warning("Data Kosong", { description: "Tidak ada data user untuk di-export." });
    
    const reportData = users.map(u => ({
      Nama_Lengkap: u.name || "N/A",
      Username: u.username || "N/A",
      Role: u.role || "viewer",
      ID_Sistem: u.id
    }));
    const headers = ["Nama Lengkap", "Username", "Otoritas/Role", "ID User"];
    const fileName = `Laporan_Otoritas_${new Date().toISOString().split('T')[0]}`;
    
    exportToCSV(reportData, fileName, headers);
    toast.success("Export Berhasil", { description: "Laporan otoritas telah diunduh." });
  };

  const handleUpdateRole = async (targetUserId, targetUserName, newRole) => {
    // UPGRADE: Visual feedback taktis pada toast.promise [cite: 2025-12-24, 2025-09-29]
    toast.promise(
      async () => {
        const response = await fetch(`${USERS_API}/${targetUserId}`, {
          method: "PUT", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        });
        if (!response.ok) throw new Error();
        
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
        );
      },
      {
        loading: (
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-indigo-600" size={16} />
            <span className="font-black uppercase text-[10px] tracking-widest text-slate-900">
              Merekonsiliasi Otoritas {targetUserName}...
            </span>
          </div>
        ),
        success: `Otoritas ${targetUserName} Berhasil Dimutasi!`,
        error: "Gagal Menghubungi Server Otoritas.",
      }
    );
  };

  // UPGRADE: Visual Full Page Loading "Pulse Shield" [cite: 2025-12-24, 2025-11-02]
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-in fade-in duration-1000">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping scale-150"></div>
          <div className="relative h-20 w-20 rounded-3xl bg-slate-900 flex items-center justify-center text-indigo-400 shadow-2xl border border-white/10">
            <ShieldCheck size={40} className="animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] ml-1">
            Synchronizing Registry
          </p>
          <div className="h-1 w-48 bg-slate-100 rounded-full overflow-hidden mx-auto">
            <div className="h-[2px] bg-indigo-600 w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg">
              <UserCog size={24} />
            </div>
            Otoritas <span className="text-indigo-600 font-black">Sistem</span>
          </h2>
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mt-2">
            Level Akses Anda: <span className="text-rose-600 italic underline">[{currentUser?.role.toUpperCase()}]</span>
          </p>
        </div>
        
        <div className="flex gap-3 mt-6 md:mt-0">
          <Button onClick={handleExportUsers} variant="outline" className="h-12 rounded-2xl border-emerald-200 bg-emerald-50 text-emerald-700 font-black hover:bg-emerald-100 uppercase text-[10px] tracking-widest px-6 shadow-sm">
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
          <Button onClick={fetchUsers} className="h-12 rounded-2xl bg-slate-900 text-white font-black hover:bg-indigo-600 uppercase text-[10px] tracking-widest px-6 shadow-xl transition-all active:scale-95">
            <RefreshCw size={16} className="mr-2" /> Refresh Data
          </Button>
        </div>
      </div>

      <div className="rounded-[3rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/60 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 border-b border-slate-100">
            <TableRow>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-900 p-8">Identitas Pengguna</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-900 p-8 text-center">Status Akses</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-900 text-right p-8 pr-12">Konfigurasi Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="group hover:bg-slate-50 transition-all duration-300 border-b border-slate-50 last:border-none">
                <TableCell className="p-8 text-left">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform ${u.role === 'manager' ? 'bg-indigo-600' : u.role === 'admin' ? 'bg-rose-600' : 'bg-blue-600'}`}>
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="font-black text-slate-900 uppercase text-xs tracking-tight italic">{u.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {u.id} <span className="mx-1">/</span> @{u.username}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="p-8 text-center">
                  <div className={`inline-flex items-center px-5 py-2 rounded-2xl text-[9px] font-black uppercase border-b-4 shadow-sm ${
                    u.role === "manager" ? "bg-indigo-50 text-indigo-700 border-indigo-600" :
                    u.role === "admin" ? "bg-rose-50 text-rose-700 border-rose-600" :
                    "bg-blue-50 text-blue-700 border-blue-600"
                  }`}>
                    {u.role === "manager" ? <Briefcase size={12} className="mr-2" /> : <ShieldCheck size={12} className="mr-2" />}
                    {u.role}
                  </div>
                </TableCell>
                <TableCell className="p-8 text-right pr-12">
                  {canManage(u) ? (
                    <div className="flex justify-end gap-3">
                      {currentUser.role === "manager" && (
                         <Button
                            size="sm"
                            disabled={u.role === "admin"}
                            className={`rounded-xl text-[9px] font-black h-10 transition-all px-5 shadow-md ${u.role === 'admin' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-rose-600 border border-rose-100 hover:bg-rose-50'}`}
                            onClick={() => handleUpdateRole(u.id, u.name, "admin")}
                          >
                            <ShieldCheck size={14} className="mr-2" /> PROMOTE ADMIN
                          </Button>
                      )}

                      <Button
                        size="sm" variant="outline"
                        className={`rounded-xl text-[9px] font-black h-10 transition-all px-5 shadow-sm ${u.role === 'staff' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border border-blue-100 hover:bg-blue-50'}`}
                        onClick={() => handleUpdateRole(u.id, u.name, "staff")}
                      >
                        <UserCheck size={14} className="mr-2" /> STAFF
                      </Button>

                      <Button
                        size="sm" variant="outline"
                        className={`rounded-xl text-[9px] font-black h-10 transition-all px-5 shadow-sm ${u.role === 'viewer' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-100'}`}
                        onClick={() => handleUpdateRole(u.id, u.name, "viewer")}
                      >
                        <UserMinus size={14} className="mr-2" /> DEMOTE
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end items-center gap-3 text-[10px] font-black text-slate-900 italic pr-4 uppercase tracking-widest">
                      {u.role === "manager" ? <ShieldAlert size={20} className="text-indigo-600 animate-pulse" /> : <ShieldCheck size={20} className="text-rose-600" />}
                      {u.role === "manager" ? "Strategic Authority" : u.id === currentUser.id ? "Your Terminal" : "Access Denied"}
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