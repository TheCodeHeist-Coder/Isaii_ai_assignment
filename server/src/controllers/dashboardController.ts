import { Request, Response } from 'express';
import User, { UserRole } from '../models/User';
import Attendance from '../models/Attendance';
import Leave from '../models/Leave';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const employeeCount = await User.countDocuments({ role: UserRole.EMPLOYEE });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await Attendance.countDocuments({ date: today, status: 'present' });

    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });

    res.json({
      employeeCount,
      todayAttendance,
      pendingLeaves
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
