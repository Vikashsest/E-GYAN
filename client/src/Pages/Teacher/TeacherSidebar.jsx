// import { FaUsers, FaBook, FaTachometerAlt, FaBookOpen } from "react-icons/fa";
// import { MdAssignmentAdd, MdManageAccounts } from "react-icons/md";
// import { Link } from "react-router-dom";
// import Logout from "../Auth/Logout";

// export default function Sidebar() {
//   return (
//     <aside className="fixed top-0 left-0 h-screen w-64 bg-[#15161e] p-6 flex flex-col justify-between z-50">
//       <div>
//         <h1 className="text-2xl font-bold flex items-center space-x-2 mb-8">
//           <span className="bg-blue-600 w-2.5 h-2.5 rounded-sm"></span>
//           <span className="text-gray-300">Dashboard</span>
//         </h1>

//         <nav className="space-y-6">
//           <div>
//             <ul className="space-y-5">
//               <Link
//                 className="flex items-center space-x-2"
//                 to="/teacher/dashboard"
//               >
//                 <li className="flex items-center space-x-2 text-gray-300">
//                   <FaTachometerAlt />
//                   <span>Dashboard</span>
//                 </li>
//               </Link>
//               {/* <Link
//                 className="flex items-center space-x-2"
//                 to="/teacher/students"
//               >
//                 <li className="flex items-center space-x-2 text-gray-300">
//                   <FaUsers />
//                   <span>Manage Students</span>
//                 </li>
//               </Link> */}
//               <Link className="flex items-center space-x-2" to="/teacher/books">
//                 <li className="flex items-center space-x-2 text-gray-300">
//                   <FaBook />
//                   <span> Manage Books</span>
//                 </li>
//               </Link>
//               <Link className="flex items-center space-x-2" to="/students">
//                 <li className="flex items-center space-x-2 text-gray-300">
//                   <MdAssignmentAdd />
//                   <span>Assign Books</span>
//                 </li>
//               </Link>
//               <Link className="flex items-center space-x-2" to="/teacher/role">
//                 <li className="flex items-center space-x-2 text-gray-300">
//                   <MdManageAccounts />
//                   <span>Role Management</span>
//                 </li>
//               </Link>
//               <Link
//                 className="flex items-center space-x-2"
//                 to="/teacher/upload-books"
//               >
//                 <li className="flex items-center space-x-2 text-gray-300">
//                   <FaBookOpen />
//                   <span>My Books</span>
//                 </li>
//               </Link>
//             </ul>
//           </div>
//         </nav>
//       </div>

//       <div>
//         <Logout />
//       </div>
//     </aside>
//   );
// }











import {
  FaBook,
  FaTachometerAlt,
  FaBookOpen,
} from "react-icons/fa";
import { MdAssignmentAdd, MdManageAccounts } from "react-icons/md";
import { Link } from "react-router-dom";
import Logout from "../Auth/Logout";
import { FiX } from "react-icons/fi";

export default function TeacherSidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-[#15161e] p-6 flex flex-col justify-between z-50
      transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
    >
      {/* Close button (mobile only) */}
      <button
        className="absolute top-4 right-4 text-white lg:hidden"
        onClick={onClose}
      >
        <FiX size={26} />
      </button>

      <div>
        <h1 className="text-2xl font-bold flex items-center space-x-2 mb-8">
          <span className="bg-blue-600 w-2.5 h-2.5 rounded-sm"></span>
          <span className="text-gray-300">Dashboard</span>
        </h1>

        <nav className="space-y-6">
          <ul className="space-y-5">
            <div>
            <Link to="/teacher/dashboard">
              <li className="flex items-center space-x-2 text-gray-300">
                <FaTachometerAlt />
                <span>Dashboard</span>
              </li>
            </Link>
            </div>

            <div>
            <Link to="/teacher/books">
              <li className="flex items-center space-x-2 text-gray-300">
                <FaBook />
                <span>Manage Books</span>
              </li>
            </Link>
            </div>

            <div>
            <Link to="/students">
              <li className="flex items-center space-x-2 text-gray-300">
                <MdAssignmentAdd />
                <span>Assign Books</span>
              </li>
            </Link>
            </div>

            <div>
            <Link to="/teacher/role">
              <li className="flex items-center space-x-2 text-gray-300">
                <MdManageAccounts />
                <span>Role Management</span>
              </li>
            </Link>
            </div> 

            <div>
            <Link to="/teacher/upload-books">
              <li className="flex items-center space-x-2 text-gray-300">
                <FaBookOpen />
                <span>My Books</span>
              </li>
            </Link>
            </div>
          </ul>
        </nav>
      </div>

      <Logout />
    </aside>
  );
}
