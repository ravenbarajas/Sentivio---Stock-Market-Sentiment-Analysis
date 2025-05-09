import React from 'react';
import AnalystRatings from './AnalystRatings';
import MarketHeadlines from './MarketHeadlines';

const LiveFeed = () => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'transparent'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        width: '100%'
      }}>
        <div>
          <AnalystRatings />
        </div>
        <div>
          <MarketHeadlines />
        </div>
      </div>
    </div>
  );
};

export default LiveFeed; 