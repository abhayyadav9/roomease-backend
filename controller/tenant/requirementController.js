import isAuthenticated from "../../middleware/isAuthenticated.js";
import User from "../../model/authModel/usermodel.js";
import RequiredRoom from "../../model/tenantModel/requiredSchema.js";
import Tenant from "../../model/tenantModel/tenantDetails.js";





export const addRequirement = async (req, res) => {
  try {
    // Verify the token and get the user
    const tenant = await Tenant.findById(req.params.id);

    if (!tenant) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    const {
      location,
      category,
      description,
      requirement,
      priceRange,
      numberOfPerson,
      additionalNumber,
    } = req.body;

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const addedRequirement = new RequiredRoom({
      tenant: tenant._id, // Associate the requirement with the tenant
      location,
      category,
      description,
      requirement,
      priceRange,
      numberOfPerson,
      additionalNumber,
    });

    await addedRequirement.save();

    // Add the requirement ID to the tenant's requiredCreate array
    tenant.requiredCreate.push(addedRequirement._id);
    await tenant.save();

    res.status(201).json({
      status: true,
      message: "Requirement added successfully",
      data: addedRequirement,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding requirement", error: error.message });
  }
};





export const getAllRequirement = async(req,res)=>{
  try {
    const requirements = await RequiredRoom.find().populate("tenant");
    res.status(200).json({
      status: true,
      message: "Requirements fetched successfully",
      requirements
    });


    
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: false,
      message: "Error fetching requirements",
    })

    
  }
}





export const updateRequirement = async (req, res) => {
  try {
    // // Verify the token and get the user

    const { id } = req.params; // Corrected id extraction


    const { location, category, description, requirement, priceRange, numberOfPerson, additionalNumber } = req.body;

    // Find the requirement and ensure it belongs to the tenant
    const requirementToUpdate = await RequiredRoom.findOne({ _id: id});
    if (!requirementToUpdate) {
      return res.status(404).json({ message: "Requirement not found or you do not have permission to update it" });
    }

    const updatedRequirement = await RequiredRoom.findByIdAndUpdate(
      id,
      { location, category, description, requirement, priceRange, numberOfPerson, additionalNumber },
      { new: true, runValidators: true } // Ensures we get the updated document and run validation
    );

    res.status(200).json({
      status: true,
      message: "Requirement updated successfully",
      data: updatedRequirement,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Error updating requirement",
      error: error.message,
    });
  }
};






export const changeRequirementStatus = async (req, res) => {
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

    const requirement = await RequiredRoom.findByIdAndUpdate(
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

const deleteRequirementByAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedRequirement = await requiredModel.findByIdAndDelete(id);

    if (!deletedRequirement) {
      return res.status(404).json({ message: "Requirement not found" });
    }

    res.status(200).json({
      status: true,
      message: "Requirement deleted successfully",
      data: deletedRequirement,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Error deleting requirement",
    });
  }
};
