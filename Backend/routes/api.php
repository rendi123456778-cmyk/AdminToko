<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
// Kategori dibutuhkan oleh form tambah/edit dan filter produk admin.
Route::get('/categories', [CategoryController::class, 'index'])->middleware('auth:sanctum');
// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::get('/products/stock-monitor', [ProductController::class, 'stockMonitor'])
    ->middleware('auth:sanctum');
// Tambahkan Product routes with sanctum auth middleware
Route::apiResource('products', ProductController::class)
    ->middleware('auth:sanctum');
