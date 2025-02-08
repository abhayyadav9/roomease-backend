import mongoose from "mongoose";
import Owner from "../../model/ownerModel/ownerdetailschema.js";
import cloudinary from "../../config/cloudinary.js";
import User from "../../model/authModel/usermodel.js"

export const ownerDetail = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate MongoDB ObjectId
    // if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "Invalid Owner ID",
    //   });
    // }

    const owner = await Owner.findOne({ user: userId })
    .populate("user", "name email phone address ownerPic pincode") // Fetch user details
    .populate("createdRooms"); // Fetch created rooms


    if (!owner) {
      return res.status(404).json({
        status: false,
        message: "Sorry, Owner Not Found!",
      });
    }

    res.status(200).json({
      status: true,
      message: "Fetched Owner Detail",
      data: owner,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: false,
      message: "Error Occurred",
      error: error.message,
    });
  }
};










export const updateOwner = async (req, res) => {
  const ownerId = req.params.id;
  const { name, phone, address, pincode } = req.body;
  const ownerPicPath = req.file ? req.file.path : null;

  console.log("Received Owner ID:", ownerId);

  try {
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid Owner ID",
      });
    }

    const existingOwner = await Owner.findOne({ user: ownerId });
    if (!existingOwner) {
      console.log("Owner not found in database");
      return res.status(404).json({
        status: false,
        message: "Sorry, Owner Not Found!",
      });
    }

    if (ownerPicPath && existingOwner.ownerPic) {
      const oldPicId = existingOwner.ownerPic.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(oldPicId);
    }

    let newOwnerPicUrl = existingOwner.ownerPic;
    if (ownerPicPath) {
      const result = await cloudinary.uploader.upload(ownerPicPath);
      newOwnerPicUrl = result.secure_url;
    }

    const updatedOwner = await Owner.findOneAndUpdate(
      { user: ownerId },
      {
        name,
        phone,
        address,
        ownerPic: newOwnerPicUrl,
        pincode,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: true,
      message: "Owner Updated Successfully",
      data: updatedOwner,
    });
  } catch (error) {
    console.error("Error updating owner:", error);
    res.status(500).json({
      status: false,
      message: "Error Occurred",
      error: error.message,
    });
  }
};