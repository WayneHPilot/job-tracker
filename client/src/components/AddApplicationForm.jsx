import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config";

const AddApplicationForm = ({ onAdded }) => {
	const [company, setCompany] = useState("");
	const [role, setRole] = useState("");
	const [status, setStatus] = useState("applied");
	const [link, setLink] = useState("");
	const [notes, setNotes] = useState("");
	const [error, setError] = useState(null);
	const { token } = useAuth();

const handleSubmit = async (e) => {
	e.preventDefault();
	const newApp = { company, role, status, link, notes };

try {
	const res = await axios.post(`${API_BASE}/applications`, newApp, {
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});

		console.log("✅ Created app:", res.data);

		// reset form
		setCompany("");
		setRole("");
		setStatus("applied");
		setLink("");
		setNotes("");
		setError(null);

		// notify parent with the new app
		if (onAdded) onAdded(res.data);
	} catch (err) {
		console.error("❌ Failed to add app:", err.response?.data || err.message);
		setError("❌ Failed to save application. Are you logged in?");
	}
};


	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{error && (
				<div className="text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200 border border-red-300 dark:border-red-700 rounded p-2">
					{error}
				</div>
			)}

			<input
				type="text"
				placeholder="Company"
				value={company}
				onChange={(e) => setCompany(e.target.value)}
				className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 
					text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
				required
			/>

			<input
				type="text"
				placeholder="Role"
				value={role}
				onChange={(e) => setRole(e.target.value)}
				className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 
					text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
				required
			/>

			<select
				value={status}
				onChange={(e) => setStatus(e.target.value)}
				className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 
					text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
			>
				<option value="applied">Applied</option>
				<option value="interviewing">Interviewing</option>
				<option value="offer">Offer</option>
			</select>

			<input
				type="url"
				placeholder="Job Link (optional)"
				value={link}
				onChange={(e) => setLink(e.target.value)}
				className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 
					text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
			/>

			<textarea
				placeholder="Notes (optional)"
				value={notes}
				onChange={(e) => setNotes(e.target.value)}
				className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 
					text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
				rows="3"
			/>

			<button
				type="submit"
				className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 
					dark:bg-blue-500 dark:hover:bg-blue-600"
			>
				Add Application
			</button>
		</form>
	);
};

export default AddApplicationForm;
