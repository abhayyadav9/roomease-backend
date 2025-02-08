import express from "express";
import {login, logout, register, VerifyEmail} from "../../controller/authController/userController.js";
import { resetPassword, updatePassword, verifyOtp } from "../../controller/authController/pwdResetController.js";
import isAuthenticated from "../../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", VerifyEmail);
router.post("/login",login);
router.post("/logout",isAuthenticated, logout)

//password reset
router.post("/reset-password",resetPassword)
router.post("/verify-otp",verifyOtp)
router.post("/update-password/:userId",updatePassword)



export default router;