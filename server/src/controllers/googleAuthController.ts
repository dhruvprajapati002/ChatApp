import { Request, Response } from 'express';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage' // For credential flow
);

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential } = req.body;

    // Validate credential
    if (!credential) {
      res.status(400).json({ 
        message: 'No credential provided',
        code: 'NO_CREDENTIAL' 
      });
      return;
    }

    // Verify the Google token
    const ticket = await oauth2Client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    if (!payload || !payload.email) {
      res.status(400).json({ 
        message: 'Invalid Google token',
        code: 'INVALID_TOKEN' 
      });
      return;
    }

    const { email, name, sub: googleId, picture } = payload;

    // Generate username from name or email
    const username = name || email.split('@')[0];

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Google data
      user = await User.create({
        username,
        email,
        password: `google_${googleId}_${Date.now()}`, // Random secure password
        avatar: picture,
        isOnline: true,
      });
      
      console.log('✅ New user created via Google:', email);
    } else {
      // Update existing user online status and avatar
      user = await User.findByIdAndUpdate(
        user._id, 
        { 
          isOnline: true,
          avatar: picture || user.avatar,
          lastSeen: new Date()
        },
        { new: true } // Return updated document
      );
      
      console.log('✅ Existing user logged in via Google:', email);
    }

    if (!user) {
      res.status(500).json({ 
        message: 'Failed to create or update user',
        code: 'USER_ERROR' 
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline
      },
    });
  } catch (error: any) {
    console.error('❌ Google auth error:', error);
    
    // Handle specific Google API errors
    if (error.message?.includes('Token used too late')) {
      res.status(401).json({ 
        message: 'Token expired. Please try again.',
        code: 'TOKEN_EXPIRED' 
      });
      return;
    }

    if (error.message?.includes('Invalid token')) {
      res.status(401).json({ 
        message: 'Invalid Google token',
        code: 'INVALID_TOKEN' 
      });
      return;
    }

    // Generic error
    res.status(500).json({ 
      message: 'Google authentication failed. Please try again.',
      code: 'AUTH_FAILED',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
