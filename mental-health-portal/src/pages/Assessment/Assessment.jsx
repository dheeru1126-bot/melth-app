import React, { useState } from 'react';
import { ClipboardList, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const questions = [
    "Over the last 2 weeks, how often have you felt little interest or pleasure in doing things?",
    "How often do you feel nervous, anxious, or on edge?",
    "How often do you experience trouble falling or staying asleep, or sleeping too much?",
    "How often do you feel tired or have little energy?",
    "How often do you have poor appetite or feel you are overeating?"
];

const options = [
    { text: "Not at all", score: 0 },
    { text: "Several days", score: 1 },
    { text: "More than half the days", score: 2 },
    { text: "Nearly every day", score: 3 }
];

const Assessment = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(Array(questions.length).fill(null));
    const [isComplete, setIsComplete] = useState(false);

    const handleOptionSelect = (score) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = score;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const calculateScore = () => {
        return answers.reduce((a, b) => a + (b || 0), 0);
    };

    const renderResult = () => {
        const score = calculateScore();
        const maxScore = questions.length * 3;
        const percentage = (score / maxScore) * 100;

        let message = "";
        let color = "";
        if (percentage < 25) {
            message = "Your overall wellbeing seems stable. Continue practicing your daily self-care routines.";
            color = "text-green-500";
        } else if (percentage < 50) {
            message = "You are experiencing some mild stress. Consider checking out our relaxation resources.";
            color = "text-yellow-500";
        } else {
            message = "You seem to be experiencing significant distress. We highly recommend connecting with a professional counselor.";
            color = "text-orange-500";
        }

        return (
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 max-w-2xl mx-auto text-center transform transition-all duration-500 scale-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete</h2>
                <p className="text-gray-500 mb-8">Thank you for sharing how you feel.</p>

                <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">General Outcome</h3>
                    <p className={`text-xl font-medium ${color}`}>{message}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/resources" className="bg-[#4A90E2] text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition shadow-md">
                        Explore Resources
                    </Link>
                    <Link to="/counseling" className="bg-white text-[#4A90E2] border-2 border-[#4A90E2] px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition">
                        Find a Therapist
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-3xl mx-auto w-full">

                {!isComplete ? (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        {/* Progress bar */}
                        <div className="bg-gray-100 h-2 w-full">
                            <div
                                className="bg-[#4A90E2] h-full transition-all duration-500 ease-out"
                                style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                            ></div>
                        </div>

                        <div className="p-8 sm:p-12">
                            <div className="flex items-center gap-3 text-[#4A90E2] mb-8 font-semibold uppercase tracking-wide text-sm">
                                <ClipboardList className="w-5 h-5" />
                                Mental Health Check-in
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 min-h-[5rem]">
                                {questions[currentQuestion]}
                            </h2>
                            <p className="text-gray-400 text-sm mb-8">Question {currentQuestion + 1} of {questions.length}</p>

                            <div className="space-y-4 mb-12">
                                {options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionSelect(option.score)}
                                        className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 ${answers[currentQuestion] === option.score
                                                ? 'border-[#4A90E2] bg-blue-50/50 shadow-sm'
                                                : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className={`text-lg font-medium ${answers[currentQuestion] === option.score ? 'text-blue-900' : 'text-gray-700'}`}>
                                            {option.text}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentQuestion === 0}
                                    className={`flex items-center font-medium ${currentQuestion === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    <ArrowLeft className="w-5 h-5 mr-1.5" /> Back
                                </button>

                                <button
                                    onClick={handleNext}
                                    disabled={answers[currentQuestion] === null}
                                    className={`flex items-center px-6 py-3 rounded-full font-bold transition-all shadow-md ${answers[currentQuestion] !== null
                                            ? 'bg-[#4A90E2] text-white hover:bg-blue-600'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed hidden'
                                        }`}
                                >
                                    {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'} <ArrowRight className="w-5 h-5 ml-1.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    renderResult()
                )}

            </div>
        </div>
    );
};

export default Assessment;
