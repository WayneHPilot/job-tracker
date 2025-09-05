import React, { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

	const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

	useEffect(() => {
		localStorage.setItem("theme", theme);
		const root = document.documentElement;
		if (theme === "dark") root.classList.add("dark");
		else root.classList.remove("dark");
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
		{children}
		</ThemeContext.Provider>
	);
};
