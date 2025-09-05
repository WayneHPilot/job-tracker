// server/routes/applications.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/applications
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
 */
router.post("/", async (req, res) => {
	try {
		const { company, role, status, link, notes } = req.body;

		if (!company?.trim() || !role?.trim()) {
			return res.status(400).json({ error: "Company and role are required" });
		}

		const newApplication = await prisma.application.create({
			data: {
				company,
				role,
				status: status || "applied",
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

/**
 * PUT /api/applications/:id
 */
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { company, role, status, link, notes } = req.body;

		const updatedApp = await prisma.application.update({
			where: { id: parseInt(id, 10) },
			data: { company, role, status, link, notes },
		});

		res.json(updatedApp);
	} catch (error) {
		console.error("Error updating application:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * DELETE /api/applications/:id
 */
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		await prisma.application.delete({
			where: { id: parseInt(id, 10) },
		});
		res.json({ message: "Application deleted" });
	} catch (error) {
		console.error("Error deleting application:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
