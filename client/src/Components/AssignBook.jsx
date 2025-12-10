import React, { useState, useEffect } from "react";
import { FaBook } from "react-icons/fa";
import TeacherSidebar from "../Pages/Teacher/TeacherSidebar";
import TeacherNavbar from "../Pages/Teacher/TeacherNavbar";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AssignBookPage() {
  const { studentId } = useParams(); // Student ID from URL
  const navigate = useNavigate();
  const [book, setBook] = useState("");
  const [books, setBooks] = useState([]);

  // Fetch all books
  useEffect(() => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.log("Books API Error:", err));
  }, []);

  const handleAssign = async () => {
    if (!book) {
      toast.error("Please select a book");
      return;
    }

    try {
      // Find the selected book object to get its ID
      const selectedBook = books.find((b) => b.bookName === book);
      if (!selectedBook) throw new Error("Book not found");

      const res = await fetch(
        "http://localhost:5000/student-book-assign/assign",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: Number(studentId),
            bookId: selectedBook.id,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to assign book");

      const data = await res.json();
      toast.success(data.message);
      navigate("/teacher/students"); // Redirect to student list after assign
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign book");
    }
  };

  return (
    <div className="p-6 bg-[#1e1f2b] min-h-screen text-white">
      <TeacherNavbar />
      <TeacherSidebar />

      <h2 className="text-3xl font-bold text-center mb-8">
        Assign Book to Student
      </h2>

      <div className="max-w-lg mx-auto bg-[#26273c] p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
        {/* Student Fixed Display */}
        <div className="mb-6">
          <p className="text-lg text-gray-300">
            <strong>Student ID:</strong> {studentId}
          </p>
        </div>

        {/* Book Select */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium">
            Select Book
          </label>

          <div className="flex items-center gap-3 bg-[#1e1f2b] rounded-xl px-4 py-3">
            <FaBook className="text-blue-400 text-xl" />
            <select
              className="bg-[#1e1f2b] w-full text-white px-3 py-2 rounded"
              value={book}
              onChange={(e) => setBook(e.target.value)}
            >
              <option value="">-- choose book --</option>
              {books.map((b) => (
                <option key={b.id} value={b.bookName}>
                  {b.bookName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Assign Button */}
        <button
          onClick={handleAssign}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 transition-all text-white font-semibold py-3 rounded-xl shadow-md text-lg"
        >
          Assign Book
        </button>
      </div>
    </div>
  );
}
