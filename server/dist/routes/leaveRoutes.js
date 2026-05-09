"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaveController_1 = require("../controllers/leaveController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const User_1 = require("../models/User");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticate);
router.post('/apply', leaveController_1.applyLeave);
router.get('/my', leaveController_1.getMyLeaves);
router.get('/all', (0, authMiddleware_1.authorize)([User_1.UserRole.ADMIN]), leaveController_1.getAllLeaves);
router.patch('/:id/status', (0, authMiddleware_1.authorize)([User_1.UserRole.ADMIN]), leaveController_1.updateLeaveStatus);
exports.default = router;
