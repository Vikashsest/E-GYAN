import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

export default function UploadBook() {
  const [bookData, setBookData] = useState({
    bookName: "",
    category: "",
    subject: "",
    educationLevel: "",
    language: "English",
    stateBoard: "",
    totalPages: "",
    thumbnail: "",
  });

  const [chapters, setChapters] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const updateBook = (key, value) => {
    setBookData((prev) => ({ ...prev, [key]: value }));
  };

  const addChapter = () => {
    setChapters((prev) => [
      ...prev,
      {
        id: Date.now(),
        chapterName: "",
        chapterNumber: prev.length + 1,
        resourceType: "pdf",
        fileUrl: "",
        parts: [],
      },
    ]);
  };

  const updateChapter = (id, key, value) => {
    setChapters((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, [key]: value } : ch))
    );
  };

  const removeChapter = (id) => {
    setChapters((prev) => prev.filter((ch) => ch.id !== id));
  };

  const addPart = (chapterId) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId
          ? {
            ...ch,
            parts: [
              ...ch.parts,
              {
                id: Date.now(),
                name: "",
                resourceType: "video",
                fileUrl: "",
              },
            ],
          }
          : ch
      )
    );
  };

  const updatePart = (chapterId, partId, key, value) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId
          ? {
            ...ch,
            parts: ch.parts.map((p) =>
              p.id === partId ? { ...p, [key]: value } : p
            ),
          }
          : ch
      )
    );
  };

  const removePart = (chapterId, partId) => {
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === chapterId
          ? { ...ch, parts: ch.parts.filter((p) => p.id !== partId) }
          : ch
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-darkBg text-primaryWhite">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden px-4 mb-4">
          <button onClick={() => setIsSidebarOpen(true)} className="text-primaryWhite">
            <FiMenu size={28} />
          </button>
        </div>

        <AdminNavbar />


        {/* BOOK INFORMATION – DARK MODE */}
        <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              📘
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Book Information
              </h2>
              <p className="text-sm text-white/60">
                Enter the basic details of the book
              </p>
            </div>
          </div>

          {/* Book Name */}
          <div className="mb-5">
            <label className="label-dark">
              Book Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter book name"
              className="input-dark"
            />
          </div>

          {/* Category */}
          <div className="mb-5">
            <label className="label-dark">Category</label>
            <select className="input-dark">
              <option>Select category</option>
            </select>
          </div>

          {/* Subject & Education Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="label-dark">Subject</label>
              <select className="input-dark">
                <option>Select subject</option>
              </select>
            </div>

            <div>
              <label className="label-dark">Education Level</label>
              <select className="input-dark">
                <option>Select level</option>
              </select>
            </div>
          </div>

          {/* Language & State Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="label-dark">Language</label>
              <select className="input-dark">
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>

            <div>
              <label className="label-dark">State Board</label>
              <input
                type="text"
                placeholder="e.g., Maharashtra, UP, etc."
                className="input-dark"
              />
            </div>
          </div>

          {/* Total Pages */}
          <div className="mb-5">
            <label className="label-dark">Total Pages</label>
            <input
              type="number"
              placeholder="Enter total number of pages"
              className="input-dark"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="label-dark">Book Thumbnail/Cover</label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                className="input-dark flex-1"
                placeholder=""
              />
              <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-md text-sm text-white/80 hover:bg-white/10 transition">
                ⬆ Upload Thumbnail
              </button>
            </div>
          </div>
        </div>



        {/* CHAPTERS – DARK MODE */}
        <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Chapters
              </h2>
              <p className="text-sm text-white/60">
                Add and organize book chapters with multiple parts
              </p>
            </div>

            <button
              onClick={addChapter}
              className="flex items-center gap-2 px-4 py-2 
                 bg-indigo-600 hover:bg-indigo-500 
                 text-white text-sm font-medium 
                 rounded-md transition"
            >
              <span className="text-lg leading-none">+</span>
              Add Chapter
            </button>
          </div>

          {/* EMPTY STATE */}
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-lg">
            {/* Icon */}
            <div className="mb-4 text-white/30 text-5xl">
              📖
            </div>

            <p className="text-sm text-white/60 mb-4">
              No chapters added yet
            </p>

            <button
              onClick={addChapter}
              className="flex items-center gap-2 px-4 py-2 
                 border border-white/20 
                 text-white/80 text-sm 
                 rounded-md hover:bg-white/10 transition"
            >
              <span className="text-lg leading-none">+</span>
              Add First Chapter
            </button>
          </div>
        </div>


        {/* ACTION BUTTONS */}
        <div className="mt-6 flex gap-4">
          <button
            className="flex-1 flex items-center justify-center gap-2
               bg-indigo-600 hover:bg-indigo-500
               text-white font-medium py-3 rounded-lg transition"
          >
            ⬆ Publish Book
          </button>

          <button
            className="flex-1 border border-white/20
               text-white/80 py-3 rounded-lg
               hover:bg-white/10 transition"
          >
            Save as Draft
          </button>
        </div>


      </main>
    </div>
  );
}
