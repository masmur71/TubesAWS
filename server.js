// server.js
// Entry Point - TUGAS BESAR BBK3CAB3 - KOMPUTASI AWAN 2026
// Express.js REST API Server + React SPA

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SERVER_ID = process.env.SERVER_ID || '1';
const SERVER_NAME = process.env.SERVER_NAME || 'WebServer-Instance-1';

// ============================================================
// Middleware Stack
// ============================================================
app.use(morgan('combined'));                            // HTTP logging
app.use(express.json());                               // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));       // Parse URL-encoded bodies

// CORS for development (Vite dev server on port 5173)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
  credentials: true,
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'tubesaws-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if behind HTTPS proxy
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax',
  },
}));

// ============================================================
// API Routes
// ============================================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/members', require('./routes/members'));
app.use('/api/server-info', require('./routes/serverInfo'));

// Health check endpoint (for AWS Load Balancer health checks)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    serverId: SERVER_ID,
    serverName: SERVER_NAME,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============================================================
// Serve React SPA (Production)
// ============================================================
const clientBuildPath = path.join(__dirname, 'client/dist');
app.use(express.static(clientBuildPath));

// SPA catch-all — serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  const fs = require('fs');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      success: false,
      message: 'Client build not found. Run: cd client && npm run build',
    });
  }
});

// ============================================================
// Global Error Handler
// ============================================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server. Silakan coba lagi.',
  });
});

// ============================================================
// Start Server
// ============================================================
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log(`Server running on    : http://0.0.0.0:${PORT}`);
  console.log(`Server ID            : ${SERVER_ID}`);
  console.log(`Server Name          : ${SERVER_NAME}`);
  console.log(`Mode                 : ${process.env.NODE_ENV || 'development'}`);
  console.log('');
});

module.exports = app;
