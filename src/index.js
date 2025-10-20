import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import App from './App';
import './index.css';

// Ensure you're using React 18's createRoot
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/steam_ai">
        <App />
      </BrowserRouter>
    </Provider>
  // </React.StrictMode>
);
