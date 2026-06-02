package ma.ac.esi.sitesync.material_stock.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialStatDTO {

    private long total;
    private long disponibles;
    private long faibles;
    private long en_rupture;
    private double valeure_totale;
}