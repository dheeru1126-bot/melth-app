import React from 'react';
import { Shield, Brain, Activity, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-6">
                        Understanding <span className="text-[#4A90E2]">Melth</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        We are dedicated to providing an accessible, private, and secure platform to help you track your mental wellness and get support when you need it.
                    </p>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 text-[#4A90E2] rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                            <Activity className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Track Your Mood</h3>
                        <p className="text-gray-600 border border-gray-100 bg-gray-50 rounded-xl p-4 h-full">
                            Log your daily emotions to identify patterns over time. Understanding your feelings is the first step towards managing them.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 text-[#6FCF97] rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                            <Brain className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">AI Support</h3>
                        <p className="text-gray-600 border border-gray-100 bg-gray-50 rounded-xl p-4 h-full">
                            Chat anonymously with our intelligent, compassionate AI agent whenever you need someone to listen.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 text-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                            <Heart className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Self-Help Resources</h3>
                        <p className="text-gray-600 border border-gray-100 bg-gray-50 rounded-xl p-4 h-full">
                            Access curated articles, meditation guides, and breathing exercises tailored to your current stress and anxiety levels.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Complete Privacy</h3>
                        <p className="text-gray-600 border border-gray-100 bg-gray-50 rounded-xl p-4 h-full">
                            Your mental health data is sensitive. We use industry-standard encryption, and you control your information at all times.
                        </p>
                    </div>
                </div>
            </section>

            {/* Privacy Guarantee */}
            <section className="bg-[#4A90E2] py-20 px-4 sm:px-6 lg:px-8 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <Shield className="w-16 h-16 mx-auto mb-6 text-blue-200" />
                    <h2 className="text-3xl font-bold mb-6">Our Privacy Assurance</h2>
                    <p className="text-xl text-blue-100 mb-8">
                        We are committed to the highest standards of confidentiality. Your chat history, mood logs, and assessment results are stored securely and never sold to third parties.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/signup" className="bg-white text-[#4A90E2] font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition shadow-lg">
                            Create a Secure Account
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
