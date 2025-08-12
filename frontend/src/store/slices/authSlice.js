import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from 'api/auth';
import { secureStoreToken, removeSecureToken } from 'utils/security';


export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue, signal }) => {
    try {
      const response = await authApi.register(userData, signal);
      secureStoreToken(response.data.token);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.response?.data || 'Ошибка регистрации');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await authApi.getMe({ signal });
      return response.data;
    } catch (err) {
      localStorage.removeItem('token');
      return rejectWithValue(err.response?.data || 'Ошибка получения данных пользователя');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, signal }) => {
    try {
      const response = await authApi.login(credentials, signal);
      secureStoreToken(response.data.token);
      return response.data;
    } catch (err) {
      const errorMessage = "Invalid credentials or your account has been deactivated. Please contact the administrator at admin@mail.ru";
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      removeSecureToken();
      state.user = null;
      state.isAuthenticated = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    }
  },

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
