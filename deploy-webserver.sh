#!/bin/bash
# =============================================================
# deploy-webserver.sh
# Script otomasi deploy TubesAWS ke EC2 Ubuntu (t3.micro)
#
# Cara pakai:
#   chmod +x deploy-webserver.sh
#   ./deploy-webserver.sh
#
# Script ini akan menanya SERVER_ID (1 atau 2), DB_HOST, dan
# SESSION_SECRET yang HARUS SAMA di kedua WebServer.
# =============================================================

set -e  # Exit on error

echo ""
echo "======================================================"
echo "  TubesAWS - Auto Deploy Script"
echo "  Tugas Besar BBK3CAB3 - Komputasi Awan 2026"
echo "======================================================"
echo ""

# --- Tanya input dari user ---
read -p "Masukkan SERVER_ID (1 atau 2): " SERVER_ID
read -p "Masukkan DB_HOST (Private IP DB-Server, contoh: 172.31.x.x): " DB_HOST
read -p "Masukkan DB_PASSWORD [StrongPassword123!]: " DB_PASSWORD
DB_PASSWORD="${DB_PASSWORD:-StrongPassword123!}"

echo ""
echo "PENTING: SESSION_SECRET harus SAMA PERSIS di kedua WebServer!"
echo "Contoh: gunakan satu string random dan copy ke kedua server."
read -p "Masukkan SESSION_SECRET: " SESSION_SECRET
if [ -z "$SESSION_SECRET" ]; then
  echo "ERROR: SESSION_SECRET tidak boleh kosong!"
  echo "       Generate contoh: openssl rand -hex 32"
  exit 1
fi

SERVER_NAME="WebServer-Instance-${SERVER_ID}"
echo ""
echo "Config:"
echo "  SERVER_ID   = $SERVER_ID"
echo "  SERVER_NAME = $SERVER_NAME"
echo "  DB_HOST     = $DB_HOST"
echo ""

# --- Step 1: Buat Swap Memory (PENTING untuk build React) ---
echo "[1/8] Membuat swap memory 2GB..."
if [ ! -f /swapfile ]; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab > /dev/null
  echo "  ✅ Swap 2GB aktif"
else
  echo "  ⏭️  Swap sudah ada, skip"
fi

# --- Step 2: Update sistem & install dependencies ---
echo "[2/8] Update sistem & install Node.js 20..."
sudo apt update -y -qq
sudo apt install -y -qq curl git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - > /dev/null 2>&1
sudo apt install -y -qq nodejs
echo "  ✅ Node.js $(node --version) terinstall"

# --- Step 3: Clone / Pull project ---
echo "[3/8] Setup project..."
APP_DIR="$HOME/app"

if [ -d "$APP_DIR/.git" ]; then
  echo "  ⏭️  Repo sudah ada, pull update..."
  git -C "$APP_DIR" pull
else
  echo "  Masukkan GitHub repo URL (contoh: https://github.com/USERNAME/TUBESAWS.git)"
  read -p "  Git URL: " GIT_URL
  if [ -n "$GIT_URL" ]; then
    git clone "$GIT_URL" "$APP_DIR"
  else
    echo "  ⚠️  Skip clone. Pastikan folder ~/app sudah berisi project."
  fi
fi

cd "$APP_DIR"
echo "  ✅ Project siap di $APP_DIR"

# --- Step 4: Buat file .env SEBELUM build ---
# SESSION_SECRET HARUS sama di kedua WebServer agar shared session bekerja!
echo "[4/8] Membuat file .env..."
cat > "$APP_DIR/.env" << EOF
PORT=3000
NODE_ENV=production
SERVER_ID=${SERVER_ID}
SERVER_NAME=${SERVER_NAME}
DB_HOST=${DB_HOST}
DB_PORT=3306
DB_USER=appuser
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=tubesaws_db
SESSION_SECRET=${SESSION_SECRET}
EOF
echo "  ✅ .env dibuat (SESSION_SECRET sudah diset)"

# --- Step 5: Install backend dependencies ---
echo "[5/8] Install backend dependencies..."
npm install --ignore-scripts --silent
echo "  ✅ Backend deps terinstall"

# --- Step 6: Build TypeScript server ---
echo "[6/8] Build TypeScript server..."
npm run build:server
echo "  ✅ TypeScript compiled ke dist/"

# --- Step 7: Install & Build React frontend ---
echo "[7/8] Build React frontend (ini butuh beberapa menit)..."
cd client
npm install --silent
npm run build
cd ..
echo "  ✅ React build selesai di client/dist/"

# --- Install PM2 & jalankan ---
echo "[8/8] Menjalankan aplikasi dengan PM2..."
sudo npm install -g pm2 --silent

# Stop instance lama jika ada
pm2 stop tubesaws 2>/dev/null || true
pm2 delete tubesaws 2>/dev/null || true

pm2 start "$APP_DIR/dist/server.js" --name tubesaws
pm2 startup | grep -v "^\[" | tail -1 | bash || true
pm2 save

echo ""
echo "======================================================"
echo "  ✅ DEPLOY BERHASIL!"
echo ""
echo "  Server berjalan di port 3000"
echo "  SERVER_ID: $SERVER_ID"
echo ""
echo "  Cek status  : pm2 status"
echo "  Lihat log   : pm2 logs tubesaws"
echo "  Test lokal  : curl http://localhost:3000/health"
echo ""
echo "  ⚠️  INGAT: SESSION_SECRET harus SAMA di WebServer-1"
echo "      dan WebServer-2 agar shared session bekerja!"
echo "======================================================"
echo ""
