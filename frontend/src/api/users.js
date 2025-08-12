import api from './index';

const usersApi = {
  getUsers: (signal) => api.get(
    '/auth/users/',
    { signal }
  ).then(response => {
    console.log('Users data from API:', response.data);
    return response;
  }),

  deleteUser: (id, signal) => api.delete(
    `/auth/users/${id}/`,
    { signal }
  ),

  updateUser: (id, data, signal) => api.patch(
    `/auth/users/${id}/`,
    data,
    { signal }
  ),

  createAdmin: (userData, signal) => api.post(
    '/auth/admin/create/',
    {
      username: userData.username,
      email: userData.email,
      full_name: userData.full_name,
      password: userData.password,
      confirmPassword: userData.confirmPassword
    },
    { signal }
  ),
};

export default usersApi;
