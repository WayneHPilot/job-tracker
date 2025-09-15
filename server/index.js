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

import authRoutes from "./routes/auth.js";
import applicationRoutes from "./routes/applications.js";

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// Health check
app.get("/", (req, res) => {
	res.send("✅ Job Tracker API running");
});

// Update application
app.put("/api/applications/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { company, role, status, link, notes } = req.body;

		const updatedApp = await prisma.application.update({
			where: { id: parseInt(id) },
			data: { company, role, status, link, notes },
		});

		res.json(updatedApp);
	} catch (error) {
		console.error("Error updating application:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Delete application
app.delete("/api/applications/:id", async (req, res) => {
	try {
		const { id } = req.params;

		await prisma.application.delete({
			where: { id: parseInt(id) },
		});

		res.json({ message: "Application deleted successfully!" });
	} catch (error) {
		console.error("Error deleting application:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
});
