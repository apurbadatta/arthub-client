import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import { stripe } from '../../../../lib/stripe';

export default async function UserSuccess({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  });

  const status = session.status;
  const customerEmail = session.customer_details?.email;
  const amountTotal = session.amount_total ? (session.amount_total / 100).toFixed(2) : "9.99";
  const transactionId = 
  (typeof session.payment_intent === 'string' 
    ? session.payment_intent 
    : session.payment_intent?.id) 
  || session_id;
  const tier = session.metadata?.tier || "pro";

  if (status === 'open') {
    return redirect('/dashboard/user/subscription');
  }

  if (status === 'complete' && customerEmail) {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // আগে check করো এই transaction আগে process হয়েছে কিনা
      const checkRes = await fetch(
        `${backendUrl}/api/payments/history?email=${customerEmail}`
      );
      const checkData = await checkRes.json();

      const alreadyProcessed = checkData?.data?.some(
        (tx) => tx.transactionId === transactionId
      );

      if (!alreadyProcessed) {
        await fetch(`${backendUrl}/api/profile/upgrade-user-tier`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: customerEmail,
            tier: tier,
            amount: amountTotal,
            paymentIntentId: transactionId
          }),
        });
      }
    } catch (error) {
      console.error("Failed to automatically trigger profile user tier upgrade:", error);
    }
  }

  return (
    <div className="w-full flex items-center justify-center p-4 text-slate-200 py-12">
      <div className="max-w-md w-full bg-[#111827] border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="relative mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
          <FaCheckCircle size={40} className="animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white tracking-tight">
            {tier.toUpperCase() === "PREMIUM" ? "Premium Activated!" : "Pro Tier Activated!"}
          </h1>
          <p className="text-xs text-slate-400">Your account subscription has been successfully upgraded.</p>
        </div>

        <div className="border-t border-slate-800/80 my-2"></div>

        <div className="bg-slate-900/60 border border-slate-800/50 rounded-2xl p-4 text-left space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">User Email</span>
            <span className="text-slate-300 font-semibold truncate max-w-[200px]">{customerEmail}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Amount Paid</span>
            <span className="text-emerald-400 font-extrabold flex items-center gap-1">
              ${amountTotal} USD
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Membership Status</span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold uppercase text-[9px] tracking-wider">
              Tier: {tier}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 bg-indigo-500/5 border border-indigo-500/10 p-3.5 rounded-xl text-left text-[11px] text-slate-400 leading-relaxed">
          <FaEnvelope className="text-indigo-400 shrink-0 mt-0.5" size={14} />
          <p>
            Your database record has been updated. You now have access to download/purchase up to <strong>{tier === "premium" ? "Unlimited" : "9"}</strong> artworks.
          </p>
        </div>

        <div className="pt-2">
          <Link 
            href="/dashboard/user/subscription" 
            className="w-full py-3.5 bg-[#5c3ef2] hover:bg-[#4c30d3] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 group cursor-pointer"
          >
            Go to Subscription Overview
            <FaArrowRight size={11} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}