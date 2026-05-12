import axios from "axios";

// This points to your Node.js backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export default api;