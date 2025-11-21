import { Router } from 'express';
import userController from '@controllers/userController';
import { authenticate } from '@middleware/authMiddleware';

const router = Router();

// Protected routes
router.get('/me', authenticate, userController.getCurrentUser);

export default router;

