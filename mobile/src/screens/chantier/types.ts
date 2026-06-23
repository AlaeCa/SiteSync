// Ce fichier décrit la forme exacte des données du backend.
 
export type StatutChantier = 'PLANIFIE' | 'EN_COURS' | 'SUSPENDU' | 'TERMINE';
 
// Correspond au ChantierResponse.java
export interface Chantier {
    id: string;
    nom: string;
    description?: string;
    adresse: string;
    ville: string;
    codePostal?: string;
    longitude: number;
    latitude: number;
    statut: StatutChantier;
    avancement: number;
    dateDebut: string;
    dateFin?: string;
    responsableId: string;
    clientNom?: string;
    budget: number;
    devise: string;
    photoUrls: string[];
    documentUrls: string[];
    nombreMembres: number;
    createdAt: string;
    updatedAt: string;
}
 
// Correspond au ChantierRequest.java
export interface ChantierRequest {
    nom: string;
    description?: string;
    adresse: string;
    ville: string;
    codePostal?: string;
    longitude: number;
    latitude: number;
    statut?: StatutChantier;
    dateDebut: string;
    dateFin?: string;
    responsableId: string;
    clientNom?: string;
    budget?: number;
    devise?: string;
}
 
// Correspond au ApiResponse.java
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}