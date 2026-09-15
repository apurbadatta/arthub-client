"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaMagic,
  FaRedo,
  FaPalette,
  FaCompass,
  FaLightbulb,
} from "react-icons/fa";

export default function ArtBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "👋 Welcome to ArtHub! I'm **ArtBot**, your AI Art Curator. Ask me for personalized recommendations, decor matching, or art history advice!",
      recommendations: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "🎨 Recommend paintings under $200",
    "🛋️ Artworks for modern living room",
    "🌌 Show abstract & digital creations",
    "💡 How do I choose the right art piece?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/curator-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.reply,
            recommendations: data.recommendations || [],
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "Sorry, I couldn't process that. Please try asking again in a moment!",
            recommendations: [],
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Network glitch occurred. Please check your connection and try again!",
          recommendations: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "✨ Chat reset! What kind of artwork or inspiration are you looking for today?",
        recommendations: [],
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-purple-400/30"
          aria-label="Open ArtBot AI Assistant"
        >
          <div className="relative">
            <FaRobot className="text-xl animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <span className="font-semibold text-sm tracking-wide hidden sm:inline">
            ArtBot AI Curator
          </span>
          <span className="bg-purple-800/80 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-purple-400/30">
            AI
          </span>
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#0f172a] border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-900/90 via-indigo-950 to-slate-900 p-4 border-b border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md border border-purple-300/30">
                <FaRobot className="text-lg" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">ArtBot AI</h3>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Live Curator
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Your ArtHub Personal Art Consultant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleClearChat}
                title="Reset Chat"
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/60 transition cursor-pointer text-xs"
              >
                <FaRedo />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/60 transition cursor-pointer text-sm"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-slate-200 bg-[#0b1220]/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-md"
                      : "bg-[#1e293b]/90 border border-slate-700/60 text-slate-200 rounded-tl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>

                {/* Live Artwork Recommendations */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-3 w-full space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                      <FaPalette className="text-xs" /> Recommended Artworks:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.recommendations.map((art) => (
                        <Link
                          key={art.id || art._id}
                          href={`/artworks/${art.id || art._id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 bg-[#131d33] hover:bg-[#1a2744] border border-slate-700/60 hover:border-purple-500/50 p-2 rounded-xl transition group"
                        >
                          <img
                            src={art.image || "/placeholder.jpg"}
                            alt={art.title}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition">
                              {art.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate">
                              By {art.artist || "Independent Artist"}
                            </p>
                            <span className="text-[11px] font-bold text-emerald-400">
                              ${art.price}
                            </span>
                          </div>
                          <span className="text-[10px] bg-purple-600/30 text-purple-300 px-2 py-1 rounded-md font-semibold group-hover:bg-purple-600 group-hover:text-white transition">
                            View
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs bg-[#1e293b]/50 border border-slate-800 px-3 py-2 rounded-2xl w-fit">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-300"></span>
                </span>
                <span>ArtBot is curating suggestions...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-[#0d1527] border-t border-slate-800/80 flex gap-2 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap text-[11px] bg-slate-800/70 hover:bg-purple-900/40 hover:text-purple-300 text-slate-400 px-3 py-1 rounded-full border border-slate-700/60 transition cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0f172a] border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about art styles, rooms, budget..."
              className="flex-1 bg-[#1e293b] border border-slate-700 focus:border-purple-500 text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 placeholder:text-slate-500 focus:outline-none transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white p-3 rounded-xl transition cursor-pointer shadow-md"
            >
              <FaPaperPlane className="text-xs" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
