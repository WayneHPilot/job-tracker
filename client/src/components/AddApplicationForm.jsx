import React, { useState } from "react";
import axios from "axios";

const AddApplicationForm = ({ onAdded }) => {
	const [formData, setFormData] = useState({
		company: "",
		role: "",
		status: "applied",
		link: "",
		notes: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await axios.post("http://localhost:3001/api/applications", formData);
			setFormData({ company: "", role: "", status: "applied", link: "", notes: "" });
			onAdded();
		} catch (err) {
			setError("Failed to add application. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="border rounded p-4 shadow-sm">
			<h2 className="text-xl font-semibold mb-3">Add New Application</h2>

			{error && (
				<div className="text-red-600 bg-red-100 border border-red-300 rounded p-2 mb-3">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-3">
				<input
					type="text"
					name="company"
					placeholder="Company"
					value={formData.company}
					onChange={handleChange}
					required
					className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-gray-100"
				/>
				<input
					type="text"
					name="role"
					placeholder="Role"
					value={formData.role}
					onChange={handleChange}
					required
					className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-gray-100"
				/>
				<select
					name="status"
					value={formData.status}
					onChange={handleChange}
					className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-gray-100"
				>
					<option value="applied">Applied</option>
					<option value="interviewing">Interviewing</option>
					<option value="offer">Offer</option>
				</select>
				<input
					type="url"
					name="link"
					placeholder="Job link (optional)"
					value={formData.link}
					onChange={handleChange}
					className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-gray-100"
				/>
				<textarea
					name="notes"
					placeholder="Notes (optional)"
					value={formData.notes}
					onChange={handleChange}
					className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-gray-100"
				/>

				<button
					type="submit"
					disabled={loading}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
				>
					{loading ? "Adding..." : "Add Application"}
				</button>
			</form>
		</div>
	);
};

export default AddApplicationForm;
