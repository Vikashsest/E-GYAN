// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { fetchChapters, deleteChapter } from "../apiServices/booksApi";
// import { toast } from "react-toastify";
// import { getRepository } from "../apiServices/apiRepository";

// export default function UploadChapter() {
//   const { bookId } = useParams();
//   const navigate = useNavigate();
//   const [chapterNumber, setChapterNumber] = useState("");
//   const [file, setFile] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [chapters, setChapters] = useState([]);
//   const [resourceType, setResourceType] = useState("");
//   const [openChapterId, setOpenChapterId] = useState(null);
//   const [addPartChapterId, setAddPartChapterId] = useState(null);
//   const [videoUrl, setVideoUrl] = useState("");
//   const [simulationUrl, setSimulationUrl] = useState("");
//   const [resourceTypes, setResourceTypes] = useState([]);
//   const [partResourceType, setPartResourceType] = useState("");

//   const API_URL = import.meta.env.VITE_API_URL;
//   const progressIntervalRef = useRef(null);

//   useEffect(() => {
//     const loadResourceTypes = async () => {
//       try {
//         const data = await getRepository("resource");
//         setResourceTypes(data);
//       } catch (err) {
//         console.error("Failed to fetch resource types:", err);
//         setResourceTypes([]);
//       }
//     };

//     loadResourceTypes();
//   }, []);

//   useEffect(() => {
//     async function loadChapters() {
//       try {
//         setLoading(true);
//         const data = await fetchChapters(bookId);
//         setChapters(data || []);
//       } catch (err) {
//         toast.error("Error fetching chapters");
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadChapters();
//   }, [bookId]);

//   // ✅ Add Chapter or Part
//   const handleAddChapter = async (
//     chapterNum = chapterNumber,
//     f = file,
//     t = thumbnail,
//     r = resourceType,
//     vUrl = videoUrl,
//     sUrl = simulationUrl
//   ) => {
//     if (!bookId) {
//       toast.error("Invalid book ID");
//       return;
//     }

//     if (!chapterNum || (!f && !vUrl && !sUrl)) {
//       toast.warning(
//         "Please enter chapter number, resource file/url and thumbnail."
//       );
//       return;
//     }

//     try {
//       setLoading(true);
//       setProgress(0);
//       progressIntervalRef.current = setInterval(() => {
//         setProgress((prev) => {
//           if (prev < 95) return prev + Math.random() * 5;
//           return prev;
//         });
//       }, 200);

//       const fd = new FormData();
//       fd.append("chapterNumber", chapterNum);
//       fd.append("resourceType", r);

//       // Thumbnail (optional)
//       if (t) fd.append("thumbnail", t);

//       // Resource type check
//       if (r === "video") {
//         if (vUrl) fd.append("videoUrl", vUrl);
//       } else if (r === "simulation") {
//         if (sUrl) fd.append("simulationUrl", sUrl); // ✅ simulation url send
//       } else {
//         if (f) fd.append("file", f);
//       }

//       const res = await fetch(`${API_URL}/books/${bookId}/chapters`, {
//         method: "POST",
//         body: fd,
//         credentials: "include",
//       });

//       clearInterval(progressIntervalRef.current);

//       if (!res.ok) {
//         setProgress(0);
//         toast.error("Error adding chapter");
//         setLoading(false);
//         return;
//       }

//       const newChapter = await res.json();
//       setChapters((prev) => [...prev, newChapter]);
//       setChapterNumber("");
//       setFile(null);
//       setThumbnail(null);
//       setVideoUrl("");
//       setSimulationUrl(""); // ✅ reset simulation url
//       setResourceType("");
//       setAddPartChapterId(null);
//       setPartResourceType("");
//       setProgress(100);
//       toast.success("Chapter/Part added successfully!");
//     } catch (err) {
//       clearInterval(progressIntervalRef.current);
//       setProgress(0);
//       toast.error("Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   //handle add part
//   const handleAddPart = async (
//     parentChapterId,
//     partNumber,
//     f,
//     t,
//     r,
//     vUrl,
//     sUrl
//   ) => {
//     try {
//       setLoading(true);

//       const fd = new FormData();
//       fd.append("partNumber", partNumber);
//       fd.append("resourceType", r);

//       if (t) fd.append("thumbnail", t);

//       if (r === "video") {
//         fd.append("videoUrl", vUrl);
//       } else if (r === "simulation") {
//         fd.append("videoUrl", sUrl);
//       } else {
//         fd.append("file", f);
//       }

//       const res = await fetch(
//         `${API_URL}/books/${bookId}/chapters/${parentChapterId}/parts`,
//         {
//           method: "POST",
//           body: fd,
//           credentials: "include",
//         }
//       );

//       if (!res.ok) {
//         toast.error("Error uploading part");
//         return;
//       }

//       const response = await res.json();

//       // 🔥 frontend state update
//       setChapters((prev) =>
//         prev.map((ch) =>
//           ch.id === parentChapterId
//             ? { ...ch, parts: [...(ch.parts || []), response] } // ✅ directly use response
//             : ch
//         )
//       );

//       toast.success("Part uploaded successfully");
//     } catch (err) {
//       toast.error("Part upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete Chapter
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this chapter?"))
//       return;
//     try {
//       setLoading(true);
//       await deleteChapter(id);
//       setChapters((prev) => prev.filter((c) => c.id !== id));
//       toast.success("Chapter deleted successfully!");
//     } catch (err) {
//       toast.error("Error deleting chapter");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // toggle accordion
//   const toggleChapter = (id) => {
//     setOpenChapterId(openChapterId === id ? null : id);
//   };

//   return (
//     <div className="min-h-screen bg-[#2a2b39] flex flex-col items-center py-10 text-white">
//       <div className="bg-[#38394a] shadow-lg rounded-lg p-6 w-full max-w-2xl">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-center">
//             📚 Manage Book Chapters
//           </h1>
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
//           >
//             ⬅ Back
//           </button>
//         </div>

//         {/* Form (Main Add Chapter) */}
//         <div className="flex flex-col gap-4 items-center">

//             <div className="w-full">
//             <label className="block text-sm font-medium mb-1 text-gray-200">
//               Resource Type
//             </label>
//             <select
//               value={resourceType}
//               onChange={(e) => setResourceType(e.target.value)}
//               className="w-full bg-[#2a2b39] border border-gray-500 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
//             >
//               <option value="" className="text-gray-400">
//                 Select Resource Type
//               </option>
//               {resourceTypes.map((rType) => (
//                 <option key={rType.id} value={rType.text.toLowerCase()}>
//                   {rType.text.charAt(0).toUpperCase() + rType.text.slice(1)}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Resource Inputs */}
//           {resourceType === "video" && (
//             <div className="w-full">
//               <label>Video URL</label>
//               <input
//                 type="text"
//                 placeholder="Enter video link"
//                 className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 mt-1 w-full text-white"
//                 value={videoUrl}
//                 onChange={(e) => setVideoUrl(e.target.value)}
//               />
//             </div>
//           )}

//           {resourceType === "simulation" && (
//             <div className="w-full">
//               <label>Simulation URL</label>
//               <input
//                 type="text"
//                 placeholder="Enter simulation link"
//                 className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 mt-1 w-full text-white"
//                 value={simulationUrl}
//                 onChange={(e) => setSimulationUrl(e.target.value)}
//               />
//             </div>
//           )}

//           {(resourceType === "pdf" || resourceType === "audio") && (
//             <div className="w-full">
//               <label>(Pdf/Audio File)</label>
//               <input
//                 type="file"
//                 className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 mt-1 w-full text-white"
//                 onChange={(e) => setFile(e.target.files[0])}
//               />
//             </div>
//           )}

//            <div className="w-full">
//           <label>Chapter/Leacher Numbers</label>
//           <input
//             type="number"
//             placeholder="Enter Chapter Number"
//             className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 w-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             value={chapterNumber}
//             onChange={(e) => setChapterNumber(e.target.value)}
//           />
//           </div>

//           <div className="w-full">
//             <label>Thumbnail Image</label>
//             <input
//               type="file"
//               accept="image/*"
//               className="bg-[#2a2b39] border border-gray-500 rounded-lg p-2 mt-1 w-full text-white focus:outline-none focus:ring-2 focus:ring-green-400"
//               onChange={(e) => setThumbnail(e.target.files[0])}
//             />
//           </div>

//           {/* Progress Bar */}
//           {loading && (
//             <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
//               <div
//                 className="bg-blue-500 h-3 rounded-full text-xs text-center text-white transition-all duration-150"
//                 style={{ width: `${progress}%` }}
//               >
//                 {Math.floor(progress)}%
//               </div>
//             </div>
//           )}

//           <div className="flex justify-end w-full gap-3 mt-2">
//             <button
//               type="button"
//               onClick={() => {
//                 setChapterNumber("");
//                 setFile(null);
//                 setThumbnail(null);
//                 setVideoUrl("");
//                 setSimulationUrl("");
//                 toast.info("Form cleared");
//               }}
//               className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
//             >
//               Clear
//             </button>
//             <button
//               type="button"
//               onClick={() => handleAddChapter()}
//               disabled={loading}
//               className={`px-4 py-2 rounded-lg transition ${
//                 loading
//                   ? "bg-blue-500 font-semibold"
//                   : "font-semibold bg-blue-500 hover:bg-blue-800"
//               } text-white`}
//             >
//               {loading ? "Uploading..." : "Upload"}
//             </button>
//           </div>
//         </div>

//         {/* Chapters List */}
//         <ul className="mt-6 divide-y divide-gray-600">
//           {chapters.length === 0 && !loading && (
//             <li className="py-3 text-center text-gray-400">
//               No chapters found
//             </li>
//           )}
//           {chapters.map((c) => (
//             <li key={c.id} className="py-2">
//               {/* Accordion Header */}
//               <div className="flex justify-between items-center">
//                 <div
//                   onClick={() => toggleChapter(c.id)}
//                   className="flex items-center gap-3 cursor-pointer"
//                 >
//                   {c.thumbnail && (
//                     <img
//                       src={`${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(
//                         c.thumbnail + "/download"
//                       )}`}
//                       alt={c.chapterNumber}
//                       className="w-12 h-12 object-cover rounded"
//                     />
//                   )}
//                   <span className="font-semibold">
//                     Chapter {c.chapterNumber}
//                   </span>
//                   <span className="text-gray-300">
//                     {openChapterId === c.id ? "▲" : "▼"}
//                   </span>
//                 </div>
//                 {/* Add Part Button */}
//                 <button
//                   onClick={() =>
//                     setAddPartChapterId(addPartChapterId === c.id ? null : c.id)
//                   }
//                   className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg ml-4"
//                 >
//                   ＋ Add Part
//                 </button>
//               </div>

//               {/* Accordion Content */}
//               {openChapterId === c.id && (
//                 <div className="mt-3 ml-14 text-sm text-gray-300 space-y-2">
//                   <p>
//                     <strong>Resource Type:</strong> {c.resourceType || "N/A"}
//                   </p>
//                   {c.resourceType === "simulation" && (
//                     <p>
//                       <strong>Simulation URL:</strong>{" "}
//                       <a
//                         href={c.simulationUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-400 underline"
//                       >
//                         Open
//                       </a>
//                     </p>
//                   )}
//                   <p>
//                     <strong>Overview:</strong>{" "}
//                     {c.overview || "No overview available"}
//                   </p>
//                   <button
//                     type="button"
//                     onClick={() => handleDelete(c.id)}
//                     className="bg-red-500 text-white font-semibold px-3 py-1 rounded-lg hover:bg-red-600 transition"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               )}

//               {/* Add Part Form */}
//               {addPartChapterId === c.id && (
//                 <div className="mt-4 ml-14 bg-[#2f3042] p-4 rounded-lg space-y-3">
//                   <h4 className="font-semibold text-white">
//                     ➕ Add Part to Chapter {c.chapterNumber}
//                   </h4>

//                   <select
//                     className="w-full border border-gray-500 rounded-lg p-2 mt-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
//                     value={partResourceType}
//                     onChange={(e) => setPartResourceType(e.target.value)}
//                     required
//                   >
//                     <option value="">Select Resource Type</option>
//                     {resourceTypes.map((rType) => (
//                       <option key={rType.id} value={rType.text.toLowerCase()}>
//                         {rType.text.charAt(0).toUpperCase() +
//                           rType.text.slice(1)}
//                       </option>
//                     ))}
//                   </select>

//                   {resourceType === "video" && (
//                     <input
//                       type="text"
//                       placeholder="Enter video link"
//                       className="w-full border border-gray-500 rounded-lg p-2 mt-1 bg-[#2a2b39] text-white"
//                       value={videoUrl}
//                       onChange={(e) => setVideoUrl(e.target.value)}
//                     />
//                   )}

//                   {resourceType === "simulation" && (
//                     <input
//                       type="text"
//                       placeholder="Enter simulation link"
//                       className="w-full border border-gray-500 rounded-lg p-2 mt-1 bg-[#2a2b39] text-white"
//                       value={simulationUrl}
//                       onChange={(e) => setSimulationUrl(e.target.value)}
//                     />
//                   )}

//                   {(resourceType === "pdf" || resourceType === "audio") && (
//                     <input
//                       type="file"
//                       className="w-full border border-gray-500 rounded-lg p-2 mt-1 bg-[#2a2b39] text-white"
//                       onChange={(e) => setFile(e.target.files[0])}
//                     />
//                   )}

//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="w-full border border-gray-500 rounded-lg p-2 mt-1 bg-[#2a2b39] text-white"
//                     onChange={(e) => setThumbnail(e.target.files[0])}
//                   />

//                   <button
//                     type="button"
//                     onClick={() =>
//                       handleAddPart(
//                         c.id, // ✅ parentChapterId
//                         (c.parts?.length || 0) + 1,
//                         file,
//                         thumbnail,
//                         partResourceType,
//                         videoUrl,
//                         simulationUrl
//                       )
//                     }
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
//                   >
//                     Upload Part
//                   </button>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchChapters, deleteChapter } from "../apiServices/booksApi";
import { toast } from "react-toastify";
import { getRepository } from "../apiServices/apiRepository";

export default function UploadChapter() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [chapterNumber, setChapterNumber] = useState("");
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chapters, setChapters] = useState([]);
  const [resourceType, setResourceType] = useState("");
  const [openChapterId, setOpenChapterId] = useState(null);
  const [addPartChapterId, setAddPartChapterId] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [simulationUrl, setSimulationUrl] = useState("");
  const [resourceTypes, setResourceTypes] = useState([]);
  const [partsMap, setPartsMap] = useState({});
  const [partNumber, setPartNumber] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const progressIntervalRef = useRef(null);

  const fetchParts = async (chapterId) => {
    try {
      const res = await fetch(
        `${API_URL}/books/${bookId}/chapters/${chapterId}/parts`,
        { credentials: "include" },
      );

      if (!res.ok) throw new Error("Failed to fetch parts");

      const data = await res.json();

      setPartsMap((prev) => ({
        ...prev,
        [chapterId]: data,
      }));
    } catch (err) {
      toast.error("Failed to load parts");
    }
  };

  // Load resource types
  useEffect(() => {
    const loadResourceTypes = async () => {
      try {
        const data = await getRepository("resource");
        setResourceTypes(data);
      } catch {
        setResourceTypes([]);
      }
    };
    loadResourceTypes();
  }, []);

  // Load chapters
  useEffect(() => {
    const loadChapters = async () => {
      try {
        setLoading(true);
        const data = await fetchChapters(bookId);

        // 🔥 ONLY parent chapters (jinka parentChapter NULL ho)
        const onlyChapters = (data || []).filter((item) => !item.parentChapter);

        setChapters(onlyChapters);
      } catch {
        toast.error("Failed to fetch chapters");
      } finally {
        setLoading(false);
      }
    };
    loadChapters();
  }, [bookId]);

  const toggleChapter = (id) => {
    if (openChapterId === id) {
      setOpenChapterId(null);
    } else {
      setOpenChapterId(id);
      fetchParts(id);
    }
  };

  const handleAddChapter = async () => {
    if (
      !chapterNumber ||
      !resourceType ||
      (resourceType === "pdf" && !file) ||
      (resourceType === "video" && !videoUrl) ||
      (resourceType === "simulation" && !simulationUrl) ||
      (resourceType === "audio" && !audioUrl)
    ) {
      toast.warning("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => (prev < 95 ? prev + Math.random() * 5 : prev));
      }, 200);

      const fd = new FormData();
      fd.append("chapterNumber", chapterNumber);
      fd.append("resourceType", resourceType);
      if (thumbnail) fd.append("thumbnail", thumbnail);
      if (resourceType === "video") fd.append("videoUrl", videoUrl);
      else if (resourceType === "simulation")
        fd.append("simulationUrl", simulationUrl);
      else fd.append("file", file);

      const res = await fetch(`${API_URL}/books/${bookId}/chapters`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      clearInterval(progressIntervalRef.current);
      if (!res.ok) throw new Error("Upload failed");

      const newChapter = await res.json();
      setChapters((prev) => [...prev, newChapter]);
      setChapterNumber("");
      setFile(null);
      setThumbnail(null);
      setVideoUrl("");
      setSimulationUrl("");
      setResourceType("");
      toast.success("Chapter added!");
      setProgress(100);
    } catch {
      clearInterval(progressIntervalRef.current);
      toast.error("Upload failed");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPart = async (parentId) => {
    const chapter = chapters.find((c) => c.id === parentId);
    if (!chapter || (!file && !videoUrl && !simulationUrl)) {
      return toast.warning("Add part details");
    }

    try {
      const fd = new FormData();
      if (!partNumber) {
        return toast.warning("Please enter part number");
      }

      fd.append("partNumber", partNumber);

      fd.append("resourceType", chapter.resourceType);

      if (thumbnail) fd.append("thumbnail", thumbnail);

      if (chapter.resourceType === "video") {
        fd.append("videoUrl", videoUrl);
      } else if (chapter.resourceType === "simulation") {
        fd.append("simulationUrl", simulationUrl);
      } else {
        fd.append("file", file);
      }

      const res = await fetch(
        `${API_URL}/books/${bookId}/chapters/${parentId}/parts`,
        {
          method: "POST",
          body: fd,
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Part upload failed");

      toast.success("Part added");

      // 🔥 IMPORTANT: Upload ke baad fresh fetch
      await fetchParts(parentId);
      setPartNumber("");
      setFile(null);
      setThumbnail(null);
      setVideoUrl("");
      setAudioUrl("");
      setSimulationUrl("");
      setAddPartChapterId(parentId); // form open hi rahe
    } catch {
      toast.error("Part upload failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete chapter?")) return;
    try {
      await deleteChapter(id);
      setChapters((prev) => prev.filter((c) => c.id !== id));
      toast.success("Chapter deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#2a2b39] flex flex-col items-center py-10 text-white">
      <div className="bg-[#38394a] shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-center">
            📚 Manage Book Chapters
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            ⬅ Back
          </button>
        </div>

        {/* Add Chapter */}
        <div className="flex flex-col gap-4 items-center">
          {/* Resource Type */}
          <div className="w-full">
            <label className="block mb-1 text-sm text-gray-300">
              Resource Type
            </label>
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              className="w-full bg-[#2a2b39] border border-gray-500 rounded-lg p-3 text-white"
            >
              <option value="">Select Resource Type</option>
              {resourceTypes.map((r) => (
                <option key={r.id} value={r.text.toLowerCase()}>
                  {r.text.charAt(0).toUpperCase() + r.text.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {resourceType === "video" && (
            <input
              type="text"
              placeholder="Video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#2a2b39] border border-gray-500 text-white"
            />
          )}
          {resourceType === "simulation" && (
            <input
              type="text"
              placeholder="Simulation URL"
              value={simulationUrl}
              onChange={(e) => setSimulationUrl(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#2a2b39] border border-gray-500 text-white"
            />
          )}
          {(resourceType === "pdf" || resourceType === "audio") && (
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-2 rounded-lg bg-[#2a2b39] border border-gray-500 text-white"
            />
          )}
          <input
            type="number"
            min={1}
            step={1}
            placeholder="Chapter Number (1, 2, 3...)"
            value={chapterNumber}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || Number(value) >= 1) {
                setChapterNumber(value);
              }
            }}
            className="w-full p-2 rounded-lg bg-[#2a2b39] border border-gray-500 text-white"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="w-full p-2 rounded-lg bg-[#2a2b39] border border-gray-500 text-white"
          />

          <button
            onClick={handleAddChapter}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg w-full"
          >
            Add Chapter
          </button>
        </div>

        {/* Chapters List */}
        <ul className="mt-6 divide-y divide-gray-600">
          {chapters.length === 0 && (
            <li className="py-3 text-center text-gray-400">
              No chapters found
            </li>
          )}
          {chapters.map((c) => (
            <li key={c.id} className="py-2">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleChapter(c.id)}
              >
                <span className="font-semibold">
                  {c.resourceType === "video" ? "Lecture" : "Chapter"}{" "}
                  {c.chapterNumber}
                </span>
                <span>{openChapterId === c.id ? "▲" : "▼"}</span>
              </div>

              {openChapterId === c.id && (
                <div className="ml-6 mt-2 space-y-1">
                  {partsMap[c.id]?.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>
                        {c.resourceType === "video"
                          ? `Part ${p.chapterNumber}`
                          : `Part ${p.partNumber}`}
                      </span>

                      {p.videoUrl && (
                        <a
                          href={p.videoUrl}
                          target="_blank"
                          className="text-blue-400 underline"
                        >
                          Watch
                        </a>
                      )}

                      {p.simulationUrl && (
                        <a
                          href={p.simulationUrl}
                          target="_blank"
                          className="text-green-400 underline"
                        >
                          Simulation
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() =>
                    setAddPartChapterId(addPartChapterId === c.id ? null : c.id)
                  }
                  className="bg-green-500 px-3 py-1 rounded-lg"
                >
                  + Add Part
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="bg-red-500 px-3 py-1 rounded-lg"
                >
                  Delete
                </button>
              </div>

              {addPartChapterId === c.id && (
                <div className="ml-6 mt-2 p-3 bg-[#2f3042] rounded-lg space-y-2">
                  {/* ✅ Part Number Input */}
                  <input
                    type="number"
                    min="1"
                    placeholder="Part Number (1, 2, 3...)"
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#2a2b39] border border-gray-500 text-white"
                  />

                  {c.resourceType === "video" && (
                    <input
                      type="text"
                      placeholder="Video URL"
                      accept="video/mp4"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full p-2 rounded-lg bg-[#2a2b39] border border-gray-500 text-white"
                    />
                  )}

                  {c.resourceType === "simulation" && (
                    <input
                      type="text"
                      placeholder="Simulation URL"
                      value={simulationUrl}
                      onChange={(e) => setSimulationUrl(e.target.value)}
                      className="w-full p-2 rounded-lg bg-[#2a2b39] border border-gray-500 text-white"
                    />
                  )}

                  {(c.resourceType === "pdf" || c.resourceType === "audio") && (
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="w-full p-2 rounded-lg bg-[#2a2b39] border border-gray-500 text-white"
                    />
                  )}

                  {/* <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                    className="w-full p-2 rounded-lg bg-[#2a2b39] border border-gray-500 text-white"
                  /> */}

                  <button
                    onClick={() => handleAddPart(c.id)}
                    className="bg-blue-500 px-3 py-1 rounded-lg w-full"
                  >
                    Upload Part
                  </button>

                  {/* PARTS LIST */}
                  {partsMap[c.id]?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {partsMap[c.id].map((p) => (
                        <div
                          key={p.id}
                          className="p-2 bg-[#1f2030] rounded text-sm text-white"
                        >
                          <div className="font-semibold">{`part ${p.chapterNumber}`}</div>
                          <div className="text-gray-400">
                            Type: {p.resourceType}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
