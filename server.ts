import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

// Routes
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import memberRoutes from './routes/members';
import serverInfoRoutes from './routes/serverInfo';

dotenv.config();

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
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/server-info', serverInfoRoutes);

// Health check endpoint (for AWS Load Balancer health checks)
app.get('/health', (req: Request, res: Response) => {
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
app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
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
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server. Silakan coba lagi.',
  });
});

// ============================================================
// Start Server
// ============================================================
app.listen(PORT as number, '0.0.0.0', () => {
  console.log('');
  console.log(`Server running on    : http://0.0.0.0:${PORT}`);
  console.log(`Server ID            : ${SERVER_ID}`);
  console.log(`Server Name          : ${SERVER_NAME}`);
  console.log(`Mode                 : ${process.env.NODE_ENV || 'development'}`);
  console.log('');
});

export default app;
