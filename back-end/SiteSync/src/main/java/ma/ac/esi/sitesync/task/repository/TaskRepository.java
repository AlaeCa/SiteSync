package ma.ac.esi.sitesync.task.repository;

import ma.ac.esi.sitesync.task.enums.TaskStatus;
import ma.ac.esi.sitesync.task.model.Task;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TaskRepository extends MongoRepository<Task, String> {


    @Query("{'_id':  ?0}")
    @Update("{'$set': {'statut': $1}}")
    void updateStatut(ObjectId id, TaskStatus stat);

    List<Task> findByChantierId(String chantierId);
}
