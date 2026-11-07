import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/adminpages/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import AboutPage from "./pages/adminpages/AboutPage";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/frontpages/Dashboard";
import ProductDetail from "./pages/frontpages/ProductDetail";
import Cart from "./pages/frontpages/Cart";
import Checkout from "./pages/frontpages/Checkout";
import ProductForm from "./pages/adminpages/ProductForm";
import ProductEdit from "./pages/adminpages/ProductEdit";
import StockMonitor from "./pages/adminpages/StockMonitor";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>
      {/* Admin Layout wrapper, pendekatan jika menggunakan Outlet pada JSX
       */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Default route di dalam AdminLayout */}
        {/* mapping path ke component page, gunakan autocompletion */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="add-products" element={<ProductForm />} />
        <Route path="edit-product/:id" element={<ProductEdit />} />
        <Route path="edit-products/:id" element={<ProductEdit />} />
        <Route path="stock-monitor" element={<StockMonitor />} />
      </Route>  
    </Routes>
  );
}
