package com.thiocc.NotesApp.service;

import com.thiocc.NotesApp.entity.Note;
import com.thiocc.NotesApp.repository.NotesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.lang.String;

@Service
public class UserService {

    @Autowired
    private NotesRepository noteRepository;

    // Create a new note
    public void createNote(String userId, Note note) {
        note.setUserId(userId);
        note.setCreatedAt(new Date());
        note.setModifiedAt(new Date());
        noteRepository.save(note);
    }

    // Get all notes for the user
    public List<Note> getAllNotes(String userId) {
        return noteRepository.findByUserId(userId);
    }

    // Get one specific note (only if it belongs to the user)
    public Note getNoteById(String userId, String noteId) {
        Optional<Note> optionalNote = noteRepository.findById(noteId);
        if (optionalNote.isPresent() && optionalNote.get().getUserId().equals(userId)) {
            return optionalNote.get();
        }
        throw new RuntimeException("Note not found or access denied.");
    }

    // Modify an existing note
    public void modifyNote(String userId, String noteId, Note updatedNote) {
        Optional<Note> optionalNote = noteRepository.findById(noteId);
        if (optionalNote.isPresent()) {
            Note existingNote = optionalNote.get();
            if (!existingNote.getUserId().equals(userId)) {
                throw new RuntimeException("Access denied.");
            }
            existingNote.setTitle(updatedNote.getTitle());
            existingNote.setContent(updatedNote.getContent());
            existingNote.setModifiedAt(new Date());
            noteRepository.save(existingNote);
        } else {
            throw new RuntimeException("Note not found.");
        }
    }

    // Delete a note (only if it belongs to the user)
    public void deleteNote(String userId, String noteId) {
        Optional<Note> optionalNote = noteRepository.findById(noteId);
        if (optionalNote.isPresent() && optionalNote.get().getUserId().equals(userId)) {
            noteRepository.deleteById(noteId);
        } else {
            throw new RuntimeException("Note not found or access denied.");
        }
    }
}
