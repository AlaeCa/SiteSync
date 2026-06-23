package ma.ac.esi.sitesync.kpi.exception;

// Cette exception est levée quand on cherche les stats d'un chantier qui n'existe pas
public class ChantierStatsNotFoundException extends RuntimeException {
    public ChantierStatsNotFoundException(String id) {
        super("Chantier introuvable avec l'id : " + id);
    }
}
