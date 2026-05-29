import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Check, X, Clock, Users, Activity, ChevronRight, Video, CalendarDays, Inbox } from 'lucide-react';
import api from '../../services/api';

const CounselorDashboard = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0 });

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data);
            
            // Compute quick stats
            const pendingCount = response.data.filter(a => a.status === 'pending').length;
            const acceptedCount = response.data.filter(a => a.status === 'accepted').length;
            
            // Fetch total platform patients
            let totalPlatformPatients = response.data.length; // fallback
            try {
                const statsResponse = await api.get('/auth/stats');
                totalPlatformPatients = statsResponse.data.total_patients;
            } catch (err) {
                console.error("Failed to fetch platform stats", err);
            }
            
            setStats({ total: totalPlatformPatients, pending: pendingCount, accepted: acceptedCount });

        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/appointments/${id}/status`, { status: newStatus });
            fetchAppointments();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const pendingAppointments = appointments.filter(a => a.status === 'pending');
    const upcomingAppointments = appointments.filter(a => a.status === 'accepted');

    return (
        <div className="min-h-screen bg-[#f1f5f9] pb-16">
            
            {/* Professional Header Area */}
            <div className="bg-slate-900 pt-10 pb-24 border-b-4 border-[#4A90E2] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Clinical Practice Dashboard</h1>
                    <p className="text-slate-300 mt-2 text-lg">Manage your user roster, pending requests, and upcoming scheduled sessions.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Registered Users</p>
                            <p className="text-4xl font-bold text-slate-800">{stats.total}</p>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                            <Users className="w-7 h-7 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-1">Action Required</p>
                            <p className="text-4xl font-bold text-slate-800">{stats.pending}</p>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                            <Inbox className="w-7 h-7 text-amber-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-1">Upcoming Sessions</p>
                            <p className="text-4xl font-bold text-slate-800">{stats.accepted}</p>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                            <CalendarDays className="w-7 h-7 text-emerald-500" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Action Required (Pending) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-amber-50/50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                                    Inbound Requests
                                </h2>
                                <span className="bg-amber-100 text-amber-700 py-0.5 px-2.5 rounded-full text-xs font-bold">{pendingAppointments.length}</span>
                            </div>
                            
                            <div className="p-4">
                                {isLoading ? (
                                    <p className="text-slate-400 text-sm text-center py-4">Loading requests...</p>
                                ) : pendingAppointments.length === 0 ? (
                                    <div className="text-center py-10 px-4">
                                        <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 font-medium text-sm">You're all caught up!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingAppointments.map(appt => (
                                            <div key={appt.id} className="border border-slate-100 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wide">User</p>
                                                        <h3 className="font-bold text-slate-900">{appt.patient_name}</h3>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-2">
                                                    <div className="flex items-center text-sm font-medium text-slate-700">
                                                        <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                                                        {appt.date}
                                                    </div>
                                                    <div className="flex items-center text-sm font-medium text-slate-700">
                                                        <Clock className="w-4 h-4 text-slate-400 mr-2" />
                                                        {appt.time}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button onClick={() => updateStatus(appt.id, 'accepted')} className="bg-slate-900 hover:bg-[#4A90E2] text-white py-2 rounded-xl flex items-center justify-center gap-1 text-sm font-bold transition-colors">
                                                        <Check className="w-4 h-4" /> Accept
                                                    </button>
                                                    <button onClick={() => updateStatus(appt.id, 'rejected')} className="bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 py-2 rounded-xl flex items-center justify-center gap-1 text-sm font-bold transition-colors">
                                                        <X className="w-4 h-4" /> Decline
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Upcoming Sessions */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-100 px-8 py-5 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <CalendarDays className="w-5 h-5 text-[#4A90E2]" />
                                    Upcoming Appointments
                                </h2>
                            </div>
                            
                            <div className="p-0">
                                {isLoading ? (
                                    <p className="text-slate-400 text-sm text-center py-10">Loading your schedule...</p>
                                ) : upcomingAppointments.length === 0 ? (
                                    <div className="text-center py-16 px-4">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Calendar className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">No upcoming sessions</h3>
                                        <p className="text-slate-500 font-medium">Your schedule is currently clear. Approved bookings will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {upcomingAppointments.map(appt => (
                                            <div key={appt.id} className="p-6 sm:px-8 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-center justify-between gap-6">
                                                <div className="flex items-center gap-5 w-full sm:w-auto">
                                                    <div className="hidden sm:flex flex-col items-center justify-center bg-blue-50 text-blue-700 w-16 h-16 rounded-2xl shrink-0">
                                                        <span className="text-xs font-bold uppercase">{new Date(appt.date).toLocaleString('default', { month: 'short' })}</span>
                                                        <span className="text-xl font-extrabold leading-none">{new Date(appt.date).getDate() || appt.date.split('-')[2]}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-slate-900 mb-1">{appt.patient_name}</h3>
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 font-medium">
                                                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> {appt.date}</span>
                                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {appt.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 mr-2 cursor-help" title="This session is configured for a secure virtual video call.">
                                                        <Video className="w-3.5 h-3.5" /> Virtual
                                                    </div>
                                                    <button onClick={() => updateStatus(appt.id, 'canceled')} className="text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors">
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        onClick={() => navigate('/video-room', { state: { appt, role: 'counselor' } })}
                                                        className="bg-slate-900 hover:bg-[#4A90E2] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center gap-1"
                                                    >
                                                        Join <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CounselorDashboard;
