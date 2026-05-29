import React, { useState } from 'react';
import { Phone, HeartHandshake, AlertTriangle, ShieldAlert, PhoneOff } from 'lucide-react';

const Emergency = () => {
    const [callingNumber, setCallingNumber] = useState(null);

    const handleEmergencyClick = (e, link) => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (!isMobile) {
            e.preventDefault();
            const number = link.replace('tel:', '').replace('sms:', '');
            navigator.clipboard.writeText(number);
            setCallingNumber(number);
        }
    };

    const handleDisconnect = () => {
        setCallingNumber(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            
            {/* Simulated Call Modal for Desktop */}
            {callingNumber && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-slate-900 rounded-3xl p-8 max-w-sm w-full text-center border border-slate-700 shadow-2xl flex flex-col items-center">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
                            <div className="absolute -inset-4 bg-red-500/20 rounded-full animate-pulse"></div>
                            <div className="w-24 h-24 bg-red-500 text-white rounded-full flex items-center justify-center relative z-10 shadow-xl shadow-red-500/40">
                                <Phone className="w-10 h-10 animate-bounce" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-extrabold text-white mb-2">Calling</h2>
                        <p className="text-4xl font-mono tracking-wider text-red-400 mb-2 font-black">{callingNumber}</p>
                        <p className="text-slate-400 text-sm mb-10 font-medium">Number copied to clipboard for mobile dialing.</p>
                        
                        <button 
                            onClick={handleDisconnect}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 w-full flex items-center justify-center gap-2 font-bold text-lg shadow-lg hover:shadow-red-600/50 transition-all transform hover:scale-105 active:scale-95"
                        >
                            <PhoneOff className="w-6 h-6" /> Disconnect
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <ShieldAlert className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Emergency Support</h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        If you or someone you know is in immediate danger or experiencing a mental health crisis, please reach out for immediate professional help.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-red-100 mb-8">
                    <div className="bg-red-50 p-6 sm:p-10 border-b border-red-100 text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-red-700 mb-2">Immediate Danger?</h2>
                        <p className="text-red-600 text-lg">Call your local emergency services immediately.</p>
                        <div className="mt-6">
                            <a href="tel:911" onClick={(e) => handleEmergencyClick(e, 'tel:911')} className="inline-flex items-center bg-red-600 text-white font-bold text-2xl px-12 py-4 rounded-full hover:bg-red-700 transition shadow-lg shadow-red-200">
                                <Phone className="w-6 h-6 mr-3" /> 911 (US/Canada)
                            </a>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <HeartHandshake className="w-6 h-6 text-[#4A90E2] mr-2" />
                                Crisis Hotlines
                            </h3>

                            <div className="space-y-6">
                                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                                    <h4 className="font-semibold text-gray-900 mb-2">National Suicide Prevention Lifeline</h4>
                                    <p className="text-sm text-gray-600 mb-4">Available 24/7 in English and Spanish.</p>
                                    <a href="tel:988" onClick={(e) => handleEmergencyClick(e, 'tel:988')} className="inline-block bg-[#4A90E2] text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition">
                                        Call 988
                                    </a>
                                </div>

                                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                                    <h4 className="font-semibold text-gray-900 mb-2">Crisis Text Line</h4>
                                    <p className="text-sm text-gray-600 mb-4">Text HOME to connect with a Volunteer Crisis Counselor.</p>
                                    <a href="sms:741741" onClick={(e) => handleEmergencyClick(e, 'sms:741741')} className="inline-block bg-gray-800 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-900 transition">
                                        Text 741741
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <Phone className="w-6 h-6 text-[#6FCF97] mr-2" />
                                International Support
                            </h3>

                            <div className="space-y-6">
                                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                                    <h4 className="font-semibold text-gray-900 mb-2">UK & Ireland - Samaritans</h4>
                                    <p className="text-sm text-gray-600 mb-4">Available 24 hours a day, 365 days a year.</p>
                                    <a href="tel:116123" onClick={(e) => handleEmergencyClick(e, 'tel:116123')} className="inline-block bg-[#6FCF97] text-white px-6 py-2 rounded-full font-bold hover:bg-green-600 transition">
                                        Call 116 123
                                    </a>
                                </div>

                                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                                    <h4 className="font-semibold text-gray-900 mb-2">India - Mental Health Helpline</h4>
                                    <p className="text-sm text-gray-600 mb-4">Direct call line for immediate mental health support.</p>
                                    <a href="tel:9152987821" onClick={(e) => handleEmergencyClick(e, 'tel:9152987821')} className="inline-block bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-full font-bold hover:bg-gray-50 transition">
                                        Call 9152987821
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Local Services Section */}
                    <div className="p-6 sm:p-10 bg-slate-900 text-white rounded-b-3xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <ShieldAlert className="w-6 h-6 text-red-400" />
                            Local First Responders
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <a href="tel:102" onClick={(e) => handleEmergencyClick(e, 'tel:102')} className="bg-white/10 hover:bg-white/20 border border-white/10 p-5 rounded-2xl flex flex-col items-center gap-3 transition-all group">
                                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <AlertTriangle className="w-6 h-6 text-white" />
                                </div>
                                <span className="font-bold text-lg">Ambulance (102)</span>
                            </a>
                            <a href="tel:100" onClick={(e) => handleEmergencyClick(e, 'tel:100')} className="bg-white/10 hover:bg-white/20 border border-white/10 p-5 rounded-2xl flex flex-col items-center gap-3 transition-all group">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <ShieldAlert className="w-6 h-6 text-white" />
                                </div>
                                <span className="font-bold text-lg">Police (100)</span>
                            </a>
                            <a href="tel:101" onClick={(e) => handleEmergencyClick(e, 'tel:101')} className="bg-white/10 hover:bg-white/20 border border-white/10 p-5 rounded-2xl flex flex-col items-center gap-3 transition-all group">
                                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <span className="font-bold text-lg">Fire Dept (101)</span>
                            </a>
                        </div>
                        <p className="mt-6 text-center text-slate-400 text-sm italic">
                            * Clicking these will trigger a direct call protocol on your device.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Emergency;
