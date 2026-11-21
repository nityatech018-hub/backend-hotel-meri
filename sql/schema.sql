-- Hotel Meri & Residency — MySQL Database Schema
-- Run this script in MySQL Workbench, phpMyAdmin, or MySQL CLI

CREATE DATABASE IF NOT EXISTS hotel_meri;
USE hotel_meri;

-- 1. Room Categories
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  max_guests INT NOT NULL DEFAULT 2,
  bed VARCHAR(100) NOT NULL,
  size VARCHAR(50) NOT NULL,
  image VARCHAR(255) NOT NULL,
  amenities JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Rooms
CREATE TABLE IF NOT EXISTS rooms (
  room_number VARCHAR(20) PRIMARY KEY,
  category_id VARCHAR(50) NOT NULL,
  floor INT NOT NULL,
  status ENUM('available', 'cleaning', 'maintenance') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rooms_category FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE
);

-- 3. Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(50) PRIMARY KEY,
  guest_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  category_id VARCHAR(50) NOT NULL,
  room_number VARCHAR(20) NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INT NOT NULL DEFAULT 1,
  rooms INT NOT NULL DEFAULT 1,
  status ENUM('Pending', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled') NOT NULL DEFAULT 'Pending',
  payment ENUM('Paid', 'Partial', 'Unpaid', 'Refunded') NOT NULL DEFAULT 'Unpaid',
  amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10, 2) NOT NULL,
  source ENUM('Website', 'Walk-in', 'Phone') NOT NULL DEFAULT 'Website',
  requests TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_category FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE,
  CONSTRAINT fk_bookings_room FOREIGN KEY (room_number) REFERENCES rooms(room_number) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 4. Users (Guests & Staff)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  city VARCHAR(100) NULL,
  role ENUM('guest', 'reception') NOT NULL DEFAULT 'guest',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Hotel Settings
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1,
  hotel_name VARCHAR(150) NOT NULL DEFAULT 'Hotel Meri & Residency',
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(150) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  check_in_time VARCHAR(20) NOT NULL DEFAULT '14:00',
  check_out_time VARCHAR(20) NOT NULL DEFAULT '11:00',
  tax_rate DECIMAL(5, 4) NOT NULL DEFAULT 0.1200,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Support / Contact Messages
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Settings
INSERT INTO settings (id, hotel_name, address, phone, email, whatsapp, check_in_time, check_out_time, tax_rate)
VALUES (1, 'Hotel Meri & Residency', 'Near Railway Station, Civil Lines, Bareilly, Uttar Pradesh 243001', '+91 94122 56789', 'reservations@hotelmeri.com', '+91 94122 56789', '14:00', '11:00', 0.12)
ON DUPLICATE KEY UPDATE hotel_name=VALUES(hotel_name);

-- Default Demo Users
INSERT INTO users (email, password, name, phone, role)
VALUES
('guest@merihotel.demo', 'guest123', 'Aarav Sharma', '+91 98765 43210', 'guest'),
('reception@merihotel.demo', 'admin123', 'Front Desk Staff', '+91 90000 00000', 'reception')
ON DUPLICATE KEY UPDATE name=VALUES(name);
