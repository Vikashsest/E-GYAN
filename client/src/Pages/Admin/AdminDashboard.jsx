import Sidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import WelcomeHeading from "../../Components/WelcomeHeading";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiMenu } from "react-icons/fi";
import { useEffect, useState } from "react";
import { getCookie } from "../../utils/cookie";
import { toast } from "react-toastify";

export default function FileManagerDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalPdf: 0,
    totalVideos: 0,
    totalAudio: 0,
    totalStudents: 0,
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [concerns, setConcerns] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const access_token = getCookie("access_token");

  /* 🔹 Dynamic Date Logic */
  const lastUpdated = new Date();
  const formattedDate = lastUpdated.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/stats`, {
          credentials: "include",
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchConcerns = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/concerns`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setConcerns(data);
        }
      } catch (err) {
        console.error("Error fetching concerns:", err);
      }
    };

    fetchConcerns();
  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.warn("Please select a file");

    const formData = new FormData();
    formData.append("credentialFile", file);

    try {
      const res = await fetch(`${API_URL}/admin/upload-credentials`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Upload failed!");
        return;
      }
      toast.success("File uploaded successfully!");
      setShowUploadModal(false);
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed!");
    }
  };

  return (
    <div className="flex min-h-screen bg-darkBg text-white">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden px-4 mb-4">
          <button onClick={() => setIsSidebarOpen(true)} className="text-white">
            <FiMenu size={28} />
          </button>
        </div>

        <AdminNavbar
          onUpload={() => setShowUploadModal(true)}
          notificationsCount={concerns.length}
        />

        <div className="p-4">
          <WelcomeHeading />
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white text-black p-6 rounded w-full max-w-md shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Upload Your Files</h3>
              <form onSubmit={handleFileUpload}>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full mb-4 text-sm px-4 py-1 rounded-md border border-gray400 text-gray700 
                  file:border file:border-gray700 file:px-3 file:py-1 file:rounded"
                />
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="border border-black px-4 py-2 rounded"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primaryBlue hover:bg-blue-700 px-4 py-2 text-white rounded"
                  >
                    ✅ Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Overview Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                type: "Books",
                count: stats.totalBooks,
                size: "16GB",
                color: "primaryOrange",
              },
              {
                type: "PDF",
                count: stats.totalPdf,
                size: "8GB",
                color: "primaryBlue",
              },
              {
                type: "Audios",
                count: stats.totalAudio,
                size: "0GB",
                color: "primaryGreen",
              },
              {
                type: "Videos",
                count: stats.totalVideos,
                size: "1GB",
                color: "primaryYellow",
              },
            ].map((item, index) => (
              <div key={index} className="bg-cardBg p-4 rounded">
                <p className={`text-${item.color} font-bold`}>{item.type}</p>
                <p className="text-sm text-gray400">{item.count} items</p>

                <div className="w-full h-2 bg-gray700 rounded-full mt-2">
                  <div
                    className={`h-2 bg-${item.color} rounded-full`}
                    style={{
                      width:
                        item.size === "1GB"
                          ? "10%"
                          : item.size === "8GB"
                            ? "30%"
                            : "70%",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pie Charts */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-cardBg p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">Total Students</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={[{ name: "Students", value: stats.totalStudents }]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    <Cell fill="#3b82f6" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-cardBg p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">Total Books</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={[{ name: "Books", value: stats.totalBooks }]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    <Cell fill="#f97316" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 bg-gradient-to-r from-[#2d2e3b] to-darkBg border-t border-gray700 rounded-lg shadow-inner p-6 text-center text-gray300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-primaryBlue rounded-full text-white font-bold">
                V
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Latest Release</p>
                <p className="text-xs text-gray400">eGyan</p>
              </div>
            </div>

            <div className="text-sm">
              <p className="text-gray400">
                📦 <span className="text-white font-semibold">Version:</span>{" "}
                <span className="text-primaryBlue">v0.0.0</span>
              </p>
              <p className="text-gray400">
                🗓️ Last Updated:{" "}
                <span className="text-primaryGreen">{formattedDate}</span>
              </p>
              <Link to="/latest-release">
                <button className="mt-3 bg-gradient-to-r from-primaryBlue to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white text-sm px-4 py-2 rounded-lg shadow-md transition-all">
                  🚀 Latest Release
                </button>
              </Link>
            </div>

            <div className="text-sm">
              <p className="text-gray400">
                ⚙️ Developed by{" "}
                <a
                  href="https://sestinfotech.com"
                  target="_blank"
                  className="text-primaryBlue font-medium"
                >
                  SEST INFOTECH PVT LTD
                </a>
              </p>
              <p className="text-gray500 text-xs">
                © {new Date().getFullYear()} All rights reserved
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
