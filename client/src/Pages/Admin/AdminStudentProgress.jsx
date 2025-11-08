// import { useState, useMemo } from "react";
// import Sidebar from "./AdminSidebar";
// import AdminNavbar from "./AdminNavbar";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// export default function AdminStudentProgress() {
//   // Hardcoded data for demonstration (replace with API fetch later)
//   const allStudents = Array.from({ length: 50 }, (_, i) => ({
//     id: i + 1,
//     username: `Student ${i + 1}`,
//     email: `student${i + 1}@example.com`,
//     class: `Class ${((i % 10) + 1)}`,
//     subject: i % 2 === 0 ? "Mathematics" : "Science",
//     progressByBook: [
//       {
//         bookName: `Mathematics - Class ${((i % 10) + 1)}`,
//         progressPercent: Math.floor(Math.random() * 100),
//       },
//       {
//         bookName: `Science - Class ${((i % 10) + 1)}`,
//         progressPercent: Math.floor(Math.random() * 100),
//       },
//     ],
//   }));

//   const [expandedStudentIds, setExpandedStudentIds] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterClass, setFilterClass] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const studentsPerPage = 10;

//   const toggleStudent = (id) => {
//     setExpandedStudentIds((prev) =>
//       prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
//     );
//   };

//   // Filtering & Searching
//   const filteredStudents = useMemo(() => {
//     return allStudents.filter(
//       (student) =>
//         student.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
//         (filterClass ? student.class === filterClass : true)
//     );
//   }, [searchQuery, filterClass, allStudents]);

//   // Pagination
//   const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
//   const paginatedStudents = filteredStudents.slice(
//     (currentPage - 1) * studentsPerPage,
//     currentPage * studentsPerPage
//   );

//   const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
//   const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       <Sidebar />
//       <main className="pl-[280px] py-6 pr-5 w-full">
//         <AdminNavbar notificationsCount={0} />
//         <h1 className="text-3xl font-bold mb-6 text-gray-200">
//           Students Progress
//         </h1>

//         {/* Search & Filters */}
//         <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             className="px-4 py-2 rounded w-full md:w-1/3 text-black"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <select
//             className="px-4 py-2 rounded text-black"
//             value={filterClass}
//             onChange={(e) => setFilterClass(e.target.value)}
//           >
//             <option value="">All Classes</option>
//             {Array.from({ length: 10 }, (_, i) => (
//               <option key={i} value={`Class ${i + 1}`}>
//                 Class {i + 1}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Students List */}
//         <div className="grid gap-4">
//           {paginatedStudents.map((student) => {
//             const isExpanded = expandedStudentIds.includes(student.id);
//             return (
//               <div
//                 key={student.id}
//                 className="bg-[#2a2b39] p-5 rounded-lg shadow-lg hover:shadow-xl transition-all"
//               >
//                 <div
//                   className="flex justify-between items-center cursor-pointer"
//                   onClick={() => toggleStudent(student.id)}
//                 >
//                   <div>
//                     <h2 className="text-xl font-semibold">{student.username}</h2>
//                     <p className="text-gray-400">{student.email}</p>
//                     <p className="text-sm text-gray-500">{student.class}</p>
//                   </div>
//                   <div className="text-gray-400 text-lg">
//                     {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
//                   </div>
//                 </div>

//                 {isExpanded && (
//                   <ul className="mt-4 space-y-3">
//                     {student.progressByBook.map((book, idx) => (
//                       <li key={idx} className="flex flex-col">
//                         <div className="flex justify-between items-center">
//                           <span className="font-medium">{book.bookName}</span>
//                           <span className="text-sm text-gray-300">
//                             {book.progressPercent}%
//                           </span>
//                         </div>
//                         <div className="w-full bg-gray-700 h-3 rounded mt-1">
//                           <div
//                             className="bg-blue-500 h-3 rounded transition-all"
//                             style={{ width: `${book.progressPercent}%` }}
//                           ></div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Pagination Controls */}
//         <div className="flex justify-center items-center gap-4 mt-6">
//           <button
//             onClick={handlePrev}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={handleNext}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Sidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FaChevronDown, FaChevronUp, FaSearch, FaDownload } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { saveAs } from "file-saver";

// debounce helper
function debounce(fn, delay) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}

// calculate average progress
function avgProgress(student) {
  if (student.averageProgress !== undefined) return Math.round(student.averageProgress);
  if (!student.progressByBook || student.progressByBook.length === 0) return 0;
  const sum = student.progressByBook.reduce((s, b) => s + (b.progressPercent || 0), 0);
  return Math.round(sum / student.progressByBook.length);
}

// progress color
function progressColor(percent) {
  if (percent >= 80) return "bg-green-500";
  if (percent >= 50) return "bg-yellow-400";
  return "bg-red-500";
}

export default function AdminStudentProgress() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [expandedIds, setExpandedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // debounce search
  // const handleSearchDebounced = useCallback(
  //   debounce((q) => {
  //     setSearch(q);
  //     setCurrentPage(1);
  //   }, 300),
  //   []
  // );

  // fetch students from backend
  useEffect(() => {
    async function fetchStudents() {
      try {
        // const res = await fetch("http://localhost:5000/admin/student-progress");
        const res=await fetch(`${import.meta.env.VITE_API_URL}/admin/student-progress`,)
        const data = await res.json();

        const formattedData = data.map((s, i) => ({
          ...s,
          avatarColor: ["bg-blue-600", "bg-purple-600", "bg-indigo-500"][i % 3],
          progressByBook: (s.progressByBook || []).map(b => ({
            bookName: b.bookName,
            progressPercent: b.progress,
          })),
        }));

        setStudents(formattedData);
      } catch (err) {
        console.error("Failed to fetch students", err);
      }
    }

    fetchStudents();
  }, []);

  // Filter + sort
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = students.filter(s => q ? s.username.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) : true);

    if (sortBy === "name_asc") arr.sort((a, b) => a.username.localeCompare(b.username));
    if (sortBy === "name_desc") arr.sort((a, b) => b.username.localeCompare(a.username));
    if (sortBy === "progress_desc") arr.sort((a, b) => avgProgress(b) - avgProgress(a));
    if (sortBy === "progress_asc") arr.sort((a, b) => avgProgress(a) - avgProgress(b));

    return arr;
  }, [students, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(1); }, [totalPages]);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const toggleExpand = (id) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // CSV export
  const exportCsv = () => {
    const rows = [["ID", "Name", "Email", "AverageProgress"]];
    filtered.forEach(st => rows.push([st.id, st.username, st.email, avgProgress(st)]));
    const csvContent = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    saveAs(new Blob([csvContent], { type: "text/csv;charset=utf-8;" }), `students_progress_${new Date().toISOString()}.csv`);
  };

  // Row component
  const Row = ({ student }) => {
    const isExpanded = expandedIds.includes(student.id);
    return (
      <div className="px-2">
        <div className="bg-[#2a2b39] p-4 rounded-lg shadow hover:shadow-xl transition-all">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${student.avatarColor}`}>
                {student.username.split(" ")[1] || student.username[0]}
              </div>
              <div>
                <div className="font-semibold text-lg">{student.username}</div>
                <div className="text-sm text-gray-400">{student.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-gray-300">Avg {avgProgress(student)}%</div>
                <div className="w-36 bg-gray-700 h-3 rounded mt-1 overflow-hidden">
                  <div className={`${progressColor(avgProgress(student))} h-3 rounded`} style={{ width: `${avgProgress(student)}%` }}></div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700" onClick={() => setSelectedStudent(student)}>View</button>
                <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700" onClick={() => toggleExpand(student.id)}>
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden">
                <div className="grid gap-3">
                  {student.progressByBook.map((b, i) => (
                    <div key={i} className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{b.bookName}</div>
                        <div className="text-sm text-gray-300">{b.progressPercent}%</div>
                      </div>
                      <div className="w-full bg-gray-700 h-3 rounded mt-1 overflow-hidden">
                        <div className={`${progressColor(b.progressPercent)} h-3 rounded`} style={{ width: `${b.progressPercent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <Sidebar />
      <main className="pl-[280px] py-6 pr-5 w-full">
        <AdminNavbar notificationsCount={0} />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-100">Students Progress</h1>
          <div className="flex gap-2 items-center">
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 rounded hover:bg-blue-700" onClick={exportCsv}><FaDownload /> Export CSV</button>
          </div>
        </div>

        {/* Search + Sort */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center bg-[#2a2b39] p-2 rounded">
            <FaSearch className="ml-2 text-gray-400" />
            <input
              placeholder="Search name or email..."
              className="bg-transparent px-3 py-2 w-full outline-none text-sm"
              // onChange={(e) => handleSearchDebounced(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <select className="px-3 py-2 rounded bg-[#2a2b39] text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name_asc">Name A → Z</option>
              <option value="name_desc">Name Z → A</option>
              <option value="progress_desc">Progress High → Low</option>
              <option value="progress_asc">Progress Low → High</option>
            </select>
            {/* <select className="px-3 py-2 rounded bg-[#2a2b39] text-sm" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
              <option value={8}>8 / page</option>
              <option value={12}>12 / page</option>
              <option value={24}>24 / page</option>
              <option value={48}>48 / page</option>
            </select> */}
          </div>
        </div>

        {/* Students List */}
        <div className="grid gap-4">
          {paged.map(student => <Row key={student.id} student={student} />)}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center gap-4 mt-6">
          <div className="text-sm text-gray-400">Showing {filtered.length} students — page {currentPage} / {totalPages}</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-gray-700 rounded disabled:opacity-50" disabled={currentPage===1} onClick={() => setCurrentPage(p => Math.max(1, p-1))}>Prev</button>
            <input className="w-12 text-center rounded bg-[#2a2b39] px-2 py-1" value={currentPage} onChange={e => { const v = Number(e.target.value) || 1; setCurrentPage(Math.min(Math.max(1,v), totalPages)); }} />
            <button className="px-3 py-2 bg-gray-700 rounded disabled:opacity-50" disabled={currentPage===totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}>Next</button>
          </div>
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedStudent && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <motion.div initial={{ scale:0.9 }} animate={{ scale:1 }} exit={{ scale:0.9 }} className="bg-white text-black rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{selectedStudent.username}</h2>
                  <button className="text-sm text-gray-600" onClick={()=>setSelectedStudent(null)}>Close</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Email:</strong> {selectedStudent.email}</p>
                    <p><strong>Average Progress:</strong> {avgProgress(selectedStudent)}%</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Book-wise progress</h3>
                    <div className="space-y-2">
                      {selectedStudent.progressByBook.map((b, i) => (
                        <div key={i}>
                          <div className="flex justify-between">
                            <div>{b.bookName}</div>
                            <div>{b.progressPercent}%</div>
                          </div>
                          <div className="w-full bg-gray-200 h-3 rounded mt-1 overflow-hidden">
                            <div className={`${progressColor(b.progressPercent)} h-3 rounded`} style={{ width: `${b.progressPercent}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button className="px-4 py-2 rounded bg-gray-200" onClick={()=>setSelectedStudent(null)}>Close</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
