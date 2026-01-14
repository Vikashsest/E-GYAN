import { useState, useEffect } from "react";
import { MdSmartToy } from "react-icons/md";
import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";
import axios from "axios";
export default function StudentAIAssistant({
  selectedClass,
  selectedSubject,
  selectedBook,
  selectedChapter,
}) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I am your Study Assistant! Ask me anything.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  console.log("api url", API_URL);
  const sendMessage = async () => {
    console.log("buttionclicked");

    // if (!input.trim() || !selectedChapter) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setLoading(true);
    console.log("buttionclicked 2");
    try {
      const res = await axios.post(`${API_URL}/ai/ask-doubt`, {
        question: input,
        classId: selectedClass?.id,
        subject: selectedSubject,
        bookId: selectedBook?.id,
        chapterId: selectedChapter?.id,
      });
      console.log("buttionclicked 3");
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.answer || "No answer found." },
      ]);
    } catch (err) {
      if (err.response) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `Error ${err.response.status}: ${err.response.data}`,
          },
        ]);
      } else if (err.request) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ CORS or Network issue, request blocked." },
        ]);
      } else {
        // Other errors
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `Error: ${err.message}` },
        ]);
      }
    }

    setInput("");
    setLoading(false);
  };

  // Show chapter name
  const chapterName = selectedChapter?.chapterName || "Select a chapter";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 ml-0 lg:ml-64 bg-sidebarbg">
        {/* Navbar */}

        {/* Page content */}
        <div className="flex flex-col flex-1 p-4 space-y-3">
          {/* Chat header */}
          <div className="flex items-center bg-primaryBlue px-4 py-2 rounded text-primaryWhite font-semibold">
            <MdSmartToy className="mr-2" />
            AI Assistant - {chapterName}
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto bg-gray800 rounded p-3 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-primaryBlue text-primaryWhite ml-auto"
                    : "bg-gray700 text-gray300"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="text-gray400 text-sm">AI is typing...</div>
            )}
          </div>

          {/* Input box */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={input}
              placeholder="Ask any question about this chapter..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-gray700 text-primaryWhite px-3 py-2 rounded outline-none placeholder-gray400"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-primaryBlue px-4 py-2 rounded text-primaryWhite hover:bg-hoverBlue font-semibold disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
