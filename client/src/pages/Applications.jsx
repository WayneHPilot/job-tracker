import React, { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import axios from "axios";
import AddApplicationForm from "../components/AddApplicationForm";

const Badge = ({ status }) => {
	const map = {
		applied: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
		interviewing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
		offer: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
	};
	return (
		<span className={`px-3 py-1 rounded-full text-xs font-medium ${map[status] || ""}`}>
		{status}
		</span>
	);
};

const CardSkeleton = () => (
<li className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900 animate-pulse">
    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mt-3"></div>
    <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-4"></div>
</li>
);

const Applications = () => {
	const [applications, setApplications] = useState([]);
	const [statusFilter, setStatusFilter] = useState("");
	const [sortOrder, setSortOrder] = useState("newest");
	const [search, setSearch] = useState("");
	const deferredSearch = useDeferredValue(search);
	const [loading, setLoading] = useState(true);

	// fetch applications from API with server-side filter/sort
	const fetchApplications = useCallback(async () => {
		try {
		setLoading(true);
		const params = {};
		if (statusFilter) params.status = statusFilter;
		if (sortOrder) params.sort = sortOrder;

		const res = await axios.get("http://localhost:3001/api/applications", { params });
		setApplications(res.data);
		} catch (e) {
		console.error(e);
		} finally {
		setLoading(false);
		}
	}, [statusFilter, sortOrder]);

	useEffect(() => {
		fetchApplications();
	}, [fetchApplications]);

	// client-side search + derived stats
	const filtered = useMemo(() => {
		const q = deferredSearch.trim().toLowerCase();
		let list = [...applications];

		if (q) {
		list = list.filter(
			(a) =>
			a.company.toLowerCase().includes(q) ||
			a.role.toLowerCase().includes(q) ||
			(a.notes || "").toLowerCase().includes(q)
		);
		}

		return list;
	}, [applications, deferredSearch]);

	const stats = useMemo(() => {
		const all = applications.length;
		const byStatus = applications.reduce(
		(acc, a) => ((acc[a.status] = (acc[a.status] || 0) + 1), acc),
		{}
		);
		return { all, ...byStatus };
	}, [applications]);

	return (
		<div className="space-y-6">
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			<h1 className="text-3xl font-bold">Applications</h1>
			<div className="flex gap-2 text-sm">
			<span className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3 py-1">
				Total: <strong>{stats.all || 0}</strong>
			</span>
			<span className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3 py-1">
				Applied: <strong>{stats.applied || 0}</strong>
			</span>
			<span className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3 py-1">
				Interviewing: <strong>{stats.interviewing || 0}</strong>
			</span>
			<span className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3 py-1">
				Offer: <strong>{stats.offer || 0}</strong>
			</span>
			</div>
		</div>

		{/* Add new */}
		<AddApplicationForm onSuccess={fetchApplications} />

		{/* Controls */}
		<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
			<input
			type="text"
			placeholder="Search company, role, notes…"
			value={search}
			onChange={(e) => setSearch(e.target.value)}
			className="w-full sm:w-1/2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
			/>

			<select
			className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
			value={statusFilter}
			onChange={(e) => setStatusFilter(e.target.value)}
			>
			<option value="">All Statuses</option>
			<option value="applied">Applied</option>
			<option value="interviewing">Interviewing</option>
			<option value="offer">Offer</option>
			</select>

			<select
			className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
			value={sortOrder}
			onChange={(e) => setSortOrder(e.target.value)}
			>
			<option value="newest">Newest First</option>
			<option value="oldest">Oldest First</option>
			</select>
		</div>

		{/* List */}
		<ul className="space-y-4">
			{loading
			? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
			: filtered.map((app) => (
				<li
					key={app.id}
					className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition"
				>
					<div className="flex items-start justify-between gap-4">
					<div>
						<h2 className="text-xl font-semibold">{app.company}</h2>
						<p className="text-gray-600 dark:text-gray-300">{app.role}</p>
						{app.link && (
						<a
							href={app.link}
							target="_blank"
							rel="noreferrer"
							className="text-indigo-600 dark:text-indigo-400 underline mt-1 inline-block"
						>
							Job posting
						</a>
						)}
						{app.notes && (
						<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Notes: {app.notes}</p>
						)}
					</div>
					<Badge status={app.status} />
					</div>

					<div className="mt-4 flex gap-2">
					<EditInline app={app} onSaved={fetchApplications} />
					<button
						onClick={async () => {
						await axios.delete(`http://localhost:3001/api/applications/${app.id}`);
						fetchApplications();
						}}
						className="rounded-lg bg-red-500 hover:bg-red-600 text-white px-4 py-2"
					>
						Delete
					</button>
					</div>
				</li>
				))}

			{!loading && filtered.length === 0 && (
			<li className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
				No applications match your search.
			</li>
			)}
		</ul>
		</div>
	);
};

// Inline editor component (keeps file self-contained)
const EditInline = ({ app, onSaved }) => {
	const [open, setOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [form, setForm] = useState({
		company: app.company,
		role: app.role,
		status: app.status,
		link: app.link || "",
		notes: app.notes || "",
	});

	const save = async () => {
		try {
		setSaving(true);
		await axios.put(`http://localhost:3001/api/applications/${app.id}`, form);
		setOpen(false);
		onSaved?.();
		} catch (e) {
		console.error(e);
		} finally {
		setSaving(false);
		}
	};

	if (!open) {
		return (
		<button
			onClick={() => setOpen(true)}
			className="rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2"
		>
			Edit
		</button>
		);
	}

	return (
		<div className="w-full rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-950">
		<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
			<input
			className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
			value={form.company}
			onChange={(e) => setForm({ ...form, company: e.target.value })}
			placeholder="Company"
			/>
			<input
			className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
			value={form.role}
			onChange={(e) => setForm({ ...form, role: e.target.value })}
			placeholder="Role"
			/>
			<select
			className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
			value={form.status}
			onChange={(e) => setForm({ ...form, status: e.target.value })}
			>
			<option value="applied">Applied</option>
			<option value="interviewing">Interviewing</option>
			<option value="offer">Offer</option>
			</select>
			<input
			className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
			value={form.link}
			onChange={(e) => setForm({ ...form, link: e.target.value })}
			placeholder="Link"
			/>
			<textarea
			className="md:col-span-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
			value={form.notes}
			onChange={(e) => setForm({ ...form, notes: e.target.value })}
			placeholder="Notes"
			/>
		</div>
		<div className="mt-3 flex gap-2">
			<button
			onClick={save}
			disabled={saving}
			className="rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-4 py-2"
			>
			{saving ? "Saving..." : "Save"}
			</button>
			<button
			onClick={() => setOpen(false)}
			className="rounded-lg bg-gray-400 hover:bg-gray-500 text-white px-4 py-2"
			>
			Cancel
			</button>
		</div>
		</div>
	);
};

export default Applications;
