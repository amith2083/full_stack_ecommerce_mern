// utils/axiosConfig.js
import axios from 'axios';
import Cookies from 'js-cookie';
import baseURL from './baseURL';

// Create an Axios instance
console.log('base',baseURL)
const axiosInstance = axios.create({
  baseURL: baseURL, // Replace with your API base URL
});

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    // const token = Cookies.get('token'); // Retrieve token from cookies
    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;
    const token = user?.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Response Interceptor to handle token expiry
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.log('Token expired, redirecting to login...');
//       Cookies.remove('user'); // Remove expired token
//       window.location.href = '/login'; // Redirect to login
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
