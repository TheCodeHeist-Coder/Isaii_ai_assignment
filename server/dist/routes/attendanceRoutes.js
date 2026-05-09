"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendanceController_1 = require("../controllers/attendanceController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const User_1 = require("../models/User");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticate);
router.post('/mark', attendanceController_1.markAttendance);
router.get('/my', attendanceController_1.getMyAttendance);
router.get('/all', (0, authMiddleware_1.authorize)([User_1.UserRole.ADMIN]), attendanceController_1.getAllAttendance);
exports.default = router;
