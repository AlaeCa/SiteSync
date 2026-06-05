package ma.ac.esi.sitesync.chantier.service.impl;
 
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.ac.esi.sitesync.chantier.dto.ChantierRequest;
import ma.ac.esi.sitesync.chantier.dto.ChantierResponse;
import ma.ac.esi.sitesync.chantier.exception.ChantierNotFoundException;
import ma.ac.esi.sitesync.chantier.mapper.ChantierMapper;
import ma.ac.esi.sitesync.chantier.model.Chantier;
import ma.ac.esi.sitesync.chantier.model.StatutChantier;
import ma.ac.esi.sitesync.chantier.repository.ChantierRepository;
import ma.ac.esi.sitesync.chantier.service.interfaces.ChantierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;
 
@Service
@RequiredArgsConstructor
@Slf4j
public class ChantierServiceImpl implements ChantierService {

    @Autowired
    private final ChantierRepository repository;
    @Autowired
    private final ChantierMapper mapper;
 
    @Value("${storage.upload-dir}")
    private String uploadDir;
 
    @Override
    public ChantierResponse create(ChantierRequest request) {
        log.info("Création chantier : {}", request.getNom());
        Chantier saved = repository.save(mapper.toModel(request));
        return mapper.toResponse(saved);
    }
 
    @Override
    public ChantierResponse findById(String id) {
        return mapper.toResponse(
            repository.findById(id)
                .orElseThrow(() -> new ChantierNotFoundException(id)));
    }
 
    @Override
    public List<ChantierResponse> findAll() {
        return repository.findAll().stream()
            .map(mapper::toResponse).collect(Collectors.toList());
    }
 
    @Override
    public List<ChantierResponse> findByStatut(StatutChantier statut) {
        return repository.findByStatut(statut).stream()
            .map(mapper::toResponse).collect(Collectors.toList());
    }
 
    @Override
    public List<ChantierResponse> findByResponsable(String responsableId) {
        return repository.findByResponsableId(responsableId).stream()
            .map(mapper::toResponse).collect(Collectors.toList());
    }
 
    @Override
    public List<ChantierResponse> search(String query) {
        return repository
            .findByNomContainingIgnoreCaseOrVilleContainingIgnoreCase(query, query)
            .stream().map(mapper::toResponse).collect(Collectors.toList());
    }
 
    @Override
    public List<ChantierResponse> findNear(double lng, double lat, double rayon) {
        return repository.findChantiersNear(lng, lat, rayon).stream()
            .map(mapper::toResponse).collect(Collectors.toList());
    }
 
    @Override
    public ChantierResponse update(String id, ChantierRequest request) {
        Chantier c = repository.findById(id)
            .orElseThrow(() -> new ChantierNotFoundException(id));
        c.setNom(request.getNom());
        c.setDescription(request.getDescription());
        c.setAdresse(request.getAdresse());
        c.setVille(request.getVille());
        c.setCodePostal(request.getCodePostal());
        c.setCoordinates(new double[]{
            request.getLongitude(), request.getLatitude()});
        c.setStatut(request.getStatut());
        c.setDateDebut(request.getDateDebut());
        c.setDateFin(request.getDateFin());
        c.setResponsableId(request.getResponsableId());
        c.setClientNom(request.getClientNom());
        c.setBudget(request.getBudget());
        c.setDevise(request.getDevise());
        return mapper.toResponse(repository.save(c));
    }
 
    @Override
    public ChantierResponse updateStatut(String id, StatutChantier statut) {
        Chantier c = repository.findById(id)
            .orElseThrow(() -> new ChantierNotFoundException(id));
        c.setStatut(statut);
        return mapper.toResponse(repository.save(c));
    }
 
    @Override
    public ChantierResponse updateAvancement(String id, int avancement) {
        if (avancement < 0 || avancement > 100)
            throw new IllegalArgumentException(
                "L'avancement doit être entre 0 et 100");
        Chantier c = repository.findById(id)
            .orElseThrow(() -> new ChantierNotFoundException(id));
        c.setAvancement(avancement);
        if (avancement == 100) c.setStatut(StatutChantier.TERMINE);
        return mapper.toResponse(repository.save(c));
    }
 
    @Override
    public ChantierResponse addPhoto(String id, MultipartFile file) {
        Chantier c = repository.findById(id)
            .orElseThrow(() -> new ChantierNotFoundException(id));
        String path = saveFile(file, "photos", id);
        if (c.getPhotoPaths() == null) c.setPhotoPaths(new ArrayList<>());
        c.getPhotoPaths().add(path);
        return mapper.toResponse(repository.save(c));
    }
 
    @Override
    public ChantierResponse addDocument(String id, MultipartFile file) {
        Chantier c = repository.findById(id)
            .orElseThrow(() -> new ChantierNotFoundException(id));
        String path = saveFile(file, "documents", id);
        if (c.getDocumentPaths() == null) c.setDocumentPaths(new ArrayList<>());
        c.getDocumentPaths().add(path);
        return mapper.toResponse(repository.save(c));
    }
 
    @Override
    public ChantierResponse addMembre(String id, String membreId) {
        Chantier c = repository.findById(id)
            .orElseThrow(() -> new ChantierNotFoundException(id));
        if (c.getMembreIds() == null) c.setMembreIds(new ArrayList<>());
        if (!c.getMembreIds().contains(membreId))
            c.getMembreIds().add(membreId);
        return mapper.toResponse(repository.save(c));
    }
 
    @Override
    public void delete(String id) {
        if (!repository.existsById(id))
            throw new ChantierNotFoundException(id);
        repository.deleteById(id);
        log.info("Chantier supprimé : {}", id);
    }
 
    // ── Méthode privée : sauvegarde un fichier sur le disque ──────────────
    private String saveFile(MultipartFile file, String subDir, String chantierId) {
        try {
            String original = Objects.requireNonNull(
                file.getOriginalFilename());
            String ext = original.substring(original.lastIndexOf('.'));
            String filename = chantierId + "_" + UUID.randomUUID() + ext;
            Path dir = Paths.get(uploadDir, subDir);
            Files.createDirectories(dir); // Crée le dossier si inexistant
            Files.copy(file.getInputStream(),
                dir.resolve(filename),
                StandardCopyOption.REPLACE_EXISTING);
            return subDir + "/" + filename; // Chemin relatif stocké en BD
        } catch (IOException e) {
            throw new RuntimeException("Erreur upload fichier : " + e.getMessage());
        }
    }
}
