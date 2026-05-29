import React, { useState, useEffect } from 'react';
import { Wind, Heart, Brain, Anchor, Save, ArrowRight, CheckCircle2, AlertCircle, Activity, Smile, Sun } from 'lucide-react';
import api from '../../services/api';

const Exercises = () => {
    const [activeTab, setActiveTab] = useState('breathing');
    const [breatheState, setBreatheState] = useState('Inhale');
    const [gratitudeEntry, setGratitudeEntry] = useState('');
    
    // Thought Record State
    const [situation, setSituation] = useState('');
    const [automaticThought, setAutomaticThought] = useState('');
    const [alternativePerspective, setAlternativePerspective] = useState('');
    
    // UI State
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleSaveThoughtRecord = async () => {
        if (!situation.trim() || !automaticThought.trim() || !alternativePerspective.trim()) {
            setMessage({ text: 'Please fill in all fields', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            return;
        }
        setIsSaving(true);
        try {
            await api.post('/exercises/thought_record', {
                situation,
                automatic_thought: automaticThought,
                alternative_perspective: alternativePerspective
            });
            setMessage({ text: 'Thought record saved successfully!', type: 'success' });
            setSituation(''); setAutomaticThought(''); setAlternativePerspective('');
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch {
            setMessage({ text: 'Failed to save thought record. Please try again.', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveGratitude = async () => {
        if (!gratitudeEntry.trim()) {
            setMessage({ text: 'Please enter what you are grateful for', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
            return;
        }
        setIsSaving(true);
        try {
            await api.post('/exercises/gratitude', { content: gratitudeEntry });
            setMessage({ text: 'Gratitude entry saved successfully!', type: 'success' });
            setGratitudeEntry('');
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch {
            setMessage({ text: 'Failed to save entry. Please try again.', type: 'error' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    // Breathing Animation Logic
    useEffect(() => {
        if (activeTab !== 'breathing') return;

        const cycle = async () => {
            while (activeTab === 'breathing') {
                setBreatheState('Inhale');
                await new Promise(r => setTimeout(r, 4000));
                
                setBreatheState('Hold');
                await new Promise(r => setTimeout(r, 4000));
                
                setBreatheState('Exhale');
                await new Promise(r => setTimeout(r, 6000));
            }
        };
        cycle();
    }, [activeTab]);

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (['breathing', 'thought', 'grounding', 'gratitude', 'pmr', 'bodyscan', 'visualization'].includes(hash)) {
            setActiveTab(hash);
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#f4f8f7] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl font-extrabold text-[#2c3e50] tracking-tight mb-4">Guided CBT Exercises</h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">Take a moment for yourself. These clinical techniques are designed to help you ground your thoughts and manage anxiety effectively.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Tabs */}
                    <div className="lg:w-1/4 space-y-3">
                        <button 
                            onClick={() => setActiveTab('breathing')}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 shadow-sm border ${activeTab === 'breathing' ? 'bg-white border-teal-200 text-teal-700 shadow-teal-100' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/50'}`}
                        >
                            <Wind className={`w-6 h-6 ${activeTab === 'breathing' ? 'text-teal-500' : 'text-gray-400'}`} />
                            <span className="font-semibold text-lg">Breathing Focus</span>
                        </button>

                        <button 
                            onClick={() => setActiveTab('thought')}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 shadow-sm border ${activeTab === 'thought' ? 'bg-white border-blue-200 text-blue-700 shadow-blue-100' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/50'}`}
                        >
                            <Brain className={`w-6 h-6 ${activeTab === 'thought' ? 'text-blue-500' : 'text-gray-400'}`} />
                            <span className="font-semibold text-lg">Thought Record</span>
                        </button>

                        <button 
                            onClick={() => setActiveTab('grounding')}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 shadow-sm border ${activeTab === 'grounding' ? 'bg-white border-indigo-200 text-indigo-700 shadow-indigo-100' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/50'}`}
                        >
                            <Anchor className={`w-6 h-6 ${activeTab === 'grounding' ? 'text-indigo-500' : 'text-gray-400'}`} />
                            <span className="font-semibold text-lg">5-4-3-2-1 Method</span>
                        </button>

                        <button 
                            onClick={() => setActiveTab('gratitude')}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 shadow-sm border ${activeTab === 'gratitude' ? 'bg-white border-pink-200 text-pink-700 shadow-pink-100' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/50'}`}
                        >
                            <Heart className={`w-6 h-6 ${activeTab === 'gratitude' ? 'text-pink-500' : 'text-gray-400'}`} />
                            <span className="font-semibold text-lg">Gratitude Journal</span>
                        </button>

                        <button 
                            onClick={() => setActiveTab('pmr')}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 shadow-sm border ${activeTab === 'pmr' ? 'bg-white border-amber-200 text-amber-700 shadow-amber-100' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/50'}`}
                        >
                            <Activity className={`w-6 h-6 ${activeTab === 'pmr' ? 'text-amber-500' : 'text-gray-400'}`} />
                            <span className="font-semibold text-lg">Muscle Relaxation</span>
                        </button>

                        <button 
                            onClick={() => setActiveTab('bodyscan')}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 shadow-sm border ${activeTab === 'bodyscan' ? 'bg-white border-emerald-200 text-emerald-700 shadow-emerald-100' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/50'}`}
                        >
                            <Smile className={`w-6 h-6 ${activeTab === 'bodyscan' ? 'text-emerald-500' : 'text-gray-400'}`} />
                            <span className="font-semibold text-lg">Body Scan</span>
                        </button>

                        <button 
                            onClick={() => setActiveTab('visualization')}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 shadow-sm border ${activeTab === 'visualization' ? 'bg-white border-orange-200 text-orange-700 shadow-orange-100' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/50'}`}
                        >
                            <Sun className={`w-6 h-6 ${activeTab === 'visualization' ? 'text-orange-500' : 'text-gray-400'}`} />
                            <span className="font-semibold text-lg">Visualization</span>
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:w-3/4 bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl shadow-gray-200/50 border border-white min-h-[500px] flex flex-col justify-center animate-in zoom-in-95 duration-500">
                        
                        {activeTab === 'breathing' && (
                            <div className="text-center">
                                <div className="flex justify-center mb-6">
                                    <div className="p-3 bg-teal-50 rounded-2xl">
                                        <Wind className="w-10 h-10 text-teal-500" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-teal-800 mb-2">The Breath Reset</h2>
                                <p className="text-gray-500 mb-12 font-medium">Follow the rhythm. Focus only on the air entering your lungs.</p>
                                
                                <div className="relative w-64 h-64 mx-auto flex items-center justify-center mb-12">
                                    <div className="absolute inset-0 bg-teal-100 rounded-full opacity-20 animate-ping"></div>
                                    <div 
                                        className="bg-gradient-to-tr from-teal-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-extrabold text-3xl shadow-xl shadow-teal-500/40 transition-all ease-in-out"
                                        style={{ 
                                            width: breatheState === 'Inhale' ? '100%' : (breatheState === 'Exhale' ? '40%' : '100%'),
                                            height: breatheState === 'Inhale' ? '100%' : (breatheState === 'Exhale' ? '40%' : '100%'),
                                            transitionDuration: breatheState === 'Inhale' ? '4000ms' : (breatheState === 'Exhale' ? '6000ms' : '0ms')
                                        }}
                                    >
                                        <span>{breatheState}</span>
                                    </div>
                                </div>
                                <div className="bg-teal-50/50 p-4 rounded-xl inline-flex items-center gap-3 text-teal-700 font-semibold border border-teal-100">
                                    <CheckCircle2 size={18} />
                                    Reality Tip: Feel your chest expand.
                                </div>
                            </div>
                        )}

                        {activeTab === 'thought' && (
                            <div className="max-w-2xl mx-auto w-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-blue-50 rounded-2xl">
                                        <Brain className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-blue-900">Truth Check</h2>
                                        <p className="text-gray-500 font-medium">Challenge your negative bias with cold facts.</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    {message.text && (
                                        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                            {message.type === 'success' ? <CheckCircle2 /> : <AlertCircle />} {message.text}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 focus-within:border-blue-400 transition-all">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">The Event</label>
                                            <input type="text" value={situation} onChange={e => setSituation(e.target.value)} placeholder="What just happened?" className="w-full bg-transparent text-slate-900 font-semibold outline-none text-lg" />
                                        </div>
                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 focus-within:border-blue-400 transition-all">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Initial Thought</label>
                                            <input type="text" value={automaticThought} onChange={e => setAutomaticThought(e.target.value)} placeholder="What did you tell yourself?" className="w-full bg-transparent text-slate-900 font-semibold outline-none text-lg" />
                                        </div>
                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 focus-within:border-blue-400 transition-all">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Fact Check</label>
                                            <textarea rows="2" value={alternativePerspective} onChange={e => setAlternativePerspective(e.target.value)} placeholder="What is the objective reality?" className="w-full bg-transparent text-slate-900 font-semibold outline-none text-lg resize-none"></textarea>
                                        </div>
                                    </div>
                                    <button onClick={handleSaveThoughtRecord} disabled={isSaving} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-3 active:scale-[0.98]">
                                        <Save className="w-6 h-6 text-blue-400"/> {isSaving ? 'Logging Truth...' : 'Verify Reality'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'grounding' && (
                            <div className="max-w-2xl mx-auto w-full">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-indigo-50 rounded-2xl">
                                        <Anchor className="w-8 h-8 text-indigo-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-indigo-900">The 5-Step Anchor</h2>
                                        <p className="text-gray-500 font-medium">Reconnect with the physical world instantly.</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                                    {[
                                        { n: 5, t: 'See', c: 'bg-indigo-600', i: <Sun size={20}/> },
                                        { n: 4, t: 'Feel', c: 'bg-indigo-500', i: <Smile size={20}/> },
                                        { n: 3, t: 'Hear', c: 'bg-indigo-400', i: <Activity size={20}/> },
                                        { n: 2, t: 'Smell', c: 'bg-indigo-300', i: <Wind size={20}/> },
                                        { n: 1, t: 'Taste', c: 'bg-indigo-200', i: <Heart size={20}/> }
                                    ].map(item => (
                                        <div key={item.n} className="flex flex-col items-center p-4 rounded-3xl bg-indigo-50 border border-indigo-100 hover:scale-105 transition-transform cursor-default">
                                            <div className={`${item.c} text-white w-10 h-10 rounded-full flex items-center justify-center mb-3 shadow-lg`}>{item.n}</div>
                                            <span className="font-extrabold text-indigo-900">{item.t}</span>
                                            <div className="mt-2 text-indigo-400">{item.i}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 p-4 bg-slate-900 rounded-2xl text-white text-center font-bold text-sm flex items-center justify-center gap-3">
                                    <AlertCircle className="text-indigo-400" /> Focus hard on one object for each sense.
                                </div>
                            </div>
                        )}

                        {activeTab === 'gratitude' && (
                            <div className="max-w-2xl mx-auto w-full text-center">
                                <div className="p-4 bg-pink-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                    <Heart className="w-10 h-10 text-pink-500 animate-pulse" />
                                </div>
                                <h2 className="text-3xl font-bold text-pink-900 mb-2">High-Point Log</h2>
                                <p className="text-gray-500 mb-8 font-medium">Spot one good thing that happened in reality today.</p>
                                
                                <div className="relative">
                                    <textarea 
                                        value={gratitudeEntry}
                                        onChange={(e) => setGratitudeEntry(e.target.value)}
                                        rows="4" 
                                        placeholder="What's a win you can't deny?" 
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-8 text-slate-800 font-semibold focus:border-pink-300 outline-none transition-all mb-6 text-xl placeholder-slate-300"
                                    ></textarea>
                                </div>

                                <button onClick={handleSaveGratitude} disabled={isSaving} className="mx-auto bg-slate-900 hover:bg-black text-white font-bold py-5 px-16 rounded-full shadow-2xl transition-all flex justify-center items-center gap-3 active:scale-95">
                                    {isSaving ? 'Logging...' : 'Confirm Good'} <CheckCircle2 className="w-6 h-6 text-pink-400"/>
                                </button>
                            </div>
                        )}

                        {activeTab === 'pmr' && (
                            <div className="max-w-2xl mx-auto w-full">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-amber-50 rounded-2xl">
                                        <Activity className="w-8 h-8 text-amber-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-amber-900">Tension Purge</h2>
                                        <p className="text-gray-500 font-medium">Physically drain the stress from your body.</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { title: 'Hands', desc: 'Squeeze fists tight for 5s, then snap open.', icon: <CheckCircle2 size={16}/> },
                                        { title: 'Face', desc: 'Scrunch your whole face, then let go.', icon: <Smile size={16}/> },
                                        { title: 'Shoulders', desc: 'Shrug to ears, then drop heavily.', icon: <Activity size={16}/> },
                                        { title: 'Core', desc: 'Tense your abs, then exhale deep.', icon: <Wind size={16}/> }
                                    ].map((item, idx) => (
                                        <div key={idx} className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4 items-center">
                                            <div className="bg-amber-500 text-white w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold">{idx+1}</div>
                                            <div>
                                                <h4 className="font-bold text-amber-900">{item.title}</h4>
                                                <p className="text-xs text-amber-700 font-medium leading-tight">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 text-center">
                                    <div className="inline-block px-6 py-2 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Repeat 3 times for full effect
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'bodyscan' && (
                            <div className="max-w-2xl mx-auto w-full">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-emerald-50 rounded-2xl">
                                        <Smile className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-emerald-900">Physical Audit</h2>
                                        <p className="text-gray-500 font-medium">Identify where your body is hiding tension.</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="p-4 rounded-2xl bg-slate-50 border-l-4 border-emerald-400 flex items-center gap-4">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <p className="text-sm font-bold text-slate-700">Scan from toes to head. Notice only sensations.</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 border-l-4 border-emerald-400 flex items-center gap-4">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <p className="text-sm font-bold text-slate-700">Don't judge. Just acknowledge and move on.</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-emerald-900 text-white flex items-center gap-4 shadow-xl">
                                        <Sun className="text-emerald-300" />
                                        <p className="text-sm font-extrabold italic">Reality Check: Are your shoulders hunched right now?</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'visualization' && (
                            <div className="max-w-2xl mx-auto w-full text-center">
                                <div className="p-4 bg-orange-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                    <Sun className="w-10 h-10 text-orange-500" />
                                </div>
                                <h2 className="text-3xl font-bold text-orange-900 mb-2">The Safe Zone</h2>
                                <p className="text-gray-500 mb-8 font-medium">Build a mental refuge you can visit anytime.</p>
                                
                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-3xl border border-orange-100 text-left shadow-inner">
                                    <p className="text-orange-900 font-extrabold text-lg italic mb-6 leading-relaxed text-center">
                                        "Imagine a place where you are untouchable."
                                    </p>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-3 bg-white/50 rounded-2xl border border-orange-200">
                                            <Sun className="mx-auto mb-1 text-orange-400" size={20} />
                                            <span className="text-[10px] font-bold uppercase text-orange-800">Visuals</span>
                                        </div>
                                        <div className="text-center p-3 bg-white/50 rounded-2xl border border-orange-200">
                                            <Wind className="mx-auto mb-1 text-orange-400" size={20} />
                                            <span className="text-[10px] font-bold uppercase text-orange-800">Sounds</span>
                                        </div>
                                        <div className="text-center p-3 bg-white/50 rounded-2xl border border-orange-200">
                                            <Heart className="mx-auto mb-1 text-orange-400" size={20} />
                                            <span className="text-[10px] font-bold uppercase text-orange-800">Feelings</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Exercises;
