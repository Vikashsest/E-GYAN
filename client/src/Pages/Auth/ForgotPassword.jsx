// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { FaEye, FaEyeSlash } from "react-icons/fa"; 

// const API_URL = import.meta.env.VITE_API_URL;

// export default function ResetPasswordPage() {
//   const { token } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     dob: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   // 👁️ States to toggle password visibility
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();

//     try {
//       const res = await fetch(`${API_URL}/auth/forgot-password`, {
//         credentials: "include",
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: formData.email,
//           dob: String(formData.dob),
//           newPassword: String(formData.newPassword),
//           confirmPassword: String(formData.confirmPassword),
//         }),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         toast.success("Password reset successful ✅");
//         setTimeout(() => navigate("/login"), 2000);
//       } else {
//         toast.error(result.message || "Reset failed ❌");
//       }
//     } catch (err) {
//       toast.error("Something went wrong ❗");
//     }
//   }

//   return (
//     <main
//       className="min-h-screen bg-cover bg-center text-white flex items-center justify-center px-6 relative"
//       style={{ backgroundImage: "url('/signup3.jpg')" }}
//     >
//       <div className="absolute inset-0 bg-black/60 z-0"></div>

//       <form
//         onSubmit={handleSubmit}
//         className="z-10 w-full max-w-md p-10 bg-[#1c1d2a]/70 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl space-y-6 transition-all duration-300"
//       >
//         <h2 className="text-3xl font-bold text-center text-blue-400 drop-shadow-md">
//           Reset Your Password
//         </h2>

//         <input
//           type="email"
//           name="email"
//           placeholder="Enter your email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//           className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/20"
//         />

//         <input
//           type="date"
//           name="dob"
//           placeholder="Date of Birth"
//           value={formData.dob}
//           onChange={handleChange}
//           required
//           className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/20"
//         />

//         {/* 🔹 New Password Field */}
//         <div className="relative">
//           <input
//             type={showNewPassword ? "text" : "password"}
//             name="newPassword"
//             placeholder="New Password"
//             value={formData.newPassword}
//             onChange={handleChange}
//             required
//             className="w-full p-3 pr-10 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/20"
//           />
//           <button
//             type="button"
//             onClick={() => setShowNewPassword((prev) => !prev)}
//             className="absolute top-4 right-3 text-white focus:outline-none"
//           >
//             {showNewPassword ? <FaEyeSlash /> : <FaEye />}
//           </button>
//         </div>

//         {/* 🔹 Confirm Password Field */}
//         <div className="relative">
//           <input
//             type={showConfirmPassword ? "text" : "password"}
//             name="confirmPassword"
//             placeholder="Confirm Password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//             className="w-full p-3 pr-10 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/20"
//           />
//           <button
//             type="button"
//             onClick={() => setShowConfirmPassword((prev) => !prev)}
//             className="absolute top-4 right-3 text-white focus:outline-none"
//           >
//             {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//           </button>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200"
//         >
//           Reset Password
//         </button>
//       </form>
//     </main>
//   );
// }






import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { sendOtp,verifyOtp,resetPassword } from '../../apiServices/authApi';
import { toast } from "react-toastify";
export default function ResetPasswordUI() {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const inputClass =
    "w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/20";

  const buttonClass =
    "w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 py-3 rounded-xl text-white font-semibold shadow-lg";


  const handleSendOtp = async () => {
    if (!email) return toast.warn("Please enter email");
    try {
      await sendOtp({ email });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.warn("Please enter OTP");
    try {
      await verifyOtp({ email, otp });
      toast.success("OTP verified!");
      setStep(3);
    } catch (error) {
      toast.error(error.message || "OTP verification failed");
    }
  };

  
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return alert("Please enter all password fields");
    if (newPassword !== confirmPassword) return alert("Passwords do not match");

    try {
      await resetPassword({ email, newPassword, confirmPassword,otp });
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Password reset failed");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1e1f2b] z-50">
      <div className="bg-[#1c1d2a]/70 backdrop-blur-lg p-10 rounded-3xl w-full max-w-md text-white space-y-6 shadow-2xl">

        {/* Step 1: Email */}
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold text-center text-blue-400 drop-shadow-md">
              Enter Your Email
            </h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <button onClick={handleSendOtp} className={buttonClass}>
              Next
            </button>
          </>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <>
            <h2 className="text-3xl font-bold text-center text-blue-400 drop-shadow-md">
              Enter OTP
            </h2>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={inputClass}
            />
            <button onClick={handleVerifyOtp} className={buttonClass}>
              Next
            </button>
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <>
            <h2 className="text-3xl font-bold text-center text-blue-400 drop-shadow-md">
              Reset Password
            </h2>

            {/* New Password */}
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute top-3 right-3 text-white focus:outline-none"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-3 right-3 text-white focus:outline-none"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button onClick={handleResetPassword} className={buttonClass}>
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
