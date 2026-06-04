package ma.ac.esi.sitesync.chantier.config;
 
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
 
@Configuration
@Slf4j
public class FirebaseConfig {
 
    @Value("${firebase.credentials-path}")
    private String credentialsPath;
 
    @PostConstruct  // Méthode exécutée automatiquement au démarrage de l'application
    public void initFirebase() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            InputStream credentials = new FileInputStream(credentialsPath);
            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(credentials))
                .build();
            FirebaseApp.initializeApp(options);
            log.info("Firebase Admin SDK initialisé avec succès");
        }
    }
}
