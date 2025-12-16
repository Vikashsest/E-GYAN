import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";
import { FiMenu } from "react-icons/fi";
import { useLoader } from "../../LoaderContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function MyBooks() {
  const {setLoading} = useLoader()
  const { id } = useParams();
  const studentId = Number(id);
  const [books, setBooks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!studentId) return;

    const fetchBooks = async () => {
      try {
         setLoading(true);
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
    <div className="flex min-h-screen bg-darkBg text-primaryWhite relative">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay for mobile when sidebar open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-primaryBlack bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:pl-[280px] py-6 px-4 sm:px-6 w-full">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden mb-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-primaryWhite focus:outline-none"
          >
            <FiMenu size={28} />
          </button>
        </div>

        <StudentNavbar />


        <div className=" flex-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center mb-6 px-4 py-2 bg-gray700 hover:bg-gray600 rounded-lg shadow-md transition"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <h2 className="text-3xl font-bold mb-6 text-primaryWhite text-center">
            My Assigned Books
          </h2>

        
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl shadow-lg border-2 border-primaryWhite bg-cardBg hover:scale-105 transform transition-all duration-300 cursor-pointer"
                  onClick={() => alert(`Clicked on ${b.book.bookName}`)}
                >
                  <div className="relative w-full h-48 overflow-hidden rounded-lg bg-gray700 flex items-center justify-center">
                    {b.book.thumbnail ? (
                      <img
                        src={`${API_URL}/${b.book.thumbnail}`}
                        alt={b.book.bookName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <p className="text-gray300">No Image</p>
                    )}

                    <div className="absolute top-2 right-2 flex items-center space-x-2">
                      {b.book.language && (
                        <span className="bg-primaryBlack/60 text-primaryWhite text-xs px-2 py-1 rounded-md">
                          {b.book.language}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-bold text-purple-300">
                      {b.book.bookName}
                    </h3>
                    <p className="text-gray400 text-sm">
                      Category:{" "}
                      <span className="text-primaryWhite">{b.book.category}</span>
                    </p>
                    <p className="text-gray400 text-sm">
                      Subject:{" "}
                      <span className="text-primaryWhite">{b.book.subject}</span>
                    </p>
                    <p className="text-gray400 text-sm">
                      Assigned By:{" "}
                      <span className="text-primaryWhite">
                        {b.assignedBy.username}
                      </span>
                    </p>
                    <p className="text-gray400 text-sm">
                      Status: <span className="text-green-400">{b.status}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </main>
    </div>
  );
}
