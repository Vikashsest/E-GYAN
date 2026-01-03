import AdminNavbar from "../Pages/Admin/AdminNavbar";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaExpand, FaCompress, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { getCookie } from "../utils/cookie";

const API_URL = import.meta.env.VITE_API_URL;
const access_token = getCookie("access_token");

function ConcernList() {
  const [concerns, setConcerns] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resConcerns = await fetch(`${API_URL}/admin/concerns`, {
          credentials: "include",
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (!resConcerns.ok) throw new Error("Failed to fetch concerns");
        setConcerns(await resConcerns.json());
        const resRequests = await fetch(`${API_URL}/user/requests`, {
          credentials: "include",
          method: "GET",
        });
        if (!resRequests.ok) throw new Error("Failed to fetch requests");
        setRequests(await resRequests.json());
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await modalRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // DELETE CONCERN
  const deleteConcern = async (id) => {
    if (!id) return toast.error("Invalid Concern ID");

    try {
      const res = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");

      setConcerns((prev) => prev.filter((c) => c._id !== id));
      toast.success("Concern deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete concern");
    }
  };

  // DELETE REQUEST
  const deleteRequest = async (id) => {
    if (!id) return toast.error("Invalid Request ID");

    try {
      const res = await fetch(`${API_URL}/user/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");

      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Request deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete request");
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/user/${requestId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
      );

      toast.success("Status updated!");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-darkBg p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Admin Dashboard</h1>

      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-primaryBlue hover:bg-hoverBlue text-white rounded-md transition duration-200"
      >
        ← Go to Dashboard
      </button>

      {/* Concerns Table */}
      <div className="mb-8 overflow-x-auto rounded-xl shadow-md bg-cardBg">
        <h2 className="text-xl font-semibold text-primaryWhite px-6 py-3">
          Student Concerns
        </h2>
        <table className="min-w-full text-sm text-left text-primaryWhite">
          <thead className="bg-[#383a4a] text-xs uppercase text-gray300">
            <tr>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">Subject</th>
              <th className="px-6 py-3">Priority</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {concerns.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray300">
                  No concerns found.
                </td>
              </tr>
            ) : (
              concerns.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray700 hover:bg-hoverGray"
                >
                  <td className="px-6 py-4">{item.student?.name}</td>
                  <td className="px-6 py-4">{item.subject}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.priority === "High"
                          ? "bg-red-600/30 text-lightRed"
                          : item.priority === "Medium"
                          ? "bg-yellow-600/30 text-lightYellow"
                          : "bg-green-600/30 text-lightGreen"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-medium ${
                        item.status === "Resolved"
                          ? "text-lightGreen"
                          : "text-lightYellow"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(item.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center items-center gap-4">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-primaryBlue hover:underline font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteConcern(item.id)}
                      title="Delete Concern"
                      className="text-lightRed hover:text-primaryRed text-base"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto rounded-xl shadow-md bg-cardBg">
        <h2 className="text-xl font-semibold text-primaryWhite px-6 py-3">
          User Requests
        </h2>
        <table className="min-w-full text-sm text-left text-primaryWhite">
          <thead className="bg-[#383a4a] text-xs uppercase text-gray300">
            <tr>
              <th className="px-6 py-3">User Name</th>
              <th className="px-6 py-3">Message</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray300">
                  No requests found.
                </td>
              </tr>
            ) : (
              requests.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray700 hover:bg-hoverGray"
                >
                  <td className="px-6 py-4">{item.user?.username}</td>
                  <td className="px-6 py-4">{item.message}</td>
                  <td className="px-6 py-4">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value)
                      }
                      className="bg-gray700 text-primaryWhite px-2 py-1 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center items-center gap-4">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-primaryBlue hover:underline font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteRequest(item.id)}
                      title="Delete Request"
                      className="text-lightRed hover:text-primaryRed text-base"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="relative bg-cardBg rounded-xl shadow-xl max-w-3xl w-full pb-4 pt-10 px-4"
          >
            <div className="absolute top-0 right-3 flex gap-3 z-50">
              <button
                onClick={toggleFullscreen}
                className="text-PrimaryWhite hover:text-primaryBlue text-xl"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-primaryWhite hover:text-lightRed relative bottom-1 text-4xl"
              >
                &times;
              </button>
            </div>

            {selectedItem.image && (
              <img
                src={selectedItem.image}
                alt="Proof"
                className="w-full max-h-[80vh] object-contain rounded-lg border border-gray600"
              />
            )}
            {selectedItem.message && (
              <div className="p-4 text-primaryWhite">
                <p>
                  <strong>Message:</strong> {selectedItem.message}
                </p>
                {selectedItem.user && (
                  <p>
                    <strong>User:</strong> {selectedItem.user.username}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConcernList;
