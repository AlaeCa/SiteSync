import api from '../../services/api';
import { Material, Movement, MaterialStats } from './types';

export const getMaterials = () => api.get<Material[]>('/materials');
export const createMaterial = (m: Partial<Material>) => api.post('/materials', m);
export const updateMaterial = (id: string, m: Partial<Material>) => api.put(`/materials/${id}`, m);
export const deleteMaterial = (id: string) => api.delete(`/materials/${id}`);
export const getStats = () => api.get<MaterialStats>('/materials/stats');
export const getMovements = (materialId: string) => api.get<Movement[]>(`/stocks/material/${materialId}`);
export const createMovement = (mv: Partial<Movement>) => api.post('/stocks', mv);