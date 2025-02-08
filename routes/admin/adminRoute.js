import express from "express";
import { generateTokenAndSetCookies } from "../../middleware/jwtAuthentication.js";
import isAuthenticated from "../../middleware/isAuthenticated.js";
import { adminDetail } from "../../controller/admin/adminDetail.js";

const router= express.Router();

router.get("/admin-details/:id",adminDetail);

export default router;