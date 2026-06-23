package ma.ac.esi.sitesync.kpi.mapper;


import ma.ac.esi.sitesync.kpi.dto.NotificationDTO;
import ma.ac.esi.sitesync.kpi.model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    NotificationDTO toDto(Notification notification);

    List<NotificationDTO> toDtoList(List<Notification> notifications);

    @Mapping(target = "id", ignore = true)
    Notification toEntity(NotificationDTO notificationDTO);
}
