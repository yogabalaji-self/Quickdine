USE quickdine;

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    delivery_address TEXT,
    table_number VARCHAR(50),
    order_type VARCHAR(50) DEFAULT 'DELIVERY',
    payment_method VARCHAR(50) DEFAULT 'CARD',
    subtotal DOUBLE NOT NULL,
    tax DOUBLE NOT NULL,
    delivery_fee DOUBLE NOT NULL,
    total DOUBLE NOT NULL,
    status VARCHAR(50) DEFAULT 'PLACED',
    date VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    food_id BIGINT,
    name VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    food_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    quantity INT NOT NULL,
    image VARCHAR(500),
    category VARCHAR(100),
    is_veg BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurant_tables (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_number VARCHAR(50) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    status VARCHAR(50) DEFAULT 'AVAILABLE'
);

-- Seed initial tables if empty
INSERT IGNORE INTO restaurant_tables (table_number, capacity, status) VALUES
('T-01', 2, 'AVAILABLE'),
('T-02', 4, 'OCCUPIED'),
('T-03', 4, 'AVAILABLE'),
('T-04', 6, 'RESERVED'),
('T-05', 8, 'AVAILABLE'),
('T-06', 2, 'AVAILABLE');

-- Seed sample orders if empty
INSERT IGNORE INTO orders (id, customer_name, customer_email, customer_phone, delivery_address, table_number, order_type, payment_method, subtotal, tax, delivery_fee, total, status, date) VALUES
('QD-1001', 'Yoga', 'yoga@gmail.com', '+91 9876543210', 'Flat 402, Royal Palms, MG Road, Bangalore', 'T-04', 'DINE_IN', 'CARD', 1165.0, 58.25, 40.0, 1263.25, 'PREPARING', '2026-10-04 19:30'),
('QD-1002', 'Balaji', 'balaji@example.com', '+91 9123456780', 'Villa 12, Green Glen Layout, Bellandur', 'Delivery', 'DELIVERY', 'UPI', 547.0, 27.35, 40.0, 614.35, 'READY', '2026-10-05 09:15');

INSERT IGNORE INTO order_items (order_id, food_id, name, price, quantity) VALUES
('QD-1001', 8, 'Royal Butter Chicken', 389.0, 2),
('QD-1001', 16, 'Garlic Butter Naan Basket', 129.0, 3),
('QD-1002', 1, 'Crispy Paneer Tikka', 249.0, 1),
('QD-1002', 23, 'Mango Mint Mojito', 149.0, 2);
