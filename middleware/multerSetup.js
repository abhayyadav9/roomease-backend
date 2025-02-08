import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf"], // Allowed file types
    public_id: (req, file) => Date.now() + "-" + file.originalname, // Unique file name
  },
});

// Create Multer instance
const upload = multer({ storage });

// Middleware for single file upload
export const uploadSingle = upload.single("file");

// Middleware for multiple file uploads (max 5 files)
export const uploadMultiple = upload.array("roomImages", 5);