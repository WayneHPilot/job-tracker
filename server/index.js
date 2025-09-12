import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import applicationRoutes from "./routes/applications.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// Health check
app.get("/", (req, res) => {
	res.send("✅ Job Tracker API running");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});



// Update application

app.put("/api/applications/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { company, role, status, link, notes } = req.body;

		const updatedApp = await Prisma.application.update({
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

		await Prisma.application.delete({
			where: { id: parseInt(id) },
		});
		
		res.json({ message: "Application deleted successfully!" });
	} catch (err) {
		console.error("Error deleting application:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});