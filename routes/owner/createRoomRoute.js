import express from "express";
import { ownerDetail, updateOwner } from "../../controller/owner/ownerController.js";
import { generateTokenAndSetCookies } from "../../middleware/jwtAuthentication.js";
import isAuthenticated from "../../middleware/isAuthenticated.js";
import { addRoom,  allRooms, deleteRoom, editRoom } from "../../controller/owner/createRoomController.js";
import {uploadMultiple} from "../../middleware/multerSetup.js"

const router= express.Router();

router.post("/add/room/:id",isAuthenticated,uploadMultiple,addRoom);
router.put("/edit/room/:id",isAuthenticated,uploadMultiple,editRoom);
router.delete("/delete/room/:id",isAuthenticated,deleteRoom);

//get all rooms
router.get("/all/rooms",allRooms);


export default router;
