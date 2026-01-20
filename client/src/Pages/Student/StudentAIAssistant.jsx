import { useState } from "react";
import { MdSmartToy } from "react-icons/md";
import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";
import { askGemini } from "../../apiServices/aiService";

export default function StudentAIAssistant({
  selectedClass,
  selectedSubject,
  selectedBook,
  selectedChapter,
}) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I am your Study Assistant! Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: input }]);
    setLoading(true);

    try {
      const res = await askGemini(input);

      const answer = res.message?.content?.[0]?.text || "No response from AI.";

      setMessages(prev => [...prev, { sender: "bot", text: answer }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "⚠️ Gemini API Error. Please try again." }
      ]);
    }

    setInput("");
    setLoading(false);
  };

  const chapterName = selectedChapter?.chapterName || "Select a chapter";

  return (
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar isOpen={false} onClose={() => {}} />
      <div className="flex flex-col flex-1 ml-0 lg:ml-64 bg-sidebarbg">
        <div className="flex flex-col flex-1 p-4 space-y-3">
          <div className="flex items-center bg-primaryBlue px-4 py-2 rounded text-primaryWhite font-semibold">
            <MdSmartToy className="mr-2" />
            AI Assistant - {chapterName}
          </div>

          <div className="flex-1 overflow-y-auto bg-gray800 rounded p-3 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-primaryBlue text-primaryWhite ml-auto"
                    : "bg-gray700 text-gray300"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-gray400 text-sm">AI is typing...</div>}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={input}
              placeholder="Ask any question..."
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
