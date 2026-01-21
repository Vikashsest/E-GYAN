import { useState, useEffect, useRef } from "react";
import { MdSmartToy } from "react-icons/md";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import StudentSidebar from "./StudentSidebar";

const API_URL = import.meta.env.VITE_API_URL;

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
      suggestions: [],
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(false);
  const [micStatusText, setMicStatusText] = useState("");

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ---------------- SPEECH RECOGNITION ---------------- */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setMicStatusText("🎙 Listening...");
    };

    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      setMicStatusText("");
    };

    recognition.onerror = () => {
      setIsListening(false);
      setMicStatusText("Mic error");
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => recognitionRef.current?.start();
  const stopListening = () => recognitionRef.current?.stop();

  /* ---------------- TEXT TO SPEECH ---------------- */
  const speakText = (text) => {
    if (!isSpeakingEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userText }),
      });

      const contentType = res.headers.get("content-type");
      let botMsg = { sender: "bot", text: "", suggestions: [] };

      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        botMsg.text = data.answer || "No response from AI.";
        botMsg.suggestions = data.suggestions || [];
      } else {
        botMsg.text = await res.text();
      }

      setMessages((prev) => [...prev, botMsg]);
      speakText(botMsg.text);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ AI service error. Please try again.",
          suggestions: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="flex h-screen overflow-hidden">
      <StudentSidebar isOpen={false} onClose={() => {}} />

      <div className="flex flex-col flex-1 ml-0 lg:ml-64 bg-sidebarbg">
        {/* HEADER */}
        <div className="flex items-center bg-primaryBlue px-4 py-2 text-white font-semibold">
          <MdSmartToy className="mr-2" />
          AI Study Assistant
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray800">
          {messages.map((msg, idx) => (
            <div key={idx} className="space-y-2">
              {/* MESSAGE */}
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-primaryBlue text-white ml-auto"
                    : "bg-gray700 text-gray300"
                }`}
              >
                {msg.text}
              </div>

              {/* 🔥 VIDEO CARD UI */}
              {msg.suggestions?.length > 0 && (
                <div className="ml-2">
                  <div className="text-xs text-gray400 font-semibold mb-2">
                    Suggested Videos
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {msg.suggestions.map((s, i) => {
                      const imgQuery = s.query.replaceAll(" ", "+");

                      return (
                        <a
                          key={i}
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                            s.query,
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-gray700 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                        >
                          <img
                            src={`https://source.unsplash.com/featured/?${imgQuery}`}
                            alt={s.title}
                            className="w-full h-28 object-cover"
                          />

                          <div className="p-3">
                            <div className="text-sm text-white font-semibold line-clamp-2">
                              {s.title}
                            </div>
                            <div className="text-xs text-gray400 mt-1">
                              YouTube • Click to watch
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="text-gray400 text-sm">AI is typing...</div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* MIC STATUS */}
        {micStatusText && (
          <div className="px-4 py-1 text-sm text-yellow-300">
            {micStatusText}
          </div>
        )}

        {/* INPUT */}
        <div className="p-3 flex items-center gap-2 bg-gray900">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask any question..."
            className="flex-1 px-3 py-2 rounded bg-gray700 text-white outline-none"
          />

          <button
            onClick={isListening ? stopListening : startListening}
            className={`px-3 py-2 rounded ${
              isListening ? "bg-red-600" : "bg-gray700"
            }`}
          >
            {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>

          <button
            onClick={() => setIsSpeakingEnabled((p) => !p)}
            className="px-3 py-2 rounded bg-gray700"
          >
            {isSpeakingEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>

          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-4 py-2 bg-primaryBlue rounded text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
