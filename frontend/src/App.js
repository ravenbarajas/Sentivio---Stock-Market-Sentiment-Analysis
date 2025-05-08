import React from 'react';
import MarketDataDashboard from './components/MarketDataDashboard';
import './styles/global.css';

function App() {
  return (
    <div className="app">
      <header className="app-header" style={{
        backgroundColor: 'var(--primary)',
        color: 'var(--primary-foreground)',
        padding: '1rem 0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="container flex justify-between items-center">
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Stock Sentiment Analysis</h1>
        </div>
      </header>

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
  );
}

export default App; 