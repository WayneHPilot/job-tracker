// client/src/components/EditApplicationModal.jsx
import React, { useState, useEffect } from "react";

const EditApplicationModal = ({ isOpen, onClose, application, onSave }) => {
	const [formData, setFormData] = useState({
		company: "",
		role: "",
		status: "",
		link: "",
		notes: "",
	});

	// Pre-fill form when editing an application
	useEffect(() => {
		if (application) {
			setFormData(application);
		}
	}, [application]);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(formData); // Pass updated data back to parent
	};

	if (!isOpen) return null; // Hide if modal is closed

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md 
							border border-gray-200 dark:border-gray-700">
				<h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
					Edit Application
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="text"
						name="company"
						placeholder="Company"
						value={formData.company}
						onChange={handleChange}
						className="border rounded px-2 py-1 w-full 
							bg-white dark:bg-gray-800 
							text-gray-900 dark:text-gray-100"
					/>
					<input
						type="text"
						name="role"
						placeholder="Role"
						value={formData.role}
						onChange={handleChange}
						className="border rounded px-2 py-1 w-full 
							bg-white dark:bg-gray-800 
							text-gray-900 dark:text-gray-100"
					/>
					<select
						name="status"
						value={formData.status}
						onChange={handleChange}
						className="border rounded px-2 py-1 w-full 
							bg-white dark:bg-gray-800 
							text-gray-900 dark:text-gray-100"
					>
						<option value="applied">Applied</option>
						<option value="interviewing">Interviewing</option>
						<option value="offer">Offer</option>
					</select>
					<input
						type="url"
						name="link"
						placeholder="Job Link"
						value={formData.link || ""}
						onChange={handleChange}
						className="border rounded px-2 py-1 w-full 
							bg-white dark:bg-gray-800 
							text-gray-900 dark:text-gray-100"
					/>
					<textarea
						name="notes"
						placeholder="Notes"
						value={formData.notes || ""}
						onChange={handleChange}
						className="border rounded px-2 py-1 w-full 
							bg-white dark:bg-gray-800 
							text-gray-900 dark:text-gray-100"
					/>

					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 
									text-gray-900 dark:text-gray-100 hover:bg-gray-400 
									dark:hover:bg-gray-600"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
						>
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditApplicationModal;
