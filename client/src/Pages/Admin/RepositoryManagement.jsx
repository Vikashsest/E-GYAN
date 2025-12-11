

import { useEffect, useState, useRef } from "react";
import Sidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FiMenu } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import {
  getRepository,
  addRepositoryValue,
  updateRepositoryValue,
  deleteRepositoryValue,
} from "../../apiServices/apiRepository";

export default function RepositoryManagement() {
  const [resourceTypes, setResourceTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [books, setBooks] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    Promise.all([
      getRepository("category"),
      getRepository("level"),
      getRepository("subject"),
      getRepository("book"),
      getRepository("resource"),
      getRepository("language"),
    ])
      .then(([categories, levels, subjects, booksData, resources, languages]) => {
        setTexts(categories);
        setLevels(levels);
        setSubjects(subjects);
        setBooks(booksData); // uncomment this line
        setResourceTypes(resources); // make sure resources are objects {id,text}
        setLanguages(languages); // objects {id,text}
      })
      .finally(() => setLoading(false));
  }, []);


  const addValue = async (field) => {
    if (!newValue.trim()) return alert("Enter a value first!");
    try {
      const newItem = await addRepositoryValue(newValue, field); // send type
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
          setBooks((prev) => [...prev, newItem]);
          break;
        case "resource":
          setResourceTypes((prev) => [...prev, newItem]);
          break;
        case "language":
          setLanguages((prev) => [...prev, newItem]);
          break;
      }
      setNewValue("");
      alert("Added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add value");
    }
  };

  const deleteValue = async (field, id) => {
    if (!confirm(`Delete this item?`)) return;
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
          setBooks((prev) => prev.filter((i) => i.id !== id));
          break;
        case "resource":
          setResourceTypes((prev) => prev.filter((i) => i.id !== id));
          break;
        case "language":
          setLanguages((prev) => prev.filter((i) => i.id !== id));
          break;
      }
      alert("Deleted successfully!");
    } catch {
      alert("Failed to delete!");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
        <div className="lg:hidden px-4 mb-4">
          <button onClick={() => setIsSidebarOpen(true)} className="text-white">
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
              onChange={(v) => setSelected({ ...selected, category: v })}
              onAdd={() => addValue("category")}
              onDelete={(item) => deleteValue("category", item)}
              placeholder="Add new category"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
            />

            {/* Education Level */}
            <DropdownWithAdd
              title="Education Level"
              items={levels}
              value={selected.level}
              onChange={(v) => setSelected({ ...selected, level: v })}
              onAdd={() => addValue("level")}
              onDelete={(item) => deleteValue("level", item)}
              placeholder="Add new level"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
              disabled={!selected.category}
            />

            {/* Subject */}
            <DropdownWithAdd
              title="Subject"
              items={subjects}
              value={selected.subject}
              onChange={(v) => setSelected({ ...selected, subject: v })}
              onAdd={() => addValue("subject")}
              onDelete={(item) => deleteValue("subject", item)}
              placeholder="Add new subject"
              newValue={newValue}
              setNewValue={setNewValue}
              activeField={activeField}
              setActiveField={setActiveField}
              disabled={!selected.level}
            />

            {/* Books Dropdown */}
            <DropdownWithAdd
              title="Books"
              items={books}
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
      <label className="block mb-2 font-semibold text-gray-300">{title}</label>

      <div
        className={`p-3 rounded-lg cursor-pointer flex justify-between items-center shadow-lg ${disabled
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-colors"
          }`}
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
            items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                <span
                  onClick={() => {
                    onChange(item.text); // selected me sirf text rakhna
                    setIsOpen(false);
                  }}
                  className="text-white"
                >
                  {item.text}
                </span>
                <div className="flex gap-3">
                  <FaEdit
                    className="text-yellow-400 text-lg hover:text-yellow-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditIndex(item.id);
                      setActiveField(title.toLowerCase());
                      setNewValue(item.text);
                    }}
                  />
                  <MdDelete
                    className="text-red-500 rounded-lg text-2xl hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id); // id send to backend
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



       