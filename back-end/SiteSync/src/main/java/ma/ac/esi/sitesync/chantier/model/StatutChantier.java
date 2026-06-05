package ma.ac.esi.sitesync.chantier.model;
 
public enum StatutChantier {
    PLANIFIE,   // Chantier créé, pas encore commencé
    EN_COURS,   // Chantier actif
    SUSPENDU,   // Temporairement arrêté
    TERMINE     // Terminé (avancement = 100%)
}

