import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TempUser from '../models/TempUser.js';
import { generateOTP, sendOTPEmail, sendWelcomeEmail } from '../services/emailService.js';
// Register - Save to TempUser and Send OTP
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Validate input
        if (!username || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        // Check if user already exists in main User collection
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.isVerified) {
                res.status(400).json({ message: 'User already exists with this email' });
                return;
            }
            else {
                // User exists but not verified - this shouldn't happen now
                res.status(400).json({ message: 'Please complete verification for this email' });
                return;
            }
        }
        // Check if temp user already exists
        const existingTempUser = await TempUser.findOne({ email });
        if (existingTempUser) {
            // Delete old temp user and create new one
            await TempUser.deleteOne({ email });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        // Create temporary user
        const tempUser = await TempUser.create({
            username,
            email,
            password: hashedPassword,
            otp,
            otpExpiry,
        });
        // Send OTP email
        await sendOTPEmail(email, otp, username);
        res.status(201).json({
            success: true,
            message: 'OTP sent to your email. Please verify to complete registration.',
            tempUserId: tempUser._id,
            email: tempUser.email,
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Verify OTP and Create Actual User
export const verifyOTP = async (req, res) => {
    try {
        const { tempUserId, otp } = req.body;
        if (!tempUserId || !otp) {
            res.status(400).json({ message: 'Temp User ID and OTP are required' });
            return;
        }
        // Find temp user
        const tempUser = await TempUser.findById(tempUserId);
        if (!tempUser) {
            res.status(404).json({ message: 'Registration session expired. Please register again.' });
            return;
        }
        // Check OTP expiry
        if (new Date() > tempUser.otpExpiry) {
            await TempUser.deleteOne({ _id: tempUserId });
            res.status(400).json({ message: 'OTP expired. Please register again.' });
            return;
        }
        // Verify OTP
        if (tempUser.otp !== otp) {
            res.status(400).json({ message: 'Invalid OTP' });
            return;
        }
        // Check if user was created in the meantime
        const existingUser = await User.findOne({ email: tempUser.email });
        if (existingUser) {
            await TempUser.deleteOne({ _id: tempUserId });
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // Create actual user in User collection
        const user = await User.create({
            username: tempUser.username,
            email: tempUser.email,
            password: tempUser.password,
            isVerified: true,
            isOnline: false,
        });
        // Delete temp user
        await TempUser.deleteOne({ _id: tempUserId });
        // Send welcome email
        await sendWelcomeEmail(user.email, user.username);
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.json({
            success: true,
            message: 'Email verified successfully!',
            token,
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                isVerified: user.isVerified,
            },
        });
    }
    catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Resend OTP
export const resendOTP = async (req, res) => {
    try {
        const { tempUserId } = req.body;
        if (!tempUserId) {
            res.status(400).json({ message: 'Temp User ID is required' });
            return;
        }
        const tempUser = await TempUser.findById(tempUserId);
        if (!tempUser) {
            res.status(404).json({ message: 'Registration session expired. Please register again.' });
            return;
        }
        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        tempUser.otp = otp;
        tempUser.otpExpiry = otpExpiry;
        await tempUser.save();
        // Send OTP email
        await sendOTPEmail(tempUser.email, otp, tempUser.username);
        res.json({
            success: true,
            message: 'New OTP sent to your email',
        });
    }
    catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Check if verified
        if (!user.isVerified) {
            res.status(403).json({
                message: 'Please verify your email first. Please register again.',
            });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.json({
            token,
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                isVerified: user.isVerified,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const logout = async (req, res) => {
    res.json({ message: 'Logged out successfully' });
};
// Google OAuth
export const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            res.status(400).json({ message: 'Google credential is required' });
            return;
        }
        // Decode Google JWT (you'll need to verify it properly in production)
        const base64Url = credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
        const { email, name, picture, sub: googleId } = payload;
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            // Create new user with Google OAuth
            user = await User.create({
                username: name || email.split('@')[0],
                email,
                googleId,
                avatar: picture,
                isVerified: true, // Google users are pre-verified
                isOnline: false,
            });
        }
        else if (!user.googleId) {
            // Link Google account to existing user
            user.googleId = googleId;
            user.avatar = picture || user.avatar;
            user.isVerified = true;
            await user.save();
        }
        // Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.json({
            token,
            user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                isVerified: user.isVerified,
            },
        });
    }
    catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ message: 'Google authentication failed' });
    }
};
