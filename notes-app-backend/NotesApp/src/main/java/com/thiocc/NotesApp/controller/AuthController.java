// src/main/java/com/thiocc/NotesApp/controller/AuthController.java
package com.thiocc.NotesApp.controller;

import com.thiocc.NotesApp.dto.LoginRequest;
import com.thiocc.NotesApp.entity.User;
import com.thiocc.NotesApp.repository.UserRepository;
import com.thiocc.NotesApp.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtils jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail()))
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already in use");
        if (userRepository.existsByUsername(user.getUsername()))
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already in use");
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        userRepository.save(user);
        return ResponseEntity.ok("Registration successful");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        String idf = req.getIdentifier(), pwd = req.getPasswordHash();
        if (idf == null || pwd == null || pwd.isEmpty())
            return ResponseEntity.badRequest().body("Identifier and password are required");

        Optional<User> opt = idf.contains("@")
                ? userRepository.findByEmail(idf)
                : userRepository.findByUsername(idf);

        if (opt.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("No user found with given identifier");

        User u = opt.get();
        if (!passwordEncoder.matches(pwd, u.getPasswordHash()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");

        String token = jwtUtil.generateToken(u.getId());
        Map<String,String> body = new HashMap<>();
        body.put("token", token);
        body.put("username", u.getUsername());
        return ResponseEntity.ok(body);
    }
}
