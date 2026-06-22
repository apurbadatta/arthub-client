"use client";
import { FaUsers, FaPalette, FaShoppingBag, FaDollarSign } from "react-icons/fa";

export default function AnalyticsCards({ stats }) {
  const cardItems = [
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: <FaUsers className="text-indigo-400 text-xl" />,
      borderClass: "border-indigo-500/20",
    },
    {
      title: "Total Artists",
      value: stats.totalArtists || 0,
      icon: <FaPalette className="text-purple-400 text-xl" />,
      borderClass: "border-purple-500/20",
    },
    {
      title: "Artworks Sold",
      value: stats.totalArtworksSold || 0,
      icon: <FaShoppingBag className="text-blue-400 text-xl" />,
      borderClass: "border-blue-500/20",
    },
    {
      title: "Total Revenue",
      value: `$${Number(stats.totalRevenue || 0).toLocaleString()}`,
      icon: <FaDollarSign className="text-emerald-400 text-xl" />,
      borderClass: "border-emerald-500/20",
      isRevenue: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardItems.map((card, idx) => (
        <div
          key={idx}
          className={`bg-[#0b111e] border ${card.borderClass} p-5 rounded-xl shadow-xl flex items-center justify-between transition-all hover:scale-[1.01]`}
        >
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
              {card.title}
            </span>
            <h2 className={`text-2xl font-black font-mono ${card.isRevenue ? 'text-emerald-400' : 'text-white'}`}>
              {card.value}
            </h2>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/40">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}