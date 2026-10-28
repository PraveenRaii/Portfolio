import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Send httpOnly cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for centralized error response handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    // If session expired or unauthorized, emit custom event or allow callers to handle
    if (error.response?.status === 401) {
      // Event can be captured by AuthContext for auto-logout
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
