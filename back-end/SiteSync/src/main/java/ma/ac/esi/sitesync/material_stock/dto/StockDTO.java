package ma.ac.esi.sitesync.material_stock.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.ac.esi.sitesync.material_stock.model.enums.Etat;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockDTO {

    private String id;

    @NotBlank(message = "Obligatoire")
    private String materialId;

    @NotNull(message = "Obligatoire")
    private Etat type;

    @NotNull(message = "Obligatoire")
    @Positive(message = "Doit etre >=0")
    private Double quantity;

    private String reason;

    private LocalDateTime movementDate;
}