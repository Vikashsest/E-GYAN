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
 * Update a repository value
 * @param {string} id - Value ID to update
 * @param {string} value - New updated value
 * @returns {Promise<Object>}
 */
export const updateRepositoryValue = async (id, value) => {
  try {
    const res = await fetch(`${API_URL}/repository/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ value }),
    });
    if (!res.ok) throw new Error("Failed to update value");
    return await res.json();
  } catch (err) {
    console.error("updateRepositoryValue error:", err);
    throw err;
  }
};

/**
 * Delete a repository value
 * @param {string} id - Value ID to delete
 * @returns {Promise<Object>}
 */
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
