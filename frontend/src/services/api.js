import axios from 'axios';

// Cria a instância base do axios a apontar para o nosso backend
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Vai buscar à API local por agora
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para injetar o Token de Login em todos os pedidos futuros
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('fuelmap_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;