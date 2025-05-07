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

const EtfGraph = () => {
  const [symbol, setSymbol] = useState('');
  const [marketData, setMarketData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!symbol.trim()) {
      setError('Please enter an ETF symbol');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/etf-data/${symbol.toUpperCase()}`);
      console.log('ETF data response:', response.data);
      
      if (!response.data || !response.data.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
        setError('No valid data received for this ETF');
        setMarketData(null);
      } else {
        setMarketData(response.data);
      }
    } catch (err) {
      console.error('Error fetching ETF data:', err);
      setError(err.response?.data?.error || 'Failed to fetch ETF data');
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
        data: marketData.data.map(item => parseFloat(item.close) || 0),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Open Price',
        data: marketData.data.map(item => parseFloat(item.open) || 0),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
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
        text: marketData ? `${marketData.symbol} Price History` : 'ETF Price History',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Price ($)'
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
    <div className="etf-graph-container">
      <h2>ETF Market Data Chart</h2>
      
      <form onSubmit={handleSubmit} className="etf-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter ETF Symbol (e.g., SPY)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="etf-input"
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
        </div>
      )}
    </div>
  );
};

export default EtfGraph; 