// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext({
	user: null,
	token: null,
	login: () => {},
	logout: () => {},
});

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(() => localStorage.getItem("token"));
	const [user, setUser] = useState(null);

	// Validate token & fetch user profile
	useEffect(() => {
		if (!token) {
			setUser(null);
			return;
		}

		let mounted = true;
		(async () => {
			try {
				const res = await fetch(`${API_BASE}/auth/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				
				if (!res.ok) throw new Error("Invalid token");
				const data = await res.json();
				if (mounted) setUser(data);
			} catch (err) {
				console.warn("Auth check failed:", err);
				localStorage.removeItem("token");
				if (mounted) {
					setToken(null);
					setUser(null);
				}
			}
		})();

		return () => {
			mounted = false;
		};
	}, [token]);

	const login = (newToken) => {
		localStorage.setItem("token", newToken);
		setToken(newToken);
	};

	const logout = () => {
		localStorage.removeItem("token");
		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
