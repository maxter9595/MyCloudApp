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


api.get('/auth/csrf/', {
  withCredentials: true
}).catch(() => {});

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

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
