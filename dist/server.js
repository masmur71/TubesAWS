"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const members_1 = __importDefault(require("./routes/members"));
const serverInfo_1 = __importDefault(require("./routes/serverInfo"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const SERVER_ID = process.env.SERVER_ID || '1';
const SERVER_NAME = process.env.SERVER_NAME || 'WebServer-Instance-1';
// ============================================================
// Middleware Stack
// ============================================================
app.use((0, morgan_1.default)('combined')); // HTTP logging
app.use(express_1.default.json()); // Parse JSON bodies
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded bodies
// CORS for development (Vite dev server on port 5173)
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
    credentials: true,
}));
// Serve uploaded files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'public/uploads')));
// Session configuration
app.use((0, express_session_1.default)({
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
app.use('/api/auth', auth_1.default);
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/members', members_1.default);
app.use('/api/server-info', serverInfo_1.default);
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
const clientBuildPath = path_1.default.join(__dirname, 'client/dist');
app.use(express_1.default.static(clientBuildPath));
// SPA catch-all — serve index.html for all non-API routes
app.get('*', (req, res) => {
    const indexPath = path_1.default.join(clientBuildPath, 'index.html');
    if (fs_1.default.existsSync(indexPath)) {
        res.sendFile(indexPath);
    }
    else {
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
exports.default = app;
