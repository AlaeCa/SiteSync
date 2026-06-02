package ma.ac.esi.sitesync.material_stock.controller;

import ma.ac.esi.sitesync.material_stock.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tokens")
public class DeviceTokenController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public ResponseEntity<String> enregistrerToken(@RequestBody Map<String, String> body) {
        notificationService.enregistrerToken(body.get("token"));
        return ResponseEntity.ok("Token enregistré");
    }
}