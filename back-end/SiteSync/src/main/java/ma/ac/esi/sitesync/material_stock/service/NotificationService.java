package ma.ac.esi.sitesync.material_stock.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import ma.ac.esi.sitesync.material_stock.model.DeviceToken;
import ma.ac.esi.sitesync.material_stock.repository.DeviceTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private DeviceTokenRepository deviceTokenRepository;

    // Enregistre le token d'un appareil (sans doublon)
    public void enregistrerToken(String token) {
        if (token != null && !deviceTokenRepository.existsByToken(token)) {
            DeviceToken deviceToken = new DeviceToken();
            deviceToken.setToken(token);
            deviceTokenRepository.save(deviceToken);
        }
    }

    // Envoie à un seul appareil
    public void envoyerNotification(String token, String titre, String corps) {
        Message message = Message.builder()
                .setToken(token)
                .setNotification(Notification.builder()
                        .setTitle(titre)
                        .setBody(corps)
                        .build())
                .build();
        try {
            String reponse = FirebaseMessaging.getInstance().send(message);
            System.out.println("Notification envoyée : " + reponse);
        } catch (FirebaseMessagingException e) {
            e.printStackTrace();
        }
    }

    // Envoie à TOUS les appareils enregistrés
    public void envoyerATous(String titre, String corps) {
        List<DeviceToken> tokens = deviceTokenRepository.findAll();
        for (DeviceToken deviceToken : tokens) {
            envoyerNotification(deviceToken.getToken(), titre, corps);
        }
    }
}