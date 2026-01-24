// import { useEffect, useState } from "react";
// import {
//   FaClock,
//   FaBookOpen,
//   FaCheckCircle,
//   FaHeart,
//   FaBullhorn,
// } from "react-icons/fa";
// import { FiMenu } from "react-icons/fi";
// import { toast } from "react-toastify";
// import { getCookie } from "../../utils/cookie";
// import StudentNavbar from "./StudentNavbar";
// import StudentSidebar from "./StudentSidebar";
// import WelcomeHeading from "../../Components/WelcomeHeading";
// import { useNavigate } from "react-router-dom";
// const API_URL = import.meta.env.VITE_API_URL;
// const access_token = getCookie("access_token");

// function formatTime(seconds) {
//   const h = Math.floor(seconds / 3600);
//   const m = Math.floor((seconds % 3600) / 60);
//   return `${h}h ${m}m`;
// }

// export default function DashboardMetrics() {
//   const [metrics, setMetrics] = useState({
//     timeSpent: "0h 0m",
//     booksCompleted: 0,
//     recentActivity: 0,
//     favorites: 0,
//   });
//  const navigate = useNavigate();
//   const [announcements, setAnnouncements] = useState([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   useEffect(() => {
//     async function fetchMetrics() {
//       try {
//         const res = await fetch(`${API_URL}/students/metrices`, {
//           method: "GET",
//           credentials: "include",
//         });

//         if (!res.ok) throw new Error("Failed to fetch metrics");

//         const data = await res.json();

//         setMetrics({
//           timeSpent: formatTime(data.totalTimeSpent || 0),
//           booksCompleted: data.booksCompleted || 0,
//           recentActivity: data.recentActivityCount || 0,
//           favorites: data.favoriteBooksCount || 0,
//         });
//       } catch (error) {
//         toast.error("❌ Failed to load metrics");
//         console.error(error);
//       }
//     }

//     async function fetchAnnouncements() {
//       try {
//         const res = await fetch(`${API_URL}/students/announcements`, {
//           method: "GET",
//           credentials: "include",
//         });

//         if (!res.ok) throw new Error("Failed to fetch announcements");

//         const data = await res.json();
//         setAnnouncements(data);
//       } catch (error) {
//         toast.error("❌ Failed to load announcements");
//         console.error(error);
//       }
//     }

//     fetchMetrics();
//     fetchAnnouncements();
//   }, []);

//   const icons = {
//     timeSpent: <FaClock className="text-primaryOrange text-3xl" />,
//     booksCompleted: <FaCheckCircle className="text-primaryBlue text-3xl" />,
//     recentActivity: <FaBookOpen className="text-primaryGreen text-3xl" />,
//     favorites: <FaHeart className="text-primaryYellow text-3xl" />,
//   };

//   const items = [
//     { title: "Total Time Spent", icon: icons.timeSpent, count: metrics.timeSpent },
//     { title: "Books Completed", icon: icons.booksCompleted, count: metrics.booksCompleted },
//     { title: "Recent Activity", icon: icons.recentActivity, count: metrics.recentActivity },
//     { title: "Favorites", icon: icons.favorites, count: metrics.favorites },
//   ];

//   return (
//     <div className="flex min-h-screen bg-darkBg text-primaryWhite">
//       {/* Sidebar */}
//       <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

//       {/* Main Content */}
//       <main className="flex-1 lg:pl-[280px] py-6 pr-5 w-full">
//         {/* Mobile Menu Icon */}
//         <div className="lg:hidden px-4 mb-4">
//           <button onClick={() => setIsSidebarOpen(true)} className="text-primaryWhite">
//             <FiMenu size={28} />
//           </button>
//         </div>

//         <StudentNavbar />

//         <div className="p-4">
//           <WelcomeHeading />
//         </div>

//   {/* Metrics Cards */}
// <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
//   {items.map((item, index) => (
//     <div
//       key={index}
//       className="p-5 rounded-2xl shadow-lg flex items-center gap-4 border border-primaryWhite/10
//                  bg-gradient-to-br from-[#2e2f44] to-[#1f202f] text-primaryWhite
//                  hover:scale-105 hover:shadow-2xl transition-all duration-300"
//     >
//       {/* Icon inside glowing circle */}
//       <div className="flex items-center justify-center w-14 h-14 rounded-full
//                       bg-lightYellow/20 text-lightYellow text-2xl shadow-md">
//         {item.icon}
//       </div>

//       {/* Text */}
//       <div>
//         <h3 className="font-semibold text-lg">{item.title}</h3>
//         <p className="text-2xl font-bold text-gray-100">{item.count}</p>
//       </div>
//     </div>
//   ))}
// </div>

//         {/* Announcements */}
//        {/* Announcements */}
// <div className="mt-10 px-4">
//   <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primaryWhite">
//     <FaBullhorn className="text-lightYellow animate-pulse" />
//     📌 Announcements
//   </h2>

//   <div className="space-y-4">
//     {announcements.length > 0 ? (
//       announcements.map((announcement, i) => (
//         <div
//           key={i}
//           className="relative bg-gradient-to-r from-[#2e2f44] to-[#1f202f]
//                      p-4 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02]
//                      transition-all duration-300 flex items-start gap-3 border border-primaryWhite/10"
//         >
//           {/* Icon */}
//           <div className="flex items-center justify-center w-10 h-10 rounded-full
//                           bg-lightYellow/20 text-lightYellow flex-shrink-0">
//             <FaBullhorn />
//           </div>

//           {/* Text */}
//           <div>
//             <p className="text-sm text-gray200">{announcement.message}</p>
//             {/* <span className="text-xs  text-gray400">  📅 {new Date(announcement.createdAt).toLocaleDateString()}</span> */}
//             <span className="text-xs text-gray400">
//   📅 {new Date(announcement.createdAt).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   })}
// </span>

//           </div>

//           {/* Decorative pulse dot */}
//           <span className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
//         </div>
//       ))
//     ) : (
//       <p className="text-gray400 text-sm">No announcements available.</p>
//     )}
//   </div>
// </div>

//       </main>
//     </div>
//   );
// }




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
import { useNavigate } from "react-router-dom";
import Whiteboard from "../../Components/Whiteboard";
const API_URL = import.meta.env.VITE_API_URL;

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
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);

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
    timeSpent: <FaClock className="text-primaryOrange text-3xl" />,
    booksCompleted: <FaCheckCircle className="text-primaryBlue text-3xl" />,
    recentActivity: <FaBookOpen className="text-primaryGreen text-3xl" />,
    favorites: <FaHeart className="text-primaryYellow text-3xl" />,
  };

  const items = [
    {
      title: "Total Time Spent",
      icon: icons.timeSpent,
      count: metrics.timeSpent,
    },
    {
      title: "Books Completed",
      icon: icons.booksCompleted,
      count: metrics.booksCompleted,
    },
    {
      title: "Recent Activity",
      icon: icons.recentActivity,
      count: metrics.recentActivity,
    },
    { title: "Favorites", icon: icons.favorites, count: metrics.favorites },
  ];

  return (
    <div className="flex min-h-screen bg-darkBg text-primaryWhite">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 lg:pl-[280px] py-6 pr-5 w-full">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden px-4 mb-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-primaryWhite"
          >
            <FiMenu size={28} />
          </button>
        </div>

        <StudentNavbar />

        <div className="p-4">
          <WelcomeHeading />
        </div>
        <div className="relative group">
          <div
            onClick={() => setShowWhiteboard(true)}
            className="
      fixed bottom-6 right-6 w-16 h-16 rounded-full 
      bg-gradient-to-br from-primaryBlue to-indigo600  
      shadow-2xl cursor-pointer 
      flex items-center justify-center 
      animate-bounce 
      text-primaryWhite text-3xl 
      hover:scale-110 transition-all duration-300
      border border-primaryWhite/40
      z-10
    "
          >
            🧑‍🏫
            {/* Hover Text */}
            <span
              className="
      fixed bottom-14 right-1 text-center
      text-sm text-white 
      py-1 rounded-md
      opacity-0 translate-y-2 
      group-hover:opacity-100 group-hover:translate-y-0
      transition-all duration-300
      pointer-events-none
      z-20
    "
            >
              Whiteboard
            </span>
          </div>
        </div>


        {showWhiteboard && (
          <div className="fixed inset-0 bg-primaryBlack/60 backdrop-blur-md flex items-center justify-center z-[9999]">
            <div className="bg-primaryWhite w-[90%] h-[90%] rounded-xl shadow-2xl relative z-[10000]">
              <Whiteboard onClose={() => setShowWhiteboard(false)} />
            </div>
          </div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl shadow-lg flex items-center gap-4 border border-primaryWhite/10 
                 bg-cardBg text-primaryWhite 
                 hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              {/* Icon inside glowing circle */}
              <div
                className="flex items-center justify-center w-14 h-14 rounded-full 
                      bg-lightYellow/20 text-lightYellow text-2xl shadow-md"
              >
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

        {/* Action Buttons Below Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 justify-center gap-4 px-6 mt-6">
          <button
            onClick={() => navigate("/students/books")}
            className="px-6 py-3 border-2 border-primaryBlue rounded-xl 
               text-primaryWhite font-semibold shadow-md hover:scale-105 
               hover:shadow-lg transition-all duration-300"
          >
            📚 Study Material
          </button>

          <button
            onClick={() => navigate("/student/myprogress")}
            className="px-6 py-3 border-2 border-primaryGreen rounded-xl 
               text-primaryWhite font-semibold shadow-md hover:scale-105 
               hover:shadow-lg transition-all duration-300"
          >
            📈 My Progress
          </button>

          <button
            onClick={() => navigate("/student/recent-read-books")}
            className="px-6 py-3 border-2 border-primaryYellow rounded-xl 
               text-primaryWhite font-semibold shadow-md hover:scale-105 
               hover:shadow-lg transition-all duration-300"
          >
            🕓 Recent Activity
          </button>

          <button
            onClick={() => navigate("/student/favorites")}
            className="px-6 py-3 border-2 border-pink500 rounded-xl 
               text-primaryWhite font-semibold shadow-md hover:scale-105 
               hover:shadow-lg transition-all duration-300"
          >
            ❤️ Favorites
          </button>
        </div>

        {/* Announcements */}
        <div className="mt-10 px-4">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primaryWhite">
            <FaBullhorn className="text-lightYellow animate-pulse" />
            📌 Announcements
          </h2>

          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement, i) => (
                <div
                  key={i}
                  className="relative bg-cardBg 
                     p-4 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] 
                     transition-all duration-300 flex items-start gap-3 border border-primaryWhite/10"
                >
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full 
                          bg-lightYellow/20 text-lightYellow flex-shrink-0"
                  >
                    <FaBullhorn />
                  </div>

                  {/* Text */}
                  <div>
                    <p className="text-sm text-gray200">
                      {announcement.message || announcement.text}
                    </p>
                    {/* <span className="text-xs  text-gray400">  📅 {new Date(announcement.createdAt).toLocaleDateString()}</span> */}
                    <span className="text-xs text-gray400">
                      📅{" "}
                      {new Date(announcement.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  {/* Decorative pulse dot */}
                  {/* <span className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-ping"></span> */}
                </div>
              ))
            ) : (
              <p className="text-gray400 text-sm">
                No announcements available.
              </p>
            )}
          </div>
        </div>
        {/* Assessment & Quiz Section */}
        <div className="mt-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assessment Card */}
          <div className="bg-cardBg p-6 rounded-xl shadow-md border border-primaryWhite/10">
            <h3 className="text-xl font-bold mb-4">📝 Assessments</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex justify-between items-center">
                <span>Math Assessment 1</span>
                <button
                  className="px-3 py-1 text-xs text-primaryBlack bg-primaryBlue rounded-lg hover:bg-hoverBlue"
                  onClick={() => navigate("/student/assessments")}
                >
                  Start
                </button>
              </li>
              <li className="flex justify-between items-center">
                <span>Science Assessment 2</span>
                <button className="px-3 py-1 text-xs  text-primaryBlack bg-primaryBlue rounded-lg hover:bg-hoverBlue">
                  Start
                </button>
              </li>
              <li className="flex justify-between items-center">
                <span>English Assessment</span>
                <button className="px-3 py-1 text-xs  text-primaryBlack bg-primaryBlue rounded-lg hover:bg-hoverBlue">
                  Start
                </button>
              </li>
            </ul>
            {/* <button className="mt-4 text-xs text-lightYellow hover:underline">View All Assessments →</button> */}
          </div>

          {/* Quiz Card */}
          <div className="bg-cardBg p-6 rounded-xl shadow-md border border-primaryWhite/10">
            <h3 className="text-xl font-bold mb-4">🎯 Quizzes</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex justify-between items-center">
                <span>Quiz on Algebra</span>
                <button
                  className="px-3 py-1 text-xs  text-primaryBlack bg-primaryGreen rounded-lg hover:bg-green-700"
                  onClick={() => navigate("/student/quizzes")}
                >
                  Take Quiz
                </button>
              </li>
              <li className="flex justify-between items-center">
                <span>Quiz on World History</span>
                <button className="px-3 py-1 text-xs  text-primaryBlack bg-primaryGreen rounded-lg hover:bg-green-700">
                  Take Quiz
                </button>
              </li>
              <li className="flex justify-between items-center">
                <span>Quiz on Environment</span>
                <button className="px-3 py-1 text-xs  text-primaryBlack bg-primaryGreen rounded-lg hover:bg-green-700">
                  Take Quiz
                </button>
              </li>
            </ul>
            {/* <button className="mt-4 text-xs text-lightYellow hover:underline">View All Quizzes →</button> */}
          </div>
        </div>
      </main>
    </div>
  );
}
