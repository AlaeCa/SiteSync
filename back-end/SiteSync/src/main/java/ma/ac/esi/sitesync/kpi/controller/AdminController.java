package ma.ac.esi.sitesync.kpi.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import ma.ac.esi.sitesync.kpi.dto.ChantierStatsDTO;
import ma.ac.esi.sitesync.kpi.dto.KPIsDashboardDTO;
import ma.ac.esi.sitesync.kpi.dto.NotificationDTO;
import ma.ac.esi.sitesync.kpi.service.interfaces.AdminService;
import ma.ac.esi.sitesync.kpi.service.interfaces.NotificationService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Admin & KPIs", description = "Statistiques globales, KPIs et notifications admin")
public class AdminController {

    private final AdminService adminService;
    private final NotificationService notificationService;

    @Operation(summary = "Statistiques globales du tableau de bord")
    @GetMapping("/stats/global")
    public ResponseEntity<KPIsDashboardDTO> getGlobalStats() {
        return ResponseEntity.ok(adminService.getGlobalStats());
    }

    @Operation(summary = "Statistiques détaillées d'un chantier")
    @GetMapping("/stats/chantier/{id}")
    public ResponseEntity<ChantierStatsDTO> getChantierStats(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getChantierStats(id));
    }

    @Operation(summary = "Diffuser une notification à tous les utilisateurs")
    @PostMapping("/notifications/broadcast")
    public ResponseEntity<NotificationDTO> broadcastNotification(@RequestBody NotificationDTO notificationDTO) {
        NotificationDTO created = notificationService.broadcast(notificationDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Lister toutes les notifications")
    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationDTO>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @Operation(summary = "KPIs du tableau de bord admin")
    @GetMapping("/dashboard/kpis")
    public ResponseEntity<KPIsDashboardDTO> getDashboardKpis() {
        return ResponseEntity.ok(adminService.getDashboardKPIs());
    }

    @Operation(summary = "Exporter le rapport KPIs au format CSV")
    @GetMapping("/rapports/export")
    public ResponseEntity<ByteArrayResource> exportRapport() {
        byte[] data = adminService.exportRapport();
        ByteArrayResource resource = new ByteArrayResource(data);
        String filename = "rapport_sitesync_" + LocalDate.now() + ".csv";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentLength(data.length)
                .body(resource);
    }
}
