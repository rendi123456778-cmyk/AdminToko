// import { Link } from "react-router-dom";
import { products } from "../../utils/data";
import ProductCard from "../../components/ProductCard";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Produk</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* {[1, 2, 3].map((id) => ( 

          //salin blok kode ini dan pindahkan ke product card
          <div key={id} className="border rounded-lg p-4 shadow hover:shadow-lg"> 
            <h2 className="font-semibold">Produk {id}</h2> 
            <p className="text-gray-600">Deskripsi singkat produk {id}</p> 
            <Link 
              to={`/product/${id}`} 
              className="text-blue-600 hover:underline mt-2 block" 
            > 
              Lihat Detail
            </Link> 
          </div>

        ))}  */}

        {/* blok kode di atas bisa diedit menjadi berikut */}
        {products.map((item) => (
          //p adalah props untuk mengirim data produk ke komponen ProductCard
          <ProductCard p={item} />
        ))}
      </div>
    </div>
  );
}
