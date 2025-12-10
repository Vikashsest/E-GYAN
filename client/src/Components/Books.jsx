// import { useEffect, useMemo, useState } from "react";
// import FlipbookPDFViewer from "./FlipbookPDFViewer";
// import { FaEdit, FaTrash, FaExpand, FaCompress } from "react-icons/fa";
// import { toast } from "react-toastify";
// import {
//   fetchBooks,
//   uploadBook,
//   deleteBook,
// } from "../apiServices/booksApi";
// import { useNavigate } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL;

// // Convert local or Nextcloud URLs into proxy URLs
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

// const getBookResourceType = (book) =>
//   book.chapters?.[0]?.resourceType || "pdf";

// export default function ManageBooksPage({ role, Navbar, Sidebar }) {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [bookList, setBookList] = useState([]);
//   const [editData, setEditData] = useState(null);
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [classes, setClasses] = useState([]); // <-- API se classes
//   const [selectedClass, setSelectedClass] = useState(""); // <-- filter state

//   const [formData, setFormData] = useState({
//     bookName: "",
//     category: "",
//     subject: "",
//     educationLevel: "",
//     language: "",
//     file: null,
//     thumbnail: null,
//   });

//   useEffect(() => {
//     async function loadBooks() {
//       const books = await fetchBooks();
//       setBookList(books);
//     }
//     loadBooks();

//     async function loadClasses() {
//       try {
//         const res = await fetch(`${API_URL}/classes`, { credentials: "include" });
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setClasses(data);
//         } else {
//           // fallback agar API array na de toh manually 1-12
//           setClasses(Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`));
//         }
//       } catch (err) {
//         console.error("Class fetch error:", err);
//         setClasses(Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`));
//       }
//     }
//     loadClasses();
//   }, []);

//   useEffect(() => {
//     async function loadBooks() {
//       const books = await fetchBooks();
//       setBookList(books);
//     }
//     loadBooks();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await deleteBook(id);
//       setBookList((prev) => prev.filter((book) => book.id !== id));
//       toast.success("Deleted successfully ✅");
//     } catch (err) {
//       toast.error("Delete failed ❌");
//       console.error("Delete error:", err);
//     }
//   };

// const handleUpload = async (e) => {
//   e.preventDefault();

//   const uploadData = new FormData();
//   uploadData.append("bookName", formData.bookName);
//   uploadData.append("category", formData.category);
//   uploadData.append("subject", formData.subject);
//   uploadData.append("educationLevel", formData.educationLevel);
//   uploadData.append("language", formData.language);
//   // uploadData.append("resourceType", formData.resourceType);
//   if (formData.file) uploadData.append("file", formData.file);
//   if (formData.thumbnail) uploadData.append("thumbnail", formData.thumbnail);

//   try {
//     const result = await uploadBook(uploadData);

//     if (result && result.id) {
//       setBookList((prev) => [...prev, result]);
//       setShowUploadModal(false);
//       setFormData({

//         bookName: "",
//         subject: "",

//         educationLevel: "",
//         language: "",

//          category: "",
//         file: null,
//         thumbnail: null,
//       });
// navigate(`/books/${result.id}/chapters`);

//       toast.success("Book uploaded successfully ✅");
//     } else {
//       toast.error("Upload failed ❌");
//     }
//   } catch (error) {
//     toast.error("Something went wrong during upload ❌");
//     console.error("Upload Error:", error);
//   }
// };

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

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       {Sidebar && <Sidebar />}
//       <main className="pl-[280px] py-6 pr-5 w-full">
//         {Navbar && (
//           <Navbar
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             onAdd={() => setShowUploadModal(true)}
//             buttonLabel="+ Upload Book"
//             searchPlaceholder="Search Books..."
//           />
//         )}

//         <h1 className="text-2xl font-bold mb-4">📘 Manage Books</h1>

//         <div className="mb-4 flex gap-3 items-center">
//           <label className="font-medium">Classes:</label>
//           <select
//             value={selectedClass}
//             onChange={(e) => setSelectedClass(e.target.value)}
//             className="border border-gray-400 rounded px-2 py-1 text-black"
//           >
//             <option value="">All Classes</option>
//             {classes.map((cls, idx) => (
//               <option key={idx} value={cls}>
//                 {cls}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//           {bookList
//             .filter((b) =>
//   selectedClass ? String(b.educationLevel) === selectedClass : true
// )

//             .map((b) => (
//               <div
//                 key={b.id}
//                 className="bg-white/10 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300"
//               >
//                 <div className="flex flex-col items-center gap-3">
//                   {/* Thumbnail */}
//                   <div className="relative w-full h-36 lg:h-44 bg-black/10 rounded-lg overflow-hidden">
//                     <img
//                       src={getProxiedUrl(b.thumbnail)}
//                       alt={b.bookName}
//                       className="w-full h-full object-contain p-2"
//                     />
//                     <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-1 rounded-full text-white border border-white/30 backdrop-blur-sm">
//                       {getViewLabel(getBookResourceType(b))}
//                     </span>
//                   </div>

//                   {/* Text Section */}
//                   <div className="text-center w-full break-words">
//                     <h3 className="text-base text-md lg:text-lg font-bold mb-1">
//                       {b.bookName}
//                     </h3>
//                     <p className="text-sm sm:text-base text-gray-300 mb-1">
//                       {b.subject}
//                     </p>
//                     <p className="text-xs sm:text-sm text-gray-400">
//                       🎓 {b.educationLevel}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex flex-col mt-auto pt-2 border-t border-white/20">
//                   <button
//                     onClick={() => {
//                       setViewData(b);
//                       fetch(`${API_URL}/books/${b.id}/chapters/meta`, { credentials: "include" })
//     .then(res => res.json())
//     .then(data => {
//       if (data.length > 0) {
//         setSelectedChapter(data[0]); // pehla chapter open karo
//       } else {
//         setSelectedChapter(null);
//       }
//     });
//                       // setSelectedChapter(b.chapters?.[0] || null);
//                     }}
//                     className="w-full text-sm sm:text-base text-blue-400 hover:text-blue-300 font-semibold"
//                   >
//                     {getViewLabel(getBookResourceType(b))}
//                   </button>

//                   {role === "admin" && (
//                     <div className="flex justify-between mt-2">
//                       <button
//                         onClick={() => setEditData(b)}
//                         className="text-yellow-400 hover:text-yellow-300 text-lg"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => navigate(`/books/${b.id}/chapters`)}
//                         className="text-green-400 hover:text-green-300 text-lg"
//                         title="Manage Chapters"
//                       >
//                         📚
//                       </button>
//                       <button
//                         onClick={() => handleDelete(b.id)}
//                         className="text-red-500 hover:text-red-400 text-lg"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//         </div>

//         {showUploadModal && (
//   <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
//     <div className="bg-white text-black rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
//       <h2 className="text-2xl font-semibold mb-4 text-center">
//         📤 Upload Book
//       </h2>

//       <form className="grid gap-4" onSubmit={handleUpload}>
//         {/* Resource Type Dropdown */}
//         {/* <div>
//           <label className="text-sm font-medium">Resource Type</label>
//           <select
//             name="resourceType"
//             className="w-full border border-gray-300 p-2 rounded text-sm"
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 resourceType: e.target.value,
//               }))
//             }
//             required
//           >
//             <option value="">Select Resource Type</option>
//             <option value="pdf">PDF</option>
//             <option value="video">Video</option>
//             <option value="audio">Audio</option>
//           </select>
//         </div> */}

//         {/* Book Name */}
//         <input
//           type="text"
//           name="bookName"
//           placeholder="Book Name"
//           className="w-full border border-gray-300 p-2 rounded text-sm"
//           onChange={(e) =>
//             setFormData((prev) => ({
//               ...prev,
//               bookName: e.target.value,
//             }))
//           }
//           required
//         />

//         {/* Subject */}
//         <input
//           type="text"
//           name="subject"
//           placeholder="Subject"
//           className="w-full border border-gray-300 p-2 rounded text-sm"
//           onChange={(e) =>
//             setFormData((prev) => ({
//               ...prev,
//               subject: e.target.value,
//             }))
//           }
//         />

//         <div>
//         <label className="text-sm font-medium">Education Level</label>
//         <select
//             name="educationLevel"
//             className="w-full border border-gray-300 p-2 rounded text-sm"
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 educationLevel: e.target.value,
//               }))
//             }
//             required
//           >
//             <option value="">Select Classes</option>
//   {Array.from({ length: 12 }, (_, i) => (
//     <option key={i + 1} value={`Class ${i + 1}`}>
//       Class {i + 1}
//     </option>
//   ))}
//           </select>
//         </div>

//         {/* Language Dropdown */}
//         <div>
//           <label className="text-sm font-medium">Language</label>
//           <select
//             name="language"
//             className="w-full border border-gray-300 p-2 rounded text-sm"
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 language: e.target.value,
//               }))
//             }
//             required
//           >
//             <option value="">Select Language</option>
//             <option value="English">English</option>
//             <option value="Hindi">Hindi</option>
//             <option value="Sanskrit">Sanskrit</option>
//           </select>
//         </div>

//         <div>
//           <label className="text-sm font-medium">Category</label>
//           <select
//             name="category"
//             className="w-full border border-gray-300 p-2 rounded text-sm"
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 category: e.target.value,
//               }))
//             }
//             required
//           >
//             <option value="">Select Education Level</option>
//             <option value="School Education">School Education</option>
//             <option value="School Education">Simulation</option>
//           </select>
//         </div>

//         {/* Thumbnail Upload */}
//         <div>
//           <label className="text-sm font-medium">Thumbnail Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             className="w-full border p-2 rounded text-sm"
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 thumbnail: e.target.files[0],
//               }))
//             }
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-3 mt-4">
//           <button
//             type="button"
//             onClick={() => setShowUploadModal(false)}
//             className="px-4 py-1 border rounded hover:bg-gray-100"
//           >
//             ❌ Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             ✅ Upload
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}

//         {editData && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
//             <div className="bg-white text-black rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
//               <h2 className="text-2xl font-semibold mb-4 text-center">
//                 ✏️ Edit Book
//               </h2>

//               <form
//                 className="grid gap-4"
//           onSubmit={async (e) => {
//   e.preventDefault();

//   const allowedFields = [
//     "bookName",
//     "category",
//     "subject",
//     "educationLevel",
//     "language",
//     // "stateBoard",
//     "resourceType",
//     // "chapter",
//     "file",
//     "thumbnail",
//     "totalPages"
//   ];

//   const fd = new FormData();

//   allowedFields.forEach((key) => {
//     if (editData[key] !== undefined && editData[key] !== null) {
//       fd.append(key, editData[key]);
//     }
//   });

//   try {
//     const res = await fetch(`${API_URL}/books/${editData.id}`, {
//       method: "PATCH",
//       body: fd,
//       credentials: "include",
//     });

//     const result = await res.json();
//     if (res.ok) {
//     setBookList((prev) =>
//   prev.map((book) =>
//     book.id === editData.id ? result.book || result : book
//   )
// );
//       setEditData(null);
//       toast.success("✅ Book updated");
//     } else {
//       toast.error(result.message || "Update failed ❌");
//     }
//   } catch (err) {
//     console.error("Update error:", err);
//     toast.error("Something went wrong ❗");
//   }
// }}

//               >
//                 {[
//                   "bookName",
//                   // "chapter",
//                   "subject",
//                   "category",
//                   "educationLevel",
//                   "language",
//                   // "stateBoard",
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
//                     className="w-full border border-gray-300 p-2 rounded text-sm"
//                     // required
//                   />
//                 ))}

//                 {/* <div>
//                   <label className="text-sm font-medium">
//                     Main File (PDF / Video / Audio)
//                   </label>
//                   <input
//                     type="file"
//                     accept=".pdf,video/*,audio/*"
//                     className="w-full border p-2 rounded text-sm"
//                     onChange={(e) =>
//                       setEditData((prev) => ({
//                         ...prev,
//                         file: e.target.files[0],
//                       }))
//                     }
//                   />
//                 </div> */}
//                 <div>
//                   <label className="text-sm font-medium">Thumbnail Image</label>
//                   <input
//                     type="file"
//                     accept="image/*"
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
//                     className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
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
//           <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
//             <div className="relative w-full h-full flex items-center justify-center">
//               <div className="relative bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20 w-[95%] h-[90%] max-w-6xl max-h-[95%] overflow-hidden flex flex-col view-modal-container">
//                 <div className="flex items-center justify-between px-6 py-2 bg-white/5 border-b border-white/20">
//                   <h3 className="text-xl font-bold text-white">
//                     {getBookResourceType(viewData)}
//                   </h3>
//                   <div className="flex items-center gap-4">
//                     {(getBookResourceType(viewData) === "pdf" ||
//                       getBookResourceType(viewData) === "audio") && (
//                       <button
//                         onClick={handleFullscreenToggle}
//                         className="text-white text-xl hover:text-green-400"
//                         title="Toggle Fullscreen"
//                       >
//                         {isFullscreen ? <FaCompress /> : <FaExpand />}
//                       </button>
//                     )}
//                     <button
//                       onClick={() => setViewData(null)}
//                       className="text-white text-2xl hover:text-red-500"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex-1 overflow-hidden bg-black">
//                   {getBookResourceType(viewData) === "pdf" && selectedChapter && (
//             <FlipbookPDFViewer
//             chapter={selectedChapter}
//               bookId={viewData.id}
//             />
//           )}

//                   {getBookResourceType(viewData) === "video" && (
//                     <video controls className="w-full h-full object-contain">
//                       <source
//                         src={getProxiedUrl(viewData.fileUrl)}
//                         type="video/mp4"
//                       />
//                     </video>
//                   )}

//                   {getBookResourceType(viewData) === "audio" && (
//                     <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
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

// import { useEffect, useState } from "react";
// import FlipbookPDFViewer from "./FlipbookPDFViewer";
// import { FaEdit, FaTrash, FaExpand, FaCompress } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { FiMenu } from "react-icons/fi";
// import { confirmDelete } from "../utils/confirmDelete";

// import {
//   fetchBooks,
//   uploadBook,
//   deleteBook,
//   addCurrentAffairs
// } from "../apiServices/booksApi";
// import { useNavigate } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL;

// // Convert local or Nextcloud URLs into proxy URLs
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

// const getBookResourceType = (book) =>
//   book.chapters?.[0]?.resourceType || "pdf";

// const getItemsPerPage = () => {
//   if (window.innerWidth < 640) return 4;
//   if (window.innerWidth < 1024) return 6;
//   return 8;
// };

// export default function ManageBooksPage({ role, Navbar, Sidebar }) {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [bookList, setBookList] = useState([]);
//   const [editData, setEditData] = useState(null);
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [classes, setClasses] = useState([]); // <-- API se classes
//   const [selectedClass, setSelectedClass] = useState(""); // <-- filter state
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

//   const [formData, setFormData] = useState({
//     bookName: "",
//     category: "",
//     subject: "",
//     educationLevel: "",
//     language: "",
//     file: null,
//     thumbnail: null,

//     //current affairs
//   title: "",
//   description: "",
//   newsCategory: "",
//   date: "",
//   source: "",
//   link: "",
//   });

//   useEffect(() => {
//     async function loadBooks() {
//       const books = await fetchBooks();
//       setBookList(books);
//     }
//     loadBooks();

//     async function loadClasses() {
//       try {
//         const res = await fetch(`${API_URL}/classes`, { credentials: "include" });
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setClasses(data);
//         } else {
//           // fallback agar API array na de toh manually 1-12
//           setClasses(Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`));
//         }
//       } catch (err) {
//         console.error("Class fetch error:", err);
//         setClasses(Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`));
//       }
//     }
//     loadClasses();
//   }, []);

//   useEffect(() => {
//     async function loadBooks() {
//       const books = await fetchBooks();
//       setBookList(books);
//     }
//     loadBooks();
//   }, []);

//   const handleDelete = async (id) => {
//     const ok = await confirmDelete("This book will be permanently deleted!");

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

//   // const handleUpload = async (e) => {
//   //   e.preventDefault();

//   //   const uploadData = new FormData();
//   //   uploadData.append("bookName", formData.bookName);
//   //   uploadData.append("category", formData.category);
//   //   uploadData.append("subject", formData.subject);
//   //   uploadData.append("educationLevel", formData.educationLevel);
//   //   uploadData.append("language", formData.language);
//   //   // uploadData.append("resourceType", formData.resourceType);
//   //   if (formData.file) uploadData.append("file", formData.file);
//   //   if (formData.thumbnail) uploadData.append("thumbnail", formData.thumbnail);

//   //   try {
//   //     const result = await uploadBook(uploadData);

//   //     if (result && result.id) {
//   //       setBookList((prev) => [...prev, result]);
//   //       setShowUploadModal(false);
//   //       setFormData({

//   //         bookName: "",
//   //         subject: "",

//   //         educationLevel: "",
//   //         language: "",

//   //         category: "",
//   //         file: null,
//   //         thumbnail: null,
//   //       });
//   //       navigate(`/books/${result.id}/chapters`);

//   //       toast.success("Book uploaded successfully ✅");
//   //     } else {
//   //       toast.error("Upload failed ❌");
//   //     }
//   //   } catch (error) {
//   //     toast.error("Something went wrong during upload ❌");
//   //     console.error("Upload Error:", error);
//   //   }
//   // };

// const handleUpload = async (e) => {
//   e.preventDefault();

//   try {
//     if (formData.category === "Current Affairs") {
// const currentFormData = new FormData();

//       currentFormData.append("title", formData.title?.trim() || "");
//       currentFormData.append("mainCategory", formData.category || ""); // 📰 "Current Affairs"
// currentFormData.append("category", formData.newsCategory || ""); // 🧠 "Science & Technology"

//       currentFormData.append("description", formData.description?.trim() || "");
//       currentFormData.append("date", formData.date || "");
//       currentFormData.append("source", formData.source?.trim() || "");
//       if (formData.file) currentFormData.append("file", formData.file);
//       if (formData.link) currentFormData.append("link", formData.link);

//       console.log("📦 Sending FormData entries:", [...currentFormData.entries()]);

//       const result = await addCurrentAffairs(null, currentFormData);
//       if (result) {
//         toast.success("✅ Current Affairs added successfully");
//         setShowUploadModal(false);
//         setFormData({
//           bookName: "",
//           category: "",
//           subject: "",
//           educationLevel: "",
//           language: "",
//           file: null,
//           thumbnail: null,
//           title: "",
//           description: "",
//           newsCategory: "",
//           date: "",
//           source: "",
//           link: "",
//         });
//       } else {
//         toast.error("❌ Failed to add Current Affairs");
//       }
//     } else {
//       // 🟢 Normal book upload
//       const uploadData = new FormData();
//       uploadData.append("bookName", formData.bookName);
//       uploadData.append("category", formData.category);
//       uploadData.append("subject", formData.subject);
//       uploadData.append("educationLevel", formData.educationLevel);
//       uploadData.append("language", formData.language);
//       if (formData.file) uploadData.append("file", formData.file);
//       if (formData.thumbnail) uploadData.append("thumbnail", formData.thumbnail);

//       const result = await uploadBook(uploadData);
//       if (result && result.id) {
//         setBookList((prev) => [...prev, result]);
//         setShowUploadModal(false);
//         navigate(`/books/${result.id}/chapters`);
//         toast.success("✅ Book uploaded successfully");
//       } else {
//         toast.error("❌ Upload failed");
//       }
//     }
//   } catch (error) {
//     console.error(error);
//     toast.error("⚠️ Something went wrong during upload");
//   }
// };

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
//   // CLASS FILTER
//   const classMatch = selectedClass
//     ? Number(b.educationLevel) === Number(selectedClass)
//     : true;

//   // SEARCH FILTER
//   const text = `${b.bookName} ${b.subject} ${b.educationLevel}`.toLowerCase();
//   const searchMatch = text.includes(searchTerm.toLowerCase());

//   return classMatch && searchMatch;
// });

//   const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

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
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       {Sidebar && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
//       <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
//         <div className="lg:hidden px-4 mb-4">
//           <button onClick={() => setIsSidebarOpen(true)} className="text-white">
//             <FiMenu size={28} />
//           </button>
//         </div>
//         {Navbar && (
//           <Navbar
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             onAdd={() => setShowUploadModal(true)}
//             buttonLabel="+ Upload Book"
//             searchPlaceholder="Search Books..."
//           />
//         )}

//         <h1 className="text-2xl font-bold mb-4">📘 Manage Books</h1>

//         <div className="mb-4 flex gap-3 items-center">
//           <label className="font-medium">Classes:</label>
//           <select
//             value={selectedClass}
//             onChange={(e) => setSelectedClass(e.target.value)}
//             className="border border-gray-400 rounded px-2 py-1 text-black"
//           >
//             <option value="">All Classes</option>
//             {classes.map((cls, idx) => (
//               <option key={idx} value={cls}>
//                 {cls}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//           {paginatedBooks
//             .filter((b) =>
//               selectedClass ? String(b.educationLevel) === selectedClass : true
//             )

//             .map((b) => (
//               <div
//                 key={b.id}
//                 className="bg-white/10 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300"
//               >
//                 <div className="flex flex-col items-center gap-3">
//                   {/* Thumbnail */}
//                   <div className="relative w-full h-36 lg:h-44 bg-black/10 rounded-lg overflow-hidden">
//                     <img
//                       src={getProxiedUrl(b.thumbnail)}
//                       alt={b.bookName}
//                       className="w-full h-full object-contain p-2"
//                     />
//                     <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-1 rounded-full text-white border border-white/30 backdrop-blur-sm">
//                       {getViewLabel(getBookResourceType(b))}
//                     </span>
//                   </div>

//                   {/* Text Section */}
//                   <div className="text-center w-full break-words">
//                     <h3 className="text-base text-md lg:text-lg font-bold mb-1">
//                       {b.bookName}
//                     </h3>
//                     <p className="text-sm sm:text-base text-gray-300 mb-1">
//                       {b.subject}
//                     </p>
//                     <p className="text-xs sm:text-sm text-gray-400">
//                       🎓 {b.educationLevel}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex flex-col mt-auto pt-2 border-t border-white/20">
//                   <button
//                     onClick={() => {
//                       setViewData(b);
//                       fetch(`${API_URL}/books/${b.id}/chapters/meta`, { credentials: "include" })
//                         .then(res => res.json())
//                         .then(data => {
//                           if (data.length > 0) {
//                             setSelectedChapter(data[0]); // pehla chapter open karo
//                           } else {
//                             setSelectedChapter(null);
//                           }
//                         });
//                       // setSelectedChapter(b.chapters?.[0] || null);
//                     }}
//                     className="w-full text-sm sm:text-base text-blue-400 hover:text-blue-300 font-semibold"
//                   >
//                     {getViewLabel(getBookResourceType(b))}
//                   </button>

//                   {role === "admin" && (
//                     <div className="flex justify-between mt-2">
//                       <button
//                         onClick={() => setEditData(b)}
//                         className="text-yellow-400 hover:text-yellow-300 text-lg"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => navigate(`/books/${b.id}/chapters`)}
//                         className="text-green-400 hover:text-green-300 text-lg"
//                         title="Manage Chapters"
//                       >
//                         📚
//                       </button>
//                       <button
//                         onClick={() => handleDelete(b.id)}
//                         className="text-red-500 hover:text-red-400 text-lg"
//                       >
//                         <FaTrash />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex justify-center mt-6 gap-2 flex-wrap">

//             {/* First Page */}
//             <button
//               onClick={() => setCurrentPage(1)}
//               disabled={currentPage === 1}
//               className="px-3 py-1 bg-white/10 border border-white/20 rounded disabled:opacity-50"
//             >
//               « First
//             </button>

//             {/* Prev */}
//             <button
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="px-3 py-1 bg-white/10 border border-white/20 rounded disabled:opacity-50"
//             >
//               ‹ Prev
//             </button>

//             {/* Page Numbers */}
//             {getPageNumbers().map((num) => (
//               <button
//                 key={num}
//                 onClick={() => setCurrentPage(num)}
//                 className={`px-3 py-1 border rounded
//           ${num === currentPage ? "bg-blue-500 text-white" : "bg-white/10"}
//         `}
//               >
//                 {num}
//               </button>
//             ))}

//             {/* Next */}
//             <button
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//               className="px-3 py-1 bg-white/10 border border-white/20 rounded disabled:opacity-50"
//             >
//               Next ›
//             </button>

//             {/* Last Page */}
//             <button
//               onClick={() => setCurrentPage(totalPages)}
//               disabled={currentPage === totalPages}
//               className="px-3 py-1 bg-white/10 border border-white/20 rounded disabled:opacity-50"
//             >
//               Last »
//             </button>
//           </div>
//         )}

//         {showUploadModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
//             <div className="bg-white text-black rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
//               <h2 className="text-2xl font-semibold mb-4 text-center">
//                 📤 Upload Resource
//               </h2>

//               {/* CATEGORY DROPDOWN */}
//               <div className="mb-4">
//                 <label className="text-sm font-medium block mb-1">Select Category</label>
//                 <select
//                   value={formData.category}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       category: e.target.value,
//                     }))
//                   }
//                   className="w-full border border-gray-300 p-2 rounded text-sm"

//                 >
//                   <option value="">-- Choose Category --</option>
//                   <option value="School Education">📘 School Education</option>
//                   <option value="Simulation">🧠 Simulation</option>
//                   <option value="Current Affairs">📰 Current Affairs</option>
//                 </select>
//               </div>

//               <form className="grid gap-4" onSubmit={handleUpload}>
//                 {/* === BOOK UPLOAD FORM === */}
//                 {formData.category === "School Education" && (
//                   <>
//                     <input
//                       type="text"
//                       name="bookName"
//                       placeholder="Book Name"
//                       className="w-full border border-gray-300 p-2 rounded text-sm"
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           bookName: e.target.value,
//                         }))
//                       }

//                     />

//                     <input
//                       type="text"
//                       name="subject"
//                       placeholder="Subject"
//                       className="w-full border border-gray-300 p-2 rounded text-sm"
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           subject: e.target.value,
//                         }))
//                       }
//                     />

//                     <div>
//                       <label className="text-sm font-medium">Education Level</label>
//                       <select
//                         value={selectedClass}
//                         onChange={(e) => setSelectedClass(e.target.value)}
//                         className="border border-gray-400 rounded px-2 py-1 text-black"
//                       >
//                         <option value="">All Classes</option>
//                         {classes.map((cls, idx) => (
//                           <option key={idx} value={idx + 1}>Class {idx + 1}</option>
//                         ))}
//                       </select>

//                     </div>

//                     <div>
//                       <label className="text-sm font-medium">Language</label>
//                       <select
//                         name="language"
//                         className="w-full border border-gray-300 p-2 rounded text-sm"
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             language: e.target.value,
//                           }))
//                         }

//                       >
//                         <option value="">Select Language</option>
//                         <option value="English">English</option>
//                         <option value="Hindi">Hindi</option>
//                         <option value="Sanskrit">Sanskrit</option>
//                       </select>
//                     </div>

//                     <div>
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
//                     </div>

//                     <div>
//                       <label className="text-sm font-medium">Book File (PDF)</label>
//                       <input
//                         type="file"
//                         accept=".pdf"
//                         className="w-full border p-2 rounded text-sm"
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             file: e.target.files[0],
//                           }))
//                         }
//                       />
//                     </div>
//                   </>
//                 )}

//                 {formData.category === "Simulation" && (
//                   <>
//                     <input
//                       type="text"
//                       placeholder="Simulation Title"
//                       value={formData.bookName}
//                       onChange={(e) => setFormData(prev => ({ ...prev, bookName: e.target.value }))}
//                     />

//                     <textarea
//                       placeholder="Simulation Description"
//                       value={formData.subject}
//                       onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
//                     />

//                     <select
//                       value={formData.grade}
//                       onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
//                     >
//                       <option value="">Select Grade</option>
//                       <option value="6">6</option>
//                       <option value="7">7</option>
//                       <option value="8">8</option>
//                     </select>

//                     <select
//                       value={formData.difficulty}
//                       onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
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
//                       onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
//                     />

//                     <input
//                       type="file"
//                       accept=".zip,.exe,.html"
//                       onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files[0] }))}
//                     />

//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.files[0] }))}
//                     />

//                     <textarea
//                       placeholder="Prerequisites"
//                       value={formData.prerequisites}
//                       onChange={(e) => setFormData(prev => ({ ...prev, prerequisites: e.target.value }))}
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
//                       className="w-full border border-gray-300 p-2 rounded text-sm"
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           title: e.target.value,
//                         }))
//                       }

//                     />

//                     {/* 🔹 Description */}
//                     <textarea
//                       placeholder="Description or Summary"
//                       className="w-full border border-gray-300 p-2 rounded text-sm"
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           description: e.target.value,
//                         }))
//                       }

//                     />

//                     {/* 🔹 Category Selection */}
//                     <div>
//                       <label className="text-sm font-medium">Category</label>
//                       <select
//                         className="w-full border border-gray-300 p-2 rounded text-sm"
//                         onChange={(e) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             newsCategory: e.target.value,
//                           }))
//                         }

//                       >
//                         <option value="">Select Category</option>
//                         <option value="Science & Technology">Science & Technology</option>
//                         <option value="Economy">Economy</option>
//                         <option value="Environment">Environment</option>
//                         <option value="Sports">Sports</option>
//                         <option value="Daily Current Affairs">Daily Current Affairs</option>
//                       </select>
//                     </div>

//                     {/* 🔹 Date Picker */}
//                     <div>
//                       <label className="text-sm font-medium">Date</label>
//                       <input
//                         type="date"
//                         className="w-full border border-gray-300 p-2 rounded text-sm"
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
//                       <label className="text-sm font-medium">Source / Author</label>
//                       <input
//                         type="text"
//                         placeholder="e.g. PIB, The Hindu, Times of India"
//                         className="w-full border border-gray-300 p-2 rounded text-sm"
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
//                         className="w-full border border-gray-300 p-2 rounded text-sm"
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
//                       <label className="text-sm font-medium">Upload File (PDF / Image)</label>
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
//                       <label className="text-sm font-medium">External News Link</label>
//                       <input
//                         type="url"
//                         placeholder="https://example.com/news-article"
//                         className="w-full border border-gray-300 p-2 rounded text-sm"
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
//                     className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   >
//                     ✅ Upload
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {editData && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
//             <div className="bg-white text-black rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
//               <h2 className="text-2xl font-semibold mb-4 text-center">
//                 ✏️ Edit Book
//               </h2>

//               <form
//                 className="grid gap-4"
//                 onSubmit={async (e) => {
//                   e.preventDefault();

//                   const allowedFields = [
//                     "bookName",
//                     "category",
//                     "subject",
//                     "educationLevel",
//                     "language",
//                     // "stateBoard",
//                     "resourceType",
//                     // "chapter",
//                     "file",
//                     "thumbnail",
//                     "totalPages"
//                   ];

//                   const fd = new FormData();

//                   allowedFields.forEach((key) => {
//                     if (editData[key] !== undefined && editData[key] !== null) {
//                       fd.append(key, editData[key]);
//                     }
//                   });

//                   try {
//                     const res = await fetch(`${API_URL}/books/${editData.id}`, {
//                       method: "PATCH",
//                       body: fd,
//                       credentials: "include",
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
//                 {[
//                   "bookName",
//                   // "chapter",
//                   "subject",
//                   "category",
//                   "educationLevel",
//                   "language",
//                   // "stateBoard",
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
//                     className="w-full border border-gray-300 p-2 rounded text-sm"
//                   />
//                 ))}

//                 {/* <div>
//                   <label className="text-sm font-medium">
//                     Main File (PDF / Video / Audio)
//                   </label>
//                   <input
//                     type="file"
//                     accept=".pdf,video/*,audio/*"
//                     className="w-full border p-2 rounded text-sm"
//                     onChange={(e) =>
//                       setEditData((prev) => ({
//                         ...prev,
//                         file: e.target.files[0],
//                       }))
//                     }
//                   />
//                 </div> */}
//                 <div>
//                   <label className="text-sm font-medium">Thumbnail Image</label>
//                   <input
//                     type="file"
//                     accept="image/*"
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
//                     className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
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
//           <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
//             <div className="relative w-full h-full flex items-center justify-center">
//               <div className="relative bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20 w-[95%] h-[90%] max-w-6xl max-h-[95%] overflow-hidden flex flex-col view-modal-container">
//                 <div className="flex items-center justify-between px-6 py-2 bg-white/5 border-b border-white/20">
//                   <h3 className="text-xl font-bold text-white">
//                     {getBookResourceType(viewData)}
//                   </h3>
//                   <div className="flex items-center gap-4">
//                     {(getBookResourceType(viewData) === "pdf" ||
//                       getBookResourceType(viewData) === "audio") && (
//                         <button
//                           onClick={handleFullscreenToggle}
//                           className="text-white text-xl hover:text-green-400"
//                           title="Toggle Fullscreen"
//                         >
//                           {isFullscreen ? <FaCompress /> : <FaExpand />}
//                         </button>
//                       )}
//                     <button
//                       onClick={() => setViewData(null)}
//                       className="text-white text-2xl hover:text-red-500"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex-1 overflow-hidden bg-black">
//                   {getBookResourceType(viewData) === "pdf" && selectedChapter && (
//                     <FlipbookPDFViewer
//                       chapter={selectedChapter}
//                       bookId={viewData.id}
//                     />
//                   )}

//                   {getBookResourceType(viewData) === "video" && (
//                     <video controls className="w-full h-full object-contain">
//                       <source
//                         src={getProxiedUrl(viewData.fileUrl)}
//                         type="video/mp4"
//                       />
//                     </video>
//                   )}

//                   {getBookResourceType(viewData) === "audio" && (
//                     <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
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
import { FaEdit, FaTrash, FaExpand, FaCompress } from "react-icons/fa";
import { toast } from "react-toastify";
import { FiMenu } from "react-icons/fi";
import { confirmDelete } from "../utils/confirmDelete";
import { getRepository } from "../apiServices/apiRepository";
import JoditEditor from "jodit-react";
import { useRef } from "react";
import {
  fetchBooks,
  uploadBook,
  deleteBook,
  addCurrentAffairs,
} from "../apiServices/booksApi";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// Convert local or Nextcloud URLs into proxy URLs
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
  const [languages, setLanguages] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
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
    const loadFormOptions = async () => {
      try {
        const [categories, subjects, languages, levels] = await Promise.all([
          getRepository("category"),
          getRepository("subject"),
          getRepository("language"),
          getRepository("level"),
        ]);

        setCategories(categories.map((c) => c.text));
        setSubjects(subjects.map((s) => s.text));
        setLanguages(languages.map((l) => l.text));
        setEducationLevels(levels.map((e) => e.text));
      } catch (err) {
        console.error("Failed to load form options:", err);

        setCategories([]);
        setSubjects([]);
        setLanguages([]);
        setEducationLevels([]);
      }
    };

    loadFormOptions();
  }, []);

  useEffect(() => {
    async function loadBooks() {
      const books = await fetchBooks();
      setBookList(books);
    }
    loadBooks();

    async function loadClasses() {
      try {
        const res = await fetch(`${API_URL}/classes`, {
          credentials: "include",
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setClasses(data);
        } else {
          // fallback agar API array na de toh manually 1-12
          setClasses(Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`));
        }
      } catch (err) {
        console.error("Class fetch error:", err);
        setClasses(Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`));
      }
    }
    loadClasses();
  }, []);

  useEffect(() => {
    async function loadBooks() {
      const books = await fetchBooks();
      setBookList(books);
    }
    loadBooks();
  }, []);

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

  // const handleUpload = async (e) => {
  //   e.preventDefault();

  //   const uploadData = new FormData();
  //   uploadData.append("bookName", formData.bookName);
  //   uploadData.append("category", formData.category);
  //   uploadData.append("subject", formData.subject);
  //   uploadData.append("educationLevel", formData.educationLevel);
  //   uploadData.append("language", formData.language);
  //   // uploadData.append("resourceType", formData.resourceType);
  //   if (formData.file) uploadData.append("file", formData.file);
  //   if (formData.thumbnail) uploadData.append("thumbnail", formData.thumbnail);

  //   try {
  //     const result = await uploadBook(uploadData);

  //     if (result && result.id) {
  //       setBookList((prev) => [...prev, result]);
  //       setShowUploadModal(false);
  //       setFormData({

  //         bookName: "",
  //         subject: "",

  //         educationLevel: "",
  //         language: "",

  //         category: "",
  //         file: null,
  //         thumbnail: null,
  //       });
  //       navigate(`/books/${result.id}/chapters`);

  //       toast.success("Book uploaded successfully ✅");
  //     } else {
  //       toast.error("Upload failed ❌");
  //     }
  //   } catch (error) {
  //     toast.error("Something went wrong during upload ❌");
  //     console.error("Upload Error:", error);
  //   }
  // };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!formData.category || formData.category === "") {
      toast.warn("Please select a category before uploading");
      return;
    }

    try {
      if (formData.category === "Current Affairs") {
        const currentFormData = new FormData();

        currentFormData.append("title", formData.title?.trim() || "");
        currentFormData.append("mainCategory", formData.category || ""); // 📰 "Current Affairs"
        currentFormData.append("category", formData.newsCategory || ""); // 🧠 "Science & Technology"

        currentFormData.append(
          "description",
          formData.description?.trim() || ""
        );
        currentFormData.append("date", formData.date || "");
        currentFormData.append("source", formData.source?.trim() || "");
        if (formData.file) currentFormData.append("file", formData.file);
        if (formData.link) currentFormData.append("link", formData.link);

        console.log("📦 Sending FormData entries:", [
          ...currentFormData.entries(),
        ]);

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
          
        } else {
          toast.error("❌ Failed to add Current Affairs");
        }
      } else {
        // 🟢 Normal book upload
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

  // const filteredBooks = bookList.filter((b) => {
  //   // CLASS FILTER
  //   const classMatch = selectedClass
  //     ? Number(b.educationLevel) === Number(selectedClass)
  //     : true;

  //   // SEARCH FILTER
  //   const text = `${b.bookName} ${b.subject} ${b.educationLevel}`.toLowerCase();
  //   const searchMatch = text.includes(searchTerm.toLowerCase());

  //   return classMatch && searchMatch;
  // });

  const filteredBooks = bookList.filter((b) => {
    const selectedClassNumber = selectedClass ? parseInt(selectedClass) : null;

    const bookClassNumber = b.educationLevel
      ? parseInt(b.educationLevel.toString().replace(/\D/g, ""))
      : null;

    const classMatch = selectedClassNumber
      ? bookClassNumber === selectedClassNumber
      : true;

    const text = `${b.bookName} ${b.subject} ${b.educationLevel}`.toLowerCase();
    const searchMatch = text.includes(searchTerm.toLowerCase());

    return classMatch && searchMatch;
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
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      {Sidebar && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
        <div className="lg:hidden px-4 mb-4">
          <button onClick={() => setIsSidebarOpen(true)} className="text-white">
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

        <div className="mb-4 flex gap-3 items-center">
          <label className="font-medium">Classes:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-gray-400 rounded px-2 py-1 text-black"
          >
            <option value="">All Classes</option>
            {classes.map((cls, idx) => (
              // <option key={idx} value={cls}>
              //   {cls}
              // </option>
              <option key={idx} value={cls.replace(/\D/g, "")}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {paginatedBooks.map((b) => (
            <div
              key={b.id}
              className="bg-white/10 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-3">
                {/* Thumbnail */}
                <div className="relative w-full h-36 lg:h-44 bg-black/10 rounded-lg overflow-hidden">
                  <img
                    src={getProxiedUrl(b.thumbnail)}
                    alt={b.bookName}
                    className="w-full h-full object-contain p-2"
                  />
                  <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-1 rounded-full text-white border border-white/30 backdrop-blur-sm">
                    {getViewLabel(getBookResourceType(b))}
                  </span>
                </div>

                {/* Text Section */}
                <div className="text-center w-full break-words">
                  <h3 className="text-base text-md lg:text-lg font-bold mb-1">
                    {b.bookName}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 mb-1">
                    {b.subject}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400">
                    🎓 {b.educationLevel}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col mt-auto pt-2 border-t border-white/20">
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
                  className="w-full text-sm sm:text-base text-blue-400 hover:text-blue-300 font-semibold"
                >
                  {getViewLabel(getBookResourceType(b))}
                </button>

                {role === "admin" && (
                  <div className="flex justify-between mt-2">
                    <button
                      onClick={() => setEditData(b)}
                      className="text-yellow-400 hover:text-yellow-300 text-lg"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => navigate(`/books/${b.id}/chapters`)}
                      className="text-green-400 hover:text-green-300 text-lg"
                      title="Manage Chapters"
                    >
                      📚
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-red-500 hover:text-red-400 text-lg"
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
              className="px-3 py-1 bg-white/10 border border-white/20 rounded disabled:opacity-50"
            >
              « First
            </button>

            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded disabled:opacity-50"
            >
              ‹ Prev
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 border rounded 
          ${num === currentPage ? "bg-blue-500 text-white" : "bg-white/10"}
        `}
              >
                {num}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded disabled:opacity-50"
            >
              Next ›
            </button>

            {/* Last Page */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded disabled:opacity-50"
            >
              Last »
            </button>
          </div>
        )}

        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white text-black rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                📤 Upload Resource
              </h2>

              {/* CATEGORY DROPDOWN */}
              {/* <div className="mb-4">
                <label className="text-sm font-medium block mb-1">Select Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full border border-gray-300 p-2 rounded text-sm"
                > */}

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
                  className="w-full border border-gray-300 p-2 rounded text-sm"
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
                        value={formData.levels}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            educationLevel: e.target.value,
                          }))
                        }
                        className="border border-gray-400 rounded px-2 py-1 text-black w-full"
                      >
                        <option value="">Select Class</option>
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
                      className="w-full border border-gray-300 p-2 rounded text-sm"
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
                      className="w-full border border-gray-300 p-2 rounded text-sm"
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
                        className="w-full border border-gray-300 p-2 rounded text-sm text-black"
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
                        className="w-full border border-gray-300 p-2 rounded text-sm"
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
                  <>
                    <input
                      type="text"
                      placeholder="Simulation Title"
                      value={formData.bookName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bookName: e.target.value,
                        }))
                      }
                    />

                    <textarea
                      placeholder="Simulation Description"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                    />

                    <select
                      value={formData.grade}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          grade: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select Grade</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>

                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          difficulty: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select Difficulty</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Topics (comma separated)"
                      value={formData.topic}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          topic: e.target.value,
                        }))
                      }
                    />

                    <input
                      type="file"
                      accept=".zip,.exe,.html"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          file: e.target.files[0],
                        }))
                      }
                    />

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          thumbnail: e.target.files[0],
                        }))
                      }
                    />

                    <textarea
                      placeholder="Prerequisites"
                      value={formData.prerequisites}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          prerequisites: e.target.value,
                        }))
                      }
                    />

                    {/* <input
                      type="text"
                      placeholder="Tags (comma separated)"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    /> */}
                  </>
                )}

                {/* === CURRENT AFFAIRS FORM === */}
                {formData.category === "Current Affairs" && (
                  <>
                    {/* 🔹 Title */}
                    <input
                      type="text"
                      placeholder="News Title"
                      className="w-full border border-gray-300 p-2 rounded text-sm"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />

                    <div>
                      <label className="text-sm font-medium text-white">
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
                        className="w-full border border-gray-300 p-2 rounded text-sm"
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
                        className="w-full border border-gray-300 p-2 rounded text-sm"
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
                        className="w-full border border-gray-300 p-2 rounded text-sm"
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
                        className="w-full border border-gray-300 p-2 rounded text-sm"
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
                        className="w-full border border-gray-300 p-2 rounded text-sm"
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
                  !["School Education", "Current Affairs", "Simulation"].includes(
                    formData.category
                  ) && (
                    <>
                      <div className="mb-4">
                        <label className="text-sm font-medium block mb-1">Class</label>
                        <input
                          type="text"
                          name="class"
                          value={formData.class || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 p-2 rounded text-sm"
                          placeholder="Enter Class"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="text-sm font-medium block mb-1">Subject</label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 p-2 rounded text-sm"
                          placeholder="Enter Subject"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="text-sm font-medium block mb-1">Books</label>
                        <input
                          type="text"
                          name="books"
                          value={formData.books || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 p-2 rounded text-sm"
                          placeholder="Enter Books Name"
                        />
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
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    ✅ Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editData && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white text-black rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                ✏️ Edit Book
              </h2>

              <form
                className="grid gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();

                  const allowedFields = [
                    "bookName",
                    "category",
                    "subject",
                    "educationLevel",
                    "language",
                    // "stateBoard",
                    "resourceType",
                    // "chapter",
                    "file",
                    "thumbnail",
                    "totalPages",
                  ];

                  const fd = new FormData();

                  allowedFields.forEach((key) => {
                    if (editData[key] !== undefined && editData[key] !== null) {
                      fd.append(key, editData[key]);
                    }
                  });

                  try {
                    const res = await fetch(`${API_URL}/books/${editData.id}`, {
                      method: "PATCH",
                      body: fd,
                      credentials: "include",
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
                {[
                  "bookName",
                  // "chapter",
                  "subject",
                  "category",
                  "educationLevel",
                  "language",
                  // "stateBoard",
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
                    className="w-full border border-gray-300 p-2 rounded text-sm"
                  />
                ))}

                {/* <div>
                  <label className="text-sm font-medium">
                    Main File (PDF / Video / Audio)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,video/*,audio/*"
                    className="w-full border p-2 rounded text-sm"
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        file: e.target.files[0],
                      }))
                    }
                  />
                </div> */}
                <div>
                  <label className="text-sm font-medium">Thumbnail Image</label>
                  <input
                    type="file"
                    accept="image/*"
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
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    ✅ Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {viewData && selectedChapter && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20 w-[95%] h-[90%] max-w-6xl max-h-[95%] overflow-hidden flex flex-col view-modal-container">
                <div className="flex items-center justify-between px-6 py-2 bg-white/5 border-b border-white/20">
                  <h3 className="text-xl font-bold text-white">
                    {getBookResourceType(viewData)}
                  </h3>
                  <div className="flex items-center gap-4">
                    {(getBookResourceType(viewData) === "pdf" ||
                      getBookResourceType(viewData) === "audio") && (
                        <button
                          onClick={handleFullscreenToggle}
                          className="text-white text-xl hover:text-green-400"
                          title="Toggle Fullscreen"
                        >
                          {isFullscreen ? <FaCompress /> : <FaExpand />}
                        </button>
                      )}
                    <button
                      onClick={() => setViewData(null)}
                      className="text-white text-2xl hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden bg-black">
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
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
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
      </main>
    </div>
  );
}



