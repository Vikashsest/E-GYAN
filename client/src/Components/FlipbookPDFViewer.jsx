
// import { useEffect, useState, useRef, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import HTMLFlipBook from "react-pageflip";
// import * as pdfjsLib from "pdfjs-dist";
// import {
//   FiChevronLeft,
//   FiChevronRight,
//   FiZoomIn,
//   FiZoomOut,
// } from "react-icons/fi";
// import { FaBookOpen, FaFilePdf } from "react-icons/fa";

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

// export default function FlipbookPDFViewer({
//   bookId: propBookId,
//   chapter,
//   page,
//   setPage,
//   setTotalPages,
//   isFullscreen,
// }) {
//   const { bookId: paramBookId } = useParams();
//   const bookId = propBookId || paramBookId;

//   const [bookUrl, setBookUrl] = useState(null);
//   const [fileType, setFileType] = useState(null);
//   const [pages, setPages] = useState({}); // {1: base64, 2: base64 ...}
//   const [loading, setLoading] = useState(true);
//   const [pageSize, setPageSize] = useState({ width: 800, height: 1000 });

//   const [isPortrait, setIsPortrait] = useState(true);
//   const [viewMode, setViewMode] = useState("flipbook");

//   const [pdfZoom, setPdfZoom] = useState(1.0);
//   const [flipbookZoom, setFlipbookZoom] = useState(1.8);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [total, setTotal] = useState(0);

//   const flipBookRef = useRef();
//   const scrollContainerRef = useRef();
//   const startTimeRef = useRef(Date.now());
//   const pdfRef = useRef(null); // store pdf instance

//   // ✅ Orientation
//   useEffect(() => {
//     const checkOrientation = () => {
//       setIsPortrait(window.innerHeight >= window.innerWidth);
//     };
//     checkOrientation();
//     window.addEventListener("resize", checkOrientation);
//     return () => window.removeEventListener("resize", checkOrientation);
//   }, []);

//   // ✅ Chapter URL resolver
//   const chapterUrl = useMemo(() => {
//     if (!chapter) return null;
//     const raw = chapter.proxyUrl || chapter.fileUrl || chapter.file || "";
//     if (!raw) return null;
//     if (raw.includes("/books/proxy/")) return raw;
//     try {
//       const u = new URL(raw);
//       const isNextcloudShare =
//         u.hostname.includes("cloud.ptgn.in") &&
//         u.pathname.includes("/index.php/s/");
//       if (isNextcloudShare && !u.pathname.endsWith("/download")) {
//         u.pathname = u.pathname.replace(/\/+$/, "") + "/download";
//         return u.toString();
//       }
//       return raw;
//     } catch {
//       return raw;
//     }
//   }, [chapter]);

//   const logActivity = (currentPage) => {
//     const role = localStorage.getItem("role");
//     if (role !== "student") return;

//     const payload = {
//       bookId: parseInt(bookId),
//       chapterId: chapter?.id,
//       timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
//       resourceType: fileType?.toUpperCase(),
//       pageNumber: currentPage,
//       isCompleted: currentPage === total,
//     };

//     fetch(`${import.meta.env.VITE_API_URL}/students/activity`, {
//       method: "POST",
//       credentials: "include",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     })
//       .then((res) => res.json())
//       .then((data) => console.log("✅ Activity logged:", data))
//       .catch((err) => console.error("❌ Failed to log activity:", err));
//   };

//   // ✅ Detect file type
//   useEffect(() => {
//     if (!chapterUrl) return;
//     setBookUrl(chapterUrl);

//     let type = "other";
//     const explicit = (chapter?.resourceType || chapter?.type || "")
//       .toString()
//       .toLowerCase();
//     if (explicit) type = explicit;
//     else {
//       const lower = chapterUrl.toLowerCase();
//       if (lower.endsWith(".pdf")) type = "pdf";
//       else if (lower.endsWith(".mp3") || lower.endsWith(".wav")) type = "audio";
//       else if (lower.endsWith(".mp4") || lower.endsWith(".webm"))
//         type = "video";
//     }

//     setFileType(type);
//     setPages({});
//     setLoading(true);
//     setPdfZoom(0.5);
//     setFlipbookZoom(4.0);
//     setCurrentPage(1);
//   }, [chapterUrl, chapter?.resourceType, chapter?.type]);

//   // ✅ Load PDF metadata (not pages)
//   useEffect(() => {
//     if (!bookUrl || fileType !== "pdf") {
//       setLoading(false);
//       return;
//     }

//     let cancelled = false;
//     const loadPdf = async () => {
//       setLoading(true);
//       try {
//         const loadingTask = pdfjsLib.getDocument(bookUrl);
//         const pdf = await loadingTask.promise;
//         if (cancelled) return;

//         pdfRef.current = pdf;
//         setTotalPages?.(pdf.numPages);
//         setTotal(pdf.numPages);

//         // load only first page initially
//         await renderPage(1);
//       } catch (err) {
//         console.error("Error loading PDF:", err);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };
//     loadPdf();
//     return () => (cancelled = true);
//   }, [bookUrl, fileType]);

//   // ✅ Render single page on demand
//   const renderPage = async (num) => {
//     if (!pdfRef.current || pages[num]) return; // already rendered
//     try {
//       const pageObj = await pdfRef.current.getPage(num);
//       const viewport = pageObj.getViewport({ scale: 1.5 });
//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;
//       await pageObj.render({ canvasContext: context, viewport }).promise;

//       if (num === 1) {
//         setPageSize({ width: viewport.width, height: viewport.height });
//       }

//       setPages((prev) => ({ ...prev, [num]: canvas.toDataURL() }));
//     } catch (err) {
//       console.error("Error rendering page:", err);
//     }
//   };

//   // ✅ Flipbook Keyboard nav
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!flipBookRef.current || !isFullscreen) return;
//       const pageFlip = flipBookRef.current.pageFlip();
//       if (e.key === "ArrowRight") pageFlip.flipNext();
//       else if (e.key === "ArrowLeft") pageFlip.flipPrev();
//       else if (e.key === "+") setFlipbookZoom((z) => Math.min(z + 0.2, 3));
//       else if (e.key === "-") setFlipbookZoom((z) => Math.max(z - 0.2, 0.5));
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isFullscreen]);

//   // ✅ Load next/prev pages lazily when flipping
//   const handleFlip = async (e) => {
//     const newPage = e.data + 1;
//     setCurrentPage(newPage);
//     setPage?.(newPage);
//     logActivity(newPage);
//     startTimeRef.current = Date.now();

//     // pre-load surrounding pages
//     await renderPage(newPage);
//     if (newPage + 1 <= total) renderPage(newPage + 1);
//     if (newPage - 1 > 0) renderPage(newPage - 1);
//   };

//   // ✅ Scroll Mode Lazy Loading
//   useEffect(() => {
//     if (viewMode !== "scroll" || !scrollContainerRef.current) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach(async (entry) => {
//           if (entry.isIntersecting) {
//             const index = parseInt(entry.target.dataset.index, 10) + 1;
//             await renderPage(index);
//             setCurrentPage(index);
//             setPage?.(index);
//           }
//         });
//       },
//       { root: scrollContainerRef.current, threshold: 0.6 }
//     );

//     const placeholders =
//       scrollContainerRef.current.querySelectorAll("div[data-index]");
//     placeholders.forEach((div) => observer.observe(div));

//     return () => observer.disconnect();
//   }, [viewMode, total]);

//   const handlePrev = () => flipBookRef.current?.pageFlip().flipPrev();
//   const handleNext = () => flipBookRef.current?.pageFlip().flipNext();

//   const isSmallScreen = window.innerWidth <= 1024;
//   const isSinglePage = isPortrait || isFullscreen || isSmallScreen;

//   return (
//     <div className="relative w-full h-full flex flex-col items-center bg-gray-100 overflow-hidden">
//       {/* Loading */}
//       {loading && (
//         <div className="absolute inset-0 flex justify-center items-center bg-white z-50">
//           <div className="text-xl font-semibold text-gray-600 animate-pulse">
//             ⏳ Loading File...
//           </div>
//         </div>
//       )}

//       {/* Top Controls */}
//       {fileType === "pdf" && total > 0 && (
//         <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-4 items-center z-50 text-white">
//           <button
//             onClick={() => setViewMode("flipbook")}
//             className={`p-1 ${
//               viewMode === "flipbook" ? "text-blue-500 " : "text-gray-700"
//             }`}
//             title="Flipbook View"
//           >
//             <FaBookOpen />
//           </button>
//           <button
//             onClick={() => setViewMode("scroll")}
//             className={`p-1 ${
//               viewMode === "scroll" ? "text-blue-500 " : "text-gray-700"
//             }`}
//             title="Scrollable PDF"
//           >
//             <FaFilePdf />
//           </button>

//           {viewMode === "flipbook" ? (
//             <>
//               <button
//                 onClick={() => setFlipbookZoom((z) => Math.max(z - 0.2, 0.5))}
//                 className="p-1 text-gray-800"
//                 title="Zoom Out Flipbook"
//               >
//                 <FiZoomOut />
//               </button>
//               <button
//                 onClick={() => setFlipbookZoom((z) => Math.min(z + 0.5, 8))}
//                 className="p-1 text-gray-800"
//                 title="Zoom In Flipbook"
//               >
//                 <FiZoomIn />
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 onClick={() => setPdfZoom((z) => Math.max(z - 0.2, 0.2))}
//                 className="p-1 text-gray-800"
//                 title="Zoom Out PDF"
//               >
//                 <FiZoomOut />
//               </button>
//               <button
//                 onClick={() => setPdfZoom((z) => Math.min(z + 0.2, 3))}
//                 className="p-1 text-gray-800"
//                 title="Zoom In PDF"
//               >
//                 <FiZoomIn />
//               </button>
//             </>
//           )}
//         </div>
//       )}

//       {/* PDF Rendering */}
//       {fileType === "pdf" && total > 0 ? (
//         viewMode === "flipbook" ? (
//           <div className="relative flex items-center justify-center w-full h-full overflow-auto">
//             <div
//               className="transition-transform duration-200 ease-in-out"
//               style={{
//                 transform: `scale(${flipbookZoom})`,
//                 transformOrigin: "center",
//               }}
//             >
//               <HTMLFlipBook
//                 width={pageSize.width}
//                 height={pageSize.height}
//                 size="stretch"
//                 ref={flipBookRef}
//                 singlePage={isSinglePage}
//                 onFlip={handleFlip}
//                 startPage={page ? page - 1 : 0}
//               >
//                 {Array.from({ length: total }).map((_, index) => (
//                   <div
//                     key={index}
//                     className="w-full h-full flex justify-center items-center bg-white"
//                   >
//                     {pages[index + 1] ? (
//                       <img
//                         src={pages[index + 1]}
//                         alt={`Page ${index + 1}`}
//                         className="w-full h-full object-contain"
//                       />
//                     ) : (
//                       <div className="flex justify-center items-center w-full h-full">
//                         <p className="text-gray-500 text-[8px] font-medium">Loading page...</p>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </HTMLFlipBook>
//             </div>

//             {/* Nav */}
//             <button
//               onClick={handlePrev}
//               className="absolute left-0 top-1/2 -translate-y-1/2 p-3"
//             >
//               <FiChevronLeft className="w-8 h-8 text-gray-800" />
//             </button>
//             <button
//               onClick={handleNext}
//               className="absolute right-0 top-1/2 -translate-y-1/2 p-3"
//             >
//               <FiChevronRight className="w-8 h-8 text-gray-800" />
//             </button>
//           </div>
//         ) : (
//           <div
//             ref={scrollContainerRef}
//             className="w-full h-full overflow-y-auto bg-gray-50 p-4 flex flex-col items-center gap-6"
//           >
//             {Array.from({ length: total }).map((_, index) => (
//               <div
//                 key={index}
//                 data-index={index}
//                 className="w-full flex justify-center items-center min-h-[600px] bg-white shadow rounded"
//               >
//                 {pages[index + 1] ? (
//                   <img
//                     src={pages[index + 1]}
//                     alt={`Page ${index + 1}`}
//                     style={{ transform: `scale(${pdfZoom})` }}
//                     className="transition-transform duration-200"
//                   />
//                 ) : (
//                   <div className="flex justify-center items-center w-full h-full">
//                     <p className="text-gray-500 text-lg font-semibold">
//                       Loading page {index + 1}...
//                     </p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )
//       ) : fileType === "audio" ? (
//         <audio controls className="mt-10 w-2/3">
//           <source src={bookUrl} type="audio/mpeg" />
//         </audio>
//       ) : fileType === "video" ? (
//         <video controls className="mt-10 w-2/3">
//           <source src={bookUrl} type="video/mp4" />
//         </video>
//       ) : (
//         !loading && (
//           <p className="mt-10 text-gray-600">⚠ Unsupported file format</p>
//         )
//       )}

//       <div className="font-semibold text-gray-800">
//         Pages:- {currentPage} / {total}
//       </div>
//     </div>
//   );
// }







import { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import { BiReset } from "react-icons/bi";
import "./Scroller.css";
import {
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";
import { FaBookOpen, FaFilePdf } from "react-icons/fa";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

export default function FlipbookPDFViewer({
  bookId: propBookId,
  chapter,
  page,
  setPage,
  setTotalPages,
  isFullscreen,
}) {
  const { bookId: paramBookId } = useParams();
  const bookId = propBookId || paramBookId;

  const [bookUrl, setBookUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [pages, setPages] = useState({});
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState({ width: 800, height: 1000 });

  const [isPortrait, setIsPortrait] = useState(true);
  const [viewMode, setViewMode] = useState("flipbook");

  const [pdfZoom, setPdfZoom] = useState(1.0);
  const [flipbookZoom, setFlipbookZoom] = useState(1.8);

  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const flipBookRef = useRef();
  const scrollContainerRef = useRef();
  const startTimeRef = useRef(Date.now());
  const pdfRef = useRef(null);

  // ✅ Orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight >= window.innerWidth);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  // ✅ Chapter URL resolver
  const chapterUrl = useMemo(() => {
    if (!chapter) return null;
    const raw = chapter.proxyUrl || chapter.fileUrl || chapter.file || "";
    if (!raw) return null;
    if (raw.includes("/books/proxy/")) return raw;
    try {
      const u = new URL(raw);
      const isNextcloudShare =
        u.hostname.includes("cloud.ptgn.in") &&
        u.pathname.includes("/index.php/s/");
      if (isNextcloudShare && !u.pathname.endsWith("/download")) {
        u.pathname = u.pathname.replace(/\/+$/, "") + "/download";
        return u.toString();
      }
      return raw;
    } catch {
      return raw;
    }
  }, [chapter]);

  

  const logActivity = (currentPage) => {
    const role = localStorage.getItem("role");
    if (role !== "student") return;

    const payload = {
      bookId: parseInt(bookId),
      chapterId: chapter?.id,
      timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000),
      resourceType: fileType?.toUpperCase(),
      pageNumber: currentPage,
      isCompleted: currentPage === total,
    };

    fetch(`${import.meta.env.VITE_API_URL}/students/activity`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ Activity logged:", data))
      .catch((err) => console.error("❌ Failed to log activity:", err));
  };

  // ✅ Detect file type
  useEffect(() => {
    if (!chapterUrl) return;
    setBookUrl(chapterUrl);

    let type = "other";
    const explicit = (chapter?.resourceType || chapter?.type || "")
      .toString()
      .toLowerCase();
    if (explicit) type = explicit;
    else {
      const lower = chapterUrl.toLowerCase();
      if (lower.endsWith(".pdf")) type = "pdf";
      else if (lower.endsWith(".mp3") || lower.endsWith(".wav")) type = "audio";
      else if (lower.endsWith(".mp4") || lower.endsWith(".webm")) type = "video";
    }

    setFileType(type);
    setPages({});
    setLoading(true);
    setPdfZoom(0.5);
    setFlipbookZoom(4.0);
    setCurrentPage(1);
  }, [chapterUrl, chapter?.resourceType, chapter?.type]);

  // ✅ Load PDF metadata & first page
  useEffect(() => {
    if (!bookUrl || fileType !== "pdf") {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const loadPdf = async () => {
      setLoading(true);
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: bookUrl,
          rangeChunkSize: 1024 * 512, // 512 KB chunks for faster streaming
          disableStream: false,
        });

        const pdf = await loadingTask.promise;
        pdfRef.current = pdf;
        setTotalPages?.(pdf.numPages);
        setTotal(pdf.numPages);

        // ✅ render first page immediately
        await renderPage(1);
      } catch (err) {
        console.error("Error loading PDF:", err);
      } finally {
        setLoading(false); // first page render ke baad hide loader
      }
    };

    loadPdf();
    return () => (cancelled = true);
  }, [bookUrl, fileType]);

  // ✅ Render single page on demand
  const renderPage = async (num) => {
    if (!pdfRef.current || pages[num]) return; // already rendered
    try {
      const pageObj = await pdfRef.current.getPage(num);
      const viewport = pageObj.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");

      await pageObj.render({ canvasContext: context, viewport }).promise;

      // Convert canvas to blob (not Base64)
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setPages((prev) => ({ ...prev, [num]: url }));
      }, "image/png");

      if (num === 1) setPageSize({ width: viewport.width, height: viewport.height });
    } catch (err) {
      console.error("Error rendering page:", err);
    }
  };

  // ✅ Flipbook Keyboard nav
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!flipBookRef.current || !isFullscreen) return;
      const pageFlip = flipBookRef.current.pageFlip();
      if (e.key === "ArrowRight") pageFlip.flipNext();
      else if (e.key === "ArrowLeft") pageFlip.flipPrev();
      else if (e.key === "+") setFlipbookZoom((z) => Math.min(z + 0.2, 3));
      else if (e.key === "-") setFlipbookZoom((z) => Math.max(z - 0.2, 0.5));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // ✅ Load next/prev pages lazily when flipping
  // const handleFlip = async (e) => {
  //   const newPage = e.data + 1;
  //   setCurrentPage(newPage);
  //   setPage?.(newPage);
  //   logActivity(newPage);
  //   startTimeRef.current = Date.now();

  //   // pre-load surrounding pages
  //   await renderPage(newPage);
  //   if (newPage + 1 <= total) renderPage(newPage + 1);
  //   if (newPage - 1 > 0) renderPage(newPage - 1);
  // };
  const handleFlip = async (e) => {
    const newPage = e.data + 1;
    setCurrentPage(newPage);
    setPage?.(newPage);
    logActivity(newPage);
    startTimeRef.current = Date.now();

    // lazy load
    renderPage(newPage + 1);
    renderPage(newPage - 1);
  };

  // ✅ Scroll Mode Lazy Loading
  useEffect(() => {
    if (viewMode !== "scroll" || !scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index, 10) + 1;
            await renderPage(index);
            setCurrentPage(index);
            setPage?.(index);
          }
        });
      },
      { root: scrollContainerRef.current, threshold: 0.6 }
    );

    const placeholders =
      scrollContainerRef.current.querySelectorAll("div[data-index]");
    placeholders.forEach((div) => observer.observe(div));

    return () => observer.disconnect();
  }, [viewMode, total]);

  const handlePrev = () => flipBookRef.current?.pageFlip().flipPrev();
  const handleNext = () => flipBookRef.current?.pageFlip().flipNext();

  const isSmallScreen = window.innerWidth <= 1024;
  const isSinglePage = isPortrait || isFullscreen || isSmallScreen;

  return (
    <div className="relative w-full h-full flex flex-col items-center bg-gray-100 overflow-hidden">
      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white z-50">
          <div className="text-xl font-semibold text-gray-600 animate-pulse">
            ⏳ Loading File...
          </div>
        </div>
      )}

      {/* Top Controls */}
      {fileType === "pdf" && total > 0 && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-4 items-center z-50 text-white">
          <button
            onClick={() => setViewMode("flipbook")}
            className={`p-1 ${viewMode === "flipbook" ? "text-blue-500" : "text-gray-700"
              }`}
            title="Flipbook View"
          >
            <FaBookOpen />
          </button>
          <button
            onClick={() => setViewMode("scroll")}
            className={`p-1 ${viewMode === "scroll" ? "text-blue-500" : "text-gray-700"
              }`}
            title="Scrollable PDF"
          >
            <FaFilePdf />
          </button>

          {viewMode === "flipbook" ? (
            <>
              <button
                onClick={() => setFlipbookZoom((z) => Math.max(z - 0.2, 0.5))}
                className="p-1 text-gray-800"
                title="Zoom Out Flipbook"
              >
                <FiZoomOut />
              </button>
              <button
                onClick={() => setFlipbookZoom((z) => Math.min(z + 0.5, 8))}
                className="p-1 text-gray-800"
                title="Zoom In Flipbook"
              >
                <FiZoomIn />
              </button>
              <button
                onClick={() => {
                  setFlipbookZoom(4.0);
                  setPdfZoom(0.5);
                }}
                className="p-1 text-gray-800 font-semibold"
                title="Reset Zoom"
              >
                <BiReset />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setPdfZoom((z) => Math.max(z - 0.2, 0.2))}
                className="p-1 text-gray-800"
                title="Zoom Out PDF"
              >
                <FiZoomOut />
              </button>
              <button
                onClick={() => setPdfZoom((z) => Math.min(z + 0.2, 3))}
                className="p-1 text-gray-800"
                title="Zoom In PDF"
              >
                <FiZoomIn />
              </button>
              <button
                onClick={() => {
                  setFlipbookZoom(4.0);
                  setPdfZoom(0.5);
                }}
                className="p-1 font-semibold text-gray-800"
                title="Reset Zoom"
              >
                <BiReset />
              </button>
            </>
          )}
        </div>
      )}

      {/* PDF Rendering */}
      {fileType === "pdf" && total > 0 ? (
        viewMode === "flipbook" ? (
          <div className="relative flex items-center justify-center w-full h-full hide-scrollbar overflow-y-auto">
            <div
              className="transition-transform duration-200 ease-in-out"
              style={{
                transform: `scale(${flipbookZoom})`,
                transformOrigin: "center",
              }}
            >
              <HTMLFlipBook
                width={pageSize.width}
                height={pageSize.height}
                size="stretch"
                ref={flipBookRef}
                singlePage={isSinglePage}
                onFlip={handleFlip}
                startPage={page ? page - 1 : 0}
              >
                {Array.from({ length: total }).map((_, index) => (
                  <div
                    key={index}
                    className="w-full h-full flex justify-center items-center bg-white"
                  >
                    {pages[index + 1] ? (
                      <img
                        src={pages[index + 1]}
                        alt={`Page ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex justify-center items-center w-full h-full">
                        <p className="text-gray-500 text-[8px] font-medium">
                          Loading page...
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </HTMLFlipBook>
            </div>

            {/* Nav */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3"
            >
              <FiChevronLeft className="w-8 h-8 text-gray-800" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-3"
            >
              <FiChevronRight className="w-8 h-8 text-gray-800" />
            </button>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="w-full h-full overflow-y-auto bg-gray-50 p-4 flex flex-col items-center gap-10"
          >
            {Array.from({ length: total }).map((_, index) => (
              <div
                key={index}
                data-index={index}
                className="flex justify-center items-center bg-white shadow-md rounded-lg"
                style={{
                  width: `${100 * pdfZoom}%`, // Zoom width
                  transition: "width 0.25s ease",
                }}
              >
                {pages[index + 1] ? (
                  <img
                    src={pages[index + 1]}
                    alt={`Page ${index + 1}`}
                    className="w-full h-auto"
                  />
                ) : (
                  <p>Loading page...</p>
                )}
              </div>
            ))}
          </div>

        )
      ) : fileType === "audio" ? (
        <audio controls className="mt-10 w-2/3">
          <source src={bookUrl} type="audio/mpeg" />
        </audio>
      ) : fileType === "video" ? (
        <video controls className="mt-10 w-2/3">
          <source src={bookUrl} type="video/mp4" />
        </video>
      ) : (
        !loading && (
          <p className="mt-10 text-gray-600">⚠ Unsupported file format</p>
        )
      )}

      <div className="font-semibold text-gray-800">
        Pages:- {currentPage} / {total}
      </div>
    </div>
  );
}
