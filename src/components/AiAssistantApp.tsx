import React, { useState } from "react";
import {
  BotMessageSquare,
  ArrowUp,
  Sparkles,
  Info,
  Share2,
  Check,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const AiAssistantApp: React.FC = () => {
  const { preferences } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Assalamu Alaikum wa Rahmatullah! I am your Ilm AI Assistant. You can ask me questions regarding Islamic daily practices, Quranic verses, authentic Hadiths, Duas, and fasting etiquettes. How may I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const suggestedQuestions = [
    "What are the 12 Sunnah Rawatib prayers?",
    "Best Duas for anxiety and peace",
    "Fasting rules: Suhur cutoff time",
    "How is Zakat calculated on savings?",
    "Virtues of Surah Al-Kahf on Friday",
  ];

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInputQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          language: "English",
          context: {
            city: preferences.city,
            calculationMethod: preferences.calculationMethod,
            juristicSchool: preferences.juristicSchool,
          },
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        role: "assistant",
        content: data.answer || "Thank you for your question. Please try asking again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        role: "assistant",
        content:
          "Unable to connect to the knowledge server. Please check your connection or try again shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="ai-assistant-mini-app" className="space-y-3.5 pb-28">
      {/* iOS Header */}
      <div className="ios-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#007A78] text-white flex items-center justify-center shadow-xs">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-[#1C1C1E]">
              Ask Ilm AI
            </h2>
            <p className="text-[11px] text-[#8E8E93]">Islamic teachings, Quran context & daily fiqh</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#007A78] bg-[#007A78]/10 px-2.5 py-0.5 rounded-full">
          <Sparkles className="w-3 h-3" />
          <span>Gemini</span>
        </div>
      </div>

      {/* Scholarly Guidance Banner */}
      <div className="ios-card p-3 text-xs bg-[#FF9500]/5 border-[#FF9500]/20 flex items-start gap-2">
        <Info className="w-4 h-4 text-[#FF9500] shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#8E8E93] leading-relaxed">
          <span className="font-semibold text-[#1C1C1E]">Guidance:</span> References are from Quran and Sunnah. For binding legal verdicts (fatwa), please consult your local Islamic scholar.
        </p>
      </div>

      {/* Suggested Topics Carousel */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8E8E93] px-1 block">
          Suggested Topics
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {suggestedQuestions.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(sq)}
              className="px-3 py-1.5 rounded-full bg-white border border-black/[0.08] text-xs font-medium text-[#1C1C1E] hover:border-[#007A78] active:scale-95 whitespace-nowrap transition-all cursor-pointer shrink-0 shadow-xs"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Apple Messages Thread */}
      <div className="space-y-2.5 min-h-[300px]">
        {messages.map((msg) => {
          const isBot = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`p-3.5 transition-all ${
                isBot
                  ? "ios-card max-w-[92%]"
                  : "bg-[#007A78] text-white rounded-[20px] rounded-br-[4px] ml-auto max-w-[85%] shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/[0.06]">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-semibold ${isBot ? "text-[#1C1C1E]" : "text-white"}`}
                  >
                    {isBot ? "Ilm Assistant" : "You"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] ${isBot ? "text-[#8E8E93]" : "text-teal-200"}`}>
                    {msg.timestamp}
                  </span>
                  {isBot && (
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 text-[#8E8E93] hover:text-[#1C1C1E] rounded-full transition-colors cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-[#34C759]" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div
                className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  isBot ? "text-[#1C1C1E]" : "text-white"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="p-3.5 ios-card flex items-center gap-2 max-w-[80%]">
            <div className="w-4 h-4 border-2 border-[#007A78] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[#8E8E93]">
              Consulting Islamic knowledge base...
            </span>
          </div>
        )}
      </div>

      {/* iOS Floating Bottom Input Bar */}
      <div className="fixed bottom-14 inset-x-0 z-30 p-2.5 ios-blur border-t border-black/[0.08] max-w-lg mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            placeholder="Ask about Islamic practice or verses..."
            className="flex-1 px-4 py-2 text-xs sm:text-sm bg-white rounded-full border border-black/[0.08] text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#007A78]/30 transition-all shadow-xs"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || loading}
            className="w-8 h-8 rounded-full bg-[#007A78] hover:bg-[#006260] active:scale-95 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
