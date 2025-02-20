import express from "express";
import { ownerDetail, updateOwner } from "../../controller/owner/ownerController.js";
import { generateTokenAndSetCookies } from "../../middleware/jwtAuthentication.js";
import isAuthenticated from "../../middleware/isAuthenticated.js";
import { uploadSingle } from "../../middleware/multerSetup.js";
const router= express.Router();

router.get("/owner-details/:id",ownerDetail);
router.put("/update-owner/:id",uploadSingle, updateOwner);


export default router;
