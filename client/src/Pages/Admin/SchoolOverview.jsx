// import { useEffect, useState } from "react";
// import AdminSidebar from "./AdminSidebar";
// import AdminNavbar from "./AdminNavbar";
// import {
//   FaChalkboard,
//   FaUsers,
//   FaUserTie,
//   FaBook,
//   FaSyncAlt,
//   FaIdCard,
//   FaTabletAlt,
// } from "react-icons/fa";
// import { getCookie } from "../../utils/cookie";
// import { toast } from "react-toastify";
// import { FiMenu } from "react-icons/fi";

// const API_URL = import.meta.env.VITE_API_URL;

// const access_token = getCookie("access_token");

// export default function AdminSchoolOverview() {
//   const [data, setData] = useState({});
//   const [lastSync, setLastSync] = useState("Loading...");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);


//   useEffect(() => {
//   const fetchSchoolOverview = async () => {
//     try {
//       const res = await fetch(`${API_URL}/admin/school-overview`, {
//         credentials:'include',
//         method: "GET",
//         headers: {
//       Authorization: `Bearer ${access_token}`
//     },
//       });

//       const result = await res.json();
//       if (result && result.totalBooks !== undefined) {
//   setData(result);
// } else {
//   toast.error("Failed to load school data.");
// }
//     } catch (error) {
      
//       toast.error("Error fetching school overview.");
//     }
//   };

//   fetchSchoolOverview();
// },[])

//   const handleSync = async () => {
//     setLastSync("🔄 Syncing data...");
//     setTimeout(() => {
//       setLastSync("Just now");
//       toast.success("✅ Synced successfully");
//     }, 1000);
//   };

//   const summaryCards = [
//     {
//       title: "Total Teachers",
//       icon: <FaUserTie />,
//       count: data.totalTeachers ?? 0,
//       color: "bg-orange-500",
//     },
//     {
//       title: "Total Students",
//       icon: <FaUsers />,
//       count: data.totalStudents ?? 0,
//       color: "bg-blue-500",
//     },
//     {
//       title: "Total Classes",
//       icon: <FaChalkboard />,
//       count: data.totalClasses ?? 0,
//       color: "bg-green-500",
//     },
//     {
//       title: "Total Books",
//       icon: <FaBook />,
//       count: data.totalBooks ?? 0,
//       color: "bg-yellow-500",
//     },
//   ];

//   return (
//      <div className="flex min-h-screen bg-darkBg text-primaryWhite">
//       {/* Sidebar */}
//       <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

//       {/* Main Content */}
//       <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
//         {/* Mobile Menu Icon */}
//         <div className="lg:hidden px-4 mb-4">
//           <button onClick={() => setIsSidebarOpen(true)} className="text-primaryWhite">
//             <FiMenu size={28} />
//           </button>
//         </div>

//         <AdminNavbar/>


//         <div className="p-4">
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold">School Overview</h1>
//             <p className="text-primaryWhite/70 text-sm mt-1">
//               Track your school’s usage and digital library sync.
//             </p>
//           </div>

//           <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
//             {summaryCards.map((item, index) => (
//               <div
//                 key={index}
//                 className={`p-5 rounded-xl shadow-lg flex items-center gap-4 cursor-pointer ${item.color}`}
//               >
//                 <div className="text-3xl">{item.icon}</div>
//                 <div>
//                   <h3 className="font-semibold text-lg">{item.title}</h3>
//                   <p className="text-primaryWhite/90">{item.count}</p>
//                 </div>
//               </div>
//             ))}
//           </section>

//           <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
//             <div className="bg-cardBg p-6 rounded-xl shadow-lg col-span-2">
//               <h2 className="text-xl font-semibold mb-4">Sync Status</h2>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="border border-gray600 rounded-lg p-4">
//                   <p className="text-primaryWhite/70 text-sm">Last Sync</p>
//                   <p className="text-lightGreen font-semibold">{lastSync}</p>
//                 </div>
//                 <div className="border border-gray600 rounded-lg p-4">
//                   <p className="text-primaryWhite/70 text-sm">Pending Uploads</p>
//                   <p className="text-lightYellow font-semibold">
//                     {data.pendingUploads ?? 0} files
//                   </p>
//                 </div>
//               </div>
//               <div className="mt-4 text-right">
//                 <button
//                   onClick={handleSync}
//                   className="flex items-center gap-2 bg-primaryBlue hover:bg-blue-700 px-4 py-2 rounded text-sm transition"
//                 >
//                   <FaSyncAlt /> Sync Now
//                 </button>
//               </div>
//             </div>

//             <div className="bg-cardBg p-6 rounded-xl shadow-lg">
//               <h2 className="text-xl font-semibold mb-4">School Info</h2>
//               <div className="space-y-3 text-primaryWhite/80 text-sm">
//                 <div className="flex items-center gap-2">
//                   <FaIdCard className="text-lg" />
//                   <span>School Code:</span>
//                   <span className="text-primaryWhite font-semibold ml-auto">
//                     {data.schoolCode || "SCH-1023"}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FaTabletAlt className="text-lg" />
//                   <span>Connected Devices:</span>
//                   <span className="text-primaryWhite font-semibold ml-auto">
//                     {data.connectedDevices ?? 0}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }








import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import {
  FaChalkboard,
  FaUsers,
  FaUserTie,
  FaBook,
  FaSyncAlt,
  FaIdCard,
  FaTabletAlt,
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { toast } from "react-toastify";
import { getCookie } from "../../utils/cookie";

// 📊 Recharts imports
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

const API_URL = import.meta.env.VITE_API_URL;
const access_token = getCookie("access_token");

export default function AdminSchoolOverview() {
  const [data, setData] = useState({});
  const [lastSync, setLastSync] = useState("Loading...");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🎯 Analytics Example Data (You can replace this with backend API)
  const COLORS = ["#3B82F6", "#06B6D4", "#34D399", "#FACC15", "#F87171"];

  const performance = [
    { month: "Jun", value: 280 },
    { month: "Jul", value: 390 },
    { month: "Aug", value: 420 },
    { month: "Sep", value: 480 },
    { month: "Oct", value: 550 },
    { month: "Nov", value: 610 },
  ];

  const subjectEngagement = [
    { name: "Math", value: 320 },
    { name: "Science", value: 280 },
    { name: "English", value: 250 },
    { name: "History", value: 180 },
    { name: "Geography", value: 150 },
  ];

  const activityStats = [
    { name: "Opened", value: 2400 },
    { name: "Completed", value: 1950 },
    { name: "Favorite", value: 730 },
  ];

  const studyTime = [
    { day: "Mon", time: 45 },
    { day: "Tue", time: 50 },
    { day: "Wed", time: 60 },
    { day: "Thu", time: 55 },
    { day: "Fri", time: 40 },
    { day: "Sat", time: 30 },
  ];

  const leaderboard = [
    { name: "Aarav Mehta", score: 99 },
    { name: "Ishita Nair", score: 97 },
    { name: "Kabir Singh", score: 96 },
    { name: "Rhea Kapoor", score: 95 },
  ];

  useEffect(() => {
    const fetchSchoolOverview = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/school-overview`, {
          credentials: "include",
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const result = await res.json();
        if (result && result.totalBooks !== undefined) {
          setData(result);
        } else {
          toast.error("Failed to load school data.");
        }
      } catch (error) {
        toast.error("Error fetching school overview.");
      }
    };

    fetchSchoolOverview();
  }, []);

  const handleSync = () => {
    setLastSync("🔄 Syncing data...");
    setTimeout(() => {
      setLastSync("Just now");
      toast.success("✅ Synced successfully");
    }, 1000);
  };

  const summaryCards = [
    {
      title: "Total Teachers",
      icon: <FaUserTie />,
      count: data.totalTeachers ?? 0,
      color: "bg-orange-500",
    },
    {
      title: "Total Students",
      icon: <FaUsers />,
      count: data.totalStudents ?? 0,
      color: "bg-blue-500",
    },
    {
      title: "Total Classes",
      icon: <FaChalkboard />,
      count: data.totalClasses ?? 0,
      color: "bg-green-500",
    },
    {
      title: "Total Books",
      icon: <FaBook />,
      count: data.totalBooks ?? 0,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="flex min-h-screen bg-darkBg text-primaryWhite">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
        {/* Mobile Menu */}
        <div className="lg:hidden px-4 mb-4">
          <button onClick={() => setIsSidebarOpen(true)} className="text-primaryWhite">
            <FiMenu size={28} />
          </button>
        </div>

        <AdminNavbar />

        <div className="p-4">
          {/* Header */}
          <h1 className="text-3xl font-bold mb-1">School Overview</h1>
          <p className="text-primaryWhite/70 mb-6">Track your school’s usage and digital performance.</p>

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
                  <p className="text-primaryWhite/70 text-sm">Pending Uploads</p>
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

            {/* School Information */}
            <div className="bg-cardBg p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4">School Info</h2>

              <div className="space-y-3 text-primaryWhite/80 text-sm">
                <div className="flex items-center gap-2">
                  <FaIdCard className="text-lg" />
                  <span>School Code:</span>
                  <span className="ml-auto font-bold">{data.schoolCode ?? "SCH-1023"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaTabletAlt className="text-lg" />
                  <span>Connected Devices:</span>
                  <span className="ml-auto font-bold">{data.connectedDevices ?? 0}</span>
                </div>
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
              <h3 className="text-lg font-semibold mb-3">Overall Performance</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={performance}>
                  <defs>
                    <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="url(#perfGradient)" />
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
                  <Line type="monotone" dataKey="time" stroke="#FACC15" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Leaderboard */}
            <div className="bg-cardBg p-5 rounded-2xl shadow md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Top Performing Students</h3>
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-gray300 text-sm">
                    <th>Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((s, i) => (
                    <tr key={i} className="bg-[#1f2231] hover:bg-[#3a3e5a] transition">
                      <td className="py-2 px-3">{s.name}</td>
                      <td className="py-2 px-3 text-sky-400 font-semibold">{s.score}%</td>
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
