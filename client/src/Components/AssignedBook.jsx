import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TeacherNavbar from "../Pages/Teacher/TeacherNavbar";
import TeacherSidebar from "../Pages/Teacher/TeacherSidebar";

export default function MyBooks() {
  const { id } = useParams(); // studentId
  const studentId = Number(id);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!studentId) return;

    fetch(`http://localhost:5000/student-book-assign/student/${studentId}`)
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.log(err));
  }, [studentId]);

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      {/* Sidebar */}

      <TeacherSidebar />

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <TeacherNavbar />
        <div className="p-6 flex-1">
          <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">
            My Assigned Books
          </h2>

          {books.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">
              No books assigned yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#26273c] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
                >
                  {/* Book Thumbnail */}
                  {b.book.thumbnail ? (
                    <img
                      src={`http://localhost:5000/${b.book.thumbnail}`}
                      alt={b.book.bookName}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gray-700 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <h3 className="text-xl font-semibold text-purple-300">
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
      </div>
    </div>
  );
}
