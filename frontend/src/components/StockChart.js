import React, { useState, useEffect } from 'react';
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
  
  // New state for selected data point
  const [selectedDateData, setSelectedDateData] = useState(null);
  
  // New state to manage dataset visibility
  const [datasetVisibility, setDatasetVisibility] = useState({
    'Close Price': true,
    'Open Price': true,
    'High': false, // Initially hidden
    'Low': false,  // Initially hidden
    // Volume is not a line dataset in this chart, so not included here for toggling
  });
  
  // Popular stocks for quick selection
  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Google' },
    { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'TSLA', name: 'Tesla' },
  ];

  const [popularStockDetails, setPopularStockDetails] = useState([]);
  const [popularStocksLoading, setPopularStocksLoading] = useState(false);
  const [popularStocksError, setPopularStocksError] = useState(null);
  
  // Determine if using dark mode
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Theme-based colors
  const colors = {
    text: isDarkMode ? '#e4e4e7' : '#212529',
    mutedText: isDarkMode ? '#a1a1aa' : '#6c757d',
    background: isDarkMode ? '#18181b' : '#fff',
    cardBackground: isDarkMode ? '#1a1a1a' : '#fff',
    cardHeaderBackground: isDarkMode ? '#1a1a1a' : '#f8f9fa',
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

  useEffect(() => {
    const fetchPopularStockDetails = async () => {
      setPopularStocksLoading(true);
      setPopularStocksError(null);
      const detailsPromises = popularStocks.map(async (stock) => {
        try {
          const response = await axios.get(`/api/stock-data/${stock.symbol.toUpperCase()}`);
          if (response.data && response.data.data && response.data.data.length > 0) {
            const stockData = response.data.data;
            const latestEntry = stockData[stockData.length - 1];
            const currentPrice = parseFloat(latestEntry.close);
            let change = null;
            let percentChange = null;
            let isPositive = null;

            if (stockData.length > 1) {
              const previousEntry = stockData[stockData.length - 2];
              const previousClose = parseFloat(previousEntry.close);
              if (previousClose !== 0) {
                change = currentPrice - previousClose;
                percentChange = (change / previousClose) * 100;
              }
            } else if (stockData.length === 1) {
              const openPrice = parseFloat(latestEntry.open);
              if (latestEntry.open !== undefined && openPrice !== 0) {
                change = currentPrice - openPrice;
                percentChange = (change / openPrice) * 100;
              }
            }
            
            if (change !== null) {
              isPositive = change >= 0;
            }

            return {
              ...stock,
              currentPrice,
              change,
              percentChange,
              isPositive,
              error: false,
            };
          } else {
            return { ...stock, currentPrice: null, change: null, percentChange: null, error: 'No data returned' };
          }
        } catch (err) {
          console.error(`Failed to fetch data for ${stock.symbol}`, err);
          return { ...stock, currentPrice: null, change: null, percentChange: null, error: true };
        }
      });
      
      const results = await Promise.all(detailsPromises);
      setPopularStockDetails(results);
      setPopularStocksLoading(false);
    };

    fetchPopularStockDetails();
  }, []); // `popularStocks` is stable, so run once on mount.

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
      // Initialize selected data to the latest data point
      if (response.data && response.data.data && response.data.data.length > 0) {
        setSelectedDateData(response.data.data[response.data.data.length - 1]);
      } else {
        setSelectedDateData(null);
      }
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err.response?.data?.error || 'Failed to fetch stock data');
      setMarketData(null);
      setSelectedDateData(null);
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
        hidden: !datasetVisibility['Close Price'], // Link visibility to state
      },
      {
        label: 'Open Price',
        data: marketData.data.map(item => item.open),
        borderColor: colors.chartOpen,
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        borderWidth: 0.5,
        tension: 0.1,
        pointRadius: 0,
        hidden: !datasetVisibility['Open Price'], // Link visibility to state
      },
      {
        label: 'High',
        data: marketData.data.map(item => item.high),
        borderColor: colors.chartHigh,
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        borderWidth: 0.5,
        tension: 0.1,
        hidden: !datasetVisibility['High'], // Link visibility to state
        pointRadius: 0,
      },
      {
        label: 'Low',
        data: marketData.data.map(item => item.low),
        borderColor: colors.chartLow,
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        borderWidth: 0.5,
        tension: 0.1,
        hidden: !datasetVisibility['Low'], // Link visibility to state
        pointRadius: 0,
      }
      // Volume is not a line dataset in this chart
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: colors.text
        },
        // Disable default legend click behavior
        onClick: (e) => e.stopPropagation() // Stop the event from triggering default Chart.js toggle
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
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const dataIndex = elements[0].index;
        const datasetIndex = elements[0].datasetIndex;
        // We are interested in the data from the 'Close Price' dataset (datasetIndex 0) for selecting the date
        if (marketData && marketData.data && dataIndex >= 0 && dataIndex < marketData.data.length) {
           setSelectedDateData(marketData.data[dataIndex]);
        }
      }
    }
  };

  // Helper function to calculate price change for a specific date relative to the previous day
  const calculateDailyChange = (selectedData, allData) => {
    if (!selectedData || !allData || allData.length < 2) return null; // Need at least 2 data points to calculate a change

    const selectedIndex = allData.findIndex(item => item.date === selectedData.date);

    if (selectedIndex <= 0) return null; // Cannot calculate change if it's the first day or data not found

    const previousDayData = allData[selectedIndex - 1];
    const currentPrice = parseFloat(selectedData.close);
    const previousClose = parseFloat(previousDayData.close);

    if (previousClose === 0) return null; // Avoid division by zero

    const change = currentPrice - previousClose;
    const percentChange = (change / previousClose) * 100;
    const isPositive = change >= 0;

    return {
      change,
      percentChange,
      isPositive,
    };
  };

  // Function to toggle dataset visibility by label
  const toggleDatasetVisibility = (datasetLabel) => {
    setDatasetVisibility(prevState => ({
      ...prevState,
      [datasetLabel]: !prevState[datasetLabel]
    }));
  };

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
      // Initialize selected data to the latest data point
      if (response.data && response.data.data && response.data.data.length > 0) {
        setSelectedDateData(response.data.data[response.data.data.length - 1]);
      } else {
        setSelectedDateData(null);
      }
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err.response?.data?.error || 'Failed to fetch stock data');
      setMarketData(null);
      setSelectedDateData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: colors.text,
      backgroundColor: 'transparent'
    }}>
      {/* Popular Stocks Card */}
      <div style={{
        borderRadius: '8px',
        boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        overflow: 'hidden',
        marginBottom: '1rem',
        backgroundColor: colors.background
      }}>
        <div style={{
          padding: '1rem',
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.cardHeaderBackground
        }}>
          <h3 style={{
            margin: '0 0 0 0',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: colors.text
          }}>Popular Stocks</h3>
          <p style={{
            margin: '0',
            fontSize: '0.875rem',
            color: colors.mutedText
          }}>Quick select or view summary data</p>
        </div>
        <div style={{ padding: '1rem', backgroundColor: colors.cardBackground }}>
          {popularStocksLoading && <p style={{color: colors.mutedText}}>Loading popular stock summaries...</p>}
          {popularStocksError && <p style={{color: colors.dangerText}}>{popularStocksError}</p>}
          {!popularStocksLoading && !popularStocksError && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '1rem'
            }}>
              {popularStockDetails.map(detail => (
                <button
                  key={detail.symbol}
                  onClick={() => handleQuickSelect(detail.symbol)}
                  disabled={loading} // Disable if main chart is loading
                  style={{
                    padding: '1rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    backgroundColor: colors.cardBackground,
                    textAlign: 'left',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? '0.65' : '1',
                    boxShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.25)' : '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '100px', // Ensure cards have a consistent minimum height
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = isDarkMode ? '0 5px 10px rgba(0,0,0,0.35)' : '0 5px 10px rgba(0,0,0,0.15)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = isDarkMode ? '0 2px 4px rgba(0,0,0,0.25)' : '0 2px 4px rgba(0,0,0,0.1)';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.8rem', color: colors.mutedText, marginBottom: '0.25rem' }}>{detail.symbol}</div>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: colors.text, marginBottom: '0.35rem',  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {detail.name}
                    </div>
                  </div>
                  {detail.error === true && <div style={{ fontSize: '0.8rem', color: colors.dangerText, marginTop: 'auto' }}>Error loading data</div>}
                  {typeof detail.error === 'string' && <div style={{ fontSize: '0.8rem', color: colors.mutedText, marginTop: 'auto' }}>{detail.error}</div>}

                  {!detail.error && detail.currentPrice !== null && (
                    <div style={{marginTop: 'auto'}}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: colors.text, marginBottom: '0.25rem' }}>
                        ${detail.currentPrice.toFixed(2)}
                      </div>
                      {detail.change !== null && detail.percentChange !== null && detail.isPositive !== null ? (
                        <div style={{ fontSize: '0.8rem', fontWeight: 500, color: detail.isPositive ? colors.successText : colors.dangerText }}>
                          {detail.isPositive ? '▲' : '▼'} {Math.abs(detail.change).toFixed(2)} ({Math.abs(detail.percentChange).toFixed(2)}%)
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.8rem', color: colors.mutedText }}>N/A</div>
                      )}
                    </div>
                  )}
                   {!detail.error && detail.currentPrice === null && <div style={{ fontSize: '0.8rem', color: colors.mutedText, marginTop: 'auto' }}>Data unavailable</div>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Stock Data Card */}
      <div style={{
        borderRadius: '8px',
        boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        overflow: 'hidden',
        marginBottom: '1rem',
        backgroundColor: colors.background
      }}>
        <div style={{
          padding: '1rem',
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.cardHeaderBackground
        }}>
          <h2 style={{
            margin: '0 0 0 0',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: colors.text
          }}>Stock Market Data</h2>
          <p style={{
            margin: '0',
            fontSize: '0.875rem',
            color: colors.mutedText
          }}>Enter a symbol to view historical market data</p>
        </div>
        {/* Main Card Body */}
        <div style={{
          padding: '1rem',
          backgroundColor: colors.cardBackground,
          // Removed flex and gap from here, children will stack naturally
        }}>
          {/* Search form */}
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

          {/* Error message display */}
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

          {/* Container for Chart and Latest Data (Flex Row) */}
          {marketData && marketData.data && marketData.data.length > 0 && (
            <div style={{
              display: 'flex', // Arrange children (chart and data) in a row
              width: '100%' // Ensure this container takes full width of parent
            }}>
              {/* Chart Container (80%) */}
              <div style={{
                width: '80%', 
                flex: '0 0 80%', 
              }}>
                <Line data={chartData} options={chartOptions} />
              </div>

              {/* Latest Data Column (20%) */}
              {selectedDateData && (
                <div style={{
                  width: '20%', 
                  flex: '0 0 20%', 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  padding: '0 0 0 1rem', // Add padding on the left to separate from chart
                  height: '100%', // Maximize height
                }}>
                  {/* Latest Data Header */}
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: colors.text
                  }}>Latest Data ({selectedDateData.date})</h3>

                  {/* Price Change Display - Now dynamic based on selected date */}
                  {selectedDateData && marketData && marketData.data && (
                    (() => {
                      const dailyChange = calculateDailyChange(selectedDateData, marketData.data);
                      if (!dailyChange) return null;
                      return (
                        <div 
                          key={'daily-change-' + selectedDateData.date} // Unique key based on date to ensure re-render
                          style={{
                          textAlign: 'center',
                          marginBottom: '1rem', // Keep some margin below the change
                        }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            backgroundColor: dailyChange.isPositive 
                              ? (isDarkMode ? 'rgba(74, 222, 128, 0.1)' : 'rgba(34, 197, 94, 0.1)') 
                              : (isDarkMode ? 'rgba(248, 113, 113, 0.1)' : 'rgba(239, 68, 68, 0.1)'),
                            color: dailyChange.isPositive ? colors.successText : colors.dangerText,
                            fontWeight: 500
                          }}>
                            {dailyChange.isPositive ? '↑' : '↓'} ${Math.abs(dailyChange.change).toFixed(2)} ({Math.abs(dailyChange.percentChange).toFixed(2)}%)
                          </span>
                        </div>
                      );
                    })()
                  )}

                  {/* Individual Data Points - Made clickable and added indicators */}
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    overflowY: 'auto',
                  }}>
                    {/* Open */}
                    <div 
                      onClick={() => toggleDatasetVisibility('Open Price')} // Add click handler
                      style={{
                      borderRadius: '4px',
                      backgroundColor: datasetVisibility['Open Price'] ? colors.cardBackground : colors.border, // Indicator: change background/border
                      border: `1px solid ${datasetVisibility['Open Price'] ? colors.border : colors.mutedText}`, // Indicator: change border color
                      padding: '0.4rem 0.6rem',
                      textAlign: 'center',
                      flex: '0 0 auto',
                      minWidth: 'auto',
                      width: '100%',
                      cursor: 'pointer', // Indicate clickable
                      opacity: datasetVisibility['Open Price'] ? '1' : '0.7', // Indicator: change opacity
                      transition: 'opacity 0.2s ease', // Smooth transition
                    }}>
                      <div style={{ fontSize: '0.75rem', color: colors.text, marginBottom: '0.1rem' }}>Open</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: colors.text }}>${Number(selectedDateData.open).toFixed(2)}</div>
                    </div>
                    {/* Close */}
                    <div 
                      onClick={() => toggleDatasetVisibility('Close Price')} // Add click handler
                      style={{
                      borderRadius: '4px',
                      backgroundColor: datasetVisibility['Close Price'] ? colors.cardBackground : colors.border, // Indicator
                      border: `1px solid ${datasetVisibility['Close Price'] ? colors.border : colors.mutedText}`, // Indicator
                      padding: '0.4rem 0.6rem',
                      textAlign: 'center',
                      flex: '0 0 auto',
                      minWidth: 'auto',
                      width: '100%',
                      cursor: 'pointer', // Indicate clickable
                      opacity: datasetVisibility['Close Price'] ? '1' : '0.7', // Indicator
                      transition: 'opacity 0.2s ease', // Smooth transition
                    }}>
                      <div style={{ fontSize: '0.75rem', color: colors.text, marginBottom: '0.1rem' }}>Close</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: colors.text }}>${Number(selectedDateData.close).toFixed(2)}</div>
                    </div>
                    {/* High */}
                    <div 
                      onClick={() => toggleDatasetVisibility('High')} // Add click handler
                      style={{
                      borderRadius: '4px',
                      backgroundColor: datasetVisibility['High'] ? colors.cardBackground : colors.border, // Indicator
                      border: `1px solid ${datasetVisibility['High'] ? colors.border : colors.mutedText}`, // Indicator
                      padding: '0.4rem 0.6rem',
                      textAlign: 'center',
                      flex: '0 0 auto',
                      minWidth: 'auto',
                      width: '100%',
                      cursor: 'pointer', // Indicate clickable
                      opacity: datasetVisibility['High'] ? '1' : '0.7', // Indicator
                      transition: 'opacity 0.2s ease', // Smooth transition
                    }}>
                      <div style={{ fontSize: '0.75rem', color: colors.text, marginBottom: '0.1rem' }}>High</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: colors.text }}>${Number(selectedDateData.high).toFixed(2)}</div>
                    </div>
                    {/* Low */}
                    <div 
                      onClick={() => toggleDatasetVisibility('Low')} // Add click handler
                      style={{
                      borderRadius: '4px',
                      backgroundColor: datasetVisibility['Low'] ? colors.cardBackground : colors.border, // Indicator
                      border: `1px solid ${datasetVisibility['Low'] ? colors.border : colors.mutedText}`, // Indicator
                      padding: '0.4rem 0.6rem',
                      textAlign: 'center',
                      flex: '0 0 auto',
                      minWidth: 'auto',
                      width: '100%',
                      cursor: 'pointer', // Indicate clickable
                      opacity: datasetVisibility['Low'] ? '1' : '0.7', // Indicator
                      transition: 'opacity 0.2s ease', // Smooth transition
                    }}>
                      <div style={{ fontSize: '0.75rem', color: colors.text, marginBottom: '0.1rem' }}>Low</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: colors.text }}>${Number(selectedDateData.low).toFixed(2)}</div>
                    </div>
                    {/* Volume - Not currently a line on the chart, keep as non-interactive */}
                    <div style={{ 
                      borderRadius: '4px',
                      backgroundColor: colors.cardBackground,
                      border: `1px solid ${colors.border}`, // Keep default border
                      padding: '0.4rem 0.6rem',
                      textAlign: 'center',
                      flex: '0 0 auto',
                      minWidth: 'auto',
                      width: '100%',
                      // Removed cursor: 'pointer' and opacity/transition for non-interactive item
                    }}>
                      <div style={{ fontSize: '0.75rem', color: colors.mutedText, marginBottom: '0.1rem' }}>Volume</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: colors.text }}>{Number(selectedDateData.volume).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockChart;