"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/admin/transactions`);
        const result = await res.json();
        if (result.success) {
          setTransactions(result.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load financial records");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [baseUrl]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const TypeBadge = ({ type }) => (
    <span
      className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
        type === "Subscription" || type === "subscription"
          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
      }`}
    >
      {type}
    </span>
  );

  return (
    <div className="w-full min-h-screen text-slate-200 p-4 md:p-6 space-y-6">
      <ToastContainer theme="dark" position="top-right" />

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Financial Transactions
        </h1>
      </div>

      <div className="w-full border-t border-slate-800/60"></div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-24 text-indigo-500">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs text-slate-500">Loading ledger data...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-[#0b0f19]">
          No recorded transactions found.
        </div>
      ) : (
        <>
          {/* ── MOBILE CARD VIEW ── */}
          <div className="flex flex-col gap-3 md:hidden">
            {transactions.map((tx) => (
              <div
                key={tx._id || tx.transactionId}
                className="bg-[#0b111e] border border-slate-800/80 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider shrink-0">
                    Transaction ID
                  </span>
                  <span className="font-mono text-indigo-400 font-semibold text-[11px] text-right break-all max-w-[65%]">
                    {tx.transactionId || tx._id}
                  </span>
                </div>

                <div className="border-t border-slate-800/40"></div>

                <div className="flex items-center justify-between">
                  <TypeBadge type={tx.type} />
                  <span className="text-emerald-400 font-extrabold font-mono text-sm">
                    +${Number(tx.amount).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider shrink-0">
                    Email
                  </span>
                  <span className="text-slate-300 font-medium text-xs text-right break-all">
                    {tx.email || tx.userEmail}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                    Date & Time
                  </span>
                  <span className="text-slate-500 text-xs">
                    {formatDate(tx.date || tx.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── DESKTOP TABLE VIEW ── */}
          <div className="hidden md:block bg-[#0b111e] border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs table-fixed">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-[#111827]/60 tracking-wider">
                    <th className="py-4 px-4 w-[30%]">Transaction ID</th>
                    <th className="py-4 px-4 w-[15%]">Payment Type</th>
                    <th className="py-4 px-4 w-[25%]">User/Artist Email</th>
                    <th className="py-4 px-4 w-[20%]">Date & Time</th>
                    <th className="py-4 px-4 w-[10%] text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {transactions.map((tx) => (
                    <tr
                      key={tx._id || tx.transactionId}
                      className="hover:bg-slate-900/30 transition-all"
                    >
                      <td className="py-4 px-4 font-mono text-indigo-400 font-semibold truncate overflow-hidden">
                        {tx.transactionId || tx._id}
                      </td>
                      <td className="py-4 px-4">
                        <TypeBadge type={tx.type} />
                      </td>
                      <td className="py-4 px-4 text-slate-300 font-medium truncate overflow-hidden">
                        {tx.email || tx.userEmail}
                      </td>
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                        {formatDate(tx.date || tx.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-right text-sm font-extrabold text-emerald-400 font-mono whitespace-nowrap">
                        +${Number(tx.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}