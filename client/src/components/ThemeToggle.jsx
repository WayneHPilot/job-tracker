import React from "react";
import { useTheme } from "../context/useTheme";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";

	return (
		<motion.button
			onClick={toggleTheme}
			aria-pressed={isDark}
			aria-label="Toggle color theme"
			className={`relative inline-flex items-center w-16 h-9 rounded-full p-1 
				transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 
				${isDark ? "bg-gray-700" : "bg-yellow-400"}`}
			whileTap={{ scale: 0.9 }}
		>
			{/* Sliding knob */}
			<motion.span
				layout
				animate={{ x: isDark ? 28 : 0 }}
				transition={{
					type: "spring",
					stiffness: 700,
					damping: 30,
				}}
				className="relative inline-flex items-center justify-center w-7 h-7 bg-white rounded-full shadow"
			>
				<AnimatePresence mode="wait" initial={false}>
					{isDark ? (
						<motion.span
							key="moon"
							initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
							animate={{ opacity: 1, rotate: 0, scale: 1 }}
							exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
							transition={{ duration: 0.3 }}
							className="absolute text-gray-700"
						>
							🌙
						</motion.span>
					) : (
						<motion.span
							key="sun"
							initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
							animate={{ opacity: 1, rotate: 0, scale: 1 }}
							exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
							transition={{ duration: 0.3 }}
							className="absolute text-yellow-500"
						>
							☀️
						</motion.span>
					)}
				</AnimatePresence>
			</motion.span>
		</motion.button>
	);
};

export default ThemeToggle;
