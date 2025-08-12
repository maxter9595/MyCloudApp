import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import filesApi from 'api/files';  

export const fetchFiles = createAsyncThunk(
  'files/fetchFiles',
  async (userId, { rejectWithValue, signal }) => {
    try {
      const response = await filesApi.getFiles(userId, signal);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Ошибка при загрузке файлов');
    }
  }
);

export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async (id, { rejectWithValue, signal }) => {
    try {
      await filesApi.deleteFile(id, signal);
      // await api.delete(`/storage/files/${id}/`, { signal });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Ошибка при удалении файла');
    }
  }
);

export const downloadFile = createAsyncThunk(
  'files/downloadFile',
  async (id, { rejectWithValue, signal }) => {
    try {
      // const response = await api.get(`/storage/files/${id}/download/`, {
      //   responseType: 'blob',
      //   headers: { 'Accept': 'application/octet-stream' },
      //   signal
      // });

      const response = await filesApi.downloadFile(id, signal);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Ошибка скачивания файла');
    }
  }
);

export const uploadFile = createAsyncThunk(
  'files/uploadFile',
  async ({ formData, onUploadProgress }, { rejectWithValue, signal }) => {
    try {
      // const response = await api.post('/storage/files/', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      //   onUploadProgress,
      //   signal
      // });
      const response = await filesApi.uploadFile(formData, { onUploadProgress, signal });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message || 'Ошибка загрузки файла');
    }
  }
);

export const updateFile = createAsyncThunk(
  'files/updateFile',
  async ({ id, data }, { rejectWithValue, signal }) => {
    try {
      // const response = await api.patch(`/storage/files/${id}/`, data, { signal });
      const response = await filesApi.updateFile(id, data, signal);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data || 'Ошибка обновления файла');
    }
  }
);

export const updateSharedExpiry = createAsyncThunk(
  'files/updateSharedExpiry',
  async ({ id, expiryDays }, { rejectWithValue, signal }) => {
    try {
      const response = await filesApi.updateFile(id, { 
        expiry_days: expiryDays 
      }, signal);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data || 'Ошибка обновления срока действия ссылки');
    }
  }
);

const filesSlice = createSlice({
  name: 'files',
  initialState: {
    files: [],
    loading: false,
    uploading: false,
    error: null,
  },
  reducers: {
    clearFilesError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.files = action.payload;
        state.loading = false;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(uploadFile.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.files.push(action.payload);
        state.uploading = false;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.error = action.payload;
        state.uploading = false;
      })
      .addCase(updateFile.fulfilled, (state, action) => {
        const index = state.files.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.files[index] = action.payload;
        }
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(file => file.id !== action.payload);
      })
      .addCase(updateSharedExpiry.fulfilled, (state, action) => {
        const index = state.files.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.files[index] = action.payload;
        }
      });
  },
});

export default filesSlice.reducer;
