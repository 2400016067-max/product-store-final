import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  BarChart3, 
  Package, 
  Users, 
  AlertOctagon, 
  TrendingUp, 
  ShoppingCart,
  ArrowUpRight,
  History,
  Star,
  ShieldCheck,
  Activity,
  Tag,
  Zap,
  Percent,
  Clock,
  Gift, 
  Timer, 
  UserCheck, 
  MessageSquare,
  RefreshCcw, // Icon baru untuk refresh
  Box // Icon baru untuk Inventory
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useProducts } from "../../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Pastikan sonner terinstal

// Import Komponen Shadcn UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { products, loading: prodLoading } = useProducts();
  const [allUsers, setAllUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // State untuk polesan refresh
  const navigate = useNavigate();

  // 1. FUNGSI FETCH DATA (DIPISAH AGAR BISA DIPANGGIL ULANG) [cite: 2026-01-10]
  const fetchSystemData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch("https://694615d7ed253f51719d04d2.mockapi.io/users");
      const data = await res.json();
      setAllUsers(data);
      if (isManual) toast.success("Database System Synchronized");
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
      if (isManual) toast.error("Sync Failure: API Offline");
    } finally {
      setUserLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSystemData();
  }, [fetchSystemData]);

  // --- LOGIKA MANAJERIAL (STRATEGIC INSIGHTS) ---
  const stats = useMemo(() => {
    const totalValue = products.reduce((acc, p) => acc + (p.price || 0), 0);
    const available = products.filter(p => p.isAvailable).length;
    const total = products.length;
    const stockHealth = total > 0 ? (available / total) * 100 : 0; // Polesan Logika Analitik

    return {
      totalValue,
      stockHealth,
      outOfStock: products.filter(p => !p.isAvailable).length,
      promoProducts: products.filter(p => p.discountPercent > 0),
      giftedUsers: allUsers.filter(u => u.personalPromo && u.personalPromo.isActive === true),
      activeOrders: allUsers
        .filter(u => u.orderProduct && u.orderProduct !== "")
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    };
  }, [products, allUsers]);

  // HELPER: HITUNG SISA WAKTU PROMO [cite: 2026-01-10]
  const getTimeLeft = (expiryDate) => {
    if (!expiryDate) return "N/A";
    const diff = new Date(expiryDate) - new Date();
    if (diff <= 0) return "EXPIRED";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    
    return days > 0 ? `${days}h Lagi` : `${hours}j Lagi`;
  };

  if (prodLoading || userLoading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-slate-400 text-left">
      <Activity className="animate-bounce text-indigo-600" size={40} />
      <p className="font-black uppercase tracking-widest text-[10px]">Membangun Command Center...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700 p-2 font-sans text-left">
      
      {/* HEADER: COMMAND CENTER IDENTITY DENGAN TOMBOL REFRESH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-indigo-600" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Authorized Manager Access</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900 leading-none">
            Strategic <span className="text-indigo-600">Console</span>
          </h2>
          <p className="text-slate-500 text-sm mt-3 font-medium">
            Logistik & Kampanye Promo Terpusat [cite: 2026-01-10].
          </p>
        </div>
        <div className="flex gap-3">
          {/* POLESAN: TOMBOL SYNC MANUAL */}
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("rounded-xl h-12 w-12 border border-slate-100", isRefreshing && "animate-spin")}
            onClick={() => fetchSystemData(true)}
          >
            <RefreshCcw size={18} className="text-slate-400" />
          </Button>
          <Button variant="outline" className="rounded-2xl border-slate-200 h-12 px-6 font-bold" onClick={() => navigate("/manager/promo")}>
            <Tag className="mr-2 h-4 w-4 text-rose-600" /> Manage Promo
          </Button>
          <Button className="rounded-2xl bg-slate-900 hover:bg-indigo-600 h-12 px-6 shadow-xl shadow-slate-200 transition-all text-white">
            System Audit
          </Button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <QuickStatCard 
          title="Asset Value" 
          value={`Rp ${stats.totalValue.toLocaleString('id-ID')}`} 
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          subText="Nilai kapitalisasi aktif"
        />
        <QuickStatCard 
          title="Active Promos" 
          value={stats.promoProducts.length} 
          icon={<Percent size={18} className="text-rose-500" />}
          subText="Unit diskon publik"
          isAlert={stats.promoProducts.length > 0}
          alertColor="border-rose-100 ring-rose-50"
        />
        
        {/* POLESAN: ANALYTIC CARD - STOCK HEALTH */}
        <Card className="rounded-[2rem] border-slate-200/60 shadow-sm overflow-hidden bg-white text-left p-6">
           <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-slate-50 rounded-2xl text-indigo-600">
                <Box size={18} />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-none text-[8px] font-black uppercase">
                {Math.round(stats.stockHealth)}% HEALTHY
              </Badge>
           </div>
           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Inventory Health</p>
           <Progress value={stats.stockHealth} className="h-1.5 bg-slate-50 mb-2" />
           <p className="text-[10px] text-slate-500 font-medium italic italic">Unit Ketersediaan Database</p>
        </Card>

        <QuickStatCard 
          title="Active Users" 
          value={allUsers.length} 
          icon={<Users size={18} className="text-blue-500" />}
          subText="Total database personel"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* OPERATIONAL FEED (KIRI - LEBAR) */}
        <Card className="lg:col-span-2 rounded-[3rem] border-none shadow-2xl shadow-slate-100 overflow-hidden bg-white text-left">
          <CardHeader className="bg-slate-50/50 border-b p-8 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <History size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg font-black uppercase tracking-tight">Live Order Feed</CardTitle>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pantauan Logistik Terkini</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black">SYNCED</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 text-left">
            <ScrollArea className="h-[550px]">
              {stats.activeOrders.length === 0 ? (
                <div className="p-20 text-center text-slate-400 italic">Tidak ada aktivitas pesanan saat ini.</div>
              ) : (
                <div className="divide-y divide-slate-50 text-left">
                  {stats.activeOrders.map((order) => (
                    <div key={order.id} className="p-6 flex items-center justify-between hover:bg-indigo-50/30 transition-all group">
                      <div className="flex items-center gap-5">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                          <AvatarFallback className="bg-slate-900 text-white font-black text-xs text-left">
                            {order.name?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-800 uppercase italic tracking-tight">{order.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <ShoppingCart size={12} className="text-indigo-500" />
                            <p className="text-xs text-slate-500 font-medium truncate max-w-[150px]">{order.orderProduct}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={cn("text-[9px] font-black uppercase rounded-full px-3", 
                          order.orderStatus?.includes("Selesai") ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {order.orderStatus}
                        </Badge>
                        <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase">{new Date(order.orderDate).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* SIDEBAR PANEL (KANAN) */}
        <div className="space-y-6 text-left">
          
          {/* PROMO MONITORING */}
          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-rose-600 text-white p-8 relative overflow-hidden text-left">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-200">Promo Monitoring</h3>
                <Zap size={16} className="text-yellow-400 animate-pulse fill-current" />
              </div>
              
              <ScrollArea className={cn(stats.promoProducts.length > 0 ? "h-[180px]" : "h-auto")}>
                {stats.promoProducts.length === 0 ? (
                  <p className="text-xs font-bold opacity-70 italic py-4">Tidak ada promo aktif saat ini.</p>
                ) : (
                  <div className="space-y-4 pr-4 text-left">
                    {stats.promoProducts.map(p => (
                      <div key={p.id} className="flex items-center justify-between bg-white/10 p-3 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-[10px]">
                              {p.discountPercent}%
                            </div>
                            <div className="text-left">
                              <p className="text-[10px] font-black uppercase truncate max-w-[80px]">{p.name}</p>
                              <p className="text-[8px] font-bold text-rose-200">ID: {p.id}</p>
                            </div>
                        </div>
                        <Badge className="bg-white text-rose-600 text-[8px] font-black border-none">ACTIVE</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <Button onClick={() => navigate("/manager/promo")} className="w-full mt-6 bg-white text-rose-600 hover:bg-rose-50 rounded-xl font-black text-[10px] uppercase tracking-widest h-11 border-none shadow-lg">
                Launch Campaign
              </Button>
            </div>
          </Card>

          {/* POLESAN: VIP GIFT MONITOR DENGAN COUNTDOWN */}
          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden border-t-4 border-amber-400 text-left">
            <CardHeader className="p-6 border-b bg-amber-50/30 text-left">
              <div className="flex items-center gap-3">
                <Gift className="text-amber-600" size={18} />
                <CardTitle className="text-[11px] font-black uppercase tracking-widest text-slate-900 leading-none">VIP Reward Pulse</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[280px]">
                {stats.giftedUsers.length === 0 ? (
                  <p className="text-[10px] font-bold text-slate-300 uppercase italic p-10 text-center">Belum ada user yang diberikan hadiah.</p>
                ) : (
                  <div className="divide-y divide-slate-50 text-left">
                    {stats.giftedUsers.map(u => (
                      <div key={u.id} className="p-5 hover:bg-amber-50/20 transition-all text-left">
                        <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-2 text-left">
                              <UserCheck size={12} className="text-amber-600" />
                              <p className="text-[10px] font-black uppercase text-slate-800 italic leading-none">{u.name}</p>
                           </div>
                           <Badge className="bg-slate-900 text-white text-[8px] font-black border-none">{u.personalPromo.code}</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                           <span className="text-[10px] text-indigo-600 font-black uppercase">Rp {Number(u.personalPromo.discount).toLocaleString('id-ID')}</span>
                           <div className="flex items-center gap-1.5 text-rose-500">
                              <Timer size={10} className="animate-pulse" />
                              <span className="text-[9px] font-black uppercase tracking-tighter">
                                {getTimeLeft(u.personalPromo.validUntil)}
                              </span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="p-4 bg-slate-50 text-center border-t">
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Secure Gift Registry System</p>
              </div>
            </CardContent>
          </Card>

          {/* TEAM STATS */}
          <Card className="rounded-[2.5rem] bg-slate-900 text-white border-none shadow-2xl p-8 relative overflow-hidden text-left">
            <div className="relative z-10 text-left">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-6 leading-none">Akses Otoritas</h3>
              <div className="space-y-5">
                <TeamRow label="Administrator" count={allUsers.filter(u => u.role?.toLowerCase() === "admin").length} color="bg-rose-500" />
                <TeamRow label="Staff Ops" count={allUsers.filter(u => u.role?.toLowerCase() === "staff").length} color="bg-blue-500" />
                <TeamRow label="Customer" count={allUsers.filter(u => u.role?.toLowerCase() === "viewer").length} color="bg-slate-500" />
              </div>
              <Separator className="my-8 bg-white/10" />
              <div className="grid grid-cols-2 gap-3">
                <ControlBtn label="Manage Roles" onClick={() => navigate("/manager/authority")} />
                <ControlBtn label="Edit Stock" onClick={() => navigate("/admin")} />
              </div>
            </div>
            <Activity className="absolute -right-6 -bottom-6 text-white/5 w-32 h-32 rotate-12" />
          </Card>

        </div>
      </div>
    </div>
  );
}

// --- SUB-KOMPONEN ---

function QuickStatCard({ title, value, icon, subText, isAlert, alertColor = "border-amber-200 ring-amber-100" }) {
  return (
    <Card className={cn(
      "rounded-[2rem] border-slate-200/60 shadow-sm overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl bg-white text-left",
      isAlert && cn("border-2 ring-1", alertColor)
    )}>
      <CardContent className="p-6 text-left">
        <div className="flex justify-between items-start mb-6 text-left">
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-600 text-left">
            {icon}
          </div>
          <Badge variant="outline" className="text-[8px] font-black border-slate-100 tracking-widest uppercase">Metrics 2026</Badge>
        </div>
        <div className="text-left">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 leading-none">{title}</p>
          <h4 className="text-2xl font-black text-slate-900 tracking-tighter mt-2">{value}</h4>
          <p className="text-[10px] text-slate-500 font-medium italic mt-2 leading-tight">{subText}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamRow({ label, count, color }) {
  return (
    <div className="flex items-center justify-between text-left">
      <div className="flex items-center gap-3">
        <div className={cn("w-2 h-2 rounded-full", color)} />
        <span className="text-xs font-bold text-slate-400">{label}</span>
      </div>
      <span className="text-xs font-black text-white">{count}</span>
    </div>
  );
}

function ControlBtn({ label, onClick }) {
  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="w-full justify-center bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 h-10 px-2"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}