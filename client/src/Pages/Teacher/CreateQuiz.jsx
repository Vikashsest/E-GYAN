import { useState } from "react";
import {
  Plus,
  Image as ImageIcon,
  Sigma,
  Bold,
  Italic,
  Underline,
  Trash2,
  Play,
  Sparkles,
  Save,
  ChevronDown,
  Tag,
  BookOpen,
} from "lucide-react";

export default function CreateQuiz() {
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", "", ""], answer: "" },
  ]);

  return (
    <div className="flex min-h-screen bg-[#121212] text-gray-300 font-sans">
      {/* Sidebar - Left Navigation */}
      <aside className="w-16 flex flex-col items-center py-4 bg-[#1e1e1e] border-r border-gray-800">
        <div className="w-10 h-10 bg-green-500 rounded-lg mb-8 flex items-center justify-center text-white font-bold">
          Q
        </div>
        <div className="flex flex-col gap-6">
          <div className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 text-sm">
            1
          </div>
          <button className="w-8 h-8 rounded-full border border-dashed border-gray-600 flex items-center justify-center hover:border-white">
            <Plus size={16} />
          </button>
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <button className="p-2 hover:bg-gray-800 rounded-lg text-purple-400">
            <Sparkles size={20} />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-lg">
            <Play size={20} />
          </button>
          <button className="p-2 bg-green-600 text-white rounded-lg">
            <Save size={20} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-14 border-b border-gray-800 flex items-center px-6 justify-between bg-[#1e1e1e]">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-sm">← Science-17-12-2025</span>
            <div className="relative flex-1 max-w-xl">
              <input
                type="text"
                placeholder="Higher Order Thinking Skill (HOTS)"
                className="w-full bg-[#2a2a2a] border-none rounded-full py-1.5 px-10 text-sm focus:ring-1 ring-purple-500"
              />
              <BookOpen
                className="absolute left-3 top-2 text-gray-500"
                size={16}
              />
            </div>
          </div>
        </header>

        {/* Editor Area */}
        <section className="p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Question Editor Card */}
            <div className="bg-[#252525] rounded-xl p-6 border border-gray-800 shadow-xl">
              <div className="flex gap-4 mb-6">
                {/* Image Upload Placeholder */}
                <div className="w-1/3 aspect-video bg-[#1e1e1e] rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center group cursor-pointer hover:border-purple-500 transition-colors">
                  <div className="relative w-16 h-16 mb-2">
                    <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
                    <ImageIcon
                      className="relative text-green-500 m-auto"
                      size={48}
                    />
                  </div>
                  <span className="text-xs font-medium">Upload Media</span>
                </div>

                {/* Question Textarea */}
                <div className="flex-1 relative bg-[#1e1e1e] rounded-lg border border-gray-700 p-4">
                  <textarea
                    placeholder="Q. Enter question here"
                    className="w-full h-full bg-transparent border-none resize-none focus:ring-0 text-xl"
                  />
                  {/* Rich Text Toolbar */}
                  <div className="absolute top-3 right-3 flex gap-1">
                    <div className="flex bg-[#2a2a2a] rounded p-1 border border-gray-700">
                      <button className="p-1 hover:bg-gray-700 rounded">
                        <Bold size={14} />
                      </button>
                      <button className="p-1 hover:bg-gray-700 rounded">
                        <Italic size={14} />
                      </button>
                      <button className="p-1 hover:bg-gray-700 rounded text-green-500 font-bold px-1">
                        A
                      </button>
                    </div>
                  </div>
                  {/* Floating Action Buttons */}
                  <div className="absolute -right-12 top-0 flex flex-col gap-2">
                    <button className="p-2 bg-purple-600 rounded-md text-white">
                      <Sparkles size={18} />
                    </button>
                    <button className="p-2 bg-green-700 rounded-md text-white">
                      <Sigma size={18} />
                    </button>
                    <button className="p-2 bg-gray-700 rounded-md text-white">
                      <Sigma size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Options List */}
              <div className="space-y-3">
                {["A", "B", "C", "D", "E"].map((label, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center gap-3 bg-white rounded-lg p-3 transition-all hover:ring-2 ring-purple-500/50"
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 font-bold shrink-0">
                      {label}
                    </div>
                    <input
                      type="text"
                      placeholder={`Enter Option ${label}`}
                      className="flex-1 bg-transparent border-none text-gray-800 focus:ring-0 outline-none"
                    />
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sigma
                        className="text-gray-400 cursor-pointer hover:text-purple-500"
                        size={18}
                      />
                      <ImageIcon
                        className="text-gray-400 cursor-pointer hover:text-purple-500"
                        size={18}
                      />
                      <Trash2
                        className="text-red-400 cursor-pointer hover:text-red-600"
                        size={18}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex gap-4">
                <div className="flex items-center bg-[#252525] px-4 py-2 rounded-lg border border-gray-700">
                  <span className="text-xs mr-2">MCQ</span>
                  <ChevronDown size={14} />
                </div>
                <div className="flex items-center bg-[#252525] px-4 py-2 rounded-lg border border-gray-700">
                  <span className="text-xs mr-2">120 Sec</span>
                  <ChevronDown size={14} />
                </div>
                <div className="flex items-center bg-[#252525] px-4 py-2 rounded-lg border border-gray-700">
                  <span className="text-xs mr-2">1 Point</span>
                  <ChevronDown size={14} />
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#252525] rounded-lg border border-gray-700 hover:bg-gray-800 transition">
                  <div className="w-8 h-4 bg-gray-600 rounded-full relative">
                    <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-xs">Hide Answer</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#252525] rounded-lg border border-gray-700 hover:bg-gray-800 transition text-xs">
                  <BookOpen size={14} /> Add Solution
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#252525] rounded-lg border border-gray-700 hover:bg-gray-800 transition text-xs">
                  <Tag size={14} /> Add Topic Tag
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
