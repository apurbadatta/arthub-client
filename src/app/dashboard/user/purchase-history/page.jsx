"use client";
import { useState } from "react";
import { FaCalendarAlt, FaCheckCircle, FaFileInvoice, FaHashtag } from "react-icons/fa";

export default function PurchaseHistoryPage() {
  const [history] = useState([
    {
      id: "TXN-98431",
      artworkName: "Shattered Grace",
      artistName: "Michael Angelo",
      price: 600,
      purchaseDate: "2026-06-06",
      status: "Successful",
    },
    {
      id: "TXN-12054",
      artworkName: "Classic Artwork",
      artistName: "Apurba",
      price: 45,
      purchaseDate: "2026-05-18",
      status: "Successful",
    },
  ]);

  return (
    <div className="w-full text-slate-200 max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Purchase Statements & Billing</h1>
        <p className="text-xs text-slate-400 mt-1">Review ledger transactions, stripe checkout ids, and legal acquirement timestamps.</p>
      </div>

      <div className="w-full border-t border-slate-800 my-4"></div>

      {history.length === 0 ? (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl py-20 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-3">
            <FaFileInvoice size={18} />
          </div>
          <p className="text-sm text-slate-400">No orders logged in history</p>
        </div>
      ) : (
        <div className="w-full bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="py-4 px-5 flex items-center gap-1.5"><FaHashtag size={10} /> Reference ID</th>
                  <th className="py-4 px-4">Artwork Name</th>
                  <th className="py-4 px-4">Artist</th>
                  <th className="py-4 px-4"><FaCalendarAlt size={10} className="inline mr-1" /> Purchase Date</th>
                  <th className="py-4 px-4 text-right">Price</th>
                  <th className="py-4 px-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {history.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-900/30 transition-all">
                    <td className="py-4 px-5 font-mono font-bold text-slate-400">{row.id}</td>
                    <td className="py-4 px-4 font-bold text-white tracking-tight">{row.artworkName}</td>
                    <td className="py-4 px-4 text-slate-300">{row.artistName}</td>
                    <td className="py-4 px-4 text-slate-400">{row.purchaseDate}</td>
                    <td className="py-4 px-4 text-right font-extrabold text-emerald-400">${row.price.toFixed(2)}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider w-fit mx-auto">
                        <FaCheckCircle size={10} /> {row.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}