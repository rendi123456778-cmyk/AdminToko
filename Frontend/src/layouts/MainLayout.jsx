import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navbar */}
      <Navbar />
      {/* < Sidebar /> */}

      {/* Search & Filter */}
      <header className="bg-gray-100 p-4 flex flex-col md:flex-row gap-2 justify-between items-center">
        <input
          type="text"
          placeholder="Cari produk..."
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg"
        />
        <select className="px-4 py-2 border rounded-lg">
          <option>Semua Kategori</option>
          <option>Elektronik</option>
          <option>Fashion</option>
          <option>Kecantikan</option>
        </select>
      </header>

      {/* Main Section */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>© 2025 E-Commerce Simple App | Version 1.0</p>
      </footer>
    </div>
  );
}
