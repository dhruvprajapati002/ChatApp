import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';
console.log('📧 Email Service - Using:', ENV.EMAIL_USER);
// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
    },
});
// Test connection
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Email service connection failed:', error.message);
    }
    else {
        console.log('✅ Email service ready to send messages');
    }
});
// ... rest of your code (generateOTP, sendOTPEmail, sendWelcomeEmail)
// Generate 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// Send OTP email
export const sendOTPEmail = async (email, otp, username) => {
    const mailOptions = {
        from: `"PulseChat" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your PulseChat Account',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 40px 30px;
          }
          .otp-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            font-size: 36px;
            font-weight: bold;
            text-align: center;
            padding: 20px;
            border-radius: 8px;
            letter-spacing: 8px;
            margin: 30px 0;
          }
          .message {
            color: #333333;
            line-height: 1.6;
            font-size: 16px;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666666;
            font-size: 14px;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Welcome to PulseChat!</h1>
          </div>
          <div class="content">
            <p class="message">Hi <strong>${username}</strong>,</p>
            <p class="message">
              Thank you for signing up! Please verify your email address to complete your registration.
            </p>
            <p class="message">Your verification code is:</p>
            <div class="otp-box">${otp}</div>
            <p class="message">
              This code will expire in <strong>10 minutes</strong>.
            </p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> Never share this code with anyone. PulseChat will never ask for your OTP via phone or social media.
            </div>
          </div>
          <div class="footer">
            <p>If you didn't create this account, please ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} PulseChat. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent to:', email);
    }
    catch (error) {
        console.error('❌ Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};
// Send welcome email after verification
export const sendWelcomeEmail = async (email, username) => {
    const mailOptions = {
        from: `"PulseChat" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to PulseChat! 🎉',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to PulseChat!</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${username}</strong>,</p>
            <p>Your account has been successfully verified! 🎊</p>
            <p>You can now:</p>
            <ul>
              <li>💬 Start real-time conversations</li>
              <li>👥 Connect with friends</li>
              <li>🔔 Receive instant notifications</li>
              <li>🌐 Chat from anywhere</li>
            </ul>
            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL}/chat" class="button">Start Chatting Now</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PulseChat. Happy Chatting!</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent to:', email);
    }
    catch (error) {
        console.error('❌ Error sending welcome email:', error);
    }
};
