package ma.ac.esi.sitesync.material_stock.model;

import ma.ac.esi.sitesync.material_stock.model.enums.Etat;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "stock_movements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stock{

    @Id
    private String id;
    private String materialId;
    private Etat type;
    private Double quantity;
    private String reason;
    private LocalDateTime movementDate;
}