import TeacherSidebar from "./TeacherSidebar";
import TeacherNavbar from "./TeacherNavbar";
import RoleManagement from "../../Components/RoleManagement";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";

export default function TeacherRolePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-darkBg text-white">
      {/* Sidebar */}
      <TeacherSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 lg:pl-[280px] p-5">

        {/* Mobile menu */}
        <div className="lg:hidden mb-4">
          <button onClick={() => setIsSidebarOpen(true)}>
            <FiMenu size={28} />
          </button>
        </div>
        <TeacherNavbar />
        <RoleManagement currentUserRole="teacher" />
      </main>
    </div>
  );
}
