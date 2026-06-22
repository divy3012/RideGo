import mongoose, { Document } from "mongoose";

type Status =
  | "not_required"
  | "pending"
  | "in_progress"
  | "approved"
  | "rejected";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "partner" | "admin";
  isEmailVerified: boolean;
  otp: string;
  mobileNumber?: string;
  otpExpiresAt: Date;
  partnerOnboardingSteps: number;
  partnerStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  videoKycStatus: Status;
  videoKycRoomId: string;
  videoKycRejectionReason: string;
  socketId: string | null;

  location?: {
    type: "Point";
    coordinates: [number, number];
  };

  isOnline: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "partner", "admin"],
      default: "user",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
    },

    otpExpiresAt: {
      type: Date,
    },

    partnerOnboardingSteps: {
      type: Number,
      min: 0,
      max: 8,
      default: 0,
    },

    mobileNumber: {
      type: String,
    },

    partnerStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
    },

    videoKycStatus: {
      type: String,
      enum: ["not_required", "pending", "in_progress", "approved", "rejected"],
      default: "not_required",
    },

    videoKycRoomId: {
      type: String,
    },

    videoKycRejectionReason: {
      type: String,
    },

    socketId: {
      type: String,
      default: null,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    isOnline: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

userSchema.index({ location: "2dsphere" });

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
