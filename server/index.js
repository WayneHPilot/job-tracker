import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import authRoutes from "./routes/auth.js";
import applicationRoutes from "./routes/applications.js";
import healthRoutes from "./routes/health.js";

dotenv.config();
const app = express(); // ✅ define app before using it
const prisma = new PrismaClient();

// Prisma connection test on startup
async function initPrisma() {
	try {
		await prisma.$connect();
		console.log("✅ Prisma successfully connected to Postgres");
	} catch (err) {
		console.error("❌ Prisma failed to connect:", err);
		process.exit(1);
	}
}

// Middleware
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"https://job-tracker-six-sand.vercel.app",
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
app.use("/api/health", healthRoutes); // ✅ now safe

// Root check
app.get("/", (req, res) => {
	res.send("✅ Job Tracker API running");
});

// DB health check
app.get("/api/db-status", async (req, res) => {
	try {
		await prisma.$queryRaw`SELECT 1`;
		res.json({ status: "ok", message: "✅ Database is reachable" });
	} catch (error) {
		console.error("DB health check failed:", error);
		res.status(500).json({ status: "error", message: "❌ Database not reachable" });
	}
});

// Server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, async () => {
	await initPrisma(); // connect Prisma on startup
	console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
async function shutdown(signal) {
	console.log(`\n📦 ${signal} received. Closing server...`);
	server.close(async () => {
		console.log("🛑 HTTP server closed");
		try {
			await prisma.$disconnect();
			console.log("🔌 Prisma disconnected");
			process.exit(0);
		} catch (err) {
			console.error("Error during Prisma disconnect:", err);
			process.exit(1);
		}
	});
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
