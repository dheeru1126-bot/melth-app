import React from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowRight, 
    Sparkles, 
    BrainCircuit, 
    Video, 
    PhoneCall, 
    ShieldCheck, 
    BarChart3, 
    HeartHandshake
} from 'lucide-react';

const Home = () => {
    const advancedFeatures = [
        {
            title: 'Real-Time Sentiment Analytics',
            description: 'Go beyond basic mood tracking. Our AI analyzes your journal entries to detect subtle shifts in your emotional wellbeing over time.',
            icon: <BarChart3 className="h-8 w-8 text-primary-blue" />,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            link: '/mood-tracker'
        },
        {
            title: '24/7 AI Crisis Intervention',
            description: 'Immediate, compassionate AI support trained on cognitive behavioral therapy (CBT) principles to help de-escalate anxiety and panic instantly.',
            icon: <BrainCircuit className="h-8 w-8 text-indigo-500" />,
            bgColor: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            link: '/ai-support'
        },
        {
            title: 'Telepsychiatry & Therapy',
            description: 'Connect with board-certified psychiatrists and licensed therapists via secure, HIPAA-compliant video sessions.',
            icon: <Video className="h-8 w-8 text-emerald-500" />,
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            link: '/counseling'
        },
        {
            title: 'Personalized Care Pathways',
            description: 'Dynamic assessments that continuously adapt, providing curated meditations, exercises, and reading materials specifically for you.',
            icon: <Sparkles className="h-8 w-8 text-purple-500" />,
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            link: '/assessment'
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] selection:bg-blue-200">
            {/* Critical Emergency Banner */}
            <div className="bg-red-50 border-b border-red-100 py-2 px-4 text-center z-50 relative">
                <p className="text-sm text-red-700 font-medium flex items-center justify-center gap-2">
                    <PhoneCall className="w-4 h-4 animate-pulse" />
                    In Crisis? Call or Text 988 immediately for free, confidential 24/7 support.
                    <Link to="/emergency" className="underline font-bold ml-2 hover:text-red-900 transition-colors">More Resources</Link>
                </p>
            </div>

            {/* Premium Hero Section */}
            <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background ambient gradients */}
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50 z-0 animate-float-delayed"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-50 to-blue-50 rounded-full blur-3xl opacity-60 z-0 animate-float"></div>

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center relative z-10 gap-12">
                    <div className="lg:w-1/2 lg:pr-16 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm text-sm font-medium text-gray-700 mb-6 border-blue-200 text-blue-800">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            Next-Generation Mental Care
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#1e293b] tracking-tight mb-5 leading-tight">
                            Therapy, simplified. <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-indigo-500">Healing, amplified.</span>
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Experience the most comprehensive digital mental health platform. From AI-driven sentiment analysis to face-to-face telepsychiatry, Melth brings elite care directly to you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                to="/signup"
                                className="bg-gradient-to-r from-[#4A90E2] to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Start Your Journey
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/assessment"
                                className="bg-white text-gray-800 border border-gray-200 px-8 py-4 rounded-2xl text-lg font-semibold hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center"
                            >
                                Take Clinical Assessment
                            </Link>
                        </div>
                        
                        <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5"><ShieldCheck className="w-5 h-5 text-emerald-500"/> HIPAA Compliant</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                            <span className="flex items-center gap-1.5"><HeartHandshake className="w-5 h-5 text-indigo-400"/> Vetted Professionals</span>
                        </div>
                    </div>

                    <div className="lg:w-1/2 mt-10 lg:mt-0 relative">
                        {/* Glassmorphism Abstract UI Mockup */}
                        <div className="relative w-full aspect-[4/3] max-w-xl mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-white/10 backdrop-blur-xl border border-white/50 rounded-[40px] shadow-2xl overflow-hidden custom-glass">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                                
                                <div className="p-8 h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="h-3 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                                            <div className="h-6 w-48 bg-gray-800 rounded-full"></div>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                            <span className="text-white font-bold text-lg">98</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white flex items-center gap-4 transform transition-transform hover:scale-[1.02] cursor-pointer animate-float">
                                            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                                                <BarChart3 className="text-blue-600 w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-gray-900">Sentiment improved</p>
                                                <p className="text-sm text-gray-600">+15% positive markers in your journal this week.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-white flex items-center gap-4 transform transition-transform hover:scale-[1.02] cursor-pointer ml-12 animate-float-delayed">
                                            <div className="w-14 h-14 rounded-xl justify-center bg-indigo-100 flex items-center text-indigo-600">
                                                <BrainCircuit className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-gray-900">AI CBT Session</p>
                                                <p className="text-sm text-gray-600">"Let's try a grounding technique together..."</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Advanced Features Section */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-sm font-bold tracking-widest text-[#4A90E2] uppercase mb-3">Enterprise-Grade Support</h2>
                        <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">Why Melth stands apart.</h3>
                        <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                            We don't just log your moods. We use advanced analytics and secure tele-health infrastructure to provide clinical-level support.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {advancedFeatures.map((feature, index) => (
                            <Link
                                key={index}
                                to={feature.link}
                                className="group relative bg-[#f8fafc] rounded-3xl p-8 hover:bg-white transition-all duration-300 border border-gray-100 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2 overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bgColor} rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150`}></div>
                                
                                <div className={`relative w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h4 className="relative text-2xl font-bold text-gray-900 mb-4">{feature.title}</h4>
                                <p className="relative text-gray-600 text-lg mb-8 leading-relaxed">{feature.description}</p>
                                
                                <div className={`relative flex items-center font-bold ${feature.iconColor}`}>
                                    Explore Feature 
                                    <span className="ml-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:translate-x-2 transition-transform">
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-slate-900 to-[#1e293b] py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Your mind deserves the best.</h2>
                    <p className="text-blue-200 text-xl mb-12 max-w-2xl mx-auto font-light">
                        Join the next generation of mental healthcare. Secure, intelligent, and deeply compassionate.
                    </p>
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-blue-50 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                    >
                        Create Your Free Profile
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                    <p className="mt-6 text-sm text-slate-400">No credit card required for basic features. Cancel anytime.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
