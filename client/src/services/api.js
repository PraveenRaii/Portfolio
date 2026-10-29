import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Send httpOnly cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token and handle multipart/form-data with proper boundary
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    // Let browser/Axios automatically set multipart/form-data boundary
    delete config.headers['Content-Type'];
  }
  return config;
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
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes('/auth/login') &&
      !error.config?.url?.includes('/auth/register') &&
      !error.config?.url?.includes('/public')
    ) {
      // Event can be captured by AuthContext for auto-logout
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
