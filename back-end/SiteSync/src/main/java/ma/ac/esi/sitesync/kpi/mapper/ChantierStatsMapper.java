package ma.ac.esi.sitesync.kpi.mapper;

import ma.ac.esi.sitesync.chantier.model.Chantier;
import ma.ac.esi.sitesync.chantier.model.StatutChantier;
import ma.ac.esi.sitesync.kpi.dto.ChantierStatsDTO;
import org.springframework.stereotype.Component;

@Component
public class ChantierStatsMapper {

    public ChantierStatsDTO toStatsDTO(Chantier chantier, long nombreTaches, long tachesTerminees,
                                        long tachesEnRetard, double coutReel, double ecartBudgetaire,
                                        long retardEnJours) {
        boolean termine = chantier.getStatut() == StatutChantier.TERMINE;

        return ChantierStatsDTO.builder()
                .chantierId(chantier.getId())
                .nom(chantier.getNom())
                .statut(chantier.getStatut() != null ? chantier.getStatut().name() : null)
                .dateDebut(chantier.getDateDebut())
                .dateFinPrevue(chantier.getDateFin())
                .dateFinReelle(termine ? chantier.getDateFin() : null)
                .budgetPrevisionnel(chantier.getBudget())
                .coutReel(coutReel)
                .ecartBudgetaire(ecartBudgetaire)
                .tauxAvancement(chantier.getAvancement())
                .retardEnJours(retardEnJours)
                .nombreTaches(nombreTaches)
                .tachesTerminees(tachesTerminees)
                .tachesEnRetard(tachesEnRetard)
                .build();
    }
}
