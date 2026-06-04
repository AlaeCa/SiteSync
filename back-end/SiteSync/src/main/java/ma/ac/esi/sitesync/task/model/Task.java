package ma.ac.esi.sitesync.task.model;

import lombok.*;

import ma.ac.esi.sitesync.task.enums.TaskStatus;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;



@Document(collection = "taches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    private ObjectId id;


    private String titre;
    private String description;
    private TaskStatus statut;
    private ObjectId chantierId;
    private List<String> assigneA;
    private Date dateDebut;
    private Date dateFin;
}


