const API_URL = import.meta.env.VITE_API_URL;

export const getReports = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_URL}/reports?${params}`, {
    credentials: "include",
  });
  return res.json();
};

export const getStats = async () => {
  const res = await fetch(`${API_URL}/reports/stats`, {
    credentials: "include",
  });
  return res.json();
};

export const exportCSV = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  window.open(`${API_URL}/reports/export/csv?${params}`, "_blank");
};

export const exportPDF = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  window.open(`${API_URL}/reports/export/pdf?${params}`, "_blank");
};
