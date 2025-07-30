package com.thiocc.NotesApp.repository;

import com.thiocc.NotesApp.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByUsername(String id);
    boolean existsByUsername(String id);
}
