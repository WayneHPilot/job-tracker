import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import authRoutes from "./routes/auth.js";
import applicationRoutes from "./routes/applications.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(
	cors({
		origin: [
			"http://localhost:3000", // local frontend
			"https://job-tracker-six-sand.vercel.app", // vercel frontend
		],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// Health check
app.get("/", (req, res) => {
	res.send("✅ Job Tracker API running");
});

// Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
});
