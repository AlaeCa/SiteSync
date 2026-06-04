package ma.ac.esi.sitesync.rapport.dto;

import java.util.List;

public record RapportCreateDto(
        String chantierId,
        String auteurId,
        String observations,
        List<String> photos
) {
}