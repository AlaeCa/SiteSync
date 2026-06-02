package ma.ac.esi.sitesync.material_stock.service;

import ma.ac.esi.sitesync.material_stock.dto.MaterialDTO;
import ma.ac.esi.sitesync.material_stock.dto.StockDTO;
import ma.ac.esi.sitesync.material_stock.dto.MaterialStatDTO;

import java.util.List;

public interface MaterialService {
    List<MaterialDTO> getAllMaterials();
    List<MaterialDTO> getMaterialsInAlert();
    MaterialDTO getMaterialById(String id);
    MaterialDTO createMaterial(MaterialDTO materialDTO);
    MaterialDTO updateMaterial(String id, MaterialDTO materialDTO);
    void deleteMaterial(String id);
    StockDTO addStockMovement(StockDTO stockDTO);
    List<StockDTO> getStockMovementsByMaterial(String materialId);
    MaterialStatDTO getMaterialStat();
}