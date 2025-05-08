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
import { useTheme } from './ui/ThemeProvider';

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
  const { theme } = useTheme();
  
  // Determine if using dark mode
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Theme-based colors
  const colors = {
    text: isDarkMode ? '#e4e4e7' : '#212529',
    mutedText: isDarkMode ? '#a1a1aa' : '#6c757d',
    background: isDarkMode ? '#18181b' : '#fff',
    cardBackground: isDarkMode ? '#27272a' : '#fff',
    cardHeaderBackground: isDarkMode ? '#3f3f46' : '#f8f9fa',
    border: isDarkMode ? '#3f3f46' : '#e9ecef',
    primary: '#007bff',
    primaryDark: '#0056b3',
    buttonText: '#fff',
    dangerText: isDarkMode ? '#f87171' : '#dc3545',
    successText: isDarkMode ? '#4ade80' : '#198754',
    chartClose: '#28a745',
    chartOpen: '#007bff',
    chartHigh: '#ffc107',
    chartLow: '#dc3545',
  };

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
        borderColor: colors.chartClose,
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        borderWidth: 0.5,
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: 'Open Price',
        data: marketData.data.map(item => item.open),
        borderColor: colors.chartOpen,
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        borderWidth: 0.5,
        tension: 0.1,
        pointRadius: 0,
      },
      {
        label: 'High',
        data: marketData.data.map(item => item.high),
        borderColor: colors.chartHigh,
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        borderWidth: 0.5,
        tension: 0.1,
        hidden: true,
        pointRadius: 0,
      },
      {
        label: 'Low',
        data: marketData.data.map(item => item.low),
        borderColor: colors.chartLow,
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        borderWidth: 0.5,
        tension: 0.1,
        hidden: true,
        pointRadius: 0,
      }
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: colors.text
        }
      },
      title: {
        display: true,
        text: marketData ? `${marketData.symbol} Price History` : 'Stock Price History',
        color: colors.text
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
          text: 'Price ($)',
          color: colors.text
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          },
          color: colors.text
        },
        grid: {
          color: colors.border
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          color: colors.text
        },
        ticks: {
          color: colors.text
        },
        grid: {
          color: colors.border
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
    <div style={{ 
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: colors.text,
      backgroundColor: 'transparent'
    }}>
      <div style={{ 
        borderRadius: '8px',
        boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        overflow: 'hidden',
        marginBottom: '2rem',
        backgroundColor: colors.background
      }}>
        <div style={{ 
          padding: '1.5rem',
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.cardHeaderBackground
        }}>
          <h2 style={{ 
            margin: '0 0 0.5rem 0',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: colors.text
          }}>Stock Market Data</h2>
          <p style={{ 
            margin: '0',
            fontSize: '0.875rem',
            color: colors.mutedText
          }}>Enter a stock symbol to view historical market data</p>
        </div>
        <div style={{ padding: '1.5rem', backgroundColor: colors.cardBackground }}>
          <form onSubmit={handleSubmit} style={{ 
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem' 
          }}>
            <input
              type="text"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              style={{ 
                flex: '1',
                padding: '0.5rem 0.75rem',
                fontSize: '1rem',
                borderRadius: '4px',
                border: `1px solid ${colors.border}`,
                outline: 'none',
                backgroundColor: isDarkMode ? '#3f3f46' : '#fff',
                color: colors.text
              }}
            />
            <button 
              type="submit" 
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: loading ? (isDarkMode ? '#52525b' : '#6c757d') : colors.primary,
                color: colors.buttonText,
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? '0.65' : '1'
              }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Data'}
            </button>
          </form>

          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ 
              margin: '0 0 0.5rem 0',
              fontSize: '1rem',
              fontWeight: '600',
              color: colors.text
            }}>Popular Stocks:</h4>
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              {popularStocks.map(stock => (
                <button 
                  key={stock.symbol}
                  onClick={() => handleQuickSelect(stock.symbol)}
                  style={{ 
                    padding: '0.375rem 0.75rem',
                    border: `1px solid ${colors.primary}`,
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    color: colors.primary,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? '0.65' : '1',
                    fontSize: '0.875rem'
                  }}
                  disabled={loading}
                >
                  {stock.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ 
              backgroundColor: isDarkMode ? 'rgba(248, 113, 113, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
              color: colors.dangerText,
              borderRadius: '4px',
              padding: '0.75rem 1rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {marketData && marketData.data && marketData.data.length > 0 && (
            <div style={{ width: '100%' }}>
              <Line data={chartData} options={chartOptions} />
              
              <div style={{ 
                marginTop: '1.5rem',
                padding: '1.5rem',
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.cardHeaderBackground
              }}>
                <h3 style={{ 
                  margin: '0 0 1rem 0',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: colors.text
                }}>Latest Data ({marketData.data[marketData.data.length - 1].date})</h3>
                
                {priceChange && (
                  <div style={{ 
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      backgroundColor: priceChange.isPositive 
                        ? (isDarkMode ? 'rgba(74, 222, 128, 0.1)' : 'rgba(34, 197, 94, 0.1)') 
                        : (isDarkMode ? 'rgba(248, 113, 113, 0.1)' : 'rgba(239, 68, 68, 0.1)'),
                      color: priceChange.isPositive ? colors.successText : colors.dangerText,
                      fontWeight: 500
                    }}>
                      {priceChange.isPositive ? '↑' : '↓'} ${Math.abs(priceChange.change).toFixed(2)} ({priceChange.percentChange.toFixed(2)}%)
                    </span>
                  </div>
                )}
                
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                  '@media (min-width: 768px)': {
                    gridTemplateColumns: 'repeat(5, 1fr)',
                  }
                }}>
                  <div style={{ 
                    borderRadius: '4px',
                    backgroundColor: colors.cardBackground,
                    border: `1px solid ${colors.border}`,
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: colors.mutedText, marginBottom: '0.25rem' }}>Open</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.text }}>${Number(marketData.data[marketData.data.length - 1].open).toFixed(2)}</div>
                  </div>
                  <div style={{ 
                    borderRadius: '4px',
                    backgroundColor: colors.cardBackground,
                    border: `1px solid ${colors.border}`,
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: colors.mutedText, marginBottom: '0.25rem' }}>Close</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.text }}>${Number(marketData.data[marketData.data.length - 1].close).toFixed(2)}</div>
                  </div>
                  <div style={{ 
                    borderRadius: '4px',
                    backgroundColor: colors.cardBackground,
                    border: `1px solid ${colors.border}`,
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: colors.mutedText, marginBottom: '0.25rem' }}>High</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.text }}>${Number(marketData.data[marketData.data.length - 1].high).toFixed(2)}</div>
                  </div>
                  <div style={{ 
                    borderRadius: '4px',
                    backgroundColor: colors.cardBackground,
                    border: `1px solid ${colors.border}`,
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: colors.mutedText, marginBottom: '0.25rem' }}>Low</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.text }}>${Number(marketData.data[marketData.data.length - 1].low).toFixed(2)}</div>
                  </div>
                  <div style={{ 
                    borderRadius: '4px',
                    backgroundColor: colors.cardBackground,
                    border: `1px solid ${colors.border}`,
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: colors.mutedText, marginBottom: '0.25rem' }}>Volume</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: colors.text }}>{Number(marketData.data[marketData.data.length - 1].volume).toLocaleString()}</div>
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