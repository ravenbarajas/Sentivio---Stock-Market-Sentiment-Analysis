import React, { useState } from 'react';
import StockChart from './StockChart';

const MarketDataDashboard = () => {
  const [activeTab, setActiveTab] = useState('stock');

  return (
    <div className="market-dashboard container mt-4">
      <div className="tabs">
        <div className="tabs-list">
          <button
            className="tabs-trigger"
            data-state={activeTab === 'stock' ? 'active' : ''}
            onClick={() => setActiveTab('stock')}
          >
            Stock Data
          </button>
        </div>
        <div className="tabs-content">
          {activeTab === 'stock' && <StockChart />}
        </div>
      </div>
    </div>
  );
};

export default MarketDataDashboard; 