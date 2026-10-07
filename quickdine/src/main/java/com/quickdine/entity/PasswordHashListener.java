package com.quickdine.entity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

/**
 * Safety net: whatever code saves a User, a plain-text password is converted to a
 * BCrypt hash right before it is written to the database.
 * (Passwords that are already BCrypt hashes are left untouched, so nothing is hashed twice.)
 */
public class PasswordHashListener {

    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();

    @PrePersist
    @PreUpdate
    public void hashPassword(User user) {
        String pw = user.getPassword();
        if (pw != null && !pw.isEmpty() && !isBcryptHash(pw)) {
            user.setPassword(ENCODER.encode(pw));
        }
    }

    /** True if the text already looks like a BCrypt hash ($2a$10$...). */
    public static boolean isBcryptHash(String value) {
        return value != null && value.matches("^\\$2[aby]\\$\\d{2}\\$[./A-Za-z0-9]{53}$");
    }
}
