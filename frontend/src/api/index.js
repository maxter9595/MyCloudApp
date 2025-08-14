import axios from 'axios';
import { getSecureToken } from '../utils/security';


const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

const getCSRFToken = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/auth/csrf/`,
      { withCredentials: true }
    );
    return response.data.csrfToken;

  } catch (error) {
    console.error(
      'Error getting CSRF token:', 
      error
    );
    return null;
  }
};

getCSRFToken();

api.interceptors.request.use(async (config) => {
  const token = getSecureToken();

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  if (config.method !== 'get') {
    const csrfToken = await getCSRFToken();

    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }

  if (config.signal) {
    // eslint-disable-next-line no-self-assign
    config.signal = config.signal;
  }

  return config;
});

api.interceptors.response.use(
  response => response,

  error => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        const errorMessage = error.response.data?.error || 
          "Invalid credentials or your account has been deactivated. " +
          "Please contact the administrator at admin@mail.ru";
        
        return Promise.reject(
          new Error(errorMessage)
        );
      }

      const errorMessage = error.response.data?.error ||
                        error.response.data?.detail ||
                        'Ошибка загрузки данных';
      
      return Promise.reject(
        new Error(errorMessage)
      );
    }
    
    return Promise.reject(error);
  }
);

export default api;
