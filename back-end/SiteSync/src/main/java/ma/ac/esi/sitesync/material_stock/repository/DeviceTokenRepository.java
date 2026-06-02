package ma.ac.esi.sitesync.material_stock.repository;

import ma.ac.esi.sitesync.material_stock.model.DeviceToken;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DeviceTokenRepository extends MongoRepository<DeviceToken, String> {
    boolean existsByToken(String token);
}