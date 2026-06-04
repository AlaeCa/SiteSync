package ma.ac.esi.sitesync.task.dto;

import ma.ac.esi.sitesync.task.enums.TaskStatus;

public record TaskUpdateStatusDto(
        TaskStatus status
) {
}
