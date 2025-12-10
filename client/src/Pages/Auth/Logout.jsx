// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { FaSignOutAlt } from "react-icons/fa";
// import { logout } from "../../apiServices/authApi";

// export default function LogoutButton() {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await logout()
//         localStorage.removeItem("role");
//         toast.success("Logged out successfully!", {
//           position: "top-right",
//           autoClose: 2000,
//         });

//         setTimeout(() => {
//           navigate("/");
//         }, 2000);
     
//     } catch (err) {
//       console.error("Logout error:", err);
//       toast.error("Something went wrong ❗");
//     }
//   };

//   return (
//     <button
//       onClick={handleLogout}
//       className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
//                  bg-blue-600
//                  text-white font-semibold text-sm
//                  shadow-md hover:shadow-lg 
//                  transition-all duration-300"
//     >
//       <FaSignOutAlt className="text-lg" />
//       Logout
//     </button>
//   );
// }









import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSignOutAlt } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../apiServices/authApi";

export default function LogoutButton() {
  const navigate = useNavigate();

  // React Query Mutation for Logout
  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("role");

      toast.success("Logged out successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: () => {
      toast.error("Something went wrong ❗");
    },
  });

  const handleLogout = () => {
    mutate(); // Trigger logout API call
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                 bg-blue-600 text-white font-semibold text-sm
                 shadow-md hover:shadow-lg transition-all duration-300
                 ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <FaSignOutAlt className="text-lg" />
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}


