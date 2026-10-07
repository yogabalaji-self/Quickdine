package com.quickdine.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.quickdine.entity.RestaurantTable;
import com.quickdine.repository.RestaurantTableRepository;

@Service
public class TableService {

    private final RestaurantTableRepository tableRepository;

    public TableService(RestaurantTableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    public Optional<RestaurantTable> getTableById(Long id) {
        return tableRepository.findById(id);
    }

    public RestaurantTable createTable(RestaurantTable table) {
        return tableRepository.save(table);
    }

    public Optional<RestaurantTable> updateTable(Long id, RestaurantTable updated) {
        return tableRepository.findById(id).map(existing -> {
            if (updated.getTableNumber() != null) existing.setTableNumber(updated.getTableNumber());
            if (updated.getCapacity() != null) existing.setCapacity(updated.getCapacity());
            if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
            return tableRepository.save(existing);
        });
    }

    public boolean deleteTable(Long id) {
        return tableRepository.findById(id).map(table -> {
            tableRepository.delete(table);
            return true;
        }).orElse(false);
    }
}
