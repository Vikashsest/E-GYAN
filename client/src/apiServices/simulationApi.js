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
