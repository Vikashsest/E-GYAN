
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaUserShield, FaEdit } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import Logout from "../Pages/Auth/Logout";
import { createRequest } from "../apiServices/request";

export default function ProfilePage({ user }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(user || {});
  const [requestMessage, setRequestMessage] = useState("");

  const isStudent = user?.role?.toLowerCase() === "student";

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleDashboardRedirect = () => {
    const role = user?.role?.toLowerCase().trim();
    switch (role) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "principal":
        navigate("/principal/dashboard");
        break;
      case "teacher":
        navigate("/teacher/dashboard");
        break;
      case "student":
        navigate("/student/dashboard");
        break;
      default:
        navigate("/login");
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestMessage.trim()) return alert("Please enter a message");

    try {
      await createRequest({ message: requestMessage });
      setShowModal(false);
      setRequestMessage("");
      alert("Request submitted!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit request");
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1f2b] text-white p-6">
      <div className="max-w-3xl mx-auto bg-[#2a2b39] rounded-xl shadow-md p-8">
        
        {/* Profile Info */}
        <div className="flex flex-col items-center text-center">
          <img
            src="/user.png"
            alt={formData?.username || "User"}
            width={100}
            height={100}
            className="rounded-full border-4 border-blue-500"
          />
          <h2 className="text-2xl font-bold mt-4">{formData?.username}</h2>
        </div>

        {/* Detail Rows */}
        <div className="mt-8 space-y-4 text-sm">
          <ProfileRow icon={<FaEnvelope />} label="Email" value={formData?.email} />
          <ProfileRow icon={<FaUserShield />} label="Role" value={formData?.role} />
        </div>

        {/* Buttons Section */}
        <div className="mt-10 flex justify-center gap-6 flex-wrap">

          {/* Go to Dashboard */}
          <button
            onClick={handleDashboardRedirect}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-[600] text-sm"
          >
            <FaArrowLeft className="font-[600]" /> Go to Dashboard
          </button>

          {/* Student → Show User Request Button */}
          {isStudent && (
            <button
              type="text"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              <FaEdit /> User Request
            </button>
          )}

          {/* Admin → NO EDIT BUTTON */}

          <div>
            <Logout />
          </div>
        </div>
      </div>

      {/* User Request Modal — ONLY FOR STUDENTS */}
      {showModal && isStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md text-black">
            <h3 className="text-lg font-semibold mb-4">✏️ User Request</h3>
            
            <form className="space-y-4" onSubmit={handleRequestSubmit}>
              <input
                type="text"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Enter your request..."
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-200"
                >
                  ❌ Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  ✅ Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ProfileRow Component
function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 border-b border-gray-700 pb-2">
      <div className="text-blue-400 text-lg">{icon}</div>
      <div>
        <p className="text-gray-400">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );
}
