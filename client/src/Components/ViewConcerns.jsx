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

  // Fetch Concerns & Requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Concerns
        const resConcerns = await fetch(`${API_URL}/admin/concerns`, {
          credentials: "include",
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (!resConcerns.ok) throw new Error("Failed to fetch concerns");
        setConcerns(await resConcerns.json());

        // Requests
        const resRequests = await fetch(`${API_URL}/user/requests`, {
          credentials: "include",
          method: "GET",
          headers: { Authorization: `Bearer ${access_token}` },
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

  const handleDelete = async (id, type) => {
    if (!id) {
      console.error("Invalid ID:", id);
      toast.error("Invalid ID");
      return;
    }

    let url = "";

    if (type === "concern") {
      url = `${API_URL}/students/${id}`;
    } else if (type === "request") {
      url = `${API_URL}/admin/request/${id}`;
    }

    try {
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      if (type === "concern") {
        setConcerns((prev) => prev.filter((c) => c._id !== id));
      } else {
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }

      toast.success(`${type} deleted successfully`);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete");
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/admin/request/${requestId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // Update local state
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
      );

      toast.success("Status updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1b23] p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Admin Dashboard</h1>

      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
      >
        ← Go to Dashboard
      </button>

      {/* Concerns Table */}
      <div className="mb-8 overflow-x-auto rounded-xl shadow-md bg-[#2a2b38]">
        <h2 className="text-xl font-semibold text-white px-6 py-3">
          Student Concerns
        </h2>
        <table className="min-w-full text-sm text-left text-white">
          <thead className="bg-[#383a4a] text-xs uppercase text-gray-300">
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
                <td colSpan="6" className="text-center py-6 text-gray-300">
                  No concerns found.
                </td>
              </tr>
            ) : (
              concerns.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-700 hover:bg-[#343545]"
                >
                  <td className="px-6 py-4">{item.student?.name}</td>
                  <td className="px-6 py-4">{item.subject}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.priority === "High"
                          ? "bg-red-600/30 text-red-400"
                          : item.priority === "Medium"
                          ? "bg-yellow-600/30 text-yellow-300"
                          : "bg-green-600/30 text-green-300"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-medium ${
                        item.status === "Resolved"
                          ? "text-green-400"
                          : "text-yellow-300"
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
                      className="text-blue-400 hover:underline font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, "concern")}
                      title="Delete Concern"
                      className="text-red-400 hover:text-red-600 text-base"
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
      <div className="overflow-x-auto rounded-xl shadow-md bg-[#2a2b38]">
        <h2 className="text-xl font-semibold text-white px-6 py-3">
          User Requests
        </h2>
        <table className="min-w-full text-sm text-left text-white">
          <thead className="bg-[#383a4a] text-xs uppercase text-gray-300">
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
                <td colSpan="4" className="text-center py-6 text-gray-300">
                  No requests found.
                </td>
              </tr>
            ) : (
              requests.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-700 hover:bg-[#343545]"
                >
                  <td className="px-6 py-4">{item.user?.username}</td>
                  <td className="px-6 py-4">{item.message}</td>
                  <td className="px-6 py-4">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value)
                      }
                      className="bg-gray-700 text-white px-2 py-1 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center items-center gap-4">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-blue-400 hover:underline font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, "request")}
                      title="Delete Request"
                      className="text-red-400 hover:text-red-600 text-base"
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
            className="relative bg-[#2a2b38] rounded-xl shadow-xl max-w-3xl w-full pb-4 pt-10 px-4"
          >
            <div className="absolute top-0 right-3 flex gap-3 z-50">
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-blue-400 text-xl"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-white hover:text-red-400 relative bottom-1 text-4xl"
              >
                &times;
              </button>
            </div>

            {selectedItem.image && (
              <img
                src={selectedItem.image}
                alt="Proof"
                className="w-full max-h-[80vh] object-contain rounded-lg border border-gray-600"
              />
            )}
            {selectedItem.message && (
              <div className="p-4 text-white">
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
