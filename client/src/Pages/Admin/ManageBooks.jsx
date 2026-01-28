// import { useEffect, useState } from "react";
// import {
//   Search,
//   Filter,
//   Eye,
//   Edit2,
//   BookOpen,
//   FileText,
//   Video,
// } from "lucide-react";
// import { FiMenu } from "react-icons/fi";
// import { FaExpand, FaCompress,FaTrash } from "react-icons/fa"

// import Sidebar from "../Admin/AdminSidebar";
// import AdminNavbar from "../Admin/AdminNavbar";

// import { fetchBooks, deleteBook,updateBook } from "../../apiServices/booksApi";
// import { confirmDelete } from "../../utils/confirmDelete";
// import { useLoader } from "../../LoaderContext";
// import { toast } from "react-toastify";
// import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
// import EditBookModal from "./UploadForms/EditBookModal";


// export default function ManageBooks() {
//   const { setLoading } = useLoader();

//   const [books, setBooks] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [editBookData, setEditBookData] = useState(null);



//   const API_URL = import.meta.env.VITE_API_URL;

//   const getProxiedUrl = (url) => {
//     if (!url) return null;
//     if (url.includes("/index.php/s/")) {
//       if (!url.endsWith("/download")) {
//         url = url.replace(/\/+$/, "") + "/download";
//       }
//     }
//     return `${API_URL}/books/proxy/file?url=${encodeURIComponent(url)}`;
//   };

//   const getBookResourceType = (book) =>
//     book?.chapters?.[0]?.resourceType || "pdf";


//   useEffect(() => {
//     loadBooks();
//   }, []);

//   const loadBooks = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchBooks();
//       setBooks(data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load books");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateBook = async (updatedBook) => {
//     try {
//       setLoading(true);

//       const formData = new FormData();

//       // only editable fields
//       formData.append("category", updatedBook.category);
//       formData.append("educationLevel", updatedBook.educationLevel);
//       formData.append("subject", updatedBook.subject);
//       formData.append("bookName", updatedBook.bookName);
//       formData.append("language", updatedBook.language);

//       const res = await updateBook(updatedBook.id, formData);

//       // UI me list update
//       setBooks((prev) =>
//         prev.map((b) => (b.id === updatedBook.id ? res : b))
//       );

//       toast.success("Book updated successfully ✅");
//       setIsEditOpen(false);
//     } catch (error) {
//       toast.error(error.message || "Update failed ❌");
//     } finally {
//       setLoading(false);
//     }
//   };


//   // ================= DELETE =================
//   const handleDelete = async (id) => {
//     const ok = await confirmDelete(
//       "Are you sure you want to delete this book?"
//     );
//     if (!ok) return;

//     try {
//       await deleteBook(id);
//       setBooks((prev) => prev.filter((b) => b.id !== id));
//       toast.success("Book deleted successfully");
//     } catch (err) {
//       toast.error("Delete failed");
//     }
//   };

//   // ================= SEARCH =================
//   const filteredBooks = books.filter((book) =>
//     `${book.bookName} ${book.subject} ${book.educationLevel}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   const handleFullscreenToggle = () => {
//     setIsFullscreen((prev) => !prev);
//   };

//   return (
//     <div className="flex min-h-screen bg-darkBg text-primaryWhite">
//       {/* SIDEBAR */}
//       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

//       {/* MAIN CONTENT */}
//       <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
//         {/* MOBILE MENU */}
//         <div className="lg:hidden mb-4">
//           <button onClick={() => setIsSidebarOpen(true)}>
//             <FiMenu size={28} />
//           </button>
//         </div>

//         {/* NAVBAR */}
//         <AdminNavbar />

//         {/* HEADER */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold">Manage Books</h1>
//           <p className="text-gray-400">
//             View, edit and organize your book collection
//           </p>
//         </div>

//         {/* SEARCH & FILTER */}
//         <div className="bg-cardBg p-4 rounded-lg shadow mb-6 flex flex-wrap gap-3">
//           <div className="relative flex-1 min-w-[280px]">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search books..."
//               className="w-full pl-10 pr-4 py-2 bg-darkBg border border-gray-600 rounded text-primaryWhite"
//             />
//           </div>

//           <button className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded hover:bg-gray-700">
//             <Filter size={16} /> Filter
//           </button>
//         </div>

//         {/* TABLE */}
//         <div className="bg-cardBg rounded-lg shadow overflow-x-auto">
//           <table className="w-full min-w-[900px] text-left">
//             <thead className="border-b border-gray-700 text-gray-400 text-sm">
//               <tr>
//                 <th className="px-6 py-4">Book</th>
//                 <th className="px-6 py-4 text-center">Category</th>
//                 <th className="px-6 py-4">Subject</th>
//                 <th className="px-6 py-4">Level</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredBooks.length === 0 && (
//                 <tr>
//                   <td colSpan="7" className="text-center py-10 text-gray-400">
//                     No books found
//                   </td>
//                 </tr>
//               )}

//               {filteredBooks.map((book) => (
//                 <tr
//                   key={book.id}
//                   className="border-b border-gray-800 hover:bg-gray-800"
//                 >
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
//                         <BookOpen className="text-primaryBlue" size={20} />
//                       </div>
//                       <div>
//                         <p className="font-semibold">{book.bookName}</p>
//                         <p className="text-xs text-gray-400">{book.language}</p>
//                       </div>
//                     </div>
//                   </td>

//                   <td className="px-6 py-4 text-center">
//                     <div className="inline-flex flex-col items-center gap-1">
//                       <span className="px-3 py-2 text-[11px] font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow whitespace-nowrap">
//                         {book.category}
//                       </span>

//                       <span className="text-[10px] text-gray-400">
//                         {book.language}
//                       </span>
//                     </div>
//                   </td>

//                   <td className="px-6 py-4">{book.subject}</td>
//                   <td className="px-6 py-2 whitespace-nowrap">{book.educationLevel}</td>

//                   <td className="px-6 py-4 text-center">
//                     <div className="flex justify-center gap-2">
//                       {book.hasVideo && <Video size={14} />}
//                       {book.hasNote && <FileText size={14} />}
//                     </div>
//                   </td>

//                   <td className="px-6 py-4">
//                     <div className="flex justify-end gap-3 text-gray-300">
//                       <Eye
//                         className="cursor-pointer hover:text-primaryBlue"
//                         onClick={() => {
//                           setViewData(book);

//                           fetch(`${API_URL}/books/${book.id}/chapters/meta`, {
//                             credentials: "include",
//                           })
//                             .then((res) => res.json())
//                             .then((data) => {
//                               if (Array.isArray(data) && data.length > 0) {
//                                 setSelectedChapter(data[0]); // first chapter open
//                               } else {
//                                 setSelectedChapter(null);
//                               }
//                             })
//                             .catch(() => {
//                               toast.error("Failed to load book content");
//                             });
//                         }}
//                       />

//                       <Edit2
//                         className="cursor-pointer hover:text-primaryOrange"
//                         onClick={() => {
//                           setEditBookData(book);
//                           setIsEditOpen(true);
//                         }}
//                       />

//                       <FaTrash
//                         onClick={() => handleDelete(book.id)}
//                         className="cursor-pointer hover:text-primaryRed"
//                       />
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {viewData && selectedChapter && (
//             <div className="fixed inset-0 z-50 bg-primaryBlack bg-opacity-60 flex justify-center items-center">
//               <div className="relative w-full h-full flex items-center justify-center">
//                 <div
//                   className={`relative bg-primaryWhite/10 backdrop-blur-md shadow-2xl border border-primaryWhite/20 overflow-hidden flex flex-col view-modal-container transition-all duration-300
//     ${isFullscreen
//                       ? "w-[95%] h-[90%] max-w-6xl max-h-[95%] rounded-xl"
//                       : "w-screen h-screen max-w-none max-h-none rounded-none"
//                     }
//   `}
//                 >

//                   <div className="flex items-center justify-between px-6 py-2 bg-primaryWhite/5 border-b border-primaryWhite/20">
//                     <h3 className="text-xl font-bold text-primaryWhite">
//                       {getBookResourceType(viewData)}
//                     </h3>
//                     <div className="flex items-center gap-4">
//                       {(getBookResourceType(viewData) === "pdf" ||
//                         getBookResourceType(viewData) === "audio") && (
//                           <button
//                             onClick={handleFullscreenToggle}
//                             className="text-primaryWhite text-xl hover:text-lightGreen"
//                             title="Toggle Fullscreen"
//                           >
//                             {isFullscreen ? <FaCompress /> : <FaExpand />}
//                           </button>
//                         )}
//                       <button
//                         onClick={() => setViewData(null)}
//                         className="text-primaryWhite text-2xl hover:text-primaryRed"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   </div>

//                   <div className="flex-1 overflow-hidden bg-primaryBlack">
//                     {getBookResourceType(viewData) === "pdf" &&
//                       selectedChapter && (
//                         <FlipbookPDFViewer
//                           chapter={selectedChapter}
//                           bookId={viewData.id}
//                         />
//                       )}

//                     {getBookResourceType(viewData) === "video" && (
//                       <video controls className="w-full h-full object-contain">
//                         <source
//                           src={getProxiedUrl(viewData.fileUrl)}
//                           type="video/mp4"
//                         />
//                       </video>
//                     )}

//                     {getBookResourceType(viewData) === "audio" && (
//                       <div className="flex flex-col items-center justify-center h-full gap-4 text-primaryWhite">
//                         <img
//                           src={getProxiedUrl(
//                             viewData.thumbnail || "default-audio-cover.jpg"
//                           )}
//                           alt="Thumbnail"
//                           className="w-60 h-60 object-cover rounded-lg shadow-lg"
//                         />
//                         <audio controls className="w-2/3">
//                           <source
//                             src={getProxiedUrl(viewData.fileUrl)}
//                             type="audio/mpeg"
//                           />
//                         </audio>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//         <EditBookModal
//           isOpen={isEditOpen}
//           bookData={editBookData}
//           setBookData={setEditBookData}
//           onClose={() => setIsEditOpen(false)}
//           onSave={handleUpdateBook}
//         />
//       </main>
//     </div>

//   );

// }











import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Edit2,
  BookOpen,
  FileText,
  Video,
} from "lucide-react";
import { FiMenu } from "react-icons/fi";
import { FaExpand, FaCompress, FaTrash } from "react-icons/fa"

import Sidebar from "../Admin/AdminSidebar";
import AdminNavbar from "../Admin/AdminNavbar";

import { fetchBooks, deleteBook, updateBook } from "../../apiServices/booksApi";
import { confirmDelete } from "../../utils/confirmDelete";
import { useLoader } from "../../LoaderContext";
import { toast } from "react-toastify";
import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
import EditBookModal from "./UploadForms/EditBookModal";
import { getRepository } from "../../apiServices/apiRepository";


export default function ManageBooks() {
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const { setLoading } = useLoader();

  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editBookData, setEditBookData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(false);



  const API_URL = import.meta.env.VITE_API_URL;

  const getProxiedUrl = (url) => {
    if (!url) return null;
    if (url.includes("/index.php/s/")) {
      if (!url.endsWith("/download")) {
        url = url.replace(/\/+$/, "") + "/download";
      }
    }
    return `${API_URL}/books/proxy/file?url=${encodeURIComponent(url)}`;
  };

  const getBookResourceType = (book) =>
    book?.chapters?.[0]?.resourceType || "pdf";

  const fetchCategories = async () => {
    if (categories.length > 0) return; // dobara call na ho

    try {
      setLoadingCategories(true);
      const res = await getRepository("category");
      // expected response: [{ id, text }]
      setCategories(res);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await fetchBooks();
      setBooks(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBook = async (updatedBook) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // only editable fields
      formData.append("category", updatedBook.category);
      formData.append("educationLevel", updatedBook.educationLevel);
      formData.append("subject", updatedBook.subject);
      formData.append("bookName", updatedBook.bookName);
      formData.append("language", updatedBook.language);

      const res = await updateBook(updatedBook.id, formData);

      // UI me list update
      setBooks((prev) =>
        prev.map((b) => (b.id === updatedBook.id ? res : b))
      );

      toast.success("Book updated successfully ✅");
      setIsEditOpen(false);
    } catch (error) {
      toast.error(error.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };


  // ================= DELETE =================
  const handleDelete = async (id) => {
    const ok = await confirmDelete(
      "Are you sure you want to delete this book?"
    );
    if (!ok) return;

    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Book deleted successfully");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = `${book.bookName} ${book.subject} ${book.educationLevel}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory
      ? book.category === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  const MAX_VISIBLE_PAGES = 5;

  const getVisiblePages = () => {
    let start = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
    let end = start + MAX_VISIBLE_PAGES - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };


  const handleFullscreenToggle = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-darkBg text-primaryWhite">
      {/* SIDEBAR */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
        {/* MOBILE MENU */}
        <div className="lg:hidden mb-4">
          <button onClick={() => setIsSidebarOpen(true)}>
            <FiMenu size={28} />
          </button>
        </div>

        {/* NAVBAR */}
        <AdminNavbar />

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Manage Books</h1>
          <p className="text-gray-400">
            View, edit and organize your book collection
          </p>
        </div>

        <div className="bg-cardBg p-4 rounded-lg shadow mb-6 flex flex-wrap gap-3">

          {/* SEARCH */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}

              placeholder="Search books..."
              className="w-full pl-10 pr-4 py-2 bg-darkBg border border-gray-600 rounded text-primaryWhite"
            />
          </div>

          {/* CATEGORY DROPDOWN (API) */}
          <select
            value={selectedCategory}
            onFocus={fetchCategories}   // 👈 yahin API call hogi
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}

            className="px-4 py-2 bg-darkBg border border-gray-600 rounded text-primaryWhite min-w-[220px]"
          >
            <option value="">
              {loadingCategories ? "Loading..." : "All Categories"}
            </option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.text}>
                {cat.text}
              </option>
            ))}
          </select>

          {/* CLEAR */}
          {(searchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700 text-sm"
            >
              Clear
            </button>
          )}
        </div>


        {/* TABLE */}
        <div className="bg-cardBg rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-gray-700 text-gray-400 text-sm">
              <tr>
                <th className="px-6 py-4">Book</th>
                <th className="px-6 py-4 text-center">Category</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Level</th>
              </tr>
            </thead>

            <tbody>
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400">
                    No books found
                  </td>
                </tr>
              )}

              {paginatedBooks.map((book) => (
                <tr
                  key={book.id}
                  className="border-b border-gray-800 hover:bg-gray-800"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                        <BookOpen className="text-primaryBlue" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold">{book.bookName}</p>
                        <p className="text-xs text-gray-400">{book.language}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      <span className="px-3 py-2 text-[11px] font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow whitespace-nowrap">
                        {book.category}
                      </span>

                      <span className="text-[10px] text-gray-400">
                        {book.language}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">{book.subject}</td>
                  <td className="px-6 py-2 whitespace-nowrap">{book.educationLevel}</td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {book.hasVideo && <Video size={14} />}
                      {book.hasNote && <FileText size={14} />}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3 text-gray-300">
                      <Eye
                        className="cursor-pointer hover:text-primaryBlue"
                        onClick={() => {
                          setViewData(book);

                          fetch(`${API_URL}/books/${book.id}/chapters/meta`, {
                            credentials: "include",
                          })
                            .then((res) => res.json())
                            .then((data) => {
                              if (Array.isArray(data) && data.length > 0) {
                                setSelectedChapter(data[0]); // first chapter open
                              } else {
                                setSelectedChapter(null);
                              }
                            })
                            .catch(() => {
                              toast.error("Failed to load book content");
                            });
                        }}
                      />

                      <Edit2
                        className="cursor-pointer hover:text-primaryOrange"
                        onClick={() => {
                          setEditBookData(book);
                          setIsEditOpen(true);
                        }}
                      />

                      <FaTrash
                        onClick={() => handleDelete(book.id)}
                        className="cursor-pointer hover:text-primaryRed"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-cardBg border-t border-gray-700">

              {/* FIRST + PREV */}
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  First
                </button>

                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Prev
                </button>
              </div>

              {/* PAGE NUMBERS */}
              <div className="flex gap-2">
                {getVisiblePages().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded border
            ${currentPage === page
                        ? "bg-primaryBlue text-white"
                        : "hover:bg-gray-700"
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* NEXT + LAST */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Next
                </button>

                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Last
                </button>
              </div>
            </div>
          )}

          {viewData && selectedChapter && (
            <div className="fixed inset-0 z-50 bg-primaryBlack bg-opacity-60 flex justify-center items-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <div
                  className={`relative bg-primaryWhite/10 backdrop-blur-md shadow-2xl border border-primaryWhite/20 overflow-hidden flex flex-col view-modal-container transition-all duration-300
    ${isFullscreen
                      ? "w-[95%] h-[90%] max-w-6xl max-h-[95%] rounded-xl"
                      : "w-screen h-screen max-w-none max-h-none rounded-none"
                    }
  `}
                >

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
        </div>
        <EditBookModal
          isOpen={isEditOpen}
          bookData={editBookData}
          setBookData={setEditBookData}
          onClose={() => setIsEditOpen(false)}
          onSave={handleUpdateBook}
        />
      </main>
    </div>

  );

}

