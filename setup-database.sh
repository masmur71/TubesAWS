#!/bin/bash
# =============================================================
# setup-database.sh
# Script otomasi setup MySQL di EC2 DB-Server Ubuntu (t3.micro)
#
# Cara pakai:
#   chmod +x setup-database.sh
#   ./setup-database.sh
# =============================================================

set -e

echo ""
echo "======================================================"
echo "  TubesAWS - Database Setup Script"
echo "  Tugas Besar BBK3CAB3 - Komputasi Awan 2026"
echo "======================================================"
echo ""

# --- Step 1: Install MySQL ---
echo "[1/4] Update sistem & install MySQL..."
sudo apt update -y -qq
sudo apt install -y -qq mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
echo "  ✅ MySQL terinstall dan berjalan"

# --- Step 2: Konfigurasi bind-address ---
echo "[2/4] Konfigurasi MySQL bind-address..."
sudo sed -i 's/^bind-address.*=.*127.0.0.1/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
sudo systemctl restart mysql
echo "  ✅ MySQL sekarang bisa diakses dari WebServer (0.0.0.0)"

# --- Step 3: Buat database, tabel, dan user ---
echo "[3/4] Membuat database, tabel, dan user..."
sudo mysql << 'SQL'
-- Database
CREATE DATABASE IF NOT EXISTS tubesaws_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tubesaws_db;

-- Tabel users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabel members
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

-- Tabel server_logs
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

-- Seed users (password: admin123)
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$rZCVjW8X1YqKLfLJHPaKs.LVdY9k8LmN3oq3K9fZmJxKgOqJnHhGe', 'admin'),
('demo', '$2a$10$rZCVjW8X1YqKLfLJHPaKs.LVdY9k8LmN3oq3K9fZmJxKgOqJnHhGe', 'user')
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Seed members (kelompok BBK3CAB3)
INSERT INTO members (nim, nama, email, prodi, kelas, foto, bio, role_kelompok) VALUES
('102022580002', 'M.Ariq Nafis', 'mariqnafis@student.telkomuniversity.ac.id', 'S1 Sistem Informasi', 'BBK3CAB3', 'ariq.jpg', 'Mahasiswa aktif Sistem informasi Telkom University. Tertarik pada Machine learning.', 'BOS ML/DS'),
('102022580024', 'Nadhif Arrafi Waltam', 'nadhifarrafiwaltam@student.telkomuniversity.ac.id', 'S1 Sistem Informasi', 'BBK3CAB3', 'nadhif.jpeg', 'Mahasiswa aktif yang fokus pada pengembangan dan UI/UX.', 'UI/UX'),
('102022580025', 'Masmur Toloni Harefa', 'masmurtoloniharefa@student.telkomuniversity.ac.id', 'S1 Sistem Informasi', 'BBK3CAB3', 'masmur.jpeg', 'Tertarik pada AI dan cloud computing.', 'BATMAN'),
('102022580060', 'Naufal Adhani Putra', 'naufaladhaniputra@student.telkomuniversity.ac.id', 'S1 Sistem Informasi', 'BBK3CAB3', 'dani.jpeg', 'Berfokus pada IT Governance.', 'Sistem Analist')
ON DUPLICATE KEY UPDATE foto = VALUES(foto), updated_at = NOW();

-- Buat user appuser untuk koneksi dari WebServer
CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED BY 'StrongPassword123!';
GRANT SELECT, INSERT, UPDATE, DELETE ON tubesaws_db.* TO 'appuser'@'%';
FLUSH PRIVILEGES;
SQL

echo "  ✅ Database, tabel, dan data seed berhasil dibuat"

# --- Step 4: Verifikasi ---
echo "[4/4] Verifikasi koneksi..."
mysql -u appuser -p'StrongPassword123!' -e "USE tubesaws_db; SELECT id, username, role FROM users;" 2>/dev/null && \
  echo "  ✅ Koneksi appuser berhasil!" || \
  echo "  ❌ Verifikasi gagal. Cek konfigurasi MySQL."

echo ""
echo "======================================================"
echo "  ✅ DATABASE SETUP SELESAI!"
echo ""
echo "  DB Name     : tubesaws_db"
echo "  DB User     : appuser"
echo "  DB Password : StrongPassword123!"
echo ""
echo "  Private IP instance ini (untuk .env WebServer):"
hostname -I | awk '{print "  DB_HOST     :", $1}'
echo "======================================================"
echo ""
