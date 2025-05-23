
import axios from "axios";
import Cookies from "js-cookie";
import baseURL from "./baseURL";
import Swal from "sweetalert2";

// Create an Axios instance

const axiosInstance = axios.create({
  baseURL: baseURL, // Replace with your API base URL
});

// Function to attach navigate dynamically
let navigateFn = null;

export const setNavigate = (navigate) => {
  navigateFn = navigate;
};

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    // const token = Cookies.get('token'); // Retrieve token from cookies
    const userCookie = Cookies.get("user");
    const user = userCookie ? JSON.parse(userCookie) : null;
    const token = user?.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Response Interceptor: Handle Token Expiry & Blocked Users
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.log("Token expired, redirecting to login...");
        Cookies.remove("user"); // Remove expired token
        // window.location.href = "/login"; // Redirect to login
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Your session has expired. Please log in again.",
          confirmButtonText: "OK",
        }).then(() => {
          if (navigateFn) navigateFn("/login");
        });
        
      }

      if (status === 403) {
        console.log("User is blocked, logging out...");
        // alert("Your account has been blocked by the admin.");

        // Remove user session
        Cookies.remove("user");
        Swal.fire({
          icon: "error",
          title: "Account Blocked",
          text: "Your account has been blocked by the admin.",
          confirmButtonText: "OK",
        }).then(() => {
          if (navigateFn) navigateFn("/login");
        });
        // window.location.href = "/login"; // Redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
