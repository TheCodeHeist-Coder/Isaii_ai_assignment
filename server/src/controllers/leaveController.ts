import { Request, Response } from 'express';
import Leave from '../models/Leave';
import { AuthRequest } from '../middleware/authMiddleware';

export const applyLeave = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, reason, leaveType } = req.body;
    const userId = req.user?.id;

    const leave = new Leave({
      user: userId,
      startDate,
      endDate,
      reason,
      leaveType
    });

    await leave.save();
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMyLeaves = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const leaves = await Leave.find({ user: userId }).sort({ appliedAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllLeaves = async (req: Request, res: Response) => {
  try {
    const leaves = await Leave.find().populate('user', 'name email').sort({ appliedAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateLeaveStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = status;
    await leave.save();
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
