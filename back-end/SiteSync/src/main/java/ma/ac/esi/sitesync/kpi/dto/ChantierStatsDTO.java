package ma.ac.esi.sitesync.kpi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChantierStatsDTO {

    private String chantierId;

    private String nom;

    private String statut;

    private LocalDate dateDebut;

    private LocalDate dateFinPrevue;

    private LocalDate dateFinReelle;

    private double budgetPrevisionnel;

    private double coutReel;

    private double ecartBudgetaire;

    private double tauxAvancement;

    private long retardEnJours;

    private long nombreTaches;

    private long tachesTerminees;

    private long tachesEnRetard;
}
