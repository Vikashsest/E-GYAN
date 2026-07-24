import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import {
  FaChalkboard,
  FaUsers,
  FaUserTie,
  FaBook,
  FaSyncAlt,
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { toast } from "react-toastify";

// 📊 Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";

// ✅ API SERVICE
import {
  fetchAdminSchoolOverview,
  fetchSingleSchoolAnalytics,
} from "../../apiServices/schoolOverview";

export default function AdminSchoolOverview() {
  const [data, setData] = useState({});
  const [lastSync, setLastSync] = useState("Loading...");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [performance, setPerformance] = useState([]);
  const [subjectEngagement, setSubjectEngagement] = useState([]);
  const [activityStats, setActivityStats] = useState([]);
  const [studyTime, setStudyTime] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [summary, setSummary] = useState({});
  const [analytics, setAnalytics] = useState({});

  const COLORS = ["#3B82F6", "#06B6D4", "#34D399", "#FACC15", "#F87171"];

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const result = await fetchAdminSchoolOverview();
        setSummary(result);
      } catch (err) {
        toast.error("Error fetching school summary");
      }
    };

    loadSummary();
  }, []);

  useEffect(() => {
    const loadSchoolOverview = async () => {
      try {
        const result = await fetchSingleSchoolAnalytics();

        setAnalytics(result);

        setPerformance(result.performance ?? []);
        setSubjectEngagement(result.subjectEngagement ?? []);
        setActivityStats(result.activityStats ?? []);
        setStudyTime(result.studyTime ?? []);
        setLeaderboard(result.leaderboard ?? []);
      } catch (err) {
        toast.error("Error fetching school overview");
      }
    };

    loadSchoolOverview();
  }, []);

  /* ------------------ SYNC ------------------ */

  const handleSync = () => {
    setLastSync("🔄 Syncing...");
    setTimeout(() => {
      setLastSync("Just now");
      toast.success("✅ Synced successfully");
    }, 1000);
  };

  const summaryCards = [
    {
      title: "Total Teachers",
      icon: <FaUserTie />,
      count: summary.totalTeachers,
      color: "bg-orange-500",
    },
    {
      title: "Total Students",
      icon: <FaUsers />,
      count: summary.totalStudents,
      color: "bg-blue-500",
    },
    {
      title: "Total Classes",
      icon: <FaChalkboard />,
      count: summary.totalClasses,
      color: "bg-green-500",
    },
    {
      title: "Total Books",
      icon: <FaBook />,
      count: summary.totalBooks,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="flex min-h-screen bg-darkBg text-primaryWhite">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
        {/* Mobile Menu */}
        <div className="lg:hidden px-4 mb-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-primaryWhite"
          >
            <FiMenu size={28} />
          </button>
        </div>

        <AdminNavbar />

        <div className="p-4">
          {/* Header */}
          <h1 className="text-3xl font-bold mb-1">School Overview</h1>
          <p className="text-primaryWhite/70 mb-6">
            Track your school’s usage and digital performance.
          </p>

          {/* Summary Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {summaryCards.map((item, index) => (
              <div
                key={index}
                className={`p-5 rounded-xl shadow-lg flex items-center gap-4 ${item.color}`}
              >
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-primaryWhite/90">{item.count}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Sync Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="bg-cardBg p-6 rounded-xl shadow-lg col-span-2">
              <h2 className="text-xl font-semibold mb-4">Sync Status</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray600 rounded p-4">
                  <p className="text-primaryWhite/70 text-sm">Last Sync</p>
                  <p className="text-lightGreen font-bold">{lastSync}</p>
                </div>

                <div className="border border-gray600 rounded p-4">
                  <p className="text-primaryWhite/70 text-sm">
                    Pending Uploads
                  </p>
                  <p className="text-lightYellow font-bold">
                    {data.pendingUploads ?? 0} files
                  </p>
                </div>
              </div>

              <div className="mt-4 text-right">
                <button
                  onClick={handleSync}
                  className="bg-primaryBlue hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2"
                >
                  <FaSyncAlt /> Sync Now
                </button>
              </div>
            </div>
          </section>

          {/* --------------------------------------------------- */}
          {/* 📊 ANALYTICS DASHBOARD (MERGED FROM YOUR OLD CODE) */}
          {/* --------------------------------------------------- */}

          <h2 className="text-2xl font-bold mb-4">School Analytics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Performance Chart */}
            <div className="bg-cardBg p-5 rounded-2xl shadow">
              <h3 className="text-lg font-semibold mb-3">
                Overall Performance
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={performance}>
                  <defs>
                    <linearGradient
                      id="perfGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="url(#perfGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Subject Engagement */}
            <div className="bg-cardBg p-5 rounded-2xl shadow">
              <h3 className="text-lg font-semibold mb-3">Subject Engagement</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={subjectEngagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#34D399" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Student Activity */}
            <div className="bg-cardBg p-5 rounded-2xl shadow">
              <h3 className="text-lg font-semibold mb-3">Student Activity</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={activityStats}
                    dataKey="value"
                    innerRadius={45}
                    outerRadius={80}
                  >
                    {activityStats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Study Time */}
            <div className="bg-cardBg p-5 rounded-2xl shadow">
              <h3 className="text-lg font-semibold mb-3">Average Study Time</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={studyTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="time"
                    stroke="#FACC15"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Leaderboard */}
            <div className="bg-cardBg p-5 rounded-2xl shadow md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">
                Top Performing Students
              </h3>
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-gray300 text-sm">
                    <th>Name</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((s, i) => (
                    <tr
                      key={i}
                      className="bg-[#1f2231] hover:bg-[#3a3e5a] transition"
                    >
                      <td className="py-2 px-3">{s.name}</td>
                      <td className="py-2 px-3 text-sky-400 font-semibold">
                        {s.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
