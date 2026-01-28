import { useRef, useState, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import {
  FaPencilAlt,
  FaEraser,
  FaTimes,
  FaUpload,
  FaPlus,
  FaArrowLeft,
  FaArrowRight,
  FaMinus,
  FaExpand,
  FaCompress,
  FaBars,
} from "react-icons/fa";

export default function Whiteboard({ onClose }) {
  const canvasRef = useRef(null);
  const whiteboardRef = useRef(null);
  const fileInputRef = useRef(null);

  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(4);
  const [pages, setPages] = useState([""]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* ---------------- FULLSCREEN ---------------- */
  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      whiteboardRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  /* ---------------- COLOR ---------------- */
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.eraseMode(false);
      canvasRef.current._strokeColor = color;
    }
  }, [color]);

  /* ---------------- PAGES ---------------- */
  const savePageData = async () => {
    const data = await canvasRef.current.exportPaths();
    const updated = [...pages];
    updated[currentPage] = JSON.stringify(data);
    setPages(updated);
  };

  const loadPageData = () => {
    canvasRef.current.resetCanvas();
    const data = pages[currentPage];
    if (data) canvasRef.current.loadPaths(JSON.parse(data));
  };

  const addNewPage = async () => {
    await savePageData();
    setPages([...pages, ""]);
    setCurrentPage(pages.length);
    setTimeout(loadPageData, 200);
  };

  const nextPage = async () => {
    if (currentPage < pages.length - 1) {
      await savePageData();
      setCurrentPage(currentPage + 1);
      setTimeout(loadPageData, 200);
    }
  };

  const prevPage = async () => {
    if (currentPage > 0) {
      await savePageData();
      setCurrentPage(currentPage - 1);
      setTimeout(loadPageData, 200);
    }
  };

  /* ---------------- IMAGE UPLOAD ---------------- */
  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      canvasRef.current.addImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      ref={whiteboardRef}
      className="w-full h-full bg-white rounded-lg relative overflow-hidden"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-50 bg-red-600 text-white p-2 rounded-full"
      >
        <FaTimes />
      </button>

      {/* Fullscreen */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 left-14 z-50 bg-blue-600 text-white p-2 rounded-full"
      >
        {isFullscreen ? <FaCompress /> : <FaExpand />}
      </button>

      {/* Canvas */}
      <ReactSketchCanvas
        ref={canvasRef}
        strokeColor={color}
        strokeWidth={size}
        canvasColor="white"
        className="w-full h-[100vh]"
      />

      {/* Page Info */}
      <div className="absolute top-4 right-6 bg-black text-white px-4 py-2 rounded-full font-bold">
        Page {currentPage + 1} / {pages.length}
      </div>

      {/* 📱 Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen((p) => !p)}
        className="fixed bottom-12 left-8 z-50 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg"
      >
        <FaBars />
      </button>

      {/* Toolbar */}
      <div
        className={`
          fixed z-40 bg-white/90  backdrop-blur-xl border-2 border-gray-400 shadow-2xl
          md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:flex md:flex-row md:gap-4 md:rounded-full md:p-4
          ${isMobileMenuOpen
            ? "bottom-20 left-4 flex flex-col gap-3 p-4 rounded-2xl"
            : "hidden md:flex"
          }
        `}
      >
        <Tool
          label="Pencil"
          onClick={() => {
            setColor("#000");
            canvasRef.current.eraseMode(false);
          }}
          bg="bg-blue-500"
        >
          <FaPencilAlt />
        </Tool>

        <Tool
          label="Eraser"
          onClick={() => canvasRef.current.eraseMode(true)}
          bg="bg-red-500"
        >
          <FaEraser />
        </Tool>

        <div className="relative group">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded-full border cursor-pointer"
          />

          <span
            className="
      absolute -top-8 left-1/2 -translate-x-1/2
      bg-black text-white text-xs px-2 py-1 rounded
      opacity-0 group-hover:opacity-100
      transition-opacity duration-200
      pointer-events-none
      whitespace-nowrap
    "
          >
            Color Picker
          </span>
        </div>


        <div className="relative group">
          <div className="flex items-center gap-2 bg-purple-500 text-black px-3 py-2 rounded-full">
            <button onClick={() => setSize((s) => Math.max(1, s - 1))}>-</button>
            <span>{size}</span>
            <button onClick={() => setSize((s) => s + 1)}>+</button>
          </div>

          <span
            className="
      absolute -top-8 left-1/2 -translate-x-1/2
      bg-black text-white text-xs px-2 py-1 rounded
      opacity-0 group-hover:opacity-100
      transition-opacity duration-200
      pointer-events-none
      whitespace-nowrap
    "
          >
            Brush Size
          </span>
        </div>


        <Tool label="Undo" onClick={() => canvasRef.current.undo()} bg="bg-yellow-400" text="text-black">
          Undo
        </Tool>

        <Tool label="Clear Canvas" onClick={() => canvasRef.current.clearCanvas()} bg="bg-red-600">
          Clear
        </Tool>

        <Tool label="Upload Image" onClick={() => fileInputRef.current.click()} bg="bg-teal-500">
          <FaUpload />
        </Tool>

        <Tool label="Previous Page" onClick={prevPage} bg="bg-gray-500">
          <FaArrowLeft />
        </Tool>

        <Tool label="Add Page" onClick={addNewPage} bg="bg-green-500">
          <FaPlus />
        </Tool>

        <Tool label="Next Page" onClick={nextPage} bg="bg-gray-500">
          <FaArrowRight />
        </Tool>
      </div>
    </div>
  );
}

/* 🔧 Reusable Tool Button */
const Tool = ({ children, onClick, bg, text = "text-white", label }) => {
  return (
    <div className="relative group flex justify-center">
      <button
        onClick={onClick}
        className={`
          w-12 h-12 rounded-full flex items-center justify-center
          ${bg} ${text}
          hover:scale-110 transition
        `}
      >
        {children}
      </button>

      {/* Tooltip */}
      {label && (
        <div
          className="
            absolute -top-9 left-1/2 -translate-x-1/2
            bg-black text-white text-xs px-2 py-1 rounded
            opacity-0 group-hover:opacity-100
            transition-all duration-200
            whitespace-nowrap pointer-events-none
          "
        >
          {label}
        </div>
      )}
    </div>
  );
};
