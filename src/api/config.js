import axios from 'axios';

// API Token
export const API_TOKEN = "45UUXAPg34nKjGVdMpss7iwhccn7xPg4corm_X1c";

// Base API URL
export const BASE_URL = "https://noco-erp.com/api/v2";

// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'xc-token': API_TOKEN
  }
});

export default apiClient;