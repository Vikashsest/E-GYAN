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
  FaCompress
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

  // Handle Fullscreen Change Event
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

  // Color + Eraser Logic
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.eraseMode(false);
      canvasRef.current._strokeColor = color;
    }
  }, [color]);

  const savePageData = async () => {
    const data = await canvasRef.current.exportPaths();
    const updatedPages = [...pages];
    updatedPages[currentPage] = JSON.stringify(data);
    setPages(updatedPages);
  };

  const loadPageData = () => {
    const data = pages[currentPage];
    canvasRef.current.resetCanvas();
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
      className="w-full h-full bg-white text-black rounded-lg relative overflow-hidden"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-50 bg-red-600 text-white p-2 rounded-full hover:scale-110 shadow"
      >
        <FaTimes />
      </button>

      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-5 right-6 z-50 bg-blue-600 text-white p-2 rounded-full hover:scale-110 shadow"
        title="Toggle Fullscreen"
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

      {/* Page Indicator */}
      <div className="absolute top-4 right-6 bg-black text-white px-4 py-2 rounded-full shadow-lg font-bold">
        Page {currentPage + 1} / {pages.length}
      </div>

      {/* Bottom Toolbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl p-4 rounded-full flex gap-4 shadow-2xl z-50 border border-gray-300">

        {/* Pencil */}
        <button
          onClick={() => {
            setColor("#000000");
            canvasRef.current.eraseMode(false);
          }}
          className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:scale-110"
          title="Pencil"
        >
          <FaPencilAlt size={18} />
        </button>

        {/* Eraser */}
        <button
          onClick={() => {
            setColor("white");
            canvasRef.current.eraseMode(true);
          }}
          className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110"
          title="Eraser"
        >
          <FaEraser size={18} />
        </button>

        {/* Color Picker */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded-full border-2 border-black cursor-pointer"
        />

        {/* Brush Size */}
        <div className="flex items-center gap-2 bg-purple-500 text-white px-3 py-2 rounded-full text-sm">
          <button onClick={() => setSize((s) => Math.max(1, s - 1))}>-</button>
          <span>{size}</span>
          <button onClick={() => setSize((s) => s + 1)}>+</button>
        </div>

        {/* Undo */}
        <button
          onClick={() => canvasRef.current.undo()}
          className="bg-yellow-400 px-3 py-2 rounded-full hover:scale-110 font-bold"
        >
          Undo
        </button>

        {/* Clear */}
        <button
          onClick={() => canvasRef.current.clearCanvas()}
          className="bg-red-600 px-3 py-2 rounded-full text-white hover:scale-110"
        >
          Clear
        </button>

        {/* Upload Image */}
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-teal-500 text-white px-3 py-2 rounded-full hover:scale-110"
        >
          <FaUpload />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={uploadImage}
          className="hidden"
        />

        {/* Delete Page */}
        <button
          onClick={async () => {
            if (pages.length <= 1) {
              alert("At least one page is required!");
              return;
            }

            await savePageData();
            const updated = pages.filter((_, i) => i !== currentPage);
            const newIndex = Math.max(0, currentPage - 1);

            setPages(updated);
            setCurrentPage(newIndex);

            setTimeout(loadPageData, 200);
          }}
          className="bg-red-700 text-white px-3 py-2 rounded-full hover:scale-110 font-bold"
        >
          <FaMinus />
        </button>

        {/* Prev Page */}
        <button
          disabled={currentPage === 0}
          onClick={prevPage}
          className="bg-gray-500 text-white px-3 py-2 rounded-full hover:scale-110 disabled:opacity-30"
        >
          <FaArrowLeft />
        </button>

        {/* Add page */}
        <button
          onClick={addNewPage}
          className="bg-green-500 text-white px-3 py-2 rounded-full hover:scale-110"
        >
          <FaPlus />
        </button>

        {/* Next Page */}
        <button
          disabled={currentPage === pages.length - 1}
          onClick={nextPage}
          className="bg-gray-500 text-white px-3 py-2 rounded-full hover:scale-110 disabled:opacity-30"
        >
          <FaArrowRight />
        </button>

        {/* Save Image */}
        <button
          onClick={async () => {
            try {
              const dataUrl = await canvasRef.current.exportImage("png");
              const link = document.createElement("a");
              link.href = dataUrl;
              link.download = "whiteboard.png";
              link.click();
            } catch (err) {
              console.error("Export error:", err);
            }
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-full hover:scale-110 text-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
}
