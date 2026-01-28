

// import { useEffect, useState } from "react";
// import FlipbookPDFViewer from "./FlipbookPDFViewer";
// import { FaEdit, FaTrash, FaExpand, FaCompress } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { FiMenu } from "react-icons/fi";
// import { confirmDelete } from "../utils/confirmDelete";
// import { getRepository } from "../apiServices/apiRepository";
// import JoditEditor from "jodit-react";
// import { useRef } from "react";
// import { useLoader } from "../LoaderContext";
// import {
//   fetchBooks,
//   uploadBook,
//   deleteBook,
//   addCurrentAffairs,
// } from "../apiServices/booksApi";
// import { useNavigate } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL;

// const getProxiedUrl = (url) => {
//   if (!url) return null;
//   if (url.includes("/index.php/s/")) {
//     if (!url.endsWith("/download")) url = url.replace(/\/+$/, "") + "/download";
//   }
//   return `${API_URL}/books/proxy/file?url=${encodeURIComponent(url)}`;
// };
// // const chapterUrl = useMemo(() => {
// //   if (!chapter) return null;
// //   return getProxiedUrl(chapter.fileUrl);
// // }, [chapter]);

// const getBookResourceType = (book) => book.chapters?.[0]?.resourceType || "pdf";

// const getItemsPerPage = () => {
//   if (window.innerWidth < 640) return 4;
//   if (window.innerWidth < 1024) return 6;
//   return 8;
// };

// export default function ManageBooksPage({ role, Navbar, Sidebar }) {
//   const { setLoading } = useLoader();
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [bookList, setBookList] = useState([]);
//   const [editData, setEditData] = useState(null);
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [classes, setClasses] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());
//   const [categories, setCategories] = useState([]);
//   const [filterCategory, setFilterCategory] = useState("School Education");
//   const [formData, setFormData] = useState({
//     bookName: "",
//     category: "",
//     subject: "",
//     educationLevel: "",
//     language: "",
//     file: null,
//     thumbnail: null,

//     //current affairs
//     title: "",
//     description: "",
//     newsCategory: "",
//     date: "",
//     source: "",
//     link: "",
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };
//   const [subjects, setSubjects] = useState([]);
//   const [books, setBooks] = useState([]);
//   const [languages, setLanguages] = useState([]);
//   const [educationLevels, setEducationLevels] = useState([]);
//   const editor = useRef(null);

//   useEffect(() => {
//     const loadCategories = async () => {
//       try {
//         const data = await getRepository("category");

//         const categoryList = [...new Set(data.map((item) => item.text))];

//         setCategories(categoryList);
//       } catch (err) {
//         console.error("Failed to load categories:", err);
//       }
//     };

//     loadCategories();
//   }, []);
//   useEffect(() => {
//     const loadFormOptions = async () => {
//       try {
//         const [categoryData, subjectData, bookData, languageData, levelData] =
//           await Promise.all([
//             getRepository("category"),
//             getRepository("subject"),
//             getRepository("book"),
//             getRepository("language"),
//             getRepository("level"),
//           ]);

//         // Map only text for dropdowns
//         setCategories(categoryData.map((c) => c.text));
//         setSubjects(subjectData.map((s) => s.text));
//         setBooks(bookData.map((b) => b.text));
//         setLanguages(languageData.map((l) => l.text));
//         setEducationLevels(levelData.map((l) => l.text));
//       } catch (err) {
//         console.error("Failed to load form options:", err);

//         setCategories([]);
//         setSubjects([]);
//         setBooks([]);
//         setLanguages([]);
//         setEducationLevels([]);
//       }
//     };

//     loadFormOptions();
//   }, []);

//   useEffect(() => {
//     async function loadInitialData() {
//       try {
//         setLoading(true); // 🔄 START LOADER

//         const books = await fetchBooks();
//         setBookList(books);

//         // Classes load
//         setClasses(Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`));
//       } catch (err) {
//         console.error("Initial load error:", err);

//         // fallback classes
//         setClasses(Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`));
//       } finally {
//         setLoading(false); // ✅ STOP LOADER
//       }
//     }

//     loadInitialData();
//   }, [setLoading]);

//   useEffect(() => {
//     const loadFormOptions = async () => {
//       if (!formData.category) return; // agar category select nahi hui ho to return

//       try {
//         const [subjectData, bookData, languageData, levelData] =
//           await Promise.all([
//             getRepository("subject"),
//             getRepository("book"),
//             getRepository("language"),
//             getRepository("level"),
//           ]);

//         // frontend filter category ke hisab se
//         const selectedCategory = formData.category;

//         setSubjects(
//           subjectData
//             .filter((s) => s.category === selectedCategory)
//             .map((s) => s.text)
//         );
//         setBooks(
//           bookData
//             .filter((b) => b.category === selectedCategory)
//             .map((b) => b.text)
//         );
//         // setLanguages(
//         //   languageData
//         //     .filter((l) => l.category === selectedCategory)
//         //     .map((l) => l.text)
//         // );
//         setLanguages(languageData.map((l) => l.text));

//         setEducationLevels(
//           levelData
//             .filter((l) => l.category === selectedCategory)
//             .map((l) => l.text)
//         );
//       } catch (err) {
//         console.error(err);
//         setSubjects([]);
//         setBooks([]);
//         setLanguages([]);
//         setEducationLevels([]);
//       }
//     };

//     loadFormOptions();
//   }, [formData.category]);

//   const handleDelete = async (id) => {
//     const ok = await confirmDelete();

//     if (!ok) return;

//     try {
//       await deleteBook(id);
//       setBookList((prev) => prev.filter((book) => book.id !== id));
//       toast.success("Deleted successfully ✅");
//     } catch (err) {
//       toast.error("Delete failed ❌");
//       console.error("Delete error:", err);
//     }
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     try {
//       // COMMON CHECK
//       if (!formData.category) {
//         toast.warn("📌 Category is mandatory");
//         return;
//       }

//       // 📰 CURRENT AFFAIRS VALIDATION
//       if (formData.category === "Current Affairs") {
//         if (!formData.title?.trim()) {
//           toast.warn("📌 Title is mandatory");
//           return;
//         }

//         if (!formData.newsCategory?.trim()) {
//           toast.warn("📌 Please select Current Affairs category type");
//           return;
//         }

//         if (!formData.date) {
//           toast.warn("📌 Date is mandatory");
//           return;
//         }

//         // File OR link required
//         if (!formData.file && !formData.link) {
//           toast.warn("📌 Upload a file or provide a link");
//           return;
//         }
//       }

//       // --- IF ALL GOOD - CONTINUE YOUR OLD LOGIC ---
//       if (formData.category === "Current Affairs") {
//         const currentFormData = new FormData();

//         currentFormData.append("title", formData.title?.trim() || "");
//         currentFormData.append("mainCategory", formData.category || "");
//         currentFormData.append("category", formData.newsCategory || "");
//         currentFormData.append(
//           "description",
//           formData.description?.trim() || ""
//         );
//         currentFormData.append("date", formData.date || "");
//         currentFormData.append("source", formData.source?.trim() || "");
//         if (formData.file) currentFormData.append("file", formData.file);
//         if (formData.link) currentFormData.append("link", formData.link);

//         const result = await addCurrentAffairs(null, currentFormData);
//         if (result) {
//           toast.success("✅ Current Affairs added successfully");
//           setShowUploadModal(false);
//           setFormData({
//             bookName: "",
//             category: "",
//             subject: "",
//             educationLevel: "",
//             language: "",
//             file: null,
//             thumbnail: null,
//             title: "",
//             description: "",
//             newsCategory: "",
//             date: "",
//             source: "",
//             link: "",
//           });
//         } else toast.error("❌ Failed to add Current Affairs");
//       }

//       // Book Upload
//       else {
//         const uploadData = new FormData();
//         uploadData.append("bookName", formData.bookName);
//         uploadData.append("category", formData.category);
//         uploadData.append("subject", formData.subject);
//         uploadData.append("educationLevel", formData.educationLevel);
//         uploadData.append("language", formData.language);
//         if (formData.file) uploadData.append("file", formData.file);
//         if (formData.thumbnail)
//           uploadData.append("thumbnail", formData.thumbnail);

//         const result = await uploadBook(uploadData);
//         if (result && result.id) {
//           setBookList((prev) => [...prev, result]);
//           setShowUploadModal(false);
//           navigate(`/books/${result.id}/chapters`);
//           toast.success("✅ Book uploaded successfully");
//         } else {
//           toast.error("❌ Upload failed");
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("⚠️ Something went wrong during upload");
//     }
//   };

//   const getViewLabel = (type) => {
//     switch (type?.toLowerCase()) {
//       case "pdf":
//         return "📄 View";
//       case "video":
//         return "▶️ Play";
//       case "audio":
//         return "🔊 Listen";
//       default:
//         return "📁 Open";
//     }
//   };

//   const handleFullscreenToggle = () => {
//     const viewer = document.querySelector(".view-modal-container");
//     if (!viewer) return;
//     if (!document.fullscreenElement) {
//       viewer.requestFullscreen().then(() => setIsFullscreen(true));
//     } else {
//       document.exitFullscreen().then(() => setIsFullscreen(false));
//     }
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       setItemsPerPage(getItemsPerPage());
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);


//   const filteredBooks = bookList.filter((b) => {
//     const selectedClassNumber = selectedClass ? parseInt(selectedClass) : null;
//     const bookClassNumber = b.educationLevel
//       ? parseInt(b.educationLevel.toString().replace(/\D/g, ""))
//       : null;

//     const categoryMatch = b.category === filterCategory;

//     const classMatch =
//       filterCategory === "School Education" && selectedClass
//         ? bookClassNumber === selectedClassNumber
//         : true;

//     const text = `${b.bookName} ${b.subject} ${b.educationLevel}`.toLowerCase();
//     const searchMatch = text.includes(searchTerm.toLowerCase());

//     return categoryMatch && classMatch && searchMatch;
//   });


//   const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedBooks = filteredBooks.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   // PAGINATION NUMBERS (max 5 visible)
//   const getPageNumbers = () => {
//     let pages = [];
//     let start = Math.max(1, currentPage - 2);
//     let end = Math.min(totalPages, start + 4);

//     if (end - start < 4) {
//       start = Math.max(1, end - 4);
//     }

//     for (let i = start; i <= end; i++) {
//       pages.push(i);
//     }
//     return pages;
//   };

//   return (
//     <div className="flex min-h-screen bg-darkBg text-primaryWhite">
//       {Sidebar && (
//         <Sidebar
//           isOpen={isSidebarOpen}
//           onClose={() => setIsSidebarOpen(false)}
//         />
//       )}
//       <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
//         <div className="lg:hidden px-4 mb-4">
//           <button
//             onClick={() => setIsSidebarOpen(true)}
//             className="text-primaryWhite"
//           >
//             <FiMenu size={28} />
//           </button>
//         </div>
//         {Navbar && (
//           <Navbar
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             onAdd={() => setShowUploadModal(true)}
//             buttonLabel="+ Upload Content"
//             searchPlaceholder="Search Books..."
//           />
//         )}

//         <h1 className="text-2xl font-bold mb-4">📘 Manage Books</h1>

//         <div className="mb-4 flex gap-3 items-center">
//           {filterCategory === "School Education" && (
//             <>
//               <label className="font-medium">Classes:</label>
//               <select
//                 value={selectedClass}
//                 onChange={(e) => setSelectedClass(e.target.value)}
//                 className="border border-gray400 rounded px-2 py-1 text-primaryBlack"
//               >
//                 <option value="">All Classes</option>
//                 {classes.map((cls, idx) => (
//                   <option key={idx} value={cls.replace(/\D/g, "")}>
//                     {cls}
//                   </option>
//                 ))}
//               </select>
//             </>
//           )}

//           <div className="mb-4 flex gap-3 items-center">
//             <label className="font-medium">Category:</label>
//             <select
//               value={filterCategory}
//               onChange={(e) => {
//                 setFilterCategory(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="border border-gray400 rounded px-2 py-1 text-primaryBlack"
//             >
//               {categories.map((cat, idx) => (
//                 <option key={idx} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>

//           </div>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//           {paginatedBooks.map((b) => (
//             <div
//               key={b.id}
//               className="bg-primaryWhite/10 border border-primaryWhite/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300"
//             >
//               <div className="flex flex-col items-center gap-3">
//                 {/* Thumbnail */}
//                 <div className="relative w-full h-36 lg:h-44 bg-primaryBlack/10 rounded-lg overflow-hidden">
//                   <img
//                     src={getProxiedUrl(b.thumbnail)}
//                     alt={b.bookName}
//                     className="w-full h-full object-contain p-2"
//                   />
//                   <span className="absolute top-2 right-2 bg-primaryWhite/20 text-xs px-2 py-1 rounded-full text-primaryWhite border border-primaryWhite/30 backdrop-blur-sm">
//                     {getViewLabel(getBookResourceType(b))}
//                   </span>
//                 </div>

//                 {/* Text Section */}
//                 <div className="text-center w-full break-words">
//                   <h3 className="text-base text-md lg:text-lg font-bold mb-1">
//                     {b.bookName}
//                   </h3>
//                   <p className="text-sm sm:text-base text-gray300 mb-1">
//                     {b.subject}
//                   </p>
//                   <p className="text-xs sm:text-sm text-gray400">
//                     🎓 {b.educationLevel}
//                   </p>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex flex-col mt-auto pt-2 border-t border-primaryWhite/20">
//                 <button
//                   onClick={() => {
//                     setViewData(b);
//                     fetch(`${API_URL}/books/${b.id}/chapters/meta`, {
//                       credentials: "include",
//                     })
//                       .then((res) => res.json())
//                       .then((data) => {
//                         if (data.length > 0) {
//                           setSelectedChapter(data[0]); // pehla chapter open karo
//                         } else {
//                           setSelectedChapter(null);
//                         }
//                       });
//                     // setSelectedChapter(b.chapters?.[0] || null);
//                   }}
//                   className="w-full text-sm sm:text-base text-lightBlue hover:text-blue-300 font-semibold"
//                 >
//                   {getViewLabel(getBookResourceType(b))}
//                 </button>

//                 {role === "admin" && (
//                   <div className="flex justify-between mt-2">
//                     <button
//                       onClick={() => setEditData(b)}
//                       className="text-lightYellow hover:text-yellow-300 text-lg"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       onClick={() => navigate(`/books/${b.id}/chapters`)}
//                       className="text-lightGreen hover:text-green-300 text-lg"
//                       title="Manage Chapters"
//                     >
//                       📚
//                     </button>
//                     <button
//                       onClick={() => handleDelete(b.id)}
//                       className="text-primaryRed hover:text-lightRed text-lg"
//                     >
//                       <FaTrash />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center mt-6 gap-2 flex-wrap">
//             {/* First Page */}
//             <button
//               onClick={() => setCurrentPage(1)}
//               disabled={currentPage === 1}
//               className="px-3 py-1 bg-primaryWhite/10 border border-primaryWhite/20 rounded disabled:opacity-50"
//             >
//               « First
//             </button>

//             {/* Prev */}
//             <button
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="px-3 py-1 bg-primaryWhite/10 border border-primaryWhite/20 rounded disabled:opacity-50"
//             >
//               ‹ Prev
//             </button>

//             {/* Page Numbers */}
//             {getPageNumbers().map((num) => (
//               <button
//                 key={num}
//                 onClick={() => setCurrentPage(num)}
//                 className={`px-3 py-1 border rounded 
//           ${num === currentPage
//                     ? "bg-primaryBlue text-primaryWhite"
//                     : "bg-primaryWhite/10"
//                   }
//         `}
//               >
//                 {num}
//               </button>
//             ))}

//             {/* Next */}
//             <button
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//               className="px-3 py-1 bg-primaryWhite/10 border border-primaryWhite/20 rounded disabled:opacity-50"
//             >
//               Next ›
//             </button>

//             {/* Last Page */}
//             <button
//               onClick={() => setCurrentPage(totalPages)}
//               disabled={currentPage === totalPages}
//               className="px-3 py-1 bg-primaryWhite/10 border border-primaryWhite/20 rounded disabled:opacity-50"
//             >
//               Last »
//             </button>
//           </div>
//         )}

//         {showUploadModal && (
//           <div className="fixed inset-0 bg-primaryBlack bg-opacity-40 z-50 flex justify-center items-center">
//             <div className="bg-primaryWhite text-primaryBlack rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
//               <h2 className="text-2xl font-semibold mb-4 text-center">
//                 📤 Upload Resource
//               </h2>

//               <div className="mb-4">
//                 <label className="text-sm font-medium block mb-1">
//                   Select Category
//                 </label>

//                 <select
//                   value={formData.category}
//                   onChange={(e) => {
//                     const selectedCategory = e.target.value;

//                     setFormData((prev) => ({
//                       ...prev,
//                       category: selectedCategory,
//                       level: "",
//                       subject: "",
//                       resourceType: "",
//                       language: "",
//                       class: "",
//                       books: "",
//                     }));
//                   }}
//                   className="w-full border border-gray300 p-2 rounded text-sm"
//                 >
//                   <option value="">-- Choose Category --</option>
//                   {categories.map((cat, idx) => (
//                     <option key={idx} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <form className="grid gap-4" onSubmit={handleUpload}>
//                 {/* === BOOK UPLOAD FORM === */}
//                 {formData.category === "School Education" && (
//                   <>
//                     <div>
//                       <label className="text-sm font-medium">
//                         Education Level
//                       </label>
//                       <select
//                         value={formData.educationLevel}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             educationLevel: e.target.value,
//                           }))
//                         }
//                         className="border border-gray400 rounded px-2 py-1 text-primaryBlack w-full"
//                       >
//                         <option value="">Select Education Level</option>
//                         {educationLevels.map((level, idx) => (
//                           <option key={idx} value={level}>
//                             {level}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <input
//                       type="text"
//                       name="subject"
//                       placeholder="Select Subject"
//                       className="w-full border border-gray300 p-2 rounded text-sm"
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           subject: e.target.value,
//                         }))
//                       }
//                     />

//                     <input
//                       type="text"
//                       name="bookName"
//                       placeholder="Book Name"
//                       className="w-full border border-gray300 p-2 rounded text-sm"
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           bookName: e.target.value,
//                         }))
//                       }
//                     />

//                     {/* <div>
//                       <label className="text-sm font-medium">Subject</label>
//                       <select
//                         value={formData.subject}
//                         onChange={(e) =>
//                           setFormData((prev) => ({ ...prev, subject: e.target.value }))
//                         }
//                         className="w-full border border-gray300 p-2 rounded text-sm text-primaryBlack"
//                       >
//                         <option value="">Select Subject</option>
//                         {subjects.map((subj, idx) => (
//                           <option key={idx} value={subj}>{subj}</option>
//                         ))}
//                       </select>
//                     </div> */}

//                     <div>
//                       <label className="text-sm font-medium">Language</label>
//                       <select
//                         value={formData.language}
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             language: e.target.value,
//                           }))
//                         }
//                         className="w-full border border-gray300 p-2 rounded text-sm"
//                       >
//                         <option value="">Select Language</option>
//                         {languages.map((lang, idx) => (
//                           <option key={idx} value={lang}>
//                             {lang}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </>
//                 )}

//                 {formData.category === "Simulation" && (
//                   <>
//                     <input
//                       type="text"
//                       placeholder="Simulation Title"
//                       value={formData.bookName}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           bookName: e.target.value,
//                         }))
//                       }
//                     />

//                     <textarea
//                       placeholder="Simulation Description"
//                       value={formData.subject}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           subject: e.target.value,
//                         }))
//                       }
//                     />

//                     <select
//                       value={formData.grade}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           grade: e.target.value,
//                         }))
//                       }
//                     >
//                       <option value="">Select Grade</option>
//                       <option value="6">6</option>
//                       <option value="7">7</option>
//                       <option value="8">8</option>
//                     </select>

//                     <select
//                       value={formData.difficulty}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           difficulty: e.target.value,
//                         }))
//                       }
//                     >
//                       <option value="">Select Difficulty</option>
//                       <option value="Beginner">Beginner</option>
//                       <option value="Intermediate">Intermediate</option>
//                       <option value="Advanced">Advanced</option>
//                     </select>

//                     <input
//                       type="text"
//                       placeholder="Topics (comma separated)"
//                       value={formData.topic}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           topic: e.target.value,
//                         }))
//                       }
//                     />

//                     <input
//                       type="file"
//                       accept=".zip,.exe,.html"
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           file: e.target.files[0],
//                         }))
//                       }
//                     />

//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           thumbnail: e.target.files[0],
//                         }))
//                       }
//                     />

//                     <textarea
//                       placeholder="Prerequisites"
//                       value={formData.prerequisites}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           prerequisites: e.target.value,
//                         }))
//                       }
//                     />

//                     {/* <input
//                       type="text"
//                       placeholder="Tags (comma separated)"
//                       value={formData.tags}
//                       onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
//                     /> */}
//                   </>
//                 )}

//                 {/* === CURRENT AFFAIRS FORM === */}
//                 {formData.category === "Current Affairs" && (
//                   <>
//                     {/* 🔹 Title */}
//                     <input
//                       type="text"
//                       placeholder="News Title"
//                       className="w-full border border-gray300 p-2 rounded text-sm"
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           title: e.target.value,
//                         }))
//                       }
//                     />

//                     <div>
//                       <label className="text-sm font-medium text-primaryWhite">
//                         Full Description
//                       </label>

//                       <JoditEditor
//                         ref={editor}
//                         value={formData.description}
//                         config={{
//                           readonly: false,
//                           height: 300,
//                           toolbar: true,
//                           buttons: [
//                             "bold",
//                             "italic",
//                             "underline",
//                             "|",
//                             "ul",
//                             "ol",
//                             "|",
//                             "paragraph",
//                             "fontsize",
//                             "brush",
//                             "|",
//                             "h1",
//                             "h2",
//                             "h3",
//                             "|",
//                             "table",
//                             "link",
//                             "image",
//                             "|",
//                             "align",
//                             "undo",
//                             "redo",
//                           ],
//                           pastePlain: false, // IMPORTANT — Google Docs/Word formatting auto aa jayega
//                         }}
//                         onChange={(newContent) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             description: newContent,
//                           }))
//                         }
//                       />
//                     </div>

//                     {/* 🔹 Category Selection */}
//                     <div>
//                       <label className="text-sm font-medium">
//                         Category Type
//                       </label>
//                       <select
//                         className="w-full border border-gray300 p-2 rounded text-sm"
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             newsCategory: e.target.value,
//                           }))
//                         }
//                       >
//                         <option value="">Select Category</option>
//                         <option value="Science & Technology">
//                           Science & Technology
//                         </option>
//                         <option value="Economy">Economy</option>
//                         <option value="Environment">Environment</option>
//                         <option value="Sports">Sports</option>
//                         <option value="Daily Current Affairs">
//                           Daily Current Affairs
//                         </option>
//                       </select>
//                     </div>

//                     {/* 🔹 Date Picker */}
//                     <div>
//                       <label className="text-sm font-medium">Date</label>
//                       <input
//                         type="date"
//                         className="w-full border border-gray300 p-2 rounded text-sm"
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             date: e.target.value,
//                           }))
//                         }
//                       />
//                     </div>

//                     {/* 🔹 Author / Source */}
//                     <div>
//                       <label className="text-sm font-medium">
//                         Source / Author
//                       </label>
//                       <input
//                         type="text"
//                         placeholder="e.g. PIB, The Hindu, Times of India"
//                         className="w-full border border-gray300 p-2 rounded text-sm"
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             source: e.target.value,
//                           }))
//                         }
//                       />
//                     </div>

//                     {/* 🔹 Tags / Keywords */}
//                     {/* <div>
//                       <label className="text-sm font-medium">Tags (comma separated)</label>
//                       <input
//                         type="text"
//                         placeholder="e.g. economy, budget, RBI"
//                         className="w-full border border-gray300 p-2 rounded text-sm"
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             tags: e.target.value.split(",").map((tag) => tag.trim()),
//                           }))
//                         }
//                       />
//                     </div> */}

//                     {/* 🔹 Thumbnail Image */}
//                     {/* <div>
//                       <label className="text-sm font-medium">Thumbnail Image</label>
//                       <input
//                         type="file"
//                         accept="image/*"
//                         className="w-full border p-2 rounded text-sm"
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             thumbnail: e.target.files[0],
//                           }))
//                         }
//                       />
//                     </div> */}

//                     {/* 🔹 Full News File (Optional PDF or Image) */}
//                     <div>
//                       <label className="text-sm font-medium">
//                         Upload File (PDF / Image)
//                       </label>
//                       <input
//                         type="file"
//                         accept=".pdf,image/*"
//                         className="w-full border p-2 rounded text-sm"
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             file: e.target.files[0],
//                           }))
//                         }
//                       />
//                     </div>

//                     {/* 🔹 External Link (optional) */}
//                     <div>
//                       <label className="text-sm font-medium">
//                         External News Link
//                       </label>
//                       <input
//                         type="url"
//                         placeholder="https://example.com/news-article"
//                         className="w-full border border-gray300 p-2 rounded text-sm"
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             link: e.target.value,
//                           }))
//                         }
//                       />
//                     </div>
//                   </>
//                 )}

//                 {/* Custom Category Form */}
//                 {formData.category &&
//                   ![
//                     "School Education",
//                     "Current Affairs",
//                     "Simulation",
//                   ].includes(formData.category) && (
//                     <>
//                       {/* Class Dropdown - from educationLevels */}
//                       <div className="mb-4">
//                         <label className="text-sm font-medium block mb-1">
//                           Education Level
//                         </label>
//                         <select
//                           name="educationLevel"
//                           value={formData.educationLevel || ""}
//                           onChange={handleChange}
//                           className="w-full border border-gray300 p-2 rounded text-sm"
//                         >
//                           <option value="">Select Class</option>
//                           {educationLevels.map((level, index) => (
//                             <option key={index} value={level}>
//                               {level}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Subject Dropdown - from subjects */}
//                       <div className="mb-4">
//                         <label className="text-sm font-medium block mb-1">
//                           Subject
//                         </label>
//                         <select
//                           name="subject"
//                           value={formData.subject || ""}
//                           onChange={handleChange}
//                           className="w-full border border-gray300 p-2 rounded text-sm"
//                         >
//                           <option value="">Select Subject</option>
//                           {subjects.map((subject, index) => (
//                             <option key={index} value={subject}>
//                               {subject}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Books Dropdown - from books */}
//                       <div className="mb-4">
//                         <label className="text-sm font-medium block mb-1">
//                           Books
//                         </label>
//                         <select
//                           name="bookName"
//                           value={formData.bookName || ""}
//                           onChange={handleChange}
//                           className="w-full border border-gray300 p-2 rounded text-sm"
//                         >
//                           <option value="">Select Book</option>
//                           {books.map((book, index) => (
//                             <option key={index} value={book}>
//                               {book}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Language Dropdown - from languages */}
//                       <div className="mb-4">
//                         <label className="text-sm font-medium block mb-1">
//                           Language
//                         </label>
//                         <select
//                           name="language"
//                           value={formData.language || ""}
//                           onChange={handleChange}
//                           className="w-full border border-gray300 p-2 rounded text-sm"
//                         >
//                           <option value="">Select Language</option>
//                           {languages.map((lang, index) => (
//                             <option key={index} value={lang}>
//                               {lang}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </>
//                   )}

//                 {/* Buttons */}
//                 <div className="flex justify-end gap-3 mt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowUploadModal(false)}
//                     className="px-4 py-1 border rounded hover:bg-gray-100"
//                   >
//                     ❌ Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-1 bg-primaryBlue text-primaryWhite rounded hover:bg-hoverBlue"
//                   >
//                     ✅ Upload
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//         {editData && (
//           <div className="fixed inset-0 bg-primaryBlack bg-opacity-40 z-50 flex justify-center items-center">
//             <div className="bg-primaryWhite text-primaryBlack rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
//               <h2 className="text-2xl font-semibold mb-4 text-center">
//                 ✏️ Edit Book
//               </h2>

//               <form
//                 className="grid gap-4"
//                 onSubmit={async (e) => {
//                   e.preventDefault();

//                   const fd = new FormData();

//                   // Append text fields
//                   [
//                     "bookName",
//                     "category",
//                     "subject",
//                     "educationLevel",
//                     "language",
//                     "resourceType",
//                     "totalPages",
//                   ].forEach((key) => {
//                     if (editData[key] !== undefined && editData[key] !== null) {
//                       fd.append(key, editData[key]);
//                     }
//                   });

//                   // Append main file if selected
//                   if (editData.file instanceof File)
//                     fd.append("file", editData.file);

//                   // Append thumbnail if selected
//                   if (editData.thumbnail instanceof File)
//                     fd.append("thumbnail", editData.thumbnail);

//                   try {
//                     const res = await fetch(`${API_URL}/books/${editData.id}`, {
//                       method: "PATCH",
//                       body: fd,
//                       credentials: "include",
//                       // DO NOT set Content-Type; browser sets multipart/form-data automatically
//                     });

//                     const result = await res.json();

//                     if (res.ok) {
//                       setBookList((prev) =>
//                         prev.map((book) =>
//                           book.id === editData.id ? result.book || result : book
//                         )
//                       );
//                       setEditData(null);
//                       toast.success("✅ Book updated");
//                     } else {
//                       toast.error(result.message || "Update failed ❌");
//                     }
//                   } catch (err) {
//                     console.error("Update error:", err);
//                     toast.error("Something went wrong ❗");
//                   }
//                 }}
//               >
//                 {/* Text Inputs */}
//                 {[
//                   "bookName",
//                   "subject",
//                   "category",
//                   "educationLevel",
//                   "language",
//                   "resourceType",
//                 ].map((key) => (
//                   <input
//                     key={key}
//                     type="text"
//                     name={key}
//                     value={editData[key] || ""}
//                     onChange={(e) =>
//                       setEditData((prev) => ({
//                         ...prev,
//                         [key]: e.target.value,
//                       }))
//                     }
//                     placeholder={key}
//                     className="w-full border border-gray300 p-2 rounded text-sm"
//                   />
//                 ))}

//                 {/* Thumbnail Upload */}
//                 <div>
//                   <label className="text-sm font-medium">Thumbnail Image</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     name="thumbnail"
//                     className="w-full border p-2 rounded text-sm"
//                     onChange={(e) =>
//                       setEditData((prev) => ({
//                         ...prev,
//                         thumbnail: e.target.files[0],
//                       }))
//                     }
//                   />
//                 </div>

//                 <div className="flex justify-end gap-3 mt-4">
//                   <button
//                     type="button"
//                     onClick={() => setEditData(null)}
//                     className="px-4 py-1 border rounded hover:bg-gray-100"
//                   >
//                     ❌ Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-1 bg-primaryBlue text-primaryWhite rounded hover:bg-hoverBlue"
//                   >
//                     ✅ Update
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* View Modal */}
//         {viewData && selectedChapter && (
//           <div className="fixed inset-0 z-50 bg-primaryBlack bg-opacity-60 flex justify-center items-center">
//             <div className="relative w-full h-full flex items-center justify-center">
//               <div className="relative bg-primaryWhite/10 backdrop-blur-md shadow-2xl rounded-xl border border-primaryWhite/20 w-[95%] h-[90%] max-w-6xl max-h-[95%] overflow-hidden flex flex-col view-modal-container">
//                 <div className="flex items-center justify-between px-6 py-2 bg-primaryWhite/5 border-b border-primaryWhite/20">
//                   <h3 className="text-xl font-bold text-primaryWhite">
//                     {getBookResourceType(viewData)}
//                   </h3>
//                   <div className="flex items-center gap-4">
//                     {(getBookResourceType(viewData) === "pdf" ||
//                       getBookResourceType(viewData) === "audio") && (
//                         <button
//                           onClick={handleFullscreenToggle}
//                           className="text-primaryWhite text-xl hover:text-lightGreen"
//                           title="Toggle Fullscreen"
//                         >
//                           {isFullscreen ? <FaCompress /> : <FaExpand />}
//                         </button>
//                       )}
//                     <button
//                       onClick={() => setViewData(null)}
//                       className="text-primaryWhite text-2xl hover:text-primaryRed"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex-1 overflow-hidden bg-primaryBlack">
//                   {getBookResourceType(viewData) === "pdf" &&
//                     selectedChapter && (
//                       <FlipbookPDFViewer
//                         chapter={selectedChapter}
//                         bookId={viewData.id}
//                       />
//                     )}

//                   {getBookResourceType(viewData) === "video" && (
//                     <video controls className="w-full h-full object-contain">
//                       <source
//                         src={getProxiedUrl(viewData.fileUrl)}
//                         type="video/mp4"
//                       />
//                     </video>
//                   )}

//                   {getBookResourceType(viewData) === "audio" && (
//                     <div className="flex flex-col items-center justify-center h-full gap-4 text-primaryWhite">
//                       <img
//                         src={getProxiedUrl(
//                           viewData.thumbnail || "default-audio-cover.jpg"
//                         )}
//                         alt="Thumbnail"
//                         className="w-60 h-60 object-cover rounded-lg shadow-lg"
//                       />
//                       <audio controls className="w-2/3">
//                         <source
//                           src={getProxiedUrl(viewData.fileUrl)}
//                           type="audio/mpeg"
//                         />
//                       </audio>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }











import { useEffect, useState } from "react";
import FlipbookPDFViewer from "./FlipbookPDFViewer";
import { FaEdit, FaTrash, FaExpand, FaCompress, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { FiMenu } from "react-icons/fi";
import { confirmDelete } from "../utils/confirmDelete";
import { getRepository } from "../apiServices/apiRepository";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import { useLoader } from "../LoaderContext";
import { fetchSimulationData, createSimulation } from "../apiServices/simulationApi";
import SimulationModal from "../Pages/Student/SimulationModal";
import { fetchCurrentAffairs } from "../apiServices/booksApi";

import {
  fetchBooks,
  uploadBook,
  deleteBook,
  addCurrentAffairs,
} from "../apiServices/booksApi";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const getProxiedUrl = (url) => {
  if (!url) return null;
  if (url.includes("/index.php/s/")) {
    if (!url.endsWith("/download")) url = url.replace(/\/+$/, "") + "/download";
  }
  return `${API_URL}/books/proxy/file?url=${encodeURIComponent(url)}`;
};
// const chapterUrl = useMemo(() => {
//   if (!chapter) return null;
//   return getProxiedUrl(chapter.fileUrl);
// }, [chapter]);

const getBookResourceType = (book) => book.chapters?.[0]?.resourceType || "pdf";

const getItemsPerPage = () => {
  if (window.innerWidth < 640) return 4;
  if (window.innerWidth < 1024) return 6;
  return 8;
};

export default function ManageBooksPage({ role, Navbar, Sidebar }) {
  const SIMULATION_PER_PAGE = 8;

  const [simulationPage, setSimulationPage] = useState(1);

  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookList, setBookList] = useState([]);
  const [editData, setEditData] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("School Education");
  const [simulationData, setSimulationData] = useState([]);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [currentAffairs, setCurrentAffairs] = useState([]);
  const [loadingCurrentAffairs, setLoadingCurrentAffairs] = useState(false);

  const [formData, setFormData] = useState({
    bookName: "",
    category: "",
    subject: "",
    educationLevel: "",
    language: "",
    file: null,
    thumbnail: null,

    //current affairs
    title: "",
    description: "",
    newsCategory: "",
    date: "",
    source: "",
    link: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  const [subjects, setSubjects] = useState([]);
  const [books, setBooks] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [openSimulation, setOpenSimulation] = useState(null);
  const editor = useRef(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getRepository("category");

        const categoryList = [...new Set(data.map((item) => item.text))];

        setCategories(categoryList);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    loadCategories();
  }, []);


  useEffect(() => {
    if (filterCategory === "Simulation") {
      loadSimulations();
    }
  }, [filterCategory]);

  const loadSimulations = async () => {
    setLoading(true); // 🔄 START LOADER
    try {
      const res = await fetchSimulationData();
      setSimulationData(res.data || res);
    } catch (err) {
      console.error("Simulation fetch error:", err);
    } finally {
      setLoading(false); // ✅ STOP LOADER
    }
  };

  const totalSimulationPages = Math.ceil(
    simulationData.length / SIMULATION_PER_PAGE
  );

  const simulationStartIndex =
    (simulationPage - 1) * SIMULATION_PER_PAGE;

  const paginatedSimulations = simulationData.slice(
    simulationStartIndex,
    simulationStartIndex + SIMULATION_PER_PAGE
  );


  useEffect(() => {
    if (filterCategory === "Current Affairs") {
      loadCurrentAffairs();
    }
  }, [filterCategory]);

  const loadCurrentAffairs = async () => {
    setLoading(true); // 🔄 START LOADER
    try {
      const data = await fetchCurrentAffairs();
      setCurrentAffairs(data);
    } catch (err) {
      console.error("Failed to load current affairs", err);
    } finally {
      setLoading(false); // ✅ STOP LOADER
    }
  };

  useEffect(() => {
    const loadFormOptions = async () => {
      try {
        const [categoryData, subjectData, bookData, languageData, levelData] =
          await Promise.all([
            getRepository("category"),
            getRepository("subject"),
            getRepository("book"),
            getRepository("language"),
            getRepository("level"),
          ]);

        // Map only text for dropdowns
        setCategories(categoryData.map((c) => c.text));
        setSubjects(subjectData.map((s) => s.text));
        setBooks(bookData.map((b) => b.text));
        setLanguages(languageData.map((l) => l.text));
        setEducationLevels(levelData.map((l) => l.text));
      } catch (err) {
        console.error("Failed to load form options:", err);

        setCategories([]);
        setSubjects([]);
        setBooks([]);
        setLanguages([]);
        setEducationLevels([]);
      }
    };

    loadFormOptions();
  }, []);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true); // 🔄 START LOADER

        const books = await fetchBooks();
        setBookList(books);

        // Classes load
        setClasses(Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`));
      } catch (err) {
        console.error("Initial load error:", err);

        // fallback classes
        setClasses(Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`));
      } finally {
        setLoading(false); // ✅ STOP LOADER
      }
    }

    loadInitialData();
  }, [setLoading]);

  useEffect(() => {
    const loadFormOptions = async () => {
      if (!formData.category) return; // agar category select nahi hui ho to return

      try {
        const [subjectData, bookData, languageData, levelData] =
          await Promise.all([
            getRepository("subject"),
            getRepository("book"),
            getRepository("language"),
            getRepository("level"),
          ]);

        // frontend filter category ke hisab se
        const selectedCategory = formData.category;

        setSubjects(
          subjectData
            .filter((s) => s.category === selectedCategory)
            .map((s) => s.text)
        );
        setBooks(
          bookData
            .filter((b) => b.category === selectedCategory)
            .map((b) => b.text)
        );
        // setLanguages(
        //   languageData
        //     .filter((l) => l.category === selectedCategory)
        //     .map((l) => l.text)
        // );
        setLanguages(languageData.map((l) => l.text));

        setEducationLevels(
          levelData
            .filter((l) => l.category === selectedCategory)
            .map((l) => l.text)
        );
      } catch (err) {
        console.error(err);
        setSubjects([]);
        setBooks([]);
        setLanguages([]);
        setEducationLevels([]);
      }
    };

    loadFormOptions();
  }, [formData.category]);

  const handleDelete = async (id) => {
    const ok = await confirmDelete();

    if (!ok) return;

    try {
      await deleteBook(id);
      setBookList((prev) => prev.filter((book) => book.id !== id));
      toast.success("Deleted successfully ✅");
    } catch (err) {
      toast.error("Delete failed ❌");
      console.error("Delete error:", err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      // COMMON CHECK
      if (!formData.category) {
        toast.warn("📌 Category is mandatory");
        return;
      }

      // ================= SIMULATION UPLOAD =================
      if (formData.category === "Simulation") {
        if (!formData.bookName || !formData.simulationLink) {
          toast.warn("📌 Simulation Title & URL are mandatory");
          return;
        }

        const payload = {
          title: formData.bookName,
          subject: formData.subject,
          topic: formData.topic,
          grade: formData.grade,
          link: formData.simulationLink,
          image: formData.thumbnailUrl,
        };

        try {
          setLoading(true);

          await createSimulation(payload);

          toast.success("✅ Simulation added successfully");

          setShowUploadModal(false);

          setFormData((prev) => ({
            ...prev,
            bookName: "",
            subject: "",
            topic: "",
            grade: "",
            simulationLink: "",
            image: "",
            category: "",
          }));

          loadSimulations(); // 🔄 refresh list
        } catch (err) {
          console.error("Simulation create error:", err);
          toast.error("❌ Failed to add simulation");
        } finally {
          setLoading(false);
        }

        return; // ⛔ VERY IMPORTANT (Book upload na chale)
      }


      // 📰 CURRENT AFFAIRS VALIDATION
      if (formData.category === "Current Affairs") {
        if (!formData.title?.trim()) {
          toast.warn("📌 Title is mandatory");
          return;
        }

        if (!formData.newsCategory?.trim()) {
          toast.warn("📌 Please select Current Affairs category type");
          return;
        }

        if (!formData.date) {
          toast.warn("📌 Date is mandatory");
          return;
        }

        // File OR link required
        if (!formData.file && !formData.link) {
          toast.warn("📌 Upload a file or provide a link");
          return;
        }
      }

      // --- IF ALL GOOD - CONTINUE YOUR OLD LOGIC ---
      if (formData.category === "Current Affairs") {
        const currentFormData = new FormData();

        currentFormData.append("title", formData.title?.trim() || "");
        currentFormData.append("mainCategory", formData.category || "");
        currentFormData.append("category", formData.newsCategory || "");
        currentFormData.append(
          "description",
          formData.description?.trim() || ""
        );
        currentFormData.append("date", formData.date || "");
        currentFormData.append("source", formData.source?.trim() || "");
        if (formData.file) currentFormData.append("file", formData.file);
        if (formData.link) currentFormData.append("link", formData.link);

        const result = await addCurrentAffairs(null, currentFormData);
        if (result) {
          toast.success("✅ Current Affairs added successfully");
          setShowUploadModal(false);
          setFormData({
            bookName: "",
            category: "",
            subject: "",
            educationLevel: "",
            language: "",
            file: null,
            thumbnail: null,
            title: "",
            description: "",
            newsCategory: "",
            date: "",
            source: "",
            link: "",
          });
        } else toast.error("❌ Failed to add Current Affairs");
      }

      // Book Upload
      else {
        const uploadData = new FormData();
        uploadData.append("bookName", formData.bookName);
        uploadData.append("category", formData.category);
        uploadData.append("subject", formData.subject);
        uploadData.append("educationLevel", formData.educationLevel);
        uploadData.append("language", formData.language);
        if (formData.file) uploadData.append("file", formData.file);
        if (formData.thumbnail)
          uploadData.append("thumbnail", formData.thumbnail);

        const result = await uploadBook(uploadData);
        if (result && result.id) {
          setBookList((prev) => [...prev, result]);
          setShowUploadModal(false);
          navigate(`/books/${result.id}/chapters`);
          toast.success("✅ Book uploaded successfully");
        } else {
          toast.error("❌ Upload failed");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("⚠️ Something went wrong during upload");
    }
  };

  const getViewLabel = (type) => {
    switch (type?.toLowerCase()) {
      case "pdf":
        return "📄 View";
      case "video":
        return "▶️ Play";
      case "audio":
        return "🔊 Listen";
      default:
        return "📁 Open";
    }
  };

  const handleFullscreenToggle = () => {
    const viewer = document.querySelector(".view-modal-container");
    if (!viewer) return;
    if (!document.fullscreenElement) {
      viewer.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const filteredBooks = bookList.filter((b) => {
    const selectedClassNumber = selectedClass ? parseInt(selectedClass) : null;
    const bookClassNumber = b.educationLevel
      ? parseInt(b.educationLevel.toString().replace(/\D/g, ""))
      : null;

    const categoryMatch = b.category === filterCategory;

    const classMatch =
      filterCategory === "School Education" && selectedClass
        ? bookClassNumber === selectedClassNumber
        : true;

    const text = `${b.bookName} ${b.subject} ${b.educationLevel}`.toLowerCase();
    const searchMatch = text.includes(searchTerm.toLowerCase());

    return categoryMatch && classMatch && searchMatch;
  });


  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // PAGINATION NUMBERS (max 5 visible)
  const getPageNumbers = () => {
    let pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex min-h-screen bg-darkBg text-primaryWhite">
      {Sidebar && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
        <div className="lg:hidden px-4 mb-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-primaryWhite"
          >
            <FiMenu size={28} />
          </button>
        </div>
        {Navbar && (
          <Navbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAdd={() => setShowUploadModal(true)}
            buttonLabel="+ Upload Content"
            searchPlaceholder="Search Books..."
          />
        )}

        <h1 className="text-2xl font-bold mb-4">📘 Manage Books</h1>

        <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-center">

          {/* Category – mobile me TOP, desktop me RIGHT */}
          <div className="flex gap-3 items-center order-1 md:order-2">
            <label className="font-medium whitespace-nowrap">Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
                setSimulationPage(1);
              }}
              className="border border-gray400 rounded px-2 py-1 text-primaryBlack"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Classes – mobile me BELOW category */}
          {filterCategory === "School Education" && (
            <div className="flex gap-3 items-center order-2 md:order-1">
              <label className="font-medium whitespace-nowrap">Classes:</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border border-gray400 rounded px-2 py-1 text-primaryBlack"
              >
                <option value="">All Classes</option>
                {classes.map((cls, idx) => (
                  <option key={idx} value={cls.replace(/\D/g, "")}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          )}

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {paginatedBooks.map((b) => (
            <div
              key={b.id}
              className="bg-primaryWhite/10 border border-primaryWhite/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-3">
                {/* Thumbnail */}
                <div className="relative w-full h-36 lg:h-44 bg-primaryBlack/10 rounded-lg overflow-hidden">
                  <img
                    src={getProxiedUrl(b.thumbnail)}
                    alt={b.bookName}
                    className="w-full h-full object-contain p-2"
                  />
                  <span className="absolute top-2 right-2 bg-primaryWhite/20 text-xs px-2 py-1 rounded-full text-primaryWhite border border-primaryWhite/30 backdrop-blur-sm">
                    {getViewLabel(getBookResourceType(b))}
                  </span>
                </div>

                {/* Text Section */}
                <div className="text-center w-full break-words">
                  <h3 className="text-base text-md lg:text-lg font-bold mb-1">
                    {b.bookName}
                  </h3>
                  <p className="text-sm sm:text-base text-gray300 mb-1">
                    {b.subject}
                  </p>
                  <p className="text-xs sm:text-sm text-gray400">
                    🎓 {b.educationLevel}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col mt-auto pt-2 border-t border-primaryWhite/20">
                <button
                  onClick={() => {
                    setViewData(b);
                    fetch(`${API_URL}/books/${b.id}/chapters/meta`, {
                      credentials: "include",
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        if (data.length > 0) {
                          setSelectedChapter(data[0]); // pehla chapter open karo
                        } else {
                          setSelectedChapter(null);
                        }
                      });
                    // setSelectedChapter(b.chapters?.[0] || null);
                  }}
                  className="w-full text-sm sm:text-base text-lightBlue hover:text-blue-300 font-semibold"
                >
                  {getViewLabel(getBookResourceType(b))}
                </button>

                {role === "admin" && (
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => setEditData(b)}
                      className="text-lightYellow hover:text-yellow-300 text-lg"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => navigate(`/books/${b.id}/chapters`)}
                      className="text-lightGreen hover:text-green-300 text-lg"
                      title="Manage Chapters"
                    >
                      📚
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-primaryRed hover:text-lightRed text-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2 flex-wrap">
            {/* First Page */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-primaryWhite/10 border border-primaryWhite/20 rounded disabled:opacity-50"
            >
              « First
            </button>

            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-primaryWhite/10 border border-primaryWhite/20 rounded disabled:opacity-50"
            >
              ‹ Prev
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 border rounded 
          ${num === currentPage
                    ? "bg-primaryBlue text-primaryWhite"
                    : "bg-primaryWhite/10"
                  }
        `}
              >
                {num}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-primaryWhite/10 border border-primaryWhite/20 rounded disabled:opacity-50"
            >
              Next ›
            </button>

            {/* Last Page */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-primaryWhite/10 border border-primaryWhite/20 rounded disabled:opacity-50"
            >
              Last »
            </button>
          </div>
        )}

        {showUploadModal && (
          <div className="fixed inset-0 bg-primaryBlack bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-primaryWhite text-primaryBlack rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                📤 Upload Resource
              </h2>

              <div className="mb-4">
                <label className="text-sm font-medium block mb-1">
                  Select Category
                </label>

                <select
                  value={formData.category}
                  onChange={(e) => {
                    const selectedCategory = e.target.value;

                    setFormData((prev) => ({
                      ...prev,
                      category: selectedCategory,
                      level: "",
                      subject: "",
                      resourceType: "",
                      language: "",
                      class: "",
                      books: "",
                    }));
                  }}
                  className="w-full border border-gray300 p-2 rounded text-sm"
                >
                  <option value="">-- Choose Category --</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <form className="grid gap-4" onSubmit={handleUpload}>
                {/* === BOOK UPLOAD FORM === */}
                {formData.category === "School Education" && (
                  <>
                    <div>
                      <label className="text-sm font-medium">
                        Education Level
                      </label>
                      <select
                        value={formData.educationLevel}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            educationLevel: e.target.value,
                          }))
                        }
                        className="border border-gray400 rounded px-2 py-1 text-primaryBlack w-full"
                      >
                        <option value="">Select Education Level</option>
                        {educationLevels.map((level, idx) => (
                          <option key={idx} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      type="text"
                      name="subject"
                      placeholder="Select Subject"
                      className="w-full border border-gray300 p-2 rounded text-sm"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                    />

                    <input
                      type="text"
                      name="bookName"
                      placeholder="Book Name"
                      className="w-full border border-gray300 p-2 rounded text-sm"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bookName: e.target.value,
                        }))
                      }
                    />

                    {/* <div>
                      <label className="text-sm font-medium">Subject</label>
                      <select
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, subject: e.target.value }))
                        }
                        className="w-full border border-gray300 p-2 rounded text-sm text-primaryBlack"
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((subj, idx) => (
                          <option key={idx} value={subj}>{subj}</option>
                        ))}
                      </select>
                    </div> */}

                    <div>
                      <label className="text-sm font-medium">Language</label>
                      <select
                        value={formData.language}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            language: e.target.value,
                          }))
                        }
                        className="w-full border border-gray300 p-2 rounded text-sm"
                      >
                        <option value="">Select Language</option>
                        {languages.map((lang, idx) => (
                          <option key={idx} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {formData.category === "Simulation" && (
                  <div className="flex flex-col gap-4">

                    {/* Simulation Title */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Simulation Title
                      </label>
                      <input
                        type="text"
                        value={formData.bookName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bookName: e.target.value,
                          }))
                        }
                        className="border rounded px-3 py-2"
                      />
                    </div>

                    {/* Subject / Description */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Subject / Description
                      </label>
                      <textarea
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        className="border rounded px-3 py-2"
                        rows={3}
                      />
                    </div>

                    {/* Grade */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Grade
                      </label>
                      <select
                        value={formData.grade}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            grade: e.target.value,
                          }))
                        }
                        className="border rounded px-3 py-2"
                      >
                        <option value="">Select Grade</option>
                        <option value="Middle School">Middle School</option>
                        <option value="High School">High School</option>
                      </select>
                    </div>

                    {/* Topic */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Topic
                      </label>
                      <input
                        type="text"
                        value={formData.topic}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            topic: e.target.value,
                          }))
                        }
                        className="border rounded px-3 py-2"
                        placeholder="e.g. Electricity, Circuits"
                      />
                    </div>

                    {/* Simulation URL */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Simulation URL
                      </label>
                      <input
                        type="text"
                        value={formData.simulationLink}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            simulationLink: e.target.value,
                          }))
                        }
                        className="border rounded px-3 py-2"
                      />
                    </div>

                    {/* Thumbnail Image URL */}
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">
                        Thumbnail Image
                      </label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            thumbnailUrl: e.target.value,
                          }))
                        }
                        className="border rounded px-3 py-2"
                      />
                    </div>

                  </div>
                )}



                {/* === CURRENT AFFAIRS FORM === */}
                {formData.category === "Current Affairs" && (
                  <>
                    {/* 🔹 Title */}
                    <input
                      type="text"
                      placeholder="News Title"
                      className="w-full border border-gray300 p-2 rounded text-sm"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />

                    <div>
                      <label className="text-sm font-medium text-primaryWhite">
                        Full Description
                      </label>

                      <JoditEditor
                        ref={editor}
                        value={formData.description}
                        config={{
                          readonly: false,
                          height: 300,
                          toolbar: true,
                          buttons: [
                            "bold",
                            "italic",
                            "underline",
                            "|",
                            "ul",
                            "ol",
                            "|",
                            "paragraph",
                            "fontsize",
                            "brush",
                            "|",
                            "h1",
                            "h2",
                            "h3",
                            "|",
                            "table",
                            "link",
                            "image",
                            "|",
                            "align",
                            "undo",
                            "redo",
                          ],
                          pastePlain: false, // IMPORTANT — Google Docs/Word formatting auto aa jayega
                        }}
                        onChange={(newContent) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: newContent,
                          }))
                        }
                      />
                    </div>

                    {/* 🔹 Category Selection */}
                    <div>
                      <label className="text-sm font-medium">
                        Category Type
                      </label>
                      <select
                        className="w-full border border-gray300 p-2 rounded text-sm"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            newsCategory: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Category</option>
                        <option value="Science & Technology">
                          Science & Technology
                        </option>
                        <option value="Economy">Economy</option>
                        <option value="Environment">Environment</option>
                        <option value="Sports">Sports</option>
                        <option value="Daily Current Affairs">
                          Daily Current Affairs
                        </option>
                      </select>
                    </div>

                    {/* 🔹 Date Picker */}
                    <div>
                      <label className="text-sm font-medium">Date</label>
                      <input
                        type="date"
                        className="w-full border border-gray300 p-2 rounded text-sm"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* 🔹 Author / Source */}
                    <div>
                      <label className="text-sm font-medium">
                        Source / Author
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. PIB, The Hindu, Times of India"
                        className="w-full border border-gray300 p-2 rounded text-sm"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            source: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* 🔹 Tags / Keywords */}
                    {/* <div>
                      <label className="text-sm font-medium">Tags (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. economy, budget, RBI"
                        className="w-full border border-gray300 p-2 rounded text-sm"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tags: e.target.value.split(",").map((tag) => tag.trim()),
                          }))
                        }
                      />
                    </div> */}

                    {/* 🔹 Thumbnail Image */}
                    {/* <div>
                      <label className="text-sm font-medium">Thumbnail Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full border p-2 rounded text-sm"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            thumbnail: e.target.files[0],
                          }))
                        }
                      />
                    </div> */}

                    {/* 🔹 Full News File (Optional PDF or Image) */}
                    <div>
                      <label className="text-sm font-medium">
                        Upload File (PDF / Image)
                      </label>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="w-full border p-2 rounded text-sm"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            file: e.target.files[0],
                          }))
                        }
                      />
                    </div>

                    {/* 🔹 External Link (optional) */}
                    <div>
                      <label className="text-sm font-medium">
                        External News Link
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/news-article"
                        className="w-full border border-gray300 p-2 rounded text-sm"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            link: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </>
                )}

                {/* Custom Category Form */}
                {formData.category &&
                  ![
                    "School Education",
                    "Current Affairs",
                    "Simulation",
                  ].includes(formData.category) && (
                    <>
                      {/* Class Dropdown - from educationLevels */}
                      <div className="mb-4">
                        <label className="text-sm font-medium block mb-1">
                          Education Level
                        </label>
                        <select
                          name="educationLevel"
                          value={formData.educationLevel || ""}
                          onChange={handleChange}
                          className="w-full border border-gray300 p-2 rounded text-sm"
                        >
                          <option value="">Select Class</option>
                          {educationLevels.map((level, index) => (
                            <option key={index} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subject Dropdown - from subjects */}
                      <div className="mb-4">
                        <label className="text-sm font-medium block mb-1">
                          Subject
                        </label>
                        <select
                          name="subject"
                          value={formData.subject || ""}
                          onChange={handleChange}
                          className="w-full border border-gray300 p-2 rounded text-sm"
                        >
                          <option value="">Select Subject</option>
                          {subjects.map((subject, index) => (
                            <option key={index} value={subject}>
                              {subject}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Books Dropdown - from books */}
                      <div className="mb-4">
                        <label className="text-sm font-medium block mb-1">
                          Books
                        </label>
                        <select
                          name="bookName"
                          value={formData.bookName || ""}
                          onChange={handleChange}
                          className="w-full border border-gray300 p-2 rounded text-sm"
                        >
                          <option value="">Select Book</option>
                          {books.map((book, index) => (
                            <option key={index} value={book}>
                              {book}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Language Dropdown - from languages */}
                      <div className="mb-4">
                        <label className="text-sm font-medium block mb-1">
                          Language
                        </label>
                        <select
                          name="language"
                          value={formData.language || ""}
                          onChange={handleChange}
                          className="w-full border border-gray300 p-2 rounded text-sm"
                        >
                          <option value="">Select Language</option>
                          {languages.map((lang, index) => (
                            <option key={index} value={lang}>
                              {lang}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-1 border rounded hover:bg-gray-100"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-primaryBlue text-primaryWhite rounded hover:bg-hoverBlue"
                  >
                    ✅ Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {editData && (
          <div className="fixed inset-0 bg-primaryBlack bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-primaryWhite text-primaryBlack rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                ✏️ Edit Book
              </h2>

              <form
                className="grid gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();

                  const fd = new FormData();

                  // Append text fields
                  [
                    "bookName",
                    "category",
                    "subject",
                    "educationLevel",
                    "language",
                    "resourceType",
                    "totalPages",
                  ].forEach((key) => {
                    if (editData[key] !== undefined && editData[key] !== null) {
                      fd.append(key, editData[key]);
                    }
                  });

                  // Append main file if selected
                  if (editData.file instanceof File)
                    fd.append("file", editData.file);

                  // Append thumbnail if selected
                  if (editData.thumbnail instanceof File)
                    fd.append("thumbnail", editData.thumbnail);

                  try {
                    const res = await fetch(`${API_URL}/books/${editData.id}`, {
                      method: "PATCH",
                      body: fd,
                      credentials: "include",
                      // DO NOT set Content-Type; browser sets multipart/form-data automatically
                    });

                    const result = await res.json();

                    if (res.ok) {
                      setBookList((prev) =>
                        prev.map((book) =>
                          book.id === editData.id ? result.book || result : book
                        )
                      );
                      setEditData(null);
                      toast.success("✅ Book updated");
                    } else {
                      toast.error(result.message || "Update failed ❌");
                    }
                  } catch (err) {
                    console.error("Update error:", err);
                    toast.error("Something went wrong ❗");
                  }
                }}
              >
                {/* Text Inputs */}
                {[
                  "bookName",
                  "subject",
                  "category",
                  "educationLevel",
                  "language",
                  "resourceType",
                ].map((key) => (
                  <input
                    key={key}
                    type="text"
                    name={key}
                    value={editData[key] || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    placeholder={key}
                    className="w-full border border-gray300 p-2 rounded text-sm"
                  />
                ))}

                {/* Thumbnail Upload */}
                <div>
                  <label className="text-sm font-medium">Thumbnail Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    name="thumbnail"
                    className="w-full border p-2 rounded text-sm"
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        thumbnail: e.target.files[0],
                      }))
                    }
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditData(null)}
                    className="px-4 py-1 border rounded hover:bg-gray-100"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 bg-primaryBlue text-primaryWhite rounded hover:bg-hoverBlue"
                  >
                    ✅ Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== SIMULATION VIEW ===== */}
        {filterCategory === "Simulation" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {simulationLoading ? (
              <p>Loading simulations...</p>
            ) : simulationData.length ? (
              paginatedSimulations.map((sim) => (
                <div
                  key={sim.id}
                  className="bg-primaryWhite/10 border border-primaryWhite/20 rounded-2xl shadow-md p-4 hover:scale-105 transition"
                >
                  <img
                    src={getProxiedUrl(sim.image)}
                    alt={sim.title}
                    className="w-full h-36 object-cover rounded"
                  />

                  <h3 className="mt-2 font-bold text-center">{sim.title}</h3>
                  <p className="text-sm text-gray-300 text-center">
                    {sim.subject || sim.description}
                  </p>

                  <button
                    className="mt-2 w-full text-lightBlue font-semibold"
                    onClick={() => setOpenSimulation(sim.link)} // 👈 IMPORTANT
                  >
                    ▶️ Open Simulation
                  </button>

                </div>
              ))
            ) : (
              <p>No simulations found</p>
            )}
          </div>
        )}

        {filterCategory === "Simulation" && totalSimulationPages > 1 && (
          <div className="flex justify-center mt-6 gap-2 flex-wrap">

            {/* Prev */}
            <button
              onClick={() =>
                setSimulationPage((p) => Math.max(1, p - 1))
              }
              disabled={simulationPage === 1}
              className="px-3 py-1 bg-primaryWhite/10 border border-primaryWhite/20 rounded disabled:opacity-50"
            >
              ‹ Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalSimulationPages }, (_, i) => i + 1).map(
              (num) => (
                <button
                  key={num}
                  onClick={() => setSimulationPage(num)}
                  className={`px-3 py-1 border rounded ${num === simulationPage
                    ? "bg-primaryBlue text-primaryWhite"
                    : "bg-primaryWhite/10"
                    }`}
                >
                  {num}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() =>
                setSimulationPage((p) =>
                  Math.min(totalSimulationPages, p + 1)
                )
              }
              disabled={simulationPage === totalSimulationPages}
              className="px-3 py-1 bg-primaryWhite/10 border border-primaryWhite/20 rounded disabled:opacity-50"
            >
              Next ›
            </button>
          </div>
        )}


        {/* CURRENT AFFAIRS SECTION */}
        {filterCategory === "Current Affairs" && (
          <div className="space-y-6">
            {loadingCurrentAffairs ? (
              <p>Loading current affairs...</p>
            ) : currentAffairs.length === 0 ? (
              <p>No current affairs found</p>
            ) : (
              currentAffairs.map((news, i) => (
                <article
                  key={i}
                  className="flex flex-col md:flex-row bg-[#2a2b3d] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300"
                >
                  {/* IMAGE */}
                  <div className="md:w-1/3 w-full">
                    <img
                      src={
                        news.imageUrl?.includes("/download")
                          ? news.imageUrl
                          : `${news.imageUrl}/download`
                      }
                      alt={news.title}
                      className="w-full h-44 md:h-56 object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 flex flex-col justify-between md:w-2/3">
                    <div>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <span className="bg-blue-700 px-3 py-1 rounded-full text-xs">
                          {news.category}
                        </span>
                        <span className="flex items-center gap-2">
                          <FaCalendarAlt className="text-blue-400" />
                          {news.date}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-2">
                        {news.title}
                      </h3>

                      <p className="text-gray-300 text-sm leading-relaxed">
                        {news.description?.length > 150
                          ? news.description.slice(0, 150) + "..."
                          : news.description}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/current-affairs/${news.id}`)}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mt-4 font-semibold"
                    >
                      Keep Reading <FaArrowRight />
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {/* View Modal */}
        {viewData && selectedChapter && (
          <div className="fixed inset-0 z-50 bg-primaryBlack bg-opacity-60 flex justify-center items-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative bg-primaryWhite/10 backdrop-blur-md shadow-2xl rounded-xl border border-primaryWhite/20 w-[95%] h-[90%] max-w-6xl max-h-[95%] overflow-hidden flex flex-col view-modal-container">
                <div className="flex items-center justify-between px-6 py-2 bg-primaryWhite/5 border-b border-primaryWhite/20">
                  <h3 className="text-xl font-bold text-primaryWhite">
                    {getBookResourceType(viewData)}
                  </h3>
                  <div className="flex items-center gap-4">
                    {(getBookResourceType(viewData) === "pdf" ||
                      getBookResourceType(viewData) === "audio") && (
                        <button
                          onClick={handleFullscreenToggle}
                          className="text-primaryWhite text-xl hover:text-lightGreen"
                          title="Toggle Fullscreen"
                        >
                          {isFullscreen ? <FaCompress /> : <FaExpand />}
                        </button>
                      )}
                    <button
                      onClick={() => setViewData(null)}
                      className="text-primaryWhite text-2xl hover:text-primaryRed"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden bg-primaryBlack">
                  {getBookResourceType(viewData) === "pdf" &&
                    selectedChapter && (
                      <FlipbookPDFViewer
                        chapter={selectedChapter}
                        bookId={viewData.id}
                      />
                    )}

                  {getBookResourceType(viewData) === "video" && (
                    <video controls className="w-full h-full object-contain">
                      <source
                        src={getProxiedUrl(viewData.fileUrl)}
                        type="video/mp4"
                      />
                    </video>
                  )}

                  {getBookResourceType(viewData) === "audio" && (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-primaryWhite">
                      <img
                        src={getProxiedUrl(
                          viewData.thumbnail || "default-audio-cover.jpg"
                        )}
                        alt="Thumbnail"
                        className="w-60 h-60 object-cover rounded-lg shadow-lg"
                      />
                      <audio controls className="w-2/3">
                        <source
                          src={getProxiedUrl(viewData.fileUrl)}
                          type="audio/mpeg"
                        />
                      </audio>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <SimulationModal
          url={openSimulation}
          onClose={() => setOpenSimulation(null)}
        />

      </main>
    </div>
  );
}
