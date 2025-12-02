import { useRef, useState, useEffect } from "react";
import {
  FaPencilAlt,
  FaEraser,
  FaFont,
  FaTimes,
  FaUpload,
} from "react-icons/fa";

export default function Whiteboard() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lineColor, setLineColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(4);
  const [tool, setTool] = useState("pencil");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [objects, setObjects] = useState([]);
  const [visible, setIsVisible] = useState(true);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
  }, []);
  useEffect(() => {
    if (!ctxRef.current) return;
    ctxRef.current.strokeStyle = lineColor;
  }, [lineColor]);

  useEffect(() => {
    if (!ctxRef.current) return;
    ctxRef.current.lineWidth = lineWidth;
  }, [lineWidth]);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (tool === "pencil") canvasRef.current.style.cursor = "crosshair";
    else if (tool === "eraser") canvasRef.current.style.cursor = "pointer";
    else canvasRef.current.style.cursor = "text";
  }, [tool]);

  const hideButton = () => {
    visible(true);
  };
  const saveState = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    setUndoStack((prev) => [...prev, dataURL]);
  };

  const startDrawing = (e) => {
    const ctx = ctxRef.current;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    saveState();

    if (tool === "text") {
      const input = document.createElement("input");
      input.type = "text";
      input.style.position = "absolute";
      input.style.left = `${x}px`;
      input.style.top = `${y}px`;
      input.style.font = `${lineWidth * 4}px sans-serif`;
      input.style.color = lineColor;
      input.style.border = "1px dashed gray";
      document.body.appendChild(input);
      input.focus();

      input.onblur = () => {
        const val = input.value;
        if (val) {
          setObjects((prev) => [
            ...prev,
            {
              type: "text",
              x,
              y,
              text: val,
              color: lineColor,
              fontSize: lineWidth * 4,
            },
          ]);
          redrawCanvas();
        }
        document.body.removeChild(input);
      };
      return;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (tool === "pencil") {
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === "eraser") {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 25;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    const ctx = ctxRef.current;
    ctx.closePath();
    setIsDrawing(false);
  };

  const redrawCanvas = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach((obj) => {
      if (obj.type === "text") {
        ctx.font = `${obj.fontSize}px sans-serif`;
        ctx.fillStyle = obj.color || "#000";
        ctx.fillText(obj.text, obj.x, obj.y + obj.fontSize);
      }
    });
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.src = ev.target.result;
      img.onload = () => {
        const ctx = ctxRef.current;
        ctx.drawImage(img, 50, 50, img.width / 2, img.height / 2);
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white text-black rounded-lg overflow-hidden relative">
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => {
            // User-defined back action
            console.log("Back clicked");
            // Example: hide whiteboard

            setIsVisible(false);
          }}
          className="bg-red-600 text-white p-2 rounded-full shadow hover:scale-110 transition-all"
          title="Back / Cut"
        >
          <FaTimes size={18} />
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="flex-1 bg-white cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      {/* Bottom Toolbar */}
      <div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2
       flex items-center gap-4 bg-gray-200 rounded-full p-3 shadow-lg z-50"
      >
        {/* Pencil */}
        <div
          className="cursor-pointer hover:scale-110 transition-all"
          onClick={() => setTool("pencil")}
          title="Pencil"
        >
          <FaPencilAlt size={20} />
        </div>

        {/* Eraser */}
        <div
          className="cursor-pointer hover:scale-110 transition-all"
          onClick={() => setTool("eraser")}
          title="Eraser"
        >
          <FaEraser size={20} />
        </div>

        {/* Text */}
        <div
          className="cursor-pointer hover:scale-110 transition-all"
          onClick={() => setTool("text")}
          title="Text"
        >
          <FaFont size={20} />
        </div>

        {/* Color Picker */}
        <input
          type="color"
          value={lineColor}
          onChange={(e) => setLineColor(e.target.value)}
          className="w-8 h-8 cursor-pointer rounded-full border"
          title="Pick Color"
        />

        {/* Brush Size */}
        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full">
          <button
            onClick={() => setLineWidth((prev) => Math.max(1, prev - 1))}
            className="px-2 text-lg font-bold"
          >
            -
          </button>

          <span className="text-sm w-6 text-center">{lineWidth}</span>

          <button
            onClick={() => setLineWidth((prev) => prev + 1)}
            className="px-2 text-lg font-bold"
          >
            +
          </button>
        </div>

        {/* Upload Image */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleUpload}
        />
        <div
          className="cursor-pointer hover:scale-110 transition-all"
          onClick={() => fileInputRef.current.click()}
          title="Upload Image"
        >
          <FaUpload size={20} />
        </div>
      </div>
    </div>
  );
}
