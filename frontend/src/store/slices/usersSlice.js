import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from 'api/users';


/**
 * Fetches all users from the server.
 *
 * @returns {Promise<Array>} Array of user objects.
 * @throws {Object} Error response from the server.
 */
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue, signal }) => {
    try {
      // const response = await api.get('/auth/users/', { signal });
      const response = await api.getUsers(signal);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/**
 * Deletes a user from the server.
 *
 * @param {string} id - ID of the user to delete.
 * @returns {Promise<string>} ID of the deleted user.
 * @throws {Object} Error response from the server.
 */
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue, signal }) => {
    try {
      // await api.delete(`/auth/users/${id}/`, { signal });
      await api.deleteUser(id, signal);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/**
 * Updates user data on the server.
 *
 * @param {Object} payload - Update parameters.
 * @param {string} payload.id - ID of the user to update.
 * @param {Object} payload.data - New user data.
 * @returns {Promise<Object>} Updated user object.
 * @throws {Object} Error response from the server.
 */
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }, { rejectWithValue, signal }) => {
    try {
      // const response = await api.patch(`/auth/users/${id}/`, data, { signal });
      const response = await api.updateUser(id, data, signal);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/**
 * Redux slice for managing
 * user operations state.
 *
 * @property {Array} users -
 * List of user objects.
 * @property {boolean} loading - Indicates
 * if an operation is in progress.
 * @property {Object|null} error -
 * Current error object or null.
 */
const usersSlice = createSlice({
  name: 'users',

  initialState: {
    users: [],
    loading: false,
    error: null,
  },

  reducers: {},

  /**
   * Handles side effects of user operations actions.
   *
   * @param {Object} builder - createSlice
   * extraReducers builder.
   * @returns {Object} Modified builder.
   * @property {function} pending - Set
   * loading to true and clear error.
   * @property {function} fulfilled - Set users,
   * clear error, and set loading to false.
   * @property {function} rejected - Set
   * error and set loading to false.
   */
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
