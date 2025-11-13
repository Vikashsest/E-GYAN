import { motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";

export default function LatestVersions() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const updates = [
    {
      version: "2.1",
      date: "Nov 25, 2023",
      improvements: ["Added a new page with a changelog"],
      bugfixes: [
        "Fixed AI operation in some cases",
        "Fixed technical problems that led to failures",
      ],
      gradient: "from-purple-400/30 to-blue-400/30",
    },
    {
      version: "2.0",
      date: "Aug 6, 2023",
      improvements: [
        "Added the ability to flexibly configure subscription management",
      ],
      bugfixes: ["Reduced data loading and updating time"],
      gradient: "from-pink-400/30 to-indigo-400/30",
    },
  ];

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

      <div className="max-w-3xl mx-auto">
        {/* Header Section with background */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-700/30 to-sky-400 border border-indigo-500/20 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-10"
        >
          <h1 className="text-4xl font-bold text-center mb-3">
            🚀 What's New?
          </h1>
          <p className="text-center text-gray-300">
            A changelog of the latest{" "}
            <span className="text-indigo-400 font-semibold">Quickli</span>{" "}
            feature releases, product updates, and important bug fixes.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative border-l border-gray-700 pl-6">
          {updates.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="mb-12 relative"
            >
              {/* Dot on timeline */}
              <div className="absolute -left-7 w-6 h-6 bg-indigo-500 rounded-full border-4 border-gray-950 shadow-lg"></div>

              <p className="text-sm text-gray-400 mb-2">{item.date}</p>

              {/* Card container (lighter & softer) */}
              <div
                className={`rounded-xl border border-gray-700 bg-gradient-to-r ${item.gradient} shadow-[0_0_15px_rgba(80,80,120,0.2)] backdrop-blur-md transition-transform hover:scale-[1.02] duration-300`}
              >
                <div className="p-6">
                  <h2 className="text-3xl font-bold mb-4 text-white">
                    Version {item.version}
                  </h2>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-indigo-300">
                      Improvements & Changes
                    </h3>
                    <ul className="list-disc list-inside text-gray-200 space-y-1">
                      {item.improvements.map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-pink-300">
                      Bugfixes
                    </h3>
                    <ul className="list-disc list-inside text-gray-200 space-y-1">
                      {item.bugfixes.map((bug, idx) => (
                        <li key={idx}>{bug}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </main>
    </div>
  );
}
