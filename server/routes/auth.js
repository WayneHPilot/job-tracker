import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; 

// Helper: generate JWT
function generateToken(user) {
	return jwt.sign(
		{ id: user.id, email: user.email },
		JWT_SECRET,
		{ expiresIn: "7d" }
	);
}

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post("/register", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

		// Check if email already exists
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ error: "Email already registered" });
		}

		// Hash password
		const hashed = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: { email, password: hashed },
		});

		// Issue token
		const token = generateToken(user);

		res.status(201).json({ token, user: { id: user.id, email: user.email } });
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * POST /api/auth/login
 * Authenticate user
 */
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "Email and password required" });
		}

		// Find user
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Check password
		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const token = generateToken(user);

		res.json({ token, user: { id: user.id, email: user.email } });
	} catch (error) {
		console.error("Error logging in:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

/**
 * GET /api/auth/me
 * Get current logged-in user
 */
router.get("/me", authMiddleware.required, async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.user.id },
			select: { id: true, email: true, createdAt: true },
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error fetching user:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
