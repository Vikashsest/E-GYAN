
// import { useEffect, useState,useRef } from "react";
// import Sidebar from "./AdminSidebar";
// import AdminNavbar from "./AdminNavbar";
// import { FiMenu } from "react-icons/fi";
// const API_URL = import.meta.env.VITE_API_URL;
// import { MdDelete } from "react-icons/md";
// import { FaEdit } from "react-icons/fa";
// import { getRepository, addRepositoryValue, createRepository } from '../../apiServices/apiRepository';

// export default function RepositoryManagement() {
//   const [resourceTypes, setResourceTypes] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [levels, setLevels] = useState([]);
//   const [languages, setLanguages] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const [repoName, setRepoName] = useState("");
//   const [selected, setSelected] = useState({
//     resourceType: "",
//     subject: "",
//     level: "",
//     language: "",
//     category: "",
//   });

//   const [newValue, setNewValue] = useState("");
//   const [activeField, setActiveField] = useState("");

//   useEffect(() => {
//   getRepository()
//     .then(data => {
//       const repo = data[0];
//       setResourceTypes(repo.ResourceTypes?.split(",") || []);
//       setSubjects(repo.Subjects?.split(",") || []);
//       setLevels(repo.EducationLevels?.split(",") || []);
//       setLanguages(repo.Languages?.split(",") || []);
//       setCategories(repo.Categories?.split(",") || []);
//     })
//     .catch(err => console.error(err));
// }, []);

// // Add new value
// const addValue = async (type) => {
//   if (!newValue.trim()) return alert("Enter a value!");
//   try {
//     const data = await addRepositoryValue(type, newValue);
//     setResourceTypes(data.ResourceTypes?.split(",") || []);
//     setSubjects(data.Subjects?.split(",") || []);
//     setLevels(data.EducationLevels?.split(",") || []);
//     setLanguages(data.Languages?.split(",") || []);
//     setCategories(data.Categories?.split(",") || []);
//     setNewValue("");
//     alert("Added successfully!");
//   } catch (err) {
//     alert("Failed to add value");
//   }
// };

// // Create repository
// const handleCreateRepository = async () => {
//   if (!repoName.trim()) return alert("Enter repository name");
//   try {
//     await createRepository({ name: repoName, ...selected });
//     alert("Repository created successfully!");
//     setRepoName("");
//     setSelected({ resourceType: "", subject: "", level: "", language: "", category: "" });
//   } catch (err) {
//     alert("Failed to create repository");
//   }
// };
//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       {/* Sidebar */}
//       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

//       {/* Main Content */}
//       <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
//         {/* Mobile Menu Icon */}
//         <div className="lg:hidden px-4 mb-4">
//           <button onClick={() => setIsSidebarOpen(true)} className="text-white">
//             <FiMenu size={28} />
//           </button>
//         </div>

//         <AdminNavbar/>

//         <h1 className="text-3xl font-bold mb-8">📘 Create Repository</h1>

//         <div className="bg-[#1e1f29] p-6 rounded-xl shadow-lg space-y-5 max-w-6xl">
//           {/* Repository Name */}
//           {/* <div>
//             <label className="block mb-2 font-semibold">Repository Name</label>
//             <input
//               type="text"
//               value={repoName}
//               onChange={(e) => setRepoName(e.target.value)}
//               placeholder="Enter repository name"
//               className="w-full p-2 rounded text-black"
//             />
//           </div> */}

//           {/* Dropdowns in one grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <DropdownWithAdd
//               title="Category"
//               items={categories}
//               value={selected.category}
//               onChange={(v) => setSelected({ ...selected, category: v })}
//               onAdd={() => addValue("category")}
//               onDelete={(item) => {
//                 setCategories(prev => prev.filter(i => i !== item));
//               }}
//               placeholder="Add new category"
//               newValue={newValue}
//               setNewValue={setNewValue}
//               activeField={activeField}
//               setActiveField={setActiveField}
//             />

//             <DropdownWithAdd
//               title="Education Level"
//               items={levels}
//               value={selected.level}
//               onChange={(v) => setSelected({ ...selected, level: v })}
//               onAdd={() => addValue("level")}
//               onDelete={(item) => {
//                 setLevels(prev => prev.filter(i => i !== item));
//               }}
//               placeholder="Add new level"
//               newValue={newValue}
//               setNewValue={setNewValue}
//               activeField={activeField}
//               setActiveField={setActiveField}
//             />

//              <DropdownWithAdd
//               title="Subject"
//               items={subjects}
//               value={selected.subject}
//               onChange={(v) => setSelected({ ...selected, subject: v })}
//               onAdd={() => addValue("subject")}
//               onDelete={(item) => {
//                 setSubjects(prev => prev.filter(i => i !== item));
//               }}
//               placeholder="Add new subject"
//               newValue={newValue}
//               setNewValue={setNewValue}
//               activeField={activeField}
//               setActiveField={setActiveField}
//             />

//             <DropdownWithAdd
//               title="Resource Type"
//               items={resourceTypes}
//               value={selected.resourceType}
//               onChange={(v) => setSelected({ ...selected, resourceType: v })}
//               onAdd={() => addValue("resource")}
//               onDelete={(item) => {
//                 setResourceTypes(prev => prev.filter(i => i !== item));
//               }}
//               placeholder="Add new type"
//               newValue={newValue}
//               setNewValue={setNewValue}
//               activeField={activeField}
//               setActiveField={setActiveField}
//             />

//             <DropdownWithAdd
//               title="Language"
//               items={languages}
//               value={selected.language}
//               onChange={(v) => setSelected({ ...selected, language: v })}
//               onAdd={() => addValue("language")}
//               onDelete={(item) => {
//                 setLanguages(prev => prev.filter(i => i !== item));
//               }}
//               placeholder="Add new language"
//               newValue={newValue}
//               setNewValue={setNewValue}
//               activeField={activeField}
//               setActiveField={setActiveField}
//             />

//           </div>

//           {/* Create Button
//           <button
//             onClick={createRepository}
//             className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-white font-semibold"
//           >
//             Create Repository
//           </button> */}
//         </div>
//       </main>
//     </div>
//   );
// }




// function DropdownWithAdd({
//   title,
//   items,
//   value,
//   onChange,
//   onAdd,
//   placeholder,
//   newValue,
//   setNewValue,
//   activeField,
//   setActiveField,
//   onDelete,
// }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [editIndex, setEditIndex] = useState(null); // <-- NEW
//   const dropdownRef = useRef(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//         setEditIndex(null); 
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleAddOrUpdate = () => {
//     if (!newValue.trim()) return alert("Please enter a value!");

//     if (editIndex !== null) {
//       // UPDATE MODE
//       const updated = [...items];
//       updated[editIndex] = newValue;
//       onChange(updated[editIndex]);
//       setEditIndex(null);
//       alert("Updated successfully!");
//     } else {
//       // ADD MODE
//       onAdd();
//     }

//     setNewValue("");
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <label className="block mb-2 font-semibold text-gray-300">{title}</label>

//       <div
//         className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-lg cursor-pointer flex justify-between items-center shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className={`${value ? "text-white" : "text-gray-300"}`}>
//           {value || `Select ${title}`}
//         </span>
//         <span className="text-gray-200">{isOpen ? "▲" : "▼"}</span>
//       </div>

//       {isOpen && (
//         <div className="absolute z-50 mt-1 w-full bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-auto ring-1 ring-gray-600">

//           {items.length > 0 ? (
//             items.map((item, i) => (
//               <div
//                 key={i}
//                 className="flex justify-between items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"
//               >
//                 <span
//                   onClick={() => {
//                     onChange(item);
//                     setIsOpen(false);
//                   }}
//                   className="text-white"
//                 >
//                   {item}
//                 </span>

//                 <div className="flex gap-3">
//                   {/* EDIT BUTTON */}
//                   <FaEdit
//                     className="text-yellow-400 text-lg hover:text-yellow-600"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setEditIndex(i);
//                       setActiveField(title.toLowerCase());
//                       setNewValue(item);
//                     }}
//                   />

//                   {/* DELETE BUTTON */}
//                   <MdDelete
//                     className="text-red-500 rounded-lg text-2xl hover:text-red-600"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onDelete(item);
//                     }}
//                   />
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="px-4 py-2 text-gray-400">No options available</div>
//           )}

//           {/* Add / Edit Input Section */}
//           <div className="flex gap-2 p-3 border-t border-gray-600">
//             <input
//               type="text"
//               placeholder={placeholder}
//               value={activeField === title.toLowerCase() ? newValue : ""}
//               onChange={(e) => {
//                 setActiveField(title.toLowerCase());
//                 setNewValue(e.target.value);
//               }}
//               className="flex-1 p-2 rounded-lg text-black"
//             />

//             <button
//               onClick={handleAddOrUpdate}
//               className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white font-semibold"
//             >
//               {editIndex !== null ? "Update" : "Add"}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }











import { useEffect, useState, useRef } from "react";
import Sidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FiMenu } from "react-icons/fi";
const API_URL = import.meta.env.VITE_API_URL;
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { getRepository, addRepositoryValue, createRepository } from '../../apiServices/apiRepository';

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
    getRepository()
      .then(data => {
        const repo = data[0];
        setResourceTypes(repo.ResourceTypes?.split(",") || []);
        setSubjects(repo.Subjects?.split(",") || []);
        setLevels(repo.EducationLevels?.split(",") || []);
        setLanguages(repo.Languages?.split(",") || []);
        setCategories(repo.Categories?.split(",") || []);
      })
      .catch(err => console.error(err));
  }, []);

  // Add new value
  const addValue = async (type) => {
    if (!newValue.trim()) return alert("Enter a value!");
    try {
      const data = await addRepositoryValue(type, newValue);
      setResourceTypes(data.ResourceTypes?.split(",") || []);
      setSubjects(data.Subjects?.split(",") || []);
      setLevels(data.EducationLevels?.split(",") || []);
      setLanguages(data.Languages?.split(",") || []);
      setCategories(data.Categories?.split(",") || []);
      setNewValue("");
      alert("Added successfully!");
    } catch (err) {
      alert("Failed to add value");
    }
  };

  // Create repository
  const handleCreateRepository = async () => {
    if (!repoName.trim()) return alert("Enter repository name");
    try {
      await createRepository({ name: repoName, ...selected });
      alert("Repository created successfully!");
      setRepoName("");
      setSelected({ resourceType: "", subject: "", level: "", language: "", category: "" });
    } catch (err) {
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

        <AdminNavbar />

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

            {/* 1️⃣ Category */}
            <DropdownWithAdd
              title="Category"
              items={categories}
              value={selected.category}
              onChange={(v) => setSelected({ ...selected, category: v })}
              onAdd={() => addValue("category")}
              onDelete={(item) => setCategories(prev => prev.filter(i => i !== item))}
              placeholder="Add new category"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
            />

            {/* 2️⃣ Education Level (Disabled if no category selected) */}
            <DropdownWithAdd
              title="Education Level"
              items={levels}
              value={selected.level}
              onChange={(v) => setSelected({ ...selected, level: v })}
              onAdd={() => addValue("level")}
              onDelete={(item) => setLevels(prev => prev.filter(i => i !== item))}
              placeholder="Add new level"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
              disabled={!selected.category} // 🔹 disable if category not selected
            />

            {/* 3️⃣ Subject (Disabled if no education level selected) */}
            {/* <DropdownWithAdd
              title="Subject"
              items={subjects}
              value={selected.subject}
              onChange={(v) => setSelected({ ...selected, subject: v })}
              onAdd={() => addValue("subject")}
              onDelete={(item) => setSubjects(prev => prev.filter(i => i !== item))}
              placeholder="Add new subject"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
              disabled={!selected.level} // 🔹 disable if level not selected
            /> */}

            {/* 4️⃣ Resource Type */}
            <DropdownWithAdd
              title="Resource Type"
              items={resourceTypes}
              value={selected.resourceType}
              onChange={(v) => setSelected({ ...selected, resourceType: v })}
              onAdd={() => addValue("resource")}
              onDelete={(item) => setResourceTypes(prev => prev.filter(i => i !== item))}
              placeholder="Add new type"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
            />

            {/* 5️⃣ Language */}
            <DropdownWithAdd
              title="Language"
              items={languages}
              value={selected.language}
              onChange={(v) => setSelected({ ...selected, language: v })}
              onAdd={() => addValue("language")}
              onDelete={(item) => setLanguages(prev => prev.filter(i => i !== item))}
              placeholder="Add new language"
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



export function DropdownWithAdd({
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
  disabled = false, // 🔹 added
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setEditIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddOrUpdate = () => {
    if (!newValue.trim()) return alert("Please enter a value!");

    if (editIndex !== null) {
      const updated = [...items];
      updated[editIndex] = newValue;
      onChange(updated[editIndex]);
      setEditIndex(null);
      alert("Updated successfully!");
    } else {
      onAdd();
    }

    setNewValue("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block mb-2 font-semibold text-gray-300">{title}</label>

      <div
        className={`p-3 rounded-lg cursor-pointer flex justify-between items-center shadow-lg 
        ${disabled ? "bg-gray-700 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-colors"}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`${value ? "text-white" : "text-gray-300"}`}>
          {value || `Select ${title}`}
        </span>
        <span className="text-gray-200">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-auto ring-1 ring-gray-600">
          {items.length > 0 ? (
            items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                <span
                  onClick={() => {
                    onChange(item);
                    setIsOpen(false);
                  }}
                  className="text-white"
                >
                  {item}
                </span>
                <div className="flex gap-3">
                  <FaEdit
                    className="text-yellow-400 text-lg hover:text-yellow-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditIndex(i);
                      setActiveField(title.toLowerCase());
                      setNewValue(item);
                    }}
                  />
                  <MdDelete
                    className="text-red-500 rounded-lg text-2xl hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item);
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-400">No options available</div>
          )}

          <div className="flex gap-2 p-3 border-t border-gray-600">
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
              onClick={handleAddOrUpdate}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white font-semibold"
            >
              {editIndex !== null ? "Update" : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
















