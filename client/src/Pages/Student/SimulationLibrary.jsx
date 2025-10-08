import { useState } from "react";
import { FaTh, FaList } from "react-icons/fa";
import SimulationModal from "./SimulationModal";

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
    image: "https://phet.colorado.edu/sims/html/number-pairs/latest/number-pairs-420.png",
    url: "https://phet.colorado.edu/sims/html/quantum-measurement/latest/quantum-measurement_en.html",
  },
  {
    id: 3,
    title: "Quantum Measurement",
    subject: "Physics",
    topic: "Work, Energy & Power",
    grade: "University",
    image: "https://phet.colorado.edu/sims/html/quantum-measurement/latest/quantum-measurement-420.png",
    url: "https://phet.colorado.edu/sims/html/states-of-matter/latest/states-of-matter_en.html",
  },
  {
    id: 4,
    title: "Models of the Hydrogen Atom",
    subject: "Chemistry",
    topic: "Quantum Chemistry",
    grade: "High School",
    image:"https://phet.colorado.edu/sims/html/models-of-the-hydrogen-atom/latest/models-of-the-hydrogen-atom-420.png",
    url: "https://phet.colorado.edu/sims/html/models-of-the-hydrogen-atom/latest/models-of-the-hydrogen-atom_en.html",
  },
  {
    id: 5,
    title: "Circuit Construction Kit",
    subject: "Physics",
    topic: "Electricity",
    grade: "Middle School",
    image: "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc-420.png",
    url: "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html",
  },
  {
    id: 6,
    title: "Balancing Chemical Equations",
    subject: "Chemistry",
    topic: "Equations",
    grade: "High School",
    image: "https://phet.colorado.edu/sims/html/balancing-chemical-equations/latest/balancing-chemical-equations-420.png",
    url: "https://phet.colorado.edu/sims/html/balancing-chemical-equations/latest/balancing-chemical-equations_en.html",
  },
  {
    id: 7,
    title: "Projectile Motion",
    subject: "Physics",
    topic: "Motion",
    grade: "High School",
    image: "https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion-420.png",
    url: "https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html",
  },
  {
    id: 8,
    title: "Gas Properties",
    subject: "Chemistry",
    topic: "States of Matter",
    grade: "University",
    image: "https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties-420.png",
    url: "https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_en.html",
  },
  // {
  //   id: 9,
  //   title: "Forces and Motion Basics",
  //   subject: "Physics",
  //   topic: "Forces",
  //   grade: "Middle School",
  //   image: "https://picsum.photos/300/200?random=9",
  //   url: "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html",
  // },
  // {
  //   id: 10,
  //   title: "Molecule Shapes",
  //   subject: "Chemistry",
  //   topic: "Molecular Geometry",
  //   grade: "High School",
  //   image: "https://picsum.photos/300/200?random=10",
  //   url: "https://phet.colorado.edu/sims/html/molecule-shapes/latest/molecule-shapes_en.html",
  // },
  // {
  //   id: 11,
  //   title: "Wave on a String",
  //   subject: "Physics",
  //   topic: "Sound & Waves",
  //   grade: "High School",
  //   image: "https://picsum.photos/300/200?random=11",
  //   url: "https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_en.html",
  // },
  // {
  //   id: 12,
  //   title: "Energy Skate Park",
  //   subject: "Physics",
  //   topic: "Work, Energy & Power",
  //   grade: "High School",
  //   image: "https://picsum.photos/300/200?random=12",
  //   url: "https://phet.colorado.edu/sims/html/energy-skate-park/latest/energy-skate-park_en.html",
  // },
  // {
  //   id: 13,
  //   title: "Area Builder",
  //   subject: "Math & Statistics",
  //   topic: "Geometry",
  //   grade: "Middle School",
  //   image: "https://picsum.photos/300/200?random=13",
  //   url: "https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_en.html",
  // },
  // {
  //   id: 14,
  //   title: "Molarity",
  //   subject: "Chemistry",
  //   topic: "Solutions",
  //   grade: "High School",
  //   image: "https://picsum.photos/300/200?random=14",
  //   url: "https://phet.colorado.edu/sims/html/molarity/latest/molarity_en.html",
  // },
  // {
  //   id: 15,
  //   title: "Gravity Force Lab",
  //   subject: "Physics",
  //   topic: "Gravitation",
  //   grade: "University",
  //   image: "https://picsum.photos/300/200?random=15",
  //   url: "https://phet.colorado.edu/sims/html/gravity-force-lab/latest/gravity-force-lab_en.html",
  // },
  // {
  //   id: 16,
  //   title: "Plate Tectonics",
  //   subject: "Earth Science",
  //   topic: "Geology",
  //   grade: "High School",
  //   image: "https://picsum.photos/300/200?random=16",
  //   url: "https://phet.colorado.edu/sims/html/plate-tectonics/latest/plate-tectonics_en.html",
  // },
  // {
  //   id: 17,
  //   title: "John Travoltage",
  //   subject: "Physics",
  //   topic: "Static Electricity",
  //   grade: "Middle School",
  //   image: "https://picsum.photos/300/200?random=17",
  //   url: "https://phet.colorado.edu/sims/html/john-travoltage/latest/john-travoltage_en.html",
  // },
  // {
  //   id: 18,
  //   title: "Reactants, Products and Leftovers",
  //   subject: "Chemistry",
  //   topic: "Chemical Reactions",
  //   grade: "High School",
  //   image: "https://picsum.photos/300/200?random=18",
  //   url: "https://phet.colorado.edu/sims/html/reactants-products-and-leftovers/latest/reactants-products-and-leftovers_en.html",
  // },
  // {
  //   id: 19,
  //   title: "Fraction Matcher",
  //   subject: "Math & Statistics",
  //   topic: "Fractions",
  //   grade: "Elementary",
  //   image: "https://picsum.photos/300/200?random=19",
  //   url: "https://phet.colorado.edu/sims/html/fraction-matcher/latest/fraction-matcher_en.html",
  // },
  // {
  //   id: 20,
  //   title: "Build a Molecule",
  //   subject: "Chemistry",
  //   topic: "Atomic Structure",
  //   grade: "High School",
  //   image: "https://picsum.photos/300/200?random=20",
  //   url: "https://phet.colorado.edu/sims/html/build-a-molecule/latest/build-a-molecule_en.html",
  // },
];

export default function SimulationLibrary() {
  const [selectedView, setSelectedView] = useState("grid");
  const [openSimulation, setOpenSimulation] = useState(null);

  // ✅ Filter states
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState([]);

  const [sortOrder, setSortOrder] = useState("Newest");
  const [collapsed, setCollapsed] = useState({});

  const toggleCollapse = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ✅ Handle topic checkbox
  const handleTopicChange = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  // ✅ Handle grade checkbox
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

  if (sortOrder === "A-Z") {
    sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOrder === "Z-A") {
    sortedBooks.sort((a, b) => b.title.localeCompare(a.title));
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4 hidden md:block sticky top-0 h-screen overflow-y-auto">
        {/* SUBJECT FILTERS */}
        <h2 className="font-bold text-lg mb-4 text-gray-200">SUBJECT</h2>
        {categories.map((cat) => (
          <div key={cat.subject} className="mb-4">
            {/* Header clickable */}
            <button
              onClick={() => toggleCollapse(cat.subject)}
              className="w-full flex justify-between items-center font-semibold text-gray-300 focus:outline-none"
            >
              {cat.subject}
              <span className="text-lg font-semibold">
                {collapsed[cat.subject] ? "+" : "-"}
              </span>
            </button>

            {/* Topics (hidden if collapsed) */}
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

        <div className="mt-6">
          <button
            onClick={() => toggleCollapse("Grade Level")}
            className="w-full flex justify-between items-center font-bold text-lg mb-3 text-gray-200 focus:outline-none"
          >
            Grade Level
            <span className="text-2xl font-bold">
              {collapsed["Grade Level"] ? "+" : "-"}
            </span>
          </button>

          {!collapsed["Grade Level"] && (
            <div className="ml-3 mt-2 space-y-1">
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
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <p className="font-semibold text-lg">
            {books.length} results
          </p>
          <div className="flex items-center space-x-4">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-700 bg-gray-800 text-gray-200 rounded-md px-3 py-1"
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
            </div>
          </div>
        </div>

        {selectedView === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedBooks.map((book) => (
              <div
                key={book.id}
                className="bg-gray-800 rounded-lg shadow hover:shadow-xl hover:bg-gray-700 transition cursor-pointer"
                onClick={() => setOpenSimulation(book.url)}
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-100">{book.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-4">
            {sortedBooks.map((book) => (
              <li
                key={book.id}
                className="flex items-center bg-gray-800 hover:bg-gray-700 p-4 rounded-lg shadow cursor-pointer"
                onClick={() => setOpenSimulation(book.url)}
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-24 h-16 object-cover rounded"
                />
                <div className="ml-4">
                  <h3 className="font-semibold">{book.title}</h3>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Modal Component */}
      <SimulationModal
        url={openSimulation}
        onClose={() => setOpenSimulation(null)}
      />
    </div>
  );
}
