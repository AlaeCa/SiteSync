import api from '../../services/api';
import { Chantier, ChantierRequest } from './types';

export const chantierService = {
  async getAll(statut?: string, search?: string): Promise<Chantier[]> {
    const res = await api.get('/chantier', { params: { statut, search } });
    
    return res.data.data;
  },
  async getById(id: string): Promise<Chantier> {
    const res = await api.get(`/chantier/${id}`);
    return res.data.data;
  },
  async create(data: ChantierRequest): Promise<Chantier> {
    const res = await api.post('/chantier', data);
    return res.data.data;
  },
  async updateAvancement(id: string, avancement: number): Promise<Chantier> {
    const res = await api.patch(`/chantier/${id}/avancement`, null, { params: { avancement } });
    return res.data.data;
  },
  async delete(id: string): Promise<void> {
    await api.delete(`/chantier/${id}`);
  },
  
}