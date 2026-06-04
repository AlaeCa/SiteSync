package ma.ac.esi.sitesync.chantier.dto;
 
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import ma.ac.esi.sitesync.chantier.model.StatutChantier;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
 
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ChantierResponse {
    private String id;
    private String nom;
    private String description;
    private String adresse;
    private String ville;
    private String codePostal;
    private double longitude;
    private double latitude;
    private StatutChantier statut;
    private int avancement;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String responsableId;
    private String clientNom;
    private double budget;
    private String devise;
    private List<String> photoUrls;    // URLs complètes des photos
    private List<String> documentUrls;
    private int nombreMembres;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
