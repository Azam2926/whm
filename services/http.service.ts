import axios from 'axios';

export const API_URL = 'https://warehouse-app-l6ug.onrender.com/v1';
// export const API_URL = 'http://localhost:3001/';

const api = axios.create({
    baseURL: `${API_URL}/`
});

export default api;
