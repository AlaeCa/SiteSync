import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_API_URL = 'http://192.168.1.3:8080/api';
// 10.0.2.2 = localhost depuis un émulateur Android
// Si tu testes sur ton vrai téléphone, remplace par ton IP locale ex: http://192.168.1.X:8085/api

const adminApi = axios.create({
  baseURL: ADMIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ChantierStatsDTO {
  chantierId: string;
  nom: string;
  statut: string;
  dateDebut: string;
  dateFinPrevue: string;
  dateFinReelle: string | null;
  budgetPrevisionnel: number;
  coutReel: number;
  ecartBudgetaire: number;
  tauxAvancement: number;
  retardEnJours: number;
  nombreTaches: number;
  tachesTerminees: number;
  tachesEnRetard: number;
}

export interface KPIsDashboardDTO {
  totalChantiers: number;
  chantiersActifs: number;
  chantiersTermines: number;
  chantiersPlanifies: number;
  chantiersEnRetard: number;
  budgetTotalPrevisionnel: number;
  coutTotalReel: number;
  depassementBudgetairePourcentage: number;
  tauxAvancementMoyen: number;
  notificationsNonLues: number;
  chantiersEnRetardDetails: ChantierStatsDTO[];
  genereLe: string;
}

export interface NotificationDTO {
  id: string;
  type: string;
  message: string;
  destinataires: string[];
  lu: boolean;
  createdAt: string;
}

export interface BroadcastNotificationPayload {
  type: string;
  message: string;
  destinataires: string[];
}

export const adminAPI = {
  getGlobalStats: () => adminApi.get<KPIsDashboardDTO>('/stats/global'),

  getChantierStats: (chantierId: string) =>
    adminApi.get<ChantierStatsDTO>(`/stats/chantier/${chantierId}`),

  broadcastNotification: (payload: BroadcastNotificationPayload) =>
    adminApi.post<NotificationDTO>('/notifications/broadcast', payload),

  getDashboardKPIs: () => adminApi.get<KPIsDashboardDTO>('/dashboard/kpis'),

  exportRapport: () => adminApi.get<string>('/rapports/export', { responseType: 'text' }),
};

export async function getGlobalStats(): Promise<KPIsDashboardDTO> {
  const { data } = await adminAPI.getGlobalStats();
  return data;
}

export async function getChantierStats(chantierId: string): Promise<ChantierStatsDTO> {
  const { data } = await adminAPI.getChantierStats(chantierId);
  return data;
}

export async function broadcastNotification(
  payload: BroadcastNotificationPayload,
): Promise<NotificationDTO> {
  const { data } = await adminAPI.broadcastNotification(payload);
  return data;
}

export async function getDashboardKPIs(): Promise<KPIsDashboardDTO> {
  const { data } = await adminAPI.getDashboardKPIs();
  return data;
}

export async function exportRapport(): Promise<string> {
  const { data } = await adminAPI.exportRapport();
  return data;
}

export default adminApi;
