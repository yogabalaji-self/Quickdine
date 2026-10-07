package com.quickdine.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.quickdine.entity.User;
import com.quickdine.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required.");
        }
        user.setId(null); // never let a request overwrite an existing user
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("CUSTOMER");
        } else {
            user.setRole(user.getRole().trim().toUpperCase());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword())); // store BCrypt hash
        return userRepository.save(user);
    }

    public Optional<User> updateUser(Long id, User userDetails) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setName(userDetails.getName());
            existingUser.setEmail(userDetails.getEmail());
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }
            if (userDetails.getRole() != null && !userDetails.getRole().isEmpty()) {
                existingUser.setRole(userDetails.getRole().trim().toUpperCase());
            }
            return userRepository.save(existingUser);
        });
    }

    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /** True if the text already looks like a BCrypt hash ($2a$10$...). */
    public static boolean isBcryptHash(String value) {
        return value != null && value.matches("^\\$2[aby]\\$\\d{2}\\$[./A-Za-z0-9]{53}$");
    }

    /** One-time upgrade: hashes any password that is still stored as plain text. */
    public int migratePlainPasswords() {
        int migrated = 0;
        for (User u : userRepository.findAll()) {
            String pw = u.getPassword();
            if (pw != null && !pw.isEmpty() && !isBcryptHash(pw)) {
                u.setPassword(passwordEncoder.encode(pw));
                userRepository.save(u);
                migrated++;
            }
        }
        return migrated;
    }
}
