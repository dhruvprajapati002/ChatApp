import mongoose, { Schema } from 'mongoose';
const tempUserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    otpExpiry: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // Auto-delete after 10 minutes (600 seconds)
    },
}, {
    timestamps: true,
});
export default mongoose.model('TempUser', tempUserSchema);
