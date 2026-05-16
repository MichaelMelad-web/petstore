
import { useState, useRef, useEffect } from "react";
import { HiX, HiPaperAirplane, HiOutlineRefresh, HiChevronDown } from "react-icons/hi";
import { RiRobot2Line } from "react-icons/ri";
 import { sendChatMessage } from "../../services/chatPot";

const WELCOME_MSG = {
  id: "welcome",
  role: "bot",
  text: "👋 مرحباً! أنا مساعد MyPet الذكي 🐾\n\nيمكنني مساعدتك في:\n• 📦 متابعة طلباتك — اكتب: اشوف اوردراتي\n• 🏷️ التحقق من كوبون — اكتب: كوبون SAVE20\n• 🛍️ سعر منتج — اكتب اسم المنتج بالإنجليزي\n\nكيف يمكنني مساعدتك؟",
};

const SUGGESTIONS = [
  { label: "📦 طلباتي",    value: "اشوف اوردراتي" },
  { label: "🏷️ SAVE20",   value: "كوبون SAVE20" },
  { label: "🏷️ PETS25",   value: "كوبون PETS25" },
  { label: "🏷️ WELCOME15", value: "كوبون WELCOME15" },
];

function extractReply(data) {
  if (!data) return null;
  const candidates = [
    data?.data?.reply, data?.data?.message, data?.data?.answer,
    data?.data?.text, data?.data?.response, data?.reply,
    data?.message, data?.answer, data?.text, data?.response,
  ];
  for (const c of candidates) {
    if (c && typeof c === "string" && c.trim()) return c.trim();
  }
  if (data?.data && typeof data.data === "object") return JSON.stringify(data.data, null, 2);
  return null;
}

function formatText(text) {
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
  ));
}

function msgTime() {
  return new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}

export default function Chatbot() {
  const [isOpen, setIsOpen]           = useState(false);
  const [messages, setMessages]       = useState([{ ...WELCOME_MSG, time: msgTime() }]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setUnreadCount(0);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: msg, time: msgTime() }]);
    setLoading(true);
    try {
      const res   = await sendChatMessage(msg);
      const reply = extractReply(res.data);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1, role: "bot",
        text: reply || "عذراً، لم أتمكن من فهم الرد. حاول مرة أخرى 🙏",
        time: msgTime(),
      }]);
      if (!isOpen) setUnreadCount((c) => c + 1);
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1, role: "bot", isError: true, time: msgTime(),
        text: err.response?.data?.message || "حدث خطأ في الاتصال 🌐",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const resetChat = () => {
    setMessages([{ ...WELCOME_MSG, time: msgTime() }]);
    setInput("");
  };

  const showSuggestions = messages.length <= 2 && !loading;

  return (
    <>
      {/* ═══════════════════════════════════════
          FLOATING BUTTON — rounded square style
      ═══════════════════════════════════════ */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? "Close chat" : "Open MyPet AI chat"}
          className="relative group focus:outline-none"
        >
          {/* Outer rounded square — purple bg with glass effect */}
          <div className={`
            w-16 h-16 rounded-[22px] flex items-center justify-center
            transition-all duration-300
            shadow-xl shadow-purple-900/40
            ${isOpen
              ? "bg-[#6B21A8]"
              : "bg-[#6B21A8] group-hover:scale-105 group-hover:shadow-purple-500/50 group-hover:shadow-2xl"
            }
          `}>
            {/* Inner frosted circle */}
            <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              {isOpen
                ? <HiX className="text-white text-2xl" />
                : <RiRobot2Line className="text-white text-2xl" />
              }
            </div>
          </div>

          {/* Green online dot */}
          {!isOpen && (
            <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full shadow-sm" />
          )}

          {/* Unread badge */}
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-md">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
            <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg">
              MyPet AI 🐾
              <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════
          CHAT WINDOW
      ═══════════════════════════════════════ */}
      <div
        className={`
          fixed bottom-28 right-6 z-50
          w-[340px] sm:w-[390px]
          flex flex-col overflow-hidden
          rounded-3xl
          bg-white dark:bg-[#1e1a2e]
          shadow-2xl dark:shadow-purple-900/50
          border border-purple-100 dark:border-purple-900/40
          transition-all duration-300 origin-bottom-right
          ${isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"}
        `}
        style={{ height: "540px" }}
      >
        {/* ── HEADER ── */}
        <div
          className="shrink-0 px-4 py-3"
          style={{ background: "linear-gradient(135deg, #6B21A8 0%, #4C1D95 100%)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Bot avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-[14px] bg-white/15 border border-white/25 flex items-center justify-center">
                  <RiRobot2Line className="text-white text-xl" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-purple-900 rounded-full" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none mb-0.5">MyPet AI</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-purple-200 text-xs">متصل الآن</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={resetChat} title="محادثة جديدة"
                className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition">
                <HiOutlineRefresh size={15} />
              </button>
              <button onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition">
                <HiChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Sub-strip */}
          <div className="mt-2.5 bg-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="text-yellow-300 text-xs">🐾</span>
            <p className="text-white/75 text-xs">مساعدك الذكي لمتجر حيوانات أليفة</p>
          </div>
        </div>

        {/* ── MESSAGES ── */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-[#f8f5ff] dark:bg-[#13111C]">
          {messages.map((msg) => (
            <div key={msg.id}
              className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {msg.role === "bot" && (
                <div className="w-7 h-7 rounded-[10px] bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0 mb-5">
                  <RiRobot2Line className="text-purple-600 dark:text-purple-400 text-sm" />
                </div>
              )}
              <div className={`flex flex-col gap-1 max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`
                  px-3.5 py-2.5 text-sm leading-relaxed
                  ${msg.role === "user"
                    ? "bg-[#6B21A8] text-white rounded-2xl rounded-br-sm shadow-sm shadow-purple-900/20"
                    : msg.isError
                      ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-2xl rounded-bl-sm"
                      : "bg-white dark:bg-[#2a2040] text-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-sm shadow-sm border border-purple-100 dark:border-purple-900/30"
                  }
                `} dir="auto">
                  {formatText(msg.text)}
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-600 px-1">{msg.time}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-[10px] bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
                <RiRobot2Line className="text-purple-600 dark:text-purple-400 text-sm" />
              </div>
              <div className="bg-white dark:bg-[#2a2040] border border-purple-100 dark:border-purple-900/30 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex gap-1.5 items-center">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── SUGGESTIONS ── */}
        {showSuggestions && (
          <div className="px-3 pt-2 pb-1 shrink-0 border-t border-purple-100 dark:border-purple-900/30 bg-[#f8f5ff] dark:bg-[#13111C]">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 font-medium px-1">اقتراحات سريعة:</p>
            <div className="flex gap-2 flex-wrap">
              {SUGGESTIONS.map((s) => (
                <button key={s.value} onClick={() => sendMessage(s.value)}
                  className="text-xs bg-white dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 font-semibold px-3 py-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-400 transition shadow-sm">
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── INPUT BAR ── */}
        <div className="shrink-0 px-3 py-3 border-t border-purple-100 dark:border-purple-900/30 bg-white dark:bg-[#1e1a2e]">
          <div className="flex items-center gap-2 bg-[#f3eeff] dark:bg-[#2a2040] rounded-2xl border border-purple-200 dark:border-purple-800/60 px-3 py-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-200 dark:focus-within:ring-purple-900/40 transition">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب رسالتك هنا..."
              disabled={loading}
              dir="auto"
              className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none disabled:opacity-60 py-0.5"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                input.trim() && !loading
                  ? "bg-[#6B21A8] hover:bg-purple-800 text-white shadow-sm hover:scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              <HiPaperAirplane className="text-sm rotate-90" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <RiRobot2Line className="text-purple-400 text-xs" />
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Powered by <span className="text-purple-500 font-semibold">MyPet AI</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}