import React from "react";
import { useTheme } from "../context/useTheme";

const ThemeToggle = () => {
    const { theme, toggle } = useTheme();
    return (
    <button
        onClick={toggle}
        className="rounded-full px-3 py-1 text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
        title="Toggle theme"
    >
        {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
    );
};

export default ThemeToggle;
