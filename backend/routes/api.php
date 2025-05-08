<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MarketDataController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Enable CORS for all API routes
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization, Accept, X-Requested-With');

// User routes
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Stock data routes
Route::get('/stock-data/{symbol}', [MarketDataController::class, 'getStockData']);
Route::get('/market-data/{symbol}', [MarketDataController::class, 'getMarketData']);

// Add a health check endpoint
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});
