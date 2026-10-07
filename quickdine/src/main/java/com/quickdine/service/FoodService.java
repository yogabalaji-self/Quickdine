package com.quickdine.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.quickdine.entity.Food;
import com.quickdine.repository.FoodRepository;

@Service
public class FoodService {

    private final FoodRepository foodRepository;

    public FoodService(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public Optional<Food> getFoodById(Long id) {
        return foodRepository.findById(id);
    }

    public List<Food> getFoodsByCategory(String category) {
        return foodRepository.findByCategoryIgnoreCase(category);
    }

    public Food createFood(Food food) {
        return foodRepository.save(food);
    }

    public Optional<Food> updateFood(Long id, Food updatedFood) {
        return foodRepository.findById(id).map(existing -> {
            existing.setName(updatedFood.getName());
            existing.setCategory(updatedFood.getCategory());
            existing.setPrice(updatedFood.getPrice());
            existing.setDescription(updatedFood.getDescription());
            if (updatedFood.getImage() != null && !updatedFood.getImage().isBlank()) {
                existing.setImage(updatedFood.getImage());
            }
            if (updatedFood.getRating() != null) {
                existing.setRating(updatedFood.getRating());
            }
            if (updatedFood.getIsVeg() != null) {
                existing.setIsVeg(updatedFood.getIsVeg());
            }
            if (updatedFood.getAvailable() != null) {
                existing.setAvailable(updatedFood.getAvailable());
            }
            return foodRepository.save(existing);
        });
    }

    public boolean deleteFood(Long id) {
        return foodRepository.findById(id).map(food -> {
            foodRepository.delete(food);
            return true;
        }).orElse(false);
    }
}
