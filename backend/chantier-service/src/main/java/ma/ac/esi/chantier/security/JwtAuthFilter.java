package ma.ac.esi.chantier.security;
 
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;
 
@Component
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {
 
    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
 
        String authHeader = request.getHeader("Authorization");
 
        // Si pas de token ou format incorrect, on laisse passer
        // Spring Security refusera si l'endpoint est protégé
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }
 
        String token = authHeader.substring(7); // Enlève 'Bearer '
 
        try {
            // Firebase vérifie la signature du token et son expiration
            FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(token);
            String uid = decoded.getUid();
            String role = (String) decoded.getClaims()
                .getOrDefault("role", "USER");
 
            // On enregistre l'utilisateur dans le contexte de sécurité Spring
            UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                    uid, null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + role)));
            SecurityContextHolder.getContext().setAuthentication(auth);
 
        } catch (Exception e) {
            log.warn("Token JWT invalide ou expiré : {}", e.getMessage());
            // On ne bloque pas ici, Spring Security s'en chargera
        }
 
        chain.doFilter(request, response);
    }
}
