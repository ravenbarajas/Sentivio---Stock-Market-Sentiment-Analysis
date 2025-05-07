import React, { useState } from 'react';
import EtfGraph from './EtfGraph';
import StockGraph from './StockGraph';
import CryptoGraph from './CryptoGraph';
import './MarketDataDashboard.css';

const MarketDataDashboard = () => {
  const [activeTab, setActiveTab] = useState('etf');

  return (
    <div className="market-dashboard">
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'etf' ? 'active' : ''}`}
          onClick={() => setActiveTab('etf')}
        >
          ETF Data
        </button>
        <button 
          className={`tab-button ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          Stock Data
        </button>
        <button 
          className={`tab-button ${activeTab === 'crypto' ? 'active' : ''}`}
          onClick={() => setActiveTab('crypto')}
        >
          Crypto Data
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'etf' && <EtfGraph />}
        {activeTab === 'stock' && <StockGraph />}
        {activeTab === 'crypto' && <CryptoGraph />}
      </div>
    </div>
  );
};

export default MarketDataDashboard; 