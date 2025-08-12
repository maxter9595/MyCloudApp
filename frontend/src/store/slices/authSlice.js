import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from 'api/auth';
import { secureStoreToken, removeSecureToken } from 'utils/security';


/**
 * Registers a new user.
 * 
 * @param {Object} userData - User credentials 
 * (email, password, username, etc.).
 * @returns {Promise<Object>} Server 
 * response with user data and token.
 * @throws {string} Registration error message.
 */
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue, signal }) => {
    try {
      // const response = await api.post('/auth/register/', userData, { signal });
      const response = await authApi.register(userData, signal);
      secureStoreToken(response.data.token);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response?.data || 'Ошибка регистрации');
    }
  }
);


/**
 * Authenticates a user.
 * 
 * @param {Object} credentials - 
 * Contains email and password.
 * @returns {Promise<Object>} Server 
 * response with user data and token.
 * @throws {string} Error message (invalid 
 * credentials or account deactivated).
 */
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue, signal }) => {
    try {
      // const response = await api.get('/auth/users/me/', { signal });
      const response = await authApi.getMe({ signal });
      return response.data;
    } catch (err) {
      localStorage.removeItem('token');
      return rejectWithValue(err.response?.data || 'Ошибка получения данных пользователя');
    }
  }
);


/**
 * Fetches the current user's data using the stored token.
 * 
 * @returns {Promise<Object>} User data.
 * @throws {string} Error message if the request fails.
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, signal }) => {
    try {
      // const response = await api.post('/auth/login/', credentials, { signal });
      const response = await authApi.login(credentials, signal);
      secureStoreToken(response.data.token);
      return response.data;
    } catch (err) {
      const errorMessage = "Invalid credentials or your account has been deactivated. Please contact the administrator at admin@mail.ru";
      return rejectWithValue(errorMessage);
    }
  }
);


/**
 * Redux slice for authentication state management.
 * 
 * @property {Object|null} user - Current user data.
 * @property {boolean} isAuthenticated - Authentication status.
 * @property {boolean} loading - Loading state during async operations.
 * @property {string|null} error - Error message (if any).
 */
const authSlice = createSlice({
  name: 'auth',

  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },

  reducers: {
    /**
     * Logs out the user by removing the stored 
     * token and resetting the authentication state.
     * 
     * @param {Object} state - Redux state object.
     */
    logout: (state) => {
      removeSecureToken();
      state.user = null;
      state.isAuthenticated = false;
    },

    /**
     * Clears the error message in the authentication state.
     * 
     * @param {Object} state - Redux state object.
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Sets the current user and updates the 
     * authentication status accordingly.
     * 
     * If the payload is null, the 
     * authentication status is set to false.
     * 
     * @param {Object} state - Redux state object.
     * @param {Object} action - Action object with 
     * the user data in the payload.
     */
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    }
  },

  /**
   * Handles side effects of authentication actions.
   * 
   * @param {Object} builder - createSlice 
   * extraReducers builder.
   * @returns {Object} Modified builder.
   * @property {function} pending - Set loading 
   * to true and clear error.
   * @property {function} fulfilled - Set user 
   * and authentication status, clear error, 
   * and set loading to false.
   * @property {function} rejected - Set error 
   * and set loading to false.
   */
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })

      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })

      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        })

      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { 
  logout, 
  clearError, 
  setUser 
} = authSlice.actions;

export default authSlice.reducer;
