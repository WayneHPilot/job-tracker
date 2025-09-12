export const API_BASE = "https://job-tracker-fe4u.onrender.com";

export async function getApplications(filters = {}) {
	const params = new URLSearchParams(filters).toString();
	const res = await fetch(`${API_BASE}/api/applications${params ? "?" + params : ""}`);
	if (!res.ok) throw new Error("Failed to fetch applications");
	return res.json();
}

export async function createApplication(payload) {
	const res = await fetch(`${API_BASE}/api/applications`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	if (!res.ok) throw new Error("Failed to create application");
	return res.json();
}
