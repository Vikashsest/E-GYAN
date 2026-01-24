// import { useEffect, useState, useRef } from "react";
// import Sidebar from "./AdminSidebar";
// import AdminNavbar from "./AdminNavbar";
// import { FiMenu } from "react-icons/fi";
// import { MdDelete } from "react-icons/md";
// import { FaEdit } from "react-icons/fa";
// import {
//   getRepository,
//   addRepositoryValue,
//   updateRepositoryValue,
//   deleteRepositoryValue,
// } from "../../apiServices/apiRepository";
// import fetechSubjects from "../../apiServices/booksApi";
// import { subjectWiseBooks } from "../../apiServices/booksApi";

// export default function RepositoryManagement() {
//   const [resourceTypes, setResourceTypes] = useState([]);
//   const [levels, setLevels] = useState([]);
//   const [languages, setLanguages] = useState([]);
//   const [texts, setTexts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [levelsLoaded, setLevelsLoaded] = useState(false);
//   const [subjects, setSubjects] = useState([]);
//   const [subjectsLoaded, setSubjectsLoaded] = useState(false);
//   const [filteredBooks, setFilteredBooks] = useState([]);
//   const [booksLoaded, setBooksLoaded] = useState(false);

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
//     setLoading(true);

//     Promise.all([getRepository("resource"), getRepository("language")])
//       .then(([resources, languages]) => {
//         setResourceTypes(resources);
//         setLanguages(languages);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const handleCategoryClick = async () => {
//     if (texts.length === 0) {
//       // prevent multiple fetches
//       setLoading(true);
//       try {
//         const categories = await getRepository("category");
//         setTexts(categories); // populate dropdown
//       } catch (err) {
//         console.error("Failed to fetch categories:", err);
//         alert("Failed to load categories");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // const handleLevelClick = async () => {
//   //   if (selected.category === "School Education" && !levelsLoaded) {
//   //     setLoading(true);
//   //     try {
//   //       const data = await getRepository("level"); // fetch level API
//   //       setLevels(data);
//   //       setLevelsLoaded(true); // mark as loaded
//   //     } catch (err) {
//   //       console.error("Failed to fetch levels:", err);
//   //       alert("Failed to load levels");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }
//   // };
//   const handleLevelClick = async () => {
//     if (!selected.category || levelsLoaded) return;

//     setLoading(true);
//     try {
//       const data = await getRepository("level", selected.category);
//       setLevels(data);
//       setLevelsLoaded(true);
//     } catch (err) {
//       console.error("Failed to fetch levels:", err);
//       alert("Failed to load levels");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleSubjectClick = async () => {
//     if (!selected.category || !selected.level) return;
//     if (subjectsLoaded) return;

//     setLoading(true);
//     try {
//       // Fetch subjects from repository API
//       const data = await getRepository("subject", selected.category);
//       setSubjects(data);
//       setSubjectsLoaded(true);
//     } catch (err) {
//       console.error("Failed to fetch subjects:", err);
//       alert("Failed to load subjects");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBooksClick = async () => {
//     if (
//       selected.category === "School Education" &&
//       selected.level &&
//       selected.subject &&
//       !booksLoaded
//     ) {
//       setLoading(true);
//       try {
//         const data = await subjectWiseBooks({
//           className: selected.level,
//           subject: selected.subject,
//           category: selected.category,
//         });

//         // 🔥 ensure dropdown-friendly format
//         const formattedBooks = data.map((book) => ({
//           id: book.id,
//           text: book.bookName || book.title || book.name,
//         }));

//         setFilteredBooks(formattedBooks);
//         setBooksLoaded(true);
//       } catch (err) {
//         console.error("Failed to fetch books:", err);
//         alert("Failed to load books");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleCategoryChange = (value) => {
//     setSelected((prev) => ({
//       ...prev,
//       category: value,
//       level: "", // 🔥 clear selected level
//       subject: "",
//       book: "",
//     }));

//     // 🔥 agar School Education nahi hai → clear level data
//     if (value !== "School Education") {
//       setLevels([]);
//       setLevelsLoaded(false);

//       setSubjects([]); // 🔥 IMPORTANT
//       setSubjectsLoaded(false);

//       setFilteredBooks([]);
//       setBooksLoaded(false);
//     }
//   };

//   const handleLevelChange = (value) => {
//     setSelected((prev) => ({
//       ...prev,
//       level: value,
//       subject: "",
//       book: "",
//     }));

//     setSubjects([]); // 🔥 old subjects clear
//     setSubjectsLoaded(false);

//     setFilteredBooks([]);
//     setBooksLoaded(false);
//   };

//   const handleSubjectChange = (value) => {
//     setSelected((prev) => ({
//       ...prev,
//       subject: value,
//       book: "",
//     }));

//     // 🔥 clear old books
//     setFilteredBooks([]);
//     setBooksLoaded(false);
//   };

//   const addValue = async (field) => {
//     if (!newValue.trim()) return alert("Enter a value first!");

//     try {
//       // 🔥 category decide karo
//       let categoryToSend = null;
//       if (field !== "category") {
//         categoryToSend = selected.category;
//       }

//       const newItem = await addRepositoryValue(newValue, field, categoryToSend);

//       switch (field) {
//         case "category":
//           setTexts((prev) => [...prev, newItem]);
//           break;

//         case "level":
//           setLevels((prev) => [...prev, newItem]);
//           break;

//         case "subject":
//           setSubjects((prev) => [...prev, newItem]);
//           break;

//         case "book":
//           setFilteredBooks((prev) => [...prev, newItem]);
//           break;

//         case "resource":
//           setResourceTypes((prev) => [...prev, newItem]);
//           break;

//         case "language":
//           setLanguages((prev) => [...prev, newItem]);
//           break;
//       }

//       setNewValue("");
//       alert("Added successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add value");
//     }
//   };

//   // const addValue = async (field) => {
//   //   if (!newValue.trim()) return alert("Enter a value first!");
//   //   try {
//   //     const newItem = await addRepositoryValue(newValue, field); // send type
//   //     switch (field) {
//   //       case "category":
//   //         setTexts((prev) => [...prev, newItem]);
//   //         break;
//   //       case "level":
//   //         setLevels((prev) => [...prev, newItem]);
//   //         break;
//   //       case "subject":
//   //         setSubjects((prev) => [...prev, newItem]);
//   //         break;
//   //       case "book":
//   //         setFilteredBooks((prev) => [...prev, newItem]);
//   //         break;
//   //       case "resource":
//   //         setResourceTypes((prev) => [...prev, newItem]);
//   //         break;
//   //       case "language":
//   //         setLanguages((prev) => [...prev, newItem]);
//   //         break;
//   //     }
//   //     setNewValue("");
//   //     alert("Added successfully!");
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("Failed to add value");
//   //   }
//   // };

//   const deleteValue = async (field, id) => {
//     if (!confirm(`Delete this item?`)) return;
//     try {
//       await deleteRepositoryValue(id);
//       switch (field) {
//         case "category":
//           setTexts((prev) => prev.filter((i) => i.id !== id));
//           break;
//         case "level":
//           setLevels((prev) => prev.filter((i) => i.id !== id));
//           break;
//         case "subject":
//           setSubjects((prev) => prev.filter((i) => i.id !== id));
//           break;
//         case "book":
//           setFilteredBooks((prev) => prev.filter((i) => i.id !== id));
//           break;
//         case "resource":
//           setResourceTypes((prev) => prev.filter((i) => i.id !== id));
//           break;
//         case "language":
//           setLanguages((prev) => prev.filter((i) => i.id !== id));
//           break;
//       }
//       alert("Deleted successfully!");
//     } catch {
//       alert("Failed to delete!");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-primaryWhite">
//       <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

//       <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
//         <div className="lg:hidden px-4 mb-4">
//           <button
//             onClick={() => setIsSidebarOpen(true)}
//             className="text-primaryWhite"
//           >
//             <FiMenu size={28} />
//           </button>
//         </div>

//         <AdminNavbar />

//         <h1 className="text-3xl font-bold mb-8">📘 Create Repository</h1>

//         <div className="bg-[#1e1f29] p-6 rounded-xl shadow-lg space-y-5 max-w-6xl">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             {/* Category */}
//             <DropdownWithAdd
//               title="Category"
//               items={texts}
//               value={selected.category}
//               onChange={handleCategoryChange}
//               onAdd={() => addValue("category")}
//               onDelete={(item) => deleteValue("category", item)}
//               placeholder="Add new category"
//               newValue={newValue}
//               setNewValue={setNewValue}
//               activeField={activeField}
//               setActiveField={setActiveField}
//               onClick={handleCategoryClick} // ✅ new prop
//             />

//             <DropdownWithAdd
//               title="Education Level"
//               items={levels}
//               value={selected.level}
//               onChange={handleLevelChange}
//               onAdd={() => addValue("level")}
//               onDelete={(item) => deleteValue("level", item)}
//               placeholder="Add new level"
//               newValue={newValue}
//               setNewValue={setNewValue}
//               activeField={activeField}
//               setActiveField={setActiveField}
//               disabled={!selected.category}
//               onClick={handleLevelClick} // 🔥 lazy load only for School Education
//             />

//             <DropdownWithAdd
//               title="Subject"
//               items={subjects}
//               value={selected.subject}
//               onChange={handleSubjectChange}
//               onAdd={() => addValue("subject")}
//               onDelete={(item) => deleteValue("subject", item)}
//               placeholder="Add new subject"
//               newValue={newValue}
//               setNewValue={setNewValue}
//               activeField={activeField}
//               setActiveField={setActiveField}
//               disabled={!selected.level}
//               onClick={handleSubjectClick} // 🔥
//             />

//             <DropdownWithAdd
//               title="Books"
//               items={filteredBooks}
//               value={selected.book}
//               onChange={(v) => setSelected({ ...selected, book: v })}
//               onAdd={() => addValue("book")}
//               onDelete={(item) => deleteValue("book", item)}
//               placeholder="Add new book"
//               newValue={newValue}
//               setNewValue={setNewValue}
//               activeField={activeField}
//               setActiveField={setActiveField}
//               disabled={!selected.subject}
//               onClick={handleBooksClick} // 🔥 API call here
//             />

//             {/* Language */}
//             <DropdownWithAdd
//               title="Language"
//               items={languages}
//               value={selected.language}
//               onChange={(v) => setSelected({ ...selected, language: v })}
//               onAdd={() => addValue("language")}
//               onDelete={(item) => deleteValue("language", item)}
//               placeholder="Add new language"
//               newValue={newValue}
//               setNewValue={setNewValue}
//               activeField={activeField}
//               setActiveField={setActiveField}
//             />

//             {/* Resource Type */}
//             <DropdownWithAdd
//               title="Resource Type"
//               items={resourceTypes}
//               value={selected.resourceType}
//               onChange={(v) => setSelected({ ...selected, resourceType: v })}
//               onAdd={() => addValue("resource")}
//               onDelete={(item) => deleteValue("resource", item)}
//               placeholder="Add new type"
//               newValue={newValue}
//               setNewValue={setNewValue}
//               activeField={activeField}
//               setActiveField={setActiveField}
//             />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export function DropdownWithAdd({
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
//   disabled = false,
//   onClick,
// }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const dropdownRef = useRef(null);

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

//   const handleAddOrUpdate = async () => {
//     if (!newValue.trim()) return alert("Please enter a value!");

//     try {
//       if (editIndex !== null) {
//         // Find the item by ID
//         const item = items.find((x) => x.id === editIndex);
//         if (!item) {
//           alert("Item not found!");
//           return;
//         }

//         // Call backend API
//         await updateRepositoryValue(item.id, newValue);

//         // Update the local list (parent state) safely
//         const updatedItems = items.map((it) =>
//           it.id === editIndex ? { ...it, text: newValue } : it
//         );

//         // Pass updated list back to parent
//         // onUpdateList?.(updatedItems); // optional: parent can handle updated list

//         // Update selected value in dropdown
//         onChange(newValue);

//         alert("Updated successfully!");
//         setEditIndex(null);
//       } else {
//         // Add new value
//         await onAdd();
//       }

//       setNewValue("");
//     } catch (err) {
//       console.error("handleAddOrUpdate error:", err);
//       alert("Failed to update value");
//     }
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <label className="block mb-2 font-semibold text-gray300">{title}</label>

//       <div
//         className={`p-3 rounded-lg cursor-pointer flex justify-between items-center shadow-lg ${
//           disabled
//             ? "bg-gray700 cursor-not-allowed"
//             : "bg-gradient-to-r from-purple500 to-indigo600  transition-colors"
//         }`}
//         onClick={() => {
//           if (!disabled) {
//             setIsOpen(!isOpen);
//             onClick?.();
//           }
//         }}
//       >
//         <span className={`${value ? "text-primaryWhite" : "text-gray300"}`}>
//           {value || `Select ${title}`}
//         </span>
//         <span className="text-gray-200">{isOpen ? "▲" : "▼"}</span>
//       </div>

//       {isOpen && !disabled && (
//         <div className="absolute z-50 mt-1 w-full bg-gray800 rounded-lg shadow-lg max-h-60 overflow-auto ring-1 ring-gray-600">
//           {items.length > 0 ? (
//             items.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex justify-between items-center px-4 py-2 hover:bg-gray700 cursor-pointer"
//               >
//                 <span
//                   onClick={() => {
//                     onChange(item.text); // selected me sirf text rakhna
//                     setIsOpen(false);
//                   }}
//                   className="text-primaryWhite"
//                 >
//                   {item.text}
//                 </span>
//                 <div className="flex gap-3">
//                   <FaEdit
//                     className="text-primaryYellow text-lg hover:text-primaryOrange"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setEditIndex(item.id);
//                       setActiveField(title.toLowerCase());
//                       setNewValue(item.text);
//                     }}
//                   />
//                   <MdDelete
//                     className="text-primaryRed rounded-lg text-2xl hover:text-darkRed"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onDelete(item.id); // id send to backend
//                     }}
//                   />
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="px-4 py-2 text-gray400">No options available</div>
//           )}

//           <div className="flex gap-2 p-3 border-t border-gray-600">
//             <input
//               type="text"
//               placeholder={placeholder}
//               value={activeField === title.toLowerCase() ? newValue : ""}
//               onChange={(e) => {
//                 setActiveField(title.toLowerCase());
//                 setNewValue(e.target.value);
//               }}
//               className="flex-1 p-2 rounded-lg text-primaryBlack"
//             />

//             <button
//               onClick={handleAddOrUpdate}
//               className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-primaryWhite font-semibold"
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
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { confirmDelete } from "../../utils/confirmDelete";
import { toast } from "react-toastify";

import {
  getRepository,
  addRepositoryValue,
  updateRepositoryValue,
  deleteRepositoryValue,
} from "../../apiServices/apiRepository";
import fetchSubjects from "../../apiServices/booksApi";
import {subjectWiseBooks } from "../../apiServices/booksApi";

export default function RepositoryManagement() {
  const [resourceTypes, setResourceTypes] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [levelsLoaded, setLevelsLoaded] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoaded, setSubjectsLoaded] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [booksLoaded, setBooksLoaded] = useState(false);

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
    setLoading(true);

    Promise.all([getRepository("resource"), getRepository("language")])
      .then(([resources, languages]) => {
        setResourceTypes(resources);
        setLanguages(languages);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = async () => {
    if (texts.length === 0) {
      // prevent multiple fetches
      setLoading(true);
      try {
        const categories = await getRepository("category");
        setTexts(categories); // populate dropdown
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    }
  };

  
  const handleLevelClick = async () => {
    if (!selected.category || levelsLoaded) return;

    setLoading(true);
    try {
      const data = await getRepository("level", selected.category);
      setLevels(data);
      setLevelsLoaded(true);
    } catch (err) {
      console.error("Failed to fetch levels:", err);
      toast.error("Failed to load levels");
    } finally {
      setLoading(false);
    }
  };


const handleSubjectClick = async () => {
  if (subjectsLoaded) return;

  setLoading(true);
  try {
    let data = [];

    // 1️⃣ Try BOOKS API first (if class selected)
    if (selected.level) {
      const res = await fetchSubjects(selected.level);
      console.log("Subjects from fetchSubjects:", res);

      // 👉 Agar books me data mila
      if (Array.isArray(res) && res.length > 0) {
        data = res.map((subject, index) => ({
          id: index,
          text: subject,
        }));
      }
    }

    // 2️⃣ FALLBACK → agar books empty aaye
    if (data.length === 0) {
      console.log("Books empty → fetching from repository");

      const repoRes = await getRepository("subject");
      console.log("Subjects from getRepository:", repoRes);

      const list = Array.isArray(repoRes)
        ? repoRes
        : repoRes?.data || [];

      data = list.map((item) => ({
        id: item._id,
        text: item.text || item.subjectName,
      }));
    }

    setSubjects(data);
    setSubjectsLoaded(true);
  } catch (err) {
    console.error("Failed to fetch subjects:", err);
    toast.error("Failed to load subjects");
  } finally {
    setLoading(false);
  }
};


  const handleBooksClick = async () => {
  if (booksLoaded) return;

  // subject select hona zaroori
  if (!selected.subject) return;

  setLoading(true);
  try {
    let data = [];

    // 1️⃣ FIRST → subjectWiseBooks API
    if (
      selected.category === "School Education" &&
      selected.level &&
      selected.subject
    ) {
      const res = await subjectWiseBooks({
        className: selected.level,
        subject: selected.subject,
        category: selected.category,
      });

      console.log("Books from subjectWiseBooks:", res);

      if (Array.isArray(res) && res.length > 0) {
        data = res.map((book, index) => ({
          id: book.id ?? index,
          text: book.bookName || book.title || book.name,
        }));
      }
    }

    // 2️⃣ FALLBACK → getRepository
    if (data.length === 0) {
      console.log("Books empty → fetching from repository");

      const repoRes = await getRepository("book");
      console.log("Books from getRepository:", repoRes);

      data = repoRes.map((item) => ({
        id: item.id,      // ✅ backend response key
        text: item.text,  // ✅ backend response key
      }));
    }

    setFilteredBooks(data);
    setBooksLoaded(true);
  } catch (err) {
    console.error("Failed to fetch books:", err);
    toast.error("Failed to load books");
  } finally {
    setLoading(false);
  }
};


  const handleCategoryChange = (value) => {
    setSelected((prev) => ({
      ...prev,
      category: value,
      level: "", // 🔥 clear selected level
      subject: "",
      book: "",
    }));

    // 🔥 agar School Education nahi hai → clear level data
    if (value !== "School Education") {
      setLevels([]);
      setLevelsLoaded(false);

      setSubjects([]); // 🔥 IMPORTANT
      setSubjectsLoaded(false);

      setFilteredBooks([]);
      setBooksLoaded(false);
    }
  };

 const handleLevelChange = (value) => {
  setSelected((prev) => ({
    ...prev,
    level: value,
    subject: "",
  }));

  setSubjects([]);
  setSubjectsLoaded(false); 

  setFilteredBooks([]);
  setBooksLoaded(false);
};


  const handleSubjectChange = (value) => {
    setSelected((prev) => ({
      ...prev,
      subject: value,
      book: "",
    }));

    // 🔥 clear old books
    setFilteredBooks([]);
    setBooksLoaded(false);
  };

  const addValue = async (field) => {
    if (!newValue.trim()) return alert("Enter a value first!");

    try {
      // 🔥 category decide karo
      let categoryToSend = null;
      if (field !== "category") {
        categoryToSend = selected.category;
      }

      const newItem = await addRepositoryValue(newValue, field, categoryToSend);

      switch (field) {
        case "category":
          setTexts((prev) => [...prev, newItem]);
          break;

        case "level":
          setLevels((prev) => [...prev, newItem]);
          break;

        case "subject":
          setSubjects((prev) => [...prev, newItem]);
          break;

        case "book":
          setFilteredBooks((prev) => [...prev, newItem]);
          break;

        case "resource":
          setResourceTypes((prev) => [...prev, newItem]);
          break;

        case "language":
          setLanguages((prev) => [...prev, newItem]);
          break;
      }

      setNewValue("");
      toast.success("Added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add value");
    }
  };

  const deleteValue = async (field, id) => {
  const isConfirmed = await confirmDelete(
    "This item will be permanently deleted from the repository."
  );

  if (!isConfirmed) return;

  try {
    await deleteRepositoryValue(id);

    switch (field) {
      case "category":
        setTexts((prev) => prev.filter((i) => i.id !== id));
        break;
      case "level":
        setLevels((prev) => prev.filter((i) => i.id !== id));
        break;
      case "subject":
        setSubjects((prev) => prev.filter((i) => i.id !== id));
        break;
      case "book":
        setFilteredBooks((prev) => prev.filter((i) => i.id !== id));
        break;
      case "resource":
        setResourceTypes((prev) => prev.filter((i) => i.id !== id));
        break;
      case "language":
        setLanguages((prev) => prev.filter((i) => i.id !== id));
        break;
    }

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Item has been deleted successfully.",
      background: "#1e1f2b",
      color: "white",
      timer: 1500,
      showConfirmButton: false,
    });

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: "Failed to delete item.",
      background: "#1e1f2b",
      color: "white",
    });
  }
};


  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-primaryWhite">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
        <div className="lg:hidden px-4 mb-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-primaryWhite"
          >
            <FiMenu size={28} />
          </button>
        </div>

        <AdminNavbar />

        <h1 className="text-3xl font-bold mb-8">📘 Create Repository</h1>

        <div className="bg-[#1e1f29] p-6 rounded-xl shadow-lg space-y-5 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category */}
            <DropdownWithAdd
              title="Category"
              items={texts}
              value={selected.category}
              onChange={handleCategoryChange}
              onAdd={() => addValue("category")}
              onDelete={(item) => deleteValue("category", item)}
              placeholder="Add new category"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
              onClick={handleCategoryClick} // ✅ new prop
            />

            <DropdownWithAdd
              title="Education Level"
              items={levels}
              value={selected.level}
              onChange={handleLevelChange}
              onAdd={() => addValue("level")}
              onDelete={(item) => deleteValue("level", item)}
              placeholder="Add new level"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
              disabled={!selected.category}
              onClick={handleLevelClick} // 🔥 lazy load only for School Education
            />

            <DropdownWithAdd
              title="Subject"
              items={subjects}
              value={selected.subject}
              onChange={handleSubjectChange}
              onAdd={() => addValue("subject")}
              onDelete={(item) => deleteValue("subject", item)}
              placeholder="Add new subject"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
              disabled={!selected.level}
              onClick={handleSubjectClick} // 🔥
            />

            <DropdownWithAdd
              title="Books"
              items={filteredBooks}
              value={selected.book}
              onChange={(v) => setSelected({ ...selected, book: v })}
              onAdd={() => addValue("book")}
              onDelete={(item) => deleteValue("book", item)}
              placeholder="Add new book"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
              disabled={!selected.subject}
              onClick={handleBooksClick} // 🔥 API call here
            />

            {/* Language */}
            <DropdownWithAdd
              title="Language"
              items={languages}
              value={selected.language}
              onChange={(v) => setSelected({ ...selected, language: v })}
              onAdd={() => addValue("language")}
              onDelete={(item) => deleteValue("language", item)}
              placeholder="Add new language"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
            />

            {/* Resource Type */}
            <DropdownWithAdd
              title="Resource Type"
              items={resourceTypes}
              value={selected.resourceType}
              onChange={(v) => setSelected({ ...selected, resourceType: v })}
              onAdd={() => addValue("resource")}
              onDelete={(item) => deleteValue("resource", item)}
              placeholder="Add new type"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
            />
          </div>
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
  disabled = false,
  onClick,
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

  const handleAddOrUpdate = async () => {
    if (!newValue.trim()) return alert("Please enter a value!");

    try {
      if (editIndex !== null) {
        // Find the item by ID
        const item = items.find((x) => x.id === editIndex);
        if (!item) {
          alert("Item not found!");
          return;
        }

        // Call backend API
        await updateRepositoryValue(item.id, newValue);

        // Update the local list (parent state) safely
        const updatedItems = items.map((it) =>
          it.id === editIndex ? { ...it, text: newValue } : it
        );

        // Pass updated list back to parent
        // onUpdateList?.(updatedItems); // optional: parent can handle updated list

        // Update selected value in dropdown
        onChange(newValue);

        alert("Updated successfully!");
        setEditIndex(null);
      } else {
        // Add new value
        await onAdd();
      }

      setNewValue("");
    } catch (err) {
      console.error("handleAddOrUpdate error:", err);
      alert("Failed to update value");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block mb-2 font-semibold text-gray300">{title}</label>

      <div
        className={`p-3 rounded-lg cursor-pointer flex justify-between items-center shadow-lg ${
          disabled
            ? "bg-gray700 cursor-not-allowed"
            : "bg-gradient-to-r from-purple500 to-indigo600  transition-colors"
        }`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            onClick?.();
          }
        }}
      >
        <span className={`${value ? "text-primaryWhite" : "text-gray300"}`}>
          {value || `Select ${title}`}
        </span>
        <span className="text-gray-200">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-gray800 rounded-lg shadow-lg max-h-60 overflow-auto ring-1 ring-gray-600">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray700 cursor-pointer"
              >
                <span
                  onClick={() => {
                    onChange(item.text); // selected me sirf text rakhna
                    setIsOpen(false);
                  }}
                  className="text-primaryWhite"
                >
                  {item.text}
                </span>
                <div className="flex gap-3">
                  <FaEdit
                    className="text-primaryYellow text-lg hover:text-primaryOrange"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditIndex(item.id);
                      setActiveField(title.toLowerCase());
                      setNewValue(item.text);
                    }}
                  />
                  <MdDelete
                    className="text-primaryRed rounded-lg text-2xl hover:text-darkRed"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id); // id send to backend
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray400">No options available</div>
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
              className="flex-1 p-2 rounded-lg text-primaryBlack"
            />

            <button
              onClick={handleAddOrUpdate}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-primaryWhite font-semibold"
            >
              {editIndex !== null ? "Update" : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
