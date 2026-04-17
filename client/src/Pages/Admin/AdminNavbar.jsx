// import { FiSearch, FiBell, FiInbox } from "react-icons/fi";
// import { Link, useNavigate } from "react-router-dom";

// function AdminNavbar({
//   searchTerm = "",
//   onSearchChange,
//   onAdd,
//   onUpload,
//   buttonLabel,
//   uploadLabel = "Upload Credentials +",
//   searchPlaceholder = "Search by name or email...",
//   notificationsCount = 0,
//   requestCount = 0,
//   onlineUsersCount = 0,
// }) {
//   const navigate = useNavigate();

//   return (
//     <div className="flex justify-between items-center gap-4 mb-6">
//       {/* Search Bar */}
//       {onSearchChange ? (
//         <div className="flex items-center bg-darkBg px-4 py-2 rounded w-[70%] lg:w-full lg:max-w-md">
//           <FiSearch className="text-gray400 mr-2" />
//           <input
//             type="text"
//             placeholder={searchPlaceholder}
//             value={searchTerm}
//             onChange={(e) => onSearchChange(e.target.value)}
//             className="bg-transparent outline-none w-full placeholder-gray-400"
//           />
//         </div>
//       ) : (
//         <div />
//       )}
//       <div className="flex items-center space-x-6 relative">
//         {/* Upload Button */}
//         {onUpload && (
//           <button
//             onClick={onUpload}
//             className="bg-primaryBlue px-4 py-1 rounded text-sm font-semibold hover:bg-hoverBlue"
//           >
//             {uploadLabel}
//           </button>
//         )}

//         {/* Add Button */}
//         {onAdd && (
//           <button
//             onClick={onAdd}
//             className="bg-primaryBlue px-4 py-1 rounded text-sm font-semibold hover:bg-hoverBlue"
//           >
//             {buttonLabel}
//           </button>
//         )}
//         {/* Egyan Users Online (LeetCode Style + Tooltip) */}
//         <div className="relative group flex items-center gap-2 bg-darkBg px-3 py-1 rounded-lg shadow cursor-pointer">
//           {/* Green Pulsing Dot */}
//           <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />

//           {/* Count Text */}
//           <span className="text-green-400 font-semibold text-sm">
//             {onlineUsersCount} Online
//           </span>

//           {/* Hover Tooltip */}
//           <span
//             className="absolute top-full mt-1 left-1/2 -translate-x-1/2
//     bg-black text-white text-[12px] font-medium px-2 py-1 rounded opacity-0
//     group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap"
//           >
//             {onlineUsersCount} Egyan users studying now
//           </span>
//         </div>

//         <div className="relative group">
//           <FiBell
//             className="text-xl text-gray-300 cursor-pointer"
//             onClick={() => navigate("/concerns-list")}
//           />

//           {notificationsCount > 0 && (
//             <span className="absolute -top-2 -right-2 bg-primaryRed text-primaryWhite text-[10px] font-bold rounded-full px-1.5 py-0.5">
//               {notificationsCount}
//             </span>
//           )}

//           {/* Hover Tooltip */}
//           <span
//             className="absolute top-full mt-1 left-1/2 -translate-x-1/2
//     text-primaryWhite text-md font-semibold  px-2 py-1 rounded opacity-0
//     group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
//           >
//             Notifications
//           </span>
//         </div>

//         {/* Avatar */}
//         <div className="flex flex-col items-center">
//           <Link
//             to="/admin/profile"
//             className="flex flex-col items-center group relative"
//           >
//             <img
//               src="/user.png"
//               alt="User"
//               width={32}
//               height={32}
//               className="rounded-full cursor-pointer"
//             />
//             <span className="absolute top-full mt-1 text-primaryWhite font-semibold text-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//               Admin
//             </span>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }



// export default AdminNavbar;
import { FiSearch, FiBell, FiInbox } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function AdminNavbar({
  searchTerm = "",
  onSearchChange,
  onAdd,
  onUpload,
  buttonLabel,
  uploadLabel = "Upload Credentials +",
  searchPlaceholder = "Search by name or email...",
  notificationsCount = 0,
  requestCount = 0,
}) {
  const navigate = useNavigate();
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  useEffect(() => {
    // initial fetch (optional)
    fetch("https://silver-chough-578260.hostingersite.com/websocket/online-count", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setOnlineUsersCount(data.count))
      .catch(console.error);

    const socket = io("https://silver-chough-578260.hostingersite.com", {
      withCredentials: true,
    });

    socket.on("connect", () => console.log("Socket connected!"));
    socket.on("disconnect", () => console.log("Socket disconnected!"));

    socket.on("onlineCount", (count) => {
      console.log("Online users:", count);
      setOnlineUsersCount(count);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="flex justify-between items-center gap-4 mb-6">
      {/* Search Bar */}
      {onSearchChange ? (
        <div className="flex items-center bg-darkBg px-4 py-2 rounded w-[50%] md:w-[70%] lg:w-full lg:max-w-md">
          <FiSearch className="text-gray400 mr-2" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent outline-none w-full placeholder-gray-400"
          />
        </div>
      ) : (
        <div />
      )}

      <div className="flex items-center space-x-6 relative">
        {/* Upload Button */}
        {onUpload && (
          <button
            onClick={onUpload}
            className="bg-primaryBlue px-2 md:px-4 py-1 rounded text-xs md:text-sm font-semibold hover:bg-hoverBlue"
          >
            {uploadLabel}
          </button>
        )}

        {/* Add Button */}
        {onAdd && (
          <button
            onClick={onAdd}
            className="bg-primaryBlue px-4 py-1 rounded text-xs md:text-sm font-semibold hover:bg-hoverBlue"
          >
            {buttonLabel}
          </button>
        )}

        {/* Egyan Users Online */}
        <div className="relative group flex items-center gap-2 bg-darkBg px-3 py-1 rounded-lg shadow cursor-pointer">
          {/* Green Pulsing Dot */}
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />

          {/* Count Text */}
          <span className="text-green-400 font-semibold text-sm">
            {onlineUsersCount} Online
          </span>

          {/* Hover Tooltip */}
          <span
            className="absolute top-full mt-1 left-1/2 -translate-x-1/2 
          bg-black text-white text-[12px] font-medium px-2 py-1 rounded opacity-0 
          group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap"
          >
            {onlineUsersCount} Egyan users studying now
          </span>
        </div>

        {/* Notifications */}
        <div className="relative group">
          <FiBell
            className="text-xl text-gray-300 cursor-pointer"
            onClick={() => navigate("/concerns-list")}
          />
          {notificationsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primaryRed text-primaryWhite text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {notificationsCount}
            </span>
          )}
          <span
            className="absolute top-full mt-1 left-1/2 -translate-x-1/2 
          text-primaryWhite text-md font-semibold px-2 py-1 rounded opacity-0 
          group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          >
            Notifications
          </span>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <Link
            to="/admin/profile"
            className="flex flex-col items-center group relative"
          >
            <img
              src="/user.png"
              alt="User"
              width={32}
              height={32}
              className="rounded-full cursor-pointer"
            />
            <span className="absolute top-full mt-1 text-primaryWhite font-semibold text-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Admin
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;
