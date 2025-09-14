// client/src/context/ApplicationsContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const ApplicationsContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE;

export const ApplicationsProvider = ({ children }) => {
	const { token } = useAuth();
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch applications
	const fetchApplications = useCallback(async () => {
		if (!token) {
			setApplications([]); // guests see nothing from API
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const res = await axios.get(`${API_BASE}/applications`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setApplications(res.data || []);
		} catch (err) {
			console.error("Error fetching applications:", err);
			setError("Failed to load applications.");
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		fetchApplications();
	}, [fetchApplications]);

	// Add application
	const addApplication = async (newApp) => {
		if (!token) {
			// guest mode → add locally only
			setApplications((prev) => [...prev, { ...newApp, id: Date.now() }]);
			return;
		}
		try {
			const res = await axios.post(`${API_BASE}/applications`, newApp, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setApplications((prev) => [...prev, res.data]);
		} catch (err) {
			console.error("Error adding application:", err);
		}
	};

	// Update application
	const updateApplication = async (id, updates) => {
		if (!token) {
			// guest mode → update locally
			setApplications((prev) =>
				prev.map((app) => (app.id === id ? { ...app, ...updates } : app))
			);
			return;
		}
		try {
			const res = await axios.put(`${API_BASE}/applications/${id}`, updates, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setApplications((prev) =>
				prev.map((app) => (app.id === id ? res.data : app))
			);
		} catch (err) {
			console.error("Error updating application:", err);
		}
	};

	// Delete application
	const deleteApplication = async (id) => {
		if (!token) {
			// guest mode → remove locally
			setApplications((prev) => prev.filter((app) => app.id !== id));
			return;
		}
		try {
			await axios.delete(`${API_BASE}/applications/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setApplications((prev) => prev.filter((app) => app.id !== id));
		} catch (err) {
			console.error("Error deleting application:", err);
		}
	};

	return (
		<ApplicationsContext.Provider
			value={{
				applications,
				setApplications,
				fetchApplications,
				addApplication,
				updateApplication,
				deleteApplication,
				loading,
				error,
			}}
		>
			{children}
		</ApplicationsContext.Provider>
	);
};

export const useApplications = () => useContext(ApplicationsContext);
