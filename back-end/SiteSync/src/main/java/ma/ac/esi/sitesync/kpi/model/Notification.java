package ma.ac.esi.sitesync.kpi.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String type;

    private String message;

    @Indexed
    private List<String> destinataires;

    @Indexed
    @Builder.Default
    private boolean lu = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
