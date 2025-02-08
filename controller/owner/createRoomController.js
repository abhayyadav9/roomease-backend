import Room from "../../model/ownerModel/createRoomSchema.js";
import Owner from "../../model/ownerModel/ownerdetailschema.js";
import User from "../../model/authModel/usermodel.js";


export const addRoom = async (req, res) => {
  try {
    console.log("Received request to add a room");

    // ✅ Extract data from request
    const {
      houseName,
      roomType,
      numberRoom,
      contactNumber,
      address,
      price,
      description,
    } = req.body;

    const ownerId = req.params.id;
    console.log("Owner ID:", ownerId);

    // ✅ Check if owner exists
    const ownerExists = await Owner.findOne({ user: ownerId });

    if (!ownerExists) {
      console.log("❌ Owner not found for ID:", ownerId);
      return res.status(404).json({ status: false, message: "Owner not found" });
    }

    console.log("✅ Owner found:", ownerExists._id);

    // ✅ Handle multiple images
    let roomImages = [];
    if (req.files && req.files.length > 0) {
      roomImages = req.files.map((file) => file.path); // Cloudinary image URLs
    } else {
      console.log("⚠ No images uploaded");
    }

    // ✅ Ensure required fields are present
    if (!houseName || !roomType || !address || !price) {
      console.log("❌ Missing required fields:", { houseName, roomType, address, price });
      return res.status(400).json({ status: false, message: "Missing required fields" });
    }

    // ✅ Set default status if missing

    // ✅ Create new room
    const newRoom = new Room({
      owner: ownerExists._id,
      houseName,
      roomType,
      numberRoom,
      contactNumber,
      address,
      roomImages,
      price,
      description,
    });

    // ✅ Save room
    const savedRoom = await newRoom.save();
    console.log("✅ Room saved successfully:", savedRoom._id);

    // ✅ Ensure `createdRooms` is an array before pushing
    if (!Array.isArray(ownerExists.createdRooms)) {
      ownerExists.createdRooms = [];
    }

    // ✅ Update owner document with new room ID
    await Owner.findByIdAndUpdate(
      ownerExists._id,
      { $push: { createdRooms: savedRoom._id } },
      { new: true }
    );

    console.log("✅ Room ID added to owner:", ownerExists._id);

    // ✅ Send success response
    res.status(201).json({
      status: true,
      message: "Room added successfully",
      data: savedRoom,
    });
  } catch (error) {
    console.error("❌ Error while adding the room:", error);
    res.status(500).json({
      status: false,
      message: "Error while adding the room",
      error: error.message,
    });
  }
};








import cloudinary from "cloudinary";

export const editRoom = async (req, res) => {
  try {
    const { id: roomId } = req.params;
    const { body } = req;

    // Find the room by ID
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(400).json({
        status: false,
        message: "Room not found",
      });
    }

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        uploadedImages.push(result.secure_url);
      }
      // Push new images to the roomImages array
      room.roomImages.push(...uploadedImages);
    }

    // Update room details
    Object.keys(body).forEach((key) => {
      room[key] = body[key];
    });

    // Save the updated room
    const editedRoom = await room.save();

    res.status(200).json({
      status: true,
      message: "Room Edited Successfully",
      data: editedRoom,
    });
  } catch (error) {
    console.error("Error while editing the room:", error);
    res.status(500).json({
      status: false,
      message: "Error while Editing the Room",
      error: error.message,
    });
  }
};






//delete room;

export const changeRoomStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const requirementId = req.params.id;

    // Validate status before updating
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Invalid status value. Allowed values: 'active', 'inactive'",
      });
    }

    const requirement = await Room.findByIdAndUpdate(
      requirementId,
      { $set: { status } },
      { new: true } // Returns updated document
    );

    if (!requirement) {
      return res.status(404).json({
        status: false,
        message: "Requirement not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Requirement status updated successfully",
      data: requirement,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Error while updating the requirement status",
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params.id;
    const deletedRoom = await Room.findByIdAndDelete(roomId);
    if (!deleteRoom) {
      return res.status(400).json({
        status: false,
        message: "Room not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Room Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Error while Deleting the Room",
    });
  }
};






// get all available room
export const allRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("owner"); // Populate 'users' field

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No rooms available",
      });
    }

    res.status(200).json({
      status: true,
      data: rooms,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Error while fetching available rooms",
    });
  }
};
