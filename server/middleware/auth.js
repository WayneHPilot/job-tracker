import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // ✅ fallback only for local dev

function getToken(req) {
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith("Bearer ")) {
		return authHeader.split(" ")[1];
	}
	return null;
}

function verifyToken(token) {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch {
		return null;
	}
}

const authMiddleware = {
	// Require login
	required: (req, res, next) => {
		const token = getToken(req);
		if (!token) {
			return res.status(401).json({ error: "Authentication required" });
		}

		const payload = verifyToken(token);
		if (!payload) {
			return res.status(401).json({ error: "Invalid token" });
		}

		req.user = payload;
		next();
	},

	// Optional login (guest allowed)
	optional: (req, _res, next) => {
		const token = getToken(req);
		if (token) {
			const payload = verifyToken(token);
			if (payload) req.user = payload;
		}
		next();
	},
};

export default authMiddleware;
