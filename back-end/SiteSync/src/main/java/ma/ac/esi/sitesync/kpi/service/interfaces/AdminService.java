package ma.ac.esi.sitesync.kpi.service.interfaces;

import ma.ac.esi.sitesync.kpi.dto.ChantierStatsDTO;
import ma.ac.esi.sitesync.kpi.dto.KPIsDashboardDTO;

public interface AdminService {

    KPIsDashboardDTO getGlobalStats();

    ChantierStatsDTO getChantierStats(String chantierId);

    KPIsDashboardDTO getDashboardKPIs();

    byte[] exportRapport();
}
