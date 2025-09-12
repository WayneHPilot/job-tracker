import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const ApplicationsContext = createContext();

const API_BASE = "http://localhost:3001/api";

export const ApplicationsProvider = ({ children }) => {
	const { token } = useAuth();
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Fetch applications
	const fetchApplications = useCallback(async () => {
		if (!token) {
			setApplications([]); // guests can still add locally, but nothing from API
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

	return (
		<ApplicationsContext.Provider
			value={{ applications, setApplications, fetchApplications, loading, error }}
		>
			{children}
		</ApplicationsContext.Provider>
	);
};

export const useApplications = () => useContext(ApplicationsContext);
