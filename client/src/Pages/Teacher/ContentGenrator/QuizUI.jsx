import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function QuizStartUI({ questions, onExit }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
 const navigate = useNavigate()
  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#13141a] text-white p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-[#1e1f29] p-6 rounded-2xl shadow-lg">
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question Count */}
        <p className="text-gray-400 text-sm mb-3">
          Question {current + 1} of {questions.length}
        </p>

        {/* Question */}
        <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <label
              key={idx}
              className={`block p-3 border rounded-lg cursor-pointer transition ${
                selected === idx
                  ? "bg-blue-600 border-blue-500"
                  : "bg-[#2a2b39] border-gray-600 hover:bg-[#353647]"
              }`}
            >
              <input
                type="radio"
                name="option"
                className="hidden"
                onChange={() => setSelected(idx)}
              />
              {opt}
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className="px-4 py-2 rounded bg-gray-700 disabled:opacity-30"
          >
            ⬅ Prev
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
          >
            {current === questions.length - 1 ? "Finish" : "Next ➜"}
          </button>
        </div>

        {/* Exit */}
        <button
          onClick={() => navigate(-2)}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 py-2 rounded"
        >
          Exit Quiz
        </button>
      </div>
    </div>
  );
}
