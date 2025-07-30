// src/main/java/com/thiocc/NotesApp/dto/LoginRequest.java
package com.thiocc.NotesApp.dto;

public class LoginRequest {
    private String identifier;    // email or username
    private String passwordHash;  // raw password

    // getters + setters
    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
}
