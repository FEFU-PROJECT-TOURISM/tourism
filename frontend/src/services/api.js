// src/services/api.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

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

export const createPoint = async (pointData, photos) => {
  const formData = new FormData();
  formData.append('point_add', JSON.stringify(pointData));
  photos.forEach(photo => {
    formData.append('photos', photo);
  });

  const response = await api.post('/point', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// === Туры ===
export const createTour = async (tourData) => {
  try {
    const response = await api.post('/tour', tourData);
    return response.data;
  } catch (error) {
    console.error('Ошибка создания тура:', error);
    throw error;
  }
};
