// client/src/App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import ThemeToggle from "./components/ThemeToggle";
import Home from "./pages/Home";

const Applications = lazy(() => import("./pages/Applications"));

const App = () => {
	return (
		<Router>
			<div
				className="min-h-screen text-gray-900 dark:text-gray-100 
        bg-gray-100 dark:bg-gray-950 
        transition-colors duration-500 ease-in-out"
			>
				{/* Navbar */}
				<nav
					className={`bg-indigo-600 dark:bg-indigo-800 text-white shadow transition-colors duration-500`}
				>
					<div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
						<div className="font-bold tracking-wide">Job Tracker</div>
						<div className="flex items-center gap-4">
							<NavLink
								to="/"
								className={({ isActive }) =>
									`px-3 py-1 rounded transition ${
										isActive ? "bg-white/20" : "hover:bg-white/10"
									}`
								}
								end
							>
								Home
							</NavLink>
							<NavLink
								to="/applications"
								className={({ isActive }) =>
									`px-3 py-1 rounded transition ${
										isActive ? "bg-white/20" : "hover:bg-white/10"
									}`
								}
							>
								Applications
							</NavLink>
							<ThemeToggle />
						</div>
					</div>
				</nav>

				{/* Page container */}
				<main className="max-w-6xl mx-auto px-4 py-8 transition-colors duration-500 ease-in-out">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route
							path="/applications"
							element={
								<Suspense
									fallback={
										<div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6">
											Loading Applications…
										</div>
									}
								>
									<Applications />
								</Suspense>
							}
						/>
					</Routes>
				</main>
			</div>
		</Router>
	);
};

export default App;
