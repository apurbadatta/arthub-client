import Link from 'next/link';
import { FaArtstation, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* ব্র্যান্ড ইনফো */}
                <div className="space-y-4">
                    <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-white">
                        <FaArtstation className="text-brand-500 text-3xl" />
                        <span>Art<span className="text-brand-400">Hub</span></span>
                    </Link>
                    <p className="text-sm leading-relaxed">
                        The premier online marketplace for discovering, buying, and selling premium custom artworks from global independent artists.
                    </p>
                    <div className="flex gap-4 text-xl pt-2">
                        <a href="#" className="hover:text-brand-500 transition"><FaFacebook /></a>
                        <a href="#" className="hover:text-brand-500 transition"><FaTwitter /></a>
                        <a href="#" className="hover:text-brand-500 transition"><FaInstagram /></a>
                        <a href="#" className="hover:text-brand-500 transition"><FaLinkedin /></a>
                    </div>
                </div>

                {/* কুইক লিঙ্কস */}
                <div>
                    <h3 className="text-white font-semibold mb-4 text-lg">Marketplace</h3>
                    <ul className="space-y-2.5 text-sm">
                        <li><Link href="/artworks" className="hover:text-white transition">All Paintings</Link></li>
                        <li><Link href="/artworks?category=digital" className="hover:text-white transition">Digital Art</Link></li>
                        <li><Link href="/artworks?category=sculpture" className="hover:text-white transition">Sculptures</Link></li>
                        <li><Link href="/artists" className="hover:text-white transition">Featured Artists</Link></li>
                    </ul>
                </div>

                {/* কোম্পানি */}
                <div>
                    <h3 className="text-white font-semibold mb-4 text-lg">Company</h3>
                    <ul className="space-y-2.5 text-sm">
                        <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                        <li><Link href="/exhibitions" className="hover:text-white transition">Live Exhibitions</Link></li>
                        <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition">Contact Support</Link></li>
                    </ul>
                </div>

                {/* নিউজলেটার */}
                <div>
                    <h3 className="text-white font-semibold mb-4 text-lg">Subscribe</h3>
                    <p className="text-sm mb-4">Get the latest art trends, exhibition alerts, and exclusive offers.</p>
                    <div className="flex gap-2">
                        <input 
                            type="email" 
                            placeholder="Your email" 
                            className="bg-gray-800 border border-gray-700 text-white text-sm px-4 py-2.5 rounded-xl w-full focus:outline-none focus:border-brand-500 transition"
                        />
                        <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition">
                            Join
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-800 mt-12 pt-6 text-center text-xs flex flex-col sm:flex-row justify-between gap-4">
                <p>&copy; {new Date().getFullYear()} ArtHub Inc. All rights reserved.</p>
                <div className="flex justify-center gap-6">
                    <a href="#" className="hover:text-white transition">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;