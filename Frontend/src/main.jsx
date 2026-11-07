import { StrictMode } from "react";
import React from "react";

import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";

import { ProductProvider } from "./utils/ProductContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Pastikan baris ini ada di luar fungsi render
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* QueryClientProvider HARUS PALING LUAR di antara provider lainnya */}
      <QueryClientProvider client={queryClient}>
        <ProductProvider>
          <CartProvider>
            <App />
            <Toaster position="top-right" reverseOrder={false} />
          </CartProvider>
        </ProductProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
