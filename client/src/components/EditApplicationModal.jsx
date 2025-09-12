import React, { useState, useEffect } from "react";

const EditApplicationModal = ({ isOpen, application, onClose, onSave }) => {
	const [form, setForm] = useState({
		company: "",
		role: "",
		status: "applied",
		link: "",
		notes: "",
	});

	useEffect(() => {
		if (application) {
			setForm({
				company: application.company || "",
				role: application.role || "",
				status: application.status || "applied",
				link: application.link || "",
				notes: application.notes || "",
			});
		}
	}, [application]);

	if (!isOpen) return null;

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(form);
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-full max-w-md border border-gray-300 dark:border-gray-700">
				<h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Application</h2>

				<form onSubmit={handleSubmit} className="space-y-3">
					<input
						type="text"
						name="company"
						placeholder="Company"
						value={form.company}
						onChange={handleChange}
						className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
					/>
					<input
						type="text"
						name="role"
						placeholder="Role"
						value={form.role}
						onChange={handleChange}
						className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
					/>
					<select
						name="status"
						value={form.status}
						onChange={handleChange}
						className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
					>
						<option value="applied">Applied</option>
						<option value="interviewing">Interviewing</option>
						<option value="offer">Offer</option>
					</select>
					<input
						type="url"
						name="link"
						placeholder="Job Link"
						value={form.link}
						onChange={handleChange}
						className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
					/>
					<textarea
						name="notes"
						placeholder="Notes"
						value={form.notes}
						onChange={handleChange}
						className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
					></textarea>

					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
