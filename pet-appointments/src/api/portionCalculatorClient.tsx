// src/api/portionCalculatorClient.ts
import axios from 'axios';

export const portionCalculatorClient = axios.create({
  baseURL: 'http://localhost:3025',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Optional: Add the same error handling as your main client
portionCalculatorClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Portion Calculator API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);