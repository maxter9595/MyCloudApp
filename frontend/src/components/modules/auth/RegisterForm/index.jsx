import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import { useEffect, useState } from 'react';

import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaSpinner,
  FaInfoCircle 
} from 'react-icons/fa';

import api from 'api';
import { useDebounce } from 'hooks/useDebounce';

import { 
  validateUsername, 
  validatePassword, 
  validateEmail 
} from 'utils/validators';


const RegisterForm = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);

  const debouncedUsername = useDebounce(username, 500);
  const debouncedEmail = useDebounce(email, 500);
  const debouncedPassword = useDebounce(password, 500);
  const debouncedConfirmPassword = useDebounce(confirmPassword, 500);

  // Проверка уникальности логина
  useEffect(() => {
    if (debouncedUsername && validateUsername(debouncedUsername)) {
      setUsernameChecking(true);
      api.get(`/auth/check-username/?username=${debouncedUsername}`)
        .then(response => {
          if (!response.data.available) {
            setUsernameError('Этот логин уже занят');
          } else {
            setUsernameError(null);
          }
        })
        .catch(() => setUsernameError('Ошибка проверки логина'))
        .finally(() => setUsernameChecking(false));
    } else if (debouncedUsername) {
      setUsernameError('Логин должен быть 4-20 символов, начинаться с буквы');
    }
  }, [debouncedUsername]);

  // Проверка уникальности email
  useEffect(() => {
    if (debouncedEmail && validateEmail(debouncedEmail)) {
      setEmailChecking(true);
      api.get(`/auth/check-email/?email=${debouncedEmail}`)
        .then(response => {
          if (!response.data.available) {
            setEmailError('Этот email уже используется');
          } else {
            setEmailError(null);
          }
        })
        .catch(() => setEmailError('Ошибка проверки email'))
        .finally(() => setEmailChecking(false));
    } else if (debouncedEmail) {
      setEmailError('Некорректный формат email');
    }
  }, [debouncedEmail]);

  // Валидация пароля
  useEffect(() => {
    if (!debouncedPassword) {
      setPasswordError(null);
      return;
    }
    
    if (debouncedPassword.length < 6) {
      setPasswordError('Минимум 6 символов');
    } else if (!/[A-Z]/.test(debouncedPassword)) {
      setPasswordError('Добавьте заглавную букву');
    } else if (!/\d/.test(debouncedPassword)) {
      setPasswordError('Добавьте цифру');
    } else if (!/[!@#$%^&*()_+]/.test(debouncedPassword)) {
      setPasswordError('Добавьте спецсимвол');
    } else {
      setPasswordError(null);
    }
  }, [debouncedPassword]);

  // Валидация подтверждения пароля
  useEffect(() => {
    if (!debouncedConfirmPassword) {
      setConfirmPasswordError(null);
      return;
    }
    
    if (debouncedConfirmPassword !== password) {
      setConfirmPasswordError('Пароли должны совпадать');
    } else {
      setConfirmPasswordError(null);
    }
  }, [debouncedConfirmPassword, password]);

  const getFieldStatus = (fieldName, touched, error, checking) => {
    if (!touched) return 'idle';
    if (error) return 'error';
    if (checking) return 'checking';
    return 'valid';
  };

  const renderFieldStatus = (fieldName, touched, error, checking) => {
    const status = getFieldStatus(fieldName, touched, error, checking);
    
    switch (status) {
      case 'error':
        return <FaExclamationCircle className="status-icon error" />;
      case 'checking':
        return <FaSpinner className="status-icon checking spin" />;
      case 'valid':
        return <FaCheckCircle className="status-icon valid" />;
      default:
        return null;
    }
  };

  const handleFieldChange = (e, setFieldValue, setExternalValue) => {
    const { name, value } = e.target;
    setExternalValue(value);
    setFieldValue(name, value);
    
    // Сбрасываем ошибки при изменении
    switch (name) {
      case 'username':
        if (usernameError) setUsernameError(null);
        break;
      case 'email':
        if (emailError) setEmailError(null);
        break;
      case 'password':
        if (passwordError) setPasswordError(null);
        break;
      case 'confirmPassword':
        if (confirmPasswordError) setConfirmPasswordError(null);
        break;
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={{
        username: '',
        email: '',
        full_name: '',
        password: '',
        confirmPassword: '',
      }}
      
      validationSchema={Yup.object({
        username: Yup.string()
          .test(
            'valid-username', 
            () => usernameError || 'Некорректный логин',
            () => !usernameError && validateUsername(username)
          )
          .required('Обязательное поле'),
        email: Yup.string()
          .test(
            'valid-email', 
            () => emailError || 'Некорректный email',
            () => !emailError && validateEmail(email)
          )
          .required('Обязательное поле'),
        full_name: Yup.string()
          .required('Обязательное поле'),
        password: Yup.string()
          .test(
            'valid-password', 
            () => passwordError || 'Слабый пароль',
            () => !passwordError && validatePassword(password)
          )
          .required('Обязательное поле'),
        confirmPassword: Yup.string()
          .test(
            'confirm-password',
            () => confirmPasswordError || 'Пароли должны совпадать',
            () => !confirmPasswordError && confirmPassword === password
          )
          .required('Обязательное поле'),
      })}

      onSubmit={(values, actions) => {
        // Проверяем наличие ошибок перед отправкой
        if (usernameError || emailError || passwordError || confirmPasswordError) {
          actions.setSubmitting(false);
          return;
        }
        onSubmit(values, actions);
      }}
    >
      {({ 
        handleSubmit, 
        isSubmitting, 
        touched, 
        errors,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Поле username */}
          <div className={`form-group ${getFieldStatus('username', touched.username, errors.username || usernameError, usernameChecking)}`}>
            <label htmlFor="username">
              Логин
              <span className="hint-tooltip" title="4-20 символов, начинается с буквы, только буквы и цифры">
                <FaInfoCircle />
              </span>
            </label>
            <div className="input-wrapper">
              <Field
                type="text"
                name="username"
                id="username"
                className="form-input"
                onChange={(e) => handleFieldChange(e, setFieldValue, setUsername)}
              />
              {renderFieldStatus('username', touched.username, errors.username || usernameError, usernameChecking)}
            </div>
            {(errors.username || usernameError) && (
              <div className="error-message">
                {errors.username || usernameError}
              </div>
            )}
          </div>

          {/* Поле email */}
          <div className={`form-group ${getFieldStatus('email', touched.email, errors.email || emailError, emailChecking)}`}>
            <label htmlFor="email">
              Email
              <span className="hint-tooltip" title="Введите корректный email адрес">
                <FaInfoCircle />
              </span>
            </label>
            <div className="input-wrapper">
              <Field
                type="email"
                name="email"
                id="email"
                className="form-input"
                onChange={(e) => handleFieldChange(e, setFieldValue, setEmail)}
              />
              {renderFieldStatus('email', touched.email, errors.email || emailError, emailChecking)}
            </div>
            {(errors.email || emailError) && (
              <div className="error-message">
                {errors.email || emailError}
              </div>
            )}
          </div>

          {/* Поле full_name */}
          <div className={`form-group ${getFieldStatus('full_name', touched.full_name, errors.full_name, false)}`}>
            <label htmlFor="full_name">
              Полное имя
            </label>
            <div className="input-wrapper">
              <Field
                type="text"
                name="full_name"
                id="full_name"
                className="form-input"
              />
              {renderFieldStatus('full_name', touched.full_name, errors.full_name, false)}
            </div>
            {errors.full_name && (
              <div className="error-message">
                {errors.full_name}
              </div>
            )}
          </div>

          {/* Поле password */}
          <div className={`form-group ${getFieldStatus('password', touched.password, errors.password || passwordError, false)}`}>
            <label htmlFor="password">
              Пароль
              <span className="hint-tooltip" title="Минимум 6 символов, 1 заглавная буква, 1 цифра, 1 спецсимвол">
                <FaInfoCircle />
              </span>
            </label>
            <div className="input-wrapper">
              <Field
                type="password"
                name="password"
                id="password"
                className="form-input"
                onChange={(e) => handleFieldChange(e, setFieldValue, setPassword)}
              />
              {renderFieldStatus('password', touched.password, errors.password || passwordError, false)}
            </div>
            {(errors.password || passwordError) && (
              <div className="error-message">
                {errors.password || passwordError}
              </div>
            )}
          </div>

          {/* Поле confirmPassword */}
          <div className={`form-group ${getFieldStatus('confirmPassword', touched.confirmPassword, errors.confirmPassword || confirmPasswordError, false)}`}>
            <label htmlFor="confirmPassword">
              Подтвердите пароль
            </label>
            <div className="input-wrapper">
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="form-input"
                onChange={(e) => handleFieldChange(e, setFieldValue, setConfirmPassword)}
              />
              {renderFieldStatus('confirmPassword', touched.confirmPassword, errors.confirmPassword || confirmPasswordError, false)}
            </div>
            {(errors.confirmPassword || confirmPasswordError) && (
              <div className="error-message">
                {errors.confirmPassword || confirmPasswordError}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={
              isSubmitting || 
              usernameChecking || 
              emailChecking || 
              usernameError || 
              emailError ||
              passwordError ||
              confirmPasswordError ||
              Object.keys(errors).length > 0
            }
            className="submit-btn"
          >
            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
      )}
    </Formik>
  );
};

export default RegisterForm;
