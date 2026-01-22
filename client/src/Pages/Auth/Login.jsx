

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../apiServices/authApi";

export default function LoginPage() {
  const [data, setData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handledata(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      localStorage.setItem("role", result.role);
      localStorage.setItem("userID", result.userID);
      toast.success("Login successful ✅");
      setData({ username: "", password: "" });

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
    },
    onError: () => {
      toast.error("Invalid username or password ❌");
    },
  });

 function handlesubmit(e) {
  e.preventDefault();

  const trimmedData = {
    username: data.username.trim(),
    password: data.password.trim(),
  };

  if (!trimmedData.username || !trimmedData.password) {
    toast.error("Username and password cannot be empty ❌");
    return;
  }

  mutate(trimmedData);
}


  return (
    <main
      className="min-h-screen bg-cover bg-center text-primaryWhite flex items-center justify-center px-6 relative overflow-hidden"
      style={{ backgroundImage: "url('/signup3.jpg')" }}
    >
      <div className="absolute inset-0 bg-primaryBlack opacity-60 z-0"></div>

      <div className="w-full max-w-md z-10 bg-[#1c1d2a]/70 backdrop-blur-lg border border-primaryWhite/10 shadow-2xl rounded-3xl p-10 space-y-8 transition-all duration-300 text-center">
        <h2 className="text-3xl font-bold text-lightBlue drop-shadow-md">
          Unlock Knowledge.
          <br />
          <span className="text-primaryWhite">Log In.</span>
        </h2>

        <form className="space-y-6" onSubmit={handlesubmit}>
          {/* Username */}
          <div className="relative">
            <FaEnvelope className="absolute top-3.5 left-3 text-primaryWhite" />
            <input
              onChange={handledata}
              name="username"
              type="text"
              placeholder="Username"
              value={data.username}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-primaryWhite/10 text-primaryWhite placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-primaryWhite/10"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-3.5 left-3 text-primaryWhite" />
            <input
              onChange={handledata}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={data.password}
              required
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-primaryWhite/10 text-primaryWhite placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-primaryWhite/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-4 right-3 text-primaryWhite"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primaryBlue hover:bg-blue-700 disabled:bg-blue-900 disabled:opacity-50 transition-all duration-200 text-primaryWhite font-semibold py-3 rounded-xl shadow-lg"
          >
            {isPending ? "Logging in..." : "Log In"}
          </button>

          <p className="text-sm text-gray300">
            Forgot?{" "}
            <Link
              to="/forgot-password"
              className="text-lightBlue hover:underline"
            >
              Reset Password
            </Link>
          </p>
        </form>

        <div className="pt-4 border-t border-primaryWhite/10">
          <a
            href="https://drive.google.com/file/d/1G15zrCtDwNxXApGsa3r_ZgBTO4lMC3_5/view?usp=sharing"
            className="inline-block mt-2 px-5 py-2 bg-primaryGreen hover:bg-green-700 rounded-lg text-primaryBlack font-semibold shadow-md"
          >
            ⬇️ Download Android Apk
          </a>
        </div>
      </div>
    </main>
  );
}
