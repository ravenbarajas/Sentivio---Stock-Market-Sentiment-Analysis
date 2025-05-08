<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MarketDataController extends Controller
{
    public function getStockData($symbol)
    {
        // Verify that the symbol is a stock
        $isStock = DB::table('symbols_valid_meta')
            ->where('symbol', $symbol)
            ->exists();

        if (!$isStock) {
            return response()->json(['error' => 'Symbol not found'], 400);
        }

        // Get data from the dedicated stock table
        $marketData = DB::table('stock_data')
            ->where('Symbol', $symbol)
            ->orderBy('Date')
            ->get([
                'Date as date',
                'Open as open',
                'High as high',
                'Low as low',
                'Close as close',
                'Adj Close as adj_close',
                'Volume as volume'
            ]);

        if ($marketData->isEmpty()) {
            return response()->json(['error' => 'No data found for this stock'], 404);
        }

        return response()->json([
            'symbol' => $symbol,
            'data' => $marketData
        ]);
    }

    // This is a general method that handles stocks
    public function getMarketData($symbol)
    {
        // Get symbol information
        $symbolInfo = DB::table('symbols_valid_meta')
            ->where('symbol', $symbol)
            ->first();

        if (!$symbolInfo) {
            return response()->json(['error' => 'Symbol not found'], 400);
        }

        $marketData = DB::table('stock_data')
            ->where('Symbol', $symbol)
            ->orderBy('Date')
            ->get([
                'Date as date',
                'Open as open',
                'High as high',
                'Low as low',
                'Close as close',
                'Adj Close as adj_close',
                'Volume as volume'
            ]);

        if ($marketData->isEmpty()) {
            return response()->json(['error' => 'No market data found for this symbol'], 404);
        }

        return response()->json([
            'symbol' => $symbol,
            'security_name' => $symbolInfo->security_name ?? null,
            'data' => $marketData
        ]);
    }
} 