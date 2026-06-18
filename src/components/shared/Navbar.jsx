'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaArtstation, FaUserCircle } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    
    const getDashboardLink = () => {
        if (user?.role === 'admin') return '/dashboard/admin';
        if (user?.role === 'artist') return '/dashboard/artist';
        return '/dashboard/user';
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* লোগো */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-brand-600">
                        <FaArtstation className="text-3xl" />
                        <span>Art<span className="text-gray-900">Hub</span></span>
                    </Link>

                    {/* ডেস্কটপ মেনু */}
                    <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
                        <Link href="/artworks" className="hover:text-brand-600 transition">Browse Art</Link>
                        <Link href="/artists" className="hover:text-brand-600 transition">Artists</Link>
                        <Link href="/exhibitions" className="hover:text-brand-600 transition">Exhibitions</Link>
                        
                        {user && (
                            <Link href={getDashboardLink()} className="hover:text-brand-600 transition text-brand-500 font-semibold">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* লগইন / প্রোফাইল সেকশন (Desktop) */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
                                    <FaUserCircle className="text-xl text-brand-500" />
                                    <span className="font-medium text-gray-700">{user.name}</span>
                                    <span className="bg-brand-100 text-brand-700 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">
                                        {user.role}
                                    </span>
                                </div>
                                <button 
                                    onClick={logoutUser}
                                    className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="text-gray-700 hover:text-brand-600 font-medium transition px-4 py-2">
                                    Log In
                                </Link>
                                <Link href="/register" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-xl font-semibold shadow-sm shadow-brand-500/20 transition">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* মোবাইল মেনু বাটন */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 text-2xl focus:outline-none">
                            {isOpen ? <HiX /> : <HiMenuAlt3 />}
                        </button>
                    </div>
                </div>
            </div>

            {/* মোবাইল ড্রপডাউন মেনু */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-3 font-medium text-gray-600 animate-fadeIn">
                    <Link href="/artworks" className="block py-2 hover:text-brand-600">Browse Art</Link>
                    <Link href="/artists" className="block py-2 hover:text-brand-600">Artists</Link>
                    <Link href="/exhibitions" className="block py-2 hover:text-brand-600">Exhibitions</Link>
                    
                    {user && (
                        <Link href={getDashboardLink()} className="block py-2 text-brand-500 font-semibold">
                            Dashboard ({user.role})
                        </Link>
                    )}
                    
                    <div className="border-t border-gray-100 pt-3">
                        {user ? (
                            <div className="space-y-3">
                                <div className="text-sm text-gray-500">Logged in as: <span className="font-bold text-gray-700">{user.name}</span></div>
                                <button onClick={logoutUser} className="w-full bg-red-500 text-white py-2 rounded-xl font-semibold">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link href="/login" className="w-full text-center border border-gray-200 py-2 rounded-xl">Log In</Link>
                                <Link href="/register" className="w-full text-center bg-brand-500 text-white py-2 rounded-xl">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;