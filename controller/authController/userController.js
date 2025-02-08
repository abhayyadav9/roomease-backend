import {
  sendVerificationCode,
  sendWelcomeEmail,
} from "../../middleware/Email.js";
import { generateTokenAndSetCookies } from "../../middleware/jwtAuthentication.js";
import User from "../../model/authModel/usermodel.js";
import bcrypt from "bcryptjs";
import Owner from "../../model/ownerModel/ownerdetailschema.js";
import Tenant from "../../model/tenantModel/tenantDetails.js";
import Admin from "../../model/adminModel/adminDetail.js";



export const register = async (req, res) => {
  try {
    let { name, email, password, role, address } = req.body;

    // Ensure required fields are provided
    if (!name || !email || !password || !role) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: false, message: "Invalid email format" });
    }

    role = role.toLowerCase();

    // Validate role
    if (!["owner", "tenant", "admin"].includes(role)) { // ✅ Add "admin" role check
      return res.status(400).json({ status: false, message: "Invalid role provided" });
    }

    // Check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      verificationToken,
    });

    await newUser.save(); // Save the user first

    // 🔹 Create Owner, Tenant, or Admin based on role
    if (role === "owner") {
      const owner = new Owner({
        user: newUser._id,
        name: newUser.name,
        email: newUser.email, 
        address: address || "Not Provided",
      });

      await owner.save();
      newUser.ownerDetails = owner._id;
    }

    if (role === "tenant") {
      const tenant = new Tenant({
        user: newUser._id,
        name: newUser.name,
        address: address || "Not Provided",
      });
      await tenant.save();
      newUser.tenantDetails = tenant._id;
    }

    if (role === "admin") { // ✅ New Admin Handling
      const admin = new Admin({
        user: newUser._id,
        name: newUser.name,
        permissions: ["manage_users", "manage_properties", "view_reports"], // Default permissions
      });
      await admin.save();
      newUser.adminDetails = admin._id;
    }

    await newUser.save(); // ✅ Save updated user with role details

    // Send verification email
    sendVerificationCode(email, verificationToken);

    res.json({
      status: true,
      message: "Please verify your email",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ status: false, message: "Error creating user", error: error.message });
  }
};



















export const VerifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    // Ensure the code is provided
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Verification code is required.",
      });
    }

    // Find the user with the provided verification token
    const user = await User.findOne({ verificationToken: code });

    // If no user is found or the token is expired
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    // If token expiration is implemented, check expiry
    if (user.verificationTokenExpiresAt && user.verificationTokenExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    // Mark user as verified and remove verification fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // Send a welcome email
    await sendWelcomeEmail(user.email, user.name);

    // Send response
    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      error: error.message,
    });
  }
};





// const { validationResult } = require('express-validator');
// import validationResult from ' express-validator.js'

export const login = async (req, res) => {
  try {
    // Validate input using express-validator
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Validation errors",
    //     errors: errors.array(),
    //   });
    // }

    const { email, password, role } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before proceeding.",
      });
    }

    // Validate role if provided
    if (role && role !== user.role) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Role mismatch",
      });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token and set cookies
    const token = await generateTokenAndSetCookies(user._id, res);

    // Respond with user data and token
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login. Please try again later.",
    });
  }
};












export const logout = async (req, res) => {
  try {
    // Check if the token cookie exists
    if (!req.cookies || !req.cookies.token) {
      return res.status(400).json({
        status: false,
        message: "You are already logged out",
      });
    }

    // Clear cookies
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "Strict" });
    res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "Strict" });
    res.clearCookie("isVerified", { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "Strict" });

    res.status(200).json({
      status: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({
      status: false,
      message: "Error while logging out",
    });
  }
};