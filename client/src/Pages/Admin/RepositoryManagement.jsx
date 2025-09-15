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
import { useState, useEffect } from "react";
import Sidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
const API_URL = import.meta.env.VITE_API_URL;

export default function RepositoryManagement() {
  const [resourceTypes, setResourceTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);

  const [newValue, setNewValue] = useState("");
  const [activeField, setActiveField] = useState("");
  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await fetch(`${API_URL}/repository`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch repository");
        const data = await res.json();
        const repo = data[0];

        setResourceTypes(repo.ResourceTypes ? repo.ResourceTypes.split(",") : []);
        setSubjects(repo.Subjects ? repo.Subjects.split(",") : []);
        setLevels(repo.EducationLevels ? repo.EducationLevels.split(",") : []);
        setLanguages(repo.Languages ? repo.Languages.split(",") : []);
        setCategories(repo.Categories ? repo.Categories.split(",") : []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRepo();
  }, []);

  const addValue = async (type) => {
    if (!newValue.trim()) return;

    try {
      const res = await fetch(`${API_URL}/repository`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type, value: newValue }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();

      // ✅ Update frontend arrays from backend response
      setResourceTypes(data.ResourceTypes ? data.ResourceTypes.split(",") : []);
      setSubjects(data.Subjects ? data.Subjects.split(",") : []);
      setLevels(data.EducationLevels ? data.EducationLevels.split(",") : []);
      setLanguages(data.Languages ? data.Languages.split(",") : []);
      setCategories(data.Categories ? data.Categories.split(",") : []);

      setNewValue(""); // clear input
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 bg-[#0f1017] min-h-screen p-6 text-white">
        <AdminNavbar />
        <h1 className="text-3xl font-bold mb-8">📚 Repository Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card title="Resource Types" color="blue" items={resourceTypes} activeField={activeField} newValue={newValue} setActiveField={setActiveField} setNewValue={setNewValue} onAdd={() => addValue("resource")} placeholder="Add new type" />
          <Card title="Subjects" color="green" items={subjects} activeField={activeField} newValue={newValue} setActiveField={setActiveField} setNewValue={setNewValue} onAdd={() => addValue("subject")} placeholder="Add new subject" />
          <Card title="Education Levels" color="orange" items={levels} activeField={activeField} newValue={newValue} setActiveField={setActiveField} setNewValue={setNewValue} onAdd={() => addValue("level")} placeholder="Add new level" />
          <Card title="Languages" color="yellow" items={languages} activeField={activeField} newValue={newValue} setActiveField={setActiveField} setNewValue={setNewValue} onAdd={() => addValue("language")} placeholder="Add new language" />
          <Card title="Categories" color="purple" items={categories} activeField={activeField} newValue={newValue} setActiveField={setActiveField} setNewValue={setNewValue} onAdd={() => addValue("category")} placeholder="Add new category" />
        </div>
      </div>
    </div>
  );
}

function Card({ title, color, items, activeField, newValue, setActiveField, setNewValue, onAdd, placeholder }) {
  const colors = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    orange: "bg-orange-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600",
  };

  return (
    <div className="bg-[#1e1f29] p-5 rounded-xl shadow-lg flex flex-col justify-between">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      <ul className="list-disc ml-5 mb-4 space-y-1 text-gray-300">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <div className="flex gap-2 mt-auto">
        <input
          type="text"
          value={activeField === title.toLowerCase().split(" ")[0] ? newValue : ""}
          onChange={(e) => {
            setActiveField(title.toLowerCase().split(" ")[0]);
            setNewValue(e.target.value);
          }}
          placeholder={placeholder}
          className="p-2 rounded text-black flex-1"
        />
        <button onClick={onAdd} className={`${colors[color]} px-3 py-1 rounded text-white`}>
          Add
        </button>
      </div>
    </div>
  );
}
