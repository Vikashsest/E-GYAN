// import { Link, useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import { FaEnvelope, FaLock } from 'react-icons/fa';
// import { toast } from "react-toastify";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function LoginPage() {
//   const [data, setData] = useState({ username: '', password: '' });
//   const navigate = useNavigate();

//   function handledata(e) {
//     const { name, value } = e.target;
//     setData(prev => ({ ...prev, [name]: value }));
//   }

//   async function handlesubmit(e) {
//     e.preventDefault();
//     try {
//       const res = await fetch(`${API_URL}/auth/login`, {
//         method: "POST",
//         credentials:"include",
//         headers: { "Content-Type": "application/json",
//          },
//         body: JSON.stringify(data),
//       });

//       const result = await res.json();
    
// // document.cookie = `access_token=${result.access_token}; path=/; max-age=86400; sameSite=lax`

//       if (res.ok) {
//          localStorage.setItem("role", result.role); 
//         toast.success("Login successful ✅");

//         setData({ username: '', password: '' });

//         setTimeout(() => {
//           switch (result.role) {
//             case "student":
//               navigate("/student/dashboard");
//               break;
//             case "teacher":
//               navigate("/teacher/dashboard");
//               break;
//             case "principal":
//               navigate("/principal/dashboard");
//               break;
//             case "admin":
//               navigate("/admin/dashboard");
//               break;
//             default:
//               navigate("/login");
//           }
//         }, 1000); 
//       } else {
//         toast.error(result.message || "Login failed ❌");
//       }
//     } catch (error) {
//       toast.error("Something went wrong ❗");
//       console.error("Login error:", error);
//     }
//   }

//   return (
//   <main
//   className="min-h-screen bg-cover bg-center text-white flex items-center justify-center px-6 relative overflow-hidden"
//   style={{ backgroundImage: "url('/signup3.jpg')" }}
// >
//   <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

//   <div className="w-full max-w-md z-10 bg-[#1c1d2a]/70 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl p-10 space-y-8 transition-all duration-300 text-center">
    
//     {/* 🔹 App Title */}
//     <h2 className="text-3xl font-bold text-center text-blue-400 drop-shadow-md">
//       Unlock Knowledge.
//       <br />
//       <span className="text-white">Log In.</span>
//     </h2>

//     {/* 🔹 Login Form */}
//     <form className="space-y-6" onSubmit={handlesubmit}>
//       <div className="relative">
//         <FaEnvelope className="absolute top-3.5 left-3 text-white z-10" />
//         <input
//           onChange={handledata}
//           name="username"
//           type="text"
//           placeholder="Username"
//           value={data.username}
//           required
//           className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
//         />
//       </div>

//       <div className="relative">
//         <FaLock className="absolute top-3.5 left-3 text-white z-10" />
//         <input
//           onChange={handledata}
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={data.password}
//           required
//           className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
//         />
//       </div>

//       <button
//         type="submit"
//         className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold py-3 rounded-xl shadow-lg"
//       >
//         Log In
//       </button>

//       <p className="text-sm text-center text-gray-300">
//         Start learning – Log In?{" "}
//         <Link to="/forgot-password" className="text-blue-400 hover:underline">
//           Forgot Password
//         </Link>
//       </p>
//     </form>

//     {/* 🔹 APK Download Link */}
//     <div className="pt-4 border-t border-white/10">
//       <a
//   href="https://drive.google.com/uc?export=download&id=1xmTX99uooBTmYWJzMS8IYFIGpYJAeNGn"
//   download
//   className="inline-block mt-2 px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold shadow-md transition-all duration-200"
// >
//   ⬇️ Download Android Apk
// </a>

//     </div>
//   </div>
// </main>

//   );
// }











import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'; // 👈 added icons
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const [data, setData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); // 👈 new state
  const navigate = useNavigate();

  function handledata(e) {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  }

  function togglePassword() {
    setShowPassword(prev => !prev);
  }

  async function handlesubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("role", result.role);
        toast.success("Login successful ✅");

        setData({ username: '', password: '' });

        setTimeout(() => {
          switch (result.role) {
            case "student":
              navigate("/student/dashboard");
              break;
            case "teacher":
              navigate("/teacher/dashboard");
              break;
            case "principal":
              navigate("/principal/dashboard");
              break;
            case "admin":
              navigate("/admin/dashboard");
              break;
            default:
              navigate("/login");
          }
        }, 1000);
      } else {
        toast.error(result.message || "Login failed ❌");
      }
    } catch (error) {
      toast.error("Something went wrong ❗");
      console.error("Login error:", error);
    }
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center text-white flex items-center justify-center px-6 relative overflow-hidden"
      style={{ backgroundImage: "url('/signup3.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      <div className="w-full max-w-md z-10 bg-[#1c1d2a]/70 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl p-10 space-y-8 transition-all duration-300 text-center">

        {/* 🔹 App Title */}
        <h2 className="text-3xl font-bold text-center text-blue-400 drop-shadow-md">
          Unlock Knowledge.
          <br />
          <span className="text-white">Log In.</span>
        </h2>

        {/* 🔹 Login Form */}
        <form className="space-y-6" onSubmit={handlesubmit}>
          {/* Username */}
          <div className="relative">
            <FaEnvelope className="absolute top-3.5 left-3 text-white z-10" />
            <input
              onChange={handledata}
              name="username"
              type="text"
              placeholder="Username"
              value={data.username}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
            />
          </div>

          {/* Password with Eye Icon */}
          <div className="relative">
            <FaLock className="absolute top-3.5 left-3 text-white z-10" />
            <input
              onChange={handledata}
              name="password"
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              value={data.password}
              required
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
            />
            {/* 👁️ Toggle Button */}
            <button
              type="button"
              onClick={togglePassword}
              className="absolute top-4 right-3 text-white focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold py-3 rounded-xl shadow-lg"
          >
            Log In
          </button>

          <p className="text-sm text-center text-gray-300">
            Start learning – Log In?{" "}
            <Link to="/forgot-password" className="text-blue-400 hover:underline">
              Forgot Password
            </Link>
          </p>
        </form>

        {/* 🔹 APK Download Link */}
        <div className="pt-4 border-t border-white/10">
          <a
            href="https://drive.google.com/file/d/1iv5yNAEDLj7s1mQgj_F_SANUOakXsJqi/view?usp=sharing"
            download
            className="inline-block mt-2 px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold shadow-md transition-all duration-200"
          >
            ⬇️ Download Android Apk
          </a>
        </div>
      </div>
    </main>
  );
}











