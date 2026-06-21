"use client";
import { useState, useEffect } from "react";
import { FaCalendarAlt, FaChartLine, FaCrown, FaDollarSign, FaImage, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authClient } from "@/lib/auth-client";

export default function SalesHistoryPage() { 
  const { data: session, isPending: sessionLoading, refetch } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]); 
  const [stats, setStats] = useState({
    totalUploaded: 0,
    totalSalesCount: 0,
    totalRevenue: 0,
  });
  const [currentEmail, setCurrentEmail] = useState("");

 
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

 
  useEffect(() => {
    if (session?.user?.email) {
      setCurrentEmail(session.user.email);

      if (session.user.isPremium || session.user.tier === "premium") {
        setIsPremiumUser(true);
      }
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed?.email) {
            setCurrentEmail(parsed.email);
        
            if (parsed.isPremium || parsed.tier === "premium") {
              setIsPremiumUser(true);
            }
          }
        } catch (e) {
          console.error("LocalStorage parsing error:", e);
        }
      }
    }
  }, [session]);

 
  useEffect(() => {
    if (!currentEmail) return;

    const fetchArtistData = async () => {
      setLoading(true);
      try {
       
        const artRes = await fetch(`${baseUrl}/api/my-artworks?email=${currentEmail}`);
        let totalArtworks = 0;
        if (artRes.ok) {
          const artResult = await artRes.json();
          if (artResult.success && Array.isArray(artResult.data)) {
            totalArtworks = artResult.data.length;
          }
        }

    
        const paymentRes = await fetch(`${baseUrl}/api/payments/history?email=${currentEmail}`);
        let paymentList = [];
        let totalRevenue = 0;

        if (paymentRes.ok) {
          const paymentResult = await paymentRes.json();
          if (paymentResult.success && Array.isArray(paymentResult.data)) {
            paymentList = paymentResult.data;
            totalRevenue = paymentList.reduce((acc, curr) => acc + (curr.amount || 0), 0);
          }
        }

     
        let userId = session?.user?.id || session?.user?._id;
        if (!userId) {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            try {
              const parsed = JSON.parse(storedUser);
              userId = parsed?._id || parsed?.uid || parsed?.id;
            } catch (e) {
              console.error("Error parsing stored user ID:", e);
            }
          }
        }

        if (userId) {
          const profileRes = await fetch(`${baseUrl}/api/profile?id=${userId}`);
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            if (profileData.success && profileData.data) {
              const isPremium = profileData.data.isPremium || profileData.data.tier === "premium" || profileData.data.plan === "premium";
              if (isPremium) {
                setIsPremiumUser(true);
            
                try {
                  const storedUser = localStorage.getItem("user");
                  if (storedUser) {
                    const parsed = JSON.parse(storedUser);
                    if (!parsed.isPremium || parsed.tier !== "premium") {
                      parsed.isPremium = true;
                      parsed.tier = "premium";
                      localStorage.setItem("user", JSON.stringify(parsed));
                    }
                  }
                  if (refetch) {
                    await refetch();
                  }
                } catch (syncErr) {
                  console.error("Session sync error:", syncErr);
                }
              } else {
                setIsPremiumUser(false);
              }
            }
          }
        }

      
        setInvoices(paymentList);
        setStats({
          totalUploaded: totalArtworks,
          totalSalesCount: paymentList.length, 
          totalRevenue: totalRevenue,
        });

      } catch (error) {
        console.error("Error fetching stats and invoices:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [currentEmail, baseUrl, session, refetch]);


  const handleUpgrade = async () => {
    if (!currentEmail) {
      toast.error("User email not found. Please log in again.");
      return;
    }
    try {
      toast.info("Redirecting to Stripe Checkout...");
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentEmail }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to initiate payment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="w-full text-slate-200 max-w-5xl space-y-6 p-4">
      <ToastContainer theme="dark" position="top-right" />

   
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-black tracking-tight">Sales Analytics & History</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review your artwork creation statistics, upgrade limitations, and monitor your global digital sales revenue.
        </p>
      </div>

      <div className="w-full border-t border-slate-800 my-4"></div>

      {loading || sessionLoading ? (
        <div className="flex flex-col justify-center items-center py-20 text-indigo-500 space-y-3">
          <FaSpinner className="animate-spin text-3xl" />
          <p className="text-xs text-slate-500">Calculating repository data...</p>
        </div>
      ) : (
        <>
     
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-sm transition-all hover:border-slate-700">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Uploaded Art</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{stats.totalUploaded}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
                <FaImage size={20} />
              </div>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-sm transition-all hover:border-slate-700">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Transactions</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{stats.totalSalesCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                <FaChartLine size={20} />
              </div>
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-sm transition-all hover:border-slate-700">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accumulated Revenue</p>
                <p className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FaDollarSign size={20} />
              </div>
            </div>
          </div>

      
          <div className="w-full relative overflow-hidden bg-gradient-to-r from-[#1e1b4b]/80 via-[#111827] to-[#111827] border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-8 shadow-xl">
            <div className="space-y-1.5">
          
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {isPremiumUser ? "Premium Tier Active" : "Unlock Unlimited Art Creation"}
              </h3>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                {isPremiumUser ? (
                  <span className="text-emerald-400 font-semibold">Thank you! You are a premium member. Enjoy unlimited artwork publishing features.</span>
                ) : (
                  <>
                    Standard artist accounts are limited to host up to <span className="text-amber-400 font-semibold">3 custom artwork</span> pieces simultaneously. Upgrade to our Premium Package for <span className="text-white font-semibold">$49.00</span> to publish and commercialize unlimited creations.
                  </>
                )}
              </p>
            </div>
            
            {isPremiumUser ? (
              <span className="w-full sm:w-auto bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl text-center shrink-0">
                Premium Account
              </span>
            ) : (
              <button 
                onClick={handleUpgrade}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 cursor-pointer text-center shrink-0"
              >
                Upgrade to Premium
              </button>
            )}
          </div>

          
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 mt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-slate-500" /> Recent Invoices & Statements
            </h3>

            {invoices.length === 0 ? (
              <div className="border border-dashed border-slate-800 rounded-xl py-12 flex flex-col items-center justify-center text-center">
                <p className="text-sm text-slate-500">No recent transactions found</p>
                <p className="text-[11px] text-slate-600 mt-1">When you upgrade your tier using Stripe, transaction lists appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold">
                      <th className="py-3 px-4">Transaction ID / Email</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Package</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {invoices.map((invoice, index) => (
                      <tr key={index} className="hover:bg-slate-900/40 transition">
                        <td className="py-3.5 px-4 font-mono text-slate-300 max-w-[180px] truncate">
                          {invoice.transactionId || invoice.email}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {invoice.date ? new Date(invoice.date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-200 font-medium">
                          {invoice.packageName || "Premium Tier Upgrade"}
                        </td>
                        <td className="py-3.5 px-4 text-emerald-400 font-bold">
                          ${(invoice.amount || 0).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                            <FaCheckCircle size={10} /> Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}