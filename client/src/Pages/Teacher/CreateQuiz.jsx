import { useState } from "react";
import {
  Plus,
  Image as ImageIcon,
  Sigma,
  Bold,
  Italic,
  Trash2,
  Play,
  Sparkles,
  Save,
  ChevronDown,
  Tag,
  BookOpen,
} from "lucide-react";
import TeacherNavbar from "./TeacherNavbar";

export default function CreateQuiz() {
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctIndex: null,
      hideAnswer: false,
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const current = questions[activeIndex];

  const deleteQuestion = (index) => {
    setQuestions((prev) => {
      if (prev.length === 1) return prev; // at least 1 question rahe

      const updated = prev.filter((_, i) => i !== index);

      // activeIndex adjust karo
      if (activeIndex >= updated.length) {
        setActiveIndex(updated.length - 1);
      } else if (activeIndex > index) {
        setActiveIndex(activeIndex - 1);
      }

      return updated;
    });
  };


  const updateQuestion = (value) => {
    const copy = [...questions];
    copy[0].question = value;
    setQuestions(copy);
  };

  const updateOption = (idx, value) => {
    const copy = [...questions];
    copy[0].options[idx] = value;
    setQuestions(copy);
  };

  const deleteOption = (idx) => {
    const copy = [...questions];
    copy[0].options.splice(idx, 1);
    setQuestions(copy);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctIndex: null },
    ]);
  };

  const saveQuiz = () => {
    console.log("Saved Quiz:", questions);
    alert("Quiz saved (check console)");
  };

  const previewQuiz = () => {
    alert(JSON.stringify(questions, null, 2));
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#1e1f2b] text-white">
      <TeacherNavbar />

      {/* PAGE LAYOUT */}
      <div className="flex">

        {/* LEFT SIDEBAR */}
        <aside className="w-16 flex flex-col items-center py-4 bg-[#1e1e1e] border-r border-gray-800 min-h-[calc(100vh-64px)]">

          {/* QUESTION NUMBERS */}
          <div className="flex flex-col gap-3 mb-6">
            {questions.map((_, idx) => (
              <div key={idx} className="relative group">

                {/* QUESTION NUMBER */}
                <button
                  onClick={() => setActiveIndex(idx)}
                  className={`w-8 h-8 rounded-full text-xs font-bold
        ${activeIndex === idx
                      ? "bg-green-500 text-white"
                      : "bg-[#2a2a2a] text-gray-300 hover:bg-gray-700"
                    }`}
                >
                  {idx + 1}
                </button>

                {/* DELETE BUTTON (hover) */}
                {questions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuestion(idx);
                    }}
                    className="absolute -top-2 -right-2 hidden group-hover:flex
                   w-5 h-5 bg-red-600 text-white rounded-full
                   items-center justify-center text-[10px]"
                    title="Delete Question"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

          </div>

          {/* ADD QUESTION */}
          <button
            onClick={addQuestion}
            className="w-8 h-8 border border-dashed rounded-full mb-6"
            title="Add Question"
          >
            <Plus size={16} />
          </button>

          {/* AI */}
          <button
            onClick={() => setShowAIPanel?.(true)}
            className="p-2 bg-purple-600 hover:bg-purple-700 rounded text-white mb-4"
          >
            <Sparkles size={20} />
          </button>

          {/* BOTTOM ACTIONS */}
          <div className="mt-auto flex flex-col gap-4">
            <button className="p-2 hover:bg-gray-800 rounded">
              <Play size={20} />
            </button>

            <button
              onClick={saveQuiz}
              className="p-2 bg-green-600 rounded text-white"
            >
              <Save size={20} />
            </button>
          </div>
        </aside>


        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* QUESTION CARD */}
            <div className="bg-[#252525] rounded-xl p-6 border border-gray-800">
              <div className="flex gap-4 mb-6">

                {/* IMAGE */}
                <div className="w-1/3 aspect-video bg-[#1e1e1e] rounded-lg border-dashed border-2 border-gray-700 flex items-center justify-center cursor-pointer">
                  <ImageIcon size={40} className="text-green-500" />
                </div>

                {/* QUESTION */}
                <div className="flex-1 relative bg-[#1e1e1e] rounded-lg border border-gray-700 p-4">
                  <textarea
                    value={current.question}
                    onChange={(e) => updateQuestion(e.target.value)}
                    placeholder="Q. Enter question here"
                    className="w-full h-full bg-transparent resize-none text-xl"
                  />

                  {/* TOOLBAR */}
                  <div className="absolute top-2 right-2 flex bg-[#2a2a2a] p-1 rounded">
                    <Bold size={14} className="mx-1 cursor-pointer" />
                    <Italic size={14} className="mx-1 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* OPTIONS */}
              <div className="space-y-3">
                {current.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 bg-white p-3 rounded-lg ${current.correctIndex === idx ? "ring-2 ring-green-500" : ""
                      }`}
                  >
                    <div
                      onClick={() =>
                        setQuestions((q) => {
                          const c = [...q];
                          c[0].correctIndex = idx;
                          return c;
                        })
                      }
                      className="w-8 h-8 border-2 border-green-500 rounded-full text-green-600 font-bold flex items-center justify-center cursor-pointer"
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>

                    <input
                      value={opt}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      placeholder="Option text"
                      className="flex-1 text-gray-800 outline-none"
                    />

                    <Trash2
                      size={18}
                      onClick={() => deleteOption(idx)}
                      className="text-red-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM CONTROLS */}
            <div className="flex justify-between">
              <div className="flex gap-4">
                <Control label="MCQ" />
                <Control label="120 Sec" />
                <Control label="1 Point" />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setQuestions((q) => {
                      const c = [...q];
                      c[0].hideAnswer = !c[0].hideAnswer;
                      return c;
                    })
                  }
                  className="px-4 py-2 bg-[#252525] rounded-lg border"
                >
                  Hide Answer
                </button>

                <button className="px-4 py-2 bg-[#252525] rounded-lg border">
                  <BookOpen size={14} /> Solution
                </button>
                <button className="px-4 py-2 bg-[#252525] rounded-lg border">
                  <Tag size={14} /> Tag
                </button>
              </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}

/* --------- Small Reusable Control --------- */
function Control({ label }) {
  return (
    <div className="flex items-center bg-[#252525] px-4 py-2 rounded-lg border border-gray-700">
      <span className="text-xs mr-2">{label}</span>
      <ChevronDown size={14} />
    </div>
  );
}








