package ma.ac.esi.chantier.mapper;
 
import ma.ac.esi.chantier.dto.ChantierRequest;
import ma.ac.esi.chantier.dto.ChantierResponse;
import ma.ac.esi.chantier.model.Chantier;
import org.springframework.stereotype.Component;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
 
@Component  // Spring va créer une instance de cette classe automatiquement
public class ChantierMapper {
 
    // URL de base pour les fichiers (doit correspondre à l'endpoint /files/)
    private static final String FILE_BASE_URL = "/api/chantiers/files/";
 
    // Convertit un ChantierRequest (données reçues) en Chantier (modèle BD)
    public Chantier toModel(ChantierRequest req) {
        return Chantier.builder()
            .nom(req.getNom())
            .description(req.getDescription())
            .adresse(req.getAdresse())
            .ville(req.getVille())
            .codePostal(req.getCodePostal())
            // IMPORTANT : MongoDB attend [longitude, latitude]
            .coordinates(new double[]{req.getLongitude(), req.getLatitude()})
            .statut(req.getStatut())
            .avancement(0)
            .dateDebut(req.getDateDebut())
            .dateFin(req.getDateFin())
            .responsableId(req.getResponsableId())
            .clientNom(req.getClientNom())
            .budget(req.getBudget())
            .devise(req.getDevise())
            .photoPaths(Collections.emptyList())
            .documentPaths(Collections.emptyList())
            .membreIds(Collections.emptyList())
            .build();
    }
 
    // Convertit un Chantier (modèle BD) en ChantierResponse (données envoyées)
    public ChantierResponse toResponse(Chantier c) {
        return ChantierResponse.builder()
            .id(c.getId())
            .nom(c.getNom())
            .description(c.getDescription())
            .adresse(c.getAdresse())
            .ville(c.getVille())
            .codePostal(c.getCodePostal())
            .longitude(c.getCoordinates() != null ? c.getCoordinates()[0] : 0)
            .latitude(c.getCoordinates() != null ? c.getCoordinates()[1] : 0)
            .statut(c.getStatut())
            .avancement(c.getAvancement())
            .dateDebut(c.getDateDebut())
            .dateFin(c.getDateFin())
            .responsableId(c.getResponsableId())
            .clientNom(c.getClientNom())
            .budget(c.getBudget())
            .devise(c.getDevise())
            .photoUrls(convertPaths(c.getPhotoPaths()))
            .documentUrls(convertPaths(c.getDocumentPaths()))
            .nombreMembres(c.getMembreIds() != null ? c.getMembreIds().size() : 0)
            .createdAt(c.getCreatedAt())
            .updatedAt(c.getUpdatedAt())
            .build();
    }
 
    // Convertit les chemins de fichiers en URLs accessibles
    private List<String> convertPaths(List<String> paths) {
        if (paths == null || paths.isEmpty()) return Collections.emptyList();
        return paths.stream()
            .map(p -> FILE_BASE_URL + p.replace("\\", "/"))
            .collect(Collectors.toList());
    }
}
