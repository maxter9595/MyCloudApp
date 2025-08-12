import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';


const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !user?.is_superuser) return <Navigate to="/" />;

  return <Outlet />;
};

export default ProtectedRoute;
