import React from 'react';
import './App.scss';
import { Router } from './routes/Router';

function App() {
  console.log('App component rendering'); // デバッグ用
  return (
    <div className="App">
      <Router />
    </div>
  );
}

export default App;
