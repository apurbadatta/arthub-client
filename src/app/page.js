import Link from "next/link";
import { FaCompass, FaPalette, FaArrowRight, FaGem } from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-brand-50/30 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700">
                <FaGem className="text-xs" /> Next-Gen Art Marketplace
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-none">
                Discover & Buy <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Original Artworks</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                Connect with global independent artists. Browse, collect, and sell premium custom paintings, digital masterpieces, and unique sculptures.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/artworks"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transition-all flex items-center gap-2 group"
                >
                  Explore Artworks 
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register"
                  className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-semibold px-8 py-4 rounded-2xl transition-all"
                >
                  Join as Artist
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-3xl font-bold text-gray-900">10K+</p>
                  <p className="text-sm text-gray-500 font-medium">Artworks</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">2.5K+</p>
                  <p className="text-sm text-gray-500 font-medium font-sans">Artists</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">50K+</p>
                  <p className="text-sm text-gray-500 font-medium">Collectors</p>
                </div>
              </div>
            </div>

            {/* Right Graphic/Preview */}
            <div className="relative">
              {/* Decorative background blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-brand-400/20 rounded-full blur-3xl -z-10" />
              
              <div className="relative bg-white p-4 rounded-3xl shadow-2xl border border-gray-100/50 max-w-md mx-auto transform hover:rotate-1 transition-transform duration-500">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white relative group">
                  <FaPalette className="text-6xl opacity-40 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold">
                    Featured: Horizon Symphony
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center px-1">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Ethereal Pathways</h3>
                    <p className="text-sm text-gray-500">by Elena Rostova</p>
                  </div>
                  <span className="text-brand-600 font-extrabold text-xl">$1,250</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Explore by Category</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Find the perfect art style that fits your space, taste, and style.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300 group text-center space-y-4">
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mx-auto text-2xl group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                <FaPalette />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Oil & Acrylic</h3>
              <p className="text-gray-500 text-sm">Classic handmade canvas paintings textured with rich, vibrant colors.</p>
              <Link href="/artworks?category=painting" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 pt-2">
                Browse Paintings <FaArrowRight className="text-xs" />
              </Link>
            </div>

            {/* Category 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300 group text-center space-y-4">
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mx-auto text-2xl group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                <FaCompass />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Digital Illustrations</h3>
              <p className="text-gray-500 text-sm">Modern digital art, high-resolution conceptual illustrations and concept art.</p>
              <Link href="/artworks?category=digital" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 pt-2">
                Browse Digital <FaArrowRight className="text-xs" />
              </Link>
            </div>

            {/* Category 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300 group text-center space-y-4">
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mx-auto text-2xl group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                <FaGem />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Sculptures & 3D</h3>
              <p className="text-gray-500 text-sm">Exquisite physical and 3D printed model sculptures from top artists.</p>
              <Link href="/artworks?category=sculpture" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 pt-2">
                Browse Sculptures <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}