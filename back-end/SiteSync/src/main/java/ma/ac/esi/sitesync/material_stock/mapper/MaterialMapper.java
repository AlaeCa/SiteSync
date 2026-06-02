package ma.ac.esi.sitesync.material_stock.mapper;

import ma.ac.esi.sitesync.material_stock.dto.MaterialDTO;
import ma.ac.esi.sitesync.material_stock.model.Material;
import org.springframework.stereotype.Component;

@Component
public class MaterialMapper {

    public MaterialDTO toDTO(Material material) {
        if (material == null) {
            return null;
        }

        return new MaterialDTO(
                material.getId(),
                material.getName(),
                material.getCategory(),
                material.getQuantity(),
                material.getUnit(),
                material.getSeuilminal(),
                material.getStatus(),
                material.getSiteId(),
                material.getUnitPrice()
        );
    }

    public Material toEntity(MaterialDTO dto) {
        if (dto == null) {
            return null;
        }

        return new Material(
                dto.getId(),
                dto.getName(),
                dto.getCategory(),
                dto.getQuantity(),
                dto.getUnit(),
                dto.getSeuilminal(),
                dto.getStatus(),
                dto.getSiteId(),
                dto.getUnitPrice()
        );
    }
}