CREATE DATABASE IF NOT EXISTS artisanconnect;
USE artisanconnect;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'artisan', 'admin') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artisans (
    id INT PRIMARY KEY,
    profession VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(50) PRIMARY KEY,
    client_id INT NOT NULL,
    artisan_id INT NOT NULL,
    service VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2),
    status ENUM('pending', 'confirmed', 'paid', 'completed_by_artisan', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (artisan_id) REFERENCES users(id)
);
