import React, { useState } from "react";
import { useProducts } from "../../utils/ProductContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// nama class ProductForm
export default function ProductForm() {
  // ambil fungsi addProduct dari context
  const { addProduct, getCategories } = useProducts();

  // mengosongkan state formData dan errors
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    minimum_stock: "5",
    category_id: "",
    description: "",
    img: null,
  });

  // mengosongkan state errors
  const [errors, setErrors] = useState({});

  // gunakan useNavigate untuk navigasi setelah submit
  const navigate = useNavigate();

  // fungsi untuk menangani perubahan input, dan memperbarui formData
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  // Validasi di browser agar pesan merah muncul sebelum request ke Laravel.
  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = ["Nama produk wajib diisi"];
    }
    if (!formData.category_id) {
      nextErrors.category_id = ["Kategori wajib dipilih"];
    }
    if (
      formData.price === "" ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      nextErrors.price = ["Harga produk wajib diisi"];
    }
    if (
      formData.stock === "" ||
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      nextErrors.stock = ["Stok produk wajib diisi"];
    }
    if (!(formData.img instanceof File)) {
      nextErrors.img = ["File harus berupa gambar"];
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setErrors({});

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        data.append(key, value);
      }
    });

    try {
      // panggil addProduct dan menyimpan response
      const response = await addProduct(data);

      // tampilkan notifikasi sukses
      toast.success("Produk berhasil disimpan!");
      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (error) {
      // menangkap
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        toast.error(" Periksa kembali data yang dimasukkan.");
      } else {
        toast.error(error.response?.data?.message || "Gagal menyimpan produk.");
      }
    }
  };

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
        {" "}
        Tambah Produk
      </h2>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Nama Produk
        </label>
        <input
          name="name"
          placeholder="Nama Produk"
          onChange={handleChange}
          className={`border rounded-md p-2 w-full ${
            errors.name ? "border-red-500" : ""
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Pilih Kategori
        </label>
        <select
          name="category_id"
          onChange={handleChange}
          value={formData.category_id}
          required
          className={`border rounded-md p-2 w-full ${
            errors.category_id ? "border-red-500" : "border-gray-300"
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
          min="0"
          required
          placeholder="Harga Produk"
          onChange={handleChange}
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
          min="0"
          required
          placeholder="Jumlah Stok"
          onChange={handleChange}
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
          rows="3"
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
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
          className={`rounded-lg border p-2 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-600 hover:file:bg-blue-200 ${
            errors.img ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.img && (
          <p className="text-red-500 text-sm mt-1">{errors.img[0]}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        Simpan Produk
      </button>
    </form>
  );
}
