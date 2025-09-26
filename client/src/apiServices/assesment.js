import { getCookie } from "../utils/cookie";
const API_URL = import.meta.env.VITE_API_URL;

export async function createAssessment(createAssessmentDto) {
 

  try {
    const res = await fetch(`${API_URL}/assessments`, {
      method: "POST", 
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createAssessmentDto),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error creating assessment:", error);
    throw error;
  }
}
