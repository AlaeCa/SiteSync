export enum TaskStatus {
  TO_DO = "A_FARE",
  IN_PROGRESS = "EN_COURS",
  COMPLETED = "TERMINE",
}

export enum StatutChantier {
  A_VENIR = "A_VENIR",
  EN_COURS = "EN_COURS",
  SUSPENDU = "SUSPENDU",
  TERMINE = "TERMINE"
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string; // LocalDateTime ISO
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'USER' | 'CHEF' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export interface ChantierResponse {
  id: string;
  nom: string;
  description: string;
  adresse: string;
  ville: string;
  codePostal: string;
  longitude: number;
  latitude: number;
  statut: StatutChantier;
  avancement: number;
  dateDebut: string;
  dateFin: string;
  responsableId: string;
  clientNom: string;
  budget: number;
  devise: string;
  photoUrls: string[];
  documentUrls: string[];
  nombreMembres: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateDto {
  titre: string;
  description: string;
  statut: TaskStatus;
  chantierId: string;
  assigneA: string[]; // List d'IDs d'utilisateurs
  dateDebut: string;  // Date ISO
  dateFin: string;    // Date ISO
}

export interface TaskResponseDto {
  id: string;
  titre: string;
  description: string;
  statut: TaskStatus;
  chantierId: string;
  assigneA: string[];
  dateDebut: string;
  dateFin: string;
  // Optional extension for visual styling in the front-end
  priority?: 'URGENT' | 'MEDIUM' | 'ROUTINE';
}

export interface TaskUpdateDto extends TaskCreateDto {}

export interface TaskUpdateStatusDto {
  status: TaskStatus;
}

export interface RapportCreateDto {
  chantierId: string;
  auteurId: string;
  observations: string;
  photos: string[]; // URLs ou chaînes Base64
}

export interface RapportResponseDto {
  id: string;
  chantierId: string;
  auteurId: string;
  date: string;
  observations: string;
  photos: string[];
}
