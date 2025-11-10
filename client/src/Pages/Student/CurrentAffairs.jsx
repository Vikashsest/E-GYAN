import { useState } from "react";
import {
  FaCalendarAlt,
  FaChevronDown,
  FaSearch,
  FaArrowRight,
  FaRegCalendarAlt
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import StudentSidebar from "./StudentSidebar";
import NewsModal from "./NewsModel";
import sampleNews from './sampleNews.json';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 

const menuLinks = [
  { name: "All", url: "" },
  { name: "Science & Technology", url: "" },
  { name: "Economy", url: "" },
  { name: "Environment", url: "" },
  { name: "Sports", url: "" },
  { name: "Daily Current Affairs", url: "" }
];

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const CurrentAffairs = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [selectedNews, setSelectedNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTopicsDropdownOpen, setIsTopicsDropdownOpen] = useState(false);
  const [isMonthsDropdownOpen, setIsMonthsDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // For calendar icon click
  const [selectedDate, setSelectedDate] = useState(null); // For calendar picker

  const filteredNews = sampleNews.filter(
    (n) => 
      (filter === "All" || n.category === filter) &&
      (!selectedMonth || new Date(n.date).getMonth() === selectedMonth) &&
      (!selectedDate || new Date(n.date).toDateString() === selectedDate.toDateString()) &&
      n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white relative">
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 lg:pl-[280px] py-6 px-4 sm:px-6 w-full">
        {/* Mobile Menu */}
        <div className="lg:hidden mb-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-white focus:outline-none"
          >
            <FiMenu size={28} />
          </button>
        </div>

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-[#2a2b3d] rounded-2xl shadow-md p-4 mb-8 gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-500">
             Daily Current Affairs
          </h2>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3 items-center">
            {/* Search Box */}
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search current affairs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-full bg-[#1f2030] border border-gray-600 focus:border-blue-500 focus:outline-none text-white placeholder-gray-400"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            {/* Topics Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsTopicsDropdownOpen(!isTopicsDropdownOpen)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white font-semibold"
              >
                Topics <FaChevronDown />
              </button>
              {isTopicsDropdownOpen && (
                <ul className="absolute right-0 mt-2 w-56 bg-[#1f2030] border border-gray-600 rounded-lg shadow-xl z-50">
                  {menuLinks.map((link, i) => (
                    <li
                      key={i}
                      className={`border-b border-gray-700 last:border-none ${
                        filter === link.name ? "bg-blue-700" : ""
                      }`}
                    >
                      <button
                        onClick={() => {
                          setFilter(link.name);
                          setIsTopicsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-600 transition-all"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Months Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMonthsDropdownOpen(!isMonthsDropdownOpen)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-white font-semibold"
              >
                <FaRegCalendarAlt /> {selectedMonth !== null ? months[selectedMonth] : "Month"} <FaChevronDown />
              </button>
              {isMonthsDropdownOpen && (
                <ul className="absolute right-0 mt-2 w-40 bg-[#1f2030] border border-gray-600 rounded-lg shadow-xl z-50">
                  {months.map((month, i) => (
                    <li
                      key={i}
                      className={`border-b border-gray-700 last:border-none ${
                        selectedMonth === i ? "bg-green-700" : ""
                      }`}
                    >
                      <button
                        onClick={() => {
                          setSelectedMonth(i);
                          setIsMonthsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-green-600 transition-all"
                      >
                        {month}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => {
                        setSelectedMonth(null);
                        setIsMonthsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-green-600 transition-all text-sm text-gray-300"
                    >
                      Clear Month
                    </button>
                  </li>
                </ul>
              )}
            </div>

            {/* Calendar Icon */}
            <div className="relative">
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex items-center justify-center w-12 h-12 bg-purple-600 hover:bg-purple-500 rounded-full"
              >
                <FaCalendarAlt size={20} />
              </button>
              {isCalendarOpen && (
                <div className="absolute right-0 mt-2 z-50">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    inline
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* News List */}
        <div className="space-y-6">
          {filteredNews.map((news, i) => (
            <article
              key={i}
              className="flex flex-col md:flex-row bg-[#2a2b3d] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-300"
            >
              <div className="md:w-1/3 w-full">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-44 md:h-56 object-cover"
                />
              </div>

              <div className="p-5 flex flex-col justify-between md:w-2/3">
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span className="bg-blue-700 px-3 py-1 rounded-full text-xs">
                      {news.category}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-400" /> {news.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 hover:text-blue-400 transition-all">
                    {news.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {news.description}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedNews(news)}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mt-4 font-semibold"
                >
                  Keep Reading <FaArrowRight />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Modal */}
        {selectedNews && (
          <NewsModal
            newsItem={selectedNews}
            onClose={() => setSelectedNews(null)}
          />
        )}
      </main>
    </div>
  );
};

export default CurrentAffairs;
