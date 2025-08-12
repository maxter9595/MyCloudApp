import api from './index';

const filesApi = {
  getFiles: (userId = null, signal) => {
    const params = userId ? { user_id: userId } : {};
    return api.get('/storage/files/', { params, signal });
  },

  uploadFile: (formData, { onUploadProgress, signal } = {}) => 
    api.post('/storage/files/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
      signal,
    }),

  deleteFile: (id, signal) => api.delete(`/storage/files/${id}/`, { signal }),

  downloadFile: (id, signal) => api.get(`/storage/files/${id}/download/`, {
    responseType: 'blob',
    headers: { 'Accept': 'application/octet-stream' },
    signal,
  }),

  updateFile: (id, data, signal) => api.patch(`/storage/files/${id}/`, data, { signal }),
};

export default filesApi;
