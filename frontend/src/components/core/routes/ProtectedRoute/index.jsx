import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';


/**
 * A protected route that redirects to the login 
 * page if the user is not authenticated. If the 
 * adminOnly prop is true, it will also redirect 
 * to the root page if the user is not an admin.
 *
 * @param {Object} props Component props
 * @param {boolean} [props.adminOnly=false] If set 
 * to true, the route will only be accessible by admins
 * @returns {JSX.Element} The protected route
 */
const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !user?.is_superuser) return <Navigate to="/" />;

  return <Outlet />;
};

export default ProtectedRoute;
