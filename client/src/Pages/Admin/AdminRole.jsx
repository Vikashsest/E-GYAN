import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import RoleManagement from "../../Components/RoleManagement";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";

export default function AdminRolePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:pl-[280px] py-6 px-5 w-full">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden px-4 mb-4">
          <button onClick={() => setIsSidebarOpen(true)} className="text-white">
            <FiMenu size={28} />
          </button>
        </div>

        <AdminNavbar/>
        <RoleManagement currentUserRole="admin" />
      </main>
    </div>
  );
}
