// Определяем базовый URL API в зависимости от окружения
// В продакшене используем относительный путь, чтобы nginx мог проксировать
// В разработке используем полный URL
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8000/api' 
  : '/api'; // Относительный путь - будет использовать тот же протокол и хост