import React from 'react';
import './App.scss';
import { Router } from './routes/Router';
import { CookiesProvider } from 'react-cookie';

function App() {
  console.log('App component rendering'); // デバッグ用
  return (
    <CookiesProvider>
      <div className="App">
        <Router />
      </div>
    </CookiesProvider>
  );
}

export default App;
