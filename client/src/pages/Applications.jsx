// client/src/pages/Applications.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AddApplicationForm from "../components/AddApplicationForm";
import EditApplicationModal from "../components/EditApplicationModal";

const Applications = () => {
	const [applications, setApplications] = useState([]);
	const [statusFilter, setStatusFilter] = useState("");
	const [sortOrder, setSortOrder] = useState("newest");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Modal state
	const [editingApp, setEditingApp] = useState(null);

	// Fetch applications
	const fetchApplications = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const params = {};
			if (statusFilter) params.status = statusFilter;
			if (sortOrder) params.sort = sortOrder;

			const res = await axios.get("http://localhost:3001/api/applications", { params });
			setApplications(res.data);
		} catch (err) {
			console.error(err);
			setError("Failed to load applications. Please try again.");
		} finally {
			setLoading(false);
		}
	}, [statusFilter, sortOrder]);

	useEffect(() => {
		fetchApplications();
	}, [fetchApplications]);

	// Save edited application
	const handleSave = async (updatedApp) => {
		try {
			await axios.put(`http://localhost:3001/api/applications/${editingApp.id}`, updatedApp);
			setEditingApp(null);
			fetchApplications();
		} catch (err) {
			console.error("Error saving changes:", err);
			setError("Failed to save changes.");
		}
	};

	// Delete application
	const deleteApplication = async (id) => {
		if (!window.confirm("Are you sure you want to delete this application?")) return;
		try {
			await axios.delete(`http://localhost:3001/api/applications/${id}`);
			fetchApplications();
		} catch (err) {
			setError("Failed to delete application.");
		}
	};

	return (
		<div className="max-w-4xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Job Applications</h1>

			{/* Filters */}
			<div className="flex flex-wrap gap-4 mb-6">
				<select
					className="border rounded px-3 py-2 bg-white text-black dark:bg-gray-800 dark:text-gray-100"
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
				>
					<option value="">All Statuses</option>
					<option value="applied">Applied</option>
					<option value="interviewing">Interviewing</option>
					<option value="offer">Offer</option>
				</select>

				<select
					className="border rounded px-3 py-2 bg-white text-black dark:bg-gray-800 dark:text-gray-100"
					value={sortOrder}
					onChange={(e) => setSortOrder(e.target.value)}
				>
					<option value="newest">Newest First</option>
					<option value="oldest">Oldest First</option>
				</select>
			</div>

			{/* Error message */}
			{error && (
				<div className="text-red-600 bg-red-100 border border-red-300 rounded p-3 mb-4">
					{error}
				</div>
			)}

			{/* Loading state */}
			{loading ? (
				<ul className="space-y-4">
					{[1, 2, 3].map((i) => (
						<li key={i} className="border rounded p-4 animate-pulse">
							<div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
							<div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
						</li>
					))}
				</ul>
			) : applications.length === 0 ? (
				<div className="text-center text-gray-500 mt-10">
					<p>No applications found. Try adding one below 👇</p>
				</div>
			) : (
				<ul className="space-y-4">
					{applications.map((app) => (
						<li
							key={app.id}
							className="border rounded p-4 hover:shadow-md transition
							        bg-white dark:bg-gray-900
							        text-gray-900 dark:text-gray-100
							        border-gray-300 dark:border-gray-700"
						>
							<div className="flex justify-between items-center">
								<div>
									<h2 className="font-semibold text-lg">{app.company}</h2>
									<p className="text-gray-700 dark:text-gray-300">{app.role}</p>
									<span
										className={`inline-block mt-1 px-2 py-1 rounded text-sm ${
											app.status === "applied"
												? "bg-blue-100 text-blue-800"
												: app.status === "interviewing"
												? "bg-yellow-100 text-yellow-800"
												: "bg-green-100 text-green-800"
										}`}
									>
										{app.status}
									</span>
									{app.link && (
										<a
											href={app.link}
											target="_blank"
											rel="noopener noreferrer"
											className="text-indigo-600 dark:text-indigo-400 underline block mt-1"
										>
											Job Posting
										</a>
									)}
									{app.notes && (
										<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{app.notes}</p>
									)}
								</div>

								<div className="flex gap-2">
									<button
										onClick={() => setEditingApp(app)}
										className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
									>
										Edit
									</button>
									<button
										onClick={() => deleteApplication(app.id)}
										className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
									>
										Delete
									</button>
								</div>
							</div>
						</li>
					))}
				</ul>
			)}

			{/* Add new application form */}
			<div className="mt-8">
				<AddApplicationForm onAdded={fetchApplications} />
			</div>

			{/* Edit Modal */}
			<EditApplicationModal
				isOpen={!!editingApp}
				application={editingApp}
				onClose={() => setEditingApp(null)}
				onSave={handleSave}
			/>
		</div>
	);
};

export default Applications;
