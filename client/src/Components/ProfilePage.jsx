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
  const [sessions, setSessions] = useState([]);
  const isStudent = user?.role?.toLowerCase() === "student";

  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);
  useEffect(() => {
    if (user) {
      setFormData(user);
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/active-sessions`, {
        credentials: "include",
      });

      const data = await res.json(); // <-- convert to JSON

      setSessions(data); // <-- set actual array
    } catch (err) {
      console.error("Error fetching sessions", err);
    }
  };

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
    <div className="min-h-screen bg-darkBg text-primaryWhite p-6">
      <div className="max-w-3xl mx-auto bg-cardBg rounded-xl shadow-md p-8">
        {/* Profile Info */}
        <div className="flex flex-col items-center text-center">
          <img
            src="/user.png"
            alt={formData?.username || "User"}
            width={100}
            height={100}
            className="rounded-full border-4 border-primaryBlue"
          />

          <h2 className="text-2xl font-bold mt-4 text-primaryBlue">
            {formData?.profile?.username}
          </h2>
        </div>


        {/* Detail Rows */}
        <div className="mt-8 space-y-4 text-sm">
          <ProfileRow
            icon={<FaEnvelope />}
            label="Email"
            value={formData?.email}
          />
          <ProfileRow
            icon={<FaUserShield />}
            label="Role"
            value={formData?.role}
          />
        </div>

        <div className="mt-10 bg-cardBg p-4 rounded-lg border border-gray700">
          <h3 className="text-lg font-semibold mb-3 text-primaryBlue">
            🔐 Logged-in Devices
          </h3>

          {sessions.length === 0 ? (
            <p className="text-gray400 text-sm">No active sessions</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-darkBg p-3 rounded border border-gray700"
                >
                  <p>
                    📱 <b className="text-gray500">Device:</b>{" "}
                    <span className="text-primaryBlue">{session.device}</span>
                  </p>
                  <p>
                    🌐 <b className="text-gray500">IP:</b>{" "}
                    <span className="text-primaryBlue">{session.ip}</span>
                  </p>
                  <p>
                    ⏳ <b className="text-gray500">Login Time:</b>{" "}
                    <span className="text-primaryBlue">
                      {new Date(session.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                      })}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>


        <div className="mt-10 flex justify-center gap-6 flex-wrap">
          {/* Go to Dashboard */}
          <button
            onClick={handleDashboardRedirect}
            className="flex items-center gap-2 bg-primaryBlue hover:bg-primaryGreen text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
          >
            <FaArrowLeft /> Go to Dashboard
          </button>

          {/* Student Button */}
          {isStudent && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-primaryBlue hover:bg-primaryOrange text-white px-4 py-2 rounded-lg text-sm transition"
            >
              <FaEdit /> User Request
            </button>
          )}
          <span>
            <Logout />
          </span>

        </div>

      </div>

      {/* User Request Modal — ONLY FOR STUDENTS */}
      {showModal && isStudent && (
        <div className="fixed inset-0 bg-darkBg bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-cardBg p-6 rounded-lg w-full max-w-md border border-gray700">
            <h3 className="text-lg font-semibold mb-4 text-primaryBlue">
              ✏️ User Request
            </h3>

            <form className="space-y-4" onSubmit={handleRequestSubmit}>
              <input
                type="text"
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Enter your request..."
                className="w-full bg-darkBg border border-gray700 p-2 rounded text-gray400 focus:border-primaryBlue outline-none"
              />

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray700 rounded hover:bg-gray700 transition"
                >
                  ❌ Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-primaryBlue hover:bg-primaryGreen text-white rounded transition"
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
    <div className="flex items-center gap-4 border-b border-gray700 pb-2">
      <div className="text-primaryBlue text-lg">{icon}</div>
      <div>
        <p className="text-gray400 text-sm">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );
}

