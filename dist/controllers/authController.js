"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../config/database"));
exports.authController = {
    // POST /api/auth/login
    processLogin: async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username dan password wajib diisi.',
            });
        }
        try {
            const [rows] = await database_1.default.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username.trim()]);
            if (rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Username atau password salah.',
                });
            }
            const user = rows[0];
            const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Username atau password salah.',
                });
            }
            // Save user to session
            const sessionUser = {
                id: user.id,
                username: user.username,
                role: user.role,
            };
            req.session.user = sessionUser;
            return res.json({
                success: true,
                message: `Selamat datang kembali, ${user.username}!`,
                user: sessionUser,
            });
        }
        catch (err) {
            console.error('Login error:', err);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan server. Silakan coba lagi.',
            });
        }
    },
    // POST /api/auth/logout
    processLogout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Gagal logout.',
                });
            }
            res.clearCookie('connect.sid');
            return res.json({
                success: true,
                message: 'Berhasil logout.',
            });
        });
    },
    // GET /api/auth/me
    getMe: (req, res) => {
        if (req.session && req.session.user) {
            return res.json({
                success: true,
                user: req.session.user,
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Belum login.',
        });
    },
};
exports.default = exports.authController;
