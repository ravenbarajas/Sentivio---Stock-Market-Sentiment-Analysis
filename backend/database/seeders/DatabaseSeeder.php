<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Add some sample ETF symbols
        $this->createSymbols();
        
        // Add sample market price data to separate tables
        $this->createEtfData();
        $this->createStockData();
    }
    
    private function createSymbols()
    {
        // Clear existing data if there's any
        if(Schema::hasTable('symbols_valid_meta')) {
            DB::table('symbols_valid_meta')->truncate();
        }
        
        // Sample ETFs
        $etfs = [
            [
                'nasdaq_traded' => true,
                'symbol' => 'SPY',
                'security_name' => 'SPDR S&P 500 ETF Trust',
                'listing_exchange' => 'NYSE',
                'market_category' => 'ETF',
                'etf' => true,
                'round_lot_size' => 100,
                'test_issue' => false,
                'financial_status' => 'Normal',
                'cqs_symbol' => 'SPY',
                'nasdaq_symbol' => 'SPY',
                'nextshares' => false
            ],
            [
                'nasdaq_traded' => true,
                'symbol' => 'AAAU',
                'security_name' => 'Perth Mint Physical Gold ETF',
                'listing_exchange' => 'NYSE',
                'market_category' => 'ETF',
                'etf' => true,
                'round_lot_size' => 100,
                'test_issue' => false,
                'financial_status' => 'Normal',
                'cqs_symbol' => 'AAAU',
                'nasdaq_symbol' => 'AAAU',
                'nextshares' => false
            ],
            [
                'nasdaq_traded' => true,
                'symbol' => 'QQQ',
                'security_name' => 'Invesco QQQ Trust',
                'listing_exchange' => 'NASDAQ',
                'market_category' => 'ETF',
                'etf' => true,
                'round_lot_size' => 100,
                'test_issue' => false,
                'financial_status' => 'Normal',
                'cqs_symbol' => 'QQQ',
                'nasdaq_symbol' => 'QQQ',
                'nextshares' => false
            ],
        ];
        
        // Sample stocks
        $stocks = [
            [
                'nasdaq_traded' => true,
                'symbol' => 'AAPL',
                'security_name' => 'Apple Inc.',
                'listing_exchange' => 'NASDAQ',
                'market_category' => 'Q',
                'etf' => false,
                'round_lot_size' => 100,
                'test_issue' => false,
                'financial_status' => 'Normal',
                'cqs_symbol' => 'AAPL',
                'nasdaq_symbol' => 'AAPL',
                'nextshares' => false
            ],
            [
                'nasdaq_traded' => true,
                'symbol' => 'MSFT',
                'security_name' => 'Microsoft Corporation',
                'listing_exchange' => 'NASDAQ',
                'market_category' => 'Q',
                'etf' => false,
                'round_lot_size' => 100,
                'test_issue' => false,
                'financial_status' => 'Normal',
                'cqs_symbol' => 'MSFT',
                'nasdaq_symbol' => 'MSFT',
                'nextshares' => false
            ],
            [
                'nasdaq_traded' => true,
                'symbol' => 'AMZN',
                'security_name' => 'Amazon.com Inc.',
                'listing_exchange' => 'NASDAQ',
                'market_category' => 'Q',
                'etf' => false,
                'round_lot_size' => 100,
                'test_issue' => false,
                'financial_status' => 'Normal',
                'cqs_symbol' => 'AMZN',
                'nasdaq_symbol' => 'AMZN',
                'nextshares' => false
            ],
        ];
        
        // Insert data
        DB::table('symbols_valid_meta')->insert(array_merge($etfs, $stocks));
    }
    
    private function createEtfData()
    {
        // Clear existing data if there's any
        if(Schema::hasTable('etf_data')) {
            DB::table('etf_data')->truncate();
        }
        
        $etfSymbols = ['SPY', 'AAAU', 'QQQ'];
        $etfData = [];
        
        // Create 30 days of data for each ETF
        foreach ($etfSymbols as $symbol) {
            $basePrice = mt_rand(50, 500);
            
            for ($i = 0; $i < 30; $i++) {
                $date = Carbon::now()->subDays(30 - $i)->format('Y-m-d');
                
                // Generate random price movements
                $change = $basePrice * (mt_rand(-200, 200) / 10000); // -2% to 2% change
                $basePrice += $change;
                
                $open = $basePrice;
                $close = $basePrice + ($basePrice * (mt_rand(-100, 100) / 10000));
                $high = max($open, $close) + ($basePrice * (mt_rand(0, 100) / 10000));
                $low = min($open, $close) - ($basePrice * (mt_rand(0, 100) / 10000));
                
                $etfData[] = [
                    'Symbol' => $symbol,
                    'Date' => $date,
                    'Open' => round($open, 2),
                    'High' => round($high, 2),
                    'Low' => round($low, 2),
                    'Close' => round($close, 2),
                    'Adj Close' => round($close, 2),
                    'Volume' => mt_rand(1000000, 50000000)
                ];
            }
        }
        
        // Insert in chunks to avoid memory issues
        foreach (array_chunk($etfData, 100) as $chunk) {
            DB::table('etf_data')->insert($chunk);
        }
    }
    
    private function createStockData()
    {
        // Clear existing data if there's any
        if(Schema::hasTable('stock_data')) {
            DB::table('stock_data')->truncate();
        }
        
        $stockSymbols = ['AAPL', 'MSFT', 'AMZN'];
        $stockData = [];
        
        // Create 30 days of data for each stock
        foreach ($stockSymbols as $symbol) {
            $basePrice = mt_rand(50, 500);
            
            for ($i = 0; $i < 30; $i++) {
                $date = Carbon::now()->subDays(30 - $i)->format('Y-m-d');
                
                // Generate random price movements
                $change = $basePrice * (mt_rand(-200, 200) / 10000); // -2% to 2% change
                $basePrice += $change;
                
                $open = $basePrice;
                $close = $basePrice + ($basePrice * (mt_rand(-100, 100) / 10000));
                $high = max($open, $close) + ($basePrice * (mt_rand(0, 100) / 10000));
                $low = min($open, $close) - ($basePrice * (mt_rand(0, 100) / 10000));
                
                $stockData[] = [
                    'Symbol' => $symbol,
                    'Date' => $date,
                    'Open' => round($open, 2),
                    'High' => round($high, 2),
                    'Low' => round($low, 2),
                    'Close' => round($close, 2),
                    'Adj Close' => round($close, 2),
                    'Volume' => mt_rand(1000000, 50000000)
                ];
            }
        }
        
        // Insert in chunks to avoid memory issues
        foreach (array_chunk($stockData, 100) as $chunk) {
            DB::table('stock_data')->insert($chunk);
        }
    }
}
