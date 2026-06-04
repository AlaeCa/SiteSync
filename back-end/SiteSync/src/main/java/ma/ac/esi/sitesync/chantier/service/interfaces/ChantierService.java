package ma.ac.esi.sitesync.chantier.service.interfaces;
 
import ma.ac.esi.sitesync.chantier.dto.ChantierRequest;
import ma.ac.esi.sitesync.chantier.dto.ChantierResponse;
import ma.ac.esi.sitesync.chantier.model.StatutChantier;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
 
public interface ChantierService {
    ChantierResponse create(ChantierRequest request);
    ChantierResponse findById(String id);
    List<ChantierResponse> findAll();
    List<ChantierResponse> findByStatut(StatutChantier statut);
    List<ChantierResponse> findByResponsable(String responsableId);
    List<ChantierResponse> search(String query);
    List<ChantierResponse> findNear(double lng, double lat, double rayon);
    ChantierResponse update(String id, ChantierRequest request);
    ChantierResponse updateStatut(String id, StatutChantier statut);
    ChantierResponse updateAvancement(String id, int avancement);
    ChantierResponse addPhoto(String id, MultipartFile file);
    ChantierResponse addDocument(String id, MultipartFile file);
    ChantierResponse addMembre(String id, String membreId);
    void delete(String id);
}
