package com.quickdine.controller;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quickdine.entity.User;
import com.quickdine.repository.UserRepository;
import com.quickdine.security.JwtUtil;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email") == null ? "" : body.get("email").trim();
        String password = body.get("password") == null ? "" : body.get("password");

        Optional<User> match = userRepository.findByEmailIgnoreCase(email).stream()
                .filter(u -> u.getPassword() != null && passwordEncoder.matches(password, u.getPassword()))
                .findFirst();

        if (match.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password."));
        }

        User u = match.get();
        String role = (u.getRole() == null || u.getRole().isBlank())
                ? "CUSTOMER"
                : u.getRole().trim().toUpperCase();

        String token = jwtUtil.generateToken(u.getId(), u.getName(), u.getEmail(), role);

        // Never send the password (or its hash) back to the browser
        Map<String, Object> user = new LinkedHashMap<>();
        user.put("id", u.getId());
        user.put("name", u.getName());
        user.put("email", u.getEmail());
        user.put("role", role);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("token", token);
        response.put("tokenType", "Bearer");
        response.put("expiresIn", jwtUtil.getExpirationSeconds());
        response.put("user", user);
        return ResponseEntity.ok(response);
    }
}