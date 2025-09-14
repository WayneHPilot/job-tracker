import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApplications } from "../context/ApplicationsContext";

const API_BASE = import.meta.env.VITE_API_BASE;

const Home = () => {
	const { token, login } = useAuth();
	const { applications, loading } = useApplications();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showRegister, setShowRegister] = useState(false);
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	// Login handler
	const handleLogin = async () => {
		try {
			const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
			login(res.data.token);
			setMessage("✅ Logged in successfully!");
			navigate("/"); // stay on dashboard after login
		} catch (err) {
			setMessage("❌ Login failed");
		}
	};

	// Quick stats for logged-in users
	const stats = token
		? {
				total: applications.length,
				applied: applications.filter((a) => a.status === "applied").length,
				interviewing: applications.filter((a) => a.status === "interviewing").length,
				offer: applications.filter((a) => a.status === "offer").length,
		}
		: null;

	// If logged in → dashboard view
	if (token) {
		return (
			<div className="max-w-4xl mx-auto text-center p-8">
				<h1 className="text-4xl font-bold mb-4">Welcome Back! 🎉</h1>
				<p className="text-gray-600 dark:text-gray-300 mb-6">
					Here’s a quick look at your job applications:
				</p>

				{loading ? (
					<p>Loading stats…</p>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
						<div className="p-4 rounded bg-blue-100 dark:bg-blue-900">
							<p className="text-xl font-bold">{stats.total}</p>
							<p className="text-sm">Total</p>
						</div>
						<div className="p-4 rounded bg-yellow-100 dark:bg-yellow-900">
							<p className="text-xl font-bold">{stats.applied}</p>
							<p className="text-sm">Applied</p>
						</div>
						<div className="p-4 rounded bg-purple-100 dark:bg-purple-900">
							<p className="text-xl font-bold">{stats.interviewing}</p>
							<p className="text-sm">Interviewing</p>
						</div>
						<div className="p-4 rounded bg-green-100 dark:bg-green-900">
							<p className="text-xl font-bold">{stats.offer}</p>
							<p className="text-sm">Offers</p>
						</div>
					</div>
				)}
				<Link
					to="/applications"
					className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
				>
					View Applications
				</Link>

				{/* Recent applications */}
				<div className="mt-8 text-left">
					<h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
					{applications.length === 0 ? (
						<p className="text-gray-500 dark:text-gray-400">No applications yet.</p>
					) : (
						<ul className="space-y-2">
							{applications
								.slice(0, 5) // show only 5 most recent
								.map((app) => (
									<li
										key={app.id}
										className="flex justify-between border-b pb-2 dark:border-gray-700"
									>
										<div>
											<p className="font-medium">{app.company}</p>
											<p className="text-sm text-gray-600 dark:text-gray-400">{app.role}</p>
										</div>
										<span
											className={`px-2 py-1 rounded text-xs ${
												app.status === "applied"
													? "bg-blue-100 text-blue-800"
													: app.status === "interviewing"
													? "bg-yellow-100 text-yellow-800"
													: app.status === "offer"
													? "bg-green-100 text-green-800"
													: "bg-gray-100 text-gray-800"
											}`}
										>
											{app.status}
										</span>
									</li>
								))}
						</ul>
					)}
				</div>
			</div>
		);
	}

	// If logged out → login/register UI
	return (
		<div className="max-w-md mx-auto mt-10 p-6 border rounded shadow dark:border-gray-700">
			<h1 className="text-2xl font-bold mb-4">Welcome to your Job Tracker 💼</h1>
			<p className="text-gray-600 dark:text-gray-300 mb-6">
				Stay organised during your job search. Log in to start tracking.
			</p>

			{/* Login form */}
			<input
				type="email"
				placeholder="Email"
				className="border rounded w-full px-3 py-2 mb-2 dark:bg-gray-800"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Password"
				className="border rounded w-full px-3 py-2 mb-2 dark:bg-gray-800"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<div className="flex gap-2">
				<button
					onClick={handleLogin}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Login
				</button>
				<button
					onClick={() => setShowRegister(true)}
					className="bg-gray-500 text-white px-4 py-2 rounded"
				>
					Register
				</button>
			</div>

			{message && <p className="mt-3">{message}</p>}

			{/* Register modal */}
			{showRegister && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-sm w-full">
						<h2 className="text-xl font-bold mb-4">Register</h2>
						<input
							type="email"
							placeholder="Email"
							className="border rounded w-full px-3 py-2 mb-2 dark:bg-gray-700"
						/>
						<input
							type="password"
							placeholder="Password"
							className="border rounded w-full px-3 py-2 mb-2 dark:bg-gray-700"
						/>
						<div className="flex gap-2">
							<button className="bg-green-500 text-white px-4 py-2 rounded">
								Submit
							</button>
							<button
								onClick={() => setShowRegister(false)}
								className="bg-red-500 text-white px-4 py-2 rounded"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Home;
