import React, { useState, useEffect } from 'react';
import { Star, Calendar as CalendarIcon, MapPin, Video, ExternalLink, ShieldCheck, CheckCircle2, Bot, Sparkles, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import PremiumModal from '../../components/UI/PremiumModal';

const Counseling = () => {
    const navigate = useNavigate();
    const [counselors, setCounselors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [bookings, setBookings] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const updateBooking = (counselorId, field, value) => {
        setBookings(prev => {
            const currentCounselorBooking = prev[counselorId] || {};
            return {
                ...prev,
                [counselorId]: {
                    ...currentCounselorBooking,
                    [field]: value
                }
            };
        });
    };

    useEffect(() => {
        const fetchCounselors = async () => {
            try {
                const response = await api.get('/appointments/counselors');
                setCounselors(response.data);
            } catch (error) {
                console.error("Error fetching counselors:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCounselors();
    }, []);

    const handleBookSession = async (counselorId) => {
        const details = bookings[counselorId];
        if (!details || !details.date || !details.time) {
            alert('Missing Information: Please completely fill out BOTH the Date and Time boxes for this specific counselor before requesting a booking.');
            return;
        }

        try {
            await api.post('/appointments', {
                counselor_id: counselorId,
                date: details.date,
                time: details.time,
                notes: 'Booked via portal'
            });
            setShowSuccessModal(true);
            // Clear only this counselor's inputs
            setBookings(prev => ({
                ...prev,
                [counselorId]: { date: '', time: '' }
            }));
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Failed to book appointment.");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
            
            <PremiumModal 
                isOpen={showSuccessModal} 
                onClose={() => setShowSuccessModal(false)}
                title="Appointment Requested!"
                description="Your session has been successfully added to our clinical queue. The counselor will review and confirm your slot shortly. You will receive a notification once approved."
                icon={Sparkles}
                type="success"
            />

            <div className="max-w-7xl mx-auto">
                {/* Premium Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 mb-12 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl shadow-blue-500/20 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 opacity-20 rounded-full translate-y-1/4 -translate-x-1/4 blur-2xl"></div>
                    
                    <div className="z-10 md:w-2/3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium mb-6">
                            <ShieldCheck className="w-4 h-4" /> HIPAA Compliant Video Sessions
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">Match with your perfect therapist</h1>
                        <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mb-8">
                            Connect with verified, licensed professionals directly through Melth. Book a session seamlessly without leaving the platform.
                        </p>
                    </div>
                </div>

                {/* Counselors Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {isLoading ? (
                        <p className="text-center text-gray-500 col-span-2 py-10 font-medium">Loading available counselors...</p>
                    ) : counselors.length === 0 ? (
                        <p className="text-center text-gray-500 col-span-2 py-10 font-medium">No counselors available at the moment.</p>
                    ) : counselors.map(counselor => (
                        <div key={counselor.id} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col sm:flex-row gap-6 group">
                            
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl ${counselor.isBot ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-indigo-100 text-indigo-700'} flex items-center justify-center text-4xl font-extrabold shadow-md group-hover:scale-105 transition-transform duration-300 uppercase`}>
                                        {counselor.isBot ? <Bot className="w-16 h-16 text-white" /> : counselor.name.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-3 -right-3 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm" title="Online now"></div>
                                </div>
                                <div className="flex items-center text-sm font-bold text-gray-900 bg-amber-50 px-3 py-1.5 rounded-full mt-5 border border-amber-100">
                                    <Star className="w-4 h-4 text-amber-500 fill-current mr-1" />
                                    4.9 <span className="text-amber-700/60 font-medium ml-1">(120+)</span>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <div className="mb-3">
                                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#4A90E2] transition-colors">{counselor.name}</h3>
                                    <p className="text-md font-semibold text-indigo-500">{counselor.title || 'Therapist'}</p>
                                    <p className="text-sm font-medium text-gray-500 mt-1">Specialty: {counselor.specialty || 'General Counseling'}</p>
                                </div>

                                {!counselor.isBot ? (
                                    <div className="mt-4 text-sm text-gray-600 mb-6 flex-grow">
                                        <p className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Book a Session</p>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <input 
                                                type="date"
                                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-500 w-full"
                                                value={bookings[counselor.id]?.date || ''}
                                                onChange={(e) => updateBooking(counselor.id, 'date', e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                            <input 
                                                type="time"
                                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-500 w-full"
                                                value={bookings[counselor.id]?.time || ''}
                                                onChange={(e) => updateBooking(counselor.id, 'time', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 text-sm text-gray-600 mb-6 flex-grow flex items-center">
                                        <p className="font-medium text-indigo-600 bg-indigo-50 px-4 py-3 rounded-xl border border-indigo-100">
                                            Available immediately. No booking required. Experience empathetic, AI-driven CBT tailored to your current emotions.
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-5 border-t border-gray-100 items-center justify-between">
                                    {counselor.isBot ? (
                                        <button 
                                            onClick={() => navigate('/ai-support')}
                                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                                        >
                                            <Bot className="w-5 h-5" /> Start AI Session
                                        </button>
                                    ) : (
                                        <>
                                            <a 
                                                href={`https://meet.jit.si/MelthCounselingSession-${counselor.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all w-full sm:w-auto justify-center"
                                            >
                                                <Video className="w-4 h-4 mr-2" />
                                                Join Video
                                            </a>
                                            <button 
                                                onClick={() => handleBookSession(counselor.id)}
                                                className="w-full sm:w-auto bg-[#4A90E2] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                                            >
                                                Request Booking
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Counseling;
