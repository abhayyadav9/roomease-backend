import mongoose from "mongoose";

const requiredSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      // required: true,
    },
    location: {
      type: String,
      required: true,
    },
    requirement: {
      type: String,
      enum: ["flate", "room"],
      default: "room",
    },
    category: {
      type: String,
      enum: ["normal", "well_furnished", "vip"],
      default: "normal",
    },
    priceRange: {
      type: Number,
    },
    numberOfPerson: {
      type: Number,
    },
    description: {
      type: String,
    },
    additionalNumber: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const RequiredRoom = mongoose.model("RequiredRoom", requiredSchema);
export default RequiredRoom;