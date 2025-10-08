import { useParams } from "react-router-dom";
import { FaClock, FaPlay, FaListOl } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
export default function AssessmentPage() {
  const { id } = useParams();
 const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#1e1f2b] text-white p-8 flex flex-col items-center">
      {/* Card */}
      <div className="bg-gradient-to-br from-[#2e2f44] to-[#1f202f] rounded-2xl shadow-lg p-8 w-full max-w-3xl border border-white/10">
        <h1 className="text-3xl font-bold mb-4">📝 Assessment {id}</h1>
        <p className="text-gray-300 mb-6">
          Welcome! This is your <span className="text-yellow-400">Mathematics</span> assessment.  
          Please read the instructions carefully before starting.
        </p>

        {/* Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-8">
          <div className="flex flex-col items-center">
            <FaClock className="text-yellow-400 text-3xl mb-2" />
            <p className="font-semibold">Time Limit</p>
            <p className="text-gray-300">30 mins</p>
          </div>
          <div className="flex flex-col items-center">
            <FaListOl className="text-blue-400 text-3xl mb-2" />
            <p className="font-semibold">Questions</p>
            <p className="text-gray-300">20</p>
          </div>
          <div className="flex flex-col items-center">
            <FaPlay className="text-green-400 text-3xl mb-2" />
            <p className="font-semibold">Attempts</p>
            <p className="text-gray-300">1 allowed</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[#15161e] rounded-lg p-4 mb-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-3">📌 Instructions</h2>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
            <li>Each question carries equal marks.</li>
            <li>Do not refresh or close the window during the test.</li>
            <li>Click <span className="text-green-400">Submit</span> once you are done.</li>
          </ul>
        </div>
        {/* <button 
        
        className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-lg transition-all duration-300 "
        
        > */}
         <button
        onClick={() => navigate("/student/assessments/start")}
        className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 text-white"
      >
          🚀 Start Assessment
        </button>
      </div>
    </div>
  );
}