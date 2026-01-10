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
  RefreshCw,
  Download,
  Briefcase,
  UserMinus,
  Zap,
  Globe,
  Lock,
  Search
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ManagerUserManagement() {
  const { user: currentUser } = useAuth(); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const USERS_API = "https://694615d7ed253f51719d04d2.mockapi.io/users"; // [cite: 2025-12-26]

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(USERS_API);
      if (!response.ok) throw new Error("Kegagalan Sinkronisasi Database.");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      toast.error("Critical Error", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // LOGIKA MANAJERIAL: Manager bisa mengatur semua kecuali dirinya sendiri [cite: 2025-09-29]
  const canManage = (targetId) => targetId !== currentUser.id;

  const handleUpdateRole = async (targetUserId, targetUserName, newRole) => {
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
        success: `Akses ${targetUserName} Berhasil Dimutasi ke ${newRole.toUpperCase()}!`,
        error: "Gagal Mengakses Server Otoritas.",
      }
    );
  };

  const handleExportUsers = () => {
    if (users.length === 0) return toast.warning("Data Kosong");
    const reportData = users.map(u => ({
      Nama_Lengkap: u.name || "N/A",
      Username: u.username || "N/A",
      Role: u.role || "viewer",
      ID_Sistem: u.id
    }));
    const headers = ["Nama Lengkap", "Username", "Otoritas/Role", "ID User"];
    exportToCSV(reportData, `Laporan_Otoritas_${Date.now()}`, headers);
    toast.success("Laporan Diekspor");
  };

  // TAMPILAN LOADING TAKTIS (PULSE SHIELD) [cite: 2025-12-24, 2025-11-02]
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-in fade-in duration-1000">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping scale-150"></div>
          <div className="relative h-20 w-20 rounded-3xl bg-slate-900 flex items-center justify-center text-indigo-400 shadow-2xl border border-white/10">
            <Globe size={40} className="animate-pulse" />
          </div>
        </div>
        <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] ml-1">
          Global Registry Sync
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 text-left font-sans max-w-7xl mx-auto">
      
      {/* EXECUTIVE HEADER [cite: 2025-12-24] */}
      <div className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Zap size={18} className="text-indigo-400 fill-current animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300">Authority Control</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
              Struktur <span className="text-indigo-500">Organisasi</span>
            </h2>
            <p className="text-slate-300 text-sm mt-6 font-medium max-w-md">Kendali mutlak atas hierarki unit operasional, promosi jabatan, dan manajemen hak akses global.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleExportUsers} variant="outline" className="h-14 rounded-2xl border-white/10 bg-white/5 text-white font-black hover:bg-white/10 uppercase text-[10px] tracking-widest px-8 transition-all active:scale-95">
               <Download size={18} className="mr-2" /> Export CSV
            </Button>
            <Button onClick={fetchUsers} className="h-14 rounded-2xl bg-white text-slate-900 font-black hover:bg-indigo-500 hover:text-white uppercase text-[10px] tracking-widest px-8 shadow-xl transition-all active:scale-95 gap-3">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Sync Database
            </Button>
          </div>
        </div>
        <UserCog className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 rotate-12" />
      </div>

      {/* AUTHORITY TABLE CONTAINER (RESPONSIVE) [cite: 2025-09-29] */}
      <div className="rounded-[3rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <Table className="min-w-[900px]">
            <TableHeader className="bg-slate-50/80 border-b border-slate-200">
              <TableRow>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-900 p-8">Identitas Pengguna</TableHead>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-900 p-8 text-center">Status Otoritas</TableHead>
                <TableHead className="font-black text-[11px] uppercase tracking-widest text-slate-900 text-right p-8 pr-12">Modifikasi Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} className="group hover:bg-slate-50 transition-all duration-300 border-b border-slate-100 last:border-none">
                  <TableCell className="p-8">
                    <div className="flex items-center gap-5">
                      <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500", 
                        u.role === 'manager' ? 'bg-indigo-600 shadow-indigo-200' : u.role === 'admin' ? 'bg-rose-600 shadow-rose-200' : 'bg-blue-600 shadow-blue-200')}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="font-black text-slate-900 uppercase text-sm tracking-tight italic leading-tight">{u.name}</p>
                        <p className="text-[10px] text-slate-900 font-bold uppercase tracking-tighter opacity-80 mt-1">@{u.username} • ID: {u.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-8 text-center">
                    <Badge className={cn("px-6 py-2 rounded-2xl text-[10px] font-black uppercase border-b-4 shadow-sm", 
                      u.role === "manager" ? "bg-indigo-50 text-indigo-700 border-indigo-600" :
                      u.role === "admin" ? "bg-rose-50 text-rose-700 border-rose-600" :
                      "bg-blue-50 text-blue-700 border-blue-600")}>
                      {u.role === 'manager' ? <Briefcase size={12} className="mr-2" /> : <ShieldCheck size={12} className="mr-2" />}
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-8 text-right pr-12">
                    {canManage(u.id) ? (
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                        <Button
                          size="sm"
                          disabled={u.role === "admin"}
                          className="rounded-xl text-[9px] font-black h-11 px-5 bg-slate-900 text-white hover:bg-rose-600 shadow-xl border-none transition-all active:scale-95"
                          onClick={() => handleUpdateRole(u.id, u.name, "admin")}
                        >
                          <ShieldCheck size={14} className="mr-2" /> PROMOTE ADMIN
                        </Button>

                        <Button
                          size="sm"
                          disabled={u.role === "staff"}
                          className="rounded-xl text-[9px] font-black h-11 px-5 bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 shadow-sm transition-all active:scale-95"
                          onClick={() => handleUpdateRole(u.id, u.name, "staff")}
                        >
                          <UserCheck size={14} className="mr-2" /> ASSIGN STAFF
                        </Button>

                        <Button
                          size="sm"
                          disabled={u.role === "viewer"}
                          className="rounded-xl text-[9px] font-black h-11 px-5 bg-white text-slate-900 border border-slate-200 hover:bg-slate-100 shadow-sm transition-all active:scale-95"
                          onClick={() => handleUpdateRole(u.id, u.name, "viewer")}
                        >
                          <UserMinus size={14} className="mr-2" /> REVOKE
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-widest italic pr-6 opacity-100">
                        <Lock size={16} className="text-indigo-600 animate-pulse" /> Master Terminal
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}