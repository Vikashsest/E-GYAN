import { getCookie } from "../utils/cookie";
const API_URL = import.meta.env.VITE_API_URL;

const access_token = getCookie("access_token"); 

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`, 
  };
}

export async function fetchSimulationData() {
  const response = await fetch(`${API_URL}/books/simulations`, {
    credentials: "include", 
    headers: getHeaders(),
  });
  return await response.json(); 
}


export async function createSimulation(payload) {
  const res = await fetch(`${API_URL}/books/simulation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("access_token")}`,
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Create simulation failed");

  return res.json();
}
