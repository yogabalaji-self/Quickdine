import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import {
  getLocalCart,
  saveLocalCart,
  clearLocalCart,
  fetchServerCart,
  syncServerCart,
  addServerCartItem,
  updateServerCartItem,
  removeServerCartItemByFood,
  clearServerCart
} from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => getLocalCart());
  const [loadingCart, setLoadingCart] = useState(true);
  const isInitialMount = useRef(true);

  const getActiveUserEmail = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("quickdine_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u && u.email) return u.email;
      }
    } catch (e) {}
    return "guest@quickdine.com";
  }, []);

  // Fetch cart directly from MySQL database on mount & when user logs in/changes
  const refreshCart = useCallback(async () => {
    const userEmail = getActiveUserEmail();
    try {
      setLoadingCart(true);
      const items = await fetchServerCart(userEmail);
      if (Array.isArray(items)) {
        setCartItems(items);
        saveLocalCart(items);
      }
    } catch (err) {
      console.warn("Failed to load server cart:", err);
    } finally {
      setLoadingCart(false);
      isInitialMount.current = false;
    }
  }, [getActiveUserEmail]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Sync to database and local storage whenever cart items change AFTER initial load
  useEffect(() => {
    if (isInitialMount.current) return;
    saveLocalCart(cartItems);
    const userEmail = getActiveUserEmail();
    syncServerCart(cartItems, userEmail);
  }, [cartItems, getActiveUserEmail]);

  // Add item to cart (persists to MySQL database + updates state)
  const addItem = async (food, quantity = 1) => {
    const userEmail = getActiveUserEmail();

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => Number(item.id) === Number(food.id));
      if (existing) {
        return prevItems.map((item) =>
          Number(item.id) === Number(food.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        {
          ...food,
          id: food.id,
          foodId: food.id,
          quantity,
          image: food.image || "/images/foods/default-food.jpg"
        }
      ];
    });

    // Save to backend database
    try {
      await addServerCartItem(food, quantity, userEmail);
    } catch (e) {
      console.warn("Database add-to-cart error:", e);
    }
  };

  // Remove item by food ID
  const removeItem = async (foodId) => {
    const userEmail = getActiveUserEmail();
    setCartItems((prevItems) => prevItems.filter((item) => Number(item.id) !== Number(foodId)));
    try {
      await removeServerCartItemByFood(foodId, userEmail);
    } catch (e) {
      console.warn("Database removeItem error:", e);
    }
  };

  // Increase quantity
  const increaseQuantity = async (foodId) => {
    const userEmail = getActiveUserEmail();
    let newQty = 1;
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (Number(item.id) === Number(foodId)) {
          newQty = item.quantity + 1;
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
    try {
      await updateServerCartItem(foodId, newQty, userEmail);
    } catch (e) {
      console.warn("Database update quantity error:", e);
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (foodId) => {
    const userEmail = getActiveUserEmail();
    let newQty = 0;
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (Number(item.id) === Number(foodId)) {
            newQty = item.quantity - 1;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );

    try {
      if (newQty <= 0) {
        await removeServerCartItemByFood(foodId, userEmail);
      } else {
        await updateServerCartItem(foodId, newQty, userEmail);
      }
    } catch (e) {
      console.warn("Database decrease quantity error:", e);
    }
  };

  // Clear all items from cart and database
  const clearCart = async () => {
    const userEmail = getActiveUserEmail();
    setCartItems([]);
    clearLocalCart();
    try {
      await clearServerCart(userEmail);
    } catch (e) {
      console.warn("Database clearCart error:", e);
    }
  };

  // Financial calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const tax = Number((subtotal * 0.05).toFixed(2));
  const deliveryFee = cartItems.length === 0 ? 0 : subtotal > 500 ? 0 : 40;
  const total = Number((subtotal + tax + deliveryFee).toFixed(2));
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loadingCart,
        refreshCart,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        subtotal,
        tax,
        deliveryFee,
        total,
        totalItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
