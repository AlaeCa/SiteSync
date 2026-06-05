package ma.ac.esi.sitesync.chantier.repository;
 
import ma.ac.esi.sitesync.chantier.model.Chantier;
import ma.ac.esi.sitesync.chantier.model.StatutChantier;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
 
@Repository
public interface ChantierRepository extends MongoRepository<Chantier, String> {
 
    // Spring génère la requête MongoDB automatiquement à partir du nom de la méthode
    // findByStatut → db.chantiers.find({statut: 'EN_COURS'})
    List<Chantier> findByStatut(StatutChantier statut);
 
    List<Chantier> findByResponsableId(String responsableId);
 
    // Recherche insensible à la casse sur le nom OU la ville
    List<Chantier> findByNomContainingIgnoreCaseOrVilleContainingIgnoreCase(
        String nom, String ville);
 
    // Requête géospatiale : trouve les chantiers dans un rayon (en mètres)
    // $nearSphere utilise l'index 2dsphere créé sur le champ coordinates
    @Query("{coordinates: {$nearSphere: {$geometry: " +
           "{type: 'Point', coordinates: [?0, ?1]}, $maxDistance: ?2}}}")
    List<Chantier> findChantiersNear(double longitude, double latitude,
                                      double distanceMetres);
 
    // Chantiers d'un membre d'équipe
    List<Chantier> findByMembreIdsContaining(String membreId);
}

