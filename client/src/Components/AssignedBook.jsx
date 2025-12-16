import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TeacherNavbar from "../Pages/Teacher/TeacherNavbar";
import TeacherSidebar from "../Pages/Teacher/TeacherSidebar";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import StudentSidebar from "../Pages/Student/StudentSidebar";
import StudentNavbar from "../Pages/Student/StudentNavbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function MyBooks() {
  const { id } = useParams();
  const studentId = Number(id);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!studentId) return;

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/student-book-assign/student/${studentId}`
        );
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [studentId]);

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white relative">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0">
        <StudentSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:pl-0">
        <StudentNavbar />

        <div className="p-6 flex-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <h2 className="text-3xl font-bold mb-6 text-purple-400 text-center">
            My Assigned Books
          </h2>

          {loading ? (
            <div className="flex flex-col items-center h-64 justify-center space-y-4">
              <FaSpinner className="animate-spin text-blue-500 text-6xl" />
              <p className="text-gray-400 font-semibold">Loading books...</p>
            </div>
          ) : books.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">
              No books assigned yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl shadow-lg border-2 border-white bg-[#3b3c4e] hover:scale-105 transform transition-all duration-300 cursor-pointer"
                  onClick={() => alert(`Clicked on ${b.book.bookName}`)}
                >
                  <div className="relative w-full h-48 overflow-hidden rounded-lg bg-gray-700 flex items-center justify-center">
                    {b.book.thumbnail ? (
                      <img
                        src={`${API_URL}/${b.book.thumbnail}`}
                        alt={b.book.bookName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <p className="text-gray-300">No Image</p>
                    )}

                    <div className="absolute top-2 right-2 flex items-center space-x-2">
                      {b.book.language && (
                        <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                          {b.book.language}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-bold text-purple-300">
                      {b.book.bookName}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Category:{" "}
                      <span className="text-white">{b.book.category}</span>
                    </p>
                    <p className="text-gray-400 text-sm">
                      Subject:{" "}
                      <span className="text-white">{b.book.subject}</span>
                    </p>
                    <p className="text-gray-400 text-sm">
                      Assigned By:{" "}
                      <span className="text-white">
                        {b.assignedBy.username}
                      </span>
                    </p>
                    <p className="text-gray-400 text-sm">
                      Status: <span className="text-green-400">{b.status}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
