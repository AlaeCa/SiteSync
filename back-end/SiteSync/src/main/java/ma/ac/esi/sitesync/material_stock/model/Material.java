package ma.ac.esi.sitesync.material_stock.model;

import ma.ac.esi.sitesync.material_stock.model.enums.Status;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Material {

    @Id
    private String id;
    private String name;
    private String category;
    private Double quantity;
    private String unit;          // sac, kg, tonne, m3, pièce
    private Double seuilminal;  // Seuil minimum pour alerte
    private Status status;
    private String siteId;
    private Double unitPrice;
}