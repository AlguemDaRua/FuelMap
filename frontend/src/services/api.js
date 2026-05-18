import axios from 'axios';

// Cria a instância base do axios a apontar para o nosso backend
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor de REQUEST — injeta o Token JWT automaticamente
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

// Interceptor de RESPONSE — trata erros 401 (sessão expirada)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('fuelmap_token');
            // Redireciona para login se o token expirou (excepto se já estamos no /login ou /register)
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/register') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;