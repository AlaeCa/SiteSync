package ma.ac.esi.sitesync.material_stock.controller;

import ma.ac.esi.sitesync.material_stock.dto.MaterialDTO;
import ma.ac.esi.sitesync.material_stock.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ma.ac.esi.sitesync.material_stock.dto.MaterialStatDTO;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "*")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @GetMapping
    public ResponseEntity<List<MaterialDTO>> getAllMaterials() {
        return ResponseEntity.ok(materialService.getAllMaterials());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialDTO> getMaterialById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(materialService.getMaterialById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<MaterialDTO> createMaterial(@Valid @RequestBody MaterialDTO materialDTO) {
        return new ResponseEntity<>(materialService.createMaterial(materialDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaterialDTO> updateMaterial(@PathVariable String id, @Valid @RequestBody MaterialDTO materialDTO) {
        try {
            return ResponseEntity.ok(materialService.updateMaterial(id, materialDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/alerts")
    public List<MaterialDTO> getMaterialsInAlert() {
        return materialService.getMaterialsInAlert();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable String id) {
        try {
            materialService.deleteMaterial(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/stats")
    public MaterialStatDTO getMaterialStats() {
        return materialService.getMaterialStat();
    }
}