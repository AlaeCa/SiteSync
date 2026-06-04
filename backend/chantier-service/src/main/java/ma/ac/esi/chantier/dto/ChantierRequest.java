package ma.ac.esi.chantier.dto;
 
import jakarta.validation.constraints.*;
import lombok.Data;
import ma.ac.esi.chantier.model.StatutChantier;
import java.time.LocalDate;
 
@Data
public class ChantierRequest {
 
    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 3, max = 100, message = "Le nom doit avoir entre 3 et 100 caractères")
    private String nom;
 
    private String description;
 
    @NotBlank(message = "L'adresse est obligatoire")
    private String adresse;
 
    @NotBlank(message = "La ville est obligatoire")
    private String ville;
 
    private String codePostal;
 
    @NotNull(message = "La longitude est obligatoire")
    @DecimalMin(value = "-180.0", message = "Longitude invalide")
    @DecimalMax(value = "180.0", message = "Longitude invalide")
    private Double longitude;
 
    @NotNull(message = "La latitude est obligatoire")
    @DecimalMin(value = "-90.0", message = "Latitude invalide")
    @DecimalMax(value = "90.0", message = "Latitude invalide")
    private Double latitude;
 
    private StatutChantier statut = StatutChantier.PLANIFIE;
 
    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;
 
    private LocalDate dateFin;
 
    @NotBlank(message = "Le responsable est obligatoire")
    private String responsableId;
 
    private String clientNom;
 
    @PositiveOrZero(message = "Le budget ne peut pas être négatif")
    private double budget = 0;
 
    private String devise = "MAD";
}
