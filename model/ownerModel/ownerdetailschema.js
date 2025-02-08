import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Ensure User model exists
      // required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true, // Ensures unique case-insensitive emails
    },
    phone: {
      type: String,
      trim: true,
    },
    ownerPic: {
      type: String, // URL of the profile picture
    },
    createdRooms: [],
  },
  { timestamps: true }
);

const Owner = mongoose.model("Owner", ownerSchema);
export default Owner;