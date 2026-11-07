import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "../../utils/ProductContext";
import toast from "react-hot-toast";

// Nama komponen
export default function AdminDashboard() {
  const { deleteProduct, getCategories, getProducts } = useProducts();

  // STATE UNTUK FILTER DAN PAGINATION
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // BATAS PRODUK PER HALAMAN
  const limit = 10;

  // FETCH DATA KATEGORI
  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const categories = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : (categoriesResponse?.data ?? []);

  // FETCH DATA PRODUK BERDASARKAN FILTER DAN PAGINATION
  const {
    data: productResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", currentPage, limit, selectedCategory, searchKeyword],
    queryFn: () =>
      getProducts({
        page: currentPage,
        limit: limit,
        category_id: selectedCategory,
        keyword: searchKeyword,
      }),
  });

  // DATA PRODUK
  const products = productResponse?.data ?? [];

  // INFORMASI PAGINATION DARI API
  const totalPages = productResponse?.last_page ?? 1;
  const activePage = productResponse?.current_page ?? currentPage;

  // FUNGSI HAPUS PRODUK
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus produk ini?",
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Produk berhasil dihapus!");
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus produk.");
    }
  };

  // FUNGSI PENCARIAN DAN FILTER
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchKeyword(keyword);
  };

  // FUNGSI RESET FILTER
  const handleReset = () => {
    setKeyword("");
    setSearchKeyword("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  // LOADING
  if (isLoading) return <p>Loading...</p>;

  // ERROR
  if (isError) return <p>Error loading products.</p>;

  return (
    <div className="rounded bg-white p-4 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Manajemen Produk</h1>
        <Link to="/admin/add-products" className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
          + Tambah Produk
        </Link>
      </div>

      {/* 1. SEARCH & FILTER PANEL */}
      <form
        onSubmit={handleSearch}
        className="mb-4 flex flex-col gap-2 sm:flex-row"
      >
        {/* INPUT PENCARIAN */}
        <input
          type="text"
          placeholder="Cari produk..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="min-w-0 flex-1 rounded border border-gray-300 p-2"
        />

        {/* FILTER KATEGORI */}
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="min-w-0 flex-1 rounded border border-gray-300 p-2"
        >
          <option value="">-- Semua Kategori --</option>

          {categories.map((cat) => (
            <option key={cat.category_id ?? cat.id} value={cat.category_id ?? cat.id}>
              {cat.category ?? cat.name}
            </option>
          ))}
        </select>

        {/* TOMBOL CARI */}
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Cari
        </button>

        {/* TOMBOL RESET */}
        <button
          type="button"
          onClick={handleReset}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Reset
        </button>
      </form>

      {/* TOMBOL TAMBAH PRODUK */}
      {/* 2. TABEL DATA PRODUK */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-400 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-400 bg-gray-100 p-2 text-left">#</th>
              <th className="border border-gray-400 bg-gray-100 p-2 text-left">Image</th>
              <th className="border border-gray-400 bg-gray-100 p-2 text-left">Nama</th>
              <th className="border border-gray-400 bg-gray-100 p-2 text-left">Harga</th>
              <th className="border border-gray-400 bg-gray-100 p-2 text-left">Stok</th>
              <th className="border border-gray-400 bg-gray-100 p-2 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((p, index) => (
                <tr key={p.id}>
                  <td className="border border-gray-300 p-2">
                    {(activePage - 1) * limit + index + 1}
                  </td>

                  <td className="p-2 border">
                    <img
                      src={p.img_url}
                      alt={p.name}
                      className="h-12 w-12 object-cover"
                    />
                  </td>

                  <td className="border border-gray-300 p-2">
                    {p.name}
                    <br />
                    <small className="text-gray-500">#{p.category?.name}</small>
                  </td>

                  <td className="border border-gray-300 p-2">Rp. {Number(p.price).toLocaleString("id-ID")}</td>

                  <td className="border border-gray-300 p-2">{p.stock}</td>

                  <td className="space-x-2 border border-gray-300 p-2">
                    <Link
                      to={`/admin/edit-product/${p.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="cursor-pointer text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center border">
                  Produk tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. PAGINATION CONTROL */}
      <div className="flex justify-center items-center gap-4 mt-6">
        {/* TOMBOL SEBELUMNYA */}
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage <= 1}
          className="rounded bg-gray-200 px-4 py-2 text-sm disabled:opacity-50"
        >
          Sebelumnya
        </button>

        {/* NOMOR HALAMAN */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button key={page} onClick={() => setCurrentPage(page)} className={`rounded px-3 py-2 text-sm ${activePage === page ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
              {page}
            </button>
          ))}
        </div>

        {/* TOMBOL BERIKUTNYA */}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage >= totalPages}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}
