package ma.ac.esi.sitesync.kpi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KPIsDashboardDTO {

    private long totalChantiers;

    private long chantiersActifs;

    private long chantiersTermines;

    private long chantiersPlanifies;

    private long chantiersEnRetard;

    private double budgetTotalPrevisionnel;

    private double coutTotalReel;

    private double depassementBudgetairePourcentage;

    private double tauxAvancementMoyen;

    private long notificationsNonLues;

    private List<ChantierStatsDTO> chantiersEnRetardDetails;

    private LocalDateTime genereLe;
}
