// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import StudentNavbar from "./StudentNavbar";
// import StudentSidebar from "./StudentSidebar";
// import { FaBookReader } from "react-icons/fa";
// import { FiMenu } from "react-icons/fi";
// import { getRepository } from "../../apiServices/apiRepository";
// import { useLoader } from "../../LoaderContext";

// const Books = () => {
//   const [categories, setCategories] = useState([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const { setLoading } = useLoader();
//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   async function loadCategories() {
//   //     setLoading(true);
//   //     try {
//   //       const bookData = await getRepository();

//   //       const categoryArray = bookData[0].Categories.split(",");
//   //       console.log(categoryArray);

//   //       setCategories(categoryArray);
//   //     } catch (error) {
//   //       console.error("Failed to load categories:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }
//   //   loadCategories();
//   // }, []);
//   useEffect(() => {
//     const loadCategories = async () => {
//       try {
//         setLoading(true);
//         const data = await getRepository("category");

//         const categoryList = data.map((item) => item.text);
//         setCategories(categoryList);
//       } catch (err) {
//         console.error("Failed to load categories:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCategories();
//   }, []);

//   // const getCategoryRoute = (cat) => {
//   //   switch (cat.trim()) {
//   //     case "Simulation":
//   //       return "/simulation-subjects";
//   //     case "Current Affairs":
//   //       return "/current-affairs";
//   //     default:
//   //       return `/classes?category=${cat}`;
//   //   }
//   // };
//   const getCategoryRoute = (cat) => {
//     const name = cat.trim().toLowerCase();

//     if (/simulation/i.test(name)) {
//       return "/simulation-subjects";
//     }

//     if (/^current affair(s)?$/.test(name)) {
//       return "/current-affairs";
//     }

//     return `/classes?category=${encodeURIComponent(cat)}`;
//   };

//   return (
//     <div className="flex min-h-screen bg-darkBg text-primaryWhite relative">
//       <StudentSidebar
//         isOpen={isSidebarOpen}
//         onClose={() => setIsSidebarOpen(false)}
//       />

//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-primaryBlack bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       <main className="flex-1 lg:pl-[280px] py-6 px-4 sm:px-6 w-full">
//         <div className="lg:hidden mb-4 flex items-center">
//           <button
//             onClick={() => setIsSidebarOpen(true)}
//             className="text-primaryWhite focus:outline-none"
//           >
//             <FiMenu size={28} />
//           </button>
//         </div>

//         <StudentNavbar />

//         <h2 className="text-2xl font-bold mb-6">📚 Category</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//           {categories.map((cat, index) => (
//             <div
//               key={index}
//               onClick={() => navigate(getCategoryRoute(cat))}
//               className="p-5 sm:p-6 rounded-2xl shadow-lg border border-gray300
//                 bg-cardBg text-primaryWhite flex flex-col items-center justify-center
//                 hover:scale-105 transform transition-all duration-300 cursor-pointer"
//             >
//               <FaBookReader className="text-lightBlue text-4xl sm:text-5xl mb-3 sm:mb-4 drop-shadow-lg" />
//               <h3 className="text-base sm:text-lg md:text-xl font-bold text-center">
//                 {cat}
//               </h3>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Books;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import StudentSidebar from "./StudentSidebar";
import { FaBookReader } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { getRepository } from "../../apiServices/apiRepository";
import { useLoader } from "../../LoaderContext";

const Books = () => {
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { setLoading } = useLoader();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await getRepository("category");

        const categoryList = data.map((item) => item.text);
        setCategories(categoryList);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [setLoading]);

  const getCategoryRoute = (cat) => {
    const name = cat.trim().toLowerCase();

    if (/simulation/i.test(name)) {
      return "/simulation-subjects";
    }

    if (/^current affair(s)?$/.test(name)) {
      return "/current-affairs";
    }

    return `/classes?category=${encodeURIComponent(cat)}`;
  };

  // UI me kya text dikhana hai
  const getDisplayName = (cat) => {
    const name = cat.trim().toLowerCase();

    if (/simulation/i.test(name)) {
      return "Pentagon Hybrid Education Technology For Simulation";
    }

    return cat;
  };

  return (
    <div className="flex min-h-screen bg-darkBg text-primaryWhite relative">
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-primaryBlack bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 lg:pl-[280px] py-6 px-4 sm:px-6 w-full">
        <div className="lg:hidden mb-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-primaryWhite focus:outline-none"
          >
            <FiMenu size={28} />
          </button>
        </div>

        <StudentNavbar />

        <h2 className="text-2xl font-bold mb-6">📚 Category</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => navigate(getCategoryRoute(cat))}
              className="p-5 sm:p-6 rounded-2xl shadow-lg border border-gray300 
                bg-cardBg text-primaryWhite flex flex-col items-center justify-center 
                hover:scale-105 transform transition-all duration-300 cursor-pointer"
            >
              <FaBookReader className="text-lightBlue text-4xl sm:text-5xl mb-3 sm:mb-4 drop-shadow-lg" />

              <h3 className="text-base sm:text-lg md:text-xl font-bold text-center">
                {getDisplayName(cat)}
              </h3>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Books;
