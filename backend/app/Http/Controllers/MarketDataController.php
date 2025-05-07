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
            ->where('etf', true)
            ->exists();

        if (!$isEtf) {
            return response()->json(['error' => 'Symbol is not an ETF'], 400);
        }

        // Get data from the dedicated ETF table
        $marketData = DB::table('etf_data')
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
                $query->where('etf', false)->orWhereNull('etf');
            })
            ->exists();

        if (!$isStock) {
            return response()->json(['error' => 'Symbol is not a stock'], 400);
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

        $marketData = collect();

        // Check if it's an ETF or a stock and query the appropriate table
        if ($symbolInfo->etf) {
            $marketData = DB::table('etf_data')
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
        } else {
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
        }

        if ($marketData->isEmpty()) {
            return response()->json(['error' => 'No market data found for this symbol'], 404);
        }

        return response()->json([
            'symbol' => $symbol,
            'security_name' => $symbolInfo->security_name ?? null,
            'is_etf' => $symbolInfo->etf ?? false,
            'data' => $marketData
        ]);
    }
} 