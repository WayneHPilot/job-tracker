import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddApplicationForm from "../components/AddApplicationForm";
import EditApplicationModal from "../components/EditApplicationModal";
import { useAuth } from "../context/AuthContext";
import { useApplications } from "../context/ApplicationsContext";

const API_BASE = import.meta.env.VITE_API_BASE;

console.log("🚀 API_BASE =", API_BASE);a

const Applications = () => {
	const { token } = useAuth();
	const isLoggedIn = !!token;
	const navigate = useNavigate();

	const { applications, setApplications, loading, error } = useApplications();

	const [statusFilter, setStatusFilter] = useState("");
	const [sortOrder, setSortOrder] = useState("newest");
	const [editingApp, setEditingApp] = useState(null);

	// 🔹 Seed guest example applications
	useEffect(() => {
		if (!isLoggedIn && applications.length === 0) {
			setApplications([
				{
					id: "guest-1",
					company: "Acme Corp",
					role: "Frontend Developer",
					status: "applied",
					link: "https://example.com",
					notes: "Sent CV, waiting for response.",
					createdAt: new Date().toISOString(),
				},
				{
					id: "guest-2",
					company: "Tech Solutions",
					role: "Backend Engineer",
					status: "interviewing",
					link: "https://example.com",
					notes: "First interview completed.",
					createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
				},
				{
					id: "guest-3",
					company: "Startup Inc.",
					role: "Full-Stack Developer",
					status: "offer",
					link: "https://example.com",
					notes: "Offer received!",
					createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
				},
			]);
		}
	}, [isLoggedIn, applications.length, setApplications]);

	// Add handler
	const handleAdd = async (maybeCreatedOrRaw) => {
		if (maybeCreatedOrRaw && maybeCreatedOrRaw.id) {
			setApplications((prev) => [maybeCreatedOrRaw, ...prev]);
			return;
		}

		const newApp = maybeCreatedOrRaw;
		if (!newApp) return;

		if (!isLoggedIn) {
			setApplications((prev) => [
				{ ...newApp, id: `guest-${Date.now()}`, createdAt: new Date().toISOString() },
				...prev,
			]);
			return;
		}

		try {
			const res = await axios.post(`${API_BASE}/applications`, newApp, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setApplications((prev) => [res.data, ...prev]);
		} catch (err) {
			console.error("Failed to add application:", err.response?.data || err.message);
		}
	};

	// Save edited application
	const handleSave = async (updatedData) => {
		if (!editingApp) return;

		if (String(editingApp.id).startsWith("guest-")) {
			setApplications((prev) =>
				prev.map((a) => (a.id === editingApp.id ? { ...a, ...updatedData } : a))
			);
			setEditingApp(null);
			return;
		}

		try {
			const res = await axios.put(
				`${API_BASE}/applications/${editingApp.id}`,
				updatedData,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setApplications((prev) =>
				prev.map((a) => (a.id === res.data.id ? res.data : a))
			);
			setEditingApp(null);
		} catch (err) {
			console.error("Error saving changes:", err.response?.data || err.message);
		}
	};

	// Delete application
	const deleteApplication = async (id) => {
		if (!window.confirm("Are you sure you want to delete this application?")) return;

		if (String(id).startsWith("guest-")) {
			setApplications((prev) => prev.filter((a) => a.id !== id));
			return;
		}

		if (!isLoggedIn) {
			alert("You must be logged in to delete saved applications.");
			return;
		}

		try {
			await axios.delete(`${API_BASE}/applications/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setApplications((prev) => prev.filter((a) => a.id !== id));
		} catch (err) {
			console.error("Failed to delete:", err.response?.data || err.message);
		}
	};

	// Apply filters + sorting
	const visibleApplications = applications
		.filter((a) => (statusFilter ? a.status === statusFilter : true))
		.sort((a, b) =>
			sortOrder === "newest"
				? new Date(b.createdAt) - new Date(a.createdAt)
				: new Date(a.createdAt) - new Date(b.createdAt)
		);

	return (
		<div className="max-w-4xl mx-auto p-4">
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
					Job Applications
				</h1>
			</div>

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

			{/* Guest banner */}
			{!isLoggedIn && (
				<div className="mb-4 p-3 rounded bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700">
					⚠️ You are in Guest mode. Changes will be stored only locally unless you log in.
				</div>
			)}

			{/* Error */}
			{error && (
				<div className="text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200 border border-red-300 dark:border-red-700 rounded p-3 mb-4">
					{error}
				</div>
			)}

			{/* List / Empty / Loading */}
			{loading ? (
				<p>Loading applications…</p>
			) : visibleApplications.length === 0 ? (
				<div className="text-center text-gray-500 mt-10">
					<p>No applications found. Try adding one below 👇</p>
				</div>
			) : (
				<ul className="space-y-4">
					{visibleApplications.map((app) => (
						<li
							key={app.id}
							className="border rounded p-4 hover:shadow-md transition bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
						>
							<div className="flex justify-between items-start">
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
										<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
											{app.notes}
										</p>
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
			<div className="mt-8 border rounded-lg p-4 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 shadow-sm">
				<AddApplicationForm onAdded={handleAdd} />
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
