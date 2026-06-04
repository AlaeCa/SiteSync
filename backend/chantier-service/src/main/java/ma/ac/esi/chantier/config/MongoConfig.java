package ma.ac.esi.chantier.config;
 
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
 
@Configuration
@EnableMongoAuditing  // Active @CreatedDate et @LastModifiedDate dans le modèle
public class MongoConfig {
    // Spring Data MongoDB se configure via application.yml
}
