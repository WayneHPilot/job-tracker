import React, { useState } from "react";
import axios from "axios";

const Home = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showRegister, setShowRegister] = useState(false);
	const [message, setMessage] = useState("");

	const handleLogin = async () => {
		try {
			const res = await axios.post("http://localhost:3001/api/auth/login", { email, password });
			localStorage.setItem("token", res.data.token);
			setMessage("✅ Logged in successfully!");
		} catch (err) {
			setMessage("❌ Login failed");
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
			<h1 className="text-2xl font-bold mb-4">Welcome</h1>

			{/* Login form */}
			<input
				type="email"
				placeholder="Email"
				className="border rounded w-full px-3 py-2 mb-2"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Password"
				className="border rounded w-full px-3 py-2 mb-2"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<div className="flex gap-2">
				<button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
					Login
				</button>
				<button onClick={() => setShowRegister(true)} className="bg-gray-500 text-white px-4 py-2 rounded">
					Register
				</button>
			</div>

			{message && <p className="mt-3">{message}</p>}

			{/* Register modal */}
			{showRegister && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-sm w-full">
						<h2 className="text-xl font-bold mb-4">Register</h2>
						<input type="email" placeholder="Email" className="border rounded w-full px-3 py-2 mb-2" />
						<input type="password" placeholder="Password" className="border rounded w-full px-3 py-2 mb-2" />
						<div className="flex gap-2">
							<button className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
							<button onClick={() => setShowRegister(false)} className="bg-red-500 text-white px-4 py-2 rounded">
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
