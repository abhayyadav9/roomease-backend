


import mongoose from "mongoose";
import bcrypt from "bcryptjs";


import Owner from "../ownerModel/ownerdetailschema.js";
import Tenant from "../tenantModel/tenantDetails.js";
import Admin from "../adminModel/adminDetail.js";  // Ensure correct paths


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["tenant", "admin", "owner"],
      required: true,
      default: "tenant",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resetToken: String,
    resetPasswordExpiresAt: Date,

    // Role-Based References
    ownerDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
    },
    tenantDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
    },
    adminDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);




// Middleware to create role-specific documents
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const Owner = mongoose.model("Owner");
    const Tenant = mongoose.model("Tenant");
    const Admin = mongoose.model("Admin");

    // if (this.role === "owner" && !this.ownerDetails) {
    //   const owner = await Owner.create({ user: this._id, name: this.name });
    //   this.ownerDetails = owner._id;
    // }

    // if (this.role === "tenant" && !this.tenantDetails) {
    //   const tenant = await Tenant.create({ user: this._id, name: this.name });
    //   this.tenantDetails = tenant._id;
    // }

    // if (this.role === "admin" && !this.adminDetails) {
    //   const admin = await Admin.create({ user: this._id, name: this.name });
    //   this.adminDetails = admin._id;
    // }
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
