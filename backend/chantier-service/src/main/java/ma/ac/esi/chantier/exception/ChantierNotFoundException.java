package ma.ac.esi.chantier.exception;
 
// Cette exception est levée quand on cherche un chantier qui n'existe pas
public class ChantierNotFoundException extends RuntimeException {
    public ChantierNotFoundException(String id) {
        super("Chantier non trouvé avec l'ID : " + id);
    }
}
