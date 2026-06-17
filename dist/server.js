"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const express_mysql_session_1 = __importDefault(require("express-mysql-session"));
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
// Trust Proxy (WAJIB jika di belakang AWS ALB / Reverse Proxy)
// Memastikan req.ip, X-Forwarded-For, dan cookie secure bekerja benar
// ============================================================
app.set('trust proxy', 1);
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
// ============================================================
// MySQL Session Store (Shared Session untuk Load Balancer)
// Session disimpan di database agar kedua WebServer berbagi
// session yang sama — user tidak perlu login ulang saat ALB
// mengarahkan request ke server lain.
// ============================================================
const MySQLStoreSession = (0, express_mysql_session_1.default)(express_session_1.default);
const sessionStoreOptions = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tubesaws_db',
    // Auto-create tabel sessions jika belum ada
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data',
        },
    },
};
const sessionStore = new MySQLStoreSession(sessionStoreOptions);
// Session configuration
app.use((0, express_session_1.default)({
    name: 'tubesaws.sid', // Nama cookie yang konsisten di semua server
    secret: process.env.SESSION_SECRET || 'tubesaws-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: sessionStore, // Gunakan MySQL store, bukan in-memory
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true di production (HTTPS via ALB)
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 jam
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
    console.log(`Session store        : MySQL (${process.env.DB_HOST}/${process.env.DB_NAME})`);
    console.log('');
});
exports.default = app;
