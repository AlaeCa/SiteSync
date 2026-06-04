package ma.ac.esi.sitesync.task.dto;

import ma.ac.esi.sitesync.task.enums.TaskStatus;

import java.util.Date;
import java.util.List;

public record TaskUpdateDto(
        String titre,
        String description,
        TaskStatus statut,
        String chantierId,
        List<String> assigneA,
        Date dateDebut,
        Date dateFin
) {}
