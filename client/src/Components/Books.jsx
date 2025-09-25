// import { useEffect, useState } from "react";
// import FlipbookPDFViewer from "./FlipbookPDFViewer";
// import { FaEdit, FaTrash, FaExpand, FaCompress } from "react-icons/fa";
// import { toast } from "react-toastify";
// import {
//   fetchBooks,
//   uploadBook,
//   deleteBook,
//   updateBook,
// } from "../apiServices/booksApi";
// import { useNavigate } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL;
// const getCleanUrl = (path) =>
//   path ? `${API_URL}/${path.replaceAll("\\", "/")}` : "";

// export default function ManageBooksPage({ role, Navbar, Sidebar }) {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [bookList, setBookList] = useState([]);
//   const [editData, setEditData] = useState(null);
//   const [formData, setFormData] = useState({
//     bookName: "",
//     // category: "",
//     subject: "",
//     educationLevel: "",
//     language: "",
//     // stateBoard: "",
//     resourceType: "",
//     file: null,
//     thumbnail: null,
//   });

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

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     const uploadData = new FormData();
//     uploadData.append("bookName", formData.bookName);
//     // uploadData.append("category", formData.category);
//     uploadData.append("subject", formData.subject);
//     uploadData.append("educationLevel", formData.educationLevel);
//     uploadData.append("language", formData.language);
//     // uploadData.append("stateBoard", formData.stateBoard);
//     uploadData.append("resourceType", formData.resourceType);
//     if (formData.file) uploadData.append("file", formData.file);
//     if (formData.thumbnail) uploadData.append("thumbnail", formData.thumbnail);

//     try {
//       const result = await uploadBook(uploadData);

//       if (result && result.id) {
//         setBookList((prev) => [...prev, result]);
//         setShowUploadModal(false);
//         setFormData({
//           bookName: "",
//           // category: "",
//           subject: "",
//           educationLevel: "",
//           language: "",
//           // stateBoard: "",
//           resourceType: "",
//           file: null,
//           thumbnail: null,
//         });
//         toast.success(" Upload successful");
//       } else {
//         toast.error("Upload failed ❌");
//       }
//     } catch (error) {
//       toast.error("Something went wrong during upload ❌");
//       console.error("Upload Error:", error);
//     }
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     const fd = new FormData();
//     Object.entries(editData).forEach(([key, value]) => {
//       if ((key === "file" || key === "thumbnail") && value instanceof File) {
//         fd.append(key, value);
//       } else {
//         fd.append(key, value);
//       }
//     });

//     try {
//       const result = await updateBook(editData.id, fd); 
//       if (result) {
//         setBookList((prev) =>
//           prev.map((book) => (book.id === editData.id ? result : book))
//         );
//         setEditData(null);
//         toast.success("✅ Book updated");
//       }
//     } catch (err) {
//       toast.error("Update failed ❌");
//       console.error("Update error:", err);
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

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//           {bookList
//             .filter((b) =>
//               b?.bookName?.toLowerCase().includes(searchTerm.toLowerCase())
//             )
//             .map((b) => (
//               <div
//                 key={b.id}
//                 className="bg-white/10 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300"
//               >
//                 <div className="flex flex-col items-center gap-3">
//                   {/* Thumbnail */}
//                   <div className="relative w-full h-36  lg:h-44 bg-black/10 rounded-lg overflow-hidden">
//                     <img
//                       src={getCleanUrl(b.thumbnail || b.fileUrl)}
//                       alt={b.bookName}
//                       className="w-full h-full object-contain p-2"
//                     />
//                     <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-1 rounded-full text-white border border-white/30 backdrop-blur-sm">
//                       {b.resourceType}
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
//                     onClick={() => setViewData(b)}
//                     className="w-full text-sm sm:text-base text-blue-400 hover:text-blue-300 font-semibold "
//                   >
//                     {getViewLabel(b.resourceType)}
//                   </button>

//                   {role === "admin" && (
//                     <div className="flex justify-between">
//                       <button
//                         onClick={() => setEditData(b)}
//                         className="text-yellow-400 hover:text-yellow-300 text-lg"
//                       >
//                         <FaEdit />
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
//           <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
//             <div className="bg-white text-black rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
//               <h2 className="text-2xl font-semibold mb-4 text-center">
//                 📤 Upload Book
//               </h2>

//               <form className="grid gap-4" onSubmit={handleUpload}>
//                 {[
//                   "bookName",
//                   // "category",
//                   "subject",
//                   "educationLevel",
//                   "language",
//                   // "stateBoard",
//                   "resourceType",
//                 ].map((field) => (
//                   <input
//                     key={field}
//                     type="text"
//                     name={field}
//                     placeholder={field}
//                     className="w-full border border-gray-300 p-2 rounded text-sm"
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         [field]: e.target.value,
//                       }))
//                     }
//                     required
//                   />
//                 ))}

//                 <div>
//                   <label className="text-sm font-medium">
//                     (Pdf/Videos/Audios)
//                   </label>
//                   <input
//                     type="file"
//                     accept=".pdf,video/*,audio/*"
//                     required
//                     className="w-full border p-2 rounded text-sm"
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         file: e.target.files[0],
//                       }))
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">Thumbnail Image</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="w-full border p-2 rounded text-sm"
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         thumbnail: e.target.files[0],
//                       }))
//                     }
//                   />
//                 </div>

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

//               <form className="grid gap-4" onSubmit={handleUpdate}>
//                 {[
//                   "bookName",
//                   // "subject",
//                   "educationLevel",
//                   "language",
//                   "resourceType",
//                 ].map((field) => (
//                   <input
//                     key={field}
//                     type="text"
//                     name={field}
//                     value={editData[field] || ""}
//                     onChange={(e) =>
//                       setEditData((prev) => ({
//                         ...prev,
//                         [field]: e.target.value,
//                       }))
//                     }
//                     placeholder={field}
//                     className="w-full border border-gray-300 p-2 rounded text-sm"
//                     required
//                   />
//                 ))}

//                 <div>
//                   <label className="text-sm font-medium">
//                     (Pdf/Videos/Audios)
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
//                 </div>

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
//         {viewData && (
//           <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
//             <div className="relative w-full h-full flex items-center justify-center">
//               <div className="relative bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20 w-[95%] h-[90%] max-w-6xl max-h-[95%] overflow-hidden flex flex-col view-modal-container">
//                 <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/20">
//                   <h2 className="text-xl font-bold text-white">
//                     <button
//                       onClick={() => {
//                         navigate(`/books/${viewData.id}`);
//                       }}
//                       className="w-full text-sm text-blue-400 hover:text-blue-300 font-semibold"
//                     >
//                       {getViewLabel(viewData.resourceType)}
//                     </button>
//                   </h2>
//                   <div className="flex items-center gap-4">
//                     {(viewData.resourceType?.toLowerCase() === "pdf" ||
//                       viewData.resourceType?.toLowerCase() === "audio") && (
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
//                   {viewData?.resourceType?.toLowerCase() === "pdf" &&
//                     viewData?.id && (
//                       <FlipbookPDFViewer
//                         fileUrl={getCleanUrl(viewData.fileUrl)}
//                         bookId={viewData.id}
//                       />
//                     )}
//                   {viewData.resourceType?.toLowerCase() === "video" && (
//                     <video controls className="w-full h-full object-contain">
//                       <source
//                         src={getCleanUrl(viewData.fileUrl)}
//                         type="video/mp4"
//                       />
//                     </video>
//                   )}

//                   {viewData.resourceType?.toLowerCase() === "audio" && (
//                     <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
//                       <img
//                         src={getCleanUrl(
//                           viewData.thumbnail || "default-audio-cover.jpg"
//                         )}
//                         alt="Thumbnail"
//                         className="w-60 h-60 object-cover rounded-lg shadow-lg"
//                       />
//                       <audio controls className="w-2/3">
//                         <source
//                           src={getCleanUrl(viewData.fileUrl)}
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
// import {
//   fetchBooks,
//   uploadBook,
//   deleteBook,
//   updateBook,
// } from "../apiServices/booksApi";
// import { useNavigate } from "react-router-dom";


// const API_URL = import.meta.env.VITE_API_URL;
// const getCleanUrl = (path) =>
//   path ? path.replaceAll("\\", "/") : "";




// export default function ManageBooksPage({ role, Navbar, Sidebar }) {
// const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [bookList, setBookList] = useState([]);
//   const [editData, setEditData] = useState(null);
//   const [formData, setFormData] = useState({
//     bookName: "",
//     // chapter: "",
//      category:"",
//     subject: "",
//     educationLevel: "",
//     language: "",
//     // stateBoard: "",
//     resourceType: "",
//     file: null,
//     thumbnail: null,
//   });
 
//   useEffect(() => {
//     async function loadBooks() {
//       const books = await fetchBooks();
//      console.log(books[0].fileUrl);

      
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
//   uploadData.append("resourceType", formData.resourceType);
//   if (formData.file) uploadData.append("file", formData.file);
//   if (formData.thumbnail) uploadData.append("thumbnail", formData.thumbnail);

//   try {
//     const result = await uploadBook(uploadData);

//     if (result && result.id) {
//       setBookList((prev) => [...prev, result]);
//       setShowUploadModal(false);
//       setFormData({
//          resourceType: "",
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

//    const getViewLabel = (type) => {
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

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//           {bookList
//             .filter((b) =>
//               b?.bookName?.toLowerCase().includes(searchTerm.toLowerCase())
//             )
//             .map((b) => (
//               <div
//                 key={b.id}
//                 className="bg-white/10 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300"
//               >
//                 <div className="flex flex-col items-center gap-3">
//                   {/* Thumbnail */}
//                   <div className="relative w-full h-36  lg:h-44 bg-black/10 rounded-lg overflow-hidden">
//                     <img
//                          src={`${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(b.thumbnail + '/download')}`} 
//                       alt={b.bookName}
//                       className="w-full h-full object-contain p-2"
//                     />
//                     <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-1 rounded-full text-white border border-white/30 backdrop-blur-sm">
//                       {b.resourceType}
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
//                     onClick={() => setViewData(b)}
//                     className="w-full text-sm sm:text-base text-blue-400 hover:text-blue-300 font-semibold "
//                   >
//                     {getViewLabel(b.resourceType)}
//                   </button>

//                   {role === "admin" && (
//                     <div className="flex justify-between">
//                       <button
//                         onClick={() => setEditData(b)}
//                         className="text-yellow-400 hover:text-yellow-300 text-lg"
//                       >
//                         <FaEdit />
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
//           <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
//             <div className="bg-white text-black rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
//               <h2 className="text-2xl font-semibold mb-4 text-center">
//                 📤 Upload Book
//               </h2>

//               <form className="grid gap-4" onSubmit={handleUpload}>
//                 {[
//                   "bookName",
//                   // "chapter",
//                   "subject",
//                   "category",
//                   "educationLevel",
//                   "language",
//                   // "stateBoard",
//                   "resourceType",
//                 ].map((field) => (
//                   <input
//                     key={field}
//                     type="text"
//                     name={field}
//                     placeholder={field}
//                     className="w-full border border-gray-300 p-2 rounded text-sm"
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         [field]: e.target.value,
//                       }))
//                     }
//                     // required/
//                   />
//                 ))}

//                 <div>
//                   <label className="text-sm font-medium">
//                     (Pdf/Videos/Audios)
//                   </label>
//                   <input
//                     type="file"
//                     accept=".pdf,video/*,audio/*"
//                     // required
//                     className="w-full border p-2 rounded text-sm"
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         file: e.target.files[0],
//                       }))
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium">Thumbnail Image</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="w-full border p-2 rounded text-sm"
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         thumbnail: e.target.files[0],
//                       }))
//                     }
//                   />
//                 </div>

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

//                 <div>
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
//                 </div>
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
//         {viewData && (
//           <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
//             <div className="relative w-full h-full flex items-center justify-center">
//               <div className="relative bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20 w-[95%] h-[90%] max-w-6xl max-h-[95%] overflow-hidden flex flex-col view-modal-container">
//                 <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/20">
//                   <h2 className="text-xl font-bold text-white">
//                    <button
//                onClick={() => {  navigate(`/books/${viewData.id}`);}}
//                     className="w-full text-sm text-blue-400 hover:text-blue-300 font-semibold"
//                   >
//                     {getViewLabel(viewData.resourceType)}
//                   </button>
//                   </h2>
//                   <div className="flex items-center gap-4">
//                     {(viewData.resourceType?.toLowerCase() === "pdf" ||
//                       viewData.resourceType?.toLowerCase() === "audio") && (
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
//                  {viewData?.resourceType?.toLowerCase() === "pdf" && viewData?.id && (
//   <FlipbookPDFViewer
//     fileUrl={viewData.chapters[0].fileUrl}
//   bookId={viewData.id} 

//   />
// )}
//                   {viewData.resourceType?.toLowerCase() === "video" && (
//                     <video controls className="w-full h-full object-contain">
//                       <source
//                         src={getCleanUrl(viewData.fileUrl)}
//                         type="video/mp4"
//                       />
//                     </video>
//                   )}

//                   {viewData.resourceType?.toLowerCase() === "audio" && (
//                     <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
//                       <img
//                         src={getCleanUrl(
//                           viewData.thumbnail || "default-audio-cover.jpg"
//                         )}
//                         alt="Thumbnail"
//                         className="w-60 h-60 object-cover rounded-lg shadow-lg"
//                       />
//                       <audio controls className="w-2/3">
//                         <source
//                           src={getCleanUrl(viewData.fileUrl)}
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












// import { useEffect, useMemo, useState } from "react";
// import FlipbookPDFViewer from "./FlipbookPDFViewer";
// import { FaEdit, FaTrash, FaExpand, FaCompress } from "react-icons/fa";
// import { toast } from "react-toastify";
// import {
//   fetchBooks,
//   uploadBook,
//   deleteBook,
//   updateBook,
// } from "../apiServices/booksApi";
// import { useNavigate } from "react-router-dom";


// const API_URL = import.meta.env.VITE_API_URL;
// const getCleanUrl = (path) =>
//   path ? path.replaceAll("\\", "/") : "";


// const getBookResourceType = (book) =>
//   book.chapters?.[0]?.resourceType || "pdf";



// export default function ManageBooksPage({ role, Navbar, Sidebar }) {
// const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [bookList, setBookList] = useState([]);
//   const [editData, setEditData] = useState(null);
//   const [selectedChapter, setSelectedChapter] = useState(null);

//   const [formData, setFormData] = useState({
//     bookName: "",
//     // chapter: "",
//      category:"",
//     subject: "",
//     educationLevel: "",
//     language: "",
//     // stateBoard: "",
//     // resourceType: "",
//     file: null,
//     thumbnail: null,
//   });
// const getProxiedUrl = (url) => {
//   if (!url) return null;

//   // Nextcloud-style download link handling
//   if (url.includes("/index.php/s/")) {
//     if (!url.endsWith("/download")) url = url.replace(/\/+$/, "") + "/download";
//   }

//   return `${API_URL}/books/proxy/file?url=${encodeURIComponent(url)}`;
// };


// const chapterUrl = useMemo(() => {
//   if (!selectedChapter) return null;
//   return getChapterDownloadUrl(selectedChapter.fileUrl);
// }, [selectedChapter]);



//   useEffect(() => {
//     async function loadBooks() {
//       const books = await fetchBooks();
//          setBookList(books);
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
//          resourceType: "",
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

//    const getViewLabel = (type) => {
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

//        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//   {bookList
//     .filter((b) =>
//       b?.bookName?.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .map((b) => (
//       <div
//         key={b.id}
//         className="bg-white/10 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300"
//       >
//         <div className="flex flex-col items-center gap-3">
//           {/* Thumbnail */}
//           <div className="relative w-full h-36 lg:h-44 bg-black/10 rounded-lg overflow-hidden">
//             <img
//               src={`${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(b.thumbnail + '/download')}`} 
//               alt={b.bookName}
//               className="w-full h-full object-contain p-2"
//             />
//             <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-1 rounded-full text-white border border-white/30 backdrop-blur-sm">
//               {getViewLabel(getBookResourceType(b))}
//             </span>
//           </div>

//           {/* Text Section */}
//           <div className="text-center w-full break-words">
//             <h3 className="text-base text-md lg:text-lg font-bold mb-1">
//               {b.bookName}
//             </h3>
//             <p className="text-sm sm:text-base text-gray-300 mb-1">
//               {b.subject}
//             </p>
//             <p className="text-xs sm:text-sm text-gray-400">
//               🎓 {b.educationLevel}
//             </p>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex flex-col mt-auto pt-2 border-t border-white/20">
//   <button
//     onClick={() => {
//       setViewData(b);
//       setSelectedChapter(b.chapters?.[0] || null); 
//     }}
//     className="w-full text-sm sm:text-base text-blue-400 hover:text-blue-300 font-semibold"
//   >
//     {getViewLabel(getBookResourceType(b))}
//   </button>



//           {role === "admin" && (
//             <div className="flex justify-between mt-2">
//               <button
//                 onClick={() => setEditData(b)}
//                 className="text-yellow-400 hover:text-yellow-300 text-lg"
//               >
//                 <FaEdit />
//               </button>
//               <button
//                 onClick={() => navigate(`/books/${b.id}/chapters`)}
//                 className="text-green-400 hover:text-green-300 text-lg"
//                 title="Manage Chapters"
//               >
//                 📚
//               </button>
//               <button
//                 onClick={() => handleDelete(b.id)}
//                 className="text-red-500 hover:text-red-400 text-lg"
//               >
//                 <FaTrash />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     ))}
// </div>


//        {showUploadModal && (
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
//         {viewData && (
//           <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
//             <div className="relative w-full h-full flex items-center justify-center">
//               <div className="relative bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20 w-[95%] h-[90%] max-w-6xl max-h-[95%] overflow-hidden flex flex-col view-modal-container">
//                 <div className="flex items-center justify-between px-6 py-2 bg-white/5 border-b border-white/20">
//                   <h2 className="text-xl font-bold text-white">
//                    <h3
//                     className="w-full text-sm text-blue-400 hover:text-blue-300 font-semibold"
//                   >
//                     {getBookResourceType(viewData)}
//                   </h3>
//                   </h2>
//                   <div className="flex items-center gap-4">
//                     {(viewData.resourceType?.toLowerCase() === "pdf" ||
//                       viewData.resourceType?.toLowerCase() === "audio") && (
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
//                  {getBookResourceType(viewData)?.toLowerCase() === "pdf" &&
//   viewData?.chapters?.length > 0 && (
//     <FlipbookPDFViewer
 
//     fileUrl={viewData.chapters[0].fileUrl}
//  bookId={viewData.id} 
//   />

// )}

// {getBookResourceType(viewData)?.toLowerCase() === "video" && (
//     <video controls className="w-full h-full object-contain">
//       <source
//         src={getCleanUrl(viewData.fileUrl)}
//         type="video/mp4"
//       />
//     </video>
// )}

// {getBookResourceType(viewData)?.toLowerCase() === "audio" && (
//     <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
//       <img
//         src={getCleanUrl(
//           viewData.thumbnail || "default-audio-cover.jpg"
//         )}
//         alt="Thumbnail"
//         className="w-60 h-60 object-cover rounded-lg shadow-lg"
//       />
//       <audio controls className="w-2/3">
//         <source
//           src={getCleanUrl(viewData.fileUrl)}
//           type="audio/mpeg"
//         />
//       </audio>
//     </div>
// )}
// </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }





import { useEffect, useMemo, useState } from "react";
import FlipbookPDFViewer from "./FlipbookPDFViewer";
import { FaEdit, FaTrash, FaExpand, FaCompress } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  fetchBooks,
  uploadBook,
  deleteBook,
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


const getBookResourceType = (book) =>
  book.chapters?.[0]?.resourceType || "pdf";

export default function ManageBooksPage({ role, Navbar, Sidebar }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookList, setBookList] = useState([]);
  const [editData, setEditData] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [classes, setClasses] = useState([]); // <-- API se classes
  const [selectedClass, setSelectedClass] = useState(""); // <-- filter state

  const [formData, setFormData] = useState({
    bookName: "",
    category: "",
    subject: "",
    educationLevel: "",
    language: "",
    file: null,
    thumbnail: null,
  });


  useEffect(() => {
    async function loadBooks() {
      const books = await fetchBooks();
      setBookList(books);
    }
    loadBooks();

    async function loadClasses() {
      try {
        const res = await fetch(`${API_URL}/classes`, { credentials: "include" });
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

  const uploadData = new FormData();
  uploadData.append("bookName", formData.bookName);
  uploadData.append("category", formData.category);
  uploadData.append("subject", formData.subject);
  uploadData.append("educationLevel", formData.educationLevel);
  uploadData.append("language", formData.language);
  // uploadData.append("resourceType", formData.resourceType);
  if (formData.file) uploadData.append("file", formData.file);
  if (formData.thumbnail) uploadData.append("thumbnail", formData.thumbnail);

  try {
    const result = await uploadBook(uploadData);

    if (result && result.id) {
      setBookList((prev) => [...prev, result]);
      setShowUploadModal(false);
      setFormData({
        
        bookName: "",
        subject: "",
      
        educationLevel: "",
        language: "",
        
         category: "",
        file: null,
        thumbnail: null,
      });
navigate(`/books/${result.id}/chapters`);


      toast.success("Book uploaded successfully ✅");
    } else {
      toast.error("Upload failed ❌");
    }
  } catch (error) {
    toast.error("Something went wrong during upload ❌");
    console.error("Upload Error:", error);
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

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      {Sidebar && <Sidebar />}
      <main className="pl-[280px] py-6 pr-5 w-full">
        {Navbar && (
          <Navbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAdd={() => setShowUploadModal(true)}
            buttonLabel="+ Upload Book"
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
              <option key={idx} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bookList
            .filter((b) =>
  selectedClass ? String(b.educationLevel) === selectedClass : true
)

            .map((b) => (
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
                      fetch(`${API_URL}/books/${b.id}/chapters/meta`, { credentials: "include" })
    .then(res => res.json())
    .then(data => {
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



        {showUploadModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
    <div className="bg-white text-black rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        📤 Upload Book
      </h2>

      <form className="grid gap-4" onSubmit={handleUpload}>
        {/* Resource Type Dropdown */}
        {/* <div>
          <label className="text-sm font-medium">Resource Type</label>
          <select
            name="resourceType"
            className="w-full border border-gray-300 p-2 rounded text-sm"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                resourceType: e.target.value,
              }))
            }
            required
          >
            <option value="">Select Resource Type</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div> */}

        {/* Book Name */}
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
          required
        />

        {/* Subject */}
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          className="w-full border border-gray-300 p-2 rounded text-sm"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              subject: e.target.value,
            }))
          }
        />

        <div>
        <label className="text-sm font-medium">Education Level</label>
        <select
            name="educationLevel"
            className="w-full border border-gray-300 p-2 rounded text-sm"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                educationLevel: e.target.value,
              }))
            }
            required
          >
            <option value="">Select Classes</option>
  {Array.from({ length: 12 }, (_, i) => (
    <option key={i + 1} value={`Class ${i + 1}`}>
      Class {i + 1}
    </option>
  ))}
          </select>
        </div>

        {/* Language Dropdown */}
        <div>
          <label className="text-sm font-medium">Language</label>
          <select
            name="language"
            className="w-full border border-gray-300 p-2 rounded text-sm"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                language: e.target.value,
              }))
            }
            required
          >
            <option value="">Select Language</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>

        
        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            name="category"
            className="w-full border border-gray-300 p-2 rounded text-sm"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
            required
          >
            <option value="">Select Education Level</option>
            <option value="School Education">School Education</option>
            <option value="School Education">Simulation</option>
          </select>
        </div>

        {/* Thumbnail Upload */}
        <div>
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
        </div>

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
    "totalPages"  
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
                    // required
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
                  {getBookResourceType(viewData) === "pdf" && selectedChapter && (
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

//recode

// import { useEffect, useState } from "react";
// import { FaEdit, FaTrash, FaExpand, FaCompress } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { fetchBooks, uploadBook, deleteBook } from "../apiServices/booksApi";
// import { useNavigate } from "react-router-dom";
// import FlipbookPDFViewer from "./FlipbookPDFViewer";

// const API_URL = import.meta.env.VITE_API_URL;

// const getProxiedUrl = (url) => {
//   if (!url) return null;
//   if (url.includes("/index.php/s/")) {
//     if (!url.endsWith("/download")) url = url.replace(/\/+$/, "") + "/download";
//   }
//   return `${API_URL}/books/proxy/file?url=${encodeURIComponent(url)}`;
// };

// const getBookResourceType = (book) => book.chapters?.[0]?.resourceType || "pdf";

// export default function ManageBooksPage({ role, Navbar, Sidebar }) {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [bookList, setBookList] = useState([]);
//   const [editData, setEditData] = useState(null);
//   const [selectedChapter, setSelectedChapter] = useState(null);

//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [languages] = useState(["English", "Hindi"]);

//   const [filters, setFilters] = useState({
//     selectedClass: "",
//     selectedSubject: "",
//     selectedLanguage: "",
//   });

//   const [formData, setFormData] = useState({
//     bookName: "",
//     category: "",
//     subject: "",
//     educationLevel: "",
//     language: "",
//     file: null,
//     thumbnail: null,
//   });

//   // Load Books, Classes, Subjects
//   useEffect(() => {
//     async function loadBooks() {
//       const books = await fetchBooks();
//       setBookList(books);
//     }
//     async function loadClasses() {
//       setClasses(Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`));
//     }
//     async function loadSubjects() {
//       const allSubjects = [...new Set(bookList.map((b) => b.subject).filter(Boolean))];
//       setSubjects(allSubjects);
//     }
//     loadBooks();
//     loadClasses();
//     loadSubjects();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await deleteBook(id);
//       setBookList((prev) => prev.filter((book) => book.id !== id));
//       toast.success("Deleted successfully ✅");
//     } catch (err) {
//       toast.error("Delete failed ❌");
//       console.error(err);
//     }
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     const uploadData = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (formData[key]) uploadData.append(key, formData[key]);
//     });
//     try {
//       const result = await uploadBook(uploadData);
//       if (result?.id) {
//         setBookList((prev) => [...prev, result]);
//         setShowUploadModal(false);
//         setFormData({
//           bookName: "",
//           subject: "",
//           educationLevel: "",
//           language: "",
//           category: "",
//           file: null,
//           thumbnail: null,
//         });
//         navigate(`/books/${result.id}/chapters`);
//         toast.success("Book uploaded ✅");
//       } else {
//         toast.error("Upload failed ❌");
//       }
//     } catch (err) {
//       toast.error("Upload error ❌");
//       console.error(err);
//     }
//   };

//   const getViewLabel = (type) => {
//     switch (type?.toLowerCase()) {
//       case "pdf": return "📄 View";
//       case "video": return "▶️ Play";
//       case "audio": return "🔊 Listen";
//       default: return "📁 Open";
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

//   // Filtered books
//   const filteredBooks = bookList.filter((b) => {
//     const classMatch = filters.selectedClass ? b.educationLevel === filters.selectedClass : true;
//     const subjectMatch = filters.selectedSubject ? b.subject === filters.selectedSubject : true;
//     const langMatch = filters.selectedLanguage ? b.language === filters.selectedLanguage : true;
//     const searchMatch = b.bookName.toLowerCase().includes(searchTerm.toLowerCase());
//     return classMatch && subjectMatch && langMatch && searchMatch;
//   });

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

//         {/* Filters */}
//         <div className="flex flex-wrap gap-3 mb-6">
//           <select
//             className="border rounded px-2 py-1 text-black"
//             value={filters.selectedClass}
//             onChange={(e) => setFilters(prev => ({ ...prev, selectedClass: e.target.value }))}
//           >
//             <option value="">All Classes</option>
//             {classes.map((cls, i) => <option key={i} value={cls}>{cls}</option>)}
//           </select>

//           <select
//             className="border rounded px-2 py-1 text-black"
//             value={filters.selectedSubject}
//             onChange={(e) => setFilters(prev => ({ ...prev, selectedSubject: e.target.value }))}
//           >
//             <option value="">All Subjects</option>
//             {subjects.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
//           </select>

//           <select
//             className="border rounded px-2 py-1 text-black"
//             value={filters.selectedLanguage}
//             onChange={(e) => setFilters(prev => ({ ...prev, selectedLanguage: e.target.value }))}
//           >
//             <option value="">All Languages</option>
//             {languages.map((lang, i) => <option key={i} value={lang}>{lang}</option>)}
//           </select>
//         </div>

//         {/* Books Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {filteredBooks.map((b) => (
//             <div key={b.id} className="bg-white/10 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300">
//               <div className="flex flex-col items-center gap-3">
//                 <div className="relative w-full h-36 lg:h-44 bg-black/10 rounded-lg overflow-hidden">
//                   <img
//                     src={getProxiedUrl(b.thumbnail)}
//                     alt={b.bookName}
//                     className="w-full h-full object-contain p-2"
//                   />
//                   <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-1 rounded-full text-white border border-white/30 backdrop-blur-sm">
//                     {getViewLabel(getBookResourceType(b))}
//                   </span>
//                 </div>

//                 <div className="text-center w-full break-words">
//                   <h3 className="text-base lg:text-lg font-bold mb-1">{b.bookName}</h3>
//                   <p className="text-sm text-gray-300 mb-1">{b.subject}</p>
//                   <p className="text-xs text-gray-400">🎓 {b.educationLevel}</p>
//                 </div>
//               </div>

//               <div className="flex justify-between mt-auto pt-2 border-t border-white/20">
//                 <button
//                   onClick={() => {
//                     setViewData(b);
//                     fetch(`${API_URL}/books/${b.id}/chapters/meta`, { credentials: "include" })
//                       .then(res => res.json())
//                       .then(data => setSelectedChapter(data[0] || null));
//                   }}
//                   className="text-blue-400 hover:text-blue-300 font-semibold"
//                 >
//                   {getViewLabel(getBookResourceType(b))}
//                 </button>

//                 {role === "admin" && (
//                   <div className="flex gap-2">
//                     <button onClick={() => setEditData(b)} className="text-yellow-400 hover:text-yellow-300"><FaEdit /></button>
//                     <button onClick={() => navigate(`/books/${b.id}/chapters`)} className="text-green-400 hover:text-green-300">📚</button>
//                     <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-400"><FaTrash /></button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Upload Modal */}
//         {showUploadModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
//             <div className="bg-white text-black rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
//               <h2 className="text-2xl font-semibold mb-4 text-center">📤 Upload Book</h2>
//               <form className="grid gap-4" onSubmit={handleUpload}>
//                 <input type="text" placeholder="Book Name" className="w-full border p-2 rounded" required
//                   onChange={(e) => setFormData(prev => ({ ...prev, bookName: e.target.value }))} />
//                 <input type="text" placeholder="Subject" className="w-full border p-2 rounded"
//                   onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} />
//                 <select className="border p-2 rounded"
//                   onChange={(e) => setFormData(prev => ({ ...prev, educationLevel: e.target.value }))} required>
//                   <option value="">Select Class</option>
//                   {classes.map((cls, i) => <option key={i} value={cls}>{cls}</option>)}
//                 </select>
//                 <select className="border p-2 rounded"
//                   onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))} required>
//                   <option value="">Select Language</option>
//                   {languages.map((lang, i) => <option key={i} value={lang}>{lang}</option>)}
//                 </select>
//                 <input type="file" className="border p-2 rounded" required
//                   onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files[0] }))} />
//                 <input type="file" className="border p-2 rounded"
//                   onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.files[0] }))} />
//                 <div className="flex justify-end gap-2 mt-4">
//                   <button type="button" className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={() => setShowUploadModal(false)}>Cancel</button>
//                   <button type="submit" className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white">Upload</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* View Drawer */}
//         {viewData && selectedChapter && (
//           <div className="fixed inset-0 z-40 flex justify-end">
//             <div className="bg-[#1e1f2b] w-full sm:w-[80%] md:w-[70%] lg:w-[60%] h-full overflow-auto relative p-4">
//               <button className="absolute top-4 right-4 text-white text-xl" onClick={() => setViewData(null)}>✖</button>
//               <h2 className="text-xl font-bold mb-4">{viewData.bookName}</h2>
//               <div className="view-modal-container">
//                 <FlipbookPDFViewer book={viewData} chapter={selectedChapter} />
//               </div>
//               <button
//                 onClick={handleFullscreenToggle}
//                 className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
//               </button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// // }

// import { useEffect, useState } from "react";
// import FlipbookPDFViewer from "./FlipbookPDFViewer";
// import { FaEdit, FaTrash, FaExpand, FaCompress } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { fetchBooks, uploadBook, deleteBook } from "../apiServices/booksApi";
// import { useNavigate } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL;

// const getProxiedUrl = (url) => {
//   if (!url) return null;
//   if (url.includes("/index.php/s/")) {
//     if (!url.endsWith("/download")) url = url.replace(/\/+$/, "") + "/download";
//   }
//   return `${API_URL}/books/proxy/file?url=${encodeURIComponent(url)}`;
// };

// const getBookResourceType = (book) => book.chapters?.[0]?.resourceType || "pdf";

// export default function ManageBooksPage({ role, Navbar, Sidebar }) {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [bookList, setBookList] = useState([]);
//   const [editData, setEditData] = useState(null);
//   const [selectedChapter, setSelectedChapter] = useState(null);

//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [languages] = useState(["English", "Hindi"]);

//   const [filters, setFilters] = useState({
//     selectedClass: "",
//     selectedSubject: "",
//     selectedLanguage: "",
//   });

//   const [formData, setFormData] = useState({
//     bookName: "",
//     category: "",
//     subject: "",
//     educationLevel: "",
//     language: "",
//     file: null,
//     thumbnail: null,
//   });

//   // Load Books, Classes, Subjects
//   useEffect(() => {
//     async function loadBooks() {
//       const books = await fetchBooks();
//       setBookList(books);
//       const allSubjects = [...new Set(books.map((b) => b.subject).filter(Boolean))];
//       setSubjects(allSubjects);
//     }

//     async function loadClasses() {
//       try {
//         const res = await fetch(`${API_URL}/classes`, { credentials: "include" });
//         const data = await res.json();
//         if (Array.isArray(data)) setClasses(data);
//         else setClasses(Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`));
//       } catch {
//         setClasses(Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`));
//       }
//     }

//     loadBooks();
//     loadClasses();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await deleteBook(id);
//       setBookList((prev) => prev.filter((b) => b.id !== id));
//       toast.success("Deleted successfully ✅");
//     } catch (err) {
//       toast.error("Delete failed ❌");
//       console.error(err);
//     }
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     const uploadData = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (formData[key]) uploadData.append(key, formData[key]);
//     });
//     try {
//       const result = await uploadBook(uploadData);
//       if (result?.id) {
//         setBookList((prev) => [...prev, result]);
//         setShowUploadModal(false);
//         setFormData({
//           bookName: "",
//           subject: "",
//           educationLevel: "",
//           language: "",
//           category: "",
//           file: null,
//           thumbnail: null,
//         });
//         navigate(`/books/${result.id}/chapters`);
//         toast.success("Book uploaded ✅");
//       } else {
//         toast.error("Upload failed ❌");
//       }
//     } catch (err) {
//       toast.error("Upload error ❌");
//       console.error(err);
//     }
//   };

//   const getViewLabel = (type) => {
//     switch (type?.toLowerCase()) {
//       case "pdf": return "📄 View";
//       case "video": return "▶️ Play";
//       case "audio": return "🔊 Listen";
//       default: return "📁 Open";
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

//   // Filtered books
//   const filteredBooks = bookList.filter((b) => {
//     const classMatch = filters.selectedClass ? b.educationLevel === filters.selectedClass : true;
//     const subjectMatch = filters.selectedSubject ? b.subject === filters.selectedSubject : true;
//     const langMatch = filters.selectedLanguage ? b.language === filters.selectedLanguage : true;
//     const searchMatch = b.bookName.toLowerCase().includes(searchTerm.toLowerCase());
//     return classMatch && subjectMatch && langMatch && searchMatch;
//   });

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       {Sidebar && <Sidebar />}
//       <main className="pl-[280px] py-6 pr-5 w-full">
//         {Navbar && (
//           <Navbar
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             onAdd={() => setShowUploadModal(true)}
//             // buttonLabel="+ Upload Book"
//             searchPlaceholder="Search Books..."
//           />
//         )}

//         <h1 className="text-2xl font-bold mb-4">📘 Manage Books</h1>

//         {/* Filters */}
//         <div className="flex flex-wrap gap-3 mb-6">
//           <select
//             className="border rounded px-2 py-1 text-black"
//             value={filters.selectedClass}
//             onChange={(e) => setFilters(prev => ({ ...prev, selectedClass: e.target.value }))}
//           >
//             <option value="">All Classes</option>
//             {classes.map((cls, i) => <option key={i} value={cls}>{cls}</option>)}
//           </select>

//           <select
//             className="border rounded px-2 py-1 text-black"
//             value={filters.selectedSubject}
//             onChange={(e) => setFilters(prev => ({ ...prev, selectedSubject: e.target.value }))}
//           >
//             <option value="">All Subjects</option>
//             {subjects.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
//           </select>

//           <select
//             className="border rounded px-2 py-1 text-black"
//             value={filters.selectedLanguage}
//             onChange={(e) => setFilters(prev => ({ ...prev, selectedLanguage: e.target.value }))}
//           >
//             <option value="">All Languages</option>
//             {languages.map((lang, i) => <option key={i} value={lang}>{lang}</option>)}
//           </select>
//         </div>

//         {/* Books Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {filteredBooks.map((b) => (
//             <div key={b.id} className="bg-white/10 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300">
//               <div className="flex flex-col items-center gap-3">
//                 <div className="relative w-full h-36 lg:h-44 bg-black/10 rounded-lg overflow-hidden">
//                   <img
//                     src={getProxiedUrl(b.thumbnail)}
//                     alt={b.bookName}
//                     className="w-full h-full object-contain p-2"
//                   />
//                   <span className="absolute top-2 right-2 bg-white/20 text-xs px-2 py-1 rounded-full text-white border border-white/30 backdrop-blur-sm">
//                     {getViewLabel(getBookResourceType(b))}
//                   </span>
//                 </div>

//                 <div className="text-center w-full break-words">
//                   <h3 className="text-base lg:text-lg font-bold mb-1">{b.bookName}</h3>
//                   <p className="text-sm text-gray-300 mb-1">{b.subject}</p>
//                   <p className="text-xs text-gray-400">🎓 {b.educationLevel}</p>
//                 </div>
//               </div>

//               <div className="flex justify-between mt-auto pt-2 border-t border-white/20">
//                 <button
//                   onClick={() => {
//                     setViewData(b);
//                     fetch(`${API_URL}/books/${b.id}/chapters/meta`, { credentials: "include" })
//                       .then(res => res.json())
//                       .then(data => setSelectedChapter(data[0] || null));
//                   }}
//                   className="text-blue-400 hover:text-blue-300 font-semibold"
//                 >
//                   {getViewLabel(getBookResourceType(b))}
//                 </button>

//                 {role === "admin" && (
//                   <div className="flex gap-2">
//                     <button onClick={() => setEditData(b)} className="text-yellow-400 hover:text-yellow-300"><FaEdit /></button>
//                     <button onClick={() => navigate(`/books/${b.id}/chapters`)} className="text-green-400 hover:text-green-300">📚</button>
//                     <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-400"><FaTrash /></button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Upload Modal */}
//         {showUploadModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
//             <div className="bg-white text-black rounded-lg w-[95%] max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
//               <h2 className="text-2xl font-semibold mb-4 text-center">📤 Upload Book</h2>
//               <form className="grid gap-4" onSubmit={handleUpload}>
//                 <input type="text" placeholder="Book Name" className="w-full border p-2 rounded" required
//                   onChange={(e) => setFormData(prev => ({ ...prev, bookName: e.target.value }))} />
//                 <input type="text" placeholder="Subject" className="w-full border p-2 rounded"
//                   onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} />
//                 <select className="border p-2 rounded"
//                   onChange={(e) => setFormData(prev => ({ ...prev, educationLevel: e.target.value }))} required>
//                   <option value="">Select Class</option>
//                   {classes.map((cls, i) => <option key={i} value={cls}>{cls}</option>)}
//                 </select>
//                 <select className="border p-2 rounded"
//                   onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))} required>
//                   <option value="">Select Language</option>
//                   {languages.map((lang, i) => <option key={i} value={lang}>{lang}</option>)}
//                 </select>
//                 <input type="file" className="border p-2 rounded" required
//                   onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files[0] }))} />
//                 <input type="file" className="border p-2 rounded"
//                   onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.files[0] }))} />
//                 <div className="flex justify-end gap-2 mt-4">
//                   <button type="button" className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={() => setShowUploadModal(false)}>Cancel</button>
//                   <button type="submit" className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white">Upload</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* View Drawer */}
//         {viewData && selectedChapter && (
//           <div className="fixed inset-0 z-40 flex justify-end">
//             <div className="bg-[#1e1f2b] w-full sm:w-[80%] md:w-[70%] lg:w-[60%] h-full overflow-auto relative p-4">
//               <button className="absolute top-4 right-4 text-white text-xl" onClick={() => setViewData(null)}>✖</button>
//               <h2 className="text-xl font-bold mb-4">{viewData.bookName}</h2>
//               <div className="view-modal-container">
//                 <FlipbookPDFViewer book={viewData} chapter={selectedChapter} />
//               </div>
//               <button
//                 onClick={handleFullscreenToggle}
//                 className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
//               </button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
