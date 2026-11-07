import React, { useState, useEffect } from "react";
import { useProducts } from "../../utils/ProductContext";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// nama class ProductEdit
export default function ProductEdit() {
  const { id } = useParams();

  // ambil fungsi updateProduct dari context
  const { updateProduct, getProductById, getCategories } = useProducts();

  // mengosongkan state formData dan errors
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    minimum_stock: "",
    category_id: "",
    description: "",
    img: null,
  });

  // mengosongkan state errors
  const [errors, setErrors] = useState({});

  // gunakan useNavigate untuk navigasi setelah submit
  const navigate = useNavigate();

  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const categories = Array.isArray(categoriesResponse)
    ? categoriesResponse
    : (categoriesResponse?.data ?? []);

  // Ambil data produk berdasarkan ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setFormData({
          name: res.name || "",
          price: res.price || "",
          stock: res.stock || "",
          minimum_stock: res.minimum_stock ?? 5,
          description: res.description || "",
          category_id: res.category_id ?? res.category?.id ?? "",
          img: res.img_url || null,
        });
      } catch (err) {
        toast.error("Gagal memuat data produk.");
      }
    };
    fetchProduct();
    // getProductById diperoleh dari context dan dibuat stabil di ProductContext.
  }, [id, getProductById]);

  // fungsi untuk menangani perubahan input, dan memperbarui formData
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "img") {
        if (value instanceof File) data.append(key, value);
        return;
      }
      if (value !== null && value !== undefined) data.append(key, value);
    });

    try {
      console.log("Updating product with ID:", id);
      // panggil updateProduct dan menyimpan response
      const response = await updateProduct(id, data);

      if (response.status === 200) {
        toast.success("Produk berhasil diperbarui!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      // menangkap
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        toast.error(" Periksa kembali data yang dimasukkan.");
      } else {
        toast.error(" Gagal menyimpan produk.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
        {" "}
        Edit Produk
      </h2>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Nama Produk
        </label>
        <input
          name="name"
          placeholder="Nama Produk"
          onChange={handleChange}
          value={formData.name}
          className={`border rounded-md p-2 w-full ${
            errors.name ? "border-red-500" : ""
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="block font-medium text-gray-600 mb-1">
          {" "}
          Pilih Kategori
        </label>
        <select
          name="category_id"
          placeholder="ID Kategori"
          onChange={handleChange}
          value={formData.category_id}
          required
          className={`border rounded-md p-2 w-full ${
            errors.category_id ? "border-red-500" : ""
          }`}
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map((cat) => (
            <option
              key={cat.category_id ?? cat.id}
              value={cat.category_id ?? cat.id}
            >
              {cat.category ?? cat.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="text-red-500 text-sm mt-1">{errors.category_id[0]}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Harga</label>
        <input
          name="price"
          type="number"
          placeholder="Harga Produk"
          onChange={handleChange}
          value={formData.price}
          className={`border rounded-md p-2 w-full ${
            errors.price ? "border-red-500" : ""
          }`}
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price[0]}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">Stok</label>
        <input
          name="stock"
          type="number"
          placeholder="Jumlah Stok"
          onChange={handleChange}
          value={formData.stock}
          className={`border rounded-md p-2 w-full ${
            errors.stock ? "border-red-500" : ""
          }`}
        />
        {errors.stock && (
          <p className="text-red-500 text-sm mt-1">{errors.stock[0]}</p>
        )}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-600">
          Batas Minimum Stok
        </label>
        <input
          name="minimum_stock"
          type="number"
          min="0"
          required
          value={formData.minimum_stock}
          onChange={handleChange}
          placeholder="Contoh: 5"
          className="w-full rounded-md border p-2"
        />
        <small className="text-gray-500">
          Produk ditandai menipis jika stok sama dengan atau di bawah batas ini.
        </small>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Deskripsi
        </label>
        <textarea
          name="description"
          placeholder="Tuliskan deskripsi produk"
          onChange={handleChange}
          value={formData.description}
          rows="3"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      <div className="flex flex-col">
        {formData.img && (
          <img
            src={formData.img}
            alt="Preview produk"
            className="mt-2 h-32 w-32 rounded object-cover"
          />
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Gambar Produk
        </label>
        <input
          name="img"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-600 hover:file:bg-blue-200"
        />
        {errors.img && (
          <p className="text-red-500 text-sm mt-1">{errors.img[0]}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        Simpan Produk
      </button>
    </form>
  );
}
