import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Link as LinkIcon, Github, Globe, Copy, Sparkles, ShieldCheck, ArrowLeft } from 'lucide-react';

const STEPS = [
    { id: 1, label: 'Problem Statement' },
    { id: 2, label: 'Market Analysis' },
    { id: 3, label: 'System Architecture' },
    { id: 4, label: 'High Level Design' },
    { id: 5, label: 'Low Level Design' },
    { id: 6, label: 'Build Execution' },
    { id: 7, label: 'Testing & QA' },
    { id: 8, label: 'Deployment' }
];

export default function ProofPage() {
    const navigate = useNavigate();
    const [links, setLinks] = useState(() => {
        const saved = localStorage.getItem('rb_final_submission');
        return saved ? JSON.parse(saved) : { lovable: '', github: '', deploy: '' };
    });
    const [copied, setCopied] = useState(false);
    const [stepStatus, setStepStatus] = useState({});

    useEffect(() => {
        const status = {};
        STEPS.forEach(step => {
            status[step.id] = !!localStorage.getItem(`rb_step_${step.id}_artifact`);
        });
        setStepStatus(status);
        localStorage.setItem('rb_final_submission', JSON.stringify(links));
    }, [links]);

    const isValidUrl = (url) => {
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch (_) {
            return false;
        }
    };

    const allStepsDone = STEPS.every(step => stepStatus[step.id]);
    const linksValid = isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deploy);
    const isShipped = allStepsDone && linksValid;

    const copyFinalSubmission = () => {
        const text = `------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Deployed URL: ${links.deploy}

Project Status: ${isShipped ? 'SHIPPED' : 'IN PROGRESS'}
Steps Completed: ${Object.values(stepStatus).filter(Boolean).length} / 8
------------------------------------------`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-bg p-8 md:p-12">
            <div className="max-w-5xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <button
                            onClick={() => navigate('/rb/08-ship')}
                            className="text-gray-400 hover:text-gray-900 flex items-center gap-2 mb-4 text-sm font-bold transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Build
                        </button>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Proof of <span className="text-accent italic">Work</span></h1>
                        <p className="text-gray-500 mt-2 text-xl font-medium">Verify your build artifacts and finalize project submission.</p>
                    </div>
                    <div className={`px-6 py-3 rounded-full font-black text-sm flex items-center shadow-xl border transition-all ${isShipped ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full mr-3 ${isShipped ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'}`}></div>
                        STATUS: {isShipped ? 'SHIPPED' : 'IN PROGRESS'}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Step Status */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <h3 className="text-xl font-black text-gray-900">8-Step Progress</h3>
                            <div className="space-y-4">
                                {STEPS.map(step => (
                                    <div key={step.id} className="flex items-center gap-4">
                                        {stepStatus[step.id] ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-200" />
                                        )}
                                        <span className={`text-sm font-bold ${stepStatus[step.id] ? 'text-gray-900' : 'text-gray-400'}`}>
                                            Step {step.id}: {step.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Links and Submission */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-indigo-100/20 space-y-8">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-accent" />
                                <h3 className="text-2xl font-black text-gray-900">Final Artifacts</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Lovable Project Link</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={links.lovable}
                                            onChange={(e) => setLinks({ ...links, lovable: e.target.value })}
                                            placeholder="https://lovable.dev/projects/..."
                                            className="w-full bg-gray-50 border-gray-100 border focus:border-accent focus:ring-4 focus:ring-accent/5 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">GitHub Link</label>
                                    <div className="relative">
                                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={links.github}
                                            onChange={(e) => setLinks({ ...links, github: e.target.value })}
                                            placeholder="https://github.com/..."
                                            className="w-full bg-gray-50 border-gray-100 border focus:border-accent focus:ring-4 focus:ring-accent/5 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Deploy Link</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={links.deploy}
                                            onChange={(e) => setLinks({ ...links, deploy: e.target.value })}
                                            placeholder="https://..."
                                            className="w-full bg-gray-50 border-gray-100 border focus:border-accent focus:ring-4 focus:ring-accent/5 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={copyFinalSubmission}
                                disabled={!linksValid}
                                className="w-full bg-gray-900 hover:bg-black text-white py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed shadow-2xl shadow-gray-200"
                            >
                                {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                {copied ? 'COPIED FOR SUBMISSION!' : 'COPY FINAL SUBMISSION'}
                            </button>
                        </div>

                        {isShipped && (
                            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-10 text-white shadow-2xl animate-in zoom-in duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tight">Project Shipped.</h3>
                                </div>
                                <p className="text-emerald-50 text-xl font-medium leading-relaxed italic">
                                    "Architecture is about the important stuff. Whatever that is." <br />
                                    <span className="not-italic font-black mt-4 block text-white">— You've built a scalable AI system.</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
