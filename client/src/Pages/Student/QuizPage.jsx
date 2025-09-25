import { useParams } from "react-router-dom";
import { FaClock, FaQuestionCircle, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
export default function QuizPage() {
  const { id } = useParams();
 const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#1e1f2b] text-white p-8 flex flex-col items-center">
      {/* Card */}
      <div className="bg-gradient-to-br from-[#2e2f44] to-[#1f202f] rounded-2xl shadow-lg p-8 w-full max-w-3xl border border-white/10">
        <h1 className="text-3xl font-bold mb-4">🎯 Quiz {id}</h1>
        <p className="text-gray-300 mb-6">
          Get ready for a quick <span className="text-yellow-400">Science</span> quiz!  
          Test your knowledge in a fun way 🎉
        </p>

        {/* Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-8">
          <div className="flex flex-col items-center">
            <FaClock className="text-yellow-400 text-3xl mb-2" />
            <p className="font-semibold">Time Limit</p>
            <p className="text-gray-300">10 mins</p>
          </div>
          <div className="flex flex-col items-center">
            <FaQuestionCircle className="text-blue-400 text-3xl mb-2" />
            <p className="font-semibold">Questions</p>
            <p className="text-gray-300">10</p>
          </div>
          <div className="flex flex-col items-center">
            <FaStar className="text-green-400 text-3xl mb-2" />
            <p className="font-semibold">Difficulty</p>
            <p className="text-gray-300">Easy-Medium</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[#15161e] rounded-lg p-4 mb-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-3">📌 Rules</h2>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
            <li>Each correct answer = +1 point.</li>
            <li>No negative marking for wrong answers.</li>
            <li>You cannot go back once submitted.</li>
          </ul>
        </div>

        {/* Start Button */}
        {/* <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-all duration-300"> */}
         <button
        onClick={() => navigate("/student/quiz/start")}
        className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 text-white"
      >
          🚀 Start Quiz
        </button>
      </div>
    </div>
  );
}
