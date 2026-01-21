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
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(false);
  const [micStatusText, setMicStatusText] = useState("");

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setMicStatusText("Mic is ON (Listening...)");
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onend = () => {
      setMicStatusText("Mic stopped");
      setIsListening(false);
    };

    recognition.onerror = () => {
      setMicStatusText("Mic error");
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      setMicStatusText("Your browser doesn't support Speech Recognition.");
      return;
    }
    recognitionRef.current.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setMicStatusText("Mic stopped");
    setIsListening(false);
  };

  // Text-to-Speech
  const speakText = (text) => {
    if (!isSpeakingEnabled) return;

    const synth = window.speechSynthesis;
    if (!synth) return;

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    synth.speak(utterance);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errText}`);
      }

      // 🔥 IMPORTANT: Check content-type
      const contentType = res.headers.get("content-type");
      let answer = "";

      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        answer = data.answer || data.message || "No response from AI.";
      } else {
        // If response is plain text
        answer = await res.text();
      }

      setMessages((prev) => [...prev, { sender: "bot", text: answer }]);
      speakText(answer);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Gemini API Error. Please try again." },
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
            AI Assistant
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

            {loading && (
              <div className="text-gray400 text-sm">AI is typing...</div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Mic status text */}
          {micStatusText && (
            <div className="text-sm text-yellow-300 font-semibold">
              {micStatusText}
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={input}
              placeholder="Ask any question..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-gray700 text-primaryWhite px-3 py-2 rounded outline-none placeholder-gray400"
            />

            {/* Mic Button */}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`px-4 py-2 rounded font-semibold ${
                isListening
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-gray700 text-white"
              }`}
            >
              {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>

            {/* Speaker Button */}
            <button
              onClick={() => setIsSpeakingEnabled((prev) => !prev)}
              className="bg-gray700 px-4 py-2 rounded text-primaryWhite hover:bg-gray600 font-semibold"
            >
              {isSpeakingEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>

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
