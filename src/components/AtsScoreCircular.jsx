import React from 'react';
import { calculateAtsScore } from '../utils/atsScoring';

const getScoreColor = (score) => {
    if (score <= 40) return '#EF4444'; // Red "Needs Work"
    if (score <= 70) return '#F59E0B'; // Amber "Getting There"
    return '#10B981'; // Green "Strong Resume"
};

const getScoreLabel = (score) => {
    if (score <= 40) return 'Needs Work';
    if (score <= 70) return 'Getting There';
    return 'Strong Resume';
};

export default function AtsScoreCircular({ resumeData }) {
    const { score, improvements } = calculateAtsScore(resumeData);
    const color = getScoreColor(score);
    const label = getScoreLabel(score);

    // SVG parameters
    const size = 120;
    const strokeWidth = 10;
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print-hidden mb-8 w-full max-w-[850px] mx-auto flex flex-col md:flex-row gap-8 items-center md:items-start start-anim">
            {/* Circular Progress */}
            <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-[120px] h-[120px]">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        {/* Background circle */}
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke="#f3f4f6"
                            strokeWidth={strokeWidth}
                        />
                        {/* Progress circle */}
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="transparent"
                            stroke={color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black tracking-tighter" style={{ color }}>
                            {score}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                            / 100
                        </span>
                    </div>
                </div>
                <span className="mt-4 font-bold text-sm" style={{ color }}>{label}</span>
            </div>

            {/* Improvements */}
            <div className="flex-1 w-full">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">ATS Analysis</h3>
                {improvements.length > 0 ? (
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Improvement Suggestions</p>
                        <ul className="space-y-2">
                            {improvements.map((sug, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: color }}></div>
                                    <span>{sug}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p className="text-sm font-bold">Excellent work! Your resume passes all our primary ATS heuristics.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
