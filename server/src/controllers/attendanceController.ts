import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import { AuthRequest } from '../middleware/authMiddleware';

export const markAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const { status, note, checkIn, checkOut } = req.body;
    const userId = req.user?.id;
    const date = new Date();
    date.setHours(0, 0, 0, 0); // Start of today

    const existingAttendance = await Attendance.findOne({ user: userId, date });
    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }

    const attendance = new Attendance({
      user: userId,
      date,
      status,
      note,
      checkIn: checkIn || new Date(),
      checkOut
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getMyAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const records = await Attendance.find({ user: userId }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllAttendance = async (req: Request, res: Response) => {
  try {
    const records = await Attendance.find().populate('user', 'name email').sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
