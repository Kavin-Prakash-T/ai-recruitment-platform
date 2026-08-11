import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { registerValidator, loginValidator } from '../validators/authValidator';
import { protect } from '../middleware/authMiddleware';

const router = Router();
const authController = new AuthController();

// POST /api/auth/register
router.post('/register', registerValidator, authController.register);

// POST /api/auth/login
router.post('/login', loginValidator, authController.login);

// POST /api/auth/logout
router.post('/logout', protect, authController.logout);

// GET /api/auth/me
router.get('/me', protect, authController.me);

export default router;
