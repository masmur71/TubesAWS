"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberController = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.memberController = {
    // GET /api/members - List all members
    index: async (req, res) => {
        try {
            const [members] = await database_1.default.query('SELECT * FROM members ORDER BY id ASC');
            return res.json({
                success: true,
                members,
            });
        }
        catch (err) {
            console.error('Members list error:', err);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan server.',
            });
        }
    },
    // GET /api/members/:id - Show single member
    show: async (req, res) => {
        try {
            const [rows] = await database_1.default.query('SELECT * FROM members WHERE id = ? LIMIT 1', [req.params.id]);
            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Anggota tidak ditemukan.',
                });
            }
            return res.json({
                success: true,
                member: rows[0],
            });
        }
        catch (err) {
            console.error('Member show error:', err);
            return res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan server.',
            });
        }
    },
};
exports.default = exports.memberController;
