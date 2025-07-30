package com.thiocc.NotesApp.repository;

import com.thiocc.NotesApp.entity.Note;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotesRepository extends MongoRepository<Note, String> {
    List<Note> findByUserId(String userId);
}
