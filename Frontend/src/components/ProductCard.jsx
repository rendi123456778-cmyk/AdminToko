import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ p }) {
  //gunakan useCart disini
  const { addToCart } = useCart();

  return (
    <div key={p.id} className="border rounded-lg p-4 shadow hover:shadow-lg">
      <h2 className="font-semibold">{p.name}</h2>
      <p className="text-gray-600">{p.price}</p>
      {/* <Link 
              to={`/product/${p.slug}`} 
              className="text-blue-600 hover:underline mt-2 block" 
            > */}

      <Link
        //update di bagian ini dengan menambahkan state = {p} untuk mengirim objek product ke halaman detail
        to={`/product/${p.slug}`}
        state={p}
        className="text-blue-600 hover:underline mt-2 block"
      >
        Lihat Detail
      </Link>

      {/* Tambahkan fungsi add to cart disini */}
      <button
        onClick={() => addToCart(p)}
        className="mt-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
      >
        Add to Cart
      </button>
    </div>
  );
}
