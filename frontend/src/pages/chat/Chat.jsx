import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Trash2,
  MessageCircle,
  Loader2,
  Bot,
} from "lucide-react";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { sendChatMessage } from "../../services/chatService";

const SUGGESTED_QUESTIONS = [
  "What is my biggest expense category?",
  "Am I on track with my budget?",
  "Which bills are pending?",
  "How can I save more money?",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 max-w-[75%]">
      <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-[#1C2C1A] to-[#365314] flex items-center justify-center shadow-xs">
        <Sparkles size={14} className="text-lime-300" />
      </div>
      <div className="bg-white border border-[#E0E6DC] rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs">
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-stone-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function UserBubble({ message }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[75%] bg-gradient-to-br from-[#1B2C19] to-[#2E4829] text-white rounded-2xl rounded-br-xs px-4 py-3 shadow-xs">
        <p className="text-sm leading-relaxed">{message.text}</p>
        <p className="text-[10px] mt-1.5 text-stone-300 text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

function AIBubble({ message }) {
  return (
    <div className="flex items-end gap-3 max-w-[75%]">
      <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-[#1C2C1A] to-[#365314] flex items-center justify-center shadow-xs">
        <Sparkles size={14} className="text-lime-300" />
      </div>
      <div className="bg-white border border-[#E0E6DC] rounded-2xl rounded-bl-xs px-4 py-3 shadow-xs">
        <p className="text-sm leading-relaxed text-stone-800">{message.text}</p>
        <p className="text-[10px] mt-1.5 text-stone-400 text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = async (text) => {
    const question = (text ?? input).trim();
    if (!question) return;

    const userMsg = { role: "user", text: question, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const data = await sendChatMessage(question);
      const aiMsg = {
        role: "ai",
        text: data?.answer ?? "Sorry, I couldn't get a response.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Something went wrong. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F4F6F2]">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 lg:p-10 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#1A2A17] to-[#2E4828] text-lime-300 shadow-xs">
                <MessageCircle size={20} />
              </div>
              <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                Financial Assistant
              </h1>
            </div>
            <p className="text-sm text-stone-500 ml-12">
              Ask questions about your bills, spending habits, or budgets
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-2 rounded-xl border border-[#E0E6DC] bg-white px-4 py-2 text-sm font-medium text-stone-600 hover:bg-[#F4F6F2] transition shadow-xs"
            >
              <Trash2 size={14} />
              Clear Chat
            </button>
          )}
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col rounded-2xl bg-white border border-[#E0E6DC] shadow-xs overflow-hidden">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-[#FAFBF9]">

            {/* Empty state: welcome + suggested questions */}
            {messages.length === 0 && !typing && (
              <div className="flex flex-col items-center justify-center h-full gap-6 py-10">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1C2C1A] to-[#365314] text-lime-300 shadow-xs">
                  <Bot size={32} />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-stone-900 mb-1">BillBuddy Assistant</h2>
                  <p className="text-stone-500 text-sm">Ask anything about your expenses, categories, or budgets.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="rounded-xl border border-[#E0E6DC] bg-white px-4 py-3 text-sm text-stone-700 font-medium hover:bg-[#EDF2EB] hover:border-[#C4D0BE] hover:text-[#1C2C1A] transition text-left shadow-2xs"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) =>
              msg.role === "user" ? (
                <UserBubble key={i} message={msg} />
              ) : (
                <AIBubble key={i} message={msg} />
              )
            )}

            {/* Typing indicator */}
            {typing && <TypingIndicator />}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="border-t border-[#E0E6DC] p-4 bg-white">
            <div className="flex items-end gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your finances…"
                rows={1}
                className="flex-1 resize-none rounded-xl border border-[#E0E6DC] bg-white px-4 py-3 text-sm text-stone-800 placeholder-stone-400 outline-none focus:border-[#365314] focus:ring-3 focus:ring-[#365314]/15 transition max-h-36 overflow-y-auto"
                style={{ lineHeight: "1.5" }}
                disabled={typing}
              />
              <button
                onClick={() => handleSend()}
                disabled={typing || !input.trim()}
                className="shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-r from-[#1C2C1A] to-[#365314] hover:from-[#152213] hover:to-[#2B4210] text-white shadow-xs transition disabled:opacity-50 active:scale-[0.99]"
              >
                {typing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 ml-1">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
