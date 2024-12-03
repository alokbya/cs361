// src/api/reportClient.ts
import axios from 'axios';

const REPORT_API_BASE_URL = 'http://localhost:3026';

export const reportClient = axios.create({
  baseURL: REPORT_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

reportClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Report API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);