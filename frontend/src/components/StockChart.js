import React, { useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockChart = () => {
  const [symbol, setSymbol] = useState('');
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/stock-data/${symbol.toUpperCase()}`);
      setMarketData(response.data);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err.response?.data?.error || 'Failed to fetch stock data');
      setMarketData(null);
    } finally {
      setLoading(false);
    }
  };

  const chartData = marketData ? {
    labels: marketData.data.map(item => item.date),
    datasets: [
      {
        label: 'Close Price',
        data: marketData.data.map(item => item.close),
        borderColor: 'var(--chart-primary)',
        backgroundColor: 'var(--chart-primary-transparent)',
        tension: 0.1,
      },
      {
        label: 'Open Price',
        data: marketData.data.map(item => item.open),
        borderColor: 'var(--chart-secondary)',
        backgroundColor: 'var(--chart-secondary-transparent)',
        tension: 0.1,
      },
      {
        label: 'High',
        data: marketData.data.map(item => item.high),
        borderColor: 'var(--chart-tertiary)',
        backgroundColor: 'var(--chart-tertiary-transparent)',
        tension: 0.1,
        hidden: true
      },
      {
        label: 'Low',
        data: marketData.data.map(item => item.low),
        borderColor: 'var(--chart-quaternary)',
        backgroundColor: 'var(--chart-quaternary-transparent)',
        tension: 0.1,
        hidden: true
      }
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: marketData ? `${marketData.symbol} Price History` : 'Stock Price History',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Price ($)'
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  // Popular stocks for quick selection
  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Google' },
    { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'TSLA', name: 'Tesla' },
  ];

  const handleQuickSelect = (stockSymbol) => {
    setSymbol(stockSymbol);
    // Submit the form programmatically
    handleSubmitWithSymbol(stockSymbol);
  };

  const handleSubmitWithSymbol = async (stockSymbol) => {
    if (!stockSymbol.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/stock-data/${stockSymbol.toUpperCase()}`);
      setMarketData(response.data);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err.response?.data?.error || 'Failed to fetch stock data');
      setMarketData(null);
    } finally {
      setLoading(false);
    }
  };

  const calculatePriceChange = () => {
    if (!marketData || !marketData.data || marketData.data.length < 2) return null;
    
    const latestPrice = parseFloat(marketData.data[marketData.data.length - 1].close);
    const firstPrice = parseFloat(marketData.data[0].close);
    
    const change = latestPrice - firstPrice;
    const percentChange = (change / firstPrice) * 100;
    
    return {
      change,
      percentChange,
      isPositive: change >= 0
    };
  };

  const priceChange = calculatePriceChange();

  return (
    <div className="stock-chart">
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="card-title">Stock Market Data</h2>
          <p className="card-description">Enter a stock symbol to view historical market data</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="input"
            />
            <button 
              type="submit" 
              className={`button ${loading ? 'button-disabled' : 'button-primary'}`}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Data'}
            </button>
          </form>

          <div className="quick-select mb-4">
            <h4 className="mb-2">Popular Stocks:</h4>
            <div className="flex flex-wrap gap-2">
              {popularStocks.map(stock => (
                <button 
                  key={stock.symbol}
                  onClick={() => handleQuickSelect(stock.symbol)}
                  className="button button-outline"
                  disabled={loading}
                >
                  {stock.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="error-message p-2 mb-4" style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              color: 'var(--destructive)',
              borderRadius: 'var(--radius)',
              padding: '0.75rem 1rem'
            }}>
              {error}
            </div>
          )}

          {marketData && marketData.data && marketData.data.length > 0 && (
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
              
              <div className="market-stats mt-4 card p-4">
                <h3 className="card-title">Latest Data ({marketData.data[marketData.data.length - 1].date})</h3>
                
                {priceChange && (
                  <div className="price-change text-center mb-4">
                    <span className={`change-value p-2 ${priceChange.isPositive ? 'positive' : 'negative'}`} style={{ 
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius)',
                      backgroundColor: priceChange.isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: priceChange.isPositive ? 'var(--positive)' : 'var(--negative)',
                      fontWeight: 500
                    }}>
                      {priceChange.isPositive ? '↑' : '↓'} ${Math.abs(priceChange.change).toFixed(2)} ({priceChange.percentChange.toFixed(2)}%)
                    </span>
                  </div>
                )}
                
                <div className="stats-grid grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="stat-item p-2" style={{ 
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'var(--card-background)',
                    border: '1px solid var(--border)',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div className="stat-label" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Open</div>
                    <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 600 }}>${Number(marketData.data[marketData.data.length - 1].open).toFixed(2)}</div>
                  </div>
                  <div className="stat-item p-2" style={{ 
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'var(--card-background)',
                    border: '1px solid var(--border)',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div className="stat-label" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Close</div>
                    <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 600 }}>${Number(marketData.data[marketData.data.length - 1].close).toFixed(2)}</div>
                  </div>
                  <div className="stat-item p-2" style={{ 
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'var(--card-background)',
                    border: '1px solid var(--border)',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div className="stat-label" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>High</div>
                    <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 600 }}>${Number(marketData.data[marketData.data.length - 1].high).toFixed(2)}</div>
                  </div>
                  <div className="stat-item p-2" style={{ 
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'var(--card-background)',
                    border: '1px solid var(--border)',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div className="stat-label" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Low</div>
                    <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 600 }}>${Number(marketData.data[marketData.data.length - 1].low).toFixed(2)}</div>
                  </div>
                  <div className="stat-item p-2" style={{ 
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'var(--card-background)',
                    border: '1px solid var(--border)',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div className="stat-label" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>Volume</div>
                    <div className="stat-value" style={{ fontSize: '1.25rem', fontWeight: 600 }}>{Number(marketData.data[marketData.data.length - 1].volume).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockChart; 