import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { sendOtp, verifyOtp, resetPassword } from "../../apiServices/authApi";
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
    if (!newPassword || !confirmPassword)
      return alert("Please enter all password fields");
    if (newPassword !== confirmPassword) return alert("Passwords do not match");

    try {
      await resetPassword({ email, newPassword, confirmPassword, otp });
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
