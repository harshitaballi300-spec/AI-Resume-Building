import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, ShieldCheck, CheckCircle2, Circle } from 'lucide-react';

const STEPS = [
    { id: 1, label: 'Problem Statement', path: '/rb/01-problem' },
    { id: 2, label: 'Market Analysis', path: '/rb/02-market' },
    { id: 3, label: 'System Architecture', path: '/rb/03-architecture' },
    { id: 4, label: 'High Level Design', path: '/rb/04-hld' },
    { id: 5, label: 'Low Level Design', path: '/rb/05-lld' },
    { id: 6, label: 'Build Execution', path: '/rb/06-build' },
    { id: 7, label: 'Testing & QA', path: '/rb/07-test' },
    { id: 8, label: 'Deployment', path: '/rb/08-ship' }
];

export default function Layout({ children, currentStep, title, description }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isArtifactUploaded = (stepId) => {
        return !!localStorage.getItem(`rb_step_${stepId}_artifact`);
    };

    const handleNext = () => {
        if (currentStep < 8) {
            navigate(STEPS[currentStep].path);
        } else {
            navigate('/rb/proof');
        }
    };

    const nextDisabled = !isArtifactUploaded(currentStep);

    return (
        <div className="flex flex-col h-screen bg-bg overflow-hidden">
            {/* Top Bar */}
            <header className="top-bar bg-white">
                <div className="flex items-center gap-4">
                    <span className="text-lg font-black tracking-tight text-gray-900">AI Resume <span className="text-accent text-xl mt-1">Builder</span></span>
                </div>

                <div className="text-sm font-bold text-gray-500 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
                    Project 3 — <span className="text-gray-900">Step {currentStep} of 8</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Active Build</span>
                </div>
            </header>

            {/* Context Header */}
            <div className="context-header bg-white">
                <h1 className="text-3xl font-black text-gray-900 mb-1">{title}</h1>
                <p className="text-gray-500 font-medium italic">{description}</p>
            </div>

            {/* Main Area */}
            <main className="flex-1 overflow-hidden main-content">
                {children}
            </main>

            {/* Proof Footer */}
            <footer className="proof-footer bg-white border-t border-gray-200">
                <div className="flex items-center gap-8">
                    {STEPS.map((step) => {
                        const isCompleted = isArtifactUploaded(step.id);
                        const isCurrent = currentStep === step.id;
                        return (
                            <div key={step.id} className={`flex items-center gap-2 transition-all ${isCurrent ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                                {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    <Circle className="w-4 h-4 text-gray-300" />
                                )}
                                <span className={`text-[10px] font-bold uppercase tracking-tighter ${isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={handleNext}
                    disabled={nextDisabled}
                    className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold transition-all hover:bg-black disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-gray-200"
                >
                    {currentStep === 8 ? 'Finalize Proof' : 'Next Step'}
                    <ChevronRight className="w-4 h-4" />
                </button>
            </footer>
        </div>
    );
}
