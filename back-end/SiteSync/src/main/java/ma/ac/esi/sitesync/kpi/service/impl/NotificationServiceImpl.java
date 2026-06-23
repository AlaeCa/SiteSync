package ma.ac.esi.sitesync.kpi.service.impl;

import lombok.RequiredArgsConstructor;

import ma.ac.esi.sitesync.kpi.dto.NotificationDTO;
import ma.ac.esi.sitesync.kpi.mapper.NotificationMapper;
import ma.ac.esi.sitesync.kpi.model.Notification;
import ma.ac.esi.sitesync.kpi.repository.NotificationRepository;
import ma.ac.esi.sitesync.kpi.service.interfaces.NotificationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Override
    public NotificationDTO broadcast(NotificationDTO notificationDTO) {
        Notification notification = notificationMapper.toEntity(notificationDTO);
        notification.setLu(false);
        notification.setCreatedAt(LocalDateTime.now());

        Notification saved = notificationRepository.save(notification);
        return notificationMapper.toDto(saved);
    }

    @Override
    public List<NotificationDTO> getAllNotifications() {
        return notificationMapper.toDtoList(notificationRepository.findAllByOrderByCreatedAtDesc());
    }

    @Override
    public long countUnread() {
        return notificationRepository.countByLu(false);
    }
}
