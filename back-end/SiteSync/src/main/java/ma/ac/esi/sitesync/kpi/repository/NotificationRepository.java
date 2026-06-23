package ma.ac.esi.sitesync.kpi.repository;


import ma.ac.esi.sitesync.kpi.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findAllByOrderByCreatedAtDesc();

    List<Notification> findByDestinatairesContaining(String destinataire);

    List<Notification> findByLu(boolean lu);

    long countByLu(boolean lu);
}
