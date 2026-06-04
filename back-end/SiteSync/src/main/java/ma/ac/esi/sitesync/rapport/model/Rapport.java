package ma.ac.esi.sitesync.rapport.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "rapports")
public class Rapport {

    @Id
    private String id;

    @Indexed
    private String chantierId;

    private String auteurId;

    private LocalDateTime date;

    private String observations;

    private List<String> photos;
}