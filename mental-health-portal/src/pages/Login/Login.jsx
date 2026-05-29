import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ShieldAlert, CheckCircle, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PremiumModal from '../../components/UI/PremiumModal';
import api from '../../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('user'); // 'user' or 'counselor'
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Forgot Password States
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isResetting, setIsResetting] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetError, setResetError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine where they came from
    let from = location.state?.from?.pathname;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const sanitizedEmail = email.trim().toLowerCase();
        const result = await login(sanitizedEmail, password, role);

        if (result.success) {
            let dest = from;

            // If they didn't come from a specific protected subpage (or came from a generic dashboard), strictly route by role.
            if (!dest || dest === '/' || dest === '/dashboard' || dest === '/counselor-dashboard' || dest === '/admin-dashboard') {
                if (result.user?.role === 'counselor') dest = '/counselor-dashboard';
                else if (result.user?.role === 'admin') dest = '/admin-dashboard';
                else dest = '/dashboard';
            }

            navigate(dest, { replace: true });
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsResetting(true);
        setResetError('');
        try {
            await api.post('/auth/reset-password', { email: forgotEmail, newPassword });
            setResetSuccess(true);
            setTimeout(() => {
                setShowForgotModal(false);
                setResetSuccess(false);
                setForgotEmail('');
                setNewPassword('');
            }, 3000);
        } catch (err) {
            setResetError(err.response?.data?.message || 'Failed to reset password. Please verify your email.');
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            
            {/* Premium Forgot Password Modal */}
            <PremiumModal
                isOpen={showForgotModal}
                onClose={() => setShowForgotModal(false)}
                title={resetSuccess ? "Password Secured" : "Account Recovery"}
                description={resetSuccess ? "Your password has been successfully updated. You can now log in with your new credentials." : "Enter your email and new password to recover access to your Melth account."}
                icon={resetSuccess ? CheckCircle : Lock}
                type={resetSuccess ? 'success' : 'info'}
            >
                {!resetSuccess && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        {resetError && (
                            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl animate-in fade-in slide-in-from-top-2">
                                {resetError}
                            </div>
                        )}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                            <input 
                                type="email"
                                required
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                                placeholder="name@email.com"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">New Secure Password</label>
                            <input 
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isResetting}
                            className="w-full py-4 bg-[#4A90E2] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                        >
                            {isResetting ? 'Processing...' : <><Send className="w-4 h-4" /> Reset Password</>}
                        </button>
                    </form>
                )}
            </PremiumModal>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Welcome back
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link to="/signup" className="font-medium text-[#4A90E2] hover:text-blue-500">
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Role Selection Tabs */}
                    <div className="flex p-1 space-x-1 bg-gray-100/50 rounded-xl mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('user')}
                            className={`w-full py-2.5 text-sm font-bold rounded-lg transition-all ${role === 'user' ? 'bg-white text-[#4A90E2] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            User
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('counselor')}
                            className={`w-full py-2.5 text-sm font-bold rounded-lg transition-all ${role === 'counselor' ? 'bg-white text-[#4A90E2] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Counselor
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('admin')}
                            className={`w-full py-2.5 text-sm font-bold rounded-lg transition-all ${role === 'admin' ? 'bg-white text-[#4A90E2] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Admin
                        </button>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="focus:ring-[#4A90E2] focus:border-[#4A90E2] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border px-3"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="focus:ring-[#4A90E2] focus:border-[#4A90E2] block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <Eye className="h-5 w-5" aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-[#4A90E2] focus:ring-[#4A90E2] border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotModal(true)}
                                    className="font-medium text-[#4A90E2] hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer"
                                >
                                    Forgot your password?
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4A90E2] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90E2] transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
