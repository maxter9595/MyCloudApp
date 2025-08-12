import { useDispatch } from 'react-redux';

import { login } from 'store/slices/authSlice';

import {
  LoginForm,
  Notification
} from 'components';

/**
 * LoginPage component renders the login page 
 * for the application. It utilizes the Notification 
 * and LoginForm components. The LoginForm is connected 
 * to handleSubmit to dispatch login actions.
 * 
 * @returns {JSX.Element} The
 * rendered login page component.
 */
const LoginPage = () => {
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    return dispatch(login(values));
  };

  return (
    <div className="auth-page">
      <h1>Вход</h1>
      <Notification />
      <LoginForm 
        onSubmit={handleSubmit} 
      />
    </div>
  );
};

export default LoginPage;
