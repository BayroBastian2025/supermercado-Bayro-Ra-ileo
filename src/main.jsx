import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { InventarioProvider } from './context/InventarioContext';
import './index.css';

// HashRouter: funciona en GitHub Pages sin configurar redirecciones del servidor.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <InventarioProvider>
        <App />
      </InventarioProvider>
    </HashRouter>
  </React.StrictMode>
);
