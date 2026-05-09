import express from 'express';
import { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } from '../controllers/leaveController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

router.use(authenticate);

router.post('/apply', applyLeave);
router.get('/my', getMyLeaves);
router.get('/all', authorize([UserRole.ADMIN]), getAllLeaves);
router.patch('/:id/status', authorize([UserRole.ADMIN]), updateLeaveStatus);

export default router;
