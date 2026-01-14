

import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import StudentSidebar from "./StudentSidebar";
import { fetchFavoriteBooks, subjectWiseBooks} from "../../apiServices/booksApi";
import { FaArrowLeft} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { useLoader } from "../../LoaderContext";

const API_URL = import.meta.env.VITE_API_URL;

const BooksList = () => {
  const {setLoading} = useLoader()
  const { className, subject } = useParams();
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  const normalizeClass = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/i+/g, "1")
      .replace(/ii/g, "2")
      .replace(/iii/g, "3")
      .replace(/iv/g, "4")
      .replace(/v/g, "5");
  };

  useEffect(() => {
    async function loadBooks() {
      try {
        setLoading(true);
        // Call new fetchBooks with filters
        const [allBooks, favoriteIds] = await Promise.all([
          subjectWiseBooks({ className, subject, category }),
          fetchFavoriteBooks(),
        ]);

        // Unique books by name
        const uniqueBooksMap = {};
        allBooks.forEach((book) => {
          const key = book.bookName.toLowerCase().trim();
          if (!uniqueBooksMap[key]) uniqueBooksMap[key] = book;
        });

        const booksWithFavorites = Object.values(uniqueBooksMap).map((b) => ({
          ...b,
          isFavorite: favoriteIds.includes(b.id),
        }));

        setBooks(booksWithFavorites);
      } catch (error) {
        console.error("Failed to load books or favorites:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, [className, subject, category]);


  const handleBookClick = (bookId) => {
    navigate(`/student/books/${bookId}/chapters`);
  };

  // const toggleFavorite = async (bookId) => {
  //   try {
  //     await toggleFavoriteBook(bookId);
  //     setBooks((prevBooks) =>
  //       prevBooks.map((b) => (b.id === bookId ? { ...b, isFavorite: !b.isFavorite } : b))
  //     );
  //   } catch (err) {
  //     console.error("Failed to toggle favorite:", err);
  //   }
  // };

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


        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 px-4 py-2 bg-gray700 hover:bg-gray600 rounded-lg shadow-md transition"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <h2 className="text-2xl font-bold mb-6">
          📚 {category ? `${category} Books` : `Books for ${subject} (${className})`}
        </h2>

        {books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="p-4 rounded-2xl shadow-lg border-2 border-primaryWhite bg-cardBg hover:scale-105 transform transition-all duration-300 cursor-pointer"
              >
                <div className="relative w-full h-48 overflow-hidden rounded-lg bg-gray700 flex items-center justify-center">
                  {book.thumbnail ? (
                    <img
                      src={
                        book.thumbnail.includes('/index.php/s/')
                          ? book.thumbnail + '/download' // 🔹 add /download
                          : `${API_URL}/books/proxy/thumbnail?url=${encodeURIComponent(book.thumbnail)}`
                      }
                      alt={book.bookName}
                      className="w-full h-full object-cover"
                      onClick={() => handleBookClick(book.id)}
                    />
                  ) : (
                    <p className="text-gray300">No Image</p>
                  )}
                  <div className="absolute top-2 right-2 flex items-center space-x-2">
                    {book.language && (
                      <span className="bg-primaryBlack/60 text-primaryWhite text-xs px-2 py-1 rounded-md">
                        {book.language}
                      </span>
                    )}
                    <button
                      className="text-lightRed hover:text-darkRed text-lg"
                    // onClick={() => toggleFavorite(book.id)}
                    >
                      {/* {book.isFavorite ? <FaHeart /> : <FaRegHeart />} */}
                    </button>
                  </div>

                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold">{book.bookName}</h3>

                </div>
              </div>
            ))}
          </div>
        ) }
      </main>
    </div>
  );
};

export default BooksList;
