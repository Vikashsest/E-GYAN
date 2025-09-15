
import { useEffect, useState } from "react";
import {
  FaClock,
  FaBookOpen,
  FaCheckCircle,
  FaHeart,
  FaBullhorn,
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { toast } from "react-toastify";
import { getCookie } from "../../utils/cookie";
import StudentNavbar from "./StudentNavbar";
import StudentSidebar from "./StudentSidebar";
import WelcomeHeading from "../../Components/WelcomeHeading";

const API_URL = import.meta.env.VITE_API_URL;
const access_token = getCookie("access_token");

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState({
    timeSpent: "0h 0m",
    booksCompleted: 0,
    recentActivity: 0,
    favorites: 0,
  });

  const [announcements, setAnnouncements] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch(`${API_URL}/students/metrices`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch metrics");

        const data = await res.json();

        setMetrics({
          timeSpent: formatTime(data.totalTimeSpent || 0),
          booksCompleted: data.booksCompleted || 0,
          recentActivity: data.recentActivityCount || 0,
          favorites: data.favoriteBooksCount || 0,
        });
      } catch (error) {
        toast.error("❌ Failed to load metrics");
        console.error(error);
      }
    }

    async function fetchAnnouncements() {
      try {
        const res = await fetch(`${API_URL}/students/announcements`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch announcements");

        const data = await res.json();
        setAnnouncements(data);
      } catch (error) {
        toast.error("❌ Failed to load announcements");
        console.error(error);
      }
    }

    fetchMetrics();
    fetchAnnouncements();
  }, []);

  const icons = {
    timeSpent: <FaClock className="text-orange-500 text-3xl" />,
    booksCompleted: <FaCheckCircle className="text-blue-500 text-3xl" />,
    recentActivity: <FaBookOpen className="text-green-500 text-3xl" />,
    favorites: <FaHeart className="text-yellow-500 text-3xl" />,
  };

  const items = [
    { title: "Total Time Spent", icon: icons.timeSpent, count: metrics.timeSpent },
    { title: "Books Completed", icon: icons.booksCompleted, count: metrics.booksCompleted },
    { title: "Recent Activity", icon: icons.recentActivity, count: metrics.recentActivity },
    { title: "Favorites", icon: icons.favorites, count: metrics.favorites },
  ];

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      {/* Sidebar */}
      <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:pl-[280px] py-6 pr-5 w-full">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden px-4 mb-4">
          <button onClick={() => setIsSidebarOpen(true)} className="text-white">
            <FiMenu size={28} />
          </button>
        </div>

        <StudentNavbar />

        <div className="p-4">
          <WelcomeHeading />
        </div>

  {/* Metrics Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
  {items.map((item, index) => (
    <div
      key={index}
      className="p-5 rounded-2xl shadow-lg flex items-center gap-4 border border-white/10 
                 bg-gradient-to-br from-[#2e2f44] to-[#1f202f] text-white 
                 hover:scale-105 hover:shadow-2xl transition-all duration-300"
    >
      {/* Icon inside glowing circle */}
      <div className="flex items-center justify-center w-14 h-14 rounded-full 
                      bg-yellow-400/20 text-yellow-400 text-2xl shadow-md">
        {item.icon}
      </div>

      {/* Text */}
      <div>
        <h3 className="font-semibold text-lg">{item.title}</h3>
        <p className="text-2xl font-bold text-gray-100">{item.count}</p>
      </div>
    </div>
  ))}
</div>


        {/* Announcements */}
       {/* Announcements */}
<div className="mt-10 px-4">
  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
    <FaBullhorn className="text-yellow-400 animate-pulse" />
    📌 Announcements
  </h2>

  <div className="space-y-4">
    {announcements.length > 0 ? (
      announcements.map((announcement, i) => (
        <div
          key={i}
          className="relative bg-gradient-to-r from-[#2e2f44] to-[#1f202f] 
                     p-4 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] 
                     transition-all duration-300 flex items-start gap-3 border border-white/10"
        >
          {/* Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full 
                          bg-yellow-400/20 text-yellow-400 flex-shrink-0">
            <FaBullhorn />
          </div>

          {/* Text */}
          <div>
            <p className="text-sm text-gray-200">{announcement.message}</p>
            <span className="text-xs text-gray-400">📅 Just now</span>
          </div>

          {/* Decorative pulse dot */}
          <span className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
        </div>
      ))
    ) : (
      <p className="text-gray-400 text-sm">No announcements available.</p>
    )}
  </div>
</div>

      </main>
    </div>
  );
}
