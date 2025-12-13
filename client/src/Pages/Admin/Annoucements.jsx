// import { useState } from "react";
// import Sidebar from "./AdminSidebar";
// import AdminNavbar from "./AdminNavbar";
// import { FiMenu } from "react-icons/fi";

// export default function AdminAnnouncements() {
//   const [announcements, setAnnouncements] = useState([
//     { id: 1, text: "Welcome to the new academic year!", date: "2025-09-23", important: true },
//     { id: 2, text: "Library will remain closed on 25th Dec.", date: "2025-09-20", important: false },
//     { id: 3, text: "New courses have been added to the curriculum.", date: "2025-09-22", important: false },
//   ]);

//   const [newAnnouncement, setNewAnnouncement] = useState("");
//   const [isImportant, setIsImportant] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [editModal, setEditModal] = useState({ open: false, id: null, text: "", important: false });

//   const handleAddAnnouncement = (e) => {
//     e.preventDefault();
//     if (!newAnnouncement.trim()) return;

//     const today = new Date().toISOString().split("T")[0];
//     const newAnn = {
//       id: announcements.length + 1,
//       text: newAnnouncement,
//       date: today,
//       important: isImportant,
//     };
//     setAnnouncements([newAnn, ...announcements]);
//     setNewAnnouncement("");
//     setIsImportant(false);
//   };

//   const handleDelete = (id) => {
//     setAnnouncements(announcements.filter((ann) => ann.id !== id));
//   };

//   const openEditModal = (ann) => {
//     setEditModal({ open: true, id: ann.id, text: ann.text, important: ann.important });
//   };

//   const handleUpdate = (e) => {
//     e.preventDefault();
//     setAnnouncements(
//       announcements.map((ann) =>
//         ann.id === editModal.id ? { ...ann, text: editModal.text, important: editModal.important } : ann
//       )
//     );
//     setEditModal({ open: false, id: null, text: "", important: false });
//   };

//   return (
//      <div className="flex min-h-screen bg-[#1e1f2b] text-white">
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

//         <div className="p-2 mb-5">
//           <h1 className="text-3xl font-bold mb-2">Announcements</h1>
//           <p className="text-gray-400">Manage all library announcements here.</p>
//         </div>

//         {/* Add Announcement */}
//         <section className="mb-8 bg-[#2a2b39] p-5 rounded-lg shadow">
//           <form onSubmit={handleAddAnnouncement} className="flex flex-col md:flex-row gap-2 md:items-center">
//             <input
//               type="text"
//               value={newAnnouncement}
//               onChange={(e) => setNewAnnouncement(e.target.value)}
//               placeholder="Write a new announcement..."
//               className="flex-1 p-3 rounded border border-gray-600 bg-[#1e1f2b] text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//             <label className="flex items-center gap-2 text-gray-200 mt-2 md:mt-0">
//               <input
//                 type="checkbox"
//                 checked={isImportant}
//                 onChange={(e) => setIsImportant(e.target.checked)}
//                 className="accent-blue-600"
//               />
//               Important
//             </label>
//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded font-semibold transition"
//             >
//               Add
//             </button>
//           </form>
//         </section>

//         {/* Announcements List */}
//         <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {announcements.map((ann) => (
//             <div
//               key={ann.id}
//               className="bg-[#2a2b39] p-5 rounded-lg shadow hover:shadow-xl transition relative"
//             >
//               {ann.important && (
//                 <span className="absolute top-2 right-3 bg-blue-600 text-white px-2 py-1 text-xs rounded-full font-semibold">
//                   IMPORTANT
//                 </span>
//               )}
//               <p className="text-gray-200 mb-2">{ann.text}</p>
//               <p className="text-gray-400 text-sm">📅 {ann.date}</p>
//               <div className="mt-3 flex gap-2">
//                 <button
//                   onClick={() => openEditModal(ann)}
//                   className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white text-sm"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(ann.id)}
//                   className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </section>

//         {/* Edit Modal */}
//         {editModal.open && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//             <div className="bg-white text-black p-6 rounded w-full max-w-md shadow-lg">
//               <h3 className="text-xl font-semibold mb-4">Edit Announcement</h3>
//               <form onSubmit={handleUpdate} className="flex flex-col gap-3">
//                 <textarea
//                   value={editModal.text}
//                   onChange={(e) => setEditModal({ ...editModal, text: e.target.value })}
//                   className="w-full p-3 border border-gray-400 rounded"
//                 />
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={editModal.important}
//                     onChange={(e) => setEditModal({ ...editModal, important: e.target.checked })}
//                     className="accent-blue-600"
//                   />
//                   Important
//                 </label>
//                 <div className="flex justify-end gap-4 mt-2">
//                   <button
//                     type="button"
//                     onClick={() => setEditModal({ open: false, id: null, text: "", important: false })}
//                     className="border border-black px-4 py-2 rounded"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
//                   >
//                     Update
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }









import { useState, useEffect } from "react";
import Sidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FiMenu } from "react-icons/fi";
import {
  getAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from "../../apiServices/announcementsApi";
import { confirmDelete } from "../../utils/confirmDelete";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, id: null, text: "", });


  // 👉 Load data from API
  useEffect(() => {
    async function loadData() {
      const data = await getAnnouncements();
      setAnnouncements(data);
    }
    loadData();
  }, []);

  // 👉 Add Announcement API
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;

    const payload = { text: newAnnouncement };
    const created = await addAnnouncement(payload);

    setAnnouncements([created, ...announcements]);
    setNewAnnouncement("");
  };

  const handleDelete = async (id) => {
  const ok = await confirmDelete("Are you sure you want to delete this announcement?");
  if (!ok) return;

  await deleteAnnouncement(id);
  setAnnouncements(announcements.filter((ann) => ann.id !== id));
};


  // 👉 Open Edit Modal
  const openEditModal = (ann) => {
    setEditModal({ open: true, id: ann.id, text: ann.text});
  };

  // 👉 Update API
  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      text: editModal.text,
    };

    const updated = await updateAnnouncement(editModal.id, payload);

    setAnnouncements(
      announcements.map((ann) =>
        ann.id === updated.id ? updated : ann
      )
    );

    setEditModal({ open: false, id: null, text: ""});
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

        <div className="p-2 mb-5">
          <h1 className="text-3xl font-bold mb-2">Announcements</h1>
          <p className="text-gray-400">Manage all library announcements here.</p>
        </div>

        {/* Add Announcement */}
        <section className="mb-8 bg-[#2a2b39] p-5 rounded-lg shadow">
          <form onSubmit={handleAddAnnouncement} className="flex flex-col md:flex-row gap-2 md:items-center">
            <input
              type="text"
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              placeholder="Write a new announcement..."
              className="flex-1 p-3 rounded border border-gray-600 bg-[#1e1f2b] text-white"
            />
            {/* <label className="flex items-center gap-2 text-gray-200 mt-2 md:mt-0">
              <input
                type="checkbox"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="accent-blue-600"
              />
              Important
            </label> */}
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded font-semibold">
              Add
            </button>
          </form>
        </section>

        {/* Announcements List */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((ann) => (
            <div key={ann.id} className="bg-[#2a2b39] p-5 rounded-lg shadow hover:shadow-xl transition relative">
              {/* {ann.important && (
                <span className="absolute top-2 right-3 bg-blue-600 text-white px-2 py-1 text-xs rounded-full font-semibold">
                  IMPORTANT
                </span>
              )} */}
              <p className="text-gray-200 mb-2">{ann.text}</p>
              <p className="text-gray-400 text-sm">📅 {new Date(ann.createdAt).toLocaleDateString()}</p>

              <div className="mt-3 flex gap-2">
                <button onClick={() => openEditModal(ann)} className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white text-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(ann.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Edit Modal */}
        {editModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white text-black p-6 rounded w-full max-w-md shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Edit Announcement</h3>

              <form onSubmit={handleUpdate} className="flex flex-col gap-3">
                <textarea
                  value={editModal.text}
                  onChange={(e) => setEditModal({ ...editModal, text: e.target.value })}
                  className="w-full p-3 border border-gray-400 rounded"
                />

                {/* <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editModal.important}
                    onChange={(e) => setEditModal({ ...editModal, important: e.target.checked })}
                    className="accent-blue-600"
                  />
                  Important
                </label> */}

                <div className="flex justify-end gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setEditModal({ open: false, id: null, text: ""})}
                    className="border border-black px-4 py-2 rounded"
                  >
                    Cancel
                  </button>

                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
