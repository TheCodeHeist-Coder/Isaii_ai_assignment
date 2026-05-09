import express from 'express';
import { markAttendance, getMyAttendance, getAllAttendance } from '../controllers/attendanceController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

router.use(authenticate);

router.post('/mark', markAttendance);
router.get('/my', getMyAttendance);
router.get('/all', authorize([UserRole.ADMIN]), getAllAttendance);

export default router;
