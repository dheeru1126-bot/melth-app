import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, Paperclip, AlertTriangle, PhoneCall, ShieldCheck, Heart, Activity, BookOpen, Users } from 'lucide-react';
import api from '../../services/api';

const parseAIResponse = (text) => {
    try {
        const parsed = JSON.parse(text);
        return { isJson: true, data: parsed, rawText: text };
    } catch {
        return { isJson: false, rawText: text };
    }
};

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [input, setInput] = useState('');
    const [showDisclaimer, setShowDisclaimer] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = (behavior = 'smooth') => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
        }
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/chat/history');
                const history = response.data;

                if (history.length > 0) {
                    const parseDate = (dateStr) => {
                        if (!dateStr) return new Date();
                        if (!dateStr.includes('Z') && !dateStr.includes('+')) return new Date(dateStr + 'Z');
                        return new Date(dateStr);
                    };

                    const formattedMessages = history.flatMap(chat => [
                        {
                            id: `user-${chat.id}`,
                            type: 'user',
                            text: chat.message,
                            time: parseDate(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        },
                        {
                            id: `ai-${chat.id}`,
                            type: 'ai',
                            text: chat.response,
                            parsed: parseAIResponse(chat.response),
                            time: parseDate(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                    ]);
                    setMessages(formattedMessages);
                } else {
                    // Default CBT welcome message
                    setMessages([
                        { id: 1, type: 'ai', text: "Hi! I'm Melth, your AI companion. I'm here to listen, support you, and help you work through difficult thoughts using CBT techniques. How are you feeling today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
                setMessages([
                    { id: 1, type: 'ai', text: "Hi! I'm Melth. I'm having a little trouble loading our past chats, but I'm here for you right now. How are you feeling?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                ]);
            } finally {
                setIsLoadingInitial(false);
            }
        };

        if (!showDisclaimer) {
            fetchHistory();
        }
    }, [showDisclaimer]);

    useEffect(() => {
        // Immediate scroll for initial load
        scrollToBottom('auto');
        
        // Delayed scroll to account for content rendering/layout shifts
        const timeoutId = setTimeout(() => scrollToBottom('smooth'), 100);
        return () => clearTimeout(timeoutId);
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const currentInput = input;
        const tempUserMsgId = Date.now();

        const userMessage = {
            id: tempUserMsgId,
            type: 'user',
            text: currentInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await api.post('/chat', { message: currentInput });

            const aiResponse = {
                id: `ai-${response.data.chat_id || Date.now()}`,
                type: 'ai',
                text: response.data.reply,
                parsed: parseAIResponse(response.data.reply),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error("Failed to send message:", error);
            const errorMsg = {
                id: `error-${Date.now()}`,
                type: 'ai',
                text: "I'm sorry, I'm experiencing a technical hiccup. Please try sending your message again.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    if (showDisclaimer) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
                <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-indigo-50 p-8 flex flex-col items-center text-center border-b border-indigo-100">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                            <Bot className="w-12 h-12 text-indigo-500" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Welcome to your AI Companion</h2>
                        <p className="text-indigo-600 font-medium tracking-wide">Secure • Private • Non-Judgmental</p>
                    </div>
                    
                    <div className="p-8">
                        <div className="flex gap-4 mb-6 items-start bg-red-50 p-4 rounded-2xl border border-red-100">
                            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800 leading-relaxed">
                                <span className="font-bold">Important Safety Notice:</span> Melth is an AI, not a licensed therapist or a medical professional. If you are experiencing a crisis, having thoughts of self-harm, or feeling suicidal, please stop and contact emergency services immediately (Call/Text 988).
                            </p>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                <p className="text-sm text-gray-600">Your conversations are private and encrypted.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Heart className="w-5 h-5 text-rose-500" />
                                <p className="text-sm text-gray-600">We use CBT principles to help you manage your mood.</p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setShowDisclaimer(false)}
                            className="w-full bg-indigo-600 text-white font-bold text-lg py-4 rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
                        >
                            I Understand, Start Chatting
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col pt-6 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden h-[85vh]">

                {/* Intelligent Chat Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-50 p-2.5 rounded-full relative shadow-inner">
                            <Bot className="h-7 w-7 text-indigo-500" />
                            <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Melth Support</h2>
                            <p className="text-xs text-emerald-600 font-bold tracking-wider uppercase">Active & Listening</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => window.open('https://988lifeline.org/', '_blank')}
                            className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-100 transition-colors border border-red-100"
                        >
                            <PhoneCall className="w-3.5 h-3.5" /> 988 Crisis
                        </button>
                    </div>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-grow p-6 overflow-y-auto bg-[#fafafa] space-y-6">
                    <div className="flex justify-center mb-6">
                        <span className="bg-white border border-gray-200 text-gray-400 text-xs px-4 py-1 rounded-full shadow-sm font-medium">Session Started</span>
                    </div>

                    {isLoadingInitial ? (
                        <div className="flex justify-center items-center h-full">
                            <RefreshCw className="h-8 w-8 text-indigo-300 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                >
                                    <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mt-auto shadow-sm ${msg.type === 'user' ? 'bg-gradient-to-br from-blue-500 to-[#4A90E2]' : 'bg-gradient-to-br from-indigo-400 to-indigo-600'}`}>
                                            {msg.type === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
                                        </div>
                                        <div className={`flex flex-col gap-1 ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                            {msg.type === 'user' ? (
                                                <div className="px-5 py-4 text-[15px] leading-relaxed shadow-sm bg-[#4A90E2] text-white rounded-2xl rounded-br-sm">
                                                    {msg.text}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-3 w-full max-w-full">
                                                    {/* AI Text Reply */}
                                                    <div className="px-5 py-4 text-[15px] leading-relaxed shadow-sm bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-sm relative">
                                                        {msg.parsed?.isJson ? msg.parsed.data.reply : msg.text}
                                                        
                                                        {/* Mood Indicator (if present and not neutral) */}
                                                        {msg.parsed?.isJson && msg.parsed.data.mood && msg.parsed.data.mood !== 'neutral' && (
                                                            <div className="absolute -top-3 -right-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm capitalize flex items-center gap-1">
                                                                <Activity className="w-3 h-3" /> {msg.parsed.data.mood}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action / Exercise Card */}
                                                    {msg.parsed?.isJson && msg.parsed.data.action === 'suggest_exercise' && msg.parsed.data.exercise && (
                                                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 shadow-sm animate-in fade-in zoom-in-95 duration-500">
                                                            <h4 className="text-sm font-bold text-indigo-800 mb-2 flex items-center gap-2">
                                                                <Heart className="w-4 h-4 text-rose-500" /> Actionable Exercise
                                                            </h4>
                                                            <p className="text-sm text-indigo-900 leading-relaxed bg-white/60 p-3 rounded-xl border border-indigo-100/50">
                                                                {msg.parsed.data.exercise}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Resources Card */}
                                                    {msg.parsed?.isJson && msg.parsed.data.resources && (msg.parsed.data.resources.videos?.length > 0 || msg.parsed.data.resources.tips?.length > 0) && (
                                                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-sm animate-in fade-in zoom-in-95 duration-500">
                                                            <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                                                                <BookOpen className="w-4 h-4 text-emerald-600" /> Helpful Resources
                                                            </h4>
                                                            
                                                            {msg.parsed.data.resources.tips?.length > 0 && (
                                                                <ul className="space-y-2 mb-3">
                                                                    {msg.parsed.data.resources.tips.map((tip, idx) => (
                                                                        <li key={idx} className="text-sm text-emerald-900 flex items-start gap-2 bg-white/60 p-2 rounded-lg border border-emerald-100/50">
                                                                            <span className="text-emerald-500 font-bold mt-0.5">•</span> {tip}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                            
                                                            {msg.parsed.data.resources.videos?.length > 0 && (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {msg.parsed.data.resources.videos.map((video, idx) => (
                                                                        <a key={idx} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video)}`} target="_blank" rel="noopener noreferrer" className="text-xs bg-white text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full font-medium hover:bg-emerald-100 transition-colors flex items-center gap-1.5 shadow-sm">
                                                                            ▶ Watch: {video}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Emergency Alert Card */}
                                                    {msg.parsed?.isJson && msg.parsed.data.action === 'emergency_call' && msg.parsed.data.emergency?.length > 0 && (
                                                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 shadow-sm animate-in fade-in zoom-in-95 duration-500">
                                                            <h4 className="text-base font-extrabold text-red-700 mb-2 flex items-center gap-2">
                                                                <AlertTriangle className="w-5 h-5" /> Immediate Support Required
                                                            </h4>
                                                            <p className="text-sm text-red-800 mb-4 font-medium">Please reach out to a professional immediately. You are not alone.</p>
                                                            <div className="space-y-2">
                                                                {msg.parsed.data.emergency.map((num, idx) => (
                                                                    <a key={idx} href={`tel:${num}`} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors shadow-md shadow-red-600/20">
                                                                        <PhoneCall className="w-5 h-5" /> Call {num}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Community Prompt */}
                                                    {msg.parsed?.isJson && msg.parsed.data.community_prompt && (
                                                        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-3 shadow-sm flex items-start gap-3 animate-in fade-in zoom-in-95 duration-500 cursor-pointer hover:bg-purple-100 transition-colors">
                                                            <div className="bg-purple-200 p-2 rounded-full mt-0.5">
                                                                <Users className="w-4 h-4 text-purple-700" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-purple-800">Community Support</h4>
                                                                <p className="text-xs text-purple-900 mt-0.5 font-medium">{msg.parsed.data.community_prompt}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <span className="text-[11px] text-gray-400 px-2 font-medium">{msg.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex w-full justify-start animate-in fade-in">
                                    <div className="flex gap-3 max-w-[80%] flex-row">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mt-auto bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-sm">
                                            <Bot className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex flex-col gap-1 items-start">
                                            <div className="px-5 py-4 rounded-2xl rounded-bl-sm bg-white border border-gray-100 shadow-sm flex items-center gap-1.5 h-[52px]">
                                                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Safe & Soft Input Area */}
                <div className="p-4 sm:p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.05)]">
                    <form onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type how you're feeling..."
                            className="w-full bg-gray-50 border-2 border-transparent hover:border-gray-100 focus:border-indigo-500 focus:bg-white text-gray-900 text-[15px] rounded-full focus:ring-4 focus:ring-indigo-500/10 block pl-6 pr-16 py-4 shadow-inner transition-all duration-300 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className={`absolute right-2 p-3 rounded-full transition-all duration-300 ${input.trim() && !isTyping
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg shadow-indigo-600/30'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Send className="h-5 w-5 ml-0.5" />
                        </button>
                    </form>
                    <div className="text-center mt-4">
                        <p className="text-[11px] text-gray-400 font-medium">Melth uses AI. Information provided is not medical advice. <button className="underline hover:text-gray-600 hidden">Privacy terms</button></p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Chatbot;
