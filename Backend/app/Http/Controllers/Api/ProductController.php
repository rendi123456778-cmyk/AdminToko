<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /** 
     * Display a listing of the resource. 
     */
    public function index(Request $request)
    {
        $request->validate([
            'keyword' => 'nullable|string|max:150',
            'category_id' => 'nullable|integer|exists:categories,category_id',
            'limit' => 'nullable|integer|min:1|max:100',
        ]);

        $products = Product::with('category')
            ->when($request->filled('keyword'), function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->string('keyword') . '%');
            })
            ->when($request->filled('category_id'), function ($query) use ($request) {
                $query->where('category_id', $request->integer('category_id'));
            })
            ->orderByDesc('product_id')
            ->paginate($request->integer('limit', 10));

        return ProductResource::collection($products);
    }

    /** 
     * Store a newly created resource in storage. 
     */
    public function store(Request $request)
    {
        // Validate the request
        $request->validate(
            [
                'name'        => 'required|string|max:150',
                'description' => 'nullable|string',
                'category_id' => 'required|exists:categories,category_id',
                'price'       => 'required|numeric|min:0',
                'stock'       => 'required|integer|min:0',
                'minimum_stock' => 'required|integer|min:0',
                'img'         => 'required|image|mimes:jpg,jpeg,png|max:2048',
            ],
            [
                'name.required' => 'Nama produk wajib diisi.',
                'category_id.required' => 'Kategori wajib dipilih.',
                'category_id.exists' => 'Kategori yang dipilih tidak tersedia.',
                'price.required' => 'Harga produk wajib diisi.',
                'price.min' => 'Harga produk tidak boleh kurang dari 0.',
                'stock.required' => 'Stok produk wajib diisi.',
                'stock.integer' => 'Stok harus berupa bilangan bulat.',
                'stock.min' => 'Stok tidak boleh kurang dari 0.',
                'img.required' => 'Gambar produk wajib dipilih.',
                'img.image' => 'File harus berupa gambar.',
                'img.mimes' => 'Format gambar harus JPG, JPEG, atau PNG.',
                'img.max' => 'Ukuran gambar maksimal 2 MB.',
            ]
        );

        // Initialize image path
        $path = "";

        // Mengambil file image dari request img
        if ($request->hasFile('img')) {
            // Menyimpan file image ke storage pada folder products di disk public
            $path = $request->file('img')->store('products', 'public');
        }

        // Create the product
        $product = Product::create([
            'name'        => $request->name,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'price'       => $request->price,
            'stock'       => $request->stock,
            'minimum_stock' => $request->minimum_stock,
            // Hanya menyimpan path image ke database
            'img'         => $path,
            'slug'        => Str::slug($request->name), // Generate slug from name
        ]);

        return new ProductResource($product);
    }
    /** 
     * Display the specified resource. 
     */
    public function show(string $id)
    {
        // Get product by ID with its category 
        $product = Product::with('category')->findOrFail($id);


        return new ProductResource($product);
    }

    /** 
     * Update the specified resource in storage. 
     */
    public function update(Request $request, string $id)
    {
        // Find the product 
        $product = Product::findOrFail($id);
        // Validate the request 
        // Validate the request 
        $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,category_id',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'minimum_stock' => 'required|integer|min:0',
            'img' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);
        $imagePath = $product->img;
        if ($request->hasFile('img')) {
            $imagePath = $request->file('img')->store('products', 'public');
        }
        // Update the product 
        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'price' => $request->price,
            'stock' => $request->stock,
            'minimum_stock' => $request->minimum_stock,
            'img' => $imagePath,
            'slug' => Str::slug($request->name) // Generate slug from name 
        ]);

        return new ProductResource($product);
    }

    /** 
     * Remove the specified resource from storage. 
     */
    public function destroy(string $id)
    {
        // Find and delete the product 
        $product = Product::find($id);
        if ($product != null) {
            $product->delete();
            return response()->json(['message' => 'Product deleted 
successfully']);
        }
        // Return a success response 
        return response()->json(['message' => 'Product not found'], 404);
    }
    public function stockMonitor(Request $request)
    {
        $request->validate([
            'status' => 'nullable|in:all,low,normal',
            'limit' => 'nullable|integer|min:1|max:100',
        ]);

        $status = $request->input('status', 'all');

        $products = Product::with('category')
            ->when($status === 'low', function ($query) {
                $query->whereColumn('stock', '<=', 'minimum_stock');
            })
            ->when($status === 'normal', function ($query) {
                $query->whereColumn('stock', '>', 'minimum_stock');
            })
            ->orderBy('stock')
            ->paginate($request->integer('limit', 10));

        $lowCount = Product::whereColumn('stock', '<=', 'minimum_stock')->count();
        $normalCount = Product::whereColumn('stock', '>', 'minimum_stock')->count();

        return \App\Http\Resources\ProductResource::collection($products)
            ->additional([
                'summary' => [
                    'low_stock' => $lowCount,
                    'normal_stock' => $normalCount,
                ],
            ]);
    }
}
