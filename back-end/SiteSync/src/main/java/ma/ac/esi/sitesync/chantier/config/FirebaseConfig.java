package ma.ac.esi.sitesync.chantier.config;
 
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
 
@Configuration
@Slf4j
public class FirebaseConfig {
 

 
    @PostConstruct  // Méthode exécutée automatiquement au démarrage de l'application
    public void initFireBase() {
        try {
            InputStream serviceAccount =
                    new ClassPathResource("next-app-1f2b9-firebase-adminsdk-fbsvc-07a85ed3ea.json").getInputStream();

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase initialisé avec succès");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
