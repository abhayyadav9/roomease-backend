import mongoose from "mongoose";
import Admin from "../../model/adminModel/adminDetail.js";

export const adminDetail = async (req, res) => {
  try {
    const adminId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      return res.status(400).json({ message: "Invalid admin ID" });
    }

    // Fetch tenant details with populated user info
    const admin = await Admin.findById(adminId).populate(
      "user",
      "name email phone adminPic"
    );

    // Check if tenant exists
    if (!admin) {
      return res.status(404).json({ message: "admin not found" });
    }

    // Return tenant details
    res.status(200).json({
      status: true,
      message: "Fetched admin Detail",
      data: admin,
    });
  } catch (error) {
    console.error("Error fetching admin:", error);
    res
      .status(500)
      .json({ message: "Error fetching admin", error: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Error updating admin",
    });
  }
};
