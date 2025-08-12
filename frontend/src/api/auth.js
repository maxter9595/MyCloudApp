import api from './index';


const authApi = {
  login: (credentials, signal) => api.post(
    '/auth/login/',
    credentials,
    { signal }
  ),

  register: (userData, signal) => api.post(
    '/auth/register/',
    userData,
    { signal }
  ),

  logout: (signal) => api.post(
    '/auth/logout/',
    {},
    { signal }
  ),

  getMe: (signal) => api.get(
    '/auth/users/me/',
    {},
    { signal }
  ),
};

export default authApi;
