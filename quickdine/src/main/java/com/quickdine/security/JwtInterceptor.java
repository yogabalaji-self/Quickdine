package com.quickdine.security;

import java.io.IOException;
import java.util.Optional;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Checks the JWT ("Authorization: Bearer <token>") on every /api/** request.
 *
 *  - Public (no token needed): POST /api/auth/login and POST /api/users (register)
 *  - Everything else needs a valid token            -> otherwise 401
 *  - Admin-only actions need role ADMIN              -> otherwise 403
 *  - A customer may only touch their own data        -> otherwise 403
 *
 * Runs as an MVC interceptor (not a servlet filter) so that the CORS headers are
 * already on the response when a 401/403 is returned and the browser can read it.
 */
@Component
public class JwtInterceptor implements HandlerInterceptor {

    public static final String ATTR_USER_ID = "auth.userId";
    public static final String ATTR_EMAIL = "auth.email";
    public static final String ATTR_ROLE = "auth.role";

    private final JwtUtil jwtUtil;

    public JwtInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws IOException {

        String method = request.getMethod().toUpperCase();
        if ("OPTIONS".equals(method)) {
            return true; // CORS pre-flight
        }

        String path = normalize(request.getRequestURI());

        // Read the token if there is one (also used by the public register endpoint,
        // so an admin creating a user is recognised as admin)
        Optional<JwtUtil.Claims> claims = readClaims(request);
        claims.ifPresent(c -> {
            request.setAttribute(ATTR_USER_ID, c.userId());
            request.setAttribute(ATTR_EMAIL, c.email());
            request.setAttribute(ATTR_ROLE, c.role());
        });

        // ---- public endpoints
        if ("POST".equals(method) && (path.equals("/api/auth/login") || path.equals("/api/users"))) {
            return true;
        }

        // ---- must be logged in
        if (claims.isEmpty()) {
            return reject(response, HttpServletResponse.SC_UNAUTHORIZED,
                    "Login required: missing, invalid or expired token.");
        }

        JwtUtil.Claims c = claims.get();
        boolean admin = "ADMIN".equals(c.role());

        // ---- admin-only actions
        boolean adminOnly =
                (path.equals("/api/users") && "GET".equals(method))
                || (path.startsWith("/api/users/") && "DELETE".equals(method))
                || (path.startsWith("/api/foods") && !"GET".equals(method))
                || (path.startsWith("/api/tables") && !"GET".equals(method))
                || (path.equals("/api/orders") && "GET".equals(method))
                || (path.startsWith("/api/orders/") && ("PUT".equals(method) || "DELETE".equals(method)));
        if (adminOnly && !admin) {
            return reject(response, HttpServletResponse.SC_FORBIDDEN, "Admin access required.");
        }

        // ---- a customer can only read/update their own user record
        if (!admin && path.startsWith("/api/users/")) {
            String idPart = path.substring("/api/users/".length());
            if (!idPart.equals(String.valueOf(c.userId()))) {
                return reject(response, HttpServletResponse.SC_FORBIDDEN, "You can only access your own account.");
            }
        }

        // ---- a customer can only use their own cart / orders (?email=...)
        if (!admin && (path.startsWith("/api/cart") || path.equals("/api/orders/user"))) {
            String email = request.getParameter("email");
            if (email != null && !email.equalsIgnoreCase(c.email())) {
                return reject(response, HttpServletResponse.SC_FORBIDDEN, "You can only access your own data.");
            }
        }

        return true;
    }

    private Optional<JwtUtil.Claims> readClaims(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.regionMatches(true, 0, "Bearer ", 0, 7)) {
            return Optional.empty();
        }
        return jwtUtil.validate(header.substring(7).trim());
    }

    private static String normalize(String uri) {
        return (uri.length() > 1 && uri.endsWith("/")) ? uri.substring(0, uri.length() - 1) : uri;
    }

    private static boolean reject(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"message\":\"" + message.replace("\"", "'") + "\"}");
        return false;
    }
}
