"use client";

import { useRef, useEffect } from "react";
import {
  MessageCircleHeart,
  X,
  Send,
  Bot,
} from "lucide-react";
import { useChatStore } from "@/stores/chat-store";
import { sanitizeInput } from "@/lib/security";

export function ChatWidget() {
  const {
    messages,
    isOpen,
    isLoading,
    toggleChat,
    addMessage,
    setLoading,
  } = useChatStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const raw = inputRef.current?.value?.trim();
    if (!raw || isLoading) return;

    const message = sanitizeInput(raw);
    if (!message) return;

    addMessage({ role: "user", content: message });
    if (inputRef.current) inputRef.current.value = "";
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      addMessage({ role: "assistant", content: data.reply });
    } catch {
      addMessage({
        role: "assistant",
        content:
          "Üzr istəyirəm, xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <button
        onClick={toggleChat}
        className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 relative group"
        aria-label="Çat açın"
      >
        <span className="absolute inset-0 rounded-full bg-cyan-400 opacity-75 animate-ping group-hover:opacity-100" />
        <span className="relative z-10">
          <MessageCircleHeart className="w-8 h-8" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">PharmaTech AI</h4>
                <p className="text-xs text-cyan-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white/80 hover:text-white"
              aria-label="Bağla"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 scroll-smooth"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={
                    msg.role === "user"
                      ? "bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none text-sm shadow-md max-w-[85%]"
                      : "bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none text-sm text-slate-600 shadow-sm max-w-[85%]"
                  }
                >
                  {msg.content.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < msg.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <span
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSubmit} className="flex gap-2 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Sualınızı yazın..."
                className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 outline-none pr-10"
                maxLength={500}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-2 bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
