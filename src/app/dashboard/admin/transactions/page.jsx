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

  return (
    <div className="w-full min-h-screen text-slate-200 p-6 space-y-6">
      <ToastContainer theme="dark" position="top-right" />

     
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Financial Transactions</h1>
      </div>

      <div className="w-full border-t border-slate-800/60 my-2"></div>

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
        
        <div className="bg-[#0b111e] border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-[#111827]/60 tracking-wider">
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6">Payment Type</th>
                  <th className="py-4 px-6">User/Artist Email</th>
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6 text-right">Settled Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {transactions.map((tx) => (
                  <tr key={tx._id || tx.transactionId} className="hover:bg-slate-900/30 transition-all">
               
                    <td className="py-4 px-6 font-mono text-indigo-400 font-semibold selection:bg-indigo-500/30">
                      {tx.transactionId || tx._id}
                    </td>
                    
               
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        tx.type === "Subscription" || tx.type === "subscription"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    
           
                    <td className="py-4 px-6 text-slate-300 font-medium">
                      {tx.email || tx.userEmail}
                    </td>

     
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(tx.date || tx.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    
           
                    <td className="py-4 px-6 text-right text-sm font-extrabold text-emerald-400 font-mono">
                      +${Number(tx.amount).toFixed(2)}
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