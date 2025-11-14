import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { FaFileExport, FaPrint, FaBook, FaUsers, FaClock } from "react-icons/fa";

export default function EgYanReportsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    class: "",
    subject: "",
    language: "",
    educationLevel: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden px-4 mb-4">
          <button onClick={() => setIsSidebarOpen(true)} className="text-white">
            <FiMenu size={28} />
          </button>
        </div>

        <AdminNavbar/>

        <section className="px-4">
          {/* Header */}
          <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold mb-1 text-gradient bg-clip-text text-transparent from-indigo-400 to-green-400">
                📊 eGyan School Reports
              </h1>
              <p className="text-white/70 text-sm">
                Analyze student reading activity, book completion, and engagement metrics.
              </p>
            </div>
          </header>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <select
              name="class"
              value={filters.class}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">All Classes</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Class {i + 1}</option>
              ))}
            </select>

            <select
              name="subject"
              value={filters.subject}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">All Subjects</option>
              <option value="Math">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
            </select>

            <select
              name="language"
              value={filters.language}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">All Languages</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>

            <select
              name="educationLevel"
              value={filters.educationLevel}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="">All Levels</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
            </select>

            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="From"
            />
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleChange}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="To"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-3 mb-8">
            <button className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg text-sm flex items-center gap-2 shadow hover:shadow-lg transition">
              <FaFileExport /> Export CSV
            </button>
            <button className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-sm flex items-center gap-2 shadow hover:shadow-lg transition">
              <FaFileExport /> Export PDF
            </button>
            <button className="bg-yellow-400 hover:bg-yellow-500 px-5 py-2 rounded-lg text-sm text-black flex items-center gap-2 shadow hover:shadow-lg transition">
              <FaPrint /> Print
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 shadow-xl flex items-center gap-4 hover:scale-105 transform transition">
              <FaBook className="text-4xl" />
              <div>
                <p className="text-sm text-white/80">Total Books Completed</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl p-6 shadow-xl flex items-center gap-4 hover:scale-105 transform transition">
              <FaUsers className="text-4xl" />
              <div>
                <p className="text-sm text-white/80">Active Students</p>
                <p className="text-2xl font-bold">47</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 shadow-xl flex items-center gap-4 hover:scale-105 transform transition">
              <FaClock className="text-4xl" />
              <div>
                <p className="text-sm text-white/80">Pending Reviews</p>
                <p className="text-2xl font-bold">36</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Detailed Class & Student Report</h2>
            <table className="min-w-full text-sm table-auto border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white/70 border-b border-gray-700">
                  <th className="py-3 px-4 text-left">Class</th>
                  <th className="py-3 px-4 text-left">Student</th>
                  <th className="py-3 px-4 text-left">Books Completed</th>
                  <th className="py-3 px-4 text-left">Reading Hours</th>
                  <th className="py-3 px-4 text-left">Last Activity</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { class: "10", student: "Ravi Kumar", books: 12, hours: 5, last: "Today", status: "Active" },
                  { class: "9", student: "Sita Sharma", books: 8, hours: 3, last: "Yesterday", status: "Inactive" },
                  { class: "8", student: "Aman Verma", books: 15, hours: 7, last: "2 days ago", status: "Active" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-t border-gray-700 hover:bg-gray-700/30 transition">
                    <td className="py-2 px-4">{row.class}</td>
                    <td className="py-2 px-4">{row.student}</td>
                    <td className="py-2 px-4">{row.books}</td>
                    <td className="py-2 px-4">{row.hours} hrs</td>
                    <td className="py-2 px-4">{row.last}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          row.status === "Active" ? "bg-green-500 text-black" : "bg-red-500 text-black"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
