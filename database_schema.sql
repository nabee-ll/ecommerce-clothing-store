-- Database Schema for E-Commerce Store
-- Run this SQL script on your Railway/production database

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image VARCHAR(500),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert sample products (Optional - remove if you already have products)
INSERT INTO products (name, description, price, stock, image, category) VALUES
('Classic White Shirt', 'Elegant white cotton shirt perfect for any occasion', 49.99, 50, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', 'Men''s'),
('Slim Fit Jeans', 'Comfortable dark blue denim jeans', 79.99, 40, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 'Men''s'),
('Elegant Dress', 'Beautiful evening dress for special occasions', 129.99, 25, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', 'Women''s'),
('Casual T-Shirt', 'Soft cotton t-shirt available in multiple colors', 29.99, 100, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 'Men''s'),
('Summer Dress', 'Light and breezy summer dress', 89.99, 35, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500', 'Women''s'),
('Leather Jacket', 'Premium quality leather jacket', 199.99, 15, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 'Men''s'),
('Designer Handbag', 'Stylish leather handbag', 149.99, 20, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500', 'Accessories'),
('Sunglasses', 'UV protection sunglasses', 79.99, 45, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', 'Accessories'),
('Wool Coat', 'Warm winter wool coat', 179.99, 18, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500', 'Women''s'),
('Sneakers', 'Comfortable sports sneakers', 99.99, 60, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500', 'Accessories');

-- Verify tables were created
SHOW TABLES;

-- Check products were inserted
SELECT COUNT(*) as product_count FROM products;
