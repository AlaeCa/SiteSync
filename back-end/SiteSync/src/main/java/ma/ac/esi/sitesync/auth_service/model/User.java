package ma.ac.esi.auth_service.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    @JsonProperty("id")
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String name;

    private String phone;

    private Role role = Role.USER;

    private Status status = Status.ACTIVE;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        USER, CHEF, ADMIN
    }

    public enum Status {
        ACTIVE, SUSPENDED
    }
}