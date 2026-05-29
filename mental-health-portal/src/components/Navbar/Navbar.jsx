import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, Menu, X, Home, BookOpen, AlertCircle, Info, LayoutDashboard, LineChart, MessageSquare, Users, BookText, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated, logout, user } = useAuth();

    const publicLinks = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Resources', path: '/resources', icon: <BookOpen size={18} /> },
        { name: 'Emergency', path: '/emergency', icon: <AlertCircle size={18} /> },
        { name: 'About', path: '/about', icon: <Info size={18} /> },
    ];

    let privateLinks = [];
    if (user && user.role === 'admin') {
        privateLinks = [
            { name: 'Admin', path: '/admin-dashboard', icon: <LayoutDashboard size={18} /> },
            { name: 'Profile', path: '/profile', icon: <UserCircle size={18} /> },
        ];
    } else if (user && user.role === 'counselor') {
        privateLinks = [
            { name: 'Dashboard', path: '/counselor-dashboard', icon: <LayoutDashboard size={18} /> },
            { name: 'Profile', path: '/profile', icon: <UserCircle size={18} /> },
        ];
    } else {
        privateLinks = [
            { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
            { name: 'Mood', path: '/mood-tracker', icon: <LineChart size={18} /> },
            { name: 'Resources', path: '/resources', icon: <BookOpen size={18} /> },
            { name: 'AI Support', path: '/ai-support', icon: <MessageSquare size={18} /> },
            { name: 'Counseling', path: '/counseling', icon: <Users size={18} /> },
            { name: 'Journal', path: '/journal', icon: <BookText size={18} /> },
            { name: 'Profile', path: '/profile', icon: <UserCircle size={18} /> },
        ];
    }

    const navLinks = isAuthenticated ? privateLinks : publicLinks;
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        // Force a clean reload and clear the history stack for security
        window.location.replace('/login');
    };

    return (
        <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <HeartPulse className="h-7 w-7 text-[#4A90E2]" />
                        <span className="text-xl font-bold text-gray-800">Melth</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2
                                    ${isActive(link.path)
                                        ? 'text-[#4A90E2] bg-blue-50'
                                        : 'text-gray-600 hover:text-[#4A90E2] hover:bg-blue-50'
                                    }`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden lg:flex items-center gap-3">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-[#4A90E2] font-medium text-sm transition-colors px-3 py-2"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-gradient-to-r from-[#4A90E2] to-indigo-500 text-white px-5 py-2 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                                >
                                    Sign up
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                {user && (
                                    <span className="text-sm text-gray-500 font-medium hidden xl:block">
                                        Hi, {user.name?.split(' ')[0]}
                                    </span>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-red-500 hover:text-red-600 font-semibold border border-red-200 hover:bg-red-50 px-4 py-2 rounded-full transition-colors"
                                >
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile/Tablet Hamburger Button */}
                    <div className="flex lg:hidden items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-md hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile / Tablet Slide-down Menu */}
            {isOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
                    <div className="px-4 pt-3 pb-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors
                                    ${isActive(link.path)
                                        ? 'bg-blue-50 text-[#4A90E2]'
                                        : 'text-gray-700 hover:text-[#4A90E2] hover:bg-blue-50'
                                    }`}
                            >
                                <span className={isActive(link.path) ? 'text-[#4A90E2]' : 'text-gray-400'}>
                                    {link.icon}
                                </span>
                                {link.name}
                            </Link>
                        ))}

                        <div className="pt-3 mt-3 border-t border-gray-100 flex flex-col gap-2">
                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block text-center text-gray-700 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setIsOpen(false)}
                                        className="block text-center bg-gradient-to-r from-[#4A90E2] to-indigo-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {user && (
                                        <p className="text-center text-sm text-gray-500 font-medium pb-1">
                                            Signed in as <span className="font-bold text-gray-700">{user.name}</span>
                                        </p>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-center text-red-500 py-3 border border-red-200 bg-red-50 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                                    >
                                        Log out
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
