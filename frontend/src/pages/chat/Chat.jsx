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
      <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow">
        <Sparkles size={15} className="text-white" />
      </div>
      <div className="bg-[#FEFDFB] border border-stone-200 rounded-3xl rounded-bl-sm px-5 py-4 shadow-sm">
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
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
      <div className="max-w-[75%] bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-3xl rounded-br-sm px-5 py-4 shadow-md">
        <p className="text-sm leading-relaxed">{message.text}</p>
        <p className="text-[10px] mt-2 opacity-60 text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

function AIBubble({ message }) {
  return (
    <div className="flex items-end gap-3 max-w-[75%]">
      <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow">
        <Sparkles size={15} className="text-white" />
      </div>
      <div className="bg-[#FEFDFB] border border-stone-200 rounded-3xl rounded-bl-sm px-5 py-4 shadow-sm">
        <p className="text-sm leading-relaxed text-slate-700">{message.text}</p>
        <p className="text-[10px] mt-2 opacity-50 text-right text-slate-500">
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 lg:p-10 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600">
                <MessageCircle size={22} className="text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                AI Chat
              </h1>
            </div>
            <p className="text-slate-500 ml-14">
              Ask anything about your finances
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-[#FEFDFB] px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition shadow-sm"
            >
              <Trash2 size={15} />
              Clear Chat
            </button>
          )}
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col rounded-3xl bg-white/60 backdrop-blur border border-stone-200 shadow-sm overflow-hidden">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

            {/* Empty state: welcome + suggested questions */}
            {messages.length === 0 && !typing && (
              <div className="flex flex-col items-center justify-center h-full gap-6 py-10">
                <div className="p-5 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 shadow-xl">
                  <Bot size={36} className="text-white" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-slate-800 mb-1">Hi, I'm BillBuddy AI!</h2>
                  <p className="text-slate-500 text-sm">Ask me anything about your expenses, habits, or goals.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="rounded-2xl border border-stone-200 bg-[#FEFDFB] px-4 py-3 text-sm text-slate-700 font-medium hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition text-left shadow-sm"
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
          <div className="border-t border-stone-200 p-4 bg-[#FEFDFB]/80 backdrop-blur">
            <div className="flex items-end gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your finances…"
                rows={1}
                className="flex-1 resize-none rounded-2xl border border-stone-200 bg-white px-5 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition max-h-36 overflow-y-auto"
                style={{ lineHeight: "1.5" }}
                disabled={typing}
              />
              <button
                onClick={() => handleSend()}
                disabled={typing || !input.trim()}
                className="shrink-0 flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {typing ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 ml-1">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
