import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  FaToggleOn,
  FaToggleOff,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaDatabase,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { deleteUser, updateUser } from "store/slices/usersSlice";
import { validateNumber, validateRange } from "utils/validators.js";
import { ITEMS_PER_PAGE, MIN_GB_LIMIT, MAX_GB_LIMIT } from "constants/index.js";


[
    {
      name: 'ITEMS_PER_PAGE', 
      value: ITEMS_PER_PAGE, 
      integer: true
    },
    { 
      name: 'MIN_GB_LIMIT', 
      value: MIN_GB_LIMIT
    },
    { 
      name: 'MAX_GB_LIMIT', 
      value: MAX_GB_LIMIT 
    }
].forEach(
  (
    { 
      name, 
      value, 
      integer 
    }
  ) => validateNumber(
    name, 
    value, 
    integer
  )
);

validateRange(
  'MIN_GB_LIMIT', 
  MIN_GB_LIMIT, 
  'MAX_GB_LIMIT', 
  MAX_GB_LIMIT
);

const UserTable = ({ users, isMobile }) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [newStorageLimit, setNewStorageLimit] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [storageLimitError, setStorageLimitError] = useState("");
  const [, setIsDeleting] = useState(false);

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleToggleActive = async (userId, isActive, e) => {
    e.stopPropagation();
    try {
      await dispatch(
        updateUser({
          id: userId,
          data: { is_active: !isActive },
        })
      ).unwrap();
    } catch (error) {
      console.error("Status change error:", error);
    }
  };

  const handleDelete = async (userId, e) => {
    e.stopPropagation();
    
    const confirmText = `Вы уверены, что хотите удалить этого пользователя?\n\nДля подтверждения введите "DELETE"`;
    const userInput = prompt(confirmText);
    
    if (userInput?.trim()?.toUpperCase() !== 'DELETE') {
      return;
    }

    setIsDeleting(true);
    try {
      await dispatch(deleteUser(userId)).unwrap();
    } catch (error) {
      console.error('User deletion error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePasswordChange = async (userId, e) => {
    e.stopPropagation();
    if (!password) {
      alert("Введите новый пароль");
      return;
    }
    try {
      await dispatch(
        updateUser({
          id: userId,
          data: { password },
        })
      ).unwrap();
      setEditingUserId(null);
      setEditingField(null);
      setPassword("");
    } catch (error) {
      console.error("Ошибка изменения пароля:", error);
    }
  };

  const validateStorageLimit = (value) => {
    const limitGB = parseFloat(value);
    if (isNaN(limitGB)) {
      setStorageLimitError("Введите корректное число");
      return false;
    }
    if (limitGB < MIN_GB_LIMIT) {
      setStorageLimitError(`Минимальный лимит - ${MIN_GB_LIMIT} GB`);
      return false;
    }
    if (limitGB > MAX_GB_LIMIT) {
      setStorageLimitError(`Максимальный лимит - ${MAX_GB_LIMIT} GB`);
      return false;
    }
    setStorageLimitError("");
    return true;
  };

  const handleStorageLimitChange = async (userId, e) => {
    e.stopPropagation();
    
    if (!validateStorageLimit(newStorageLimit)) return;
    
    const confirmText = `Вы изменяете лимит хранилища для пользователя.\nНовый лимит: ${newStorageLimit} GB\n\nДля подтверждения введите "CONFIRM"`;
    const userInput = prompt(confirmText);
    
    if (userInput?.trim()?.toUpperCase() !== 'CONFIRM') {
      return;
    }

    const limitGB = parseFloat(newStorageLimit);
    const limitBytes = Math.round(limitGB * 1024 * 1024 * 1024);

    try {
      await dispatch(
        updateUser({
          id: userId,
          data: { max_storage: limitBytes },
        })
      ).unwrap();
      setNewStorageLimit("");
      setEditingUserId(null);
      setEditingField(null);
    } catch (error) {
      console.error('Ошибка изменения лимита хранилища:', error);
    }
  };

  const startEditing = (userId, field, currentValue = "") => {
    setEditingUserId(userId);
    setEditingField(field);
    if (field === "storage") {
      setNewStorageLimit((currentValue / (1024 * 1024 * 1024)).toFixed(2));
    }
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditingField(null);
    setPassword("");
    setNewStorageLimit("");
    setStorageLimitError("");
  };

  return (
    <div className="users-section">
      <table className="user-table">
        <thead>
          <tr>
            {!isMobile && <th>ID</th>}
            <th>Логин</th>
            {!isMobile && <th>Email</th>}
            {!isMobile && <th>Полное имя</th>}
            <th>Объем</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              {!isMobile && <td>{user.id}</td>}
              <td>{user.username}</td>
              {!isMobile && <td>{user.email}</td>}
              {!isMobile && <td>{user.full_name}</td>}
              <td>{(user.max_storage / (1024 * 1024 * 1024)).toFixed(1)}G</td>

              <td>
                <button
                  onClick={(e) => handleToggleActive(user.id, user.is_active, e)}
                  className="status-btn"
                  aria-label={user.is_active ? "Деактивировать" : "Активировать"}
                >
                  {user.is_active ? (
                    <FaToggleOn color="#52c41a" size={20} />
                  ) : (
                    <FaToggleOff color="#ff4d4f" size={20} />
                  )}
                </button>
              </td>
              
              <td className="actions-cell">
                <div className="action-buttons">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(user.id, "password");
                    }}
                    className="action-btn"
                    title="Изменить пароль"
                    aria-label="Изменить пароль"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(user.id, "storage", user.max_storage);
                    }}
                    className="action-btn"
                    title="Изменить объем хранилища"
                    aria-label="Изменить объем хранилища"
                  >
                    <FaDatabase />
                  </button>
                  
                  <button
                    onClick={(e) => handleDelete(user.id, e)}
                    className="action-btn delete"
                    title="Удалить"
                    aria-label="Удалить"
                  >
                    <FaTrash />
                  </button>
                </div>

                {editingUserId === user.id && editingField === "password" && (
                  <div
                    className="password-form"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Новый пароль"
                      autoFocus
                    />

                    <div className="form-actions">
                      <button onClick={(e) => handlePasswordChange(user.id, e)}>
                        <FaSave /> {!isMobile && "Сохранить"}
                      </button>

                      <button onClick={cancelEditing}>
                        <FaTimes /> {!isMobile && "Отмена"}
                      </button>
                    </div>
                  </div>
                )}

                {editingUserId === user.id && editingField === "storage" && (
                  <div
                    className="storage-form"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="number"
                      value={newStorageLimit}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || !isNaN(value)) {
                          setNewStorageLimit(value);
                          validateStorageLimit(value);
                        }
                      }}
                      placeholder="Новый лимит (GB)"
                      step="0.1"
                      min="0.1"
                      max="1000"
                      autoFocus
                    />
                    
                    {storageLimitError && (
                      <div className="error-message">{storageLimitError}</div>
                    )}

                    <div className="form-actions">
                      <button
                        onClick={(e) => handleStorageLimitChange(user.id, e)}
                        disabled={!!storageLimitError}
                      >
                        <FaSave /> {!isMobile && "Сохранить"}
                      </button>

                      <button onClick={cancelEditing}>
                        <FaTimes /> {!isMobile && "Отмена"}
                      </button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <FaChevronLeft />
          </button>
          
          <span className="page-info">
            Страница {currentPage} из {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserTable;
