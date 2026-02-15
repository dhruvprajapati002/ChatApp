import mongoose, { Schema, Document } from 'mongoose';

export interface ITempUser extends Document {
  username: string;
  email: string;
  password: string;
  otp: string;
  otpExpiry: Date;
  createdAt: Date;
}

const tempUserSchema = new Schema<ITempUser>(
  {
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITempUser>('TempUser', tempUserSchema);
