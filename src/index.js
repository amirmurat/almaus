// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';   // ← new line
// (если у тебя был reportWebVitals – можешь оставить или удалить)

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// регистрируем PWA‑service‑worker
serviceWorkerRegistration.register();
