package ma.ac.esi.sitesync.material_stock.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.ac.esi.sitesync.material_stock.model.enums.Status;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDTO {

    private String id;

    @NotBlank(message = "*Obligatoire")
    private String name;

    @NotBlank(message = "Obligatoire")
    private String category;

    @NotNull(message = "Obligatoire")
    @PositiveOrZero(message = "Doit etre >=0")
    private Double quantity;

    @NotBlank(message = "Obligatoire")
    private String unit;

    @NotNull(message = "Obligatoire")
    @PositiveOrZero(message = "Doit etre >=0")
    private Double seuilminal;

    private Status status;

    private String siteId;

    @PositiveOrZero(message = "Doit etre >=0")
    private Double unitPrice;
}