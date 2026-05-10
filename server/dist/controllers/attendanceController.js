"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAttendance = exports.getMyAttendance = exports.markAttendance = void 0;
const Attendance_1 = __importDefault(require("../models/Attendance"));
const markAttendance = async (req, res) => {
    try {
        const { status, note, checkIn, checkOut, employeeId } = req.body;
        // If admin is marking, use provided employeeId. Otherwise, use logged in user's ID
        const userId = (req.user?.role === 'admin' && employeeId) ? employeeId : req.user?.id;
        const date = new Date();
        date.setHours(0, 0, 0, 0); // Start of today
        const existingAttendance = await Attendance_1.default.findOne({ user: userId, date });
        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked for today' });
        }
        const attendance = new Attendance_1.default({
            user: userId,
            date,
            status,
            note,
            checkIn: checkIn || new Date(),
            checkOut
        });
        await attendance.save();
        res.status(201).json(attendance);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.markAttendance = markAttendance;
const getMyAttendance = async (req, res) => {
    try {
        const userId = req.user?.id;
        const records = await Attendance_1.default.find({ user: userId }).sort({ date: -1 });
        res.json(records);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getMyAttendance = getMyAttendance;
const getAllAttendance = async (req, res) => {
    try {
        const records = await Attendance_1.default.find().populate('user', 'name email').sort({ date: -1 });
        res.json(records);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAllAttendance = getAllAttendance;
