import mongoose from "mongoose";
import Tenant from "../../model/tenantModel/tenantDetails.js";
import cloudinary from "../../config/cloudinary.js";

export const tenantDetail = async (req, res) => {
  try {
    const userId = req.params.id;
console.log(userId)
    // Validate ObjectId
    // if (!mongoose.Types.ObjectId.isValid(tenantId)) {
    //   return res.status(400).json({ message: "Invalid Tenant ID" });
    // }

    // Fetch tenant details with populated user info
    const tenant = await Tenant.findOne({user: userId}).populate(
      "user",
      "name email phone tenantPic"
    );

    // Check if tenant exists
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Return tenant details
    res.status(200).json({
      status: true,
      message: "Fetched Tenant Detail",
      data: tenant,
    });
  } catch (error) {
    console.error("Error fetching tenant:", error);
    res
      .status(500)
      .json({ message: "Error fetching tenant", error: error.message });
  }
};














export const updateTenant = async (req, res) => {
  const tenantId = req.params.id;
  const { name, phone, address } = req.body;
  const tenantPicPath = req.file ? req.file.path : null;

  console.log("Received Tenant ID:", tenantId);

  try {
    // Validate tenantId format
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid Tenant ID",
      });
    }

    // Find the existing tenant using the tenantId
    const existingTenant = await Tenant.findOne({ user: tenantId });
    if (!existingTenant) {
      console.log("Tenant not found in database");
      return res.status(404).json({
        status: false,
        message: "Tenant Not Found",
      });
    }

    // Delete the old tenant picture from Cloudinary (if new picture is uploaded)
    if (tenantPicPath && existingTenant.tenantPic) {
      const oldPicId = existingTenant.tenantPic.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(oldPicId);
    }

    // Upload the new tenant picture to Cloudinary
    let newTenantPicUrl = existingTenant.tenantPic;
    if (tenantPicPath) {
      const result = await cloudinary.uploader.upload(tenantPicPath);
      newTenantPicUrl = result.secure_url;
    }

    // Update the tenant details in the database
    const updatedTenant = await Tenant.findOneAndUpdate(
      { user: tenantId },
      {
        name,
        phone,
        address,
        tenantPic: newTenantPicUrl, // Set new image URL or keep old one if no new image
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      status: true,
      message: "Tenant Updated Successfully",
      tenant: updatedTenant,
    });
  } catch (error) {
    console.error("Error updating tenant:", error);
    return res.status(500).json({
      status: false,
      message: "Error Occurred",
      error: error.message,
    });
  }
};





///this is for the future if want delete the previous pic from the cloudinary 

// import cloudinary from "../config/cloudinary"; // Assuming you have a Cloudinary config file
// import Tenant from "../models/Tenant"; // Adjust the path according to your project structure

// export const updateTenant = async (req, res) => {
//   try {
//     const tenantId = req.params.id;
//     const { name, phone, address } = req.body;
    
//     // Check if file exists (if uploading a new image)
//     let tenantPicPath = undefined;
//     let tenantPicPublicId = undefined;
//     if (req.file) {
//       tenantPicPath = req.file.path;
//       tenantPicPublicId = req.file.filename; // Multer storage setup assigns filename as public_id
//     }

//     // Find the tenant by ID to check for existing tenantPic
//     const existingTenant = await Tenant.findById(tenantId);
//     if (!existingTenant) {
//       return res.status(404).json({ message: "Tenant not found" });
//     }

//     // If tenantPic has changed, delete the old picture from Cloudinary
//     if (tenantPicPath && existingTenant.tenantPic) {
//       const oldPublicId = existingTenant.tenantPic.split('/').pop().split('.')[0]; // Extract the public_id from the URL
//       await cloudinary.uploader.destroy(oldPublicId); // Delete the old image from Cloudinary
//     }

//     // Update the tenant with the new data (and new tenantPic if uploaded)
//     const updatedTenant = await Tenant.findByIdAndUpdate(
//       tenantId,
//       {
//         name,
//         phone,
//         address,
//         tenantPic: tenantPicPath ? tenantPicPath : existingTenant.tenantPic, // Only update if a new image is uploaded
//       },
//       { new: true } // This returns the updated tenant after the update
//     );

//     if (!updatedTenant) {
//       return res.status(404).json({ message: "Tenant not found" });
//     }

//     // Successfully updated tenant
//     return res.status(200).json({
//       status: true,
//       message: "Tenant updated successfully",
//       tenant: updatedTenant, // Optionally return the updated tenant data
//     });
//   } catch (error) {
//     console.log(error); // Corrected typo here
//     return res.status(500).json({
//       status: false,
//       message: "Error updating tenant",
//       error: error.message, // Optionally send back the error message
//     });
//   }
// };
