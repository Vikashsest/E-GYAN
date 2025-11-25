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


export async function sendOtp(data) {
  try {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to send OTP");

    return result;
  } catch (error) {
    throw error;
  }
}


export async function verifyOtp(data) {
  try {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "OTP verification failed");

    return result;
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(data) {
  try {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Password reset failed");

    return result;
  } catch (error) {
    throw error;
  }
}
