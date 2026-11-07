import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "../../utils/ProductContext";

export default function StockMonitor() {
  const { getStockProducts } = useProducts();
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["stock-monitor", status, page],
    queryFn: () => getStockProducts({ status, page, limit: 10 }),
  });

  const products = data?.data ?? [];
  const summary = data?.summary ?? { low_stock: 0, normal_stock: 0 };
  const lastPage = data?.meta?.last_page ?? 1;

  return (
    <section className="rounded bg-white p-4 shadow">
      <h1 className="mb-4 text-xl font-bold">Monitoring Stok Produk</h1>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-gray-600">Stok Menipis</p>
          <p className="text-2xl font-bold text-red-700">{summary.low_stock}</p>
        </div>

        <div className="rounded border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-gray-600">Stok Aman</p>
          <p className="text-2xl font-bold text-green-700">
            {summary.normal_stock}
          </p>
        </div>
      </div>

      <label className="mb-4 flex max-w-sm flex-col gap-1">
        <span className="text-sm font-medium">Tampilkan produk</span>
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="rounded border p-2"
        >
          <option value="all">Semua stok</option>
          <option value="low">Stok menipis</option>
          <option value="normal">Stok aman</option>
        </select>
      </label>

      {isLoading && <p>Memuat data stok...</p>}
      {isError && <p className="text-red-600">Gagal memuat data stok.</p>}

      {!isLoading && !isError && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border p-2">Produk</th>
                  <th className="border p-2">Kategori</th>
                  <th className="border p-2">Stok</th>
                  <th className="border p-2">Batas Minimum</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {products.length > 0 ? (
                  products.map((product) => {
                    const lowStock =
                      product.stock <= product.minimum_stock;

                    return (
                      <tr key={product.id}>
                        <td className="border p-2">{product.name}</td>
                        <td className="border p-2">
                          {product.category?.name ?? "-"}
                        </td>
                        <td className="border p-2">{product.stock}</td>
                        <td className="border p-2">
                          {product.minimum_stock}
                        </td>
                        <td className="border p-2">
                          <span
                            className={`rounded px-2 py-1 text-xs font-semibold ${
                              lowStock
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {lowStock ? "Stok Menipis" : "Stok Aman"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="border p-4 text-center">
                      Tidak ada produk pada pilihan ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded bg-gray-200 px-3 py-2 disabled:opacity-50"
            >
              Sebelumnya
            </button>

            <span>
              Halaman {page} dari {lastPage}
            </span>

            <button
              onClick={() =>
                setPage((current) => Math.min(lastPage, current + 1))
              }
              disabled={page >= lastPage}
              className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        </>
      )}
    </section>
  );
}