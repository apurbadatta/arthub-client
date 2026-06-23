import { FaTrophy, FaMedal } from "react-icons/fa";

export default function TopSellingArtists() {
  const topArtists = [
    {
      id: 1,
      name: "Jane Vincent",
      specialty: "Oil Impressionistist",
      sales: 14,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
      cover: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400",
      rank: "#1",
    },
    {
      id: 2,
      name: "Michael Angelo",
      specialty: "Sculptor & Render Designer",
      sales: 9,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200",
      cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400",
      rank: "#2",
    },
    {
      id: 3,
      name: "ArtHub Curator",
      specialty: "Digital Abstract Artist",
      sales: 6,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
      cover: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=400",
      rank: "#3",
    },
  ];

  return (
    <section className="py-20 bg-[#0b121f] text-white border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
            <FaTrophy className="text-amber-500 text-3xl" />
            <h2>Top Selling Artists</h2>
          </div>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Displaying the creative minds leading transactions and collections.
          </p>
        </div>

        {/* Artists Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topArtists.map((artist) => (
            <div 
              key={artist.id}
              className="bg-[#111827] rounded-[24px] border border-slate-800/80 overflow-hidden group hover:border-slate-700 transition-all duration-300 flex flex-col items-center pb-8 shadow-xl"
            >
              {/* Cover Banner Image */}
              <div className="w-full h-32 relative bg-slate-900">
                <img 
                  src={artist.cover} 
                  alt={`${artist.name} cover`} 
                  className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-500"
                />
              </div>

              {/* Profile Avatar Container with Rank Badge */}
              <div className="relative -mt-12 mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-[#111827] overflow-hidden bg-slate-800 shadow-lg">
                  <img 
                    src={artist.avatar} 
                    alt={artist.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Badge Rank (#1, #2, #3) */}
                <span className="absolute bottom-0 right-0 bg-amber-500 text-slate-950 text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#111827] shadow-md">
                  {artist.rank}
                </span>
              </div>

              {/* Artist Information */}
              <div className="text-center px-4 flex-1">
                <h3 className="font-black text-xl text-white group-hover:text-purple-400 transition-colors">
                  {artist.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {artist.specialty}
                </p>
              </div>

              {/* Sales Pill Badge */}
              <div className="mt-6">
                <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold px-4 py-1.5 rounded-full tracking-wide">
                  <FaMedal className="text-[10px]" /> {artist.sales} Sales
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}