const API_URL = import.meta.env.VITE_API_URL;

export async function getAnnouncements() {
  try {
    const res = await fetch(`${API_URL}/annoucements`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch annoucements");

    return await res.json();
  } catch (err) {
    console.error("getAnnouncements error:", err);
    throw err;
  }
}

export async function addAnnouncement(data) {
  try {
    const res = await fetch(`${API_URL}/annoucements`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to add announcement");

    return await res.json();
  } catch (err) {
    console.error("addAnnouncement error:", err);
    throw err;
  }
}

export async function updateAnnouncement(id, data) {
  try {
    const res = await fetch(`${API_URL}/annoucements/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update announcement");

    return await res.json();
  } catch (err) {
    console.error("updateAnnouncement error:", err);
    throw err;
  }
}

export async function deleteAnnouncement(id) {
  try {
    const res = await fetch(`${API_URL}/annoucements/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to delete announcement");

    return await res.json();
  } catch (err) {
    console.error("deleteAnnouncement error:", err);
    throw err;
  }
}

