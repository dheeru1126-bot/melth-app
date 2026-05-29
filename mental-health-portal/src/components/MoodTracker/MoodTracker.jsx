import React, { useState } from 'react';
import { Smile, Meh, Frown, Angry, CloudRain, CheckCircle, ShieldAlert, ArrowRight, Wind, MessageCircle, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const MoodTracker = () => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [intervention, setIntervention] = useState(null);

    const moods = [
        { id: 'happy', icon: <Smile className="h-8 w-8" />, label: 'Happy', color: 'text-green-500', bgColor: 'bg-green-50', activeColor: 'ring-green-500' },
        { id: 'neutral', icon: <Meh className="h-8 w-8" />, label: 'Neutral', color: 'text-blue-500', bgColor: 'bg-blue-50', activeColor: 'ring-blue-500' },
        { id: 'sad', icon: <Frown className="h-8 w-8" />, label: 'Sad', color: 'text-indigo-400', bgColor: 'bg-indigo-50', activeColor: 'ring-indigo-400' },
        { id: 'anxious', icon: <CloudRain className="h-8 w-8" />, label: 'Anxious', color: 'text-purple-400', bgColor: 'bg-purple-50', activeColor: 'ring-purple-400' },
        { id: 'angry', icon: <Angry className="h-8 w-8" />, label: 'Angry', color: 'text-red-500', bgColor: 'bg-red-50', activeColor: 'ring-red-500' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        setIntervention(null);

        try {
            await api.post('/mood', {
                mood: selectedMood,
                note: notes
            });

            if (selectedMood === 'sad' || selectedMood === 'anxious' || selectedMood === 'angry') {
                setIntervention(selectedMood);
            } else {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }

            setSelectedMood(null);
            setNotes('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save mood. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 overflow-hidden">
                    <div className="px-6 py-8 sm:p-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">How are you feeling today?</h1>
                        <p className="text-center text-gray-500 mb-10">Tracking your mood helps you find patterns and improve your mental wellbeing over time.</p>

                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        {success && !intervention && (
                            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                <span>Mood logged successfully! Keep up the great work.</span>
                            </div>
                        )}

                        {intervention && (
                            <div className="mb-8 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                                        <ShieldAlert className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-indigo-900">We noticed you're feeling {intervention}.</h3>
                                </div>
                                <p className="text-indigo-700 mb-6 font-medium">It's completely okay to not be okay. We have clinical tools available right now to help you process these emotions safely.</p>
                                
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/exercises" className="flex-1 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                                        <Wind className="w-5 h-5" /> Grounding Exercises
                                    </Link>
                                    <Link to="/resources" className="flex-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                                        <Video className="w-5 h-5" /> Watch Therapeutic Videos
                                    </Link>
                                    <Link to="/ai-support" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                                        <MessageCircle className="w-5 h-5" /> Chat with AI Counselor <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <button onClick={() => setIntervention(null)} className="w-full mt-4 text-center text-sm font-semibold text-indigo-400 hover:text-indigo-600">
                                    Dismiss
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-10">
                                <div className="flex justify-center gap-4 sm:gap-8 flex-wrap">
                                    {moods.map((mood) => (
                                        <button
                                            key={mood.id}
                                            type="button"
                                            onClick={() => setSelectedMood(mood.id)}
                                            className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 focus:outline-none ${selectedMood === mood.id
                                                ? `ring-4 ${mood.activeColor} shadow-md scale-110 ` + mood.bgColor
                                                : 'hover:bg-gray-50 text-gray-400 hover:scale-105 hover:text-gray-600'
                                                }`}
                                        >
                                            <div className={`${selectedMood === mood.id ? mood.color : ''}`}>
                                                {mood.icon}
                                            </div>
                                            <span className={`mt-2 text-sm font-medium ${selectedMood === mood.id ? 'text-gray-900' : 'text-gray-500'}`}>
                                                {mood.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                    Add notes (Optional)
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows={4}
                                    className="shadow-sm focus:ring-[#4A90E2] focus:border-[#4A90E2] mt-1 block w-full sm:text-sm border border-gray-300 rounded-xl p-4 bg-gray-50 bg-white resize-none"
                                    placeholder="What's making you feel this way?"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!selectedMood || isLoading}
                                    className={`inline-flex items-center px-8 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white transition-all
                                        ${selectedMood && !isLoading
                                            ? 'bg-[#4A90E2] hover:bg-blue-600 cursor-pointer shadow-blue-200'
                                            : 'bg-gray-300 cursor-not-allowed opacity-70'
                                        }
                                    `}
                                >
                                    {isLoading ? 'Saving...' : 'Save Entry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoodTracker;
