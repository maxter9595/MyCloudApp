import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import api from './api';
import App from './App';
import store from './store/store';
import axios from 'axios';

axios.defaults.withCredentials = true;

/**
 * Fetches a CSRF token for protection 
 * against cross-site request forgery.
 * This request is made when the app starts.
 * 
 * @function
 */
api.get('/auth/csrf/', {
  withCredentials: true
}).catch(() => {});

/**
 * The root DOM node of the application.
 * @type {ReactDOM.Root}
 */
const root = ReactDOM.createRoot(
  document.getElementById('root')
);

/**
 * Renders the main application 
 * into the root DOM node.
 * 
 * Wraps the app with:
 * - React.StrictMode for 
 *   highlighting potential issues
 * - Redux Provider for store access
 * - BrowserRouter for routing
 */
root.render(
  <React.StrictMode>
    <Provider 
      store={store}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
