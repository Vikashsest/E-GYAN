// import { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import StudentNavbar from "./StudentNavbar";
// import StudentSidebar from "./StudentSidebar";
// import { useLoader } from "../../LoaderContext";

// import { FaBookOpen, FaArrowLeft, FaSpinner } from "react-icons/fa";
// import { FiMenu } from "react-icons/fi";
// import fetechSubjects from "../../apiServices/booksApi";
// import { getRepository } from "../../apiServices/apiRepository";

// const ClassSubjects = () => {
//   const { setLoading } = useLoader();
//   const { className } = useParams();
//   const [subjects, setSubjects] = useState([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const category = params.get("category");

//   // useEffect(() => {
//   //   async function loadSubjects() {
//   //     try {
//   //       setLoading(true);
//   //       const data = await fetechSubjects(className);
//   //       setSubjects(data);
//   //     } catch (error) {
//   //       console.error("Failed to load subjects:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }
//   //   loadSubjects();
//   // }, [className]);
//   useEffect(() => {
//     async function loadSubjects() {
//       try {
//         setLoading(true);

//         if (!category || !className) return;

//         let subjectList = [];

//         // 🔥 CASE 1: School Education → OLD API
//         if (category === "School Education") {
//           const data = await fetechSubjects(className);
//           subjectList = data; // already array of strings
//         }
//         // 🔥 CASE 2: Other categories → Repository
//         else {
//           const data = await getRepository("subject", category);
//           subjectList = data.map((item) => item.text);
//         }

//         setSubjects(subjectList);
//       } catch (error) {
//         console.error("Failed to load subjects:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadSubjects();
//   }, [category, className]);

//   const handleSubjectClick = (sub) => {
//     navigate(`/books/${className}/${encodeURIComponent(sub)}`);
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="flex min-h-screen bg-darkBg text-primaryWhite relative">
//       {/* Sidebar */}
//       <StudentSidebar
//         isOpen={isSidebarOpen}
//         onClose={() => setIsSidebarOpen(false)}
//       />
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

//         <button
//           onClick={handleBack}
//           className="flex items-center gap-2 mb-6 px-4 py-2 bg-cardBg hover:bg-[#4a4b61] text-primaryWhite rounded-xl shadow-md transition"
//         >
//           <FaArrowLeft /> Back
//         </button>

//         <h2 className="text-2xl font-bold mb-6">📖 Subjects in {className}</h2>

//         {subjects.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {subjects.map((sub, index) => (
//               <div
//                 key={index}
//                 onClick={() => handleSubjectClick(sub)}
//                 className="p-6 rounded-2xl shadow-lg border-2 border-primaryWhite bg-cardBg text-primaryWhite
//                 flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300 cursor-pointer"
//               >
//                 <FaBookOpen className="text-primaryYellow text-4xl mb-4 drop-shadow-lg" />
//                 <h3 className="text-lg font-bold text-center break-words leading-snug">
//                   {sub.trim()}
//                 </h3>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ClassSubjects;









import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import StudentSidebar from "./StudentSidebar";
import { useLoader } from "../../LoaderContext";

import { FaBookOpen, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import fetechSubjects from "../../apiServices/booksApi";
import { getRepository } from "../../apiServices/apiRepository";

const ClassSubjects = () => {
  const { setLoading } = useLoader();
  const { className } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");

  // useEffect(() => {
  //   async function loadSubjects() {
  //     try {
  //       setLoading(true);
  //       const data = await fetechSubjects(className);
  //       setSubjects(data);
  //     } catch (error) {
  //       console.error("Failed to load subjects:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   loadSubjects();
  // }, [className]);
  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoading(true);

        if (!category || !className) return;

        let subjectList = [];

        // 🔥 CASE 1: School Education → OLD API
        if (category === "School Education") {
          const data = await fetechSubjects(className);
          subjectList = data; // already array of strings
        }
        // 🔥 CASE 2: Other categories → Repository
        else {
          const data = await getRepository("subject", category);
          subjectList = data.map((item) => item.text);
        }

        setSubjects(subjectList);
      } catch (error) {
        console.error("Failed to load subjects:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSubjects();
  }, [category, className]);
  const handleSubjectClick = (sub) => {
    // Navigate to BooksList page with subject and category
    navigate(`/books/${className}/${encodeURIComponent(sub)}?category=${category}`);
  };


  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen bg-darkBg text-primaryWhite relative">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
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

        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-cardBg hover:bg-[#4a4b61] text-primaryWhite rounded-xl shadow-md transition"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-2xl font-bold mb-6">📖 Subjects in {className}</h2>

        {subjects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((sub, index) => (
              <div
                key={index}
                onClick={() => handleSubjectClick(sub)}
                className="p-6 rounded-2xl shadow-lg border-2 border-primaryWhite bg-cardBg text-primaryWhite
                flex flex-col items-center justify-center hover:scale-105 transform transition-all duration-300 cursor-pointer"
              >
                <FaBookOpen className="text-primaryYellow text-4xl mb-4 drop-shadow-lg" />
                <h3 className="text-lg font-bold text-center break-words leading-snug">
                  {sub.trim()}
                </h3>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClassSubjects;
