// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import {FaSignOutAlt} from 'react-icons/fa'

// const API_URL = import.meta.env.VITE_API_URL;

// export default function LogoutButton() {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       const res = await fetch(`${API_URL}/auth/logout`, {
//         method: "POST",
//         credentials: "include",
//       });

//       document.cookie = "access_token=; path=/; max-age=0";
//       if (res.ok) {
//         localStorage.removeItem("role"); 
//         toast.success("Logged out successfully!", {
//           position: "top-right",
//           autoClose: 2000,
//         });

//         setTimeout(() => {
//           navigate("/");
//         }, 2000);
//       } else {
//         const data = await res.json();
//         toast.error(data.message || "Logout failed ❌");
//       }
//     } catch (err) {
//       console.error("Logout error:", err);
//       toast.error("Something went wrong ❗");
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={handleLogout}
//         className="w-full bg-blue-600 py-2 flex gap-2 items-center justify-center text-white rounded text-sm font-semibold"
//       >
//         <FaSignOutAlt className="inline"/>
//        Logout
//       </button>
//     </>
//   );
// }






import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSignOutAlt } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      document.cookie = "access_token=; path=/; max-age=0";
      if (res.ok) {
        localStorage.removeItem("role");
        toast.success("Logged out successfully!", {
          position: "top-right",
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const data = await res.json();
        toast.error(data.message || "Logout failed ❌");
      }
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Something went wrong ❗");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                 bg-blue-600
                 text-white font-semibold text-sm
                 shadow-md hover:shadow-lg 
                 transition-all duration-300"
    >
      <FaSignOutAlt className="text-lg" />
      Logout
    </button>
  );
}


