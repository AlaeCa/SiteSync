export interface Stock {
  id?: string;
  materialId: string;
  type: 'ENTREE' | 'SORTIE';
  quantity: number;
  reason?: string;
  movementDate?: string;
}