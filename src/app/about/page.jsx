"use client";
import React from "react";
import Link from "next/link";
import {
  FaArtstation,
  FaShieldAlt,
  FaGlobeAmericas,
  FaRobot,
  FaHandHoldingHeart,
  FaGem,
  FaPalette,
  FaArrowRight,
  FaCheckCircle,
  FaPaintBrush,
  FaUsers,
  FaAward,
  FaMagic,
} from "react-icons/fa";

export default function AboutPage() {
  const stats = [
    { label: "Original Artworks", value: "8,500+", icon: FaPalette },
    { label: "Verified Artists", value: "1,400+", icon: FaPaintBrush },
    { label: "Paid to Creators", value: "$2.4M+", icon: FaGem },
    { label: "Collector Satisfaction", value: "99.2%", icon: FaAward },
  ];

  const pillars = [
    {
      icon: FaShieldAlt,
      title: "Escrow-Protected Acquisitions",
      desc: "Every transaction is securely held in escrow until authenticated receipt, guaranteeing peace of mind for both buyers and artists.",
      color: "from-blue-600 to-indigo-600",
    },
    {
      icon: FaRobot,
      title: "AI-Augmented Curation",
      desc: "State-of-the-art vision models, real-time curator assistance with ArtBot, and automated marketing kits bridge creativity with technology.",
      color: "from-purple-600 to-pink-600",
    },
    {
      icon: FaHandHoldingHeart,
      title: "Creator-First Economics",
      desc: "We believe in direct creator empowerment, offering industry-low commission rates so artists retain the majority of their hard-earned sales.",
      color: "from-emerald-600 to-teal-600",
    },
    {
      icon: FaGlobeAmericas,
      title: "Global Art Community",
      desc: "Democratizing fine art across continents, giving rising painters, digital illustrators, and sculptors a prestigious global stage.",
      color: "from-amber-600 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-200 selection:bg-purple-600 selection:text-white">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-900/20 via-indigo-900/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-purple-950/60 border border-purple-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-purple-300 mb-6 shadow-inner">
          <FaMagic className="text-purple-400" /> Discover the Spirit of ArtHub
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Where Visionary Art Meets Modern{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400">
            Connoisseurs
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          ArtHub was founded on a simple yet revolutionary idea: that buying and
          selling original fine art should be transparent, accessible, and
          infused with modern intelligence.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/artworks"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-purple-900/30 transition-all flex items-center gap-2 group"
          >
            Explore Masterpieces
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/register"
            className="bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-sm px-8 py-3.5 rounded-2xl transition-all"
          >
            Join as an Artist
          </Link>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 border-y border-slate-800/80 bg-[#0d1424]/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="text-center p-6 rounded-2xl bg-[#11192e]/70 border border-slate-800 hover:border-purple-500/40 transition-all group"
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Icon className="text-lg" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {item.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-gradient-to-br from-[#11192e] to-[#0c1222] border border-slate-800 p-8 rounded-3xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all" />
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2 block">
              Our Mission
            </span>
            <h3 className="text-2xl font-black text-white mb-4">
              Democratizing the Fine Art Ecosystem
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Traditional art galleries often act as gatekeepers, imposing
              hefty commission markups and restricting opportunities to a
              handful of insiders. ArtHub breaks down these barriers by directly
              connecting emerging and established creators with art lovers
              globally.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-[#11192e] to-[#0c1222] border border-slate-800 p-8 rounded-3xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition-all" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2 block">
              Our Vision
            </span>
            <h3 className="text-2xl font-black text-white mb-4">
              The Intelligent Art Marketplace of Tomorrow
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We envision a future where discovering the perfect artwork for
              your home or private collection is effortless and inspiring. By
              harnessing cutting-edge AI curation and escrow security, we set a
              new gold standard in digital fine art commerce.
            </p>
          </div>
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section className="py-16 bg-[#0c1222] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
              Why Choose ArtHub
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Built on Trust, Innovation & Passion
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#11192e] border border-slate-800/90 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all hover:-translate-y-1 duration-300"
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${pillar.color} flex items-center justify-center text-white text-xl shadow-lg mb-5`}
                    >
                      <Icon />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
            Seamless Experience
          </h2>
          <h3 className="text-3xl sm:text-4xl font-black text-white">
            How ArtHub Works
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            {
              step: "01",
              title: "Discover & Connect",
              desc: "Browse hundreds of curated original paintings, digital artworks, and sculptures. Chat with ArtBot for tailored interior style guidance.",
            },
            {
              step: "02",
              title: "Secure Purchase",
              desc: "Acquire pieces directly with seamless Stripe checkout, verified escrow transaction locking, and instant authenticity tokens.",
            },
            {
              step: "03",
              title: "Deliver & Review",
              desc: "Receive your fine art piece with tracking, unlock verified buyer commentary, and build a lasting relationship with the creator.",
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className="bg-[#11192e]/60 border border-slate-800 rounded-3xl p-8 relative group hover:border-purple-500/40 transition-all"
            >
              <span className="text-5xl font-black text-purple-900/60 group-hover:text-purple-600/40 transition-colors block mb-4">
                {step.step}
              </span>
              <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-b from-[#0c1222] to-[#080c14] border-t border-slate-800/80 text-center px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-slate-900/80 border border-purple-500/30 rounded-3xl p-10 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Transform Your Space?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Explore our curated marketplace today, or start selling your
              artworks with our AI-powered creator studio.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/artworks"
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all"
              >
                Browse Gallery
              </Link>
              <Link
                href="/dashboard"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm px-8 py-3.5 rounded-xl transition-all border border-slate-700"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
