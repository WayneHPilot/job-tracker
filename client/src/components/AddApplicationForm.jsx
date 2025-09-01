// AddApplicationForm.jsx
import React, { useState } from "react";
import axios from "axios";

const AddApplicationForm = ({ onSuccess }) => {
	const [formData, setFormData] = useState({
		company: "",
		role: "",
		status: "applied",
		link: "",
		notes: "",
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post("http://localhost:3001/api/applications", formData);
			setFormData({ company: "", role: "", status: "applied", link: "", notes: "" });

			// ✅ Trigger parent refresh
			if (onSuccess) onSuccess();
		} catch (err) {
			console.error("Error adding application:", err);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-2 border p-4 rounded mb-6">
			<input
				type="text"
				name="company"
				placeholder="Company"
				value={formData.company}
				onChange={handleChange}
				className="border rounded px-2 py-1 w-full"
				required
			/>
			<input
				type="text"
				name="role"
				placeholder="Role"
				value={formData.role}
				onChange={handleChange}
				className="border rounded px-2 py-1 w-full"
				required
			/>
			<select
				name="status"
				value={formData.status}
				onChange={handleChange}
				className="border rounded px-2 py-1 w-full"
			>
				<option value="applied">Applied</option>
				<option value="interviewing">Interviewing</option>
				<option value="offer">Offer</option>
			</select>
			<input
				type="url"
				name="link"
				placeholder="Job link"
				value={formData.link}
				onChange={handleChange}
				className="border rounded px-2 py-1 w-full"
			/>
			<textarea
				name="notes"
				placeholder="Notes"
				value={formData.notes}
				onChange={handleChange}
				className="border rounded px-2 py-1 w-full"
			/>
			<button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
				Add Application
			</button>
		</form>
	);
};

export default AddApplicationForm;
