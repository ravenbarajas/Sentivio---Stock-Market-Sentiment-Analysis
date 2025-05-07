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

const StockGraph = () => {
  const [symbol, setSymbol] = useState('');
  const [marketData, setMarketData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="stock-graph-container">
      <h2>Stock Market Data Chart</h2>
      
      <form onSubmit={handleSubmit} className="stock-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Stock Symbol (e.g., AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="stock-input"
          />
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Get Data'}
          </button>
        </div>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      {marketData && (
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
          
          {marketData.data.length > 0 && (
            <div className="market-stats">
              <h3>Latest Data ({marketData.data[marketData.data.length - 1].date})</h3>
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

export default StockGraph; 