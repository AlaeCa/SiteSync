export type MaterialStatus = 'DISPONIBLE' | 'FAIBLE' | 'EN_RUPTURE';

export type Material = {
  id: string; name: string; category: string; quantity: number; unit: string;
  seuilminal: number; status: MaterialStatus; siteId?: string; unitPrice: number;
};

export type Movement = {
  id: string; materialId: string; type: 'ENTREE' | 'SORTIE';
  quantity: number; reason?: string; movementDate?: string;
};

export type MaterialStats = {
  total: number; disponibles: number; faibles: number; en_rupture: number; valeure_totale: number;
};