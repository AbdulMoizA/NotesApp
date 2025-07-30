package com.thiocc.NotesApp.controller;

import com.thiocc.NotesApp.entity.Note;
import com.thiocc.NotesApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/notes")
public class UserController {

    @Autowired
    private UserService noteService;

    // Helper method to get current user ID from JWT
    private String getCurrentUserId() {
        return (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // Create a new note for logged-in user
    @PostMapping
    public void createNote(@RequestBody Note note) {
        String userId = getCurrentUserId();
        noteService.createNote(userId, note);
    }

    // Get all notes for the logged-in user
    @GetMapping
    public List<Note> getAllNotes() {
        String userId = getCurrentUserId();
        return noteService.getAllNotes(userId);
    }

    // Get a specific note by ID, only if it belongs to the user
    @GetMapping("/{nid}")
    public Note getNoteById(@PathVariable String nid) {
        String userId = getCurrentUserId();
        return noteService.getNoteById(userId, nid);
    }

    // Update a specific note
    @PutMapping("/{nid}")
    public void modifyNote(@PathVariable String nid, @RequestBody Note updatedNote) {
        String userId = getCurrentUserId();
        noteService.modifyNote(userId, nid, updatedNote);
    }

    // Delete a specific note
    @DeleteMapping("/{nid}")
    public void deleteNote(@PathVariable String nid) {
        String userId = getCurrentUserId();
        noteService.deleteNote(userId, nid);
    }
}
