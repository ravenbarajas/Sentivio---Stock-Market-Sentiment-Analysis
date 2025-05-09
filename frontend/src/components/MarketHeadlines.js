import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from './ui/ThemeProvider';

const MarketHeadlines = () => {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  
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
    buttonText: '#fff',
    dangerText: isDarkMode ? '#f87171' : '#dc3545',
  };

  // Function to fetch headlines
  const fetchHeadlines = async () => {
    try {
      const response = await axios.get('/api/headlines/5');
      if (response.data && response.data.success && response.data.data) {
        setHeadlines(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching headlines:', err);
      setError('Failed to fetch headlines');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and set up interval
  useEffect(() => {
    // Initial fetch
    fetchHeadlines();

    // Set up interval to fetch data every 8 seconds
    const intervalId = setInterval(fetchHeadlines, 8000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: colors.text,
      backgroundColor: 'transparent'
    }}>
      <div style={{
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: colors.background,
        boxShadow: isDarkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
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
          }}>Market Headlines</h3>
          <p style={{
            margin: '0',
            fontSize: '0.875rem',
            color: colors.mutedText
          }}>Latest news refreshed every 8 seconds</p>
        </div>

        <div style={{ padding: '1rem' }}>
          {loading ? (
            <p style={{ color: colors.mutedText }}>Loading headlines...</p>
          ) : error ? (
            <p style={{ color: colors.dangerText }}>{error}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {headlines.map(headline => (
                <div 
                  key={headline.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: colors.cardBackground,
                    border: `1px solid ${colors.border}`,
                    boxShadow: isDarkMode ? '0 1px 2px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    justifyContent: 'space-between' 
                  }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ 
                        backgroundColor: '#ff6b6b', 
                        color: colors.buttonText,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        marginRight: '0.5rem'
                      }}>
                        {headline.stock}
                      </span>
                      <span style={{ 
                        color: colors.mutedText,
                        fontSize: '0.75rem'
                      }}>
                        {formatDate(headline.date)}
                      </span>
                    </div>
                    {headline.publisher && (
                      <span style={{ 
                        color: colors.mutedText,
                        fontSize: '0.75rem',
                        fontStyle: 'italic'
                      }}>
                        {headline.publisher}
                      </span>
                    )}
                  </div>
                  <p style={{ 
                    margin: '0.5rem 0 0 0', 
                    fontSize: '0.9rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: '1.4',
                    height: '2.8em',
                    minHeight: '2.8em'
                  }}>
                    {headline.headline}
                  </p>
                  {headline.url && (
                    <a 
                      href={headline.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        marginTop: '0.5rem',
                        fontSize: '0.8rem',
                        color: '#ff6b6b',
                        textDecoration: 'none'
                      }}
                    >
                      Read more →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketHeadlines; 