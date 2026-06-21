"use client";
import { useState } from "react";
import { FaCheckCircle, FaCrown, FaGem, FaLayerGroup, FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SubscriptionPage() {
  const [loadingTier, setLoadingTier] = useState(null);

  const tiers = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      description: "Ideal for casual art lovers starting their collection journey.",
      features: ["Max 3 Paintings Purchase Allowed", "Standard Browsing Experience", "Community Comments Access"],
      icon: <FaLayerGroup className="text-slate-400" size={24} />,
      btnText: "Current Plan",
      current: true,
    },
    {
      id: "pro",
      name: "Pro Tier",
      price: "$9.99",
      description: "Perfect for growing collectors who want more flexibility.",
      features: ["Max 9 Paintings Purchase Allowed", "Priority Support", "Community Comments Access", "Exclusive Artist Badges"],
      icon: <FaGem className="text-indigo-400" size={24} />,
      btnText: "Upgrade to Pro",
      current: false,
    },
    {
      id: "premium",
      name: "Premium",
      price: "$19.99",
      description: "Ultimate access for true connoisseurs and heavy investors.",
      features: ["Unlimited Paintings Purchases", "24/7 VIP Concierge Support", "Advanced Collection Metrics", "Early Access to New Drops"],
      icon: <FaCrown className="text-amber-400" size={24} />,
      btnText: "Go Premium",
      current: false,
    },
  ];

  const handleSubscribe = (tierId) => {
    setLoadingTier(tierId);
    setTimeout(() => {
      toast.success(`Redirecting to Stripe checkout for ${tierId} plan... 🎉`);
      setLoadingTier(null);
    }, 1500);
  };

  return (
    <div className="w-full text-slate-200 max-w-5xl space-y-6">
      <ToastContainer theme="dark" position="top-right" />
      
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Subscription Plan Tier Overview</h1>
        <p className="text-xs text-slate-400 mt-1">Upgrade your tier capacity to purchase more high-quality masterworks simultaneously.</p>
      </div>

      <div className="w-full border-t border-slate-800 my-4"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div 
            key={tier.id} 
            className={`bg-[#111827] border rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
              tier.current ? "border-indigo-500/50 shadow-lg shadow-indigo-500/5" : "border-slate-800 hover:border-slate-700"
            }`}
          >
            {tier.id === "premium" && (
              <span className="absolute -top-3 right-4 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                Most Popular
              </span>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">{tier.icon}</div>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed min-h-[40px]">{tier.description}</p>
              
              <div className="pt-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">{tier.price}</span>
                {tier.id !== "free" && <span className="text-xs text-slate-500 font-medium"> / monthly</span>}
              </div>

              <div className="border-t border-slate-800/60 my-2"></div>

              <ul className="space-y-3 pt-2">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <FaCheckCircle className={tier.id === "premium" ? "text-amber-500 mt-0.5" : "text-indigo-500 mt-0.5"} size={13} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <button
                disabled={tier.current || loadingTier !== null}
                onClick={() => handleSubscribe(tier.id)}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  tier.current
                    ? "bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed"
                    : tier.id === "premium"
                    ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg hover:shadow-amber-500/10"
                    : "bg-[#5c3ef2] hover:bg-[#4c30d3] text-white"
                }`}
              >
                {loadingTier === tier.id ? <FaSpinner className="animate-spin" /> : tier.btnText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}