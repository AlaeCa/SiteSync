package ma.ac.esi.sitesync.rapport.dto;

import java.time.LocalDateTime;
import java.util.List;

public record RapportResponseDto(
        String id,
        String chantierId,
        String auteurId,
        LocalDateTime date,
        String observations,
        List<String> photos
) {
}