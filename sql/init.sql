-- ============================================================
-- TUGAS BESAR BBK3CAB3 - KOMPUTASI AWAN 2026
-- Database Initialization Script
-- Run this on your MySQL Database Server
-- ============================================================

CREATE DATABASE IF NOT EXISTS tubesaws_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tubesaws_db;

-- ============================================================
-- Table: users (untuk autentikasi login)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- Table: members (data anggota kelompok)
-- ============================================================
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(20) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    prodi VARCHAR(100) NOT NULL,
    kelas VARCHAR(20) NOT NULL,
    foto VARCHAR(255) DEFAULT 'default-avatar.png',
    bio TEXT,
    role_kelompok VARCHAR(100),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- Table: server_logs (log request untuk demo load balancer)
-- ============================================================
CREATE TABLE IF NOT EXISTS server_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    server_id VARCHAR(10) NOT NULL,
    server_name VARCHAR(100),
    ip_address VARCHAR(50),
    user_agent TEXT,
    endpoint VARCHAR(255),
    method VARCHAR(10),
    status_code INT,
    response_time_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- Seed Data: Default Admin User
-- Password: admin123 (hashed dengan bcrypt)
-- ============================================================
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$rZCVjW8X1YqKLfLJHPaKs.LVdY9k8LmN3oq3K9fZmJxKgOqJnHhGe', 'admin'),
('demo', '$2a$10$rZCVjW8X1YqKLfLJHPaKs.LVdY9k8LmN3oq3K9fZmJxKgOqJnHhGe', 'user')
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- ============================================================
-- Seed Data: Anggota Kelompok (Ganti dengan data asli)
-- ============================================================
INSERT INTO members (nim, nama, email, prodi, kelas, foto, bio, role_kelompok) VALUES
('102022580002', 'M.Ariq Nafis', 'mariqnafis@student.telkomuniversity.ac.id', 'S1 Sistem Informasi', 'BBK3CAB3', 'ariq.jpg', 'Mahasiswa aktif Sistem informasi Telkom University. Tertarik pada Machine learning.', 'BOS ML/DS'),
('102022580024', 'Nadhif Arrafi Waltam', 'nadhifarrafiwaltam@student.telkomuniversity.ac.id', 'S1 Sistem Informasi', 'BBK3CAB3', 'nadhif.jpeg', 'Mahasiswa aktif yang fokus pada pengembangan dan UI/UX.', 'UI/UX'),
('102022580025', 'Masmur Toloni Harefa', 'masmurtoloniharefa@student.telkomuniversity.ac.id', 'S1 Sistem Informasi', 'BBK3CAB3', 'masmur.jpeg', 'Tertarik pada AI dan cloud computing.', 'BATMAN'),
('102022580060', 'Naufal Adhani Putra', 'naufaladhaniputra@student.telkomuniversity.ac.id', 'S1 Sistem Informasi', 'BBK3CAB3', 'dani.jpeg', 'Berfokus pada IT Governance.', 'Sistem Analist')
ON DUPLICATE KEY UPDATE foto = VALUES(foto), updated_at = NOW();

-- ============================================================
-- Table: sessions (untuk shared session store di belakang Load Balancer)
-- PENTING: Tabel ini dibuat otomatis oleh express-mysql-session,
-- tapi didefinisikan di sini untuk dokumentasi dan jika perlu dibuat manual.
-- Session disimpan di database agar KEDUA WebServer berbagi session
-- yang sama, sehingga user tidak perlu login ulang saat ALB
-- mengarahkan request ke server yang berbeda.
-- ============================================================
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) NOT NULL PRIMARY KEY,
    expires INT(11) UNSIGNED NOT NULL,
    data MEDIUMTEXT,
    INDEX idx_expires (expires)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Create Application User (gunakan untuk koneksi dari app)
-- ============================================================
CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED BY 'StrongPassword123!';
GRANT SELECT, INSERT, UPDATE, DELETE ON tubesaws_db.* TO 'appuser'@'%';
FLUSH PRIVILEGES;

-- Verifikasi
SELECT 'Database initialized successfully!' AS status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_members FROM members;
SELECT 'Sessions table ready for Load Balancer!' AS sessions_status;