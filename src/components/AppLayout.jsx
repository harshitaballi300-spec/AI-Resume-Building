import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { calculateAtsScore } from '../utils/atsScoring';

export default function AppLayout({ children }) {
    const location = useLocation();
    const [projectStatus, setProjectStatus] = useState('In Progress');
    const [completedSteps, setCompletedSteps] = useState(0);

    useEffect(() => {
        // Calculate completed steps
        let count = 0;
        for (let i = 1; i <= 8; i++) {
            if (localStorage.getItem(`rb_step_${i}_artifact`)) {
                count++;
            }
        }
        setCompletedSteps(count);

        // Check for Shipped status requirements
        const finalSubmission = JSON.parse(localStorage.getItem('rb_final_submission') || '{}');
        const hasAllLinks = finalSubmission.lovableLink && finalSubmission.githubLink && finalSubmission.deployLink;

        // Checklist tests (from prompt)
        const resumeData = JSON.parse(localStorage.getItem('resumeBuilderData') || '{}');
        const { score } = calculateAtsScore(resumeData);
        const checklistPassed = score >= 70; // Heuristic for passing tests

        if (count === 8 && hasAllLinks && checklistPassed) {
            setProjectStatus('Shipped');
        } else {
            setProjectStatus('In Progress');
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-bg flex flex-col font-sans text-primary-text">
            {/* Top Nav */}
            <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center gap-2 flex-1">
                    <Link to="/" className="text-xl font-black tracking-tight text-gray-900">
                        AI Resume <span className="text-accent">Builder</span>
                    </Link>
                </div>

                <div className="flex-1 flex justify-center items-center">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                        Project 3 — <span className="text-gray-900">Step {completedSteps} of 8</span>
                    </p>
                </div>

                <div className="flex items-center gap-8 flex-1 justify-end">
                    <nav className="flex items-center gap-6">
                        <Link to="/builder" className={`text-xs font-bold uppercase tracking-widest transition-colors ${location.pathname === '/builder' ? 'text-accent' : 'text-gray-500 hover:text-gray-900'}`}>Builder</Link>
                        <Link to="/preview" className={`text-xs font-bold uppercase tracking-widest transition-colors ${location.pathname === '/preview' ? 'text-accent' : 'text-gray-500 hover:text-gray-900'}`}>Preview</Link>
                        <Link to="/proof" className={`text-xs font-bold uppercase tracking-widest transition-colors ${location.pathname === '/proof' ? 'text-accent' : 'text-gray-500 hover:text-gray-900'}`}>Proof</Link>
                    </nav>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${projectStatus === 'Shipped' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                        {projectStatus}
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col">
                {children}
            </main>
        </div>
    );
}
