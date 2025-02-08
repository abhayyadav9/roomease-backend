import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    requiredCreate: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RequiredRoom",
      },
    ],
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    tenantPic: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "found", "not_found"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Tenant = mongoose.model("Tenant", tenantSchema);
export default Tenant;