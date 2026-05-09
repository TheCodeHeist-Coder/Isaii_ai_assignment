"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeaveStatus = exports.getAllLeaves = exports.getMyLeaves = exports.applyLeave = void 0;
const Leave_1 = __importDefault(require("../models/Leave"));
const applyLeave = async (req, res) => {
    try {
        const { startDate, endDate, reason, leaveType } = req.body;
        const userId = req.user?.id;
        const leave = new Leave_1.default({
            user: userId,
            startDate,
            endDate,
            reason,
            leaveType
        });
        await leave.save();
        res.status(201).json(leave);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.applyLeave = applyLeave;
const getMyLeaves = async (req, res) => {
    try {
        const userId = req.user?.id;
        const leaves = await Leave_1.default.find({ user: userId }).sort({ appliedAt: -1 });
        res.json(leaves);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getMyLeaves = getMyLeaves;
const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave_1.default.find().populate('user', 'name email').sort({ appliedAt: -1 });
        res.json(leaves);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAllLeaves = getAllLeaves;
const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const leave = await Leave_1.default.findById(req.params.id);
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        leave.status = status;
        await leave.save();
        res.json(leave);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateLeaveStatus = updateLeaveStatus;
