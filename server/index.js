import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import applicationsRouter from "./routes/applications.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use("/api/auth", authRoutes);

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

// Mount the applications router
app.use("/api/applications", applicationsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`API listening on http://localhost:${PORT}`);
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