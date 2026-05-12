import axios from "axios";

// This points to your Node.js backend
const api = axios.create({
baseURL: 'https://devatesting.rakvihorganic.com/api',
});

export default api;