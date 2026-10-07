package com.quickdine.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Creates and verifies standard JWTs (JSON Web Tokens) signed with HS256
 * (HMAC-SHA256). Uses only the JDK, so no extra library is needed.
 *
 * Token format:  base64url(header) . base64url(payload) . base64url(signature)
 * Payload claims: sub (email), uid, name, role, iat, exp
 *
 * You can paste any token into https://jwt.io to inspect it.
 */
@Component
public class JwtUtil {

    private static final String HEADER_JSON = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
    private static final Base64.Encoder B64_ENC = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder B64_DEC = Base64.getUrlDecoder();
    private static final String HEADER_B64 =
            B64_ENC.encodeToString(HEADER_JSON.getBytes(StandardCharsets.UTF_8));

    private final byte[] secret;
    private final long expirationMs;

    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.expiration-ms:86400000}") long expirationMs) {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException(
                    "jwt.secret must be at least 32 characters long (set it in application.properties)");
        }
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationMs = expirationMs;
    }

    /** Token lifetime in seconds (sent to the frontend). */
    public long getExpirationSeconds() {
        return expirationMs / 1000;
    }

    /** The data we read back from a valid token. */
    public record Claims(Long userId, String email, String name, String role, long expiresAtSeconds) {
    }

    // ------------------------------------------------------------------ create

    public String generateToken(Long userId, String name, String email, String role) {
        long nowSec = System.currentTimeMillis() / 1000;
        long expSec = nowSec + expirationMs / 1000;

        String payloadJson = "{"
                + "\"sub\":" + quote(email) + ","
                + "\"uid\":" + (userId == null ? 0 : userId) + ","
                + "\"name\":" + quote(name) + ","
                + "\"role\":" + quote(role) + ","
                + "\"iat\":" + nowSec + ","
                + "\"exp\":" + expSec
                + "}";

        String unsigned = HEADER_B64 + "."
                + B64_ENC.encodeToString(payloadJson.getBytes(StandardCharsets.UTF_8));
        return unsigned + "." + B64_ENC.encodeToString(hmac(unsigned));
    }

    // ------------------------------------------------------------------ verify

    /** Returns the claims if the token is genuine and not expired, otherwise empty. */
    public Optional<Claims> validate(String token) {
        try {
            if (token == null) {
                return Optional.empty();
            }
            String[] parts = token.split("\\.", -1);
            if (parts.length != 3) {
                return Optional.empty();
            }
            // Only accept the exact header we issue (blocks alg=none and other tricks)
            if (!HEADER_B64.equals(parts[0])) {
                return Optional.empty();
            }
            byte[] expected = hmac(parts[0] + "." + parts[1]);
            byte[] actual = B64_DEC.decode(parts[2]);
            if (!MessageDigest.isEqual(expected, actual)) {
                return Optional.empty();
            }

            String payload = new String(B64_DEC.decode(parts[1]), StandardCharsets.UTF_8);
            Map<String, String> c = parseFlatJson(payload);

            long exp = Long.parseLong(c.get("exp"));
            if (System.currentTimeMillis() / 1000 >= exp) {
                return Optional.empty(); // expired
            }
            return Optional.of(new Claims(
                    Long.parseLong(c.get("uid")),
                    c.get("sub"),
                    c.get("name"),
                    c.get("role"),
                    exp));
        } catch (Exception e) {
            return Optional.empty(); // any malformed token is simply "invalid"
        }
    }

    // ----------------------------------------------------------------- helpers

    private byte[] hmac(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret, "HmacSHA256"));
            return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new IllegalStateException("Could not sign JWT", e);
        }
    }

    private static String quote(String s) {
        if (s == null) {
            return "null";
        }
        StringBuilder sb = new StringBuilder("\"");
        for (char ch : s.toCharArray()) {
            switch (ch) {
                case '"' -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                case '\n' -> sb.append("\\n");
                case '\r' -> sb.append("\\r");
                case '\t' -> sb.append("\\t");
                default -> {
                    if (ch < 0x20) {
                        sb.append(String.format("\\u%04x", (int) ch));
                    } else {
                        sb.append(ch);
                    }
                }
            }
        }
        return sb.append('"').toString();
    }

    /**
     * Tiny parser for the flat {"key":"string" | number | null} objects this class
     * creates. It only ever runs AFTER the signature has been verified, so the
     * input is always something we generated ourselves.
     */
    private static Map<String, String> parseFlatJson(String json) {
        Map<String, String> out = new HashMap<>();
        int i = json.indexOf('{') + 1;
        int n = json.length();
        while (i < n) {
            while (i < n && (Character.isWhitespace(json.charAt(i)) || json.charAt(i) == ',')) i++;
            if (i >= n || json.charAt(i) == '}') break;

            // key
            int[] pos = {i};
            String key = readString(json, pos);
            i = pos[0];
            while (i < n && (Character.isWhitespace(json.charAt(i)) || json.charAt(i) == ':')) i++;

            // value
            String value;
            if (json.charAt(i) == '"') {
                pos[0] = i;
                value = readString(json, pos);
                i = pos[0];
            } else {
                int start = i;
                while (i < n && json.charAt(i) != ',' && json.charAt(i) != '}') i++;
                value = json.substring(start, i).trim();
                if (value.equals("null")) value = null;
            }
            out.put(key, value);
        }
        return out;
    }

    /** Reads a JSON string starting at pos[0] (on the opening quote); leaves pos[0] after the closing quote. */
    private static String readString(String s, int[] pos) {
        int i = pos[0] + 1;
        StringBuilder sb = new StringBuilder();
        while (s.charAt(i) != '"') {
            char ch = s.charAt(i++);
            if (ch == '\\') {
                char e = s.charAt(i++);
                switch (e) {
                    case 'n' -> sb.append('\n');
                    case 'r' -> sb.append('\r');
                    case 't' -> sb.append('\t');
                    case 'b' -> sb.append('\b');
                    case 'f' -> sb.append('\f');
                    case 'u' -> {
                        sb.append((char) Integer.parseInt(s.substring(i, i + 4), 16));
                        i += 4;
                    }
                    default -> sb.append(e); // \" \\ \/
                }
            } else {
                sb.append(ch);
            }
        }
        pos[0] = i + 1;
        return sb.toString();
    }
}
