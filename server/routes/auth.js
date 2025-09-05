// server/routes/auth.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

// Helper: generate JWT
function generateToken(user) {
	return jwt.sign(
		{ id: user.id, email: user.email },
		process.env.JWT_SECRET,
		{ expiresIn: "7d" }
	);
}

function auth(required = true) {
	return (req, res, next) => {
		const authHeader = req.headers.authorization;

		if (authHeader && authHeader.startsWith("Bearer ")) {
			const token = authHeader.split(" ")[1];

			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				req.user = decoded; // ✅ add user info to request
			} catch (error) {
				if (required) {
					return res.status(401).json({ error: "Invalid or expired token" });
				}
			}
		} else if (required) {
			return res.status(401).json({ error: "Authentication required" });
		}

		next();
	};
}
/**
 * POST /api/auth/register
 * Create a new user
 */
// POST /api/auth/register
router.post("/register", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

		// ✅ Check if user already exists
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ error: "Email already registered" });
		}

		// ✅ Hash password
		const hashed = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: { email, password: hashed },
		});

		// ✅ Issue token
		const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

		res.status(201).json({ token });
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});


/**
 * POST /api/auth/login
 * Authenticate a user
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

export default router;

