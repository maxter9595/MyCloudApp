import * as Yup from 'yup';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

import { login } from 'store/slices/authSlice';

/**
 * LoginForm component handles user
 * login functionality. It uses Redux
 * for state management, Formik for form
 * handling, and Yup for validation.
 *
 * Upon successful login, authenticated
 * users are redirected based on their role:
 * - Administrators are redirected to the admin page.
 * - Regular users are redirected to the storage page.
 */
const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    loading
  } = useSelector(
    state => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.is_superuser) {
        navigate('/admin');
      } else {
        navigate('/storage');
      }
    }
  }, [
    isAuthenticated,
    user,
    navigate
  ]);

  return (
    <Formik
      initialValues={{ username: '', password: '' }}

      validationSchema={Yup.object({
        username: Yup.string().required('Обязательное поле'),
        password: Yup.string().required('Обязательное поле'),
      })}

      onSubmit={(values, { setSubmitting }) => {
        dispatch(login(values))
          .unwrap()
          .then(() => {})
          .catch(() => {})
          .finally(() => setSubmitting(false));
      }}
    >

      {({ handleSubmit, isSubmitting }) => (
        <div>
          <form onSubmit={handleSubmit} className="auth-form">

            <div className="form-group">
              <label htmlFor="username">
                Логин
              </label>
              <Field
                type="text"
                name="username"
                id="username"
                className="form-input"
              />
              <ErrorMessage 
                name="username" 
                component="div" 
                className="error-message" 
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Пароль
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                className="form-input"
              />
              <ErrorMessage 
                name="password" 
                component="div" 
                className="error-message" 
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="submit-btn"
            >
              {isSubmitting || loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
          </p>
        </div>
      )}
    </Formik>
  );
};

export default LoginForm;
