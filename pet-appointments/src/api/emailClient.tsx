// src/api/emailClient.ts
import axios from 'axios';

export const emailClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Consistent error handling pattern with your other clients
emailClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Email Service API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);