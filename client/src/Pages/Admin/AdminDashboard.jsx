import Sidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import WelcomeHeading from "../../Components/WelcomeHeading";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { getCookie } from "../../utils/cookie";

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
  const API_URL = import.meta.env.VITE_API_URL;
  const access_token = getCookie("access_token");

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
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("credentialFile", file);

    try {
      const res = await fetch(`${API_URL}/admin/upload-credentials`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const result = await res.json();
      alert("File uploaded successfully!");
      setShowUploadModal(false);
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed!");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <Sidebar />

      <main className="pl-[280px] py-6 pr-5 w-full">
        <AdminNavbar onUpload={() => setShowUploadModal(true)}notificationsCount={concerns.length}  />

        <div className="p-2 mb-5">
          <WelcomeHeading />
        </div>

        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white text-black p-6 rounded w-full max-w-md shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Upload Your Files</h3>
              <form onSubmit={handleFileUpload}>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full mb-4 text-sm px-4 py-1 rounded-md border border-gray-400 text-gray-700 file:border file:border-gray-700 file:px-3 file:py-1 file:rounded"
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
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded"
                  >
                    ✅ Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Overview Cards */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                type: "Books",
                count: stats.totalBooks,
                size: "16GB",
                color: "orange-500",
              },
              {
                type: "PDF",
                count: stats.totalPdf,
                size: "8GB",
                color: "blue-500",
              },
              {
                type: "Audios",
                count: stats.totalAudio,
                size: "0GB",
                color: "green-500",
              },
              {
                type: "Videos",
                count: stats.totalVideos,
                size: "1GB",
                color: "yellow-500",
              },
            ].map((item, index) => (
              <div key={index} className={`bg-[#2a2b39] p-4 rounded`}>
                <p className={`text-${item.color} font-bold`}>{item.type}</p>
                <p className="text-sm text-gray-400">{item.count} items</p>
                <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
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
            <div className="bg-[#2a2b39] p-4 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">Total Students</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={[
                      {
                        name: "Students",
                        value: stats.totalStudents,
                        color: "#3b82f6",
                      },
                    ]}
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

            <div className="bg-[#2a2b39] p-4 rounded shadow">
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
      </main>
    </div>
  );
}

// import Sidebar from "./AdminSidebar";
// import AdminNavbar from "./AdminNavbar";
// import WelcomeHeading from "../../Components/WelcomeHeading";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   LineChart,
//   Line,
// } from "recharts";
// import { useState, useEffect } from "react";

// export default function LibraryDashboard() {
//   const [stats, setStats] = useState({
//     totalBooks: 120,
//     totalPdf: 90,
//     totalVideos: 45,
//     totalAudio: 25,
//     totalStudents: 200,
//     activeUsers: 150,
//   });

//   // Subject-wise resources
//   const subjectWise = [
//     { subject: "Mathematics", count: 35 },
//     { subject: "Science", count: 40 },
//     { subject: "English", count: 30 },
//     { subject: "Geography", count: 20 },
//     { subject: "History", count: 15 },
//   ];

//   // Resource access trend
//   const usageTrend = [
//     { day: "Mon", users: 50 },
//     { day: "Tue", users: 65 },
//     { day: "Wed", users: 40 },
//     { day: "Thu", users: 70 },
//     { day: "Fri", users: 90 },
//     { day: "Sat", users: 55 },
//     { day: "Sun", users: 30 },
//   ];

//   // Resource type usage
//   const resourceUsage = [
//     { name: "PDFs", value: 45 },
//     { name: "Videos", value: 30 },
//     { name: "Audios", value: 15 },
//     { name: "Books", value: 60 },
//   ];

//   const COLORS = ["#3b82f6", "#f97316", "#22c55e", "#eab308"];

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       <Sidebar />
//       <main className="pl-[280px] py-6 pr-5 w-full">
//         <AdminNavbar />
//         <div className="p-2 mb-5">
//           <WelcomeHeading />
//         </div>

//         {/* Quick Stats */}
//         <section className="mb-8">
//           <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {[
//               { label: "Books", value: stats.totalBooks, color: "orange-500" },
//               { label: "PDFs", value: stats.totalPdf, color: "blue-500" },
//               { label: "Videos", value: stats.totalVideos, color: "yellow-500" },
//               { label: "Audios", value: stats.totalAudio, color: "green-500" },
//               { label: "Students", value: stats.totalStudents, color: "purple-500" },
//               { label: "Active Users", value: stats.activeUsers, color: "teal-400" },
//             ].map((item, idx) => (
//               <div key={idx} className="bg-[#2a2b39] p-4 rounded shadow">
//                 <p className={`text-${item.color} font-bold`}>{item.label}</p>
//                 <p className="text-xl">{item.value}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Analytics */}
//         <section>
//           <h2 className="text-lg font-semibold mb-4">Analytics</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//             {/* Subject Wise Resources */}
//             <div className="bg-[#2a2b39] p-4 rounded shadow">
//               <h3 className="mb-4 font-medium">Subject-wise Resources</h3>
//               <ResponsiveContainer width="100%" height={250}>
//                 <BarChart data={subjectWise}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="subject" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Active Users Trend */}
//             <div className="bg-[#2a2b39] p-4 rounded shadow">
//               <h3 className="mb-4 font-medium">Active Users (Weekly)</h3>
//               <ResponsiveContainer width="100%" height={250}>
//                 <LineChart data={usageTrend}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="day" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={2} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Resource Type Usage */}
//             <div className="bg-[#2a2b39] p-4 rounded shadow col-span-2">
//               <h3 className="mb-4 font-medium">Resource Usage by Type</h3>
//               <ResponsiveContainer width="100%" height={250}>
//                 <PieChart>
//                   <Pie
//                     data={resourceUsage}
//                     dataKey="value"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={90}
//                     label
//                   >
//                     {resourceUsage.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }





// import AdminSidebar from "./AdminSidebar";
// import AdminNavbar from "./AdminNavbar";
// import WelcomeHeading from "../../Components/WelcomeHeading";
// import { FiMenu } from "react-icons/fi";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { useEffect, useState } from "react";
// import { getCookie } from "../../utils/cookie";

// export default function FileManagerDashboard() {
//   const [stats, setStats] = useState({
//     totalBooks: 0,
//     totalPdf: 0,
//     totalVideos: 0,
//     totalAudio: 0,
//     totalStudents: 0,
//   });

//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [file, setFile] = useState(null);

//   const [concerns, setConcerns] = useState([]); 
//   const API_URL = import.meta.env.VITE_API_URL;
//   const access_token = getCookie("access_token");

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await fetch(`${API_URL}/admin/stats`, {
//           credentials: "include",
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${access_token}`,
//           },
//         });
//         const data = await res.json();
//         setStats(data);
//       } catch (err) {
//         console.error("Error fetching stats:", err);
//       }
//     };

//     fetchStats();
//   }, []);
//   useEffect(() => {
//     const fetchConcerns = async () => {
//       try {
//         const res = await fetch(`${API_URL}/admin/concerns`, {
//           credentials: "include",
//           headers: {
//             Authorization: `Bearer ${access_token}`,
//           },
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setConcerns(data);
//         }
//       } catch (err) {
//         console.error("Error fetching concerns:", err);
//       }
//     };

//     fetchConcerns();
//   }, []);

//   const handleFileUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select a file");

//     const formData = new FormData();
//     formData.append("credentialFile", file);

//     try {
//       const res = await fetch(`${API_URL}/admin/upload-credentials`, {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });

//       const result = await res.json();
//       alert("File uploaded successfully!");
//       setShowUploadModal(false);
//       setFile(null);
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("Upload failed!");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//   {/* Sidebar */}
//   <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

//   {/* Main Content */}
//   <main className="flex-1 lg:pl-[280px] py-6 px-4 sm:px-6 md:px-8 w-full">
//     {/* Mobile Menu Icon */}
//     <div className="lg:hidden px-4 mb-4">
//       <button onClick={() => setIsSidebarOpen(true)} className="text-white">
//         <FiMenu size={28} />
//       </button>
//     </div>

//     <AdminNavbar onUpload={() => setShowUploadModal(true)} notificationsCount={concerns.length} />

//     <div className="p-2 mb-5">
//       <WelcomeHeading />
//     </div>

//         {showUploadModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//             <div className="bg-white text-black p-6 rounded w-full max-w-md shadow-lg">
//               <h3 className="text-xl font-semibold mb-4">Upload Your Files</h3>
//               <form onSubmit={handleFileUpload}>
//                 <input
//                   type="file"
//                   onChange={(e) => setFile(e.target.files[0])}
//                   className="w-full mb-4 text-sm px-4 py-1 rounded-md border border-gray-400 text-gray-700 file:border file:border-gray-700 file:px-3 file:py-1 file:rounded"
//                 />
//                 <div className="flex justify-end gap-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowUploadModal(false)}
//                     className="border border-black px-4 py-2 rounded"
//                   >
//                     ❌ Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded"
//                   >
//                     ✅ Upload
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Overview Cards */}
//         <section className="mb-8">
//           <h2 className="text-lg font-semibold mb-4">Overview</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               {
//                 type: "Books",
//                 count: stats.totalBooks,
//                 size: "16GB",
//                 color: "orange-500",
//               },
//               {
//                 type: "PDF",
//                 count: stats.totalPdf,
//                 size: "8GB",
//                 color: "blue-500",
//               },
//               {
//                 type: "Audios",
//                 count: stats.totalAudio,
//                 size: "0GB",
//                 color: "green-500",
//               },
//               {
//                 type: "Videos",
//                 count: stats.totalVideos,
//                 size: "1GB",
//                 color: "yellow-500",
//               },
//             ].map((item, index) => (
//               <div key={index} className={`bg-[#2a2b39] p-4 rounded`}>
//                 <p className={`text-${item.color} font-bold`}>{item.type}</p>
//                 <p className="text-sm text-gray-400">{item.count} items</p>
//                 <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
//                   <div
//                     className={`h-2 bg-${item.color} rounded-full`}
//                     style={{
//                       width:
//                         item.size === "1GB"
//                           ? "10%"
//                           : item.size === "8GB"
//                           ? "30%"
//                           : "70%",
//                     }}
//                   ></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Pie Charts */}
//         <section>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-[#2a2b39] p-4 rounded shadow">
//               <h2 className="text-lg font-semibold mb-4">Total Students</h2>
//               <ResponsiveContainer width="100%" height={250}>
//                 <PieChart>
//                   <Pie
//                     dataKey="value"
//                     data={[
//                       {
//                         name: "Students",
//                         value: stats.totalStudents,
//                         color: "#3b82f6",
//                       },
//                     ]}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                     label
//                   >
//                     <Cell fill="#3b82f6" />
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="bg-[#2a2b39] p-4 rounded shadow">
//               <h2 className="text-lg font-semibold mb-4">Total Books</h2>
//               <ResponsiveContainer width="100%" height={250}>
//                 <PieChart>
//                   <Pie
//                     dataKey="value"
//                     data={[{ name: "Books", value: stats.totalBooks }]}
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                     label
//                   >
//                     <Cell fill="#f97316" />
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }
