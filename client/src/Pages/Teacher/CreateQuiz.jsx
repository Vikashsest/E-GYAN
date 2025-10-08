import { useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import TeacherNavbar from "./TeacherNavbar";
import { FaQuestionCircle, FaPlus } from "react-icons/fa";

export default function CreateQuiz() {
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], answer: "" }]);
  const [duration, setDuration] = useState("");
  const [title, setTitle] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"]; // Example classes

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "" }]);
  };

  const handleChange = (qIndex, field, value, optIndex) => {
    const newQuestions = [...questions];
    if (field === "question" || field === "answer") {
      newQuestions[qIndex][field] = value;
    } else {
      newQuestions[qIndex].options[optIndex] = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Quiz Created:", { title, duration, selectedClass, questions });
    alert(`Quiz for ${selectedClass} created successfully! 🎉`);
  };

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <TeacherSidebar />
      <main className="flex-1 pl-[280px] pr-5 py-6">
        <TeacherNavbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <FaQuestionCircle /> Create Quiz
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Class selection */}
            <div>
              <label className="block text-gray-300 mb-2">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#2a2b3c] border border-gray-600 focus:outline-none"
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls, idx) => (
                  <option key={idx} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {/* Quiz Title */}
            <div>
              <label className="block text-gray-300 mb-2">Quiz Title</label>
              <input
                type="text"
                placeholder="Enter quiz title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#2a2b3c] border border-gray-600 focus:outline-none"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-gray-300 mb-2">Duration (minutes)</label>
              <input
                type="number"
                placeholder="Enter duration in minutes"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#2a2b3c] border border-gray-600 focus:outline-none"
              />
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Questions</h2>
              {questions.map((q, idx) => (
                <div key={idx} className="p-4 bg-[#2a2b3c] rounded-lg border border-gray-600 space-y-2">
                  <input
                    type="text"
                    placeholder={`Question ${idx + 1}`}
                    value={q.question}
                    onChange={(e) => handleChange(idx, "question", e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#1f202f] border border-gray-500"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <input
                        key={optIdx}
                        type="text"
                        placeholder={`Option ${optIdx + 1}`}
                        value={opt}
                        onChange={(e) => handleChange(idx, "options", e.target.value, optIdx)}
                        className="p-2 rounded-lg bg-[#1f202f] border border-gray-500"
                      />
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Correct Answer"
                    value={q.answer}
                    onChange={(e) => handleChange(idx, "answer", e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#1f202f] border border-gray-500 mt-2"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
              >
                <FaPlus /> Add Question
              </button>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-green-600 rounded-lg font-bold hover:bg-green-700 transition"
            >
              Create Quiz
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}