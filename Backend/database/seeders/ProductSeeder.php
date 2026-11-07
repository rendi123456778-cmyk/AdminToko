<?php

namespace Database\Seeders;

use Faker\Guesser\Name;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
     DB::table('products')->insert([
        [
            'name' => 'Kipas Angin', 
            'slug' => Str::slug('Kipas Angin'), 
            'description' => 'Kipas Angin dapat membuat anda segar seharin di tengah terik nya matahari singaraja', 
            'category_id' => 1, 
            'price' => 100000, 
            'img' => 'products/kipas.jpg', 
            'stock' => 10, 
            'created_at' => now(), 
            'updated_at' => now(), 
        ],
        [
            'name' => 'Celana Jins', 
            'slug' => Str::slug('Celana Jins'), 
            'description' => 'celana ini bisa membuat anda makin ganteng seharian ', 
            'category_id' => 2, 
            'price' => 200000, 
            'img' => 'products/jins.jpg', 
            'stock' => 20, 
            'created_at' => now(), 
            'updated_at' => now(), 
        ],
        [
            'name' => 'Nasi Goreng + ES Teh', 
            'slug' => Str::slug('Nasi Goreng + ES Teh'), 
            'description' => 'membuat anda kenyang seharina di jaman gak bakal makan lagi', 
            'category_id' => 3, 
            'price' => 100000, 
            'img' => 'products/Nasi_Goreng.jpg', 
            'stock' => 10, 
            'created_at' => now(), 
            'updated_at' => now(), 
        ],
        [
            'name' => 'Bola Basket', 
            'slug' => Str::slug('Bola Basket'), 
            'description' => 'Olahraga basket memang keren', 
            'category_id' => 4, 
            'price' => 100000, 
            'img' => 'products/Basket.jpg', 
            'stock' => 10, 
            'created_at' => now(), 
            'updated_at' => now(), 
        ]
     ]);
    }
}
