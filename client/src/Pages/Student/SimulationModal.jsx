

import { useState, useRef } from "react";
import { FaTimes, FaExpand, FaCompress } from "react-icons/fa";

export default function SimulationModal({ url, onClose }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef(null);

  if (!url) return null;

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Request fullscreen
      if (modalRef.current.requestFullscreen) {
        modalRef.current.requestFullscreen();
      } else if (modalRef.current.webkitRequestFullscreen) {
        modalRef.current.webkitRequestFullscreen(); // Safari
      } else if (modalRef.current.msRequestFullscreen) {
        modalRef.current.msRequestFullscreen(); // IE11
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); // Safari
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen(); // IE11
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-fadeIn">
      <div
        ref={modalRef}
        className={`relative bg-gray-900 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 
          ${isFullscreen ? "w-full h-full rounded-none" : "w-11/12 h-5/6"}`}
      >
        {/* Header Controls */}
        <div className="absolute top-2 right-2 flex items-center space-x-2 z-10">
          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="bg-gray-800 text-white p-2 rounded-full hover:bg-green-600 transition"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="bg-gray-800 text-white p-2 rounded-full hover:bg-red-600 transition"
            title="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Iframe */}
        <iframe
          src={url}
          width="100%"
          height="100%"
          allowFullScreen
          className="rounded-lg"
          title="Simulation"
        ></iframe>
      </div>
    </div>
  );
}

