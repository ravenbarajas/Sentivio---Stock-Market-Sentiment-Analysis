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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/etf-data/{symbol}', [MarketDataController::class, 'getEtfData']);
Route::get('/stock-data/{symbol}', [MarketDataController::class, 'getStockData']);
Route::get('/crypto-data/{symbol}', [MarketDataController::class, 'getCryptoData']);
Route::get('/market-data/{symbol}', [MarketDataController::class, 'getMarketData']);
