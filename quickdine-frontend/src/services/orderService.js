import api from "./api";

const ORDERS_KEY = "quickdine_orders_cache";

const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveStoredOrders = (orders) => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error("Failed to save orders cache", e);
  }
};

// -------------------------------------------------------------
// ORDERS API (Direct MySQL Database via Spring Boot /api/orders)
// -------------------------------------------------------------

export const getOrders = async () => {
  try {
    const res = await api.get("/api/orders");
    if (Array.isArray(res.data)) {
      saveStoredOrders(res.data);
      return res.data;
    }
    return getStoredOrders();
  } catch (err) {
    console.warn("Backend /api/orders failed, using cached orders:", err.message);
    return getStoredOrders();
  }
};

export const getOrderById = async (id) => {
  try {
    const res = await api.get(`/api/orders/${id}`);
    return res.data;
  } catch (err) {
    console.warn(`Backend /api/orders/${id} failed, using cached order:`, err.message);
    const orders = getStoredOrders();
    const order = orders.find((o) => String(o.id) === String(id));
    if (!order) throw new Error("Order not found in database or cache");
    return order;
  }
};

export const getOrdersByEmail = async (email) => {
  try {
    if (!email) return await getOrders();
    const res = await api.get(`/api/orders/user?email=${encodeURIComponent(email)}`);
    return res.data;
  } catch (err) {
    console.warn("Backend /api/orders/user failed, filtering cache:", err.message);
    const orders = getStoredOrders();
    if (!email) return orders;
    return orders.filter(
      (o) => (o.customerEmail || "").toLowerCase() === email.toLowerCase()
    );
  }
};

export const createOrder = async (orderPayload) => {
  try {
    const res = await api.post("/api/orders", orderPayload);
    const orders = getStoredOrders();
    orders.unshift(res.data);
    saveStoredOrders(orders);
    return res.data;
  } catch (err) {
    console.warn("Backend order creation failed, creating local order:", err.message);
    const orders = getStoredOrders();
    const newOrder = {
      ...orderPayload,
      id: "QD-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "PLACED"
    };
    orders.unshift(newOrder);
    saveStoredOrders(orders);
    return newOrder;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const res = await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
    const orders = getStoredOrders();
    const idx = orders.findIndex((o) => String(o.id) === String(orderId));
    if (idx !== -1) {
      orders[idx] = res.data;
      saveStoredOrders(orders);
    }
    return res.data;
  } catch (err) {
    console.warn("Backend order update failed, updating locally:", err.message);
    const orders = getStoredOrders();
    const idx = orders.findIndex((o) => String(o.id) === String(orderId));
    if (idx !== -1) {
      orders[idx].status = newStatus;
      saveStoredOrders(orders);
      return orders[idx];
    }
    throw new Error("Order not found to update");
  }
};
