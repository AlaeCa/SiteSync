import { Chantier, ChantierRequest, ApiResponse } from '../types/chantier.types';
 
// Remplace par l'IP de TON ordinateur trouvée avec ipconfig
const BASE_URL = 'http://192.168.1.9:8082/api/chantiers';
 
async function handleResponse<T>(response: Response): Promise<T> {
    const json: ApiResponse<T> = await response.json();
    if (!response.ok || !json.success) {
        throw new Error(json.message || `Erreur HTTP ${response.status}`);
    }
    return json.data;
}
 
export const chantierService = {
 
    async getAll(statut?: string, search?: string): Promise<Chantier[]> {
        const params = new URLSearchParams();
        if (statut) params.set('statut', statut);
        if (search) params.set('search', search);
        const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
        const response = await fetch(url);
        return handleResponse<Chantier[]>(response);
    },
 
    async getById(id: string): Promise<Chantier> {
        const response = await fetch(`${BASE_URL}/${id}`);
        return handleResponse<Chantier>(response);
    },
 
    async create(data: ChantierRequest): Promise<Chantier> {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse<Chantier>(response);
    },
 
    async updateAvancement(id: string, avancement: number): Promise<Chantier> {
        const response = await fetch(
            `${BASE_URL}/${id}/avancement?avancement=${avancement}`,
            { method: 'PATCH' }
        );
        return handleResponse<Chantier>(response);
    },
 
    async delete(id: string): Promise<void> {
        const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
        await handleResponse<null>(response);
    },
};
