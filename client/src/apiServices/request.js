import { getCookie } from "../utils/cookie";
const API_URL = import.meta.env.VITE_API_URL;

const access_token = getCookie("access_token"); 

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`, 
  };
}

export async function createRequest(data) {
  const response = await fetch(`${API_URL}/user/request`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error("Failed to create request");

  return await response.json();
}



export async function fetchRequests(){

}
