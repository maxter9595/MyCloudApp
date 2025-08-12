import { useEffect, useState, useRef } from 'react';
import { FaPlus, FaKey } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import { useSelector, useDispatch } from 'react-redux';

import { fetchUsers } from 'store/slices/usersSlice';
import usersApi from 'api/users';
import  {
  UserTable,
  CreateAdminForm
} from 'components';

/**
 * AdminPage is a page that displays a 
 * list of regular users and allows creating 
 * a new admin user, as well as changing the 
 * password of the current user.
 *
 * The page is divided into two main sections: 
 * the header and the content. The header contains 
 * a title and two buttons: "Create admin" and 
 * "Change password". The content section displays 
 * a table of users, which can be filtered by the
 * search input above the table.
 *
 * The page is responsive and will 
 * adapt to different screen sizes.
 * @returns {JSX.Element}
 */
const AdminPage = () => {
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);
  
  const { users, loading } = useSelector(
    (state) => state.users
  );

  const { user: currentUser } = useSelector(
    (state) => state.auth
  );

  const [
    searchTerm, 
    setSearchTerm
  ] = useState('');

  const [
    showCreateAdmin, 
    setShowCreateAdmin
  ] = useState(false);

  const [
    showPasswordModal, 
    setShowPasswordModal
  ] = useState(false);

  const [
    newPassword, 
    setNewPassword
  ] = useState('');

  const isMobile = useMediaQuery({ 
    query: '(max-width: 768px)' 
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    dispatch(fetchUsers(signal));

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [dispatch]);

  const regularUsers = users.filter(
    user => !user.is_staff && !user.is_superuser
  );

  const filteredUsers = regularUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();

    return (
      user.id.toString().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (
        user.full_name && 
        user.full_name.toLowerCase().includes(searchLower)
      )
    );
  });

/**
 * Handles the creation of a new admin user.
 *
 * @param {Object} values - Form values 
 * containing the new admin user data.
 * @param {Object} formikHelpers - Object 
 * containing Formik helper functions.
 * @param {Function} formikHelpers.setSubmitting - 
 * Function to set the submitting state.
 * @param {Function} formikHelpers.setErrors - 
 * Function to set form errors.
 */
  const handleCreateAdmin = async (values, { setSubmitting, setErrors }) => {
    try {
      await usersApi.createAdmin(values);
      dispatch(fetchUsers());
      setShowCreateAdmin(false);

    } catch (error) {
      setErrors(error.response?.data || {});
    
    } finally {
      setSubmitting(false);
    }
  };

/**
 * Handles changing the 
 * current user's password.
 *
 * @returns {Promise<void>} - Promise 
 * resolving when the operation is complete
 */
  const handleChangePassword = async () => {
    if (!newPassword) return;

    try {
      await usersApi.updateUser(
        currentUser.id, 
        { 
          password: newPassword 
        }
      );

      setShowPasswordModal(false);
      setNewPassword('');

    } catch (error) {
      console.error(
        'Error changing password:', 
        error
      );
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">
          Панель администратора
        </h1>
        
        <div className="admin-actions">
          <button
            className="admin-btn create-admin"
            onClick={() => setShowCreateAdmin(true)}
            aria-label="Создать администратора"
          >
            {isMobile ? <FaPlus /> : <><FaPlus /> Создать админа</>}
          </button>

          <button
            className="admin-btn change-password"
            onClick={() => setShowPasswordModal(true)}
            aria-label="Изменить пароль"
          >
            {isMobile ? <FaKey /> : <><FaKey /> Изменить пароль</>}
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="search-bar">
          <input
            type="text"
            placeholder={
              isMobile ? 
              "Поиск пользователей..." : 
              "Поиск по ID, логину, Email или имени"
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            aria-label="Поиск пользователей"
          />
        </div>

        {loading ? (
          <div className="loading-indicator">
            <p>
              Загрузка пользователей...
            </p>
          </div>
        ) : (
          <>
            <UserTable
              users={filteredUsers}
              isMobile={isMobile}
            />
          </>
        )}
      </div>

      {showCreateAdmin && (
        <div className="modal-overlay">
          <div className="modal">
            
            <div className="modal-header">
              <h3 className="modal-title">
                Создание администратора
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowCreateAdmin(false)}
                aria-label="Закрыть"
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <CreateAdminForm
                onSubmit={handleCreateAdmin}
                onCancel={() => setShowCreateAdmin(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">

            <div className="modal-header">
              <h3 className="modal-title">
                Изменение пароля
              </h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword('');
                }}
                aria-label="Закрыть"
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-form-group">
                <label htmlFor="new-password">
                  Новый пароль
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Введите новый пароль"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn cancel"
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword('');
                }}
              >
                Отмена
              </button>
              <button
                className="modal-btn submit"
                onClick={handleChangePassword}
                disabled={!newPassword}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
