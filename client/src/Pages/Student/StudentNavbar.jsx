// import { FiSearch, FiBell } from "react-icons/fi";
// import { MdSmartToy } from "react-icons/md";
// import { Link } from "react-router-dom";

// function StudentNavbar({
//   searchTerm = "",
//   onSearchChange,
//   onAdd,
//   buttonLabel = "+ Add Principal",
//   searchPlaceholder = "Search by name or email...",
// }) {
//   return (
//     <div className="flex justify-between items-center mb-6">
//       {onSearchChange ? (
//         <div className="flex items-center bg-gray-800 px-4 py-2 rounded w-full max-w-md">
//           <FiSearch className="text-gray-400 mr-2" />
//           <input
//             type="text"
//             placeholder={searchPlaceholder}
//             value={searchTerm}
//             onChange={(e) => onSearchChange(e.target.value)}
//             className="bg-transparent outline-none w-full text-white placeholder-gray-400"
//           />
//         </div>
//       ) : (
//         <div />
//       )}

//       <div className="flex items-center space-x-6">
//         <Link
//           to="/student/ai-assistant"
//           className="flex items-center bg-blue-600 px-3 py-1.5 rounded text-sm font-semibold text-white hover:bg-blue-700"
//         >
//           <MdSmartToy size={18} className="mr-1" />
//           Ask Egyan AI
//         </Link>

//         {onAdd && (
//           <button
//             onClick={onAdd}
//             className="bg-blue-600 px-4 py-1 rounded text-sm font-semibold text-white"
//           >
//             {buttonLabel}
//           </button>
//         )}

//         <FiBell size={22} className="cursor-pointer text-white hidden sm:block" />

//         <Link to="/student/profile">
//           <img
//             src="/user.png"
//             alt="User"
//             className="w-8 h-8 rounded-full"
//           />
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default StudentNavbar;







import { FiSearch, FiBell } from "react-icons/fi";
import { MdSmartToy } from "react-icons/md";
import { AiOutlineScan } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

function StudentNavbar({
  searchTerm = "",
  onSearchChange,
  onAdd,
  buttonLabel = "+ Add Principal",
  searchPlaceholder = "Search by name or email...",
}) {
  const [showScanner, setShowScanner] = useState(false);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (!showScanner) return;

    const html5QrCode = new Html5Qrcode("qr-reader");

    html5QrCode
      .start(
        { facingMode: { exact: "environment" } }, 
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          console.log("✅ Scanned QR:", decodedText);

          html5QrCode.stop().then(() => {
            html5QrCode.clear();
            setShowScanner(false);
          });
        },
        () => {}
      )
      .catch((err) => {
        console.error("Camera start error:", err);
      });

    return () => {
      html5QrCode
        .stop()
        .then(() => html5QrCode.clear())
        .catch(() => {});
    };
  }, [showScanner]);

  return (
    <>
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

        <div className="flex items-center space-x-4">
          {/* 🔹 Scan Button (Mobile only) */}
          <button
            onClick={() => setShowScanner(true)}
            className="md:hidden flex items-center bg-green-600 px-3 py-1.5 rounded text-sm font-semibold text-white"
          >
            <AiOutlineScan size={18} className="mr-1" />
            Scan
          </button>

          <Link
            to="/student/ai-assistant"
            className="hidden sm:flex items-center bg-blue-600 px-3 py-1.5 rounded text-sm font-semibold text-white hover:bg-blue-700"
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
            <img src="/user.png" alt="User" className="w-8 h-8 rounded-full" />
          </Link>
        </div>
      </div>

      {/* 🔹 Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-80">
            <div id="qr-reader" />
            <button
              onClick={() => setShowScanner(false)}
              className="mt-3 w-full bg-red-600 text-white py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default StudentNavbar;
