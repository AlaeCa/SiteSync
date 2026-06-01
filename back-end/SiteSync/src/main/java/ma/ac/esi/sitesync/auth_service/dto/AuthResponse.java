package ma.ac.esi.auth_service.dto;

import ma.ac.esi.auth_service.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String id;
    private String name;
    private String email;
    private User.Role role;
}