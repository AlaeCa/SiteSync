package ma.ac.esi.sitesync.kpi.service.impl;

import lombok.RequiredArgsConstructor;
import ma.ac.esi.sitesync.chantier.model.Chantier;
import ma.ac.esi.sitesync.chantier.model.StatutChantier;
import ma.ac.esi.sitesync.chantier.repository.ChantierRepository;
import ma.ac.esi.sitesync.kpi.dto.ChantierStatsDTO;
import ma.ac.esi.sitesync.kpi.dto.KPIsDashboardDTO;
import ma.ac.esi.sitesync.kpi.exception.ChantierStatsNotFoundException;
import ma.ac.esi.sitesync.kpi.mapper.ChantierStatsMapper;
import ma.ac.esi.sitesync.kpi.service.interfaces.AdminService;
import ma.ac.esi.sitesync.kpi.service.interfaces.NotificationService;
import ma.ac.esi.sitesync.material_stock.model.Material;
import ma.ac.esi.sitesync.material_stock.repository.MaterialRepository;
import ma.ac.esi.sitesync.task.enums.TaskStatus;
import ma.ac.esi.sitesync.task.model.Task;
import ma.ac.esi.sitesync.task.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private static final int TOP_RETARDS_LIMIT = 5;

    private final ChantierRepository chantierRepository;
    private final TaskRepository taskRepository;
    private final MaterialRepository materialRepository;
    private final NotificationService notificationService;
    private final ChantierStatsMapper chantierStatsMapper;

    @Override
    public KPIsDashboardDTO getGlobalStats() {
        List<Chantier> chantiers = chantierRepository.findAll();
        List<Material> materials = materialRepository.findAll();
        LocalDate now = LocalDate.now();

        long actifs = chantierRepository.findByStatut(StatutChantier.EN_COURS).size();
        long termines = chantierRepository.findByStatut(StatutChantier.TERMINE).size();
        long planifies = chantierRepository.findByStatut(StatutChantier.PLANIFIE).size();
        long enRetard = chantiers.stream().filter(c -> estEnRetard(c, now)).count();

        double budgetTotal = chantiers.stream().mapToDouble(Chantier::getBudget).sum();
        double coutTotalReel = materials.stream().mapToDouble(this::valeurMateriel).sum();
        double tauxAvancementMoyen = chantiers.stream()
                .mapToInt(Chantier::getAvancement)
                .average()
                .orElse(0);
        double depassement = budgetTotal > 0
                ? ((coutTotalReel - budgetTotal) / budgetTotal) * 100
                : 0;

        return KPIsDashboardDTO.builder()
                .totalChantiers(chantiers.size())
                .chantiersActifs(actifs)
                .chantiersTermines(termines)
                .chantiersPlanifies(planifies)
                .chantiersEnRetard(enRetard)
                .budgetTotalPrevisionnel(round2(budgetTotal))
                .coutTotalReel(round2(coutTotalReel))
                .depassementBudgetairePourcentage(round2(depassement))
                .tauxAvancementMoyen(round2(tauxAvancementMoyen))
                .notificationsNonLues(notificationService.countUnread())
                .chantiersEnRetardDetails(findTopChantiersEnRetard(chantiers, materials, now))
                .genereLe(LocalDateTime.now())
                .build();
    }

    @Override
    public ChantierStatsDTO getChantierStats(String chantierId) {
        Chantier chantier = chantierRepository.findById(chantierId)
                .orElseThrow(() -> new ChantierStatsNotFoundException(chantierId));
        return buildChantierStats(chantier, materialRepository.findAll());
    }

    @Override
    public KPIsDashboardDTO getDashboardKPIs() {
        return getGlobalStats();
    }

    @Override
    public byte[] exportRapport() {
        KPIsDashboardDTO kpis = getDashboardKPIs();
        StringBuilder csv = new StringBuilder();

        csv.append("Rapport SiteSync - Module Admin & KPIs\n");
        csv.append("Genere le,").append(kpis.getGenereLe()).append("\n\n");

        csv.append("Indicateur,Valeur\n");
        csv.append("Total chantiers,").append(kpis.getTotalChantiers()).append('\n');
        csv.append("Chantiers actifs,").append(kpis.getChantiersActifs()).append('\n');
        csv.append("Chantiers termines,").append(kpis.getChantiersTermines()).append('\n');
        csv.append("Chantiers planifies,").append(kpis.getChantiersPlanifies()).append('\n');
        csv.append("Chantiers en retard,").append(kpis.getChantiersEnRetard()).append('\n');
        csv.append("Budget total previsionnel (MAD),").append(kpis.getBudgetTotalPrevisionnel()).append('\n');
        csv.append("Cout total reel (MAD),").append(kpis.getCoutTotalReel()).append('\n');
        csv.append("Depassement budgetaire (%),").append(kpis.getDepassementBudgetairePourcentage()).append('\n');
        csv.append("Taux d'avancement moyen (%),").append(kpis.getTauxAvancementMoyen()).append('\n');
        csv.append("Notifications non lues,").append(kpis.getNotificationsNonLues()).append("\n\n");

        csv.append("Chantiers en retard - detail\n");
        csv.append("Id,Nom,Statut,Budget,CoutReel,Ecart,Avancement(%),RetardJours\n");
        List<ChantierStatsDTO> retards = kpis.getChantiersEnRetardDetails();
        if (retards != null) {
            for (ChantierStatsDTO c : retards) {
                csv.append(csvEscape(c.getChantierId())).append(',')
                        .append(csvEscape(c.getNom())).append(',')
                        .append(csvEscape(c.getStatut())).append(',')
                        .append(c.getBudgetPrevisionnel()).append(',')
                        .append(c.getCoutReel()).append(',')
                        .append(c.getEcartBudgetaire()).append(',')
                        .append(c.getTauxAvancement()).append(',')
                        .append(c.getRetardEnJours()).append('\n');
            }
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private List<ChantierStatsDTO> findTopChantiersEnRetard(List<Chantier> chantiers, List<Material> materials, LocalDate now) {
        return chantiers.stream()
                .filter(c -> estEnRetard(c, now))
                .limit(TOP_RETARDS_LIMIT)
                .map(c -> buildChantierStats(c, materials))
                .toList();
    }

    private ChantierStatsDTO buildChantierStats(Chantier chantier, List<Material> materials) {
        List<Task> taches = taskRepository.findByChantierId(chantier.getId());
        long nombreTaches = taches.size();
        long tachesTerminees = taches.stream()
                .filter(t -> t.getStatut() == TaskStatus.TERMINE)
                .count();

        Date maintenant = new Date();
        long tachesEnRetard = taches.stream()
                .filter(t -> t.getStatut() != TaskStatus.TERMINE
                        && t.getDateFin() != null
                        && t.getDateFin().before(maintenant))
                .count();

        // Material n'a pas de chantierId : on rapproche via siteId == id du chantier
        double coutReel = materials.stream()
                .filter(m -> chantier.getId().equals(m.getSiteId()))
                .mapToDouble(this::valeurMateriel)
                .sum();

        long retardEnJours = 0;
        if (estEnRetard(chantier, LocalDate.now())) {
            retardEnJours = ChronoUnit.DAYS.between(chantier.getDateFin(), LocalDate.now());
        }

        return chantierStatsMapper.toStatsDTO(chantier, nombreTaches, tachesTerminees, tachesEnRetard,
                round2(coutReel), round2(coutReel - chantier.getBudget()), retardEnJours);
    }

    private boolean estEnRetard(Chantier chantier, LocalDate now) {
        return chantier.getStatut() != StatutChantier.TERMINE
                && chantier.getDateFin() != null
                && chantier.getDateFin().isBefore(now);
    }

    private double valeurMateriel(Material material) {
        double quantity = material.getQuantity() == null ? 0 : material.getQuantity();
        double unitPrice = material.getUnitPrice() == null ? 0 : material.getUnitPrice();
        return quantity * unitPrice;
    }

    private String csvEscape(String value) {
        return value == null ? "" : value.replace(",", " ");
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
