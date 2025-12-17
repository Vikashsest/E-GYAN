import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit2,
  MoreVertical,
  BookOpen,
  FileText,
  Video,
} from "lucide-react";
import { FiMenu } from "react-icons/fi";

import Sidebar from "../Pages/Admin/AdminSidebar";
import AdminNavbar from "../Pages/Admin/AdminNavbar";

import { fetchBooks, deleteBook } from "../apiServices/booksApi";
import { confirmDelete } from "../utils/confirmDelete";
import { useLoader } from "../LoaderContext";
import { toast } from "react-toastify";

export default function ManageBooks() {
  const { setLoading } = useLoader();

  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await fetchBooks();
      setBooks(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const ok = await confirmDelete(
      "Are you sure you want to delete this book?"
    );
    if (!ok) return;

    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Book deleted successfully");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // ================= SEARCH =================
  const filteredBooks = books.filter((book) =>
    `${book.bookName} ${book.subject} ${book.educationLevel}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-darkBg text-primaryWhite">
      {/* SIDEBAR */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
        {/* MOBILE MENU */}
        <div className="lg:hidden mb-4">
          <button onClick={() => setIsSidebarOpen(true)}>
            <FiMenu size={28} />
          </button>
        </div>

        {/* NAVBAR */}
        <AdminNavbar />

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Manage Books</h1>
          <p className="text-gray-400">
            View, edit and organize your book collection
          </p>
        </div>

        {/* SEARCH & FILTER */}
        <div className="bg-cardBg p-4 rounded-lg shadow mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books..."
              className="w-full pl-10 pr-4 py-2 bg-darkBg border border-gray-600 rounded text-primaryWhite"
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded hover:bg-gray-700">
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-cardBg rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-gray-700 text-gray-400 text-sm">
              <tr>
                <th className="px-6 py-4">Book</th>
                <th className="px-6 py-4 text-center">Category</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Level</th>
                {/* <th className="px-6 py-4 text-center">Chapters</th>
                <th className="px-6 py-4 text-center">Pages</th> */}
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400">
                    No books found
                  </td>
                </tr>
              )}

              {filteredBooks.map((book) => (
                <tr
                  key={book.id}
                  className="border-b border-gray-800 hover:bg-gray-800"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-gray-700 rounded flex items-center justify-center">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="font-semibold">{book.bookName}</p>
                        <p className="text-xs text-gray-400">{book.language}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      <span className="px-3 py-1 text-[11px] font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow">
                        {book.category}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {book.language}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">{book.subject}</td>
                  <td className="px-6 py-4">{book.educationLevel}</td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      {book.chapters?.length || 0}
                      {book.hasVideo && <Video size={14} />}
                      {book.hasNote && <FileText size={14} />}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    {book.totalPages || "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3 text-gray-300">
                      <Eye className="cursor-pointer hover:text-primaryBlue" />
                      <Edit2 className="cursor-pointer hover:text-primaryOrange" />
                      <MoreVertical
                        onClick={() => handleDelete(book.id)}
                        className="cursor-pointer hover:text-primaryRed"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
