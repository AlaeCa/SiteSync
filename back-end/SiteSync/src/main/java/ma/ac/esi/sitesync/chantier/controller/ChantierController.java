package ma.ac.esi.sitesync.chantier.controller;
 
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.ac.esi.sitesync.chantier.dto.*;
import ma.ac.esi.sitesync.chantier.model.StatutChantier;
import ma.ac.esi.sitesync.chantier.service.interfaces.ChantierService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
 
@RestController
@RequestMapping("/api/chantier")   // context-path = /api/chantiers (dans application.yml)
@RequiredArgsConstructor
@Tag(name = "Chantiers", description = "API de gestion des chantiers BTP")
public class ChantierController {
 
    private final ChantierService service;
 
    @Value("${storage.upload-dir}")
    private String uploadDir;
 
    // POST /api/chantiers → Créer un chantier
    @Operation(summary = "Créer un nouveau chantier")
    @PostMapping
    public ResponseEntity<ApiResponse<ChantierResponse>> create(
            @Valid @RequestBody ChantierRequest request) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.ok(service.create(request),
                "Chantier créé avec succès"));
    }
 
    // GET /api/chantiers → Liste (avec filtres optionnels)
    @Operation(summary = "Lister les chantiers")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ChantierResponse>>> getAll(
            @RequestParam(required = false) StatutChantier statut,
            @RequestParam(required = false) String search) {
        List<ChantierResponse> data;
        if (search != null && !search.isBlank())
            data = service.search(search);
        else if (statut != null)
            data = service.findByStatut(statut);
        else
            data = service.findAll();
        return ResponseEntity.ok(ApiResponse.ok(data, "OK"));
    }
 
    // GET /api/chantiers/{id} → Détail
    @Operation(summary = "Détail d'un chantier")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ChantierResponse>> getById(
            @PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id), "OK"));
    }
 
    // GET /api/chantiers/near?lng=...&lat=...&rayon=...
    @Operation(summary = "Chantiers à proximité GPS")
    @GetMapping("/near")
    public ResponseEntity<ApiResponse<List<ChantierResponse>>> getNear(
            @RequestParam double lng,
            @RequestParam double lat,
            @RequestParam(defaultValue = "50000") double rayon) {
        return ResponseEntity.ok(ApiResponse.ok(
            service.findNear(lng, lat, rayon), "OK"));
    }
 
    // GET /api/chantiers/responsable/{id}
    @Operation(summary = "Chantiers d'un responsable")
    @GetMapping("/responsable/{responsableId}")
    public ResponseEntity<ApiResponse<List<ChantierResponse>>> getByResponsable(
            @PathVariable String responsableId) {
        return ResponseEntity.ok(ApiResponse.ok(
            service.findByResponsable(responsableId), "OK"));
    }
 
    // PUT /api/chantiers/{id} → Modifier
    @Operation(summary = "Modifier un chantier")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ChantierResponse>> update(
            @PathVariable String id,
            @Valid @RequestBody ChantierRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
            service.update(id, request), "Mis à jour"));
    }
 
    // PATCH /api/chantiers/{id}/statut?statut=EN_COURS
    @Operation(summary = "Changer le statut")
    @PatchMapping("/{id}/statut")
    public ResponseEntity<ApiResponse<ChantierResponse>> updateStatut(
            @PathVariable String id,
            @RequestParam StatutChantier statut) {
        return ResponseEntity.ok(ApiResponse.ok(
            service.updateStatut(id, statut), "Statut mis à jour"));
    }
 
    // PATCH /api/chantiers/{id}/avancement?avancement=75
    @Operation(summary = "Mettre à jour l'avancement")
    @PatchMapping("/{id}/avancement")
    public ResponseEntity<ApiResponse<ChantierResponse>> updateAvancement(
            @PathVariable String id,
            @RequestParam int avancement) {
        return ResponseEntity.ok(ApiResponse.ok(
            service.updateAvancement(id, avancement), "Avancement mis à jour"));
    }
 
    // POST /api/chantiers/{id}/photos (multipart/form-data)
    @Operation(summary = "Uploader une photo terrain")
    @PostMapping(value = "/{id}/photos",
                 consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ChantierResponse>> uploadPhoto(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.ok(
            service.addPhoto(id, file), "Photo ajoutée"));
    }
 
    // POST /api/chantiers/{id}/documents
    @Operation(summary = "Uploader un document")
    @PostMapping(value = "/{id}/documents",
                 consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ChantierResponse>> uploadDocument(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.ok(
            service.addDocument(id, file), "Document ajouté"));
    }
 
    // POST /api/chantiers/{id}/membres/{membreId}
    @Operation(summary = "Ajouter un membre")
    @PostMapping("/{id}/membres/{membreId}")
    public ResponseEntity<ApiResponse<ChantierResponse>> addMembre(
            @PathVariable String id, @PathVariable String membreId) {
        return ResponseEntity.ok(ApiResponse.ok(
            service.addMembre(id, membreId), "Membre ajouté"));
    }
 
    // DELETE /api/chantiers/{id}
    @Operation(summary = "Supprimer un chantier")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Supprimé"));
    }
 
    // GET /api/chantiers/files/photos/nom_fichier.jpg → Servir un fichier
    @GetMapping("/files/{subDir}/{filename:.+}")
    public ResponseEntity<Resource> serveFile(
            @PathVariable String subDir,
            @PathVariable String filename) throws MalformedURLException {
        Path filePath = Paths.get(uploadDir).resolve(subDir).resolve(filename);
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists())
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(resource);
    }
}
