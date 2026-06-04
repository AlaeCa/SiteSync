package ma.ac.esi.sitesync.rapport.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.ac.esi.sitesync.rapport.dto.RapportCreateDto;
import ma.ac.esi.sitesync.rapport.dto.RapportResponseDto;
import ma.ac.esi.sitesync.rapport.model.Rapport;
import ma.ac.esi.sitesync.rapport.service.RapportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rapports")
@RequiredArgsConstructor
@Tag(name = "Rapports", description = "Gestion des rapports de chantier")
public class RapportController {

    private final RapportService rapportService;



    @Operation(
            summary = "Créer un rapport",
            description = "Soumet un nouveau rapport de chantier"
    )
    @PostMapping
    public ResponseEntity<RapportResponseDto> creerRapport(
            @RequestBody RapportCreateDto dto
    ) {

        RapportResponseDto rapport =
                rapportService.creerRapport(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(rapport);
    }

    @Operation(
            summary = "Récupérer les rapports d'un chantier",
            description = "Retourne l'historique complet des rapports triés du plus récent au plus ancien"
    )
    @GetMapping("/{chantierId}")
    public ResponseEntity<List<RapportResponseDto>>
    getRapportsParChantier(
            @PathVariable String chantierId
    ) {

        return ResponseEntity.ok(
                rapportService.getRapportsParChantier(chantierId)
        );
    }
}