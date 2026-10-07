package com.quickdine.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.transaction.annotation.Transactional;

import com.quickdine.entity.CartItem;


public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserEmailIgnoreCase(String userEmail);
    Optional<CartItem> findByUserEmailIgnoreCaseAndFoodId(String userEmail, Long foodId);

    @Transactional
    void deleteByUserEmailIgnoreCase(String userEmail);

    @Transactional
    void deleteByUserEmailIgnoreCaseAndFoodId(String userEmail, Long foodId);
}
