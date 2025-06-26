import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { ThemeProvider } from './theme';                // ← добавляем

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>                                     {/* 🔹 */}
      <App />
    </ThemeProvider>
  </BrowserRouter>
);

serviceWorkerRegistration.register();
