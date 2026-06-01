package ma.ac.esi.auth_service.controller;

import ma.ac.esi.auth_service.dto.AuthResponse;
import ma.ac.esi.auth_service.dto.LoginRequest;
import ma.ac.esi.auth_service.dto.RegisterRequest;
import ma.ac.esi.auth_service.model.User;
import ma.ac.esi.auth_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register
    @PostMapping("/auth/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    // POST /api/auth/login
    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // GET /api/users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    // GET /api/users/{id}
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(authService.getUserById(id));
    }

    // PUT /api/users/{id}/role
    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateRole(@PathVariable String id,
                                           @RequestBody Map<String, String> body) {
        User.Role role = User.Role.valueOf(body.get("role"));
        return ResponseEntity.ok(authService.updateRole(id, role));
    }

    // PUT /api/users/{id}/status
    @PutMapping("/users/{id}/status")
    public ResponseEntity<User> updateStatus(@PathVariable String id,
                                             @RequestBody Map<String, String> body) {
        User.Status status = User.Status.valueOf(body.get("status"));
        return ResponseEntity.ok(authService.updateStatus(id, status));
    }
}