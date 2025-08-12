import api from './index';

const authApi = {
  /**
   * Sends a POST request to the login 
   * endpoint with the given credentials.
   * 
   * @param {Object} credentials - The 
   * credentials to use for the login request.
   * @returns {Promise} The API 
   * response from the login request.
   */
  login: (credentials, signal) => api.post(
    '/auth/login/',
    credentials,
    { signal }
  ),

  /**
   * Sends a POST request to the register 
   * endpoint with the given user data.
   * 
   * @param {Object} userData - The user 
   * data to use for the register request.
   * @returns {Promise} The API response 
   * from the register request.
   */
  register: (userData, signal) => api.post(
    '/auth/register/',
    userData,
    { signal }
  ),

  /**
   * Sends a POST request to 
   * the logout endpoint.
   * 
   * @returns {Promise} The API 
   * response from the logout request.
   */
  logout: (signal) => api.post(
    '/auth/logout/',
    {},
    { signal }
  ),

  /**
   * Sends a GET request to the user 
   * endpoint for the current user.
   * 
   * @returns {Promise} The API 
   * response from the user request.
   */
  getMe: (signal) => api.get(
    '/auth/users/me/',
    {},
    { signal }
  ),
};

export default authApi;
