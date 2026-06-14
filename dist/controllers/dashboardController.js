"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const database_1 = __importDefault(require("../config/database"));
const os_1 = __importDefault(require("os"));
exports.dashboardController = {
    // GET /api/dashboard/stats
    getStats: async (req, res) => {
        try {
            const [membersCount] = await database_1.default.query('SELECT COUNT(*) as total FROM members');
            const [usersCount] = await database_1.default.query('SELECT COUNT(*) as total FROM users');
            const [members] = await database_1.default.query('SELECT * FROM members ORDER BY id ASC');
            // Log this request
            const startTime = Date.now();
            await database_1.default.query(`INSERT INTO server_logs (server_id, server_name, ip_address, user_agent, endpoint, method, status_code, response_time_ms)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
                process.env.SERVER_ID || '1',
                process.env.SERVER_NAME || 'WebServer-Instance-1',
                req.ip || req.socket.remoteAddress,
                req.get('User-Agent'),
                req.path,
                req.method,
                200,
                Date.now() - startTime,
            ]);
            return res.json({
                stats: {
                    totalMembers: membersCount[0].total,
                    totalUsers: usersCount[0].total,
                },
                members,
                serverId: process.env.SERVER_ID || '1',
                serverName: process.env.SERVER_NAME || 'WebServer-Instance-1',
                nodeVersion: process.version,
                environment: process.env.NODE_ENV || 'development',
            });
        }
        catch (err) {
            console.error('Dashboard error:', err);
            return res.json({
                stats: { totalMembers: 0, totalUsers: 0 },
                members: [],
                serverId: process.env.SERVER_ID || '1',
                serverName: process.env.SERVER_NAME || 'WebServer-Instance-1',
                nodeVersion: process.version,
                environment: process.env.NODE_ENV || 'development',
                dbError: true,
            });
        }
    },
    // GET /api/server-info
    serverInfo: (req, res) => {
        res.json({
            success: true,
            serverId: process.env.SERVER_ID || '1',
            serverName: process.env.SERVER_NAME || 'WebServer-Instance-1',
            hostname: os_1.default.hostname(),
            timestamp: new Date().toISOString(),
            uptime: process.uptime().toFixed(2),
            memoryUsage: process.memoryUsage(),
        });
    },
    // GET /api/server-logs
    serverLogs: async (req, res) => {
        try {
            const [logs] = await database_1.default.query('SELECT * FROM server_logs ORDER BY created_at DESC LIMIT 50');
            res.json({ success: true, logs });
        }
        catch (err) {
            res.json({ success: false, message: err.message });
        }
    },
};
exports.default = exports.dashboardController;
