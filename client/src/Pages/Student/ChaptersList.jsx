// import { useState, useEffect, useRef } from "react";
// import { FiMenu, FiX } from "react-icons/fi";
// import { FaExpand, FaCompress, FaVideo } from "react-icons/fa";
// import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
// import { useNavigate, useParams } from "react-router-dom";
// const API_URL = import.meta.env.VITE_API_URL;

// export default function ChaptersList() {
//   const [filter, setFilter] = useState("PDF");
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [chapters, setChapters] = useState([]);
//   const [error, setError] = useState(null);
//   const { bookId } = useParams();
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [viewMode, setViewMode] = useState("flip");
//   const viewerRef = useRef(null);
//   const navigate = useNavigate();
//   const [partsMap, setPartsMap] = useState({});
//   const [selectedPart, setSelectedPart] = useState(null);
//   const [openLectureId, setOpenLectureId] = useState(null);
//   const [currentVideoUrl, setCurrentVideoUrl] = useState(null);

//   // Fetch chapters
//   useEffect(() => {
//     const fetchChapters = async () => {
//       try {
//         const res = await fetch(`${API_URL}/books/${bookId}/chapters/meta`, {
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error("Failed to fetch chapters");
//         const data = await res.json();

//         const formatted = data.map((item) => {
//           const type = (item.resourceType || "pdf").toLowerCase();
//           let title = `Chapter ${item.chapterNumber}`;
//           return {
//             id: item.id,
//             chapterNumber: item.chapterNumber,
//             fileUrl: item.fileUrl,
//             proxyUrl: item.proxyUrl,
//             thumbnail: item.thumbnail,
//             thumbnailProxyUrl: item.thumbnailProxyUrl,
//             resourceType: type,
//             title,
//             file: item.proxyUrl || item.fileUrl,
//             typeUpper: type.toUpperCase(),
//           };
//         });

//         setChapters(formatted);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     if (bookId) fetchChapters();
//   }, [bookId]);

//   const fetchParts = async (chapterId) => {
//     if (partsMap[chapterId] !== undefined) return;

//     try {
//       const res = await fetch(
//         `${API_URL}/books/${bookId}/chapters/${chapterId}/parts`,
//         { credentials: "include" }
//       );

//       if (!res.ok) throw new Error("Failed to fetch parts");

//       const data = await res.json();

//       const formattedParts = data.map((p, index) => ({
//         id: p.id,
//         title: `Part ${index + 1}`,
//         fileUrl: p.fileUrl,
//       }));

//       setPartsMap((prev) => ({
//         ...prev,
//         [chapterId]: formattedParts,
//       }));

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     chapters
//       .filter((ch) => ch.resourceType === "video")
//       .forEach((video) => {
//         fetchParts(video.id);
//       });
//   }, [chapters]);

//   useEffect(() => {
//     if (chapters.length > 0) {
//       const firstFiltered = chapters.find((ch) => {
//         if (ch.typeUpper === filter) return true;
//         return false;
//       });

//       if (firstFiltered) {
//         setSelectedChapter(firstFiltered);

//         // ✅ Agar VIDEO hai to by default video URL set karo
//         if (firstFiltered.resourceType === "video") {
//           setCurrentVideoUrl(firstFiltered.fileUrl);
//         }
//       }
//     }
//   }, [chapters, filter]);

//   // Filter chapters & parts
//   const filtered = chapters.filter((ch) => {
//     if (ch.typeUpper === filter) return true;
//     if (ch.parts?.some((p) => p.resourceType.toUpperCase() === filter))
//       return true;
//     return false;
//   });

//   const handleFullscreen = () => setIsFullscreen((prev) => !prev);

//   const getThumbSrc = (item) => {
//     if (item.thumbnailProxyUrl) return item.thumbnailProxyUrl;
//     if (item.thumbnail) {
//       return item.thumbnail.includes("/index.php/s/")
//         ? item.thumbnail + "/download"
//         : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//           item.thumbnail
//         )}`;
//     }
//     if (item.fileUrl) {
//       return `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//         item.fileUrl
//       )}`;
//     }
//     return `data:image/svg+xml;utf8,${encodeURIComponent(
//       `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='140'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='14'>No Image</text></svg>`
//     )}`;
//   };

//   const handleImgError = (e, item) => {
//     const el = e.target;
//     if (el.dataset.tried === "1") return;
//     el.dataset.tried = "1";
//     if (item.thumbnail) {
//       el.src = item.thumbnail.includes("/index.php/s/")
//         ? item.thumbnail + "/download"
//         : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//           item.thumbnail
//         )}`;
//     } else if (item.fileUrl) {
//       el.src = `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//         item.fileUrl
//       )}`;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#fdf6f2] dark:bg-gray-900 transition-colors duration-300">
//       {/* Main Viewer */}
//       <div className="flex-1 flex flex-col relative">
//         {!isFullscreen && (
//           <div className="absolute top-3 left-3 flex items-center gap-3 z-50">
//             <button
//               onClick={() => navigate(-1)}
//               className="px-3 py-1 rounded bg-gray200 dark:bg-gray700 dark:text-primaryWhite shadow hover:bg-gray300 dark:hover:bg-gray600 transition"
//             >
//               ⬅ Back
//             </button>
//           </div>
//         )}

//         {!isFullscreen && (
//           <div className="absolute top-3 right-3 flex items-center gap-2 z-40 lg:hidden">
//             <button
//               onClick={() => setIsSidebarOpen(true)}
//               className="p-2 rounded bg-gray200 dark:bg-gray700 dark:text-primaryWhite shadow hover:bg-gray300 dark:hover:bg-gray600"
//             >
//               <FiMenu size={20} />
//             </button>
//           </div>
//         )}

//         {/* Viewer */}
//         {selectedChapter ? (
//           <div
//             ref={viewerRef}
//             className={`flex-1 flex justify-center items-center w-full h-full p-4 relative transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-50 bg-primaryBlack p-2" : ""
//               }`}
//           >
//             {selectedChapter.resourceType === "pdf" && (
//               <>
//                 <div
//                   className={`flex-1 flex justify-center items-center w-full h-full bg-[#d2dcf3] dark:bg-gray700 rounded-lg shadow-md relative transition-all duration-300 ${isFullscreen ? "w-full h-full p-0 bg-primaryBlack" : "p-4"
//                     }`}
//                 >
//                   {/* Flipbook / Scrollable PDF */}
//                   <FlipbookPDFViewer
//                     chapter={selectedChapter}
//                     isFullscreen={isFullscreen}
//                     viewMode={viewMode}
//                     className="w-full h-full"
//                   />

//                   {/* Fullscreen Toggle */}
//                   <button
//                     onClick={handleFullscreen}
//                     className={`absolute bottom-3 right-3 p-2 ${isFullscreen
//                       ? "hidden"
//                       : "bg-primaryWhite dark:bg-gray800 dark:text-gray200 shadow rounded z-20"
//                       }`}
//                   >
//                     <FaExpand />
//                   </button>
//                 </div>

//                 {isFullscreen && (
//                   <button
//                     onClick={handleFullscreen}
//                     className="fixed bottom-4 right-4 p-3 rounded-full bg-gray700 text-primaryWhite hover:bg-gray600 z-50 shadow-lg"
//                   >
//                     <FaCompress size={15} />
//                   </button>
//                 )}
//               </>
//             )}

//             {selectedChapter?.resourceType === "video" && currentVideoUrl && (
//               <video
//                 key={currentVideoUrl}
//                 controls
//                 autoPlay
//                 className="w-full h-full object-contain"
//                 src={currentVideoUrl}
//               />
//             )}

//             {selectedChapter.resourceType === "audio" && (
//               <div className="flex flex-col items-center justify-center w-full h-full gap-4 text-primaryWhite">
//                 {/* <img
//                   src={
//                     selectedChapter.thumbnailProxyUrl ||
//                     selectedChapter.thumbnail
//                   }
//                   alt="Thumbnail"
//                   className="w-60 h-60 object-cover rounded-lg shadow-lg"
//                 /> */}
//                 <audio key={selectedChapter.id} controls className="w-2/3">
//                   <source src={selectedChapter.fileUrl} type="audio/mpeg" />
//                 </audio>
//               </div>
//             )}
//           </div>
//         ) : error ? (
//           <p className="text-primaryRed">{error}</p>
//         ) : (
//           <p className="text-gray700 dark:text-gray200"></p>
//         )}
//       </div>

//       {/* ✅ Single Responsive Sidebar */}
//       {!isFullscreen && (
//         <>
//           {/* Backdrop – only mobile */}
//           <div
//             onClick={() => setIsSidebarOpen(false)}
//             className={`fixed inset-0 bg-black/50 z-40 lg:hidden
//         ${isSidebarOpen ? "block" : "hidden"}`}
//           />

//           <aside
//             className={`
//         fixed lg:static top-0 right-0 z-50
//         h-full w-[280px] lg:w-[320px]
//         bg-primaryWhite dark:bg-gray800
//         p-4 shadow-lg overflow-y-auto
//         transition-transform duration-300
//         ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
//         lg:translate-x-0
//       `}
//           >
//             {/* Close button – mobile only */}
//             <div className="flex justify-end mb-4 lg:hidden">
//               <button
//                 onClick={() => setIsSidebarOpen(false)}
//                 className="p-2 rounded bg-gray200 dark:bg-gray700"
//               >
//                 <FiX size={20} />
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// import { useState, useEffect, useRef } from "react";
// import { FiMenu, FiX } from "react-icons/fi";
// import { FaExpand, FaCompress } from "react-icons/fa";
// import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
// import { useNavigate, useParams } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function ChaptersList() {
//   const [filter, setFilter] = useState("PDF");
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [chapters, setChapters] = useState([]);
//   const [error, setError] = useState(null);
//   const { bookId } = useParams();
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [viewMode, setViewMode] = useState("flip");
//   const viewerRef = useRef(null);
//   const navigate = useNavigate();
//   const [openPartsId, setOpenPartsId] = useState(null);

//   // Fetch chapters
//   useEffect(() => {
//     const fetchChapters = async () => {
//       try {
//         const res = await fetch(`${API_URL}/books/${bookId}/chapters/meta`, {
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error("Failed to fetch chapters");
//         const data = await res.json();

//         const formatted = data.map((item) => {
//           const type = (item.resourceType || "pdf").toLowerCase();
//           let title = "";
//           if (type === "pdf") title = `Chapter ${item.chapterNumber}`;
//           else if (type === "video") title = `Lecture ${item.chapterNumber}`;
//           else if (type === "audio") title = `Audio ${item.chapterNumber}`;
//           else title = `Content ${item.chapterNumber}`;

//           return {
//             id: item.id,
//             chapterNumber: item.chapterNumber,
//             fileUrl: item.fileUrl,
//             proxyUrl: item.proxyUrl,
//             thumbnail: item.thumbnail,
//             thumbnailProxyUrl: item.thumbnailProxyUrl,
//             resourceType: type,
//             title,
//             file: item.proxyUrl || item.fileUrl,
//             typeUpper: type.toUpperCase(),
//           };
//         });

//         setChapters(formatted);
//         // ❌ yaha pe selectedChapter set karne ki zarurat nahi
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     if (bookId) fetchChapters();
//   }, [bookId]);

//   // Filter ke hisaab se pehla chapter select karo
//   useEffect(() => {
//     if (chapters.length > 0) {
//       const firstFiltered = chapters.find((ch) => ch.typeUpper === filter);
//       setSelectedChapter(firstFiltered || null);
//     }
//   }, [chapters, filter]);

//   const filtered = chapters.filter((ch) => ch.typeUpper === filter);

//   const handleFullscreen = () => {
//     setIsFullscreen((prev) => !prev);
//   };

//   const getThumbSrc = (item) => {
//     if (item.thumbnailProxyUrl) return item.thumbnailProxyUrl;
//     if (item.thumbnail) {
//       return item.thumbnail.includes("/index.php/s/")
//         ? item.thumbnail + "/download"
//         : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//             item.thumbnail,
//           )}`;
//     }
//     if (item.fileUrl) {
//       return `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//         item.fileUrl,
//       )}`;
//     }
//     return `data:image/svg+xml;utf8,${encodeURIComponent(
//       `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='140'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='14'>No Image</text></svg>`,
//     )}`;
//   };

//   const handleImgError = (e, item) => {
//     const el = e.target;
//     if (el.dataset.tried === "1") return;
//     el.dataset.tried = "1";
//     if (item.thumbnail) {
//       el.src = item.thumbnail.includes("/index.php/s/")
//         ? item.thumbnail + "/download"
//         : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//             item.thumbnail,
//           )}`;
//     } else if (item.fileUrl) {
//       el.src = `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//         item.fileUrl,
//       )}`;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#fdf6f2] dark:bg-gray-900 transition-colors duration-300">
//       {/* Main Viewer */}
//       <div className="flex-1 flex flex-col relative">
//         {/* Back button */}
//         {!isFullscreen && (
//           <div className="absolute top-3 left-3 flex items-center gap-3 z-50">
//             <button
//               onClick={() => navigate(-1)}
//               className="px-3 py-1 rounded bg-gray200 dark:bg-gray700 dark:text-primaryWhite shadow hover:bg-gray300 dark:hover:bg-gray600 transition"
//             >
//               ⬅ Back
//             </button>
//           </div>
//         )}

//         {/* Mobile menu */}
//         {!isFullscreen && (
//           <div className="absolute top-3 right-3 flex items-center gap-2 z-40 lg:hidden">
//             <button
//               onClick={() => setIsSidebarOpen(true)}
//               className="p-2 rounded bg-gray200 dark:bg-gray700 dark:text-primaryWhite shadow hover:bg-gray300 dark:hover:bg-gray600"
//             >
//               <FiMenu size={20} />
//             </button>
//           </div>
//         )}

//         {/* Viewer */}
//         {selectedChapter ? (
//           <div
//             ref={viewerRef}
//             className={`flex-1 flex justify-center items-center w-full h-full p-4 relative transition-all duration-300 ${
//               isFullscreen ? "fixed inset-0 z-50 bg-primaryBlack p-2" : ""
//             }`}
//           >
//             {selectedChapter.resourceType === "pdf" && (
//               <>
//                 <div
//                   className={`flex-1 flex justify-center items-center w-full h-full bg-[#d2dcf3] dark:bg-gray700 rounded-lg shadow-md relative transition-all duration-300 ${
//                     isFullscreen ? "w-full h-full p-0 bg-primaryBlack" : "p-4"
//                   }`}
//                 >
//                   {/* Flipbook / Scrollable PDF */}
//                   <FlipbookPDFViewer
//                     chapter={selectedChapter}
//                     isFullscreen={isFullscreen}
//                     viewMode={viewMode}
//                     className="w-full h-full"
//                   />

//                   {/* Fullscreen Toggle */}
//                   <button
//                     onClick={handleFullscreen}
//                     className={`absolute bottom-3 right-3 p-2 ${
//                       isFullscreen
//                         ? "hidden"
//                         : "bg-primaryWhite dark:bg-gray800 dark:text-gray200 shadow rounded z-20"
//                     }`}
//                   >
//                     <FaExpand />
//                   </button>
//                 </div>

//                 {isFullscreen && (
//                   <button
//                     onClick={handleFullscreen}
//                     className="fixed bottom-4 right-4 p-3 rounded-full bg-gray700 text-primaryWhite hover:bg-gray600 z-50 shadow-lg"
//                   >
//                     <FaCompress size={15} />
//                   </button>
//                 )}
//               </>
//             )}

//             {selectedChapter.resourceType === "video" && (
//               <video
//                 key={selectedChapter.id}
//                 controls
//                 className="w-full h-full object-contain"
//                 src={selectedChapter.fileUrl}
//               />
//             )}

//             {selectedChapter.resourceType === "audio" && (
//               <div className="flex flex-col items-center justify-center w-full h-full gap-4 text-primaryWhite">
//                 <img
//                   src={
//                     selectedChapter.thumbnailProxyUrl ||
//                     selectedChapter.thumbnail
//                   }
//                   alt="Thumbnail"
//                   className="w-60 h-60 object-cover rounded-lg shadow-lg"
//                 />
//                 <audio key={selectedChapter.id} controls className="w-2/3">
//                   <source src={selectedChapter.fileUrl} type="audio/mpeg" />
//                 </audio>
//               </div>
//             )}
//           </div>
//         ) : error ? (
//           <p className="text-primaryRed">{error}</p>
//         ) : (
//           <p className="text-gray700 dark:text-gray200"></p>
//         )}
//       </div>

//       {/* Sidebar (Desktop & Mobile) */}
//       {!isFullscreen && (
//         <>
//           {/* Desktop Sidebar */}
//           <div className="hidden lg:flex w-[320px] bg-primaryWhite dark:bg-gray800 p-4 flex-col shadow-lg overflow-y-auto">
//             {/* Filter Tabs */}
//             <div className="flex justify-between mb-4 text-primaryWhite">
//               {["PDF", "VIDEO", "AUDIO"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setFilter(tab)}
//                   className={`px-4 py-1 rounded-lg text-sm font-medium
//               ${filter === tab
//                       ? "bg-primaryBlue text-primaryWhite"
//                       : "bg-gray-100 dark:bg-gray700"}`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             {/* Chapters */}
//             <div className="flex flex-col gap-3">
//               {filtered.map((item) => (
//                 <div key={item.id} className="bg-gray-100 dark:bg-gray700 rounded-lg">

//                   <div
//                     className={`flex items-center justify-between h-[60px] rounded-lg cursor-pointer
//     ${selectedChapter?.id === item.id
//                         ? "bg-blue-200 dark:bg-blue-600"
//                         : ""}`}

//                     onClick={() => {
//                       setSelectedChapter(item);
//                       setSelectedPart(null);
//                       setOpenLectureId(null);

//                       if (item.resourceType === "video") {
//                         setCurrentVideoUrl(item.fileUrl);
//                       }

//                       setIsSidebarOpen(false);
//                     }}

//                   >
//                     {/* Left */}
//                     <div className="flex items-center gap-3">
//                       {item.resourceType === "pdf" ? (
//                         <img
//                           src={getThumbSrc(item)}
//                           onError={(e) => handleImgError(e, item)}
//                           className="w-16 h-[60px] object-cover rounded"
//                         />
//                       ) : (
//                         <div className="w-10 h-8 m-1 flex items-center justify-center bg-gray300 rounded">
//                           <FaVideo className="text-primaryBlue" />
//                         </div>
//                       )}

//                       <p className="text-sm font-medium text-primaryWhite">
//                         {item.resourceType === "video"
//                           ? `Lecture ${item.chapterNumber}`
//                           : `Chapter ${item.chapterNumber}`}
//                       </p>

//                     </div>
//                     {item.resourceType === "video" &&
//                       partsMap[item.id]?.length > 0 && (
//                         <span
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setOpenLectureId(
//                               openLectureId === item.id ? null : item.id
//                             );
//                           }}
//                           className="mr-3 px-2 py-1 text-xs text-primaryWhite font-semibold
//                  border border-primaryWhite rounded-md
//                  cursor-pointer select-none inline-flex items-center"
//                         >
//                           Select Parts
//                         </span>
//                       )}

//                   </div>

//                   {openLectureId === item.id &&
//                     partsMap[item.id]?.length > 0 && (
//                       <div className="pl-14 pr-3 pb-2">
//                         {partsMap[item.id].map((part) => (
//                           <div
//                             key={part.id}
//                             onClick={() => {
//                               setSelectedPart(part);
//                               setCurrentVideoUrl(part.fileUrl);
//                               setIsSidebarOpen(false);
//                             }}
//                             className={`text-sm px-3 py-2 rounded cursor-pointer
//             ${selectedPart?.id === part.id
//                                 ? "bg-blue-500 text-white"
//                                 : "hover:bg-gray-200 dark:hover:bg-gray600"}`}
//                           >
//                             ▶ {part.title}
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                 </div>
//               ))}
//             </div>

//           </aside>
//         </>
//       )}

//     </div>
//   );
// }

// import { useState, useEffect, useRef } from "react";
// import { FiMenu, FiX } from "react-icons/fi";
// import { FaExpand, FaCompress } from "react-icons/fa";
// import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
// import { useNavigate, useParams } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL;

// export default function ChaptersList() {
//   const [filter, setFilter] = useState("PDF");
//   const [selectedChapter, setSelectedChapter] = useState(null);
//   const [chapters, setChapters] = useState([]);
//   const [error, setError] = useState(null);
//   const { bookId } = useParams();
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [viewMode, setViewMode] = useState("flip");
//   const viewerRef = useRef(null);
//   const navigate = useNavigate();
//   const [openPartsId, setOpenPartsId] = useState(null);

//   // Fetch chapters
//   useEffect(() => {
//     const fetchChapters = async () => {
//       try {
//         const res = await fetch(`${API_URL}/books/${bookId}/chapters/meta`, {
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error("Failed to fetch chapters");
//         const data = await res.json();

//         const formatted = data.map((item) => {
//           const type = (item.resourceType || "pdf").toLowerCase();
//           let title = `Chapter ${item.chapterNumber}`;
//           return {
//             id: item.id,
//             chapterNumber: item.chapterNumber,
//             fileUrl: item.fileUrl,
//             proxyUrl: item.proxyUrl,
//             thumbnail: item.thumbnail,
//             thumbnailProxyUrl: item.thumbnailProxyUrl,
//             resourceType: type,
//             title,
//             file: item.proxyUrl || item.fileUrl,
//             typeUpper: type.toUpperCase(),
//             parts:
//               item.parts?.map((p) => ({
//                 id: p.id,
//                 chapterNumber: p.chapterNumber,
//                 fileUrl: p.fileUrl,
//                 resourceType: (p.resourceType || "pdf").toLowerCase(),
//                 thumbnail: p.thumbnail,
//                 thumbnailProxyUrl: p.thumbnailProxyUrl,
//                 title: p.displayName || `Part ${p.chapterNumber}`,
//               })) || [],
//           };
//         });

//         setChapters(formatted);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     if (bookId) fetchChapters();
//   }, [bookId]);

//   const fetchParts = async (chapterId) => {
//     if (partsMap[chapterId]) return; // already fetched

//     try {
//       const res = await fetch(
//         `${API_URL}/chapters/${chapterId}/parts`,
//         { credentials: "include" }
//       );
//       if (!res.ok) throw new Error("Failed to fetch parts");

//       const data = await res.json();

//       setPartsMap((prev) => ({
//         ...prev,
//         [chapterId]: data,
//       }));

//       // ✅ by default Part-1 auto play
//       if (data.length > 0) {
//         setSelectedPart(data[0]);
//         setSelectedChapter((prev) => ({
//           ...prev,
//           fileUrl: data[0].fileUrl,
//         }));
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Filter ke hisaab se pehla chapter select karo
//   useEffect(() => {
//     if (chapters.length > 0) {
//       const firstFiltered = chapters.find((ch) => {
//         if (ch.typeUpper === filter) return true;
//         if (ch.parts?.some((p) => p.resourceType.toUpperCase() === filter))
//           return true;
//         return false;
//       });
//       setSelectedChapter(firstFiltered || null);
//     }
//   }, [chapters, filter]);

//   // Filter chapters & parts
//   const filtered = chapters.filter((ch) => {
//     if (ch.typeUpper === filter) return true;
//     if (ch.parts?.some((p) => p.resourceType.toUpperCase() === filter))
//       return true;
//     return false;
//   });

//   const handleFullscreen = () => setIsFullscreen((prev) => !prev);

//   const getThumbSrc = (item) => {
//     if (item.thumbnailProxyUrl) return item.thumbnailProxyUrl;
//     if (item.thumbnail) {
//       return item.thumbnail.includes("/index.php/s/")
//         ? item.thumbnail + "/download"
//         : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//             item.thumbnail
//           )}`;
//     }
//     if (item.fileUrl) {
//       return `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//         item.fileUrl
//       )}`;
//     }
//     return `data:image/svg+xml;utf8,${encodeURIComponent(
//       `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='140'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='14'>No Image</text></svg>`
//     )}`;
//   };

//   const handleImgError = (e, item) => {
//     const el = e.target;
//     if (el.dataset.tried === "1") return;
//     el.dataset.tried = "1";
//     if (item.thumbnail) {
//       el.src = item.thumbnail.includes("/index.php/s/")
//         ? item.thumbnail + "/download"
//         : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//             item.thumbnail
//           )}`;
//     } else if (item.fileUrl) {
//       el.src = `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//         item.fileUrl
//       )}`;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#fdf6f2] dark:bg-gray-900 transition-colors duration-300">
//       {/* Main Viewer */}
//       <div className="flex-1 flex flex-col relative">
//         {!isFullscreen && (
//           <div className="absolute top-3 left-3 flex items-center gap-3 z-50">
//             <button
//               onClick={() => navigate(-1)}
//               className="px-3 py-1 rounded bg-gray200 dark:bg-gray700 dark:text-primaryWhite shadow hover:bg-gray300 dark:hover:bg-gray600 transition"
//             >
//               ⬅ Back
//             </button>
//           </div>
//         )}

//         {!isFullscreen && (
//           <div className="absolute top-3 right-3 flex items-center gap-2 z-40 lg:hidden">
//             <button
//               onClick={() => setIsSidebarOpen(true)}
//               className="p-2 rounded bg-gray200 dark:bg-gray700 dark:text-primaryWhite shadow hover:bg-gray300 dark:hover:bg-gray600"
//             >
//               <FiMenu size={20} />
//             </button>
//           </div>
//         )}

//         {/* Viewer */}
//         {selectedChapter ? (
//           <div
//             ref={viewerRef}
//             className={`flex-1 flex justify-center items-center w-full h-full p-4 relative transition-all duration-300 ${
//               isFullscreen ? "fixed inset-0 z-50 bg-primaryBlack p-2" : ""
//             }`}
//           >
//             {selectedChapter.resourceType === "pdf" && (
//               <>
//                 <div
//                   className={`flex-1 flex justify-center items-center w-full h-full bg-[#d2dcf3] dark:bg-gray700 rounded-lg shadow-md relative transition-all duration-300 ${
//                     isFullscreen ? "w-full h-full p-0 bg-primaryBlack" : "p-4"
//                   }`}
//                 >
//                   {/* Flipbook / Scrollable PDF */}
//                   <FlipbookPDFViewer
//                     chapter={selectedChapter}
//                     isFullscreen={isFullscreen}
//                     viewMode={viewMode}
//                     className="w-full h-full"
//                   />

//                   {/* Fullscreen Toggle */}
//                   <button
//                     onClick={handleFullscreen}
//                     className={`absolute bottom-3 right-3 p-2 ${
//                       isFullscreen
//                         ? "hidden"
//                         : "bg-primaryWhite dark:bg-gray800 dark:text-gray200 shadow rounded z-20"
//                     }`}
//                   >
//                     <FaExpand />
//                   </button>
//                 </div>

//                 {isFullscreen && (
//                   <button
//                     onClick={handleFullscreen}
//                     className="fixed bottom-4 right-4 p-3 rounded-full bg-gray700 text-primaryWhite hover:bg-gray600 z-50 shadow-lg"
//                   >
//                     <FaCompress size={15} />
//                   </button>
//                 )}
//               </>
//             )}

//             {selectedChapter.resourceType === "video" && (
//               <video
//                 key={selectedChapter.id}
//                 controls
//                 className="w-full h-full object-contain"
//                 src={selectedChapter.fileUrl}
//               />
//             )}

//             {selectedChapter.resourceType === "audio" && (
//               <div className="flex flex-col items-center justify-center w-full h-full gap-4 text-primaryWhite">
//                 <img
//                   src={
//                     selectedChapter.thumbnailProxyUrl ||
//                     selectedChapter.thumbnail
//                   }
//                   alt="Thumbnail"
//                   className="w-60 h-60 object-cover rounded-lg shadow-lg"
//                 />
//                 <audio key={selectedChapter.id} controls className="w-2/3">
//                   <source src={selectedChapter.fileUrl} type="audio/mpeg" />
//                 </audio>
//               </div>
//             )}
//           </div>
//         ) : error ? (
//           <p className="text-primaryRed">{error}</p>
//         ) : (
//           <p className="text-gray700 dark:text-gray200"></p>
//         )}
//       </div>

//       {/* Sidebar */}
//       {!isFullscreen && (
//         <>
//           {/* Desktop Sidebar */}
//           <div className="hidden lg:flex w-[320px] bg-primaryWhite dark:bg-gray800 p-4 flex-col shadow-lg overflow-y-auto">
//             {/* Filter Tabs */}
//             <div className="flex justify-between mb-4">
//               {["PDF", "VIDEO", "AUDIO"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setFilter(tab)}
//                   className={`px-5 py-1 rounded-lg text-sm font-medium ${
//                     filter === tab
//                       ? "bg-primaryBlue text-primaryWhite"
//                       : "bg-gray-100 text-gray700 dark:bg-gray700 dark:text-gray200"
//                   }`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </div>

//             <div className="flex flex-col gap-3">
//               {filtered.length === 0 ? (
//                 <p className="text-gray400 text-sm dark:text-gray300">
//                   No {filter} content found
//                 </p>
//               ) : (
//                 filtered.map((item) => {
//                   const thumbSrc = getThumbSrc(item);
//                   return (
//                     <div
//                       key={item.id}
//                       onClick={() => setSelectedChapter(item)}
//                       className={`flex flex-col w-[320px] rounded-lg shadow-sm cursor-pointer
//     ${selectedChapter?.id === item.id
//                           ? "bg-blue-200 dark:bg-blue-600"
//                           : "bg-gray-100 dark:bg-gray700 hover:bg-gray200 dark:hover:bg-gray600"
//                       }`}
//                     >
//                       {/* Row: Image + Title + Parts button */}
//                       <div className="flex items-center h-[60px]">
//                         <div className="w-20 h-14 flex items-center justify-center bg-gray300 dark:bg-gray600 rounded-l-lg overflow-hidden">
//                           <img
//                             src={thumbSrc}
//                             alt={`thumb-${item.id}`}
//                             loading="lazy"
//                             data-tried="0"
//                             onError={(e) => handleImgError(e, item)}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>

//                         <div className="ml-3 flex flex-col w-full">
//                           <div className="flex justify-between items-center">
//                             <p className="text-sm font-medium text-gray800 dark:text-gray200">
//                               {item.title}
//                             </p>

//                             {item.parts && item.parts.length > 0 && (
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setOpenPartsId(
//                                     openPartsId === item.id ? null : item.id
//                                   );
//                                 }}
//                                 className="text-xs text-primaryWhite font-semibold rounded-lg px-2 py-1 bg-gray300 dark:bg-gray600 mr-2"
//                               >
//                                 Parts ▼
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       {/* ---- DROPDOWN OUTSIDE THE ROW ---- */}
//                       {openPartsId === item.id && item.resourceType === "video" && (
//                         <div className="mt-2 ml-3 mb-3 flex flex-col gap-1 text-xs bg-gray200 dark:bg-gray700 p-2 rounded">
//                           {["Part 1", "Part 2", "Part 3"].map((p, idx) => (
//                             <button
//                               key={idx}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setSelectedChapter(item);
//                               }}
//                               className="text-left px-2 py-1 text-primaryWhite  bg-gray300 dark:bg-gray600 border-light rounded hover:bg-gray400 dark:hover:bg-gray-500"
//                             >
//                               {p}
//                             </button>
//                           ))}
//                         </div>
//                       )}

//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>

//           {/* Mobile Sidebar */}
//           {isSidebarOpen && (
//             <div className="fixed inset-0 z-50 flex">
//               <div
//                 className="flex-1 bg-primaryBlack/50"
//                 onClick={() => setIsSidebarOpen(false)}
//               ></div>
//               <div className="w-[280px] bg-primaryWhite dark:bg-gray800 p-4 flex flex-col shadow-lg overflow-y-auto">
//                 <div className="flex justify-end mb-4">
//                   <button
//                     onClick={() => setIsSidebarOpen(false)}
//                     className="p-2 rounded bg-gray200 dark:bg-gray700 dark:text-primaryWhite shadow hover:bg-gray300 dark:hover:bg-gray600"
//                   >
//                     <FiX size={20} />
//                   </button>
//                 </div>

//                 <div className="flex justify-between mb-4">
//                   {["PDF", "VIDEO", "AUDIO"].map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setFilter(tab)}
//                       className={`px-3 py-1 rounded-lg text-sm font-medium ${
//                         filter === tab
//                           ? "bg-primaryBlue text-primaryWhite"
//                           : "bg-gray-100 text-gray700 dark:bg-gray700 dark:text-gray200"
//                       }`}
//                     >
//                       {tab}
//                     </button>
//                   ))}
//                 </div>

//                 <div className="flex flex-col gap-3">
//                   {filtered.length === 0 ? (
//                     <p className="text-gray400 text-sm dark:text-gray300">
//                       No {filter} content found
//                     </p>
//                   ) : (
//                     filtered.map((item) => {
//                       const thumbSrc = getThumbSrc(item);
//                       return (
//                         <div
//                           key={item.id}
//                           onClick={() => {
//                             setSelectedChapter(item);
//                             setIsSidebarOpen(false);
//                           }}
//                           className={`flex items-center w-full h-[60px] rounded-lg shadow-sm cursor-pointer ${
//                             selectedChapter?.id === item.id
//                               ? "bg-blue-200 dark:bg-blue-600"
//                               : "bg-gray-100 dark:bg-gray700 hover:bg-gray200 dark:hover:bg-gray600"
//                           }`}
//                         >
//                           <div className="w-14 h-14 flex items-center justify-center bg-gray300 dark:bg-gray600 rounded-l-lg overflow-hidden">
//                             <img
//                               src={thumbSrc}
//                               alt={`thumb-${item.id}`}
//                               loading="lazy"
//                               data-tried="0"
//                               onError={(e) => handleImgError(e, item)}
//                               className="w-full h-full object-cover"
//                             />
//                           </div>
//                           <p className="ml-3 text-sm font-medium text-gray800 dark:text-gray200">
//                             {item.title}
//                           </p>
//                         </div>
//                       );
//                     })
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// chapterList

import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaExpand, FaCompress, FaVideo, FaMusic } from "react-icons/fa";
import FlipbookPDFViewer from "../../Components/FlipbookPDFViewer";
import { useNavigate, useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function ChaptersList() {
  const [filter, setFilter] = useState("PDF");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState(null);
  const { bookId } = useParams();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("flip");
  const viewerRef = useRef(null);
  const navigate = useNavigate();
  const [partsMap, setPartsMap] = useState({});
  const [selectedPart, setSelectedPart] = useState(null);
  const [openLectureId, setOpenLectureId] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);

  // Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch(`${API_URL}/books/${bookId}/chapters/meta`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch chapters");
        const data = await res.json();

        const formatted = data.map((item) => {
          const type = (item.resourceType || "pdf").toLowerCase();
          let title = `Chapter ${item.chapterNumber}`;
          return {
            id: item.id,
            chapterNumber: item.chapterNumber,
            fileUrl: item.fileUrl,
            proxyUrl: item.proxyUrl,
            thumbnail: item.thumbnail,
            thumbnailProxyUrl: item.thumbnailProxyUrl,
            resourceType: type,
            title,
            file: item.proxyUrl || item.fileUrl,
            typeUpper: type.toUpperCase(),
          };
        });

        setChapters(formatted);
      } catch (err) {
        setError(err.message);
      }
    };

    if (bookId) fetchChapters();
  }, [bookId]);

  const fetchParts = async (chapterId) => {
    if (partsMap[chapterId] !== undefined) return;

    try {
      const res = await fetch(
        `${API_URL}/books/${bookId}/chapters/${chapterId}/parts`,
        { credentials: "include" },
      );

      if (!res.ok) throw new Error("Failed to fetch parts");

      const data = await res.json();

      const formattedParts = data.map((p, index) => ({
        id: p.id,
        title: `Part ${index + 1}`,
        fileUrl: p.fileUrl,
      }));

      setPartsMap((prev) => ({
        ...prev,
        [chapterId]: formattedParts,
      }));

      // ✅ default Part 1 play
      if (formattedParts.length > 0) {
        setSelectedPart(formattedParts[0]);
        setSelectedChapter((prev) => ({
          ...prev,
          fileUrl: formattedParts[0].fileUrl,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter ke hisaab se pehla chapter select karo
  useEffect(() => {
    if (chapters.length > 0) {
      const firstFiltered = chapters.find((ch) => {
        if (ch.typeUpper === filter) return true;
        return false;
      });

      if (firstFiltered) {
        setSelectedChapter(firstFiltered);

        // ✅ Agar VIDEO hai to by default video URL set karo
        if (firstFiltered.resourceType === "video") {
          setCurrentVideoUrl(firstFiltered.fileUrl);
        }
      }
    }
  }, [chapters, filter]);

  // Filter chapters & parts
  const filtered = chapters.filter((ch) => {
    if (ch.typeUpper === filter) return true;
    if (ch.parts?.some((p) => p.resourceType.toUpperCase() === filter))
      return true;
    return false;
  });

  const handleFullscreen = () => setIsFullscreen((prev) => !prev);

  const getThumbSrc = (item) => {
    if (item.thumbnailProxyUrl) return item.thumbnailProxyUrl;
    if (item.thumbnail) {
      return item.thumbnail.includes("/index.php/s/")
        ? item.thumbnail + "/download"
        : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
            item.thumbnail,
          )}`;
    }
    if (item.fileUrl) {
      return `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
        item.fileUrl,
      )}`;
    }
    return `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='140'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='14'>No Image</text></svg>`,
    )}`;
  };

  const handleImgError = (e, item) => {
    const el = e.target;
    if (el.dataset.tried === "1") return;
    el.dataset.tried = "1";
    if (item.thumbnail) {
      el.src = item.thumbnail.includes("/index.php/s/")
        ? item.thumbnail + "/download"
        : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
            item.thumbnail,
          )}`;
    } else if (item.fileUrl) {
      el.src = `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
        item.fileUrl,
      )}`;
    }
  };

  return (
    <div className="flex h-screen bg-[#fdf6f2] dark:bg-gray-900 transition-colors duration-300">
      {/* Main Viewer */}
      <div className="flex-1 flex flex-col relative">
        {!isFullscreen && (
          <div className="absolute top-3 left-3 flex items-center gap-3 z-50">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1 rounded bg-gray200 dark:bg-gray700 dark:text-primaryWhite shadow hover:bg-gray300 dark:hover:bg-gray600 transition"
            >
              ⬅ Back
            </button>
          </div>
        )}

        {!isFullscreen && (
          <div className="absolute top-3 right-3 flex items-center gap-2 z-40 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded bg-gray200 dark:bg-gray700 dark:text-primaryWhite shadow hover:bg-gray300 dark:hover:bg-gray600"
            >
              <FiMenu size={20} />
            </button>
          </div>
        )}

        {/* Viewer */}
        {selectedChapter ? (
          <div
            ref={viewerRef}
            className={`flex-1 flex justify-center items-center w-full h-full p-4 relative transition-all duration-300 ${
              isFullscreen ? "fixed inset-0 z-50 bg-primaryBlack p-2" : ""
            }`}
          >
            {selectedChapter.resourceType === "pdf" && (
              <>
                <div
                  className={`flex-1 flex justify-center items-center w-full h-full bg-[#d2dcf3] dark:bg-gray700 rounded-lg shadow-md relative transition-all duration-300 ${
                    isFullscreen ? "w-full h-full p-0 bg-primaryBlack" : "p-4"
                  }`}
                >
                  {/* Flipbook / Scrollable PDF */}
                  <FlipbookPDFViewer
                    chapter={selectedChapter}
                    isFullscreen={isFullscreen}
                    viewMode={viewMode}
                    className="w-full h-full"
                  />

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={handleFullscreen}
                    className={`absolute bottom-3 right-3 p-2 ${
                      isFullscreen
                        ? "hidden"
                        : "bg-primaryWhite dark:bg-gray800 dark:text-gray200 shadow rounded z-20"
                    }`}
                  >
                    <FaExpand />
                  </button>
                </div>

                {isFullscreen && (
                  <button
                    onClick={handleFullscreen}
                    className="fixed bottom-4 right-4 p-3 rounded-full bg-gray700 text-primaryWhite hover:bg-gray600 z-50 shadow-lg"
                  >
                    <FaCompress size={15} />
                  </button>
                )}
              </>
            )}

            {selectedChapter?.resourceType === "video" && currentVideoUrl && (
              <video
                key={currentVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
                src={currentVideoUrl}
              />
            )}

            {selectedChapter.resourceType === "audio" && (
              <div className="flex items-center justify-center w-full h-full p-4 bg-[#f4f6fb] dark:bg-gray-900">
                <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 sm:p-6">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    {/* Icon */}
                    <div className="w-32 h-20 mt-4 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                      <img
                        src="/audiobook (2).png"
                        className="text-blue-600 rounded-lg dark:text-blue-300"
                        size={20}
                      />
                    </div>

                    {/* Title */}
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                        Chapter {selectedChapter.chapterNumber}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Audio Lecture
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 dark:border-gray-700 mb-4" />

                  {/* Description (optional future use) */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Listen to this lecture to understand the concepts in detail.
                  </p>

                  {/* Audio Player */}
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <audio key={selectedChapter.id} controls className="w-full">
                      <source src={selectedChapter.fileUrl} type="audio/mpeg" />
                    </audio>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : error ? (
          <p className="text-primaryRed">{error}</p>
        ) : (
          <p className="text-gray700 dark:text-gray200"></p>
        )}
      </div>

      {/* ✅ Single Responsive Sidebar */}
      {!isFullscreen && (
        <>
          {/* Backdrop – only mobile */}
          <div
            onClick={() => setIsSidebarOpen(false)}
            className={`fixed inset-0 bg-black/50 z-40 lg:hidden
        ${isSidebarOpen ? "block" : "hidden"}`}
          />

          <aside
            className={`
        fixed lg:static top-0 right-0 z-50
        h-full w-[280px] lg:w-[320px]
        bg-primaryWhite dark:bg-gray800
        p-4 shadow-lg overflow-y-auto
        transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
        lg:translate-x-0
      `}
          >
            {/* Close button – mobile only */}
            <div className="flex justify-end mb-4 lg:hidden">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded bg-gray200 dark:bg-gray700"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-between mb-4 text-primaryWhite">
              {["PDF", "VIDEO", "AUDIO"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-1 rounded-lg text-sm font-medium 
              ${
                filter === tab
                  ? "bg-primaryBlue text-primaryWhite"
                  : "bg-gray-100 dark:bg-gray700"
              }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Chapters */}
            <div className="flex flex-col gap-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-100 dark:bg-gray700 rounded-lg"
                >
                  <div
                    className={`flex items-center justify-between h-[60px] rounded-lg cursor-pointer
    ${selectedChapter?.id === item.id ? "bg-blue-200 dark:bg-blue-600" : ""}`}
                    onClick={() => {
                      setSelectedChapter(item);
                      setSelectedPart(null);
                      setOpenLectureId(null);

                      if (item.resourceType === "video") {
                        setCurrentVideoUrl(item.fileUrl);
                      }

                      setIsSidebarOpen(false);
                    }}
                  >
                    {/* Left */}
                    <div className="flex items-center gap-3">
                      {item.resourceType === "pdf" ? (
                        <img
                          src={getThumbSrc(item)}
                          onError={(e) => handleImgError(e, item)}
                          className="w-16 h-[60px] object-cover rounded"
                        />
                      ) : item.resourceType === "video" ? (
                        <div className="w-10 h-8 m-1 flex items-center justify-center bg-gray300 rounded">
                          <FaVideo className="text-primaryBlue" />
                        </div>
                      ) : (
                        <div className="w-10 h-8 m-1 flex items-center justify-center bg-gray300 rounded">
                          <FaMusic className="text-green-500" />
                        </div>
                      )}

                      <p className="text-sm font-medium text-primaryWhite">
                        {item.resourceType === "video"
                          ? `Lecture ${item.chapterNumber}`
                          : `Chapter ${item.chapterNumber}`}
                      </p>
                    </div>
                    {item.resourceType === "video" && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchParts(item.id);
                          setOpenLectureId(
                            openLectureId === item.id ? null : item.id,
                          );
                        }}
                        className="
    mr-3 px-2 py-1 text-xs text-primaryWhite font-semibold
    border border-primaryWhite rounded-md
    cursor-pointer select-none
    inline-flex items-center
  "
                      >
                        Select Parts
                      </span>
                    )}
                  </div>

                  {openLectureId === item.id &&
                    partsMap[item.id]?.length > 0 && (
                      <div className="pl-14 pr-3 pb-2">
                        {partsMap[item.id].map((part) => (
                          <div
                            key={part.id}
                            onClick={() => {
                              setSelectedPart(part);
                              setCurrentVideoUrl(part.fileUrl);
                              setIsSidebarOpen(false);
                            }}
                            className={`text-sm px-3 py-2 rounded cursor-pointer
            ${
              selectedPart?.id === part.id
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray600"
            }`}
                          >
                            ▶ {part.title}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
