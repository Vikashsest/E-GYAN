import { FiMenu } from "react-icons/fi";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { getRepository } from "../../apiServices/apiRepository";
import { useState, useEffect } from "react";
import { SchoolEducationForm } from "./UploadForms/SchoolEducationForm";
import SimulationForm from "./UploadForms/SimulationForm";
import { CurrentAffairsForm } from "./UploadForms/CurrentAffairsForm";
import { uploadBook } from "../../apiServices/booksApi";
import ChapterModal from "./UploadForms/ChapterForm";
import ChaptersSection from "./UploadForms/ChapterUploadForm";

export default function UploadBook() {
  const [bookData, setBookData] = useState({
    bookName: "",
    category: "",
    subject: "",
    educationLevel: "",
    language: "",
    stateBoard: "",
    totalPages: "",
    thumbnail: "",
  });

  const [formData, setFormData] = useState({
    category: "",
    bookName: "",
    description: "",
    grade: "",
    difficulty: "",
    topic: "",
    prerequisites: "",
    simulationFile: null,
    thumbnail: null,
  });


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [chapterData, setChapterData] = useState({
    resourceType: "",
    chapterNumber: "",
    file: null,
    link: "",
    thumbnail: null,
  });

  const handleCategoryChange = async (value) => {
    updateBook("category", value);

    // ❌ agar School Education nahi hai
    if (value !== "School Education") return;

    // ❌ agar data pehle se loaded hai
    if (
      subjects.length > 0 &&
      levels.length > 0 &&
      languages.length > 0
    ) {
      return;
    }

    try {
      setLoadingRepo(true);

      const levelRes = await getRepository("level");
      const languageRes = await getRepository("language");

      setLevels(levelRes.data || levelRes);
      setLanguages(languageRes.data || languageRes);

    } catch (err) {
      console.error("Subject / Level / Language fetch failed");
    } finally {
      setLoadingRepo(false);
    }
  };


  const handleUploadBook = async () => {
    try {
      const fd = new FormData(); // 👈 name change (important)

      Object.entries(bookData).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          fd.append(key, value);
        }
      });

      const res = await uploadBook(fd);

      console.log("Upload success:", res);
      alert("Book uploaded successfully ✅");

    } catch (error) {
      console.error(error);
      alert(error.message || "Book upload failed ❌");
    }
  };



  const fetchCategories = async () => {
    // agar already loaded hain to dobara call mat karo
    if (categories.length > 0) return;

    try {

      const categoryRes = await getRepository("category");
      setCategories(categoryRes.data || categoryRes);

    } catch (err) {
      console.error("Category fetch failed");
    }
  };



  const updateBook = (key, value) => {
    setBookData((prev) => ({
      ...prev,
      [key]: value,
    }));
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
        <div className="bg-cardBg border border-white/10 rounded-xl p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primaryBlue/10 text-primaryBlue">
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


          {/* Category */}
          <div className="mb-5">
            <label className="label-dark">Category</label>
            <select
              className="input-dark"
              value={bookData.category}
              onFocus={fetchCategories}   // 👈 sirf category API
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">
                {loadingRepo ? "Loading categories..." : "Select category"}
              </option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.text}>
                  {cat.text}
                </option>
              ))}
            </select>



          </div>



          {/* Dynamic Forms */}
          {bookData.category === "School Education" && (
            <SchoolEducationForm
              bookData={bookData}
              updateBook={updateBook}
              subjects={subjects}
              levels={levels}
              languages={languages}
            />
          )}

          {bookData.category === "Simulation" && (
            <SimulationForm
              formData={formData}
              updateBook={setFormData}
            />
          )}




          {bookData.category === "Current Affairs" && (
            <CurrentAffairsForm
              bookData={bookData}
              updateBook={updateBook}
            />
          )}


          {/* UPLOAD BUTTON – BOOK INFORMATION */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUploadBook}
              className="flex items-center gap-2 px-4 py-2
    bg-primaryBlue hover:bg-primaryBlue/90
    text-white font-medium rounded-lg transition"
            >
              ⬆ Upload Book
            </button>

          </div>

        </div>


        <ChaptersSection
          onAddChapter={() => setShowChapterModal(true)}
        />


      </main>


      <ChapterModal
        isOpen={showChapterModal}
        onClose={() => setShowChapterModal(false)}
        chapterData={chapterData}
        setChapterData={setChapterData}
        onSave={() => {
          console.log("Final Chapter Data:", chapterData);
          // 🔥 yahin API call karo
          setShowChapterModal(false);
        }}
      />

    </div>
  );
}
