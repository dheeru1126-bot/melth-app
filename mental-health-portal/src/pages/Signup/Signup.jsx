import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Briefcase, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState('user'); // 'user' or 'counselor'
    const [title, setTitle] = useState('');
    const [specialty, setSpecialty] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to where they came from or dashboard
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        const sanitizedEmail = email.trim().toLowerCase();
        const result = await register(name, sanitizedEmail, password, role, title, specialty);

        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md md:max-w-xl">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Join Melth today
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-[#4A90E2] hover:text-blue-500">
                        Log in instead
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md md:max-w-xl">
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
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="md:col-span-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="focus:ring-[#4A90E2] focus:border-[#4A90E2] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border px-3"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
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
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="focus:ring-[#4A90E2] focus:border-[#4A90E2] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border px-3"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {/* Password */}
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
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="focus:ring-[#4A90E2] focus:border-[#4A90E2] block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                                        placeholder="••••••••"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Conditional Counselor Fields */}
                            {role === 'counselor' && (
                                <>
                                    <div className="md:col-span-2">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                            Professional Title
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Briefcase className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="title"
                                                name="title"
                                                type="text"
                                                required
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="focus:ring-[#4A90E2] focus:border-[#4A90E2] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border px-3"
                                                placeholder="e.g. Clinical Psychologist"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                                            Primary Specialty
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="specialty"
                                                name="specialty"
                                                type="text"
                                                required
                                                value={specialty}
                                                onChange={(e) => setSpecialty(e.target.value)}
                                                className="focus:ring-[#4A90E2] focus:border-[#4A90E2] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border px-3"
                                                placeholder="e.g. Anxiety & Depression"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="focus:ring-[#4A90E2] h-4 w-4 text-[#4A90E2] border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="text-gray-500">
                                    I agree to the{' '}
                                    <a href="#" className="font-medium text-[#4A90E2] hover:text-blue-500">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="font-medium text-[#4A90E2] hover:text-blue-500">
                                        Privacy Policy
                                    </a>.
                                </label>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4A90E2] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90E2] transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
