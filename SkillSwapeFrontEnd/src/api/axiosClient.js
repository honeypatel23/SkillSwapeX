// import axios from 'axios';

// const axiosClient = axios.create({
//   baseURL: '/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add a response interceptor for global error handling
// axiosClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle errors (e.g., redirect to login on 401)
//     console.error('API Error Response:', error.response);
//     console.error('API Error Message:', error.message);
//     if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//       // Optional: redirect to login
//       // window.location.href = '/'; 
//     }
//     return Promise.reject(error);
//   }
// );

// // Add a request interceptor to attach the token
// axiosClient.interceptors.request.use(
//   (config) => {
//     const storedUser = localStorage.getItem('skillswape_user');
//     if (storedUser) {
//       const user = JSON.parse(storedUser);
//       const token = user.token || user.accessToken;
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     console.log(`Starting Request: ${config.method.toUpperCase()} ${config.url}`);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosClient;

import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */

axiosClient.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("skillswape_user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      const token = user.token || user.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    console.log(`Starting Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

/* ================= RESPONSE INTERCEPTOR ================= */

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    console.error("API Error Response:", error.response);
    console.error("API Error Message:", error.message);

    if (error.response) {

      const status = error.response.status;

      switch (status) {

        case 401:
          console.warn("Unauthorized - Redirecting to login");
          localStorage.removeItem("skillswape_user");
          window.location.href = "/login";
          break;

        case 403:
          alert("Access Denied. You do not have permission.");
          break;

        case 404:
          alert("API endpoint not found (Controller/Action may be wrong)");
          break;

        case 500:
          alert("Internal Server Error. Please try again later.");
          break;

        default:
          alert(`Unexpected Error: ${status}`);
      }

    } else {

      alert("Network Error. Please check your internet connection.");

    }

    return Promise.reject(error);
  }
);

export default axiosClient;
