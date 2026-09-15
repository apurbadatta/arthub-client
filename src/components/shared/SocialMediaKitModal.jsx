"use client";
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaEnvelope,
  FaCopy,
  FaCheck,
  FaMagic,
  FaShareAlt,
  FaSpinner,
  FaWhatsapp,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function SocialMediaKitModal({ isOpen, onClose, artwork }) {
  const [activeTab, setActiveTab] = useState("instagram");
  const [tone, setTone] = useState("poetic");
  const [loading, setLoading] = useState(false);
  const [kitData, setKitData] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);

  const fetchMarketingKit = async (selectedTone = tone) => {
    if (!artwork) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/marketing-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: artwork.title,
          description: artwork.description,
          category: artwork.category,
          price: artwork.price,
          artistName: artwork.artistName || "Featured Artist",
          tone: selectedTone,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setKitData(data.data);
      } else {
        toast.error("Failed to generate marketing kit");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while generating kit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && artwork) {
      fetchMarketingKit(tone);
    }
  }, [isOpen, artwork]);

  const handleToneChange = (newTone) => {
    setTone(newTone);
    fetchMarketingKit(newTone);
  };

  const copyToClipboard = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    toast.success("Copied to clipboard! 📋");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  if (!isOpen || !artwork) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f172a] border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-900/90 via-indigo-950 to-slate-900 p-5 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <FaMagic className="text-lg animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">AI Social Media Kit</h3>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                  Marketing Studio
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generate high-converting posts for &quot;{artwork.title}&quot;
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Tone Selector */}
        <div className="bg-[#0b1220] px-5 py-3 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Content Tone:
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { id: "poetic", label: "✨ Poetic & Deep" },
              { id: "luxury", label: "💎 Luxury Collector" },
              { id: "energetic", label: "🔥 Energetic & Viral" },
              { id: "minimalist", label: "🌿 Minimalist" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => handleToneChange(t.id)}
                disabled={loading}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap ${
                  tone === t.id
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="grid grid-cols-4 bg-[#0d1527] border-b border-slate-800 text-xs font-semibold">
          {[
            { id: "instagram", label: "Instagram", icon: FaInstagram, color: "text-pink-400" },
            { id: "twitter", label: "Twitter / X", icon: FaTwitter, color: "text-sky-400" },
            { id: "facebook", label: "Facebook", icon: FaFacebook, color: "text-blue-400" },
            { id: "email", label: "Collector Email", icon: FaEnvelope, color: "text-amber-400" },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-2 flex items-center justify-center gap-2 transition cursor-pointer border-b-2 ${
                  activeTab === tab.id
                    ? "border-purple-500 text-white bg-slate-800/40"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className={tab.color} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-slate-200 bg-[#0b1220]/50">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <FaSpinner className="text-3xl text-purple-500 animate-spin" />
              <p className="text-sm font-medium">Crafting tailored marketing copy with AI...</p>
            </div>
          ) : kitData ? (
            <>
              {/* Instagram Content */}
              {activeTab === "instagram" && (
                <div className="space-y-4">
                  <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 relative group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                        Post Caption
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `${kitData.instagram.caption}\n\n${kitData.instagram.hashtags.join(" ")}`,
                            "insta-all"
                          )
                        }
                        className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        {copiedSection === "insta-all" ? (
                          <>
                            <FaCheck className="text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <FaCopy /> Copy Caption + Tags
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-line text-slate-200">
                      {kitData.instagram.caption}
                    </p>
                  </div>

                  <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Art Hashtag Cloud
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {kitData.instagram.hashtags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-purple-950/60 text-purple-300 border border-purple-800/40 px-2.5 py-1 rounded-md font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Twitter / X Content */}
              {activeTab === "twitter" && (
                <div className="space-y-3">
                  {[
                    { key: "tweet1", label: "Tweet 1 (Hook)", text: kitData.twitter.tweet1 },
                    { key: "tweet2", label: "Tweet 2 (Art Story)", text: kitData.twitter.tweet2 },
                    { key: "tweet3", label: "Tweet 3 (Call To Action)", text: kitData.twitter.tweet3 },
                  ].map((tweet, i) => (
                    <div
                      key={tweet.key}
                      className="bg-[#111827] border border-slate-800 rounded-2xl p-4 relative group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                          {tweet.label}
                        </span>
                        <button
                          onClick={() => copyToClipboard(tweet.text, tweet.key)}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition cursor-pointer"
                        >
                          {copiedSection === tweet.key ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <FaCheck /> Copied
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <FaCopy /> Copy
                            </span>
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">{tweet.text}</p>
                    </div>
                  ))}

                  {/* Direct Tweet Intent */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      kitData.twitter.tweet1
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md cursor-pointer"
                  >
                    <FaTwitter /> Post Tweet 1 Directly to X
                  </a>
                </div>
              )}

              {/* Facebook Content */}
              {activeTab === "facebook" && (
                <div className="space-y-4">
                  <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        Full Story Post
                      </span>
                      <button
                        onClick={() => copyToClipboard(kitData.facebook.post, "fb-post")}
                        className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        {copiedSection === "fb-post" ? (
                          <>
                            <FaCheck className="text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <FaCopy /> Copy Post
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                      {kitData.facebook.post}
                    </p>
                  </div>
                </div>
              )}

              {/* Collector Email Content */}
              {activeTab === "email" && (
                <div className="space-y-4">
                  <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        Email Subject Line
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(kitData.collectorEmail.subject, "email-subject")
                        }
                        className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        {copiedSection === "email-subject" ? (
                          <span className="text-emerald-400">Copied</span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <FaCopy /> Copy
                          </span>
                        )}
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {kitData.collectorEmail.subject}
                    </p>
                  </div>

                  <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        Email Body Copy
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(kitData.collectorEmail.body, "email-body")
                        }
                        className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        {copiedSection === "email-body" ? (
                          <>
                            <FaCheck className="text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <FaCopy /> Copy Email
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-serif">
                      {kitData.collectorEmail.body}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0f172a] border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Quick Share:</span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Check out this original artwork on ArtHub: "${artwork.title}" - $${artwork.price}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 rounded-xl border border-emerald-800/40 transition cursor-pointer text-xs flex items-center gap-1"
            >
              <FaWhatsapp /> WhatsApp
            </a>
          </div>

          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Close Studio
          </button>
        </div>
      </div>
    </div>
  );
}
