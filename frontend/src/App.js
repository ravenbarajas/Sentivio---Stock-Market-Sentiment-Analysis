import React from 'react';
import './App.css';
import MarketDataDashboard from './components/MarketDataDashboard';
import './components/EtfGraph.css';
import './components/StockGraph.css';
import './components/CryptoGraph.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Stock Sentiment Analysis</h1>
      </header>
      <main className="App-main">
        <MarketDataDashboard />
      </main>
      <footer className="App-footer">
        <p>© 2025 Stock Sentiment Analysis</p>
      </footer>
    </div>
  );
}

export default App;
