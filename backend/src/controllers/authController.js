import transporter from "../config/nodemailer.js";
import { createToken } from "../libs/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Details are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate a 6-digit OTP
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create temporary user data (don't save yet)
    const tempUserData = {
      fullName,
      email,
      password: hashedPassword,
      otp: OTP,
      otpExpiry,
    };

    // Email options
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Welcome to HUTdotCOM - Verify Your Email",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Account Verification</h2>
        <p>Your one-time verification code is:</p>
        <div style="background: #f3f4f6; padding: 16px; text-align: center; margin: 16px 0; font-size: 24px; font-weight: bold;">
          ${OTP}
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          This code will expire in 10 minutes. If you didn't request this, please ignore this email.
        </p>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Verification email sent",
      tempUserData,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyAndCreateUser = async (req, res) => {
  const { email, otp, tempUserData } = req.body;

  try {
    // Verify OTP
    if (!tempUserData || tempUserData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (tempUserData.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Check if user already exists (just in case)
    const existingUser = await User.findOne({ email: tempUserData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create the actual user in database
    const newUser = new User({
      fullName: tempUserData.fullName,
      email: tempUserData.email,
      password: tempUserData.password,
      isAccountVerified: true,
      role: "user",
    });

    try {
      await newUser.save();
      console.log("User saved successfully:", newUser);
    } catch (saveError) {
      console.error("Error saving user:", saveError);
      return res.status(500).json({
        success: false,
        message: "Failed to save user to database",
      });
    }

    // Generate token
    const token = createToken(tempUserData.email, newUser.role, newUser.shop);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Account created successfully",
      id: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      isAccountVerified: newUser.isAccountVerified,
      role: newUser.role,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "email and password is required",
    });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User does not exist!",
      });
    }
    const isMatchedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isMatchedPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect!",
      });
    }

    const token = createToken(email, existingUser.role, existingUser.shop);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Successfully logged in!",
      id: existingUser._id,
      email: existingUser.email,
      fullName: existingUser.fullName,
      isAccountVerified: existingUser.isAccountVerified,
      role: existingUser.role,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res
      .status(200)
      .json({ success: true, message: "Successfully logged out!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const sendVerifyOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Basic validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified",
      });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.verifyOtp = OTP;
    user.verifyOtpExpireAt = otpExpiry;
    await user.save();

    // Email options
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${OTP}. Verify your account using this 6 digit OTP`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Account Verification</h2>
        <p>Your one-time verification code is:</p>
        <div style="background: #f3f4f6; padding: 16px; text-align: center; margin: 16px 0; font-size: 24px; font-weight: bold;">
          ${OTP}
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          This code will expire in 10 minutes. If you didn't request this, please ignore this email.
        </p>
      </div>
      `,
    };

    // Send email with error handling
    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({
        success: true,
        message: "Verification OTP sent to your email",
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }
  } catch (error) {
    console.error("Error in sendVerifyOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email, tempUserData } = req.body;

    if (!email || !tempUserData) {
      return res.status(400).json({
        success: false,
        message: "Email and user data are required",
      });
    }

    // Generate new OTP
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Update the tempUserData with new OTP
    const updatedTempUserData = {
      ...tempUserData,
      otp: OTP,
      otpExpiry,
    };

    // Email with new OTP
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "New Verification Code",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Verification Code</h2>
        <p>Your new verification code is:</p>
        <div style="background: #f3f4f6; padding: 16px; text-align: center; margin: 16px 0; font-size: 24px; font-weight: bold;">
          ${OTP}
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          This code will expire in 10 minutes.
        </p>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "New verification code sent",
      otp: OTP,
      updatedTempUserData,
    });
  } catch (error) {
    console.error("Error in resendVerification:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "User is authenticated!" });
  } catch (error) {
    console.error("Error in isAuthenticated:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  try {
    const user = await User.findOne({ email }).select(
      "email resetOtp resetOtpExpireAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetOtp = OTP;
    user.resetOtpExpireAt = otpExpiry;
    await user.save();

    // Email options
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: user.email,
      subject: "Password reset OTP",
      text: `Your OTP is ${OTP}. Reset your password using this 6 digit OTP`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Reset Password</h2>
        <p>Your one-time verification code is:</p>
        <div style="background: #f3f4f6; padding: 16px; text-align: center; margin: 16px 0; font-size: 24px; font-weight: bold;">
          ${OTP}
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          This code will expire in 10 minutes. If you didn't request this, please ignore this email.
        </p>
      </div>
      `,
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({
        success: true,
        message: "OTP sent to your email to reset password",
      });
    } catch (error) {
      console.error("Email sending failed in sendResetOtp:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }
  } catch (error) {
    console.error("Error in sendVerifyOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log(req.body);
  console.log(otp);

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP is required!",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email and New password is required!",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
