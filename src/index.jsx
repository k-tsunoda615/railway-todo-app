import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { CookiesProvider } from 'react-cookie';

// ファイルの先頭に追加
console.log('React version:', React.version);
console.log('Environment:', import.meta.env);

// 環境変数のデバッグ
console.log('環境変数:', import.meta.env);

// エラーハンドリングを追加
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// StrictModeを一時的に無効化
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </Provider>
  // </React.StrictMode>
);

// または古いバージョンのReactの場合
// ReactDOM.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );
