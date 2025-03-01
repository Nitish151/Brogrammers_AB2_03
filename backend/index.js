// server.js
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";


dotenv.config();

const app = express();

app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server only if successful
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
});