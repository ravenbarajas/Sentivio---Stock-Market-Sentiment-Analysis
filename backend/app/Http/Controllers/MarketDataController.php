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

    public function getStockData($symbol)
    {
        // Verify that the symbol is a stock (not an ETF)
        $isStock = DB::table('symbols_valid_meta')
            ->where('symbol', $symbol)
            ->where(function($query) {
                $query->where('is_etf', false)->orWhereNull('is_etf');
            })
            ->exists();

        if (!$isStock) {
            return response()->json(['error' => 'Symbol is not a stock'], 400);
        }

        // Get market data for the stock
        $marketData = DB::table('market_price')
            ->where('symbol', $symbol)
            ->where(function($query) {
                $query->where('is_etf', false)->orWhereNull('is_etf');
            })
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
            return response()->json(['error' => 'No data found for this stock'], 404);
        }

        return response()->json([
            'symbol' => $symbol,
            'data' => $marketData
        ]);
    }

    public function getCryptoData($symbol)
    {
        // For cryptocurrencies, we'll use a format like BTC-USD or ETH-USD
        // Extract the crypto symbol from the format
        $cryptoSymbol = explode('-', $symbol)[0];
        
        // Get market data for the cryptocurrency
        $marketData = DB::table('market_price')
            ->where('symbol', $symbol)
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
            return response()->json(['error' => 'No data found for this cryptocurrency'], 404);
        }

        return response()->json([
            'symbol' => $symbol,
            'crypto_symbol' => $cryptoSymbol,
            'data' => $marketData
        ]);
    }

    // This is a general method that can handle both stocks and ETFs
    public function getMarketData($symbol)
    {
        // Get symbol information
        $symbolInfo = DB::table('symbols_valid_meta')
            ->where('symbol', $symbol)
            ->first();

        if (!$symbolInfo) {
            return response()->json(['error' => 'Symbol not found'], 400);
        }

        // Get market data for the symbol
        $marketData = DB::table('market_price')
            ->where('symbol', $symbol)
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
            return response()->json(['error' => 'No market data found for this symbol'], 404);
        }

        return response()->json([
            'symbol' => $symbol,
            'security_name' => $symbolInfo->security_name ?? null,
            'is_etf' => $symbolInfo->is_etf ?? false,
            'data' => $marketData
        ]);
    }
} 