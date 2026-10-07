package com.quickdine.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.quickdine.entity.CartItem;
import com.quickdine.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartItem> getCart(@RequestParam(required = false, defaultValue = "guest@quickdine.com") String email) {
        return cartService.getCartByUser(email);
    }

    @PostMapping
    public ResponseEntity<CartItem> addToCart(@RequestBody CartItem item) {
        CartItem saved = cartService.addToCart(item);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PostMapping("/sync")
    public List<CartItem> syncCart(
            @RequestParam(required = false, defaultValue = "guest@quickdine.com") String email,
            @RequestBody List<CartItem> items) {
        return cartService.syncCart(email, items);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CartItem> updateQuantity(@PathVariable Long id, @RequestParam Integer quantity) {
        return cartService.updateQuantity(id, quantity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PutMapping("/item")
    public ResponseEntity<CartItem> updateQuantityByFood(
            @RequestParam(required = false, defaultValue = "guest@quickdine.com") String email,
            @RequestParam Long foodId,
            @RequestParam Integer quantity) {
        return cartService.updateQuantityByFoodId(email, foodId, quantity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeItem(@PathVariable Long id) {
        if (cartService.removeItem(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/item")
    public ResponseEntity<Void> removeItemByFood(
            @RequestParam(required = false, defaultValue = "guest@quickdine.com") String email,
            @RequestParam Long foodId) {
        if (cartService.removeItemByFoodId(email, foodId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@RequestParam(required = false, defaultValue = "guest@quickdine.com") String email) {
        cartService.clearCart(email);
        return ResponseEntity.noContent().build();
    }
}
