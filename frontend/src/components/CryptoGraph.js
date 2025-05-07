import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Common cryptocurrencies with USD pairing
const popularCryptos = [
  { symbol: 'BTC-USD', name: 'Bitcoin' },
  { symbol: 'ETH-USD', name: 'Ethereum' },
  { symbol: 'XRP-USD', name: 'Ripple' },
  { symbol: 'LTC-USD', name: 'Litecoin' },
  { symbol: 'ADA-USD', name: 'Cardano' },
  { symbol: 'DOT-USD', name: 'Polkadot' },
  { symbol: 'DOGE-USD', name: 'Dogecoin' },
  { symbol: 'SOL-USD', name: 'Solana' },
  { symbol: 'MATIC-USD', name: 'Polygon' },
  { symbol: 'LINK-USD', name: 'Chainlink' }
];

const CryptoGraph = () => {
  const [symbol, setSymbol] = useState('');
  const [marketData, setMarketData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!symbol.trim()) {
      setError('Please enter a cryptocurrency symbol');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Add USD suffix if not present
      const cryptoSymbol = symbol.toUpperCase().includes('-USD') 
        ? symbol.toUpperCase() 
        : `${symbol.toUpperCase()}-USD`;
      
      const response = await axios.get(`/api/crypto-data/${cryptoSymbol}`);
      setMarketData(response.data);
    } catch (err) {
      console.error('Error fetching cryptocurrency data:', err);
      setError(err.response?.data?.error || 'Failed to fetch cryptocurrency data');
      setMarketData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (cryptoSymbol) => {
    setSymbol(cryptoSymbol);
    // Submit the form programmatically
    handleSubmit({ preventDefault: () => {} });
  };

  const chartData = marketData ? {
    labels: marketData.data.map(item => item.date),
    datasets: [
      {
        label: 'Close Price',
        data: marketData.data.map(item => item.close),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Open Price',
        data: marketData.data.map(item => item.open),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
      {
        label: 'High',
        data: marketData.data.map(item => item.high),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.1,
        hidden: true
      },
      {
        label: 'Low',
        data: marketData.data.map(item => item.low),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
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
        text: marketData ? `${marketData.symbol} Price History` : 'Cryptocurrency Price History',
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
    <div className="crypto-graph-container">
      <h2>Cryptocurrency Market Data</h2>
      
      <form onSubmit={handleSubmit} className="crypto-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Crypto Symbol (e.g., BTC or BTC-USD)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="crypto-input"
          />
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Get Data'}
          </button>
        </div>
      </form>
      
      <div className="quick-select">
        <h4>Popular Cryptocurrencies:</h4>
        <div className="crypto-buttons">
          {popularCryptos.slice(0, 5).map(crypto => (
            <button 
              key={crypto.symbol}
              onClick={() => handleQuickSelect(crypto.symbol)}
              className="crypto-quick-btn"
            >
              {crypto.name}
            </button>
          ))}
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {marketData && (
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
          
          {marketData.data.length > 0 && (
            <div className="market-stats">
              <h3>Latest Data ({marketData.data[marketData.data.length - 1].date})</h3>
              
              {priceChange && (
                <div className="price-change">
                  <p className={`change-value ${priceChange.isPositive ? 'positive' : 'negative'}`}>
                    {priceChange.isPositive ? '↑' : '↓'} ${Math.abs(priceChange.change).toFixed(2)} ({priceChange.percentChange.toFixed(2)}%)
                  </p>
                </div>
              )}
              
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Open:</span>
                  <span className="stat-value">${Number(marketData.data[marketData.data.length - 1].open).toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Close:</span>
                  <span className="stat-value">${Number(marketData.data[marketData.data.length - 1].close).toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">High:</span>
                  <span className="stat-value">${Number(marketData.data[marketData.data.length - 1].high).toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Low:</span>
                  <span className="stat-value">${Number(marketData.data[marketData.data.length - 1].low).toFixed(2)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Volume:</span>
                  <span className="stat-value">{Number(marketData.data[marketData.data.length - 1].volume).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CryptoGraph; 