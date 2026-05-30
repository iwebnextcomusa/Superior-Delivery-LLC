import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { MessageSquare, X, Send, Truck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CHAT_STARTERS = [
  "What is the monthly pricing?",
  "Does the GPS support low bridges?",
  "How does the ELD stay compliant?",
  "Is the load board broker-free?",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "g1",
      role: "model",
      text: "Hello! Welcome to Superior Truck GPS. I am SuperiorBot, your automated carrier and fleet helper. How can I assist you with truck-safe routing, FMCSA ELD compliance, state-line IFTA audits, or commission-free loads today?",
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessageAlert, setHasNewMessageAlert] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to lowest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Alert dismiss
  useEffect(() => {
    if (isOpen) {
      setHasNewMessageAlert(false);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);

    try {
      // Map history to our server's expected api schema
      const historyPayload = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload
        })
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        text: data.text,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        text: "I experienced a minor dispatch network delay. Our dispatcher desk has been logged. Please feel free to request an immediate manual quote or call our office anytime at (973) 932-4796 for direct loading support!",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputVal);
  };

  return (
    <div id="chatbot-widget-container" className="fixed bottom-6 right-6 z-[60] select-none">
      
      {/* Interactive Trigger Button */}
      <div className="relative">
        {hasNewMessageAlert && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
          </span>
        )}
        <button
          id="chat-toggle-floating-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
          aria-label="Open AI Dispatch Helpdesk"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>

      {/* Floating Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-floating-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="absolute bottom-18 right-0 w-[calc(100vw-2rem)] sm:w-[400px] h-[480px] sm:h-[500px] max-h-[calc(100vh-140px)] rounded-2xl flex flex-col bg-white shadow-2xl overflow-hidden border border-slate-200"
          >
            {/* Chatbox Header */}
            <div className="p-4 bg-blue-900 border-b border-blue-950 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-800 rounded-lg text-white">
                  <Truck className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide font-sans">SuperiorBot Helpdesk</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-300 font-bold">Dispatch Active</span>
                  </div>
                </div>
              </div>
              <button
                id="chat-close-btn"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Stream Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <p className={`text-[9px] font-mono text-right mt-1.5 ${
                      msg.role === "user" ? "text-blue-105" : "text-slate-400"
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Server-side Typing indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                      <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce delay-100"></span>
                      <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Conversation Starters Grid */}
            {messages.length === 1 && !isLoading && (
              <div className="p-3 bg-white border-t border-slate-100 space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-1 mb-1">Suggested topics:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {CHAT_STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSendMessage(s)}
                      className="text-left py-1.5 px-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-600 truncate cursor-pointer transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Action Form */}
            <form
              id="chatbot-input-form"
              onSubmit={handleFormSubmit}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask our coordinator a question..."
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-650 transition-colors placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="p-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors shadow shadow-blue-600/10 cursor-pointer disabled:opacity-50"
                disabled={!inputVal.trim() || isLoading}
                aria-label="Send Query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
