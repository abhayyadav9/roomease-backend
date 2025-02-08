import Tenant from "../../../model/tenantModel/tenantDetails.js";


// Controller to get all tenants and their count
export const getAllTenants = async (req, res) => {
  try {
    // Fetch all tenants from the database
    const tenants = await Tenant.find().populate({path:"user",select:'-password'}).populate("requiredCreate"); // 
   
  

    // Get the total count of tenants
    const totalTenants = await Tenant.countDocuments();

    res.status(200).json({
      success: true,
      totalTenants,
      tenants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tenants",
      error: error.message,
    });
  }
};
