const API_URL = import.meta.env.VITE_API_URL;

/**
 * Fetch repository data
 * @returns {Promise<Object[]>}
 */
export const getRepository = async () => {
  try {
    const res = await fetch(`${API_URL}/repository`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch repository");
    return await res.json();
  } catch (err) {
    console.error("getRepository error:", err);
    throw err;
  }
};

/**
 * Add new value to repository dropdown
 * @param {string} type - type of dropdown (resource, subject, level, language, category)
 * @param {string} value - new value to add
 * @returns {Promise<Object>} updated repository object
 */
export const addRepositoryValue = async (type, value) => {
  try {
    const res = await fetch(`${API_URL}/repository`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ type, value }),
    });
    if (!res.ok) throw new Error("Failed to add value");
    return await res.json();
  } catch (err) {
    console.error("addRepositoryValue error:", err);
    throw err;
  }
};

/**
 * Create a new repository
 * @param {Object} data - repository data { name, resourceType, subject, level, language, category }
 * @returns {Promise<Object>}
 */
export const createRepository = async (data) => {
  try {
    const res = await fetch(`${API_URL}/repository/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create repository");
    return await res.json();
  } catch (err) {
    console.error("createRepository error:", err);
    throw err;
  }
};
