import axios from 'axios';

const api = axios.create({
  baseURL: 'https://warehouse-app-l6ug.onrender.com/v1/',
});

export default api;
