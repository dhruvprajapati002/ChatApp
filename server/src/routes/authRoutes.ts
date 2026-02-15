import express from 'express';
import { register, login, logout,verifyOTP,resendOTP } from '../controllers/authController';
import { googleAuth } from '../controllers/googleAuthController.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);  // ✅ NEW
router.post('/resend-otp', resendOTP);  // ✅ NEW
router.post('/logout', logout);
router.post('/google', googleAuth); // NEW

export default router;
