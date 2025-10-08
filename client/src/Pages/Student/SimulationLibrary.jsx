import { useState } from "react";
import { FaTh, FaList, FaFilter, FaTimes } from "react-icons/fa";
import SimulationModal from "./SimulationModal";
import StudentSidebar from "./StudentSidebar";

const categories = [
  {
    subject: "Physics",
    topics: [
      "Motion",
      "Sound & Waves",
      "Work, Energy & Power",
      "Heat & Thermo",
      "Quantum Phenomena",
      "Light & Radiation",
      "Electricity, Magnets & Circuits",
    ],
  },
  {
    subject: "Math & Statistics",
    topics: ["Math Concepts", "Math Applications"],
  },
  {
    subject: "Chemistry",
    topics: ["General Chemistry", "Quantum Chemistry"],
  },
  {
    subject: "Earth & Space",
    topics: ["Astronomy", "Geology"],
  },
];

const gradelevel = [
  "Elementary School",
  "Middle School",
  "High School",
  "University",
];

const books = [
  {
    id: 1,
    title: "Quantum Coin Toss",
    subject: "Physics",
    topic: "Quantum Phenomena",
    grade: "High School",
    image: "/Screenshot 2025-10-01 101447.png",
    url: "https://phet.colorado.edu/sims/html/quantum-coin-toss/latest/quantum-coin-toss_en.html",
  },
  {
    id: 2,
    title: "Number Pairs",
    subject: "Math & Statistics",
    topic: "Math Concepts",
    grade: "Middle School",
    image:
      "https://phet.colorado.edu/sims/html/number-pairs/latest/number-pairs-420.png",
    url: "https://phet.colorado.edu/sims/html/quantum-measurement/latest/quantum-measurement_en.html",
  },
  {
    id: 3,
    title: "Quantum Measurement",
    subject: "Physics",
    topic: "Work, Energy & Power",
    grade: "University",
    image:
      "https://phet.colorado.edu/sims/html/quantum-measurement/latest/quantum-measurement-420.png",
    url: "https://phet.colorado.edu/sims/html/states-of-matter/latest/states-of-matter_en.html",
  },
  {
    id: 4,
    title: "Models of the Hydrogen Atom",
    subject: "Chemistry",
    topic: "Quantum Chemistry",
    grade: "High School",
    image:
      "https://phet.colorado.edu/sims/html/models-of-the-hydrogen-atom/latest/models-of-the-hydrogen-atom-420.png",
    url: "https://phet.colorado.edu/sims/html/models-of-the-hydrogen-atom/latest/models-of-the-hydrogen-atom_en.html",
  },
  {
    id: 5,
    title: "Circuit Construction Kit",
    subject: "Physics",
    topic: "Electricity",
    grade: "Middle School",
    image:
      "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc-420.png",
    url: "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html",
  },
  {
    id: 6,
    title: "Balancing Chemical Equations",
    subject: "Chemistry",
    topic: "Equations",
    grade: "High School",
    image:
      "https://phet.colorado.edu/sims/html/balancing-chemical-equations/latest/balancing-chemical-equations-420.png",
    url: "https://phet.colorado.edu/sims/html/balancing-chemical-equations/latest/balancing-chemical-equations_en.html",
  },
  {
    id: 7,
    title: "Projectile Motion",
    subject: "Physics",
    topic: "Motion",
    grade: "High School",
    image:
      "https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion-420.png",
    url: "https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html",
  },
  {
    id: 8,
    title: "Gas Properties",
    subject: "Chemistry",
    topic: "States of Matter",
    grade: "University",
    image:
      "https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties-420.png",
    url: "https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_en.html",
  },
];

export default function SimulationLibrary() {
  const [selectedView, setSelectedView] = useState("grid");
  const [openSimulation, setOpenSimulation] = useState(null);

  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [collapsed, setCollapsed] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);

  const toggleCollapse = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTopicChange = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleGradeChange = (grade) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  // ✅ Apply filters
  const filteredBooks = books.filter((book) => {
    const matchTopic =
      selectedTopics.length === 0 || selectedTopics.includes(book.topic);
    const matchGrade =
      selectedGrades.length === 0 || selectedGrades.includes(book.grade);
    return matchTopic && matchGrade;
  });

  let sortedBooks = [...filteredBooks];
  if (sortOrder === "A-Z")
    sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
  if (sortOrder === "Z-A")
    sortedBooks.sort((a, b) => b.title.localeCompare(a.title));

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white relative">
      {/* Hamburger Icon for Mobile / iPad */}
<div className="absolute top-4 left-4 lg:hidden z-50">
  <button
    onClick={() => setIsSidebarOpen(true)}
    className="text-gray-200 p-2 bg-gray-700 rounded hover:bg-gray-600"
  >
    <FaTh />
  </button>
</div>

      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay for Left Sidebar (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* ✅ Main Content Area */}
      <div className="ml-64 flex-1 min-h-screen bg-gray-900 text-gray-100 relative">
        {/* 🧭 Top Bar */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800 sticky top-0 z-20">
          <h1 className="font-semibold text-lg">
            {filteredBooks.length} results
          </h1>

          <div className="flex items-center space-x-3">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-700 bg-gray-700 text-gray-200 rounded-md px-3 py-1"
            >
              <option value="Newest">Sort by: Newest</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
            </select>

            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedView("grid")}
                className={`p-2 rounded ${
                  selectedView === "grid" ? "bg-gray-700" : "bg-gray-800"
                }`}
              >
                <FaTh />
              </button>
              <button
                onClick={() => setSelectedView("list")}
                className={`p-2 rounded ${
                  selectedView === "list" ? "bg-gray-700" : "bg-gray-800"
                }`}
              >
                <FaList />
              </button>
              <button
                onClick={() => setFilterSidebarOpen(true)}
                className="p-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                <FaFilter />
              </button>
            </div>
          </div>
        </div>

        {/* 📘 Books Section */}
        <div
          className={`p-6 grid gap-6 ${
            selectedView === "grid"
              ? "sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {sortedBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => setOpenSimulation(book.url)}
              className={`bg-gray-800 rounded-lg shadow hover:shadow-xl hover:bg-gray-700 transition cursor-pointer ${
                selectedView === "list" ? "flex items-center p-4" : ""
              }`}
            >
              <img
                src={book.image}
                alt={book.title}
                className={`${
                  selectedView === "list"
                    ? "w-24 h-16 rounded"
                    : "w-full h-40 rounded-t-lg"
                } object-cover`}
              />
              <div className={`${selectedView === "list" ? "ml-4" : "p-4"}`}>
                <h3 className="font-semibold text-gray-100">{book.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Right Filter Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-gray-800 border-l border-gray-700 transform ${
          filterSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="font-bold text-lg">Filters</h2>
          <button
            onClick={() => setFilterSidebarOpen(false)}
            className="text-gray-400 hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-3rem)]">
          <h3 className="font-semibold mb-3 text-gray-200">Subjects</h3>
          {categories.map((cat) => (
            <div key={cat.subject} className="mb-3">
              <button
                onClick={() => toggleCollapse(cat.subject)}
                className="w-full flex justify-between items-center font-semibold text-gray-300"
              >
                {cat.subject}
                <span>{collapsed[cat.subject] ? "+" : "-"}</span>
              </button>
              {!collapsed[cat.subject] && (
                <div className="ml-3 mt-2 space-y-1">
                  {cat.topics.map((topic) => (
                    <label
                      key={topic}
                      className="flex items-center space-x-2 text-gray-400"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox text-blue-500"
                        checked={selectedTopics.includes(topic)}
                        onChange={() => handleTopicChange(topic)}
                      />
                      <span>{topic}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <h3 className="font-semibold mt-4 mb-2 text-gray-200">Grade Level</h3>
          {gradelevel.map((grade) => (
            <label
              key={grade}
              className="flex items-center space-x-2 text-gray-400"
            >
              <input
                type="checkbox"
                className="form-checkbox text-green-500"
                checked={selectedGrades.includes(grade)}
                onChange={() => handleGradeChange(grade)}
              />
              <span>{grade}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Overlay for Right Filter Sidebar */}
      {filterSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20"
          onClick={() => setFilterSidebarOpen(false)}
        ></div>
      )}

      {/* 🪟 Simulation Modal */}
      <SimulationModal
        url={openSimulation}
        onClose={() => setOpenSimulation(null)}
      />
    </div>
  );
}
