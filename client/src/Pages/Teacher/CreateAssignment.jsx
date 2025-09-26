// import { useState } from "react";
// import TeacherSidebar from "./TeacherSidebar";
// import TeacherNavbar from "./TeacherNavbar";
// import { FaClipboardList, FaPlus } from "react-icons/fa";
// import {createAssessment} from '../../apiServices/assesment'
// export default function CreateAssignment() {
//   const [questions, setQuestions] = useState([{ question: "", marks: "" }]);
//   const [duration, setDuration] = useState("");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedClass, setSelectedClass] = useState("");

//   const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"]; // Example classes

//   const addQuestion = () => {
//     setQuestions([...questions, { question: "", marks: "" }]);
//   };

//   const handleChange = (index, field, value) => {
//     const newQuestions = [...questions];
//     newQuestions[index][field] = value;
//     setQuestions(newQuestions);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Assessment Created:", { title, description, duration, selectedClass, questions });
//     alert(`Assessment for ${selectedClass} created successfully! 🎉`);
//   };

//   return (
//     <div className="flex min-h-screen bg-[#1e1f2b] text-white">
//       <TeacherSidebar />
//       <main className="flex-1 pl-[280px] pr-5 py-6">
//         <TeacherNavbar />

//         <div className="p-6">
//           <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
//             <FaClipboardList /> Create Assessment
//           </h1>

//           <form onSubmit={handleSubmit} className="space-y-6">

//             {/* Class selection */}
//             <div>
//               <label className="block text-gray-300 mb-2">Select Class</label>
//               <select
//                 value={selectedClass}
//                 onChange={(e) => setSelectedClass(e.target.value)}
//                 className="w-full p-3 rounded-lg bg-[#2a2b3c] border border-gray-600 focus:outline-none"
//               >
//                 <option value="">-- Select Class --</option>
//                 {classes.map((cls, idx) => (
//                   <option key={idx} value={cls}>{cls}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Title */}
//             <div>
//               <label className="block text-gray-300 mb-2">Assessment Title</label>
//               <input
//                 type="text"
//                 placeholder="Enter assessment title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 className="w-full p-3 rounded-lg bg-[#2a2b3c] border border-gray-600 focus:outline-none"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-gray-300 mb-2">Description</label>
//               <textarea
//                 placeholder="Enter assessment description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="w-full p-3 rounded-lg bg-[#2a2b3c] border border-gray-600 focus:outline-none"
//                 rows={4}
//               />
//             </div>

//             {/* Duration */}
//             <div>
//               <label className="block text-gray-300 mb-2">Duration (minutes)</label>
//               <input
//                 type="number"
//                 placeholder="Enter duration in minutes"
//                 value={duration}
//                 onChange={(e) => setDuration(e.target.value)}
//                 className="w-full p-3 rounded-lg bg-[#2a2b3c] border border-gray-600 focus:outline-none"
//               />
//             </div>

//             {/* Questions */}
//             <div className="space-y-4">
//               <h2 className="text-xl font-semibold">Questions</h2>
//               {questions.map((q, idx) => (
//                 <div key={idx} className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center">
//                   <input
//                     type="text"
//                     placeholder={`Question ${idx + 1}`}
//                     value={q.question}
//                     onChange={(e) => handleChange(idx, "question", e.target.value)}
//                     className="sm:col-span-4 p-3 rounded-lg bg-[#2a2b3c] border border-gray-600 focus:outline-none"
//                   />
//                   <input
//                     type="number"
//                     placeholder="Marks"
//                     value={q.marks}
//                     onChange={(e) => handleChange(idx, "marks", e.target.value)}
//                     className="sm:col-span-1 p-3 rounded-lg bg-[#2a2b3c] border border-gray-600 focus:outline-none"
//                   />
//                 </div>
//               ))}

//               <button
//                 type="button"
//                 onClick={addQuestion}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
//               >
//                 <FaPlus /> Add Question
//               </button>
//             </div>

//             <button
//               type="submit"
//               className="px-6 py-3 bg-green-600 rounded-lg font-bold hover:bg-green-700 transition"
//             >
//               Create Assessment
//             </button>
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// }

import { useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import TeacherNavbar from "./TeacherNavbar";
import { FaClipboardList, FaPlus } from "react-icons/fa";
 import {createAssessment} from '../../apiServices/assesment'

export default function CreateAssignment() {
  const [questions, setQuestions] = useState([{ question_text: "", marks: "" }]);
  const [duration, setDuration] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

const classes = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

  const addQuestion = () => {
    setQuestions([...questions, { question_text: "", marks: "" }]);
  };

  const handleChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload
    const payload = {
      title,
      description,
      duration: Number(duration),
      class: selectedClass,
      questions: questions.map(q => ({
        question_text: q.question_text,
        marks: Number(q.marks),
      })),
    };

    try {
      const res = await createAssessment(payload); 
      console.log("Assessment Created:", res);
      alert(`Assessment for ${selectedClass} created successfully! 🎉`);
      setTitle("");
      setDescription("");
      setDuration("");
      setSelectedClass("");
      setQuestions([{ question_text: "", marks: "" }]);
    } catch (error) {
      console.error(error);
      alert("Error creating assessment. Check console.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <TeacherSidebar />
      <main className="flex-1 pl-[280px] pr-5 py-6">
        <TeacherNavbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <FaClipboardList /> Create Assessment
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

            {/* Title */}
            <div>
              <label className="block text-gray-300 mb-2">Assessment Title</label>
              <input
                type="text"
                placeholder="Enter assessment title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#2a2b3c] border border-gray-600 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-300 mb-2">Description</label>
              <textarea
                placeholder="Enter assessment description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#2a2b3c] border border-gray-600 focus:outline-none"
                rows={4}
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
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center">
                  <input
                    type="text"
                    placeholder={`Question ${idx + 1}`}
                    value={q.question_text}
                    onChange={(e) => handleChange(idx, "question_text", e.target.value)}
                    className="sm:col-span-4 p-3 rounded-lg bg-[#2a2b3c] border border-gray-600 focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Marks"
                    value={q.marks}
                    onChange={(e) => handleChange(idx, "marks", e.target.value)}
                    className="sm:col-span-1 p-3 rounded-lg bg-[#2a2b3c] border border-gray-600 focus:outline-none"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                <FaPlus /> Add Question
              </button>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-green-600 rounded-lg font-bold hover:bg-green-700 transition"
            >
              Create Assessment
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
