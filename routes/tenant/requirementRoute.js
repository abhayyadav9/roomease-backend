import express from "express";
import isAuthenticated from "../../middleware/isAuthenticated.js";
import { addRequirement, changeRequirementStatus, getAllRequirement, updateRequirement } from "../../controller/tenant/requirementController.js";

const router = express.Router();

// Add a new requirement
router.post("/tenant-add/requirement/:id", isAuthenticated, addRequirement);

// Update an existing requirement
router.put("/update/requirement/:id", isAuthenticated, updateRequirement);

router.get("/all/requirements", getAllRequirement);


// Change requirement status
router.patch("/update/requirement/status/:id", isAuthenticated, changeRequirementStatus);

export default router;
