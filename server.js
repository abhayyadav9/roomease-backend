import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import userRoute from "./routes/authRoute/userRoute.js";
import ownerRoute from "./routes/owner/ownerRoute.js";
import tenantRoute from "./routes/tenant/tenantRoute.js";
import adminRoute from "./routes/admin/adminRoute.js";
import createRoomRoute from "./routes/owner/createRoomRoute.js";
import requirementRoute from "./routes/tenant/requirementRoute.js";
import commonRoute from "./routes/admin/commonRoute.js";



const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json()); // Use Express built-in JSON parser
app.use(cookieParser()); // Middleware to parse cookies

// Define allowed origins (replace with your frontend URLs)
const allowedOrigins = [
  "https://roomease-frontend-rl.vercel.app",
  "http://localhost:5173",
];

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Routes
app.use("/api/v1", userRoute);
app.use("/api/v4", adminRoute);
app.use("/api/v4a", commonRoute);
app.use("/api/v2", ownerRoute);
app.use("/api/v2a", createRoomRoute);
app.use("/api/v3", tenantRoute);
app.use("/api/v3a", requirementRoute);

// Connect to the database and start the server
connectDb()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`The server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
