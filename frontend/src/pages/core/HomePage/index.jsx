import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Cloud from 'assets/png/gin_mycloud.png';


const HomePage = () => {
  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  return (
    <main className="home-page">
      <img src={Cloud} alt="Cloud" className="cloud-bg" />
      <h1>Добро пожаловать в MyCloud</h1>
      <p>Это облачное хранилище для ваших файлов</p>

      {!isAuthenticated && (
        <div className="auth-links">
          <Link
            to="/login"
            className="btn btn-primary"
            style={{
              marginRight: '1rem'
            }}
          >
            Войти
          </Link>

          <Link
            to="/register"
            className="btn btn-outline"
          >
            Зарегистрироваться
          </Link>
        </div>
      )}

      {isAuthenticated && (
        <div className="auth-links">
          <Link
            to="/storage"
            className="btn btn-primary"
          >
            Перейти в хранилище
          </Link>
        </div>
      )}
    </main>
  );
};

export default HomePage;
