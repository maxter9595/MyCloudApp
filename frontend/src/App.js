import { useEffect, useRef, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';

import api from './api';
import { selectIsAuthenticated } from './store/selectors';
import { setUser, fetchCurrentUser } from './store/slices/authSlice';

import {
  Header,
  ProtectedRoute
} from 'components';

import { 
  HomePage,
  LoginPage,
  RegisterPage,
  StoragePage,
  AdminPage 
} from 'pages';

import './index.css';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    const token = localStorage.getItem('token');

    if (token && !isAuthenticated) {
      dispatch(fetchCurrentUser(signal));

      api.get('/auth/users/me/', { signal })
        .then(response => {
          dispatch(setUser(response.data));

          if (response.data.is_superuser) {
            navigate('/admin');
          } else {
            navigate('/storage');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [dispatch, isAuthenticated, navigate]);

  return (
    <Suspense fallback={<div className="loading-spinner">Загрузка...</div>}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/storage" element={<StoragePage />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
