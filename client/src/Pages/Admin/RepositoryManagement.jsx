// import { useState } from "react";
// import Sidebar from "./AdminSidebar";
// import AdminNavbar from "./AdminNavbar";

// export default function RepositoryManagement() {
//   const [resourceTypes, setResourceTypes] = useState(["PDF","Video","Audio"]);
//   const [subjects, setSubjects] = useState(["Math", "Science"]);
//   const [levels, setLevels] = useState(["Class 1","-----", "Class 12"]);
//   const [languages, setLanguages] = useState(["English", "Hindi"]);
//   const [categories, setCategories] = useState(["School Education"]);

//   const [newValue, setNewValue] = useState("");
//   const [activeField, setActiveField] = useState("");

//   const addValue =async (type) => {
//     if (!newValue.trim()) return;
//     const payload = {
//     Subjects: subjects.join(","),        
//     EducationLevels: levels.join(","),
//     Languages: languages.join(","),
//     Categories: categories.join(","),
//     ResourceTypes: resourceTypes.join(","),
//   };
//     try {
//     const res = await fetch(`${API_URL}`, {
//       method: "POST",
//       body: formData,
//       credentials: "include",
    
//     });
//     console.log("Saved to backend:", payload);
//     if (type === "resource") setResourceTypes([...resourceTypes, newValue]);
//     if (type === "subject") setSubjects([...subjects, newValue]);
//     if (type === "level") setLevels([...levels, newValue]);
//     if (type === "language") setLanguages([...languages, newValue]);
//     if (type === "category") setCategories([...categories, newValue]);
//   } catch (err) {
//     console.error("API error:", err);
//     alert("Failed to save");
//   }

//   setNewValue("");
// };

//   return (
//     <div className="flex">
//       <Sidebar />

//       <div className="ml-64 flex-1 bg-[#0f1017] min-h-screen p-6 text-white">
//         <AdminNavbar />
//         <h1 className="text-3xl font-bold mb-8">📚 Repository Management</h1>

//         {/* Grid layout for cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {/* Resource Types Card */}
//           <Card
//             title="Resource Types"
//             color="blue"
//             items={resourceTypes}
//             activeField={activeField}
//             newValue={newValue}
//             setActiveField={setActiveField}
//             setNewValue={setNewValue}
//             onAdd={() => addValue("resource")}
//             placeholder="Add new type"
//           />

//           {/* Subjects Card */}
//           <Card
//             title="Subjects"
//             color="green"
//             items={subjects}
//             activeField={activeField}
//             newValue={newValue}
//             setActiveField={setActiveField}
//             setNewValue={setNewValue}
//             onAdd={() => addValue("subject")}
//             placeholder="Add new subject"
//           />

//           {/* Levels Card */}
//           <Card
//             title="Education Levels"
//             color="orange"
//             items={levels}
//             activeField={activeField}
//             newValue={newValue}
//             setActiveField={setActiveField}
//             setNewValue={setNewValue}
//             onAdd={() => addValue("level")}
//             placeholder="Add new level"
//           />

//           {/* Languages Card */}
//           <Card
//             title="Languages"
//             color="yellow"
//             items={languages}
//             activeField={activeField}
//             newValue={newValue}
//             setActiveField={setActiveField}
//             setNewValue={setNewValue}
//             onAdd={() => addValue("language")}
//             placeholder="Add new language"
//           />

//           {/* Categories Card */}
//           <Card
//             title="Categories"
//             color="purple"
//             items={categories}
//             activeField={activeField}
//             newValue={newValue}
//             setActiveField={setActiveField}
//             setNewValue={setNewValue}
//             onAdd={() => addValue("category")}
//             placeholder="Add new category"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// /* Reusable Card Component */
// function Card({
//   title,
//   color,
//   items,
//   activeField,
//   newValue,
//   setActiveField,
//   setNewValue,
//   onAdd,
//   placeholder,
// }) {
//   const colors = {
//     blue: "bg-blue-600",
//     green: "bg-green-600",
//     orange: "bg-orange-600",
//     yellow: "bg-yellow-600",
//     purple: "bg-purple-600",
//   };

//   return (
//     <div className="bg-[#1e1f29] p-5 rounded-xl shadow-lg flex flex-col justify-between">
//       <h2 className="text-xl font-semibold mb-3">{title}</h2>

//       <ul className="list-disc ml-5 mb-4 space-y-1 text-gray-300">
//         {items.map((item, i) => (
//           <li key={i}>{item}</li>
//         ))}
//       </ul>

//       <div className="flex gap-2 mt-auto">
//         <input
//           type="text"
//           value={activeField === title.toLowerCase().split(" ")[0] ? newValue : ""}
//           onChange={(e) => {
//             setActiveField(title.toLowerCase().split(" ")[0]);
//             setNewValue(e.target.value);
//           }}
//           placeholder={placeholder}
//           className="p-2 rounded text-black flex-1"
//         />
//         <button
//           onClick={onAdd}
//           className={`${colors[color]} px-3 py-1 rounded text-white`}
//         >
//           Add
//         </button>
//       </div>
//     </div>
//   );
// }













import { useEffect, useState,useRef } from "react";
import Sidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FiMenu } from "react-icons/fi";
const API_URL = import.meta.env.VITE_API_URL;
import { FaTimes } from "react-icons/fa";

export default function RepositoryManagement() {
  const [resourceTypes, setResourceTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [repoName, setRepoName] = useState("");
  const [selected, setSelected] = useState({
    resourceType: "",
    subject: "",
    level: "",
    language: "",
    category: "",
  });

  const [newValue, setNewValue] = useState("");
  const [activeField, setActiveField] = useState("");

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await fetch(`${API_URL}/repository`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch repository");
        const data = await res.json();
        const repo = data[0];
        setResourceTypes(repo.ResourceTypes?.split(",") || []);
        setSubjects(repo.Subjects?.split(",") || []);
        setLevels(repo.EducationLevels?.split(",") || []);
        setLanguages(repo.Languages?.split(",") || []);
        setCategories(repo.Categories?.split(",") || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRepo();
  }, []);

  // ✅ Add new dropdown value (POST)
  const addValue = async (type) => {
    if (!newValue.trim()) return alert("Please enter a value!");
    try {
      const res = await fetch(`${API_URL}/repository`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type, value: newValue }),
      });
      if (!res.ok) throw new Error("Failed to add value");
      const data = await res.json();
      setResourceTypes(data.ResourceTypes?.split(",") || []);
      setSubjects(data.Subjects?.split(",") || []);
      setLevels(data.EducationLevels?.split(",") || []);
      setLanguages(data.Languages?.split(",") || []);
      setCategories(data.Categories?.split(",") || []);
      setNewValue("");
      alert("✅ Added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    }
  };

  // ✅ Create new repository (POST)
  const createRepository = async () => {
    if (!repoName.trim()) return alert("Enter repository name");
    try {
      const res = await fetch(`${API_URL}/repository/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: repoName,
          ...selected,
        }),
      });
      if (!res.ok) throw new Error("Failed to create repository");
      alert("✅ Repository created successfully!");
      setRepoName("");
      setSelected({
        resourceType: "",
        subject: "",
        level: "",
        language: "",
        category: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create repository");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden px-4 mb-4">
          <button onClick={() => setIsSidebarOpen(true)} className="text-white">
            <FiMenu size={28} />
          </button>
        </div>

        <AdminNavbar/>

        <h1 className="text-3xl font-bold mb-8">📘 Create Repository</h1>

        <div className="bg-[#1e1f29] p-6 rounded-xl shadow-lg space-y-5 max-w-6xl">
          {/* Repository Name */}
          {/* <div>
            <label className="block mb-2 font-semibold">Repository Name</label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="Enter repository name"
              className="w-full p-2 rounded text-black"
            />
          </div> */}

          {/* Dropdowns in one grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <DropdownWithAdd
              title="Resource Type"
              items={resourceTypes}
              value={selected.resourceType}
              onChange={(v) => setSelected({ ...selected, resourceType: v })}
              onAdd={() => addValue("resource")}
              placeholder="Add new type"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
            />

            <DropdownWithAdd
              title="Subject"
              items={subjects}
              value={selected.subject}
              onChange={(v) => setSelected({ ...selected, subject: v })}
              onAdd={() => addValue("subject")}
              placeholder="Add new subject"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
            />

            <DropdownWithAdd
              title="Education Level"
              items={levels}
              value={selected.level}
              onChange={(v) => setSelected({ ...selected, level: v })}
              onAdd={() => addValue("level")}
              placeholder="Add new level"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
            />

            <DropdownWithAdd
              title="Language"
              items={languages}
              value={selected.language}
              onChange={(v) => setSelected({ ...selected, language: v })}
              onAdd={() => addValue("language")}
              placeholder="Add new language"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
            />

            <DropdownWithAdd
              title="Category"
              items={categories}
              value={selected.category}
              onChange={(v) => setSelected({ ...selected, category: v })}
              onAdd={() => addValue("category")}
              placeholder="Add new category"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
            />
          </div>

          {/* Create Button
          <button
            onClick={createRepository}
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-white font-semibold"
          >
            Create Repository
          </button> */}
        </div>
      </main>
    </div>
  );
}

// ✅ Updated DropdownWithAdd with delete option
function DropdownWithAdd({
  title,
  items,
  value,
  onChange,
  onAdd,
  placeholder,
  newValue,
  setNewValue,
  activeField,
  setActiveField,
  onDelete,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block mb-1 font-semibold text-gray-300">{title}</label>
      <div
        className="bg-gray-800 p-2 rounded-lg cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || `Select ${title}`}</span>
        <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
          {/* Options */}
          {items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center px-3 py-2 hover:bg-gray-600 cursor-pointer"
            >
              <span
                onClick={() => {
                  onChange(item);
                  setIsOpen(false);
                }}
              >
                {item}
              </span>
              <FaTimes
                className="text-red-400 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent selecting while deleting
                  onDelete(item);
                }}
              />
            </div>
          ))}

          {/* Add new input */}
          <div className="flex gap-2 p-2 border-t border-gray-600">
            <input
              type="text"
              placeholder={placeholder}
              value={activeField === title.toLowerCase() ? newValue : ""}
              onChange={(e) => {
                setActiveField(title.toLowerCase());
                setNewValue(e.target.value);
              }}
              className="flex-1 p-2 rounded-lg text-black"
            />
            <button
              onClick={onAdd}
              className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-white"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}









