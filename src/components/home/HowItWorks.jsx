import { FaSearch, FaWallet, FaShoppingBag } from "react-icons/fa";

export default function HowItWorks() {
  const steps = [
    {
      icon: <FaSearch />,
      title: "Discover Art",
      desc: "Browse thousands of unique, certified custom paintings and digital art pieces tailored to your style.",
    },
    {
      icon: <FaWallet />,
      title: "Secure Payment",
      desc: "Pay safely with our protected escrow system. The artist gets paid only when you safely receive the art.",
    },
    {
      icon: <FaShoppingBag />,
      title: "Receive & Collect",
      desc: "Your premium custom artwork is packed securely by experts and delivered directly to your doorstep.",
    },
  ];

  return (
   
    <section className="py-20 bg-[#0b121f] text-white border-t border-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center space-y-2 mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How ArtHub Works
          </h2>
          <div className="w-12 h-1 bg-[#7c3aed] mx-auto rounded-full" />
          <p className="text-slate-400 text-sm max-w-sm mx-auto font-medium">
            Buying premium art made simple, secure, and authentic.
          </p>
        </div>

  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center relative group">
        
              {idx < 2 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-purple-500/20 to-transparent z-0" />
              )}
              <div className="w-20 h-20 bg-[#111827] text-purple-400 border border-slate-800/80 rounded-[24px] flex items-center justify-center text-2xl mx-auto mb-6 shadow-xl relative z-10 group-hover:text-white group-hover:bg-[#7c3aed] group-hover:border-purple-500 transition-all duration-300">
                {step.icon}
              </div>

    
              <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto font-medium opacity-90">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}