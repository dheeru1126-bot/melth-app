import React, { useState, useEffect } from 'react';
import { Search, PlayCircle, FileText, Wind, BookOpen, ExternalLink, Globe, PhoneCall, Trash2, Video, Play, ShieldAlert, Users, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

// Authentic fallback library
const authenticResources = [
    // --- VIDEOS (10 items) ---
    { id: 1, title: '10-Minute Meditation for Stress', type: 'Video', description: 'A short, guided meditation to help you relax and relieve stress quickly.', content_url: 'https://www.youtube.com/embed/O-6f5wQXSu8' },
    { id: 2, title: 'Deep Breathing Exercises', type: 'Video', description: 'Learn the 4-7-8 breathing technique to reduce anxiety and promote sleep.', content_url: 'https://www.youtube.com/embed/tEmt1Znux58' },
    { id: 3, title: 'Yoga for Beginners - Mental Health', type: 'Video', description: 'A gentle 20-minute yoga routine focused on mental clarity and calmness.', content_url: 'https://www.youtube.com/embed/sTANio_2E0Q' },
    { id: 4, title: 'TED Talk: The Power of Vulnerability', type: 'Video', description: 'Brené Brown discusses the importance of vulnerability, courage, and authenticity.', content_url: 'https://www.youtube.com/embed/iCvmsMzlF7o' },
    { id: 5, title: 'Managing Social Anxiety', type: 'Video', description: 'Practical tips and psychological strategies to overcome social anxiety.', content_url: 'https://www.youtube.com/embed/S6k6SOtPGqA' },
    { id: 6, title: 'How to cope with anxiety', type: 'Video', description: 'Professional advice on dealing with daily anxiety triggers and managing panic attacks.', content_url: 'https://www.youtube.com/embed/WWloIAQpMcQ' },
    { id: 7, title: '5 Minute Anxiety Relief', type: 'Video', description: 'Quick grounding exercise to immediately reduce sudden anxiety spikes.', content_url: 'https://www.youtube.com/embed/inpok4MKVLM' },
    { id: 8, title: 'Overcoming Depression', type: 'Video', description: 'Understanding depression and exploring actionable steps toward recovery.', content_url: 'https://www.youtube.com/embed/z-IR48Mb3W0' },
    { id: 9, title: 'Focus & Concentration Meditation', type: 'Video', description: 'A guided meditation aimed at clearing brain fog and improving focus.', content_url: 'https://www.youtube.com/embed/ZToicYcHIOU' },

    // --- EXERCISES (Linking to in-app Exercise module) ---
    { id: 11, title: 'Grounding Technique: 5-4-3-2-1', type: 'Exercise', description: 'A cognitive behavioral therapy technique to help ground you in the present moment.', content_url: '/exercises#grounding' },
    { id: 12, title: 'Progressive Muscle Relaxation', type: 'Exercise', description: 'An exercise that reduces stress and anxiety by alternately tensing and relaxing muscles.', content_url: '/exercises#pmr' },
    { id: 13, title: 'Cognitive Restructuring Worksheet', type: 'Exercise', description: 'Identify and challenge negative automatic thoughts with this interactive worksheet.', content_url: '/exercises#thought' },
    { id: 14, title: 'Body Scan Meditation', type: 'Exercise', description: 'A mindful body scan to release physical tension and improve mind-body connection.', content_url: '/exercises#bodyscan' },
    { id: 15, title: 'Guided Visualization', type: 'Exercise', description: 'A mental escape technique to a safe, peaceful place to reduce acute stress.', content_url: '/exercises#visualization' },
    { id: 16, title: 'Daily Gratitude Journal', type: 'Exercise', description: 'Log three things you are grateful for today to build long-term positive thinking.', content_url: '/exercises#gratitude' },
    { id: 17, title: 'Box Breathing Focus', type: 'Exercise', description: 'Follow our visual breathing guide to lower your heart rate instantly.', content_url: '/exercises#breathing' },

    // --- REALISTIC PHYSICAL EXERCISES ---
    { id: 18, title: '5-Minute Desk Stretching Routine', type: 'Video', description: 'Release physical tension from sitting at a desk all day to prevent burnout.', content_url: 'https://www.youtube.com/embed/tAUf7aajBWE' },
    { id: 19, title: '15-Minute Mindful Walk', type: 'Exercise', description: 'Realistic daily exercise: Leave your phone behind and take a brisk 15-minute walk outside.', content_url: '#' },
    { id: 20, title: 'Drink a Glass of Water', type: 'Exercise', description: 'Hydration plays a crucial role in regulating mood and energy levels.', content_url: '#' },

    // --- EMERGENCY (Direct Local Calls) ---
    { id: 21, title: 'Emergency Services (Global Default)', type: 'Emergency', description: 'Dial your local emergency medical services instantly.', content_url: 'tel:112' },
    { id: 22, title: 'Suicide & Crisis Lifeline', type: 'Emergency', description: 'Free, confidential support 24/7. Tap to call directly.', content_url: 'tel:988' },
    { id: 23, title: 'NAMI HelpLine', type: 'Emergency', description: 'National Alliance on Mental Illness helpline for resources and support.', content_url: 'tel:18009506264' },
    { id: 24, title: 'Crisis Text Line', type: 'Emergency', description: 'Text HOME to connect with a crisis counselor instantly via SMS.', content_url: 'sms:741741' },

    // --- COMMUNITY (Reddit & others) ---
    { id: 25, title: 'Subreddit: r/mentalhealth', type: 'Community', description: 'A massive online community for peer support and shared mental health experiences.', content_url: 'https://www.reddit.com/r/mentalhealth/' },
    { id: 26, title: 'Subreddit: r/Anxiety', type: 'Community', description: 'A safe space to discuss anxiety disorders and panic attacks.', content_url: 'https://www.reddit.com/r/Anxiety/' },
    { id: 27, title: 'Subreddit: r/depression', type: 'Community', description: 'Peer support for anyone struggling with depressive thoughts.', content_url: 'https://www.reddit.com/r/depression/' },
    { id: 28, title: '7 Cups of Tea', type: 'Community', description: 'Free, anonymous, and confidential online text chat with trained active listeners.', content_url: 'https://www.7cups.com/' }
];

const Resources = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [resources, setResources] = useState([]);
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const navigate = useNavigate();

    const categories = ['All', 'Video', 'Exercise', 'Emergency', 'Community'];

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await api.get('/resources');
                let dbResources = [];
                if (res.data && res.data.length > 0) {
                    // Only include db resources that have a valid content_url (exclude the dummy '#' ones)
                    dbResources = res.data.filter(r => r.content_url && r.content_url !== '#');
                }
                
                // Combine the authentic fallback resources with any valid DB resources
                // We add a uniqueId to prevent React key collision if IDs overlap
                const combined = [...authenticResources, ...dbResources].map((r, index) => ({
                    ...r,
                    uniqueId: `res-${index}-${r.id}`
                }));
                setResources(combined);
            } catch {
                console.log("Using extensive community-driven resource library fallback.");
                const fallback = authenticResources.map((r, index) => ({ ...r, uniqueId: `res-${index}-${r.id}` }));
                setResources(fallback);
            }
        };
        fetchResources();
    }, []);

    const filteredResources = resources.filter(res => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = res.title.toLowerCase().includes(term) || (res.description && res.description.toLowerCase().includes(term));
        const matchesCategory = activeCategory === 'All' || (res.type && res.type.toLowerCase() === activeCategory.toLowerCase());
        return matchesSearch && matchesCategory;
    });

    const getIconStyle = (type) => {
        const typeLower = type ? type.toLowerCase() : '';
        switch (typeLower) {
            case 'emergency': return { icon: <PhoneCall className="w-6 h-6" />, color: 'bg-red-50 text-red-600 border-red-200' };
            case 'application': return { icon: <PlayCircle className="w-6 h-6" />, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' };
            case 'community': return { icon: <Globe className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
            case 'video': return { icon: <Video className="w-6 h-6" />, color: 'bg-purple-50 text-purple-600 border-purple-200' };
            default: return { icon: <FileText className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600 border-blue-200' };
        }
    };

    const handleResourceClick = (resource) => {
        if (resource.type === 'Video') return;
        
        if (resource.content_url.startsWith('/')) {
            navigate(resource.content_url);
        } else if (resource.content_url.startsWith('tel:') || resource.content_url.startsWith('sms:')) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (!isMobile) {
                const number = resource.content_url.replace('tel:', '').replace('sms:', '');
                navigator.clipboard.writeText(number);
                alert(`Direct calling is not supported on desktop computers. The number ${number} has been copied to your clipboard to dial on your mobile phone.`);
            } else {
                window.location.assign(resource.content_url);
            }
        } else {
            window.open(resource.content_url, '_blank', 'noopener,noreferrer');
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await api.delete(`/resources/${id}`);
                setResources(resources.filter(r => r.id !== id));
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#f8fafc] to-indigo-50 dark:from-[#0B1120] dark:via-slate-900 dark:to-indigo-950 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Decorative background blur elements */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob pointer-events-none"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000 pointer-events-none"></div>

                <div className="text-center mb-20 relative">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-black tracking-[0.2em] uppercase mb-4 shadow-sm border border-blue-200 dark:border-blue-800">Knowledge Base</span>
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white sm:text-6xl mb-6 transition-colors tracking-tight">Curated Resources</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed transition-colors font-medium">
                        Explore our comprehensive library of emergency contacts, guided exercises, and community support networks.
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="max-w-3xl mx-auto mb-10 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-12 pr-4 py-4 border border-slate-300 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-lg shadow-sm transition-all"
                            placeholder="Query library for specific disorders, therapies, or crisis protocols..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 ${
                                activeCategory === cat
                                    ? 'bg-[#0F172A] dark:bg-blue-600 text-white shadow-md border border-transparent'
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-sm'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredResources.map((resource) => {
                        const style = getIconStyle(resource.type);
                        return (
                            <div
                                key={resource.uniqueId}
                                onClick={() => handleResourceClick(resource)}
                                className={`bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50 dark:border-slate-700/50 overflow-hidden group flex flex-col h-full transform hover:-translate-y-2 relative ${resource.type !== 'Video' ? 'cursor-pointer' : ''}`}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-4 rounded-xl shadow-inner border ${style.color} dark:bg-opacity-20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                            {style.icon}
                                        </div>
                                        {user && user.is_admin && (
                                            <button onClick={(e) => handleDelete(resource.id, e)} className="absolute top-6 right-6 p-2 text-red-500 hover:text-white dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-600 rounded-lg transition-all duration-300 shadow-sm border border-red-100 dark:border-red-900/50">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    {!user?.is_admin && (
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${style.color} bg-opacity-50 dark:bg-opacity-20 border shadow-sm`}>
                                            {resource.type}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pr-6 leading-tight">
                                    {resource.title}
                                </h3>

                                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-8 flex-grow transition-colors font-medium">
                                    {resource.description}
                                </p>

                                {resource.type === 'Video' ? (
                                    <div className="w-full aspect-video rounded-2xl overflow-hidden mt-auto border-2 border-slate-100 dark:border-slate-800 shadow-inner group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors">
                                        <iframe width="100%" height="100%" src={resource.content_url} title={resource.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-bold mt-auto pt-5 border-t-2 border-slate-50 dark:border-slate-800/50 gap-2 transition-colors group-hover:text-indigo-700">
                                        Access Resource
                                        <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {filteredResources.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto transition-colors">
                        <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">No Matching Records Located</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Insufficient data for query "{searchTerm}" under category {activeCategory}.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                            className="text-white bg-[#0F172A] dark:bg-blue-600 font-bold px-6 py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Reset Query Parameters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Resources;
