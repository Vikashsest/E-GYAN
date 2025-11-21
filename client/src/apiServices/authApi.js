const API_URL = import.meta.env.VITE_API_URL;

export async function login(data) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.message || "Login failed");

    return result;
  } catch (error) {
    throw error;
  }
}


export async function logout() {
  try {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.message || "Logout failed");
    }

    // Clear cookie manually if needed
    document.cookie = "access_token=; path=/; max-age=0";

    return true;
  } catch (error) {
    throw error;
  }
}