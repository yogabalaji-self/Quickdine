package com.quickdine.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.quickdine.entity.Order;
import com.quickdine.entity.OrderItem;
import com.quickdine.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByDateDesc();
    }

    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByCustomerEmail(String email) {
        return orderRepository.findByCustomerEmailIgnoreCaseOrderByDateDesc(email);
    }

    public Order createOrder(Order order) {
        if (order.getId() == null || order.getId().isBlank()) {
            order.setId("QD-" + (int)(1000 + Math.random() * 9000));
        }
        if (order.getDate() == null || order.getDate().isBlank()) {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            order.setDate(dtf.format(LocalDateTime.now()));
        }
        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("PLACED");
        }
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);
            }
        }
        return orderRepository.save(order);
    }

    public Optional<Order> updateOrderStatus(String id, String status) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(status);
            return orderRepository.save(order);
        });
    }

    public boolean deleteOrder(String id) {
        return orderRepository.findById(id).map(order -> {
            orderRepository.delete(order);
            return true;
        }).orElse(false);
    }
}
