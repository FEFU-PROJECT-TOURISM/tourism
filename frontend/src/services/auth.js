// src/services/auth.js
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const register = async (orgData) => {
  try {
    const response = await authApi.post('/auth/register', orgData);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('organization', JSON.stringify(response.data.organization));
    }
    return response.data;
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    throw error;
  }
};

export const login = async (loginData) => {
  try {
    const response = await authApi.post('/auth/login', loginData);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('organization', JSON.stringify(response.data.organization));
    }
    return response.data;
  } catch (error) {
    console.error('Ошибка входа:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('organization');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getOrganization = () => {
  const org = localStorage.getItem('organization');
  return org ? JSON.parse(org) : null;
};

export const isAuthenticated = () => {
  return !!getToken();
};
