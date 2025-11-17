import { useState,useEffect} from "react";

function WelcomeHeading() {

    const [userData,setUserData] = useState(null)

const API_URL = import.meta.env.VITE_API_URL;

     useEffect(() => {
        async function fetchProfile() {
          try {
            const res = await fetch(`${API_URL}/auth/me`, {
              method: "GET",
              credentials: "include",
            });
    
            const data = await res.json();
            setUserData(data);
          } catch (err) {
            console.error("❌ Failed to fetch your name", err);
          } 
        }
    
        fetchProfile();
      }, []);

  return (
    <div>
        {
            userData &&
            <h1 className="text-white text-3xl font-bold ">Hi, Welcome Mr. {userData.profile.username}</h1>
        }
    </div>
  )
}

export default WelcomeHeading