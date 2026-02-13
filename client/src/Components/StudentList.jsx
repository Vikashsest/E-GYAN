import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate } from "react-icons/fa";
import TeacherSidebar from "../Pages/Teacher/TeacherSidebar";
import TeacherNavbar from "../Pages/Teacher/TeacherNavbar";
import { toast } from "react-toastify";
import { useLoader } from "../LoaderContext";

export default function StudentList() {
  const {setLoading} = useLoader()
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/student-book-assign`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch students");

        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error(error);
        toast.error("❌ Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <TeacherSidebar />
      <main className="flex-1 pl-[280px] pr-6 py-6">
        <TeacherNavbar />

        <h2 className="text-3xl font-bold mb-8 text-center">All Students</h2>

       
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-[#26273c] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    <FaUserGraduate />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {student.username}
                    </h3>
                    <p className="text-gray-400 text-sm">{student.email}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() =>
                      navigate(`/teacher/assign-book/${student.id}`)
                    }
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 transition-all text-white font-semibold py-2 px-4 rounded-xl shadow-md"
                  >
                    Assign Book
                  </button>
                </div>
              </div>
            ))}
          </div>
      </main>
    </div>
  );
}
