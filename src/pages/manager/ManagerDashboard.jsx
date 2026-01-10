import React, { useState, useEffect } from "react";
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
  Clock
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useProducts } from "../../hooks/useProducts";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const res = await fetch("https://694615d7ed253f51719d04d2.mockapi.io/users");
        const data = await res.json();
        setAllUsers(data);
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setUserLoading(false);
      }
    };
    fetchSystemData();
  }, []);

  // --- LOGIKA MANAJERIAL (STRATEGIC INSIGHTS) ---

  // A. Inventaris & Promo [cite: 2026-01-10]
  const totalValue = products.reduce((acc, p) => acc + (p.price || 0), 0);
  const outOfStock = products.filter(p => !p.isAvailable).length;
  const promoProducts = products.filter(p => p.discountPercent > 0);
  
  // B. Kualitas Layanan [cite: 2025-09-29]
  const avgStoreRating = products.length > 0 
    ? (products.reduce((acc, p) => acc + (p.avgRating || 0), 0) / products.length).toFixed(1)
    : 0;

  // C. Monitoring Pesanan Real-time [cite: 2025-12-13]
  const activeOrders = allUsers
    .filter(u => u.orderProduct && u.orderProduct !== "")
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  // D. Komposisi Tim [cite: 2025-09-29]
  const teamStats = {
    admin: allUsers.filter(u => u.role?.toLowerCase() === "admin").length,
    staff: allUsers.filter(u => u.role?.toLowerCase() === "staff").length,
    viewer: allUsers.filter(u => u.role?.toLowerCase() === "viewer").length,
  };

  if (prodLoading || userLoading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <Activity className="animate-bounce text-indigo-600" size={40} />
      <p className="font-black uppercase tracking-widest text-[10px]">Membangun Command Center...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700 p-2 font-sans text-left">
      
      {/* HEADER: COMMAND CENTER IDENTITY */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2 text-left">
            <ShieldCheck className="text-indigo-600" size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Authorized Manager Access</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900 leading-none text-left">
            Strategic <span className="text-indigo-600">Console</span>
          </h2>
          <p className="text-slate-500 text-sm mt-3 font-medium text-left">
            Logistik & Kampanye Promo Terpusat [cite: 2026-01-10].
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl border-slate-200 h-12 px-6 font-bold" onClick={() => navigate("/manager/promo")}>
            <Tag className="mr-2 h-4 w-4 text-rose-600" /> Manage Promo
          </Button>
          <Button className="rounded-2xl bg-slate-900 hover:bg-indigo-600 h-12 px-6 shadow-xl shadow-slate-200 transition-all">
            System Audit
          </Button>
        </div>
      </div>

      {/* KPI GRID: UPGRADED WITH PROMO METRIC [cite: 2026-01-10] */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatCard 
          title="Asset Value" 
          value={`Rp ${totalValue.toLocaleString('id-ID')}`} 
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          subText="Nilai kapitalisasi aktif"
        />
        <QuickStatCard 
          title="Active Promos" 
          value={promoProducts.length} 
          icon={<Percent size={18} className="text-rose-500" />}
          subText="Unit dalam kampanye diskon"
          isAlert={promoProducts.length > 0}
          alertColor="border-rose-100 ring-rose-50"
        />
        <QuickStatCard 
          title="Inventory Alert" 
          value={outOfStock} 
          icon={<AlertOctagon size={18} className="text-amber-500" />}
          subText="Produk kehabisan stok"
          isAlert={outOfStock > 0}
        />
        <QuickStatCard 
          title="Active Users" 
          value={allUsers.length} 
          icon={<Users size={18} className="text-blue-500" />}
          subText="Total database personel"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* OPERATIONAL FEED */}
        <Card className="lg:col-span-2 rounded-[3rem] border-none shadow-2xl shadow-slate-100 overflow-hidden bg-white">
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
              <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black animate-pulse">LIVE SINKRON</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[450px]">
              {activeOrders.length === 0 ? (
                <div className="p-20 text-center text-slate-400 italic">Tidak ada aktivitas pesanan saat ini.</div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {activeOrders.map((order) => (
                    <div key={order.id} className="p-6 flex items-center justify-between hover:bg-indigo-50/30 transition-all group">
                      <div className="flex items-center gap-5">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                          <AvatarFallback className="bg-slate-900 text-white font-black text-xs">
                            {order.name?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-800 uppercase italic tracking-tight">{order.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <ShoppingCart size={12} className="text-indigo-500" />
                            <p className="text-xs text-slate-500 font-medium">{order.orderProduct}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={cn("text-[9px] font-black uppercase rounded-full px-3", 
                          order.orderStatus?.includes("Selesai") ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {order.orderStatus}
                        </Badge>
                        <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase">{new Date(order.orderDate).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* PROMO MONITORING & TEAM COMPOSITION [cite: 2026-01-10] */}
        <div className="space-y-6">
          {/* Promo Live Status */}
          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-rose-600 text-white p-8 relative overflow-hidden">
            <div className="relative z-10 text-left">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-200">Promo Monitoring</h3>
                <Zap size={16} className="text-yellow-400 animate-pulse fill-current" />
              </div>
              
              <ScrollArea className={cn(promoProducts.length > 0 ? "h-[180px]" : "h-auto")}>
                {promoProducts.length === 0 ? (
                  <p className="text-xs font-bold opacity-70 italic py-4">Tidak ada promo aktif saat ini [cite: 2026-01-10].</p>
                ) : (
                  <div className="space-y-4 pr-4">
                    {promoProducts.map(p => (
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
                        <Badge className="bg-white text-rose-600 text-[8px] font-black">ACTIVE</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <Button 
                onClick={() => navigate("/manager/promo")}
                className="w-full mt-6 bg-white text-rose-600 hover:bg-rose-50 rounded-xl font-black text-[10px] uppercase tracking-widest h-11"
              >
                Launch New Campaign
              </Button>
            </div>
            <Tag className="absolute -right-6 -bottom-6 text-white/5 w-32 h-32 rotate-12" />
          </Card>

          {/* Team Stats */}
          <Card className="rounded-[2.5rem] bg-slate-900 text-white border-none shadow-2xl p-8 relative overflow-hidden">
            <div className="relative z-10 text-left">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-6">Struktur Otoritas</h3>
              <div className="space-y-5">
                <TeamRow label="Administrator" count={teamStats.admin} color="bg-rose-500" />
                <TeamRow label="Staff Operational" count={teamStats.staff} color="bg-blue-500" />
                <TeamRow label="Customer (Viewer)" count={teamStats.viewer} color="bg-slate-500" />
              </div>
              <Separator className="my-8 bg-white/10" />
              <div className="grid grid-cols-2 gap-3">
                <ControlBtn label="Users" onClick={() => navigate("/manager/authority")} />
                <ControlBtn label="Inventory" onClick={() => navigate("/admin")} />
              </div>
            </div>
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
      "rounded-[2rem] border-slate-200/60 shadow-sm overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl bg-white",
      isAlert && cn("border-2 ring-1", alertColor)
    )}>
      <CardContent className="p-6 text-left">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-600">
            {icon}
          </div>
          <Badge variant="outline" className="text-[8px] font-black border-slate-100 tracking-widest uppercase">Metrics 2026</Badge>
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{title}</p>
          <h4 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h4>
          <p className="text-[10px] text-slate-500 font-medium italic mt-2">{subText}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamRow({ label, count, color }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn("w-2 h-2 rounded-full", color)} />
        <span className="text-xs font-bold text-slate-300">{label}</span>
      </div>
      <span className="text-xs font-black">{count}</span>
    </div>
  );
}

function ControlBtn({ label, onClick }) {
  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="w-full justify-center bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}