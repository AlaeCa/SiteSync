package ma.ac.esi.sitesync.kpi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private String id;

    private String type;

    private String message;

    private List<String> destinataires;

    private boolean lu;

    private LocalDateTime createdAt;
}
