import { FiSearch, FiBell } from "react-icons/fi";
import { MdSmartToy } from "react-icons/md";
import { Link } from "react-router-dom";

function StudentNavbar({
  searchTerm = "",
  onSearchChange,
  onAdd,
  buttonLabel = "+ Add Principal",
  searchPlaceholder = "Search by name or email...",
}) {
  return (
    <div className="flex justify-between items-center mb-6">
      {onSearchChange ? (
        <div className="flex items-center bg-gray-800 px-4 py-2 rounded w-full max-w-md">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent outline-none w-full text-white placeholder-gray-400"
          />
        </div>
      ) : (
        <div />
      )}

      <div className="flex items-center space-x-6">
        <Link
          to="/student/ai-assistant"
          className="flex items-center bg-blue-600 px-3 py-1.5 rounded text-sm font-semibold text-white hover:bg-blue-700"
        >
          <MdSmartToy size={18} className="mr-1" />
          Ask Egyan AI
        </Link>

        {onAdd && (
          <button
            onClick={onAdd}
            className="bg-blue-600 px-4 py-1 rounded text-sm font-semibold text-white"
          >
            {buttonLabel}
          </button>
        )}

        <FiBell size={22} className="cursor-pointer text-white hidden sm:block" />

        <Link to="/student/profile">
          <img
            src="/user.png"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
        </Link>
      </div>
    </div>
  );
}

export default StudentNavbar;
