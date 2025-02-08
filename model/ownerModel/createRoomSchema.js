// import mongoose from "mongoose";

// const createRoomSchema = new mongoose.Schema({
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Owner",
//     required: true, // Ensure owner is always provided
//   },
//   houseName: { type: String },
//   roomType: { type: String, enum: ["flate", "room"] },
//   numberRoom: { type: Number },
//   contactNumber: { type: String },
//   address: { type: String },
//   roomImage: [{ type: String }], // ✅ FIXED: Store multiple images
//   price: { type: Number },
//   status: { type: String, enum: ["active", "inactive"], default: "active" },
//   description: { type: String, },
// });

// const Room = mongoose.model("Room", createRoomSchema);
// export default Room;



import mongoose from "mongoose";

const createRoomSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true, // Ensure owner is always provided
    },
    houseName: { type: String, required: true },
    roomType: { type: String, enum: ["flat", "room"], required: true },
    numberRoom: { type: Number, required: true, min: 1 }, // Ensures at least 1 room
    contactNumber: { type: String, required: true },
    address: { type: String, required: true },
    roomImages: [{ type: String, default: [] }], // ✅ Multiple images supported
    price: { type: Number, required: true, min: 0 }, // Ensures price is non-negative
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    description: { type: String, default: "" },
  },
  { timestamps: true } // ✅ Automatically adds createdAt & updatedAt
);

const Room = mongoose.model("Room", createRoomSchema);
export default Room;
