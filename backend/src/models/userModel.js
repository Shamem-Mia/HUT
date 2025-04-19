import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
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
      required: true,
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["user", "shop-owner", "admin", "delivery-man"],
      default: "user",
    },
    phone: {
      type: String,
      default: "",
    },
    deliveredCoin: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
