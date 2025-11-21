// import { useState, useEffect } from "react";
// import { FaTh, FaList, FaFilter, FaTimes } from "react-icons/fa";
// import SimulationModal from "./SimulationModal";
// import StudentSidebar from "./StudentSidebar";
// import { FiMenu } from "react-icons/fi";
// import { fetchSimulationData } from "../../apiServices/simulationApi";

// const categories = [ /* same as before */ ];
// const gradelevel = [ /* same as before */ ];

// export default function SimulationLibrary() {
//   const [selectedView, setSelectedView] = useState("grid");
//   const [openSimulation, setOpenSimulation] = useState(null);
//   const [selectedTopics, setSelectedTopics] = useState([]);
//   const [selectedGrades, setSelectedGrades] = useState([]);
//   const [sortOrder, setSortOrder] = useState("Newest");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
//   const [collapsed, setCollapsed] = useState(() => {
//     const initial = { subjects: true, grades: true };
//     categories.forEach((cat) => {
//       initial[cat.subject] = true;
//     });
//     return initial;
//   });

//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const toggleCollapse = (key) => {
//     setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const handleTopicChange = (topic) => {
//     setSelectedTopics((prev) =>
//       prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
//     );
//   };

//   const handleGradeChange = (grade) => {
//     setSelectedGrades((prev) =>
//       prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
//     );
//   };

//   // ✅ useEffect to fetch API on component mount
//   useEffect(() => {
//     async function loadBooks() {
//       try {
//         setLoading(true);
//         const bookData = await fetchSimulationData();
//         setBooks(bookData);
//         console.log(bookData)
//       } catch (err) {
//         console.error("Failed to fetch simulations:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadBooks();
//   }, []);

//   // ✅ Apply filters
//   const filteredBooks = books.filter((book) => {
//     const matchTopic =
//       selectedTopics.length === 0 || selectedTopics.includes(book.topic);
//     const matchGrade =
//       selectedGrades.length === 0 || selectedGrades.includes(book.grade);
//     return matchTopic && matchGrade;
//   });

//   let sortedBooks = [...filteredBooks];
//   if (sortOrder === "A-Z")
//     sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
//   if (sortOrder === "Z-A")
//     sortedBooks.sort((a, b) => b.title.localeCompare(a.title));

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white relative">
//       <StudentSidebar
//         isOpen={isSidebarOpen}
//         onClose={() => setIsSidebarOpen(false)}
//       />
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         ></div>
//       )}

//       <main className="flex-1 lg:pl-[280px] py-6 px-4 sm:px-6 w-full">
//         {/* Top Bar */}
//         <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800 sticky top-0 z-20">
//           <h1 className="font-semibold text-lg">
//             {loading ? "Loading..." : `${filteredBooks.length} results`}
//           </h1>
//           {/* Sorting & View Buttons */}
//           <div className="flex items-center space-x-3">
//             <select
//               value={sortOrder}
//               onChange={(e) => setSortOrder(e.target.value)}
//               className="border border-gray-700 bg-gray-700 text-gray-200 rounded-md px-3 py-1"
//             >
//               <option value="Newest">Sort by: Newest</option>
//               <option value="A-Z">A-Z</option>
//               <option value="Z-A">Z-A</option>
//             </select>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setSelectedView("grid")}
//                 className={`p-2 rounded ${
//                   selectedView === "grid" ? "bg-gray-700" : "bg-gray-800"
//                 }`}
//               >
//                 <FaTh />
//               </button>
//               <button
//                 onClick={() => setSelectedView("list")}
//                 className={`p-2 rounded ${
//                   selectedView === "list" ? "bg-gray-700" : "bg-gray-800"
//                 }`}
//               >
//                 <FaList />
//               </button>
//               <button
//                 onClick={() => setFilterSidebarOpen(true)}
//                 className="p-2 bg-gray-700 rounded hover:bg-gray-600"
//               >
//                 <FaFilter />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Books Grid/List */}
//         <div
//           className={`p-6 grid gap-6 ${
//             selectedView === "grid"
//               ? "sm:grid-cols-2 lg:grid-cols-4"
//               : "grid-cols-1"
//           }`}
//         >
//           {loading ? (
//             <p>Loading simulations...</p>
//           ) : sortedBooks.length === 0 ? (
//             <p>No simulations found.</p>
//           ) : (
//             sortedBooks.map((book) => (
//               <div
//                 key={book.id}
//                 onClick={() => setOpenSimulation(book.link)}
//                 className={`bg-gray-800 rounded-lg shadow hover:shadow-xl hover:bg-gray-700 transition cursor-pointer ${
//                   selectedView === "list" ? "flex items-center p-4" : ""
//                 }`}
//               >
//                 <img
//                   src={book.image}
//                   alt={book.title}
//                   className={`${
//                     selectedView === "list"
//                       ? "w-24 h-16 rounded"
//                       : "w-full h-40 rounded-t-lg"
//                   } object-cover`}
//                 />
//                 <div className={`${selectedView === "list" ? "ml-4" : "p-4"}`}>
//                   <h3 className="font-semibold text-gray-100">{book.title}</h3>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>


//         <SimulationModal
//           url={openSimulation}
//           onClose={() => setOpenSimulation(null)}
//         />
//       </main>
//     </div>
//   );
// }







import { useState, useEffect } from "react";
import { FaTh, FaList, FaFilter, FaTimes } from "react-icons/fa";
import SimulationModal from "./SimulationModal";
import StudentSidebar from "./StudentSidebar";
import { FiMenu } from "react-icons/fi";
import { fetchSimulationData } from "../../apiServices/simulationApi";

export default function SimulationLibrary() {
  const [selectedView, setSelectedView] = useState("grid");
  const [openSimulation, setOpenSimulation] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState({ subjects: true, grades: true });
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [gradeLevels, setGradeLevels] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);


  const toggleCollapse = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTopicChange = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleGradeChange = (grade) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };


  // Select/Deselect all subjects (all topics)
  const handleAllSubjectsToggle = () => {
    if (selectedTopics.length === categories.flatMap(c => c.topics).length) {
      setSelectedTopics([]); // uncheck all
    } else {
      setSelectedTopics(categories.flatMap(c => c.topics)); // check all
    }
  };

  // Select/Deselect all grades
  const handleAllGradesToggle = () => {
    if (selectedGrades.length === gradeLevels.length) {
      setSelectedGrades([]); // uncheck all
    } else {
      setSelectedGrades(gradeLevels); // check all
    }
  };


  // ✅ Fetch API and dynamically build filters
  useEffect(() => {
    async function loadBooks() {
      try {
        setLoading(true);
        const data = await fetchSimulationData();
        setBooks(data);

        // Dynamically build categories & grade levels
        const subjectMap = {};
        const gradesSet = new Set();
        data.forEach((book) => {
          gradesSet.add(book.grade);
          if (!subjectMap[book.subject]) subjectMap[book.subject] = new Set();
          subjectMap[book.subject].add(book.topic);
        });

        const dynamicCategories = Object.keys(subjectMap).map((subj) => ({
          subject: subj,
          topics: Array.from(subjectMap[subj]),
        }));
        setCategories(dynamicCategories);
        setGradeLevels(Array.from(gradesSet));

        // Initialize collapse state
        const initialCollapse = { subjects: true, grades: true };
        dynamicCategories.forEach((cat) => {
          initialCollapse[cat.subject] = true;
        });
        setCollapsed(initialCollapse);
      } catch (err) {
        console.error("Failed to fetch simulations:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);


  // Responsive Pagination Settings
  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth >= 1024) setItemsPerPage(12);
      else if (window.innerWidth >= 640) setItemsPerPage(9);
      else setItemsPerPage(6);
    };

    updateItems();
    window.addEventListener("resize", updateItems);

    return () => window.removeEventListener("resize", updateItems);
  }, []);


  // ✅ Filter books
  const filteredBooks = books.filter((book) => {
    const matchTopic =
      selectedTopics.length === 0 || selectedTopics.includes(book.topic);
    const matchGrade =
      selectedGrades.length === 0 || selectedGrades.includes(book.grade);
    return matchTopic && matchGrade;
  });

  let sortedBooks = [...filteredBooks];
  if (sortOrder === "A-Z")
    sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
  if (sortOrder === "Z-A")
    sortedBooks.sort((a, b) => b.title.localeCompare(a.title));

  // Pagination Logic
  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);


  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white relative">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay for mobile when sidebar open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:pl-[280px] py-6 px-4 sm:px-6 w-full">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden mb-2 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-white focus:outline-none"
          >
            <FiMenu size={28} />
          </button>
        </div>



        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-700 bg-gray-800 sticky top-0 z-20 space-y-2 sm:space-y-0">
          <h1 className="font-semibold text-lg ">
            {loading ? "Loading..." : `${filteredBooks.length} results`}
          </h1>
          <div className="flex items-center space-x-3">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-700 bg-gray-700 text-gray-200 rounded-md px-3 py-1"
            >
              <option value="Newest">Sort by: Newest</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedView("grid")}
                className={`p-2 rounded ${selectedView === "grid" ? "bg-gray-700" : "bg-gray-800"
                  }`}
              >
                <FaTh />
              </button>
              <button
                onClick={() => setSelectedView("list")}
                className={`p-2 rounded ${selectedView === "list" ? "bg-gray-700" : "bg-gray-800"
                  }`}
              >
                <FaList />
              </button>
              <button
                onClick={() => setFilterSidebarOpen(true)}
                className="p-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                <FaFilter />
              </button>
            </div>
          </div>
        </div>

        {/* Books Grid/List */}
        <div
          className={`p-6 grid gap-6 ${selectedView === "grid"
            ? " grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-1"
            }`}
        >
          {loading ? (
            <p>Loading simulations...</p>
          ) : currentBooks.length === 0 ? (
            <p>No simulations found.</p>
          ) : (
            currentBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => setOpenSimulation(book.link)}
                className={`bg-gray-800 rounded-lg shadow hover:shadow-xl hover:bg-gray-700 transition cursor-pointer ${selectedView === "list" ? "flex items-center p-4" : ""
                  }`}
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className={`${selectedView === "list"
                    ? "w-24 h-16 rounded"
                    : "w-full h-40 rounded-t-lg"
                    } object-cover`}
                />
                <div className={`${selectedView === "list" ? "ml-4" : "p-4"}`}>
                  <h3 className="font-semibold text-gray-100">{book.title}</h3>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Responsive Pagination */}
        {sortedBooks.length > 0 && (
          <div className="flex justify-center items-center space-x-2 mt-6 mb-10">

            {/* DESKTOP (Full Pagination) */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* FIRST */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
              >
                ⏮ First
              </button>

              {/* PREV */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
              >
                Prev
              </button>

              {/* Page Numbers FULL */}
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-600" : "bg-gray-700"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* NEXT */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
              >
                Next
              </button>

              {/* LAST */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
              >
                Last ⏭
              </button>
            </div>


            {/* TABLET VIEW (max 5 page numbers) */}
            <div className="hidden sm:flex lg:hidden items-center space-x-2">
              {/* FIRST */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
              >
                ⏮ First
              </button>

              {/* PREV */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
              >
                Prev
              </button>

              {/* SHOW ONLY 5 PAGES */}
              {Array.from({ length: totalPages })
                .slice(Math.max(0, currentPage - 3), currentPage + 2)
                .map((_, idx) => {
                  const page = Math.max(1, currentPage - 2) + idx;
                  if (page > totalPages) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-600" : "bg-gray-700"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

              {/* NEXT */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
              >
                Next
              </button>

              {/* LAST */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
              >
                Last ⏭
              </button>
            </div>


            {/* MOBILE VIEW (very small) */}
            <div className="flex sm:hidden items-center space-x-2">
              {/* FIRST */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
              >
                ⏮ First
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 bg-gray-700 rounded disabled:opacity-40 text-sm"
              >
                Prev
              </button>

              <span className="px-3 py-1 bg-gray-800 rounded text-sm">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 bg-gray-700 rounded disabled:opacity-40 text-sm"
              >
                Next
              </button>

              {/* LAST */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
              >
                Last ⏭
              </button>
            </div>
          </div>
        )}



        {/* Right Filter Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-gray-800 border-l border-gray-700 transform ${filterSidebarOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out z-30`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="font-bold text-lg">Filters</h2>
            <button
              onClick={() => setFilterSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              <FaTimes />
            </button>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100%-3rem)]">

            {/* Subjects */}
            <div className="mb-4 border-b border-gray-700 pb-3">
              {/* Subjects Main Header */}
              <button
                onClick={() => toggleCollapse("subjects")}
                className="w-full flex justify-between items-center font-semibold text-gray-200"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-blue-500"
                    checked={
                      selectedTopics.length === categories.flatMap(c => c.topics).length &&
                      selectedTopics.length !== 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTopics(categories.flatMap(c => c.topics));
                      } else {
                        setSelectedTopics([]);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>Subjects</span>
                </div>

                <span className="text-xl">{collapsed["subjects"] ? "+" : "–"}</span>
              </button>

              {/* Subjects Inner List */}
              {!collapsed["subjects"] &&
                categories.map((cat) => (
                  <div key={cat.subject} className="mb-3">

                    {/* Subject Sub Header */}
                    <button
                      onClick={() => toggleCollapse(cat.subject)}
                      className="w-full flex justify-between items-center font-semibold text-gray-300 ml-1 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="form-checkbox text-blue-500"
                          checked={
                            cat.topics.every(t => selectedTopics.includes(t)) &&
                            cat.topics.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTopics((prev) => [
                                ...new Set([...prev, ...cat.topics])
                              ]);
                            } else {
                              setSelectedTopics((prev) =>
                                prev.filter(t => !cat.topics.includes(t))
                              );
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />

                        <span>{cat.subject}</span>
                      </div>

                      <span className="text-sm">
                        {collapsed[cat.subject] ? "+" : "–"}
                      </span>
                    </button>

                    {/* Topics */}
                    {!collapsed[cat.subject] && (
                      <div className="ml-6 mt-2 space-y-1">
                        {cat.topics.map((topic) => (
                          <label key={topic} className="flex items-center space-x-2 text-gray-400">
                            <input
                              type="checkbox"
                              className="form-checkbox text-blue-500"
                              checked={selectedTopics.includes(topic)}
                              onChange={() => handleTopicChange(topic)}
                            />
                            <span>{topic}</span>
                          </label>
                        ))}
                      </div>
                    )}

                  </div>
                ))}
            </div>

            {/* Grades */}
            <div className="border-b border-gray-700 pb-3">
              <button
                onClick={() => toggleCollapse("grades")}
                className="w-full flex justify-between items-center font-semibold text-gray-200"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox text-green-500"
                    checked={
                      selectedGrades.length === gradeLevels.length &&
                      gradeLevels.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGrades(gradeLevels);
                      } else {
                        setSelectedGrades([]);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />

                  <span>Grade Level</span>
                </div>

                <span className="text-xl">
                  {collapsed["grades"] ? "+" : "–"}
                </span>
              </button>

              {!collapsed["grades"] && (
                <div className="mt-3 space-y-1 ml-4">
                  {gradeLevels.map((grade) => (
                    <label key={grade} className="flex items-center space-x-2 text-gray-400">
                      <input
                        type="checkbox"
                        className="form-checkbox text-green-500"
                        checked={selectedGrades.includes(grade)}
                        onChange={() => handleGradeChange(grade)}
                      />
                      <span>{grade}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>


          </div>
        </div>

        {/* Overlay */}
        {filterSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-20"
            onClick={() => setFilterSidebarOpen(false)}
          ></div>
        )}

        {/* Simulation Modal */}
        <SimulationModal
          url={openSimulation}
          onClose={() => setOpenSimulation(null)}
        />
      </main>
    </div>
  );

}