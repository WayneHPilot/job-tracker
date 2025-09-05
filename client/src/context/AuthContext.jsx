// server/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // put this in .env in production

// REGISTER
router.post("/register", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "Email and password required" });
		}

		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			return res.status(400).json({ error: "Email already in use" });
		}

		const hashed = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: { email, password: hashed },
		});

		res.status(201).json({ message: "User registered successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// LOGIN
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ error: "Invalid credentials" });
		}

		const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
		res.json({ token, user: { id: user.id, email: user.email } });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// GET CURRENT USER
router.get("/me", async (req, res) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) return res.status(401).json({ error: "No token provided" });

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, JWT_SECRET);

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: { id: true, email: true },
		});

		if (!user) return res.status(404).json({ error: "User not found" });

		res.json(user);
	} catch (err) {
		console.error(err);
		res.status(401).json({ error: "Invalid token" });
	}
});

export default router;
