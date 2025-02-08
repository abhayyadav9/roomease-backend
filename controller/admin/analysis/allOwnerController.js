import Owner from "../../../model/ownerModel/ownerdetailschema.js";

// Controller to get all owners and their count
export const getAllOwners = async (req, res) => {
  try {
    // Fetch all owners from the database
    const owners = await Owner.find()
    .populate({
      path: 'user',
      select: '-password' // Exclude the password field
    });
  
    // Get the total count of owners
    const totalOwners = await Owner.countDocuments();

    res.status(200).json({
      success: true,
      totalOwners,
      owners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch owners",
      error: error.message,
    });
  }
};
