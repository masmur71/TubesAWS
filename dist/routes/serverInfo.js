"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = __importDefault(require("../controllers/dashboardController"));
const router = express_1.default.Router();
// GET /api/server-info — public endpoint for instance info
router.get('/', dashboardController_1.default.serverInfo);
exports.default = router;
