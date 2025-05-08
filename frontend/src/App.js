import React from 'react';
import MarketDataDashboard from './components/MarketDataDashboard';
import { ThemeProvider } from './components/ui/ThemeProvider';
import Header from './components/ui/Header';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <div className="app">
        <Header title="Stock Sentiment Analysis" />
        
        <main className="app-main" style={{ minHeight: 'calc(100vh - 8rem)' }}>
          <MarketDataDashboard />
        </main>

        <footer className="app-footer" style={{
          backgroundColor: 'var(--muted)',
          color: 'var(--muted-foreground)',
          padding: '1rem 0',
          fontSize: '0.875rem'
        }}>
          <div className="container text-center">
            <p style={{ margin: 0 }}>© {new Date().getFullYear()} Stock Sentiment Analysis</p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App; 