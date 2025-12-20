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
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [chapterData, setChapterData] = useState({
    resourceType: "",
    chapterNumber: "",
    file: null,
    link: "",
    thumbnail: null,
  });

  const handleUploadBook = async () => {
    try {
      const formData = new FormData();

      // bookData ko FormData me convert
      Object.entries(bookData).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          formData.append(key, value);
        }
      });

      const res = await uploadBook(formData);
      console.log("Upload success:", res);
      alert("Book uploaded successfully ✅");

    } catch (error) {
      console.error(error);
      alert("Book upload failed ❌");
    }
  };

  useEffect(() => {
    const fetchRepository = async () => {
      try {
        setLoadingRepo(true);

        const categoryRes = await getRepository("category");
        const subjectRes = await getRepository("subject");
        const levelRes = await getRepository("level");

        setCategories(categoryRes.data || categoryRes);
        setSubjects(subjectRes.data || subjectRes);
        setLevels(levelRes.data || levelRes);
      } catch (err) {
        console.error("Repository load failed");
      } finally {
        setLoadingRepo(false);
      }
    };

    fetchRepository();
  }, []);

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
              onChange={(e) => updateBook("category", e.target.value)}
            >
              <option value="">Select category</option>
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


          {/* <div className="mb-5">
            <label className="label-dark">
              Book Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter book name"
              className="input-dark"
              value={bookData.bookName}
              onChange={(e) => updateBook("bookName", e.target.value)}
            />

          </div>

      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="label-dark">Subject</label>
              <select
                className="input-dark"
                value={bookData.subject}
                onChange={(e) => updateBook("subject", e.target.value)}
              >
                <option value="">Select subject</option>

                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.text}
                  </option>
                ))}
              </select>

            </div>

            <div>
              <label className="label-dark">Education Level</label>
              <select
                className="input-dark"
                value={bookData.level}
                onChange={(e) => updateBook("educationLevel", e.target.value)}
              >
                <option value="">Select level</option>

                {levels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>
                    {lvl.text}
                  </option>
                ))}
              </select>

            </div>
          </div>

      
          <div>
            <label className="label-dark">Book Thumbnail/Cover</label>
            <div className="flex items-center justify-center gap-4">
              <input
                type="file"
                className="input-dark flex-1"
                placeholder=""
              />
              <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-md text-sm text-white/80 hover:bg-white/10 transition">
                ⬆ Upload Thumbnail
              </button>
            </div>
          </div> */}


          {/* UPLOAD BUTTON – BOOK INFORMATION */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUploadBook}
              className="flex items-center gap-2 px-6 py-3
      bg-primaryBlue hover:bg-primaryBlue/90
      text-white font-medium rounded-lg transition"
            >
              ⬆ Upload Book
            </button>
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
              onClick={() => setShowChapterModal(true)}
              className="flex items-center gap-2 px-4 py-2 
     bg-primaryBlue text-white rounded-md"
            >
              + Add Chapter
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
               bg-primaryBlue hover:bg-primaryBlue
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
