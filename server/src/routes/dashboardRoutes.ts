import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

router.use(authenticate);
router.use(authorize([UserRole.ADMIN]));

router.get('/stats', getDashboardStats);

export default router;
