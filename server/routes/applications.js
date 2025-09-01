import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/applications
 * Fetch all applications with optional filtering & sorting
 */
router.get("/", async (req, res) => {
	try {
		const { status, sort } = req.query;

		const applications = await prisma.application.findMany({
			where: status ? { status } : undefined,
			orderBy: {
				createdAt: sort === "oldest" ? "asc" : "desc",
			},
		});

		res.json(applications);
	} catch (error) {
		console.error("Error fetching applications:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * POST /api/applications
 * Create a new job application
 */
router.post("/", async (req, res) => {
	try {
		const { company, role, status, link, notes } = req.body;

		// ✅ Basic validation
		if (!company?.trim() || !role?.trim()) {
			return res.status(400).json({ error: "Company and role are required" });
		}

		const newApplication = await prisma.application.create({
			data: {
				company,
				role,
				status: status || "applied", // default if not provided
				link: link?.trim() || null,
				notes: notes?.trim() || null,
			},
		});

		res.status(201).json(newApplication);
	} catch (error) {
		console.error("Error creating application:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
