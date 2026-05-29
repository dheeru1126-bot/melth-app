import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Heart, ArrowRight, Sun, Moon, MessageCircleHeart, Sparkles, Video, ChevronRight, Shield, BookOpen, Stethoscope, Lock, BookMarked, Trash2, Calendar, Bell, Bot } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import api from '../../services/api';
import PremiumModal from '../../components/UI/PremiumModal';

const Dashboard = () => {
    const navigate = useNavigate();
    const [allMoodData, setAllMoodData] = useState([]);
    const [timeRange, setTimeRange] = useState('7d');
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [trendInsight, setTrendInsight] = useState("Log a few more moods so I can help identify patterns for you.");
    const [appointments, setAppointments] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showReminder, setShowReminder] = useState(false);

    useEffect(() => {
        // Hydrate theme from local storage
        if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const fetchMoods = async () => {
            try {
                // Check if mood is logged today
                const statusRes = await api.get('/mood/today-status');
                // Only show reminder if not logged today AND user has reminders enabled in profile
                if (!statusRes.data.logged_today && storedUser && JSON.parse(storedUser).daily_reminder_enabled !== false) {
                    setShowReminder(true);
                }

                const response = await api.get('/mood');
                const rawMoods = response.data;

                const formatted = [...rawMoods].reverse().map((entry) => {
                    let dateStr = entry.date;
                    if (dateStr && !dateStr.includes('Z') && !dateStr.includes('+')) {
                        dateStr += 'Z';
                    }
                    const dateObj = new Date(dateStr);
                    const dayString = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    const timeString = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                    const scoreMap = {
                        'happy': 90,
                        'neutral': 60,
                        'anxious': 40,
                        'sad': 30,
                        'angry': 20
                    };

                    return {
                        day: dayString,
                        fullDate: dateObj,
                        moodLabel: entry.mood,
                        score: scoreMap[entry.mood.toLowerCase()] || 50,
                        time: timeString,
                        id: entry.id
                    };
                });

                setAllMoodData(formatted);
                analyzeTrends(formatted);
                
                // Fetch appointments
                const apptsRes = await api.get('/appointments');
                setAppointments(apptsRes.data);
            } catch (error) {
                console.error("Error fetching moods:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMoods();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/appointments/${id}/status`, { status: newStatus });
            const apptsRes = await api.get('/appointments');
            setAppointments(apptsRes.data);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleClearAllMoods = async () => {
        if (!window.confirm('Are you sure you want to permanently delete all your clinical mood history? This cannot be undone.')) return;
        try {
            await api.delete('/mood/all');
            setAllMoodData([]);
            setTrendInsight("Log a few more moods so I can help identify patterns for you.");
        } catch (error) {
            console.error("Error clearing moods:", error);
        }
    };

    const analyzeTrends = (data) => {
        if (data.length < 3) return;
        const recentScores = data.slice(-4).map(d => d.score);
        const avg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
        
        if (avg > 75) {
            setTrendInsight("You've been on a mostly positive streak lately! Notice what habits are keeping your mood elevated and safely maintain them.");
        } else if (avg < 45) {
            setTrendInsight("I noticed your mood has been a bit low over the last few days. It's completely okay. Try practicing a short grounding exercise today.");
        } else {
            setTrendInsight("Your mood has been fluctuating steadily. Consider using the Thought Record exercise when you feel a dip to help stabilize it.");
        }
    };

    const filteredMoodData = React.useMemo(() => {
        if (!allMoodData || allMoodData.length === 0) return [];
        const now = new Date();
        const daysToSubtract = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 365;
        const cutoff = new Date(now.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));
        
        const filtered = allMoodData.filter(d => d.fullDate >= cutoff);
        
        // Group moods by date to determine if multiple moods exist on same day
        const moodsByDate = {};
        filtered.forEach(mood => {
            const dateKey = mood.fullDate.toLocaleDateString('en-US');
            if (!moodsByDate[dateKey]) moodsByDate[dateKey] = [];
            moodsByDate[dateKey].push(mood);
        });
        
        return filtered.map(d => {
            let dynamicLabel;
            const dateKey = d.fullDate.toLocaleDateString('en-US');
            const moodsOnSameDay = moodsByDate[dateKey].length;
            
            if (timeRange === '7d') {
                dynamicLabel = d.fullDate.toLocaleDateString('en-US', { weekday: 'short' });
                // If multiple moods on same day, append time
                if (moodsOnSameDay > 1) {
                    dynamicLabel += ` ${d.time}`;
                }
            } else if (timeRange === '30d') {
                dynamicLabel = d.fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                // If multiple moods on same day, append time
                if (moodsOnSameDay > 1) {
                    dynamicLabel += ` ${d.time}`;
                }
            } else {
                dynamicLabel = d.fullDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            }
            
            return { ...d, day: dynamicLabel };
        });
    }, [allMoodData, timeRange]);

    const currentScore = filteredMoodData.length > 0
        ? Math.round(filteredMoodData.reduce((acc, curr) => acc + curr.score, 0) / filteredMoodData.length)
        : '--';

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    return (
        <div className={`min-h-screen py-6 px-3 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#0B1120] text-slate-200' : 'bg-[#f8fafc] text-slate-800'}`}>
            
            {/* Daily Mood Reminder Modal */}
            <PremiumModal
                isOpen={showReminder}
                onClose={() => setShowReminder(false)}
                title="Daily Well-being Check"
                description={`Hi ${user?.name || 'there'}! It looks like you haven't tracked your mood yet today. Consistent tracking helps our clinical models provide better insights for you.`}
                icon={Bell}
                type="warning"
            >
                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/mood-tracker')}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center gap-2 transform active:scale-95"
                    >
                        <Sparkles className="w-4 h-4" /> Log My Mood Now
                    </button>
                    <button
                        onClick={() => setShowReminder(false)}
                        className="w-full py-3 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200 transition-colors text-sm"
                    >
                        Maybe later
                    </button>
                </div>
            </PremiumModal>

            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500 pb-4 border-b border-gray-200 dark:border-slate-800">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 uppercase tracking-widest">
                                <Lock className="w-3 h-3" /> HIPAA Compliant Portal
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-900 dark:bg-white p-2 rounded-xl">
                                <Activity className="w-6 h-6 text-white dark:text-slate-900" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight transition-colors">Standard Care Dashboard</h1>
                        </div>
                        <p className="text-[#64748B] dark:text-slate-400 mt-1.5 font-medium text-sm transition-colors">User: <span className="text-[#0F172A] dark:text-white font-bold">{user?.name || 'Guest'}</span> • Access your tracking, resources, and counseling services.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={toggleTheme} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-colors" title="Toggle Theme">
                            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <Link to="/resources" className="bg-slate-900 dark:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Go to Resource Library
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Wellness Score Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-blue-500 transition-all duration-300">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Clinical Wellness Index</h2>
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex items-baseline gap-2 relative z-10">
                            <span className="text-5xl font-black text-[#0F172A] dark:text-white tracking-tighter transition-colors">{currentScore}</span>
                            {filteredMoodData.length > 0 && <span className="text-sm font-bold text-slate-400 dark:text-slate-500">/ 100 PTS</span>}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-4">Calculated from recent cognitive check-ins</p>
                    </div>

                    {/* Daily Goal Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-amber-500 transition-all duration-300">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Daily Assessment</h2>
                                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                    <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                            <p className="text-[#0F172A] dark:text-slate-300 text-sm mt-1 leading-snug font-medium transition-colors">Track your psychological well-being to build your clinical history.</p>
                        </div>
                        <div className="mt-8 relative z-10">
                            <Link
                                to="/mood-tracker"
                                className="w-full inline-flex justify-center items-center px-4 py-3 border border-slate-200 dark:border-slate-700 text-sm font-bold rounded-xl text-[#0F172A] dark:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                            >
                                Initiate Daily Check-in
                            </Link>
                        </div>
                    </div>

                    {/* Quick Chat AI */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-indigo-500 transition-all duration-300">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Automated Support</h2>
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                    <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </div>
                            <p className="text-[#0F172A] dark:text-slate-300 text-sm mt-1 leading-snug font-medium transition-colors">Connect with our secure AI model for immediate cognitive behavioral support.</p>
                        </div>
                        <div className="mt-8 relative z-10">
                            <Link
                                to="/ai-support"
                                className="w-full inline-flex justify-center items-center px-4 py-3 text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                Open Support Terminal
                            </Link>
                        </div>
                    </div>

                    {/* Journal & Reflection */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-purple-500 transition-all duration-300">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Self-Reflection</h2>
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                            <p className="text-[#0F172A] dark:text-slate-300 text-sm mt-1 leading-snug font-medium transition-colors">Write journal entries, track emotions, and record gratitude to enhance self-awareness.</p>
                        </div>
                        <div className="mt-8 relative z-10">
                            <Link
                                to="/journal"
                                className="w-full inline-flex justify-center items-center px-4 py-3 text-sm font-bold rounded-xl text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm"
                            >
                                Open Journal
                            </Link>
                        </div>
                    </div>
                </div>

                {/* AI Insight Bar */}
                {allMoodData.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 flex items-start sm:items-center gap-4 animate-in fade-in zoom-in-95 duration-500 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-lg flex-shrink-0 mt-1 sm:mt-0 border border-blue-100 dark:border-blue-800/50">
                            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Algorithmic Insight</h3>
                            <p className="text-sm text-[#0F172A] dark:text-slate-200 leading-relaxed font-semibold transition-colors">{trendInsight}</p>
                        </div>
                    </div>
                )}

                {/* Charts and Resources */}
                <div className="gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    
                    {/* Mood Chart */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 transition-colors bg-wrap">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-[#4A90E2]" />
                                <h2 className="text-lg font-extrabold text-[#0F172A] dark:text-white transition-colors">Historical Wellness Trends</h2>
                            </div>
                            
                            {/* Professional Time Range Selector */}
                            <div className="flex items-center gap-3">
                                <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
                                    <button 
                                        onClick={() => setTimeRange('7d')}
                                        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${timeRange === '7d' ? 'bg-white dark:bg-slate-700 text-[#0F172A] dark:text-white shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'}`}
                                    >
                                        7 Days
                                    </button>
                                    <button 
                                        onClick={() => setTimeRange('30d')}
                                        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${timeRange === '30d' ? 'bg-white dark:bg-slate-700 text-[#0F172A] dark:text-white shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'}`}
                                    >
                                        30 Days
                                    </button>
                                    <button 
                                        onClick={() => setTimeRange('1y')}
                                        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${timeRange === '1y' ? 'bg-white dark:bg-slate-700 text-[#0F172A] dark:text-white shadow-sm border border-slate-200 dark:border-slate-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-400'}`}
                                    >
                                        1 Year
                                    </button>
                                </div>
                                {allMoodData.length > 0 && (
                                    <button 
                                        onClick={handleClearAllMoods}
                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800/50"
                                        title="Clear all clinical mood history"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="h-80 w-full">
                            {isLoading ? (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium text-sm">Synchronizing clinical data...</div>
                            ) : filteredMoodData.length === 0 ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl h-16 w-16 mx-auto mb-4 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                        <Activity className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="font-bold text-slate-600 dark:text-slate-300">No Assessment Data Available</p>
                                    <p className="text-sm mt-1">No tracked history found within this exact timeframe.</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={filteredMoodData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0F172A" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} domain={[0, 100]} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderRadius: '8px', border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px 16px', fontWeight: 'bold', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}
                                            formatter={(value, name, props) => [props.payload.moodLabel.charAt(0).toUpperCase() + props.payload.moodLabel.slice(1), 'Assessed State']}
                                            labelStyle={{ color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="score"
                                            stroke={isDarkMode ? '#60A5FA' : '#0F172A'}
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorScore)"
                                            activeDot={{ r: 5, strokeWidth: 0, fill: '#4A90E2' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                </div>

                {/* Patient Appointments Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 mb-8">
                    {/* Left: Appointments */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 transition-colors">
                            <div className="flex items-center gap-2">
                                <Stethoscope className="w-5 h-5 text-[#0F172A] dark:text-white" />
                                <h2 className="text-lg font-extrabold text-[#0F172A] dark:text-white transition-colors">Clinical Appointments</h2>
                            </div>
                        </div>

                        {appointments.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {appointments.map(appt => (
                                    <div key={appt.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col group hover:border-[#4A90E2] dark:hover:border-[#4A90E2] transition-colors relative">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-extrabold text-slate-900 dark:text-slate-100">{appt.counselor_name}</h3>
                                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{appt.date} • {appt.time}</p>
                                            </div>
                                            <div className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest
                                                ${appt.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50' : 
                                                  appt.status === 'accepted' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' :
                                                  'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600'}`}>
                                                {appt.status}
                                            </div>
                                        </div>
                                        
                                        {appt.status === 'accepted' && (
                                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 mt-2 flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 text-slate-600 dark:text-slate-300 text-xs font-bold rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm">
                                                    <Video className="w-3.5 h-3.5" /> Virtual Room
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => updateStatus(appt.id, 'canceled')} className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        onClick={() => navigate('/video-room', { state: { appt, role: 'user' } })}
                                                        className="bg-[#0F172A] dark:bg-blue-600 hover:bg-[#1e293b] dark:hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                                                    >
                                                        Connect Protocol <ChevronRight className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {appt.status === 'pending' && (
                                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 mt-2 flex items-center justify-end">
                                                <button onClick={() => updateStatus(appt.id, 'canceled')} className="text-xs font-semibold text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                                    Cancel Request
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">You have no active counseling sessions scheduled.</p>
                                <Link to="/counseling" className="inline-flex py-2 px-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                    Browse Specialized Counselors
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right: Quick Resources */}
                    <div className="bg-[#E8F2FC] dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-blue-100 dark:border-slate-800 flex flex-col justify-center transition-colors">
                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-blue-100 dark:border-slate-700 flex items-center justify-center mb-6">
                            <BookOpen className="w-6 h-6 text-[#4A90E2]" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-[#0F172A] dark:text-white mb-2 transition-colors">Self-Help Reference Manuals</h2>
                        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-relaxed mb-8 pr-4 transition-colors">Access our centralized, confidential library of peer-reviewed mental health guides and coping mechanisms designed specifically for stress and emotional management.</p>
                        <Link to="/resources" className="w-max bg-[#4A90E2] dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm flex items-center gap-2">
                            Open Digital Library <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
