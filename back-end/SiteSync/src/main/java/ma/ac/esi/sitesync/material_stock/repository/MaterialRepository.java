package ma.ac.esi.sitesync.material_stock.repository;

import ma.ac.esi.sitesync.material_stock.model.Material;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends MongoRepository<Material, String> {
}