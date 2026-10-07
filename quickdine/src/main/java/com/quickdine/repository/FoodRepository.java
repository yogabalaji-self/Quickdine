package com.quickdine.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.quickdine.entity.Food;

public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByCategoryIgnoreCase(String category);
    List<Food> findByAvailable(Boolean available);
}
