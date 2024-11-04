// src/api/client.ts
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7255'; // Update with your API URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Optional: Add interceptors for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors (e.g., show toast notification)
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);