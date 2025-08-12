import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from 'api/users';


export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await api.getUsers(signal);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue, signal }) => {
    try {
      await api.deleteUser(id, signal);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }, { rejectWithValue, signal }) => {
    try {
      const response = await api.updateUser(id, data, signal);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',

  initialState: {
    users: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          user => user.id !== action.payload
        );
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          user => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
        console.error(
          'Update user failed:',
          action.payload
        );
      });
  },
});

export default usersSlice.reducer;
