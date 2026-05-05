-- Create database
CREATE DATABASE secureride_db;
USE secureride_db;

-- =========================
-- USER TABLE
-- =========================
CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ADMIN TABLE
-- =========================
CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- DRIVER TABLE
-- =========================
CREATE TABLE driver (
    driver_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    surname VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    license_number VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CAR TABLE
-- =========================
CREATE TABLE car (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT,
    make VARCHAR(100),
    model VARCHAR(100),
    year INT,
    registration_number VARCHAR(50) UNIQUE,
    color VARCHAR(50),
    FOREIGN KEY (driver_id) REFERENCES driver(driver_id)
);

-- =========================
-- TRIP TABLE
-- =========================
CREATE TABLE trip (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    driver_id INT,
    pickup_location VARCHAR(255),
    destination VARCHAR(255),
    trip_status VARCHAR(50) DEFAULT 'requested',
    fare DECIMAL(10,2),
    trip_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (driver_id) REFERENCES driver(driver_id)
);

-- =========================
-- VERIFICATION TABLE
-- =========================
CREATE TABLE verification (
    verification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    driver_id INT,
    document_type VARCHAR(100),
    document_number VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    verified_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (driver_id) REFERENCES driver(driver_id)
);

-- =========================
-- REGISTRATION TABLE
-- =========================
CREATE TABLE registration (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    driver_id INT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active',

    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (driver_id) REFERENCES driver(driver_id)
);

-- =========================
-- EMERGENCY CONTACT TABLE
-- =========================
CREATE TABLE emergency_contact (
    contact_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100),
    phone VARCHAR(20),
    relationship VARCHAR(50),

    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

-- =========================
-- LAW ENFORCEMENT TABLE
-- =========================
CREATE TABLE law_enforcement (
    officer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    badge_number VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    station VARCHAR(150)
);