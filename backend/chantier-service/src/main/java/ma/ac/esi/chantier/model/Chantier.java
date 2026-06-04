package ma.ac.esi.chantier.model;
 
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
 
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chantiers")
public class Chantier {
 
    @Id
    private String id;              // MongoDB génère automatiquement cet ID
 
    private String nom;             // Nom du chantier
    private String description;     // Description détaillée
    private String adresse;         // Adresse physique
    private String ville;
    private String codePostal;
 
    // Index géospatial 2dsphere pour les requêtes de proximité GPS
    // IMPORTANT : MongoDB attend [longitude, latitude] dans cet ordre
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private double[] coordinates;   // [longitude, latitude]
 
    private StatutChantier statut;  // PLANIFIE, EN_COURS, SUSPENDU, TERMINE
    private int avancement;         // Pourcentage 0-100
 
    private LocalDate dateDebut;
    private LocalDate dateFin;      // Peut être null si pas encore définie
 
    private String responsableId;   // UID Firebase du responsable
    private String clientNom;
    private double budget;
    private String devise;          // ex: MAD, EUR
 
    private List<String> photoPaths;     // Chemins relatifs des photos
    private List<String> documentPaths;  // Chemins relatifs des documents
    private List<String> membreIds;      // UIDs Firebase des membres
 
    @CreatedDate
    private LocalDateTime createdAt;     // Rempli automatiquement à la création
 
    @LastModifiedDate
    private LocalDateTime updatedAt;     // Mis à jour automatiquement
}

