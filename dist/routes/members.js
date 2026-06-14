"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const memberController_1 = __importDefault(require("../controllers/memberController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// GET /api/members — List all members
router.get('/', authMiddleware_1.isAuthenticated, memberController_1.default.index);
// GET /api/members/:id — Show single member
router.get('/:id', authMiddleware_1.isAuthenticated, memberController_1.default.show);
exports.default = router;
