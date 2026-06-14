"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = __importDefault(require("../controllers/dashboardController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// GET /api/dashboard/stats
router.get('/stats', authMiddleware_1.isAuthenticated, dashboardController_1.default.getStats);
// GET /api/dashboard/server-logs
router.get('/server-logs', authMiddleware_1.isAuthenticated, dashboardController_1.default.serverLogs);
exports.default = router;
