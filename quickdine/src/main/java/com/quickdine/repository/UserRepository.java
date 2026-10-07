package com.quickdine.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.quickdine.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByEmailIgnoreCase(String email);
}