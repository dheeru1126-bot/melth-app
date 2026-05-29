import React, { useState, useEffect } from 'react';
import { ShieldCheck, Calendar, Users, Activity, Lock, Database } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ appointments: 0, counselors: 0 });
    const [appointments, setAppointments] = useState([]);
    const [users, setUsers] = useState([]);
    const isDarkMode = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    useEffect(() => {
        // Hydrate theme checking
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        const fetchAdminData = async () => {
            try {
                const appRes = await api.get('/appointments');
                const counRes = await api.get('/appointments/counselors');
                const userRes = await api.get('/auth/users');
                setAppointments(appRes.data);
                setUsers(userRes.data);
                setStats({ appointments: appRes.data.length, counselors: counRes.data.length });
            } catch (error) {
                console.error("Admin fetch error:", error);
            }
        };
        fetchAdminData();
    }, [isDarkMode]);

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/appointments/${id}/status`, { status: newStatus });
            const appRes = await api.get('/appointments');
            setAppointments(appRes.data);
        } catch (error) {
            console.error("Admin update status error:", error);
        }
    };

    return (
        <div className={`min-h-screen py-8 px-3 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#0B1120] text-slate-200' : 'bg-[#f8fafc] text-slate-800'}`}>
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 pb-4 border-b border-gray-200 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 uppercase tracking-widest">
                                <Lock className="w-3 h-3 text-red-500" /> Level 5 Clearance
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-3 transition-colors">
                            <ShieldCheck className="w-8 h-8 text-red-600 dark:text-red-500" /> System Command Center
                        </h1>
                        <p className="text-[#64748B] dark:text-slate-400 mt-1.5 font-medium text-sm transition-colors">
                            Global platform monitoring and confidential infrastructure oversight.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4 relative overflow-hidden group hover:border-[#4A90E2] transition-colors">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50"><Users className="w-6 h-6 text-blue-600 dark:text-blue-400" /></div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active Counselors</p>
                            <p className="text-3xl font-black text-[#0F172A] dark:text-white mt-1">{stats.counselors}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4 relative overflow-hidden group hover:border-emerald-500 transition-colors">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/50"><Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /></div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Global Appointments</p>
                            <p className="text-3xl font-black text-[#0F172A] dark:text-white mt-1">{stats.appointments}</p>
                        </div>
                    </div>
                    <div className="bg-[#0F172A] dark:bg-[#1E293B] p-6 rounded-xl shadow-sm border border-slate-800 dark:border-slate-700 flex flex-col justify-center relative overflow-hidden group transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                            <Database className="w-4 h-4 text-slate-400" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Status</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text-white font-extrabold tracking-wide">Infrastructure Nominal</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 transition-colors">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#0F172A] dark:text-white" />
                            <h2 className="text-lg font-extrabold text-[#0F172A] dark:text-white">Confidential Scheduling Ledger</h2>
                        </div>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded border border-slate-200 dark:border-slate-700">Encrypted</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                                    <th className="py-4 px-4 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">User UID</th>
                                    <th className="py-4 px-4 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Assigned Counselor</th>
                                    <th className="py-4 px-4 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Timestamp</th>
                                    <th className="py-4 px-4 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Routing Status</th>
                                    <th className="py-4 px-4 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {appointments.map(appt => (
                                    <tr key={appt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100">{appt.patient_name}</td>
                                        <td className="py-4 px-4 font-medium text-slate-700 dark:text-slate-300">{appt.counselor_name}</td>
                                        <td className="py-4 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{appt.date} <span className="text-slate-400 dark:text-slate-500 mx-1">•</span> {appt.time}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest
                                                ${appt.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50' : 
                                                  appt.status === 'accepted' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' :
                                                  'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'}`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            {appt.status !== 'canceled' && (
                                                <button onClick={() => updateStatus(appt.id, 'canceled')} className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-2.5 py-1.5 rounded transition-colors">
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {appointments.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No active scheduling records found in the database.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Counselors Registry Section */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 transition-colors mt-8">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            <h2 className="text-lg font-extrabold text-[#0F172A] dark:text-white">Professional Registry (Counselors)</h2>
                        </div>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded border border-slate-200 dark:border-slate-700">Verified</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                                    <th className="py-4 px-4 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">ID</th>
                                    <th className="py-4 px-4 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Counselor Name</th>
                                    <th className="py-4 px-4 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Email</th>
                                    <th className="py-4 px-4 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Title/Spec</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {users.filter(u => u.role === 'counselor').map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100">#{u.id}</td>
                                        <td className="py-4 px-4 font-medium text-slate-700 dark:text-slate-300">{u.name}</td>
                                        <td className="py-4 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{u.email}</td>
                                        <td className="py-4 px-4">
                                            <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
                                                {u.title || 'Counselor'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.filter(u => u.role === 'counselor').length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No counselors registered in the platform.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Users Registry Section */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 transition-colors mt-8">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-lg font-extrabold text-[#0F172A] dark:text-white">User Registry</h2>
                        </div>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded border border-slate-200 dark:border-slate-700">Protected</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                                    <th className="py-4 px-4 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">ID</th>
                                    <th className="py-4 px-4 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">User Name</th>
                                    <th className="py-4 px-4 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Email</th>
                                    <th className="py-4 px-4 font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-xs">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {users.filter(u => u.role === 'user').map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100">#{u.id}</td>
                                        <td className="py-4 px-4 font-medium text-slate-700 dark:text-slate-300">{u.name}</td>
                                        <td className="py-4 px-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{u.email}</td>
                                        <td className="py-4 px-4">
                                            <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.filter(u => u.role === 'user').length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No users registered in the platform.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
