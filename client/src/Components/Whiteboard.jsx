import { useRef, useState, useEffect } from "react";

export default function Whiteboard() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lineColor, setLineColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(4);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    ctxRef.current = ctx;
  }, [lineColor, lineWidth]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    saveState();
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = ctxRef.current;
    ctx.closePath();
    setIsDrawing(false);
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    setUndoStack((prev) => [...prev, dataURL]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const lastState = undoStack.pop();
    setRedoStack((prev) => [...prev, lastState]);

    const img = new Image();
    img.src = undoStack[undoStack.length - 1];
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const nextState = redoStack.pop();
    setUndoStack((prev) => [...prev, nextState]);

    const img = new Image();
    img.src = nextState;
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const savePNG = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const activateEraser = () => {
    setLineColor("#ffffff");
    setLineWidth(25);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-gray-100 p-3 border-b shadow">
        <label className="flex items-center gap-2 bg-blue-500 text-white rounded">
          🎨 Color
          <input
            type="color"
            value={lineColor}
            onChange={(e) => setLineColor(e.target.value)}
            className="w-8 h-8"
          />
        </label>

        <label className="flex items-center gap-2">
          📏 Size
          <input
            type="range"
            min="2"
            max="30"
            value={lineWidth}
            onChange={(e) => setLineWidth(e.target.value)}
          />
        </label>

        <button
          onClick={() => setLineColor("#000000")}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          ✏ Pencil
        </button>

        <button
          onClick={activateEraser}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          🩹 Eraser
        </button>

        <button
          onClick={undo}
          className="px-3 py-1 bg-gray-600 text-white rounded"
        >
          ↩ Undo
        </button>

        <button
          onClick={redo}
          className="px-3 py-1 bg-gray-600 text-white rounded"
        >
          ↪ Redo
        </button>

        <button
          onClick={clearCanvas}
          className="px-3 py-1 bg-orange-500 text-white rounded"
        >
          🧹 Clear
        </button>

        <button
          onClick={savePNG}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          💾 Save
        </button>
      </div>

      {/* Canvas Area */}
      <canvas
        ref={canvasRef}
        className="flex-1 bg-white cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}
