import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner"; // [cite: 2025-12-24]
import { 
  StickyNote, 
  Send, 
  Users, 
  Clock, 
  UserCheck, 
  AlertCircle,
  Loader2,
  Sparkles,
  Zap,
  CheckCircle2,
  Palette,
  ShieldCheck,
  Search
} from "lucide-react";

// Import Shadcn UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function ManageNotes() {
  const { user: manager, sendStickyNote } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // State Form
  const [targetId, setTargetId] = useState("");
  const [content, setContent] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");

  const colorOptions = [
    { name: "yellow", class: "bg-amber-400", label: "General" },
    { name: "blue", class: "bg-blue-500", label: "Technical" },
    { name: "pink", class: "bg-rose-500", label: "Urgent" },
    { name: "green", class: "bg-emerald-500", label: "Done" },
  ];

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://694615d7ed253f51719d04d2.mockapi.io/users");
      const data = await res.json();
      
      const filteredTeam = data.filter(u => 
        (u.role?.toLowerCase().includes("admin") || u.role?.toLowerCase().includes("staff")) && u.id !== manager.id
      );
      
      setUsers(filteredTeam);
    } catch (err) {
      console.error("Gagal sinkronisasi tim:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleSend = async () => {
    if (!targetId || !content) return toast.error("Data tidak lengkap!");

    setSending(true);
    // UPGRADE: Menggunakan toast.promise untuk feedback taktis [cite: 2025-12-24, 2025-09-29]
    toast.promise(
      sendStickyNote(targetId, content, selectedColor),
      {
        loading: (
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-indigo-600" size={16} />
            <span className="font-black uppercase text-[10px] tracking-widest text-slate-900">
              Mendelegasikan Instruksi Strategis...
            </span>
          </div>
        ),
        success: () => {
          setContent("");
          setTargetId("");
          fetchTeam();
          return "Instruksi Berhasil Ditransmisikan!";
        },
        error: "Gagal Menghubungi Terminal Target.",
      }
    );
    setSending(false);
  };

  // LOGIKA AMAN: Menangani personalNotes jika tipenya masih string dari MockAPI lama [cite: 2025-09-29]
  const delegatedNotes = users.flatMap(u => {
    const notes = Array.isArray(u.personalNotes) ? u.personalNotes : [];
    return notes.map(n => ({ 
      ...n, 
      targetName: u.name, 
      targetRole: u.role,
      targetUsername: u.username 
    }));
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // UPGRADE: Visual Full Page Loading "Tactical Pulse" [cite: 2025-12-24, 2025-11-02]
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-in fade-in duration-1000">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping scale-150"></div>
          <div className="relative h-20 w-20 rounded-3xl bg-slate-900 flex items-center justify-center text-indigo-400 shadow-2xl border border-white/10">
            <Sparkles size={40} className="animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] ml-1">
            Retrieving Tactical Data
          </p>
          <div className="h-1 w-48 bg-slate-100 rounded-full overflow-hidden mx-auto">
            <div className="h-[2px] bg-indigo-600 w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 text-left font-sans max-w-7xl mx-auto">
      
      {/* HEADER COMMAND CENTER */}
      <div className="relative overflow-hidden bg-slate-900 p-10 rounded-[3rem] shadow-2xl shadow-indigo-100 border border-slate-800">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 bg-indigo-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400/80">Executive Operations Center</span>
          </div>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic text-white leading-none">
            Delegasi <span className="text-indigo-500 text-glow">Instruksi</span>
          </h2>
          <p className="text-slate-400 text-sm mt-4 font-medium max-w-lg">Alokasikan tugas dan catatan strategis kepada unit Admin dan Staff operasional secara personal.</p>
        </div>
        <StickyNote className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 -rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CONTROL INTERFACE */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 bg-white overflow-hidden">
            <CardHeader className="p-8 pb-0 text-left">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                    <Zap size={20} fill="currentColor" />
                 </div>
                 <CardTitle className="text-xl font-black uppercase italic text-slate-800">New Mission</CardTitle>
              </div>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Konfigurasi Instruksi Tim</CardDescription>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                   <UserCheck size={14} /> Penerima Tugas
                </label>
                <Select onValueChange={setTargetId} value={targetId}>
                  <SelectTrigger className="h-16 rounded-2xl border-slate-100 bg-slate-50 font-black uppercase text-[11px] tracking-wider focus:ring-indigo-600 shadow-inner">
                    <SelectValue placeholder="PILIH PERSONIL" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl shadow-2xl border-slate-100 z-[100] p-2">
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id} className="py-4 cursor-pointer focus:bg-indigo-50 rounded-xl px-4">
                        <div className="flex items-center gap-4 text-left">
                          <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                            <AvatarFallback className="bg-slate-900 text-white text-[10px] font-black">{u.name?.substring(0,2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-black text-xs uppercase italic">{u.name}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Unit {u.role}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                   <Palette size={14} /> Kode Warna Urgensi
                </label>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-inner">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => setSelectedColor(opt.name)}
                      className={cn(
                        "h-10 w-10 rounded-xl transition-all duration-300 flex items-center justify-center",
                        opt.class,
                        selectedColor === opt.name ? "ring-4 ring-indigo-100 scale-110 shadow-lg" : "opacity-40 hover:opacity-100 scale-90"
                      )}
                    >
                      {selectedColor === opt.name && <CheckCircle2 size={16} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                   <StickyNote size={14} /> Briefing Strategis
                </label>
                <Textarea 
                  placeholder="Tulis arahan teknis di sini..."
                  className="min-h-[160px] rounded-[2rem] border-slate-100 bg-slate-50 p-6 font-medium focus-visible:ring-indigo-600 resize-none shadow-inner text-sm leading-relaxed"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleSend}
                disabled={sending || !targetId || !content}
                className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all active:scale-95 gap-4"
              >
                {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                Deploy Instruction
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: DELEGATION FEED */}
        <div className="lg:col-span-8">
          <Card className="rounded-[3rem] border-none shadow-xl shadow-slate-100 bg-white overflow-hidden h-full flex flex-col">
            <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100 flex flex-row items-center justify-between text-left">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600 border border-slate-100">
                    <Users size={24} />
                 </div>
                 <div>
                    <CardTitle className="text-2xl font-black uppercase italic text-slate-900">Live Mission Feed</CardTitle>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Laporan instruksi aktif dalam jaringan</p>
                 </div>
              </div>
              <Badge variant="outline" className="h-10 px-6 rounded-full bg-white font-black border-slate-200 text-slate-900 text-[10px] uppercase tracking-widest">
                {delegatedNotes.length} Reports Active
              </Badge>
            </CardHeader>
            
            <CardContent className="p-0 flex-1">
              <ScrollArea className="h-[750px]">
                {delegatedNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-32 text-slate-300 gap-6">
                      <AlertCircle size={60} className="opacity-10" />
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] italic opacity-40">System Idle - No Active Instructions</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 p-8 gap-6">
                    {delegatedNotes.map((note) => (
                      <div key={note.id} className="relative bg-slate-50/50 hover:bg-white border border-slate-100 p-8 rounded-[2.5rem] transition-all duration-500 group hover:shadow-2xl hover:shadow-indigo-100/50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                          <div className="flex items-center gap-4">
                            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3", 
                              colorOptions.find(o => o.name === note.color)?.class || "bg-amber-400")}>
                              <Zap size={22} fill="currentColor" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-black uppercase text-slate-900 italic tracking-tight">{note.targetName}</p>
                                <div className="flex gap-2 items-center mt-1">
                                    <Badge className="text-[8px] font-black bg-white text-slate-400 border-slate-100 uppercase">{note.targetRole}</Badge>
                                    <span className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter">@{note.targetUsername}</span>
                                </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                             <Clock size={12} className="text-indigo-400" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                {new Date(note.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                        </div>
                        
                        <div className="relative p-6 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-left">
                           <div className={cn("absolute left-0 top-0 bottom-0 w-1.5 shadow-[0_0_15px_rgba(0,0,0,0.1)]", 
                              colorOptions.find(o => o.name === note.color)?.class || "bg-amber-400")}></div>
                           <p className="text-base text-slate-600 font-medium leading-relaxed pl-4 italic">
                              "{note.content}"
                           </p>
                        </div>
                        <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Badge className="bg-indigo-600 text-white text-[8px] font-black uppercase">Monitor Active</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}