import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.154:8081/api';
// 10.0.2.2 = localhost depuis un émulateur Android
// Si tu testes sur ton vrai téléphone, remplace par ton IP locale ex: http://192.168.1.X:8081/api

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajoute automatiquement le token JWT à chaque requête
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {

  firebaseLogin: (idToken: string) =>
    api.post('/auth/firebase-login', { idToken }),

  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getAllUsers: () => api.get('/users'),

  getUserById: (id: string) => api.get(`/users/${id}`),

  updateRole: (id: string, role: string) =>
    api.put(`/users/${id}/role`, { role }),

  updateStatus: (id: string, status: string) =>
    api.put(`/users/${id}/status`, { status }),
};

export default api;