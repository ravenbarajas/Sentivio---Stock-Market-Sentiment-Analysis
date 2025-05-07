<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MarketDataController extends Controller
{
    public function getEtfData($symbol)
    {
        // Verify that the symbol is an ETF
        $isEtf = DB::table('symbols_valid_meta')
            ->where('symbol', $symbol)
            ->where('is_etf', true)
            ->exists();

        if (!$isEtf) {
            return response()->json(['error' => 'Symbol is not an ETF'], 400);
        }

        // Get market data for the ETF
        $marketData = DB::table('market_price')
            ->where('symbol', $symbol)
            ->where('is_etf', true)
            ->orderBy('date')
            ->get([
                'date',
                'open',
                'high',
                'low',
                'close',
                'adj_close',
                'volume'
            ]);

        if ($marketData->isEmpty()) {
            return response()->json(['error' => 'No data found for this ETF'], 404);
        }

        return response()->json([
            'symbol' => $symbol,
            'data' => $marketData
        ]);
    }
} 