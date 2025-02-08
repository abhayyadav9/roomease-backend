// filepath: /c:/Mycode/abhay  major project/RoomEase/Backend/server.js
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import userRoute from "./routes/authRoute/userRoute.js";
import ownerRoute from "./routes/owner/ownerRoute.js"
import tenantRoute from "./routes/tenant/tenantRoute.js"
import adminRoute from "./routes/admin/adminRoute.js"
import createRoomRoute from "./routes/owner/createRoomRoute.js"
import requirementRoute  from"./routes/tenant/requirementRoute.js"
import commonRoute  from"./routes/admin/commonRoute.js"


const app = express();

// Load environment variables
dotenv.config();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to parse cookies
app.use(cookieParser());


app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true, // Allow cookies and authentication headers
}));

// Routes
app.use("/api/v1", userRoute);

//admin related api
app.use("/api/v4", adminRoute);
// analysis related api
app.use("/api/v4a", commonRoute);





//owner related api
app.use("/api/v2", ownerRoute);
app.use("/api/v2a", createRoomRoute);

// tenant related api
app.use("/api/v3", tenantRoute);
app.use("/api/v3a", requirementRoute);



// Connect to the database and start the server
connectDb().then(() => {
  app.listen(3000, () => {
    console.log("The server is running on port 3000");
  });
}).catch(error => {
  console.error("Failed to connect to the database:", error);
});