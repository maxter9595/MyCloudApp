import { useDispatch } from 'react-redux';

import { login } from 'store/slices/authSlice';
import {
  LoginForm,
  Notification
} from 'components';


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
