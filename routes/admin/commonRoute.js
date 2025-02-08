import express from "express";
import { getAllTenants } from "../../controller/admin/analysis/allTenantController.js";
import { getAllOwners } from "../../controller/admin/analysis/allOwnerController.js";
import isAuthenticated from "../../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/get/allowners", getAllOwners);
router.get("/get/alltenants", getAllTenants);

export default router;
