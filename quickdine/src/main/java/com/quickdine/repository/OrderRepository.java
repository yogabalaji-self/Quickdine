package com.quickdine.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.quickdine.entity.Order;


public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByCustomerEmailIgnoreCaseOrderByDateDesc(String customerEmail);
    List<Order> findByCustomerEmailIgnoreCase(String customerEmail);
    List<Order> findAllByOrderByDateDesc();
    List<Order> findByStatusIgnoreCase(String status);
}
