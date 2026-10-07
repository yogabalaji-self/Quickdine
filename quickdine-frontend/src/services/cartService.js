import api from "./api";

const CART_STORAGE_KEY = "quickdine_cart";

export const getLocalCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveLocalCart = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save local cart", e);
  }
};

export const clearLocalCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
};

// -------------------------------------------------------------
// CART API (Database sync via Spring Boot /api/cart)
// -------------------------------------------------------------

export const fetchServerCart = async (email = "guest@quickdine.com") => {
  try {
    const res = await api.get(`/api/cart?email=${encodeURIComponent(email)}`);
    if (Array.isArray(res.data)) {
      // Map database CartItem into standard cart item structure
      const items = res.data.map((item) => ({
        id: item.foodId || item.id,
        cartDbId: item.id,
        foodId: item.foodId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        category: item.category,
        isVeg: item.isVeg
      }));
      saveLocalCart(items);
      return items;
    }
    return getLocalCart();
  } catch (err) {
    return getLocalCart();
  }
};

export const addServerCartItem = async (food, quantity = 1, email = "guest@quickdine.com") => {
  try {
    const payload = {
      userEmail: email,
      foodId: food.id,
      name: food.name,
      price: food.price,
      quantity: quantity,
      image: food.image,
      category: food.category,
      isVeg: food.isVeg !== undefined ? food.isVeg : true
    };
    const res = await api.post("/api/cart", payload);
    return res.data;
  } catch (err) {
    console.warn("Could not save cart item to database:", err.message);
    return null;
  }
};

export const updateServerCartQuantity = async (cartDbId, quantity) => {
  if (!cartDbId) return;
  try {
    await api.put(`/api/cart/${cartDbId}?quantity=${quantity}`);
  } catch (err) {
    console.warn("Could not update cart quantity on server:", err.message);
  }
};

export const updateServerCartItem = async (foodId, quantity, email = "guest@quickdine.com") => {
  try {
    const res = await api.put(`/api/cart/item?email=${encodeURIComponent(email)}&foodId=${foodId}&quantity=${quantity}`);
    return res.data;
  } catch (err) {
    console.warn("Could not update cart quantity on server:", err.message);
  }
};

export const removeServerCartItem = async (cartDbId) => {
  if (!cartDbId) return;
  try {
    await api.delete(`/api/cart/${cartDbId}`);
  } catch (err) {
    console.warn("Could not delete cart item on server:", err.message);
  }
};

export const removeServerCartItemByFood = async (foodId, email = "guest@quickdine.com") => {
  try {
    await api.delete(`/api/cart/item?email=${encodeURIComponent(email)}&foodId=${foodId}`);
  } catch (err) {
    console.warn("Could not delete cart item on server:", err.message);
  }
};

export const clearServerCart = async (email = "guest@quickdine.com") => {
  try {
    await api.delete(`/api/cart?email=${encodeURIComponent(email)}`);
  } catch (err) {
    console.warn("Could not clear cart on server:", err.message);
  }
};

export const syncServerCart = async (items, email = "guest@quickdine.com") => {
  try {
    const payload = items.map((item) => ({
      userEmail: email,
      foodId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      category: item.category,
      isVeg: item.isVeg !== undefined ? item.isVeg : true
    }));
    const res = await api.post(`/api/cart/sync?email=${encodeURIComponent(email)}`, payload);
    return res.data;
  } catch (err) {
    saveLocalCart(items);
    return items;
  }
};
