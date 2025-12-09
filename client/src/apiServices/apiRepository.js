const API_URL = import.meta.env.VITE_API_URL;

export const getRepository = async (type) => {
  try {
    const url = type
      ? `${API_URL}/repository?type=${type}`
      : `${API_URL}/repository`;

    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch repository");

    return await res.json();
  } catch (err) {
    console.error("getRepository error:", err);
    throw err;
  }
};

export const addRepositoryValue = async (text, type) => {
  try {
    const res = await fetch(`${API_URL}/repository`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text, type }),
    });

    if (!res.ok) throw new Error("Failed to add value");
    return await res.json();
  } catch (err) {
    console.error("addRepositoryValue error:", err);
    throw err;
  }
};

export const updateRepositoryValue = async (id, text) => {
  try {
    const res = await fetch(`${API_URL}/repository/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error("Failed to update value");
    return await res.json();
  } catch (err) {
    console.error("updateRepositoryValue error:", err);
    throw err;
  }
};

export const deleteRepositoryValue = async (id) => {
  try {
    const res = await fetch(`${API_URL}/repository/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to delete value");
    return await res.json();
  } catch (err) {
    console.error("deleteRepositoryValue error:", err);
    throw err;
  }
};
