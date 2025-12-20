import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-bold text-xl">ProductStore</h1>
          <nav className="space-x-4">
            <span className="text-sm text-muted-foreground">Katalog</span>
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-6">
        <Outlet /> {/* Halaman Katalog/Detail akan muncul di sini [cite: 2025-09-29] */}
      </main>
      <footer className="p-6 border-t text-center text-sm text-muted-foreground">
        © 2025 Product Store Team - IS Project
      </footer>
    </div>
  );
}