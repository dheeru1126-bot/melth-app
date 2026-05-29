import React from 'react';
import { X, CheckCircle, ShieldAlert, Sparkles, Send, Lock } from 'lucide-react';

const PremiumModal = ({ isOpen, onClose, title, description, children, icon, type = 'info' }) => {
    if (!isOpen) return null;

    const Icon = icon || Sparkles;

    const typeStyles = {
        info: 'bg-blue-50 text-blue-600 border-blue-100',
        success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        warning: 'bg-amber-50 text-amber-600 border-amber-100',
        error: 'bg-red-50 text-red-600 border-red-100',
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with premium blur */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
                
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                
                <div className="relative p-8">
                    {/* Header with Icon */}
                    <div className="flex items-center justify-between mb-6">
                        <div className={`p-3 rounded-2xl border ${typeStyles[type]} shadow-sm`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                        {title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                        {description}
                    </p>

                    {/* Children for forms or extra content */}
                    {children}

                    {/* Default Close/Action button if no children */}
                    {!children && (
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-[#4A90E2] hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all transform active:scale-[0.98]"
                        >
                            Continue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PremiumModal;
