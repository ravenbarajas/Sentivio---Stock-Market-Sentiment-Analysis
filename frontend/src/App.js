import React from 'react';
import './App.css';
import EtfGraph from './components/EtfGraph';
import './components/EtfGraph.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Stock Sentiment Analysis</h1>
      </header>
      <main className="App-main">
        <EtfGraph />
      </main>
      <footer className="App-footer">
        <p>© 2025 Stock Sentiment Analysis</p>
      </footer>
    </div>
  );
}

export default App;
