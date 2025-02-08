import express from "express";
import { generateTokenAndSetCookies } from "../../middleware/jwtAuthentication.js";
import isAuthenticated from "../../middleware/isAuthenticated.js";
import { tenantDetail, updateTenant } from "../../controller/tenant/tenantDetail.js";
import { uploadSingle } from "../../middleware/multerSetup.js";

const router = express.Router();

router.get("/tenant-details/:id", isAuthenticated, tenantDetail);
router.put("/update-tenant/:id", isAuthenticated, uploadSingle, updateTenant);

export default router;