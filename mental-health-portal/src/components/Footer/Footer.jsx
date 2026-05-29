import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 mt-auto pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <HeartPulse className="h-6 w-6 text-[#4A90E2]" />
                            <span className="text-xl font-bold text-white">Melth</span>
                        </Link>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            Your safe space for mental wellness. Track your mood, chat with our AI, and find the resources you need to thrive.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#4A90E2] hover:text-white transition-colors">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#4A90E2] hover:text-white transition-colors">
                                <span className="sr-only">GitHub</span>
                                <Github className="h-4 w-4" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#4A90E2] hover:text-white transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">Platform</h3>
                        <ul className="space-y-3 flex flex-col">
                            <Link to="/dashboard" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Dashboard</Link>
                            <Link to="/mood-tracker" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Mood Tracker</Link>
                            <Link to="/ai-support" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">AI Support</Link>
                            <Link to="/assessment" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Assessment</Link>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">Resources</h3>
                        <ul className="space-y-3 flex flex-col">
                            <Link to="/resources" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Articles</Link>
                            <Link to="/counseling" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Professional Counseling</Link>
                            <li className="text-sm text-slate-400 hover:text-blue-400 cursor-pointer transition-colors">Emergency Contacts</li>
                            <li className="text-sm text-slate-400 hover:text-blue-400 cursor-pointer transition-colors">Community Guidelines</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">Legal</h3>
                        <ul className="space-y-3 flex flex-col">
                            <li className="text-sm text-slate-400 hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</li>
                            <li className="text-sm text-slate-400 hover:text-blue-400 cursor-pointer transition-colors">Terms of Service</li>
                            <li className="text-sm text-slate-400 hover:text-blue-400 cursor-pointer transition-colors">Cookie Policy</li>
                            <li className="text-sm text-slate-400 hover:text-blue-400 cursor-pointer transition-colors">Contact Us</li>
                        </ul>
                    </div>
                </div>
                
                {/* Emergency Banner at bottom */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <HeartPulse className="w-4 h-4 text-red-500 animate-pulse" />
                    </div>
                    <p className="text-sm text-red-400 font-medium">
                        If you are in an emergency, please call your local emergency services immediately.
                    </p>
                </div>

                <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-slate-500">
                        &copy; {new Date().getFullYear()} Melth Mental Health Portal. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
