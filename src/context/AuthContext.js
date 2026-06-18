'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import Swal from 'sweetalert2';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();

    // (Local Storage Check)
    useEffect(() => {
        const storedUser = localStorage.getItem('arthub_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    
    // ১.  (Password এবং Image URL সহ)
const registerUser = async (name, email, password, imageUrl, role) => {
    setLoading(true);
    try {
        const userData = { name, email, password, imageUrl, role: role || 'user' };
        await axiosPublic.post('/api/users', userData);
        
        const currentUser = { name, email, imageUrl, role: role || 'user', subscriptionTier: 'free' };
        setUser(currentUser);
        localStorage.setItem('arthub_user', JSON.stringify(currentUser));
        
        Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: `Welcome to ArtHub as an ${role || 'user'}!`,
            showConfirmButton: false,
            timer: 2000
        });
        return true;
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.response?.data?.message || 'Something went wrong!',
        });
        return false;
    } finally {
        setLoading(false);
    }
};

// ২.  (Password ম্যাচ করার জন্য)
const loginUser = async (email, password) => {
    setLoading(true);
    try {
        // ব্যাকএন্ডে ইমেইলের পাশাপাশি পাসওয়ার্ডও পাঠাচ্ছি ভেরিফাই করার জন্য
        const res = await axiosPublic.post('/api/users/login', { email, password });
        if (res.data) {
            setUser(res.data);
            localStorage.setItem('arthub_user', JSON.stringify(res.data));
            
            Swal.fire({
                icon: 'success',
                title: 'Welcome Back!',
                showConfirmButton: false,
                timer: 1500
            });
            return true;
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.response?.data?.message || 'Invalid Email or Password!',
        });
        return false;
    } finally {
        setLoading(false);
    }
};

    // ৩. লগআউট ফাংশন
    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('arthub_user');
        Swal.fire({
            icon: 'info',
            title: 'Logged Out',
            text: 'Goodbye!',
            timer: 1500
        });
    };

    const authInfo = { user, loading, registerUser, loginUser, logoutUser };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);