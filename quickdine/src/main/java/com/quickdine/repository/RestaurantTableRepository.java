package com.quickdine.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.quickdine.entity.RestaurantTable;


public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    Optional<RestaurantTable> findByTableNumberIgnoreCase(String tableNumber);
    List<RestaurantTable> findByStatusIgnoreCase(String status);
}
