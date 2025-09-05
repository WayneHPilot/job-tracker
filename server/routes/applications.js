import express from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middleware/auth.js"; // ✅ we'll create this
const router = express.Router();
const prisma = new PrismaClient();

// Demo applications shown to guests
const demoApplications = [
	{
		id: "demo-1",
		company: "Google",
		role: "Frontend Developer",
		status: "applied",
		dateApplied: new Date("2025-08-01"),
		notes: "Excited to apply here!",
	},
	{
		id: "demo-2",
		company: "Microsoft",
		role: "Backend Developer",
		status: "interviewing",
		dateApplied: new Date("2025-08-05"),
		notes: "Interview scheduled next week.",
	},
	{
		id: "demo-3",
		company: "OpenAI",
		role: "Fullstack Engineer",
		status: "offer",
		dateApplied: new Date("2025-08-10"),
		notes: "Received an offer 🎉",
	},
];

/**
 * GET /api/applications
 * - Guests → demo apps
 * - Logged-in users → their saved apps
 */
router.get("/", authMiddleware.optional, async (req, res) => {
	try {
		const { status, sort } = req.query;

		// Guest user → return demo applications
		if (!req.user) {
			let apps = demoApplications;

			if (status) apps = apps.filter((a) => a.status === status);
			if (sort === "oldest") {
				apps = apps.sort((a, b) => new Date(a.dateApplied) - new Date(b.dateApplied));
			} else {
				apps = apps.sort((a, b) => new Date(b.dateApplied) - new Date(a.dateApplied));
			}

			return res.json(apps);
		}

		// Logged-in → fetch from DB
		const apps = await prisma.application.findMany({
			where: {
				userId: req.user.id,
				...(status && { status }),
			},
			orderBy: {
				createdAt: sort === "oldest" ? "asc" : "desc",
			},
		});

		res.json(apps);
	} catch (error) {
		console.error("Error fetching applications:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * POST /api/applications
 * - Only logged-in users can create
 */
router.post("/", authMiddleware.required, async (req, res) => {
	try {
		const { company, role, status, link, notes } = req.body;

		if (!company?.trim() || !role?.trim()) {
			return res.status(400).json({ error: "Company and role are required" });
		}

		const newApp = await prisma.application.create({
			data: {
				company,
				role,
				status: status || "applied",
				link: link?.trim() || null,
				notes: notes?.trim() || null,
				userId: req.user.id, // ✅ link to logged-in user
			},
		});

		res.status(201).json(newApp);
	} catch (error) {
		console.error("Error creating application:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * PUT /api/applications/:id
 * - Only owner can edit
 */
router.put("/:id", authMiddleware.required, async (req, res) => {
	try {
		const { id } = req.params;
		const { company, role, status, link, notes } = req.body;

		const app = await prisma.application.findUnique({ where: { id } });
		if (!app || app.userId !== req.user.id) {
			return res.status(403).json({ error: "Not authorised" });
		}

		const updated = await prisma.application.update({
			where: { id },
			data: { company, role, status, link, notes },
		});

		res.json(updated);
	} catch (error) {
		console.error("Error updating application:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * DELETE /api/applications/:id
 * - Only owner can delete
 */
router.delete("/:id", authMiddleware.required, async (req, res) => {
	try {
		const { id } = req.params;

		const app = await prisma.application.findUnique({ where: { id } });
		if (!app || app.userId !== req.user.id) {
			return res.status(403).json({ error: "Not authorised" });
		}

		await prisma.application.delete({ where: { id } });
		res.json({ message: "Application deleted" });
	} catch (error) {
		console.error("Error deleting application:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
