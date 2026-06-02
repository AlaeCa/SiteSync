package ma.ac.esi.sitesync.material_stock.controller;

import ma.ac.esi.sitesync.material_stock.dto.StockDTO;
import ma.ac.esi.sitesync.material_stock.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin("*")
public class StockController {

    @Autowired
    private MaterialService materialService;

    @PostMapping
    public StockDTO addStockMovement(@Valid @RequestBody StockDTO stockDTO) {
        return materialService.addStockMovement(stockDTO);
    }

    @GetMapping("/material/{materialId}")
    public List<StockDTO> getStockMovementsByMaterial(@PathVariable String materialId) {
        return materialService.getStockMovementsByMaterial(materialId);
    }
}