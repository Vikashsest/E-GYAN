// // import { useState } from "react";
// // import TeacherSidebar from "./TeacherSidebar";
// // import TeacherNavbar from "./TeacherNavbar";
// // import { FaUserGraduate, FaChalkboardTeacher, FaBook } from "react-icons/fa";
// // import WelcomeHeading from "../../Components/WelcomeHeading";
// // import {
// //   LineChart,
// //   Line,
// //   CartesianGrid,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// // } from "recharts";

// // // Sample monthly upload data by subject
// // const recentUploads = [
// //   { month: "Jan", subject: "Mathematics", uploads: 2 },
// //   { month: "Feb", subject: "Mathematics", uploads: 3 },
// //   { month: "Mar", subject: "Mathematics", uploads: 4 },
// //   { month: "Apr", subject: "Science", uploads: 1 },
// //   { month: "May", subject: "Science", uploads: 3 },
// //   { month: "Jun", subject: "English", uploads: 2 },
// //   { month: "Jul", subject: "History", uploads: 1 },
// //   { month: "Aug", subject: "Mathematics", uploads: 5 },
// //   { month: "Sep", subject: "Science", uploads: 4 },
// //   { month: "Oct", subject: "English", uploads: 3 },
// //   { month: "Nov", subject: "History", uploads: 2 },
// //   { month: "Dec", subject: "Mathematics", uploads: 3 },
// // ];

// // export default function TeacherDashboard() {
// //   const [overview] = useState({
// //     totalStudents: 40,
// //     totalSubjects: 4,
// //     myUploadedBooks: 12,
// //     completedReviews: 9,
// //     pendingReviews: 3,
// //   });

// //   const [selectedSubject, setSelectedSubject] = useState("all");

// //   const allSubjects = [
// //     ...new Set(recentUploads.map((entry) => entry.subject)),
// //   ];

// //   const chartData =
// //     selectedSubject === "all"
// //       ? mergeUploadsByMonth(recentUploads)
// //       : recentUploads
// //           .filter((entry) => entry.subject === selectedSubject)
// //           .map((entry) => ({
// //             name: entry.month,
// //             uploads: entry.uploads,
// //           }));

// //   const [recentUploads] = useState([
// //     "Algebra Basics – Class 6",
// //     "Photosynthesis Chapter – Class 7",
// //     "English Grammar - Verbs",
// //     "History of India – Ancient",
// //     "Decimals Explained – Class 6",
// //   ]);

// //   return (
// //     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
// //       <TeacherSidebar />
// //       <main className="flex-1 pl-[280px] pr-5 py-6">
// //         <TeacherNavbar />
// //         <div className="p-4">
// //           <WelcomeHeading />
// //         </div>

// //         {/* Overview Cards */}
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
// //           <OverviewCard
// //             title="Total Students"
// //             icon={<FaUserGraduate size={24} />}
// //             value={overview.totalStudents}
// //             bg="bg-blue-500"
// //             text="text-blue-300"
// //           />
// //           <OverviewCard
// //             title="Total Subjects"
// //             icon={<FaChalkboardTeacher size={24} />}
// //             value={overview.totalSubjects}
// //             bg="bg-green-500"
// //             text="text-green-300"
// //           />
// //           <OverviewCard
// //             title="My Upload Books"
// //             icon={<FaBook size={24} />}
// //             value={overview.myUploadedBooks}
// //             bg="bg-orange-500"
// //             text="text-orange-300"
// //           />
// //           <OverviewCard
// //             title="Total Books"
// //             icon={<FaBook size={24} />}
// //             value={overview.myUploadedBooks}
// //             bg="bg-yellow-500"
// //             text="text-yellow-300"
// //           />
// //         </div>

// //         {/* Recent Uploads + Chart */}
// //         <div className="grid grid-cols-1 gap-6 px-6 pb-6">
// //           {/* Monthly Uploads Line Chart with Subject Filter */}
// //           <div className="bg-[#2a2b3c] rounded-2xl p-6 shadow-md">
// //             <div className="mb-10 flex justify-between">
// //             <h3 className="text-lg font-bold mb-4 text-white">
// //               📈 Monthly Uploads by Subject
// //             </h3>

// //               <div className="w-full sm:w-64">
// //                 <label
// //                   htmlFor="subjectFilter"
// //                   className="block text-sm font-medium mb-1 text-white"
// //                 >
// //                 </label>
// //                 <select
// //                   id="subjectFilter"
// //                   value={selectedSubject}
// //                   onChange={(e) => setSelectedSubject(e.target.value)}
// //                   className="w-full px-3 py-2 rounded-md bg-[#1e1f2b] border border-gray-500 text-white focus:outline-none"
// //                 >
// //                   <option value="all">All Subjects</option>
// //                   {allSubjects.map((subject, index) => (
// //                     <option key={index} value={subject}>
// //                       {subject}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>
// //             </div>

// //             {/* Line Chart */}
// //             <ResponsiveContainer width="100%" height={300}>
// //               <LineChart data={chartData}>
// //                 <CartesianGrid stroke="#555" strokeDasharray="5 5" />
// //                 <XAxis dataKey="name" stroke="#ccc" />
// //                 <YAxis stroke="#ccc" />
// //                 <Tooltip />
// //                 <Legend />
// //                 <Line
// //                   type="monotone"
// //                   dataKey="uploads"
// //                   stroke="#82ca9d"
// //                   strokeWidth={2}
// //                   dot={{ r: 4 }}
// //                 />
// //               </LineChart>
// //             </ResponsiveContainer>
// //           </div>
// //         </div>

// //         {/* Recent Uploads */}
// //         <div className="bg-[#2a2b3c] rounded-2xl p-6 shadow-md">
// //           <h3 className="text-lg font-bold mb-4 text-white">
// //             📘 Recent Uploads
// //           </h3>
// //           <ul className="space-y-3">
// //             {recentUploads.map((item, idx) => (
// //               <li
// //                 key={idx}
// //                 className="border-b border-gray-600 pb-2 text-sm text-gray-300"
// //               >
// //                 ✅ {item}
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// // function mergeUploadsByMonth(data) {
// //   const monthMap = {};

// //   data.forEach((item) => {
// //     if (!monthMap[item.month]) {
// //       monthMap[item.month] = { name: item.month, uploads: 0 };
// //     }
// //     monthMap[item.month].uploads += item.uploads;
// //   });

// //   return Object.values(monthMap);
// // }

// // function OverviewCard({ icon, title, value, bg, text }) {
// //   return (
// //     <div
// //       className={`rounded-2xl p-5 shadow-sm ${bg} flex items-center justify-start gap-4 min-h-[100px]`}
// //     >
// //       <div
// //         className={`w-12 h-12 flex items-center justify-center rounded-full bg-[#1e1f2b] shadow-inner ${text}`}
// //       >
// //         {icon}
// //       </div>
// //       <div className="flex flex-col justify-center">
// //         <h2 className="text-sm font-medium text-gray-200">{title}</h2>
// //         <p className={`text-2xl font-bold ${text}`}>{value}</p>
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import TeacherSidebar from "./TeacherSidebar";
// import TeacherNavbar from "./TeacherNavbar";
// import { FaUserGraduate, FaChalkboardTeacher, FaBook } from "react-icons/fa";
// import WelcomeHeading from "../../Components/WelcomeHeading";
// import {
//   LineChart,
//   Line,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { toast } from "react-toastify";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function TeacherDashboard() {
//   const [overview, setOverview] = useState({
//     totalStudents: 0,
//     totalSubjects: 0,
//     teacherUploadBooks: 0,
//     totalBooks: 0,
//   });

//   const [selectedSubject, setSelectedSubject] = useState("all");
//   const [subjectWiseUploads, setSubjectWiseUploads] = useState({});
//   const [recentUploads, setRecentUploads] = useState([]);

//   const fetchDashboardStats = async () => {
//     try {
//       const res = await fetch(`${API_URL}/dashboard/teacher`, {
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to fetch dashboard stats");

//       const data = await res.json();
//       console.log("Dashboard data:", data);

//       setOverview(data);

//       // ✅ Subject-wise uploads for chart
//       setSubjectWiseUploads(data.subjectWiseUploads || {});

//       // ✅ Flatten all uploads for recent uploads display
//       const allUploads = Object.values(data.subjectWiseUploads || {}).flat();
//       setRecentUploads(allUploads);

//       // ✅ Set first subject by default
//       const subjects = Object.keys(data.subjectWiseUploads || {});
//       if (subjects.length > 0) {
//         setSelectedSubject(subjects[0]);
//       }

//       toast.success("📊 Dashboard loaded");
//     } catch (err) {
//       console.error("Error fetching dashboard stats:", err);
//       toast.error("❌ Failed to load dashboard");
//     }
//   };

//   const fetchRecentUploads = async () => {
//   try {
//     const res = await fetch(`${API_URL}/dashboard/recent-upload`, {
//       credentials: "include",
//     });
//     if (!res.ok) throw new Error("Failed to fetch recent uploads");

//     const data = await res.json();
//     console.log("Recent Uploads Response:", data);
//     const uploads = Array.isArray(data) ? data : data.uploads || [];

//     setRecentUploads(uploads);
//     toast.success("📘 Recent uploads loaded");
//   } catch (err) {
//     console.error(err);
//     toast.error("❌ Failed to load recent uploads");
//   }
// };

//   useEffect(() => {
//     fetchDashboardStats();
//     fetchRecentUploads();
//   }, []);

//   const allSubjects = Object.keys(subjectWiseUploads);

//   function mergeUploadsByMonth(data) {
//     if (!Array.isArray(data)) return [];

//     const monthMap = {};

//     data.forEach((item) => {
//       if (!monthMap[item.month]) {
//         monthMap[item.month] = { name: item.month, uploads: 0 };
//       }
//       monthMap[item.month].uploads += item.uploads;
//     });

//     return Object.values(monthMap);
//   }

//   const chartData =
//     selectedSubject === "all"
//       ? mergeUploadsByMonth(
//           Object.values(subjectWiseUploads).flat()
//         )
//       : mergeUploadsByMonth(subjectWiseUploads[selectedSubject] || []);

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       <TeacherSidebar />
//       <main className="flex-1 pl-[280px] pr-5 py-6">
//         <TeacherNavbar />
//         <div className="p-4">
//           <WelcomeHeading />
//         </div>

//         {/* Overview Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
//           <OverviewCard
//             title="Total Students"
//             icon={<FaUserGraduate size={24} />}
//             value={overview.totalStudents}
//             bg="bg-blue-500"
//             text="text-blue-300"
//           />
//           <OverviewCard
//             title="Total Subjects"
//             icon={<FaChalkboardTeacher size={24} />}
//             value={overview.totalSubjects}
//             bg="bg-green-500"
//             text="text-green-300"
//           />
//           <OverviewCard
//             title="My Upload Books"
//             icon={<FaBook size={24} />}
//             value={overview.teacherUploadBooks}
//             bg="bg-orange-500"
//             text="text-orange-300"
//           />
//           <OverviewCard
//             title="Total Books"
//             icon={<FaBook size={24} />}
//             value={overview.totalBooks}
//             bg="bg-yellow-500"
//             text="text-yellow-300"
//           />
//         </div>

//         {/* Monthly Uploads Chart */}
//         <div className="grid grid-cols-1 gap-6 px-6 pb-6">
//           <div className="bg-[#2a2b3c] rounded-2xl p-6 shadow-md">
//             <div className="mb-10 flex justify-between">
//               <h3 className="text-lg font-bold text-white">
//                 📈 Monthly Uploads by Subject
//               </h3>
//               <div className="w-full sm:w-64">
//                 <select
//                   id="subjectFilter"
//                   value={selectedSubject}
//                   onChange={(e) => setSelectedSubject(e.target.value)}
//                   className="w-full px-3 py-2 rounded-md bg-[#1e1f2b] border border-gray-500 text-white focus:outline-none"
//                 >
//                   <option value="all">All Subjects</option>
//                   {allSubjects.map((subject, index) => (
//                     <option key={index} value={subject}>
//                       {subject}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={chartData}>
//                 <CartesianGrid stroke="#555" strokeDasharray="5 5" />
//                 <XAxis dataKey="name" stroke="#ccc" />
//                 <YAxis stroke="#ccc" />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="uploads"
//                   stroke="#82ca9d"
//                   strokeWidth={2}
//                   dot={{ r: 4 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Recent Uploads */}
//         <div className="bg-[#2a2b3c] rounded-2xl p-6 shadow-md">
//           <h3 className="text-lg font-bold mb-4 text-white">📘 Recent Uploads</h3>
//           <ul className="space-y-3">
//             {recentUploads.map((item, idx) => (
//               <li
//                 key={idx}
//                 className="border-b border-gray-600 pb-2 text-sm text-gray-300"
//               >
//                 ✅ {item.title || item.name || JSON.stringify(item)}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </main>
//     </div>
//   );
// }

// // Overview Card Component
// function OverviewCard({ icon, title, value, bg, text }) {
//   return (
//     <div
//       className={`rounded-2xl p-5 shadow-sm ${bg} flex items-center justify-start gap-4 min-h-[100px]`}
//     >
//       <div
//         className={`w-12 h-12 flex items-center justify-center rounded-full bg-[#1e1f2b] shadow-inner ${text}`}
//       >
//         {icon}
//       </div>
//       <div className="flex flex-col justify-center">
//         <h2 className="text-sm font-medium text-gray-200">{title}</h2>
//         <p className={`text-2xl font-bold ${text}`}>{value}</p>
//       </div>
//     </div>
//   );
// }

// TeacherDashboard.jsx

// import { useEffect, useState } from "react";
// import TeacherSidebar from "./TeacherSidebar";
// import TeacherNavbar from "./TeacherNavbar";
// import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaClipboardList, FaQuestionCircle } from "react-icons/fa";
// import WelcomeHeading from "../../Components/WelcomeHeading";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function TeacherDashboard() {
//   const [overview, setOverview] = useState({
//     totalStudents: 0,
//     totalSubjects: 0,
//     teacherUploadBooks: 0,
//     totalBooks: 0,
//   });

//   const [recentUploads, setRecentUploads] = useState([]);

//   // ----------------- API FETCH FUNCTIONS -----------------
//   const fetchDashboardStats = async () => {
//     try {
//       const res = await fetch(`${API_URL}/dashboard/teacher`, {
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to fetch dashboard stats");

//       const data = await res.json();
//       setOverview({
//         totalStudents: data.totalStudents || 0,
//         totalSubjects: data.totalSubjects || 0,
//         teacherUploadBooks: data.teacherUploadBooks || 0,
//         totalBooks: data.totalBooks || 0,
//       });
//       const allUploads = Object.values(data.subjectWiseUploads || {}).flat();
//       setRecentUploads(allUploads);

//       toast.success("📊 Dashboard loaded");
//     } catch (err) {
//       console.error("Error fetching dashboard stats:", err);
//       toast.error("❌ Failed to load dashboard");
//     }
//   };

//   const fetchRecentUploads = async () => {
//     try {
//       const res = await fetch(`${API_URL}/dashboard/recent-upload`, {
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to fetch recent uploads");

//       const data = await res.json();
//       const uploads = Array.isArray(data) ? data : data.uploads || [];
//       setRecentUploads(uploads);
//       toast.success("📘 Recent uploads loaded");
//     } catch (err) {
//       console.error("Error fetching recent uploads:", err);
//       toast.error("❌ Failed to load recent uploads");
//     }
//   };

//   useEffect(() => {
//     fetchDashboardStats();
//     fetchRecentUploads();
//   }, []);

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       <TeacherSidebar />
//       <main className="flex-1 pl-[280px] pr-5 py-6">
//         <TeacherNavbar />
//         <div className="p-4">
//           <WelcomeHeading />
//         </div>

//         {/* Overview Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
//           <OverviewCard title="Total Students" icon={<FaUserGraduate />} value={overview.totalStudents} bg="bg-blue-500" />
//           <OverviewCard title="Total Subjects" icon={<FaChalkboardTeacher />} value={overview.totalSubjects} bg="bg-green-500" />
//           <OverviewCard title="My Upload Books" icon={<FaBook />} value={overview.teacherUploadBooks} bg="bg-orange-500" />
//           <OverviewCard title="Total Books" icon={<FaBook />} value={overview.totalBooks} bg="bg-yellow-500" />
//         </div>

//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
//           <Card
//             title="📋 Assessment"
//             description="Create and assign new Assessment to your students."
//             icon={<FaClipboardList size={36} />}
//             link="/teacher/assignment"
//             bg="bg-gradient-to-br from-blue-600 to-blue-800"
//           />
//           <Card
//             title="❓ Quizzes"
//             description="Design quizzes to test your students' knowledge."
//             icon={<FaQuestionCircle size={36} />}
//             link="/teacher/quiz"
//             bg="bg-gradient-to-br from-purple-600 to-purple-800"
//           />
//         </div>

//  <div className="p-6 screen rounded-2xl shadow-lg bg-gradient-to-br from-green-600 to-green-800 flex flex-col gap-4 hover:scale-105 transition-transform duration-300">
//     <div className="flex items-center gap-4">
//       <FaBook size={36} />
//       <h3 className="text-xl font-bold">📑 Upload Question Bank</h3>
//     </div>
//     <p className="text-gray-200">Upload your question bank in PDF or Excel format.</p>
//     <input
//       type="file"
//       accept=".pdf,.xls,.xlsx"
//       className="mt-3 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
//         file:rounded-lg file:border-0
//         file:text-sm file:font-semibold
//         file:bg-white file:text-black
//         hover:file:bg-gray-200"
//       onChange={(e) => {
//         if (e.target.files.length > 0) {
//           toast.success(`📂 ${e.target.files[0].name} selected`);
//         }
//       }}
//     />
//     <button className="mt-4 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition">
//       Upload
//     </button>
//   </div>
//         {/* Recent Uploads */}
//         {/* <div className="bg-[#2a2b3c] rounded-2xl p-6 shadow-md mt-6">
//           <h3 className="text-lg font-bold mb-4 text-white">📘 Recent Uploads</h3>
//           <ul className="space-y-3">
//             {recentUploads.length > 0 ? (
//               recentUploads.map((item, idx) => (
//                 <li key={idx} className="border-b border-gray-600 pb-2 text-sm text-gray-300">
//                   ✅ {item.title || item.name || JSON.stringify(item)}
//                 </li>
//               ))
//             ) : (
//               <li className="text-gray-400">No recent uploads</li>
//             )}
//           </ul>
//         </div> */}
//       </main>
//     </div>
//   );
// }

// // Overview Card Component
// function OverviewCard({ icon, title, value, bg }) {
//   return (
//     <div className={`rounded-2xl p-5 shadow-sm ${bg} flex items-center justify-start gap-4 min-h-[100px]`}>
//       <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1e1f2b] shadow-inner text-white">
//         {icon}
//       </div>
//       <div className="flex flex-col justify-center">
//         <h2 className="text-sm font-medium text-gray-200">{title}</h2>
//         <p className="text-2xl font-bold text-white">{value}</p>
//       </div>
//     </div>
//   );
// }

// // Card Component for Assignments & Quizzes
// function Card({ title, description, icon, link, bg }) {
//   return (
//     <Link to={link}>
//       <div className={`p-6 rounded-2xl shadow-lg flex flex-col justify-between gap-4 hover:scale-105 transition-transform duration-300 ${bg}`}>
//         <div className="flex items-center gap-4">{icon}</div>
//         <div>
//           <h3 className="text-xl font-bold">{title}</h3>
//           <p className="text-gray-200 mt-2">{description}</p>
//         </div>
//         <button className="mt-4 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition">
//           Start
//         </button>
//       </div>
//     </Link>
//   );
// }

import { useEffect, useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import TeacherNavbar from "./TeacherNavbar";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaClipboardList,
} from "react-icons/fa";
import { FaPoll, FaTasks, FaFileSignature } from "react-icons/fa";
import { MdOutlineQuiz, MdOutlineSummarize } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import WelcomeHeading from "../../Components/WelcomeHeading";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default function TeacherDashboard() {
  const [overview, setOverview] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    teacherUploadBooks: 0,
    totalBooks: 0,
  });

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/teacher`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch stats");

      const data = await res.json();
      setOverview(data);
    } catch (err) {
      toast.error("❌ Failed to load dashboard", err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <TeacherSidebar />
      <main className="flex-1 pl-[280px] pr-5 py-6">
        <TeacherNavbar />
        <WelcomeHeading />

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          <OverviewCard
            title="Total Students"
            icon={<FaUserGraduate />}
            value={overview.totalStudents}
            bg="bg-blue-500"
          />
          <OverviewCard
            title="Total Subjects"
            icon={<FaChalkboardTeacher />}
            value={overview.totalSubjects}
            bg="bg-green-500"
          />
          <OverviewCard
            title="My Upload Books"
            icon={<FaBook />}
            value={overview.teacherUploadBooks}
            bg="bg-orange-500"
          />
          <OverviewCard
            title="Total Books"
            icon={<FaBook />}
            value={overview.totalBooks}
            bg="bg-yellow-500"
          />
        </div>

        {/* 🔥 Action Section */}
        <div className="text-center mt-6">
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-10 py-4 rounded-full inline-block text-2xl font-bold shadow-lg">
            WHAT DO YOU WANT TO DO?
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
            <ActionCard
              icon={<MdOutlineQuiz size={30} />}
              title="Assign Test"
              path="/teacher/form/assign-test"
            />
            <ActionCard
              icon={<MdOutlineSummarize size={30} />}
              title="Summarize Report"
              path="/teacher/form/summarize-report"
            />
            <ActionCard
              icon={<FaClipboardList size={28} />}
              title="Create Quiz"
              path="/teacher/form/create-quiz"
            />
            {/* <ActionCard icon={<FaClipboardList size={28} />} title="Schedule Class" path="/teacher/form/schedule-class" /> */}
            <ActionCard
              icon={<FaFileSignature size={28} />}
              title="Create Notice"
              path="/teacher/form/notice"
            />
            <ActionCard
              icon={<FaTasks size={28} />}
              title="Manage Homework"
              path="/teacher/form/homework"
            />
            <ActionCard
              icon={<FaPoll size={28} />}
              title="Create Poll"
              path="/teacher/form/poll"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function OverviewCard({ icon, title, value, bg }) {
  return (
    <div className={`rounded-2xl p-5 shadow-sm ${bg} flex items-center gap-4`}>
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white text-lg">
        {icon}
      </div>
      <div>
        <h2 className="text-sm text-gray-200">{title}</h2>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

// Action Card Component
function ActionCard({ icon, title, path }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="bg-[#0f1020] hover:bg-[#26273c] transition-all duration-200 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-3 cursor-pointer border border-transparent hover:border-purple-500"
    >
      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-purple-600 shadow-md">
        {icon}
      </div>
      <h4 className="text-lg font-semibold">{title}</h4>
    </div>
  );
}
