import { getCookie } from "../utils/cookie";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchSingleSchoolAnalytics = async () => {
    const access_token = getCookie("access_token");

    const res = await fetch(`${API_URL}/analytics/single-school`, {
        method: "GET",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch school analytics");
    }

    return res.json();
};


export const fetchAdminSchoolOverview = async () => {
    const access_token = getCookie("access_token");

    const res = await fetch(`${API_URL}/admin/school-overview`, {
        method: "GET",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch admin school overview");
    }

    return res.json();
};
