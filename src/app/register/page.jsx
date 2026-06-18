'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiEye, HiEyeOff } from 'react-icons/hi'; 

const RegisterPage = () => {
    const { registerUser, loading } = useAuth();
    const router = useRouter();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [imageUrl, setImageUrl] = useState('');
    const [role, setRole] = useState('user');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) return;

        const success = await registerUser(name, email, password, imageUrl, role);
        if (success) {
            router.push('/');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
                </div>
                
                <form className="mt-8 space-y-4" onSubmit={handleRegister}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                            type="text" required value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-500 transition text-sm"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                        <input
                            type="email" required value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-500 transition text-sm"
                            placeholder="john@example.com"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword ? "text" : "password"} 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-500 transition text-sm pr-12"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none text-xl cursor-pointer"
                            >
                                {showPassword ? <HiEyeOff /> : <HiEye />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                        <input
                            type="url" value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-500 transition text-sm"
                            placeholder="https://example.com/photo.jpg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Join As</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-500 transition text-sm bg-white"
                        >
                            <option value="user">Regular Buyer (User)</option>
                            <option value="artist">Creator/Seller (Artist)</option>
                        </select>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-semibold transition text-sm cursor-pointer disabled:bg-gray-400"
                        >
                            {loading ? 'Registering...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-500">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;