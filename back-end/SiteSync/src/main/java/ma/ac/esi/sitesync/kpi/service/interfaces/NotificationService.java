package ma.ac.esi.sitesync.kpi.service.interfaces;

import ma.ac.esi.sitesync.kpi.dto.NotificationDTO;

import java.util.List;

public interface NotificationService {

    NotificationDTO broadcast(NotificationDTO notificationDTO);

    List<NotificationDTO> getAllNotifications();

    long countUnread();
}
