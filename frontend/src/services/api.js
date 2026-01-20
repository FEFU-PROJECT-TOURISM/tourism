// src/services/api.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import { getToken } from './auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Увеличено до 30 секунд для загрузки больших файлов
});

// Добавляем токен к каждому запросу
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Обрабатываем ошибки авторизации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или невалиден
      localStorage.removeItem('token');
      localStorage.removeItem('organization');
      window.location.href = '/login';
    }
    // Улучшаем формат ошибки для детального отображения
    const enhancedError = {
      ...error,
      statusCode: error.response?.status,
      message: error.response?.data?.detail || error.response?.data?.message || error.message || 'Неизвестная ошибка',
      details: error.response?.data,
      originalError: error,
    };
    return Promise.reject(enhancedError);
  }
);

export const getTours = async () => {
  try {
    const response = await api.get('/tour');
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки экскурсий:', error);
    throw new Error('Не удалось загрузить экскурсии');
  }
};


// === Точки ===
export const getPoints = async () => {
  try {
    const response = await api.get('/point');
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки точек:', error);
    throw error;
  }
};

export const createPoint = async (pointData, photos = []) => {
  try {
    const formData = new FormData();
    formData.append('point_add', JSON.stringify(pointData));
    
    // Добавляем фото только если они есть
    if (photos && photos.length > 0) {
      photos.forEach(photo => {
        formData.append('photos', photo);
      });
    }

    const response = await api.post('/point', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: photos && photos.length > 0 ? 60000 : 30000, // 60 секунд для загрузки файлов, 30 для без файлов
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка создания точки:', error);
    if (error.response) {
      // Сервер ответил с ошибкой
      const errorDetail = error.response.data?.detail || error.response.data?.message;
      if (typeof errorDetail === 'string') {
        throw new Error(errorDetail);
      } else if (Array.isArray(errorDetail)) {
        // Pydantic validation errors
        const errors = errorDetail.map(e => `${e.loc?.join('.')}: ${e.msg}`).join(', ');
        throw new Error(`Ошибка валидации: ${errors}`);
      }
      throw new Error('Ошибка создания точки');
    } else if (error.request) {
      // Запрос был отправлен, но ответа не получено (таймаут, сеть)
      throw new Error('Превышено время ожидания. Проверьте подключение к интернету и размер файлов.');
    } else {
      // Ошибка при настройке запроса
      throw new Error(error.message || 'Ошибка создания точки');
    }
  }
};

// === Туры ===
export const createTour = async (tourData) => {
  try {
    const response = await api.post('/tour', tourData);
    return response.data;
  } catch (error) {
    console.error('Ошибка создания тура:', error);
    // Ошибка уже обработана в interceptor, просто пробрасываем дальше
    throw error;
  }
};

export const getTourById = async (tourId) => {
  try {
    const response = await api.get(`/tour/${tourId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка загрузки тура ${tourId}:`, error);
    throw error;
  }
};
