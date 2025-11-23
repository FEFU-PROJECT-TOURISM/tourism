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
