// frontend\src\components\ui\Header.jsx
import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { logout } from 'store/slices/authSlice';
import { selectIsAuthenticated, selectCurrentUser } from 'store/selectors';
import { ReactComponent as Logo } from 'assets/svg/logo.svg';

const Header = memo(() => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLogoClick = (e) => {
    if (isAuthenticated) {
      e.preventDefault();
      navigate('/storage');
    }
  };

  const currentPath = window.location.pathname;
  const showAdditionalLinks = !['/', '/login', '/register'].includes(currentPath);

  return (
    <header>
      <nav>
        <Link to="/" className="logo" onClick={handleLogoClick}>
          <Logo />
        </Link>

        {showAdditionalLinks && (
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <Link to="/storage">Хранилище</Link>
                {user?.is_superuser && <Link to="/admin">Админ-панель</Link>}
              </>
            ) : (
              <>
                <Link to="/login">Вход</Link>
                <Link to="/register">Регистрация</Link>
              </>
            )}
          </div>
        )}

        {isAuthenticated ? (
          <button onClick={handleLogout} className="btn btn-outline btn-exit">
            Выйти
          </button>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-outline">
              Вход
            </Link>
            <Link to="/register" className="btn btn-primary">
              Регистрация
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
});

export default Header;
