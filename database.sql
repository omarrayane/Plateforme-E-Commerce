-- FOOLPROOF SETUP - COPY ALL LINES BELOW
CREATE DATABASE IF NOT EXISTS gaming_store;
USE gaming_store;
DROP TABLE IF EXISTS users; -- Recreating to ensure clean data

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('user', 'admin') DEFAULT 'user',
    reset_token VARCHAR(255),
    reset_expires DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recreate tables to ensure schema matches exactly
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS items;
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    type ENUM('game', 'giftcard') NOT NULL,
    platform VARCHAR(50) DEFAULT 'PC',
    price DECIMAL(10, 2) NOT NULL,
    photo TEXT,
    description TEXT,
    is_special_offer TINYINT(1) DEFAULT 0,
    discount_percentage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    product_name VARCHAR(255),
    amount DECIMAL(10, 2),
    quantity INT DEFAULT 1,
    status ENUM('in_cart', 'pending', 'complete') DEFAULT 'in_cart',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Insert a default user for testing (password is 'password123' hashed with BCRYPT)
-- BCRYPT hash for 'password123': $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT IGNORE INTO users (username, password, email, role) 
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@gamestore.com', 'admin');

-- Sample items
INSERT IGNORE INTO items (name, category, type, price, photo) VALUES 
('Elden Ring (PC)', 'RPG / Action', 'game', 59.99, 'https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg'),
('PlayStation Card 50€', 'Gift Card', 'giftcard', 50.00, 'https://media.direct-games.fr/726-thickbox_default/carte-cadeau-playstation-network-50.jpg'),
('Steam Gift Card 20€', 'Gift Card', 'giftcard', 20.00, 'https://vonguru.fr/wp-content/uploads/2017/02/Steam_Gift_Cards_20.jpg');
