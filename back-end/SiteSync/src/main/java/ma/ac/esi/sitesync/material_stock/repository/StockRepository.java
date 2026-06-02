package ma.ac.esi.sitesync.material_stock.repository;

import ma.ac.esi.sitesync.material_stock.model.Stock;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface StockRepository extends MongoRepository<Stock, String> {
    List<Stock> findByMaterialId(String materialId);
}