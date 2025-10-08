import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AssessmentStartPage() {
  const [currentQ, setCurrentQ] = useState(0);

  const questions = [
    { question: "What is 2 + 2?", options: ["2", "3", "4", "5"], answer: "4" },
    { question: "What is 5 × 3?", options: ["15", "10", "20", "8"], answer: "15" },
    { question: "What is 10 ÷ 2?", options: ["2", "5", "10", "8"], answer: "5" }
  ];

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const prevQuestion = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  return (
    <div className="min-h-screen bg-[#1e1f2b] text-white p-6 flex flex-col items-center">
      <div className="bg-[#2a2b3c] w-full max-w-3xl p-6 rounded-2xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold">Question {currentQ + 1} of {questions.length}</h2>
        <p className="text-gray-300 text-lg">{questions[currentQ].question}</p>

        <div className="grid grid-cols-1 gap-3">
          {questions[currentQ].options.map((opt, idx) => (
            <button
              key={idx}
              className="w-full p-3 bg-[#15161e] rounded-lg border border-gray-500 hover:bg-blue-600 transition"
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={prevQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
          >
            <FaChevronLeft /> Previous
          </button>

          <button
            onClick={nextQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
          >
            Next <FaChevronRight />
          </button>
        </div>

        {/* Submit Button */}
        {currentQ === questions.length - 1 && (
          <button className="w-full py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition mt-4">
            Submit Assessment
          </button>
        )}
      </div>
    </div>
  );
}