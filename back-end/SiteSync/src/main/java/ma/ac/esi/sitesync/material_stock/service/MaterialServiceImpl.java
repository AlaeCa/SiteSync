package ma.ac.esi.sitesync.material_stock.service;

import ma.ac.esi.sitesync.material_stock.dto.MaterialDTO;
import ma.ac.esi.sitesync.material_stock.mapper.MaterialMapper;
import ma.ac.esi.sitesync.material_stock.model.Material;
import ma.ac.esi.sitesync.material_stock.model.enums.Status;
import ma.ac.esi.sitesync.material_stock.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ma.ac.esi.sitesync.material_stock.repository.StockRepository;
import ma.ac.esi.sitesync.material_stock.model.Stock;
import ma.ac.esi.sitesync.material_stock.model.enums.Etat;
import ma.ac.esi.sitesync.material_stock.dto.StockDTO;
import ma.ac.esi.sitesync.material_stock.dto.MaterialStatDTO;
import ma.ac.esi.sitesync.material_stock.exception.ResNotFoundExc;
import ma.ac.esi.sitesync.material_stock.exception.BadReqExc;
import ma.ac.esi.sitesync.material_stock.service.NotificationService;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaterialServiceImpl implements MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private MaterialMapper materialMapper;

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    public List<MaterialDTO> getAllMaterials() {
        return materialRepository.findAll()
                .stream()
                .map(materialMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MaterialDTO getMaterialById(String id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matériau non trouvé avec l'id : " + id));

        return materialMapper.toDTO(material);
    }

    @Override
    public MaterialDTO createMaterial(MaterialDTO materialDTO) {
        Material material = materialMapper.toEntity(materialDTO);

        updateStatus(material);

        Material savedMaterial = materialRepository.save(material);

        return materialMapper.toDTO(savedMaterial);
    }

    @Override
    public MaterialDTO updateMaterial(String id, MaterialDTO materialDTO) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matériau non trouvé avec l'id : " + id));

        material.setName(materialDTO.getName());
        material.setCategory(materialDTO.getCategory());
        material.setQuantity(materialDTO.getQuantity());
        material.setUnit(materialDTO.getUnit());
        material.setSeuilminal(materialDTO.getSeuilminal());
        material.setSiteId(materialDTO.getSiteId());
        material.setUnitPrice(materialDTO.getUnitPrice());

        updateStatus(material);

        Material updatedMaterial = materialRepository.save(material);

        return materialMapper.toDTO(updatedMaterial);
    }

    @Override
    public void deleteMaterial(String id) {
        if (!materialRepository.existsById(id)) {
            throw new ResNotFoundExc("Matériau non trouvé avec l'id : " + id);
        }

        materialRepository.deleteById(id);
    }

    @Override
    public List<MaterialDTO> getMaterialsInAlert() {
        return materialRepository.findAll()
                .stream()
                .filter(material ->
                        material.getStatus() == Status.EN_RUPTURE ||
                                material.getStatus() == Status.FAIBLE
                )
                .map(materialMapper::toDTO)
                .collect(Collectors.toList());
    }

    private void updateStatus(Material material) {
        if (material.getQuantity() == null || material.getQuantity() == 0) {
            material.setStatus(Status.EN_RUPTURE);
        } else if (material.getSeuilminal() != null &&
                material.getQuantity() <= material.getSeuilminal()) {
            material.setStatus(Status.FAIBLE);
        } else {
            material.setStatus(Status.DISPONIBLE);
        }
    }

    @Override
    public StockDTO addStockMovement(StockDTO stockDTO) {

        Material material = materialRepository.findById(stockDTO.getMaterialId())
                .orElseThrow(() -> new RuntimeException("Matériau non trouvé avec l'id : " + stockDTO.getMaterialId()));

        if (stockDTO.getQuantity() == null || stockDTO.getQuantity() <= 0) {
            throw new RuntimeException("La quantité doit être supérieure à 0");
        }

        Status ancienStatus = material.getStatus();

        if (stockDTO.getType() == Etat.ENTREE) {
            material.setQuantity(material.getQuantity() + stockDTO.getQuantity());
        } else if (stockDTO.getType() == Etat.SORTIE) {

            if (material.getQuantity() < stockDTO.getQuantity()) {
                throw new BadReqExc("Stock insuffisant");
            }

            material.setQuantity(material.getQuantity() - stockDTO.getQuantity());
        }

        updateStatus(material);
        materialRepository.save(material);

        if (material.getStatus() == Status.EN_RUPTURE && ancienStatus != Status.EN_RUPTURE) {   //Notif pour stock en rupture
            notificationService.envoyerATous(
                    "Alerte rupture de stock",
                    "Le matériau " + material.getName() + " est en rupture de stock."
            );
        }

        if (material.getStatus() == Status.FAIBLE && ancienStatus == Status.DISPONIBLE) {   //Notif pour stock dispo à faible
            notificationService.envoyerATous(
                    "Alerte faiblesse du stock",
                    "Le matériau " + material.getName() + " est en stock faible."
            );
        }

        if (material.getStatus() == Status.DISPONIBLE && ancienStatus != Status.DISPONIBLE) {   //Notif pour stock dispo
            notificationService.envoyerATous(
                    "Rétablissement du stock",
                    "Le matériau " + material.getName() + " est de nouveau disponible en quantité suffisante."
            );
        }
        if (material.getStatus() == Status.FAIBLE && ancienStatus == Status.EN_RUPTURE) {   //Notif pour stock en rupture à faible
            notificationService.envoyerATous(
                    "Rétablissement du stock",
                    "Le matériau " + material.getName() + " n'est plus en rupture du stock, mais il reste en stock faible ."
            );
        }

        Stock stock = Stock.builder()
                .materialId(stockDTO.getMaterialId())
                .type(stockDTO.getType())
                .quantity(stockDTO.getQuantity())
                .reason(stockDTO.getReason())
                .movementDate(LocalDateTime.now())
                .build();

        Stock savedStock = stockRepository.save(stock);

        return new StockDTO(
                savedStock.getId(),
                savedStock.getMaterialId(),
                savedStock.getType(),
                savedStock.getQuantity(),
                savedStock.getReason(),
                savedStock.getMovementDate()
        );
    }

    @Override
    public List<StockDTO> getStockMovementsByMaterial(String materialId) {
        return stockRepository.findByMaterialId(materialId)
                .stream()
                .map(stock -> new StockDTO(
                        stock.getId(),
                        stock.getMaterialId(),
                        stock.getType(),
                        stock.getQuantity(),
                        stock.getReason(),
                        stock.getMovementDate()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public MaterialStatDTO getMaterialStat() {

        List<Material> materials = materialRepository.findAll();

        long total = materials.size();

        long disponibles = materials.stream()
                .filter(material -> material.getStatus() == Status.DISPONIBLE)
                .count();

        long faibles = materials.stream()
                .filter(material -> material.getStatus() == Status.FAIBLE)
                .count();

        long en_rupture = materials.stream()
                .filter(material -> material.getStatus() == Status.EN_RUPTURE)
                .count();

        double valeur_totale = materials.stream()
                .mapToDouble(material -> {
                    double quantity = material.getQuantity() == null ? 0 : material.getQuantity();
                    double unitPrice = material.getUnitPrice() == null ? 0 : material.getUnitPrice();
                    return quantity * unitPrice;
                })
                .sum();

        return new MaterialStatDTO(
                total,
                disponibles,
                faibles,
                en_rupture,
                valeur_totale
        );
    }
}