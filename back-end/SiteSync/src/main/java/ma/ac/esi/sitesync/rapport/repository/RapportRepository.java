package ma.ac.esi.sitesync.rapport.repository;

import ma.ac.esi.sitesync.rapport.model.Rapport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RapportRepository extends MongoRepository<Rapport, String> {

    List<Rapport> findByChantierIdOrderByDateDesc(String chantierId);


}