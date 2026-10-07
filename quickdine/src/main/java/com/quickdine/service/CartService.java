package com.quickdine.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.quickdine.entity.CartItem;
import com.quickdine.repository.CartItemRepository;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;

    public CartService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    public List<CartItem> getCartByUser(String email) {
        if (email == null || email.isBlank()) {
            email = "guest@quickdine.com";
        }
        return cartItemRepository.findByUserEmailIgnoreCase(email);
    }

    public CartItem addToCart(CartItem item) {
        if (item.getUserEmail() == null || item.getUserEmail().isBlank()) {
            item.setUserEmail("guest@quickdine.com");
        }
        Optional<CartItem> existing = cartItemRepository.findByUserEmailIgnoreCaseAndFoodId(
                item.getUserEmail(), item.getFoodId());

        if (existing.isPresent()) {
            CartItem cartItem = existing.get();
            cartItem.setQuantity(cartItem.getQuantity() + (item.getQuantity() != null ? item.getQuantity() : 1));
            return cartItemRepository.save(cartItem);
        } else {
            if (item.getQuantity() == null || item.getQuantity() < 1) {
                item.setQuantity(1);
            }
            return cartItemRepository.save(item);
        }
    }

    public Optional<CartItem> updateQuantity(Long id, Integer quantity) {
        return cartItemRepository.findById(id).map(item -> {
            if (quantity <= 0) {
                cartItemRepository.delete(item);
                return null;
            } else {
                item.setQuantity(quantity);
                return cartItemRepository.save(item);
            }
        });
    }

    public boolean removeItem(Long id) {
        return cartItemRepository.findById(id).map(item -> {
            cartItemRepository.delete(item);
            return true;
        }).orElse(false);
    }

    public Optional<CartItem> updateQuantityByFoodId(String email, Long foodId, Integer quantity) {
        if (email == null || email.isBlank()) {
            email = "guest@quickdine.com";
        }
        Optional<CartItem> existing = cartItemRepository.findByUserEmailIgnoreCaseAndFoodId(email, foodId);
        if (existing.isPresent()) {
            CartItem item = existing.get();
            if (quantity <= 0) {
                cartItemRepository.delete(item);
                return Optional.empty();
            } else {
                item.setQuantity(quantity);
                return Optional.of(cartItemRepository.save(item));
            }
        }
        return Optional.empty();
    }

    @Transactional
    public boolean removeItemByFoodId(String email, Long foodId) {
        if (email == null || email.isBlank()) {
            email = "guest@quickdine.com";
        }
        Optional<CartItem> existing = cartItemRepository.findByUserEmailIgnoreCaseAndFoodId(email, foodId);
        if (existing.isPresent()) {
            cartItemRepository.delete(existing.get());
            return true;
        }
        return false;
    }

    @Transactional
    public void clearCart(String email) {
        if (email == null || email.isBlank()) {
            email = "guest@quickdine.com";
        }
        cartItemRepository.deleteByUserEmailIgnoreCase(email);
    }

    @Transactional
    public List<CartItem> syncCart(String email, List<CartItem> items) {
        if (email == null || email.isBlank()) {
            email = "guest@quickdine.com";
        }
        cartItemRepository.deleteByUserEmailIgnoreCase(email);
        if (items != null) {
            for (CartItem item : items) {
                item.setUserEmail(email);
                item.setId(null);
            }
            return cartItemRepository.saveAll(items);
        }
        return List.of();
    }
}
