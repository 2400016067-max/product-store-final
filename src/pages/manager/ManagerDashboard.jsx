import React from "react";
import { 
  BarChart3, 
  Package, 
  Users, 
  AlertOctagon, 
  TrendingUp, 
  ShoppingCart,
  ArrowUpRight,
  History
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useProducts } from "../../hooks/useProducts";
import { useNavigate } from "react-router-dom";

// Import Komponen Shadcn UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { products, loading: prodLoading } = useProducts();
  const navigate = useNavigate();

  // --- LOGIKA ANALISIS DATA (Berdasarkan JSON Mock API Kamu) ---
  
  // 1. Hitung Total Nilai Aset (Managerial Insight)
  const totalValue = products.reduce((acc, p) => acc + (p.price || 0), 0);
  
  // 2. Filter Produk Stok Habis (isAvailable: false)
  const outOfStock = products.filter(p => !p.isAvailable).length;

  // 3. Kelompokkan kategori untuk melihat diversitas produk
  const categories = [...new Set(products.map(p => p.category))];

  // --- SIMULASI AKTIVITAS (Mengambil referensi dari JSON User yang kamu berikan) ---
  const recentOrders = [
    { id: "3", name: "Dadan Julianto", item: "Sony WH-1000XM5", status: "Diproses", time: "Baru saja" },
    { id: "6", name: "Teing TeApal", item: "Madu Multiflora", status: "Selesai", time: "2 jam lalu" },
    { id: "7", name: "Imam Faqih", item: "iPhone 15 Pro Max", status: "Pending", time: "5 jam lalu" },
  ];

  if (prodLoading) return <div className="p-10 animate-pulse text-slate-400">Mensinkronisasi data manajerial...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 p-2">
      
      {/* HEADER: RINGKASAN EKSEKUTIF */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase italic text-slate-900">
            Manager <span className="text-indigo-600">Overview</span>
          </h2>
          <p className="text-muted-foreground text-sm font-medium">
            Selamat bekerja kembali, <span className="text-slate-900 font-bold">{user?.name || "Manager"}</span>. Berikut ringkasan sistem hari ini.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-slate-200" onClick={() => navigate("/manager/reports")}>
            <BarChart3 className="mr-2 h-4 w-4" /> Laporan Detail
          </Button>
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
            Export Dashboard
          </Button>
        </div>
      </div>

      {/* KPI GRID: DATA REAL DARI MOCK API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatCard 
          title="Total Nilai Inventaris" 
          value={`Rp ${totalValue.toLocaleString('id-ID')}`} 
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          subText="Estimasi nilai aset saat ini"
        />
        <QuickStatCard 
          title="Volume Produk" 
          value={products.length} 
          icon={<Package size={18} className="text-blue-500" />}
          subText={`${categories.length} Kategori aktif`}
        />
        <QuickStatCard 
          title="Stok Kosong" 
          value={outOfStock} 
          icon={<AlertOctagon size={18} className="text-red-500" />}
          subText="Butuh pengadaan segera"
          isAlert={outOfStock > 0}
        />
        <QuickStatCard 
          title="Status Akun" 
          value="Verified" 
          icon={<Users size={18} className="text-indigo-500" />}
          subText={`Role: ${user?.role || "Manager"}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LOG AKTIVITAS (Audit Trail) */}
        <Card className="lg:col-span-2 rounded-[2rem] border-slate-200/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History size={20} className="text-indigo-600" />
                <CardTitle className="text-sm font-black uppercase tracking-widest">Aktivitas Transaksi</CardTitle>
              </div>
              <Badge variant="outline" className="bg-white">Real-time</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[350px]">
              <div className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-5 flex items-center justify-between hover:bg-slate-50/80 transition-all">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold text-xs">
                          {order.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{order.name}</p>
                        <p className="text-xs text-slate-500">Membeli: <span className="font-semibold text-slate-700">{order.item}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`text-[10px] font-black uppercase ${
                        order.status === "Diproses" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"
                      }`}>
                        {order.status}
                      </Badge>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">{order.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* QUICK ACTIONS & SYSTEM STATUS */}
        <div className="space-y-6">
          <Card className="rounded-[2rem] bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShoppingCart size={80} />
            </div>
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">Kendali Sistem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 relative z-10">
              <Button 
                variant="ghost" 
                className="w-full justify-between hover:bg-white/10 text-white rounded-xl border border-white/10"
                onClick={() => navigate("/admin/users")}
              >
                Manajemen Tim <ArrowUpRight size={16} />
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-between hover:bg-white/10 text-white rounded-xl border border-white/10"
                onClick={() => navigate("/admin")}
              >
                Monitor Inventaris <ArrowUpRight size={16} />
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-indigo-50/30 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-indigo-600">Tips Manajerial</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-relaxed text-slate-600 font-medium">
                Ada <span className="font-bold text-red-600">{outOfStock} produk</span> yang tidak tersedia. Pastikan tim logistik segera memperbarui data vendor.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Komponen Reusable: QuickStatCard
function QuickStatCard({ title, value, icon, subText, isAlert }) {
  return (
    <Card className={`rounded-[1.8rem] border-slate-200/60 shadow-sm overflow-hidden transition-all hover:shadow-md ${isAlert ? 'border-red-200 bg-red-50/20' : ''}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600">
            {icon}
          </div>
          <Badge variant="outline" className="text-[9px] font-black border-slate-200">2026</Badge>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
          <h4 className="text-xl font-black text-slate-900 truncate">{value}</h4>
          <Separator className="my-2" />
          <p className="text-[10px] text-slate-500 font-medium italic">{subText}</p>
        </div>
      </CardContent>
    </Card>
  );
}