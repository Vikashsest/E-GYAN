
// import { useEffect, useState } from "react";
// import StudentSidebar from "./StudentSidebar";
// import StudentNavbar from "./StudentNavbar";
// import { FaBookReader, FaArrowRight } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { FiMenu } from "react-icons/fi";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function StudentRecentBooks() {
//   const [recentBooks, setRecentBooks] = useState([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
//   const navigate = useNavigate()

//   useEffect(() => {
//     fetch(`${API_URL}/students/recent-books`, {
//       credentials: "include",
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch recent books");
//         return res.json();
//       })
//       .then((data) => setRecentBooks(data))
//       .catch((err) => console.error("API Error:", err));
//   }, []);

//   return (
//     <div className="flex min-h-screen bg-darkBg text-primaryWhite relative">
//       {/* Sidebar */}
//       <StudentSidebar
//         isOpen={isSidebarOpen}
//         onClose={() => setIsSidebarOpen(false)}
//       />

//       {/* Overlay for mobile when sidebar open */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-primaryBlack bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         ></div>
//       )}

//       {/* Main Content */}
//       <main className="flex-1 lg:pl-[280px] py-6 px-4 sm:px-6 w-full">
//         {/* Mobile Menu Icon */}
//         <div className="lg:hidden mb-4 flex items-center">
//           <button
//             onClick={() => setIsSidebarOpen(true)}
//             className="text-primaryWhite focus:outline-none"
//           >
//             <FiMenu size={28} />
//           </button>
//         </div>

//         <StudentNavbar />

//         <div className="p-4">
//           <h1 className="text-3xl font-bold mb-4">📘 Recently Read Books</h1>
//           <p className="text-primaryWhite/70 mb-6 text-sm">
//             View your recently accessed digital books with reading progress.
//           </p>

//           {recentBooks.length === 0 ? (
//             <p className="text-primaryWhite/50">No recent books found.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {recentBooks.map((book) => (
//   <div
//     key={book.id}
//     className="bg-cardBg p-5 rounded-xl shadow hover:shadow-xl transition"
//   >
//     <div className="flex items-center justify-between mb-2">
//       <h2 className="text-xl font-semibold truncate">
//         {book.bookName}
//       </h2>
//       <span className="text-xs text-primaryWhite/60">
//         {book.subject}
//       </span>
//     </div>

//     <div className="mb-3">
//       <div className="flex justify-between text-sm mb-1">
//         <span className="text-primaryWhite/70">Progress</span>
//         <span className="text-primaryWhite/50">{book.progress}%</span>
//       </div>
//       <div className="w-full bg-gray-700 rounded-full h-2">
//         <div
//           className="bg-green-500 h-2 rounded-full transition-all duration-500"
//           style={{ width: `${book.progress}%` }}
//         ></div>
//       </div>
//     </div>

//     <p className="text-xs text-primaryWhite/50 mb-4">
//       Last Accessed: {new Date(book.lastAccessed).toLocaleString()}
//     </p>

//     <button
//       onClick={() => navigate(`/student/books/${book.id}/chapters`)}
//       className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
//     >
//       <FaBookReader />
//       Continue Reading
//       <FaArrowRight className="ml-1" />
//     </button>
//   </div>
// ))}

//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";
import { FaBookReader, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useLoader } from "../../LoaderContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function StudentRecentBooks() {
  const {setLoading} = useLoader()
  const [recentBooks, setRecentBooks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

   useEffect(() => {
    const fetchRecentBooks = async () => {
      try {
        setLoading(true); // ✅ loader ON

        const res = await fetch(`${API_URL}/students/recent-books`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch recent books");

        const data = await res.json();
        setRecentBooks(data);

      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false); // ✅ loader OFF
      }
    };

    fetchRecentBooks();
  }, []);
  return (
    <div className="flex min-h-screen bg-darkBg text-primaryWhite relative">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay for mobile when sidebar open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-primaryBlack bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:pl-[280px] py-6 px-4 sm:px-6 w-full">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden mb-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-primaryWhite focus:outline-none"
          >
            <FiMenu size={28} />
          </button>
        </div>

        <StudentNavbar />

        <div className="p-4">
          <h1 className="text-3xl font-bold mb-4">📘 Recently Read Books</h1>
          <p className="text-primaryWhite/70 mb-6 text-sm">
            View your recently accessed digital books with reading progress.
          </p>

          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-cardBg  p-5 rounded-2xl 
                             shadow-lg hover:shadow-2xl hover:scale-105 
                             transition-all duration-300 border border-primaryWhite/10 backdrop-blur-md"
                >
                  {/* Book Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold truncate text-primaryWhite">
                      {book.bookName}
                    </h2>
                    <span className="text-xs px-2 py-1 rounded-full bg-primaryBlue/20 text-blue-400 font-medium">
                      {book.subject || "General"}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-primaryWhite/70">Progress</span>
                      <span className="text-primaryWhite/50">{book.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700/40 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-lightGreen transition-all duration-700"
                        style={{ width: `${book.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Last Accessed */}
                  <p className="text-xs text-primaryWhite/60 mb-5 italic">
                    📅 Last Accessed:{" "}
                    <span className="text-primaryWhite/80">
                      {new Date(book.lastAccessed).toLocaleString()}
                    </span>
                  </p>

                  {/* Continue Button */}
                  <button
                    onClick={() =>
                      navigate(`/student/books/${book.id}/chapters`)
                    }
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                               bg-primaryBlue
                               text-primaryWhite text-sm font-semibold shadow-md transition-all"
                  >
                    <FaBookReader />
                    Continue Reading
                    <FaArrowRight className="ml-1" />
                  </button>
                </div>
              ))}
            </div>
        </div>
      </main>
    </div>
  );
}
