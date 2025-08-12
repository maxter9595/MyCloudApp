import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import filesReducer from './slices/filesSlice';
import usersReducer from './slices/usersSlice';


/**
 * Redux store instance with 
 * auth, files, and users reducers.
 */
export default configureStore({
  reducer: {
    auth: authReducer,
    files: filesReducer,
    users: usersReducer,
  },

  /**
   * Configures middleware for the Redux store.
   * 
   * @param {Function} getDefaultMiddleware - 
   * Function to get the default middleware.
   * @returns {Array} Array of middleware 
   * with serializable check disabled.
   */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
