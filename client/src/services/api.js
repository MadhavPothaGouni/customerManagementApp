// client/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000/api'
});

// In production (if server serves build), baseURL '' lets calls go to same origin /api/...
export default api;
