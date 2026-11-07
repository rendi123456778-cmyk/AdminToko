import { useCart } from "../../context/CartContext";

export default function Cart() {
  // Mengambil cart, updateQty, removeFromCart dari context useCart
  const { cart, updateQty, removeFromCart } = useCart();

  if (cart.length === 0) {
    return <div className="p-6 text-center text-gray-600">Cart is empty</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="space-y-4">
        {/* Menampilkan item di cart */}
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border p-4 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.img}
                alt={item.name}
                className="w-16 h-16 rounded-md"
              />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">Rp{item.price.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Input untuk update qty */}
              <input
                type="number"
                value={item.qty}
                min="1"
                className="w-16 border rounded text-center"
                onChange={(e) => updateQty(item.id, parseInt(e.target.value))}
              />
              {/* Button untuk remove item dari cart */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
