import User from "../../model/authModel/usermodel.js";
import { sendResetCode } from "../../middleware/Email.js";
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookies } from "../../middleware/jwtAuthentication.js";

// Reset Password (Send OTP) 
import isEmail  from "validator";
export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
   

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Sorry! Email not found!",
      });
    }

    // Generate a 6-digit OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the verification code and its expiration time to the user
    user.resetToken = verificationCode;
    user.resetTokenExpires = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes expiration (updated to match the code)
    await user.save();

    // Ensure email is sent before responding
    await sendResetCode(email, verificationCode);

    return res.status(200).json({
      status: true,
      message: "OTP sent to your email. Please check your email.",
    });
  } catch (error) {
    console.error("Error during password reset:", error);

    // Handle known error codes, such as email sending failure
    if (error.message.includes("Failed to send email")) {
      return res.status(500).json({
        status: false,
        message: "Failed to send OTP email. Please try again later.",
      });
    }

    // Generic error fallback
    return res.status(500).json({
      status: false,
      message: "An error occurred. Please try again later.",
    });
  }
};


// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { resetToken } = req.body;
    const user = await User.findOne({ resetToken });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid or expired OTP!",
      });
    }

    // Check OTP expiration
    if (user.resetTokenExpires < Date.now()) {
      return res.status(400).json({
        status: false,
        message: "Sorry! OTP expired!",
      });
    }

    // Check if the provided OTP matches the stored reset token
    // if (user.resetToken !== otp) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "Invalid OTP!",
    //   });
    // }
    

    return res.status(200).json({
      status: true,
      message: "OTP verified successfully!",
    });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

// Update Password
// Update Password
export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { resetToken } = req.params;
    const user = await User.findOne(resetToken); // Updated to find by ID

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid User or invalid otp",
      });
    }
    if(user.resetToken ==="null"){
      return res.status(400).json({
        status: false,
        message: "Please verify your OTP first",
      })
    }

    if (user.resetTokenExpires < Date.now()) {
      return res.status(400).json({
        status: false,
        message: "Sorry! OTP expired!",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.error("Error during password update:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred. Please try again later.",
    });
  }
};
