

import Link from "next/link";
import { FaPalette, FaCompass, FaGem, FaArrowRight } from "react-icons/fa";

export default function CategorySection() {
  const categories = [
    {
      title: "Oil & Acrylic",
      description: "Classic handmade canvas paintings textured with rich, vibrant colors.",
      link: "/artworks?category=painting",
      icon: <FaPalette />,
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-400",
      hoverBg: "group-hover:bg-[#7c3aed]",
      hoverTitle: "group-hover:text-purple-400",
    },
    {
      title: "Digital Illustrations",
      description: "Modern digital art, high-resolution conceptual illustrations and concept art.",
      link: "/artworks?category=digital",
      icon: <FaCompass />,
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
      hoverBg: "group-hover:bg-blue-600",
      hoverTitle: "group-hover:text-blue-400",
    },
    {
      title: "Sculptures & 3D",
      description: "Exquisite physical and 3D printed model sculptures from top artists.",
      link: "/artworks?category=sculpture",
      icon: <FaGem />,
      bgColor: "bg-indigo-500/10",
      iconColor: "text-indigo-400",
      hoverBg: "group-hover:bg-indigo-600",
      hoverTitle: "group-hover:text-indigo-400",
    },
  ];

  return (
    // ডার্ক ব্যাকগ্রাউন্ড সেট করা হয়েছে
    <section className="py-20 bg-[#0b111e] text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 📑 সেকশন হেডার */}
        <div className="text-center space-y-2 mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Explore by Category
          </h2>
          <div className="w-12 h-1 bg-[#7c3aed] mx-auto rounded-full mb-3" />
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto font-medium">
            Find the perfect art style that fits your space, taste, and premium lifestyle.
          </p>
        </div>

        {/* 🎴 ৩-কলাম রেসপন্সিভ কার্ড গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="bg-[#111827] p-8 rounded-[28px] border border-slate-800 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* ডায়নামিক আইকন বক্স */}
                <div className={`w-14 h-14 ${cat.bgColor} ${cat.iconColor} rounded-2xl flex items-center justify-center text-xl ${cat.hoverBg} group-hover:text-white transition-all duration-300 shadow-sm`}>
                  {cat.icon}
                </div>
                
                <h3 className={`text-xl font-black text-white ${cat.hoverTitle} transition-colors duration-300`}>
                  {cat.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {cat.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/60">
                <Link 
                  href={cat.link} 
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-[#7c3aed] transition-colors cursor-pointer"
                >
                  Browse Collection 
                  <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}